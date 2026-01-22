export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-slate-700 dark:text-slate-200">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          Last updated: January 2026
        </p>

        {/* CONTENT */}
        <section className="mt-16 space-y-12 leading-relaxed">
          <p className="text-slate-700 dark:text-slate-300">
            At{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              NeoQuiz
            </span>
            , we respect your privacy and are committed to protecting your
            personal information. This Privacy Policy explains what data we
            collect, how we use it, and the choices you have when using our
            platform.
          </p>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              I. Information We Collect
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                <span className="font-medium text-slate-900 dark:text-white">
                  Account information
                </span>{" "}
                such as your name, email address, and profile image provided by
                supported sign-in providers.
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white">
                  Quiz-related data
                </span>{" "}
                including quizzes you generate, attempts, scores, and learning
                history.
              </li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white">
                  Technical data
                </span>{" "}
                such as browser type, device information, and basic usage
                analytics to improve platform reliability.
              </li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              II. How We Use Your Information
            </h2>
            <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>To provide and improve the NeoQuiz experience.</li>
              <li>To generate quizzes and track learning progress.</li>
              <li>To maintain platform security and prevent misuse.</li>
            </ol>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              III. Data Storage & Security
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              Your data is stored using industry-standard security practices. We
              take reasonable measures to protect your information from
              unauthorized access, alteration, or disclosure. However, no
              system can be guaranteed to be completely secure.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              IV. Third-Party Services
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              NeoQuiz relies on trusted third-party services for authentication,
              hosting, and infrastructure. These services process only the
              minimum data required to perform their intended function.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              V. Your Choices
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>You may stop using NeoQuiz at any time.</li>
              <li>
                You may request clarification regarding how your data is used.
              </li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              VI. Changes to This Policy
            </h2>
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated revision date.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}