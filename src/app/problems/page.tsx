import { getChallenges } from "./actions";
import { ProblemBrowser } from "./components/ProblemBrowser";
import { ProblemTopNav } from "./components/ProblemTopNav";

export default async function ProblemsPage() {
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
