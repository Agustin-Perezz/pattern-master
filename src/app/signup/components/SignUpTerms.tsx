export function SignUpTerms() {
  return (
    <label className="flex items-start gap-[8px] font-mono text-[14px] text-mute">
      <input
        type="checkbox"
        className="mt-[3px] size-[16px] accent-[var(--color-accent)]"
      />
      <span>
        I agree to the{" "}
        <a href="/terms" className="text-accent hover:text-accent-hover">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-accent hover:text-accent-hover">
          Privacy Policy
        </a>
        .
      </span>
    </label>
  );
}
