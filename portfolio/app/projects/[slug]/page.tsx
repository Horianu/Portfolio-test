import Link from "next/link";
import { getProject, projects } from "@/lib/projects";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProject(params.slug);

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Project not found.</p>
          <Link href="/projects" className="mt-4 inline-block underline">
            Back to projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/projects" className="text-sm underline">
          ← Back to projects
        </Link>

        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          {project.year} · {project.role}
        </p>

        <p className="mt-6 text-base text-gray-100/90">
          {project.description}
        </p>
      </div>
    </main>
  );
}
