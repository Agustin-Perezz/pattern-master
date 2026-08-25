import {
  getUser,
  getUserInitials,
} from "@/lib/shared/infrastructure/auth.server";

import { ProblemTopNavActions } from "./ProblemTopNavActions";

export async function ProblemUserNav() {
  const user = await getUser();
  const topNavUser = user
    ? { email: user.email, name: user.name, initials: getUserInitials(user) }
    : null;

  return <ProblemTopNavActions user={topNavUser} />;
}
