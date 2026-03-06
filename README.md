# NeoQuiz

**AI-powered quiz generator** that creates quizzes from prompts or PDF study material using **Google Gemini**.

NeoQuiz allows users to generate multiple-choice quizzes instantly using AI, attempt them with a timer, review explanations, and track past performance through a persistent quiz history.

### Live Demo
https://neoquiz-one.vercel.app

## Demo

## About The Project

NeoQuiz was built as a full-stack project to explore how generative AI can assist learning workflows.

The application allows users to generate quizzes either from a **text prompt** or from **uploaded PDF study material**. The generated quiz can then be attempted interactively, and results are stored so users can review their progress later.

The project focuses on:
	•	AI-assisted content generation
	•	secure authentication
	•	persistent quiz history
	•	clean UI/UX for quiz attempts
	•	safe server-side API design

## Screenshots

## Quiz Generation

## Quiz Attempt

## Quiz Results

## Quiz History

## Features
	• Generate quizzes using **AI**
	•	Create quizzes from text prompts
	•	Create quizzes from PDF study material
	•	Automatic quiz title generation
	•	Interactive quiz attempt interface
	•	Answer explanations for learning
	•	Quiz history tracking
	•	Google authentication
	•	Persistent storage using PostgreSQL
	•	Secure API routes
  
## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

## Architecture Overview

```
User
  ↓
Next.js Frontend (React UI)
  ↓
API Routes
  ↓
Google Gemini API (Quiz Generation)
  ↓
PostgreSQL Database (Prisma ORM)
```

## Project Structure

src/

app/ → pages and routing
api/ → backend API routes
components/ → UI components
lib/ → authentication, prisma client, helpers

prisma/

schema.prisma → database models


## Getting Started

Clone the repository
git clone https://github.com/Ashwinr03/neoquiz.git

Install dependencies
npm install

Create environment variables
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=

Run the development server
npm run dev

Open
http://localhost:3000

## Future Improvements

Possible improvements for the project include
	•	difficulty levels for quizzes
	•	quiz sharing links
	•	leaderboard system
	•	improved PDF parsing
	•	analytics dashboard for quiz performance





