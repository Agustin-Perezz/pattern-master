import Link from "next/link";
import { requireUser } from "@/lib/shared/infrastructure/auth.server";
import { SignOutButton } from "./components/SignOutButton";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-[24px] bg-canvas p-[16px] font-mono">
      <Link
        href="/"
        className="flex items-center justify-center gap-[8px] font-mono text-[18px] font-bold text-ink"
      >
        <span className="text-mute">[</span>
        PatternMaster
        <span className="text-mute">]</span>
      </Link>

      <div className="text-center">
        <h1 className="text-[22px] font-bold text-ink">Dashboard</h1>
        <p className="mt-[8px] text-[14px] text-mute">
          Signed in as {user.email}
        </p>
        <div className="mt-[24px]">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
