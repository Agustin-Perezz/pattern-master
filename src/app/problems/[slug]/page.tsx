import { notFound } from "next/navigation";

import { CodeEditor } from "../components/CodeEditor";
import { ProblemLeftPane } from "../components/ProblemLeftPane";
import { ProblemTopNav } from "../components/ProblemTopNav";
import { getChallengeBySlug, getChallengeSlugs } from "./actions";

export async function generateStaticParams() {
  const slugs = await getChallengeSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <ProblemTopNav subtitle={result.challenge.challenge} />
      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ProblemLeftPane problem={result.challenge} />
        <CodeEditor problem={result.challenge} />
      </main>
    </div>
  );
}
