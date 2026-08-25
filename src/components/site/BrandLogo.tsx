type Props = {
  className?: string;
  /** Use "dark" on light backgrounds (black "Calc"), "light" on dark backgrounds (white "Calc"). */
  variant?: "dark" | "light";
};

/**
 * CalcHub wordmark — "Calc" in plain text + "Hub" inside a rounded primary box.
 * Inspired by classic two-tone wordmarks. Pure CSS/SVG (no image asset).
 */
export function BrandLogo({ className, variant = "dark" }: Props) {
  const calcColor = variant === "light" ? "text-surface-foreground" : "text-foreground";
  return (
    <span
      className={`inline-flex items-center font-display font-extrabold leading-none tracking-tight text-2xl ${className ?? ""}`}
    >
      <span className={calcColor}>Calc</span>
      <span className="ml-1 inline-flex items-center rounded-lg bg-primary px-2 py-1 text-primary-foreground">
        Hub
      </span>
    </span>
  );
}
