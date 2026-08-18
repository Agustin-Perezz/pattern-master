import { getChallenges } from "./problems/actions";
import { ProblemBrowser } from "./problems/components/ProblemBrowser";
import { ProblemTopNav } from "./problems/components/ProblemTopNav";

export default async function HomePage() {
  const challenges = await getChallenges();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav />
      <main className="flex-1">
        <ProblemBrowser initialChallenges={challenges} />
      </main>
    </div>
  );
}
