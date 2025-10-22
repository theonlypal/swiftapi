import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-neutral-900">SwiftAPI</div>
          <div className="flex gap-6 items-center">
            <Link href="/pricing" className="text-neutral-600 hover:text-neutral-900">
              Pricing
            </Link>
            <Link
              href="/m"
              className="bg-neutral-900 text-white px-5 py-2 rounded hover:bg-neutral-800"
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-6xl font-bold mb-6 text-neutral-900 leading-tight">
            Automate senior-level dev tasks from your phone.
          </h1>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Type a command. We parse, execute, commit, and deploy.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/m"
              className="bg-neutral-900 text-white px-8 py-4 rounded text-lg font-medium hover:bg-neutral-800"
            >
              Try Free
            </Link>
            <Link
              href="/pricing"
              className="bg-white text-neutral-900 px-8 py-4 rounded text-lg font-medium border border-neutral-300 hover:border-neutral-400"
            >
              Pricing
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 justify-center text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
              <span>Production deploys</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
              <span>Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
              <span>Repo PR/commit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></span>
              <span>Live logs</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
