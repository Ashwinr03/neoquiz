export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>© 2026 NeoQuiz. All rights reserved.</span>

        <div className="flex gap-4">
          <a
            href="/privacy"
            className="hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}