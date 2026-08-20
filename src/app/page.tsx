import {
  getUser,
  getUserInitials,
} from "@/lib/shared/infrastructure/auth.server";
import { getChallenges } from "./problems/actions";
import { ProblemBrowser } from "./problems/components/ProblemBrowser";
import { ProblemTopNav } from "./problems/components/ProblemTopNav";

export default async function HomePage() {
  const [challenges, user] = await Promise.all([getChallenges(), getUser()]);

  const topNavUser = user
    ? { email: user.email, name: user.name, initials: getUserInitials(user) }
    : null;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav user={topNavUser} />
      <main className="flex-1">
        <ProblemBrowser initialChallenges={challenges} />
      </main>
    </div>
  );
}
