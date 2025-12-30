import { ReactNode } from "react";

import { siteConfig } from "./config/site";
import { cn } from "@/lib/utils";

import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  className?: string;
}

export default function FooterSection({
  logo = '/logo-img/logotipo.png',
  columns = [
    {
      title: "Repositório",
      links: [
        { text: "GitHub", href: siteConfig.links.github },
      ],
    },
    {
      title: "Contato",
      links: [
        { text: "Linkedin", href: siteConfig.links.linkedin },
        { text: "Instagram", href: siteConfig.links.instagram },
      ],
    },
  ],
  copyright = "© 2025 Kayke da Penha. Todos os direitos reservados.",
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent className="flex justify-between">
            <div>
                <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
                    <div className="w-40">
                        <img src={logo}  alt="Logotipo - Vai Rolar" />
                    </div>
                </FooterColumn>
            </div>
            <div className="w-96 grid grid-cols-2">
                {columns.map((column, index) => (
                <FooterColumn key={index}>
                    <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                    {column.links.map((link, linkIndex) => (
                    <a
                        key={linkIndex}
                        href={link.href}
                        target="blank"
                        className="text-muted-foreground text-sm"
                    >
                        {link.text}
                    </a>
                    ))}
                </FooterColumn>
                ))}
            </div>
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
