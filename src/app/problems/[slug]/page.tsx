import { notFound } from "next/navigation";

import { getProblem, PROBLEMS } from "@/lib/mock/problems";

import { CodeEditor } from "../components/CodeEditor";
import { ProblemLeftPane } from "../components/ProblemLeftPane";
import { ProblemTopNav } from "../components/ProblemTopNav";

export function generateStaticParams() {
  return PROBLEMS.map((problem) => ({ slug: problem.slug }));
}

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblem(slug);

  if (!problem) {
    notFound();
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <ProblemTopNav subtitle={problem.challenge} />
      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ProblemLeftPane problem={problem} />
        <CodeEditor problem={problem} />
      </main>
    </div>
  );
}
