import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Invoice Tracker
        </h1>

        <p className="mt-2 text-muted-foreground">
          Invoice and expense management for your business.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-md border px-4 py-2"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}