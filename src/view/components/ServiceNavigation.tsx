import { FileText, KeyRound } from "lucide-react";

const services = [
  {
    href: "https://passgen.rexsoftproduction.com/",
    label: "Password Generator",
    icon: KeyRound,
    current: true,
  },
  {
    href: "https://markdown-convertor.rexsoftproduction.com/",
    label: "Markdown to HTML",
    icon: FileText,
    current: false,
  },
] as const;

export function ServiceNavigation() {
  return (
    <header className="h-16 border-b bg-background/85 backdrop-blur">
      <nav aria-label="RexSoft services" className="mx-auto flex h-full w-full max-w-5xl items-center px-4 sm:px-6">
        <ul className="grid w-full grid-cols-2 gap-2 sm:ml-auto sm:w-auto">
          {services.map(({ href, label, icon: Icon, current }) => (
            <li key={href}>
              <a
                href={href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm sm:px-4 sm:text-sm"
                    : "flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-sm"
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
