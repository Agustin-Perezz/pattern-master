import { ProblemBrowser } from "./components/ProblemBrowser";
import { ProblemTopNav } from "./components/ProblemTopNav";

export default function ProblemsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav />
      <main className="flex-1">
        <ProblemBrowser />
      </main>
    </div>
  );
}
