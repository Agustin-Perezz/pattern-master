import { notFound } from "next/navigation";

import { CodeEditor } from "../components/CodeEditor";
import { ProblemLeftPane } from "../components/ProblemLeftPane";
import { ProblemTopNav } from "../components/ProblemTopNav";
import { getChallengeBySlug } from "./actions";

export const dynamicParams = true;

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const result = await getChallengeBySlug(slug);

  if (!result.found) {
    notFound();
  }

  const challenge = result.challenge;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <ProblemTopNav subtitle={challenge.challenge} />
      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ProblemLeftPane problem={challenge} />
        <CodeEditor problem={challenge} />
      </main>
    </div>
  );
}
