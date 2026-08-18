import { Button } from "@/components/opencode/button";
import { Field, Input } from "@/components/opencode/input";

import { SignUpTerms } from "./SignUpTerms";

export function SignUpForm() {
  return (
    <form className="flex flex-col gap-[16px]">
      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          type="text"
          placeholder="ada_lovelace"
          autoComplete="username"
        />
      </Field>
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          placeholder="8+ characters"
          autoComplete="new-password"
        />
      </Field>
      <SignUpTerms />
      <Button variant="primary" type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
