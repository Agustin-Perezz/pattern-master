import { ProblemBrowser } from "@/app/problems/components/ProblemBrowser";
import { getChallenges } from "@/app/problems/queries";

export default async function HomePage() {
  const challenges = await getChallenges();

  return (
    <main className="flex-1">
      <ProblemBrowser initialChallenges={challenges} />
    </main>
  );
}
