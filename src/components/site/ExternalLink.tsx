import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
  href: string;
  children: ReactNode;
  /** Short, human label used for aria-label & title (e.g. "Google ad settings"). */
  label: string;
  /** Hide the visible ↗ glyph (sr-only text + aria-label remain). */
  hideIndicator?: boolean;
};

/**
 * Accessible external link.
 * Always renders: aria-label, title tooltip, sr-only "(opens in a new tab)",
 * and a visible ↗ new-tab indicator. Use for every off-site <a>.
 */
export function ExternalLink({
  href,
  children,
  label,
  hideIndicator = false,
  className,
  ...rest
}: Props) {
  const announce = `${label} (opens in a new tab)`;
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={announce}
      aria-label={announce}
      className={`inline-flex items-center gap-1 ${className ?? ""}`}
    >
      {children}
      {!hideIndicator && (
        <span aria-hidden="true" className="text-[0.85em] opacity-80">↗</span>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
