type Props = { label?: string; className?: string; minHeight?: number };

/**
 * Reserved ad placement. Pre-allocates vertical space to prevent CLS
 * when an AdSense unit hydrates into it later.
 */
export function AdSlot({ label = "Advertisement", className = "", minHeight = 100 }: Props) {
  return (
    <div
      role="complementary"
      aria-label={label}
      style={{ minHeight }}
      className={`my-8 flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground ${className}`}
    >
      {label}
    </div>
  );
}
