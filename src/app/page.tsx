import { Suspense } from "react";

import {
  getUser,
  getUserInitials,
} from "@/lib/shared/infrastructure/auth.server";
import { ProblemBrowser } from "./problems/components/ProblemBrowser";
import { ProblemTopNav } from "./problems/components/ProblemTopNav";
import { ProblemTopNavActions } from "./problems/components/ProblemTopNavActions";
import { getChallenges } from "./problems/queries";

export default async function HomePage() {
  const challenges = await getChallenges();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav>
        <Suspense fallback={<ProblemTopNavActions user={null} />}>
          <UserNavSection />
        </Suspense>
      </ProblemTopNav>
      <main className="flex-1">
        <ProblemBrowser initialChallenges={challenges} />
      </main>
    </div>
  );
}

async function UserNavSection() {
  const user = await getUser();
  const topNavUser = user
    ? { email: user.email, name: user.name, initials: getUserInitials(user) }
    : null;

  return <ProblemTopNavActions user={topNavUser} />;
}
