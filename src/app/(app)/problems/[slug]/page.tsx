import { notFound } from "next/navigation";
import { ProblemWorkspace } from "@/app/problems/components/ProblemWorkspace";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";

import { getChallengeBySlug } from "./queries";

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const [, result] = await Promise.all([
    requireUser(),
    getChallengeBySlug(slug),
  ]);

  if (!result.found) {
    notFound();
  }

  return (
    <main className="flex h-[calc(100dvh-56px)] flex-col overflow-hidden md:flex-row">
      <ProblemWorkspace problem={result.challenge} />
    </main>
  );
}
