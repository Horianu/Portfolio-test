import Link from "next/link";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Projects</h1>
          <Link href="/" className="text-sm underline">
            ← Back home
          </Link>
        </header>

        <p className="mt-3 text-sm md:text-base text-gray-200/80">
          A selection of work across web, crypto, and product experiments.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <h2 className="text-xl font-semibold group-hover:underline">
                {project.title}
              </h2>
              <p className="mt-1 text-sm text-gray-200/80">
                {project.tagline}
              </p>
              <p className="mt-3 text-xs text-gray-400">
                {project.year} · {project.role}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
