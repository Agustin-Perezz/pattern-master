import { Suspense } from "react";

import { ProblemTopNav } from "@/app/problems/components/ProblemTopNav";
import { ProblemTopNavActions } from "@/app/problems/components/ProblemTopNavActions";
import { ProblemUserNav } from "@/app/problems/components/ProblemUserNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ProblemTopNav>
        <Suspense fallback={<ProblemTopNavActions user={null} />}>
          <ProblemUserNav />
        </Suspense>
      </ProblemTopNav>
      {children}
    </div>
  );
}
