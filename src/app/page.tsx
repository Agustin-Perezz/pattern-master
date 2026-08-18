import { ProblemBrowser } from "./problems/components/ProblemBrowser";
import { ProblemTopNav } from "./problems/components/ProblemTopNav";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav />
      <main className="flex-1">
        <ProblemBrowser />
      </main>
    </div>
  );
}
