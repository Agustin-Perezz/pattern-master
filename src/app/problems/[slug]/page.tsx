import { notFound } from "next/navigation";

import {
  getUserInitials,
  requireUser,
} from "@/lib/shared/infrastructure/auth.server";

import { ProblemTopNav } from "../components/ProblemTopNav";
import { ProblemWorkspace } from "../components/ProblemWorkspace";
import { getChallengeBySlug } from "./actions";

export const dynamicParams = true;

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const result = await getChallengeBySlug(slug);

  if (!result.found) {
    notFound();
  }

  const challenge = result.challenge;
  const topNavUser = {
    email: user.email,
    name: user.name,
    initials: getUserInitials(user),
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <ProblemTopNav subtitle={challenge.challenge} user={topNavUser} />
      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <ProblemWorkspace problem={challenge} />
      </main>
    </div>
  );
}
