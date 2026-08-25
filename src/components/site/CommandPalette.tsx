import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, calculators, blogPosts } from "@/lib/calculators";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && (e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA/)) return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("calchub:open-search", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("calchub:open-search", onOpenRequest);
    };
  }, []);

  function go(path: string) {
    setOpen(false);
    navigate({ to: path });
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
    >
      <DialogTitle className="sr-only">Search calculators</DialogTitle>
      <CommandInput placeholder="Search calculators, tools and guides…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {CATEGORIES.map((cat) => {
          const items = calculators.filter((c) => c.category === cat.name);
          if (!items.length) return null;
          return (
            <CommandGroup key={cat.name} heading={`${cat.emoji} ${cat.name}`}>
              {items.map((c) => (
                <CommandItem key={c.slug} value={`${c.title} ${c.keywords.join(" ")}`} onSelect={() => go(c.path)}>
                  <span aria-hidden className="text-base">{c.emoji}</span>
                  <span>{c.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.short}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
        <CommandGroup heading="📝 Blog">
          {blogPosts.map((p) => (
            <CommandItem key={p.slug} value={p.title} onSelect={() => go(`/blog/${p.slug}`)}>
              <FileText className="h-4 w-4" />
              <span>{p.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="🔍 More">
          <CommandItem value="all calculators sitemap" onSelect={() => go("/sitemap")}>
            <Search className="h-4 w-4" />
            <span>Browse all calculators</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
