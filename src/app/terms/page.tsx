export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-slate-700 dark:text-slate-200">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          Last updated: January 2026
        </p>

        {/* CONTENT */}
        <section className="mt-16 space-y-12 leading-relaxed">
          <p className="text-slate-700 dark:text-slate-300">
            These Terms of Service govern your access to and use of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              NeoQuiz
            </span>
            . By using our platform, you agree to these terms.
          </p>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              I. Use of the Platform
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              NeoQuiz is provided to help users generate and interact with
              educational quizzes. You agree to use the platform only for lawful
              purposes and in a manner that does not disrupt or harm others.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              II. User Accounts
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must provide accurate information when signing in.</li>
              <li>You are responsible for activity that occurs under your account.</li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              III. Content and Usage
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              Quizzes and content generated using NeoQuiz are provided for
              learning and informational purposes. We do not guarantee accuracy
              or suitability for any specific use.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              IV. Availability
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              We may modify, suspend, or discontinue any part of the platform at
              any time without prior notice.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              V. Limitation of Liability
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              NeoQuiz is provided on an “as-is” basis. To the extent permitted by
              law, we are not liable for any indirect or consequential damages
              arising from your use of the platform.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              VI. Changes to These Terms
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              We may update these Terms from time to time. Continued use of
              NeoQuiz after changes means you accept the updated Terms.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}