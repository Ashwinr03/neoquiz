import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const MAX_PDF_TEXT_CHARS = 15_000;
const MAX_QUESTIONS = 15;

/* =========================================================
   SYSTEM RULES — QUIZ GENERATION (UNCHANGED, STRICT)
========================================================= */
const QUIZ_SYSTEM_RULES = `
You are an educational quiz generator.

STRICT RULES:
- Output ONLY valid JSON
- No markdown, no backticks, no comments
- No extra text
- No personal data
- No harmful, sexual, political, or extremist content
- No system information
- No secrets, keys, or environment data
- MUST be parseable by JSON.parse()

FORMAT:
{
  "questions": [
    {
      "id": number,
      "question": string,
      "options": string[4],
      "correctAnswer": number (0-3),
      "explanation": string
    }
  ]
}
`;

/* =========================================================
   SYSTEM RULES — TITLE GENERATION (HARDENED)
========================================================= */
const TITLE_SYSTEM_RULES = `
You generate a concise academic-style quiz title.

STRICT RULES:
- REMOVE instructional words (create, generate, make, help, quiz, questions)
- REMOVE filler phrases (about, on, related to, based on)
- USE ONLY subject-matter nouns from the context
- DO NOT include verbs
- DO NOT include full sentences
- DO NOT include the word "Quiz"
- DO NOT invent new topics
- Max 5 words
- Title Case
- Output ONLY plain text
`;

/* =========================================================
   TITLE HELPERS
========================================================= */
function titleCase(text: string) {
  return text.replace(/\w\S*/g, (w) =>
    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

/**
 * Pre-cleans context BEFORE sending to AI
 * Guarantees banned words never reach the model
 */
function cleanTitleContext(text: string) {
  return text
    .replace(
      /\b(create|generate|make|build|design|help|quiz|questions?)\b/gi,
      ""
    )
    .replace(
      /\b(about|on|related to|based on|regarding|with focus on)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   SAFE JSON EXTRACTION
========================================================= */
function extractJson(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return null;
  return text.slice(firstBrace, lastBrace + 1);
}

export async function POST(req: Request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing API key" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const mode = formData.get("mode") as "pdf" | "prompt";
    const prompt = (formData.get("prompt") as string) || "";
    const focusPrompt = (formData.get("focusPrompt") as string) || "";
    const questionsCount = Number(formData.get("questionsCount"));
    const files = formData.getAll("files") as File[];

    if (!questionsCount || questionsCount < 1 || questionsCount > MAX_QUESTIONS) {
      return NextResponse.json(
        { error: "Questions must be between 1 and 15" },
        { status: 400 }
      );
    }

    // ✅ FIX: NO FILE COUNT LIMIT — ONLY REQUIRE AT LEAST ONE PDF
    if (mode === "pdf" && files.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least one PDF" },
        { status: 400 }
      );
    }

    let extractedPdfText = "";

    if (mode === "pdf") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");

      for (const file of files) {
        if (file.type !== "application/pdf") continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = await pdfParse(buffer);

        if (parsed?.text) extractedPdfText += parsed.text + "\n";

        if (extractedPdfText.length >= MAX_PDF_TEXT_CHARS) {
          extractedPdfText = extractedPdfText.slice(0, MAX_PDF_TEXT_CHARS);
          break;
        }
      }

      if (!extractedPdfText.trim()) {
        return NextResponse.json(
          { error: "Unable to extract text from PDF(s)" },
          { status: 400 }
        );
      }
    }

    const userIntent =
      mode === "prompt"
        ? `
Generate ${questionsCount} quiz questions from this topic:

"${prompt}"

Each question MUST include a 2–3 line explanation.
`
        : `
Generate ${questionsCount} quiz questions from the study material below.

${extractedPdfText}

Focus (optional):
${focusPrompt || "No specific focus"}

Each question MUST include a 2–3 line explanation.
`;

    const quizPrompt = `${QUIZ_SYSTEM_RULES}\n${userIntent}`;

    const genAI = new GoogleGenerativeAI(API_KEY);

    const modelsRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const modelsJson = await modelsRes.json();

    const modelName =
      modelsJson.models?.find((m: any) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )?.name;

    if (!modelName) {
      return NextResponse.json(
        { error: "No supported Gemini model available" },
        { status: 500 }
      );
    }

    const quizModel = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: QUIZ_SYSTEM_RULES,
    });

    const quizResult = await quizModel.generateContent(quizPrompt);
    const rawText = quizResult.response.text();

    const jsonBlock = extractJson(
      rawText.replace(/```json/gi, "").replace(/```/g, "").trim()
    );

    if (!jsonBlock) {
      console.error("❌ No JSON block:", rawText);
      return NextResponse.json(
        { error: "AI returned malformed JSON" },
        { status: 500 }
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonBlock);
    } catch {
      console.error("❌ JSON parse failed:", jsonBlock);
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { error: "Malformed quiz data" },
        { status: 500 }
      );
    }

    /* ---------------- AI TITLE (HARDENED) ---------------- */
    let aiTitle: string | null = null;

    try {
      const rawContext =
        mode === "prompt"
          ? prompt
          : files.map((f) => f.name.replace(/\.pdf$/i, "")).join(", ");

      const titleContext = cleanTitleContext(rawContext);

      if (titleContext.length > 5) {
        const titleModel = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: TITLE_SYSTEM_RULES,
        });

        const titleResult = await titleModel.generateContent(
          `Generate title from:\n"${titleContext}"`
        );

        aiTitle = titleCase(
          titleResult.response.text().replace(/[\r\n]+/g, " ").trim()
        );
      }
    } catch {
      aiTitle = null;
    }

    return NextResponse.json({
      ...parsed,
      aiTitle,
    });
  } catch (err) {
    console.error("🔥 QUIZ API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}