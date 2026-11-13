import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Brand } from "./Shared";
const columns = [
  {
    title: "PRODUCT",
    links: [
      ["Features", "#features"],
      ["How it works", "#workflow"],
      ["Pricing", "#pricing"],
      ["FAQ", "#faq"],
    ],
  },
  {
    title: "EXPLORE",
    links: [
      ["Try the demo", "#live-demo"],
      ["Live on Toothly", "https://toothly-ai.vercel.app"],
      ["Documentation", "https://github.com/YashChauhan245/EchoDesk#readme"],
    ],
  },
  {
    title: "YOUR WORKSPACE",
    links: [
      ["Log in", "/login"],
      ["Start free", "/login"],
      ["Dashboard", "/dashboard"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-container">
        <div className="mk-footer-main">
          <div className="mk-footer-brand">
            <Brand />
            <p>
              Your knowledge.
              <br /> A helping hand, always.
            </p>
            <a
              href="https://github.com/YashChauhan245/EchoDesk"
              target="_blank"
              rel="noopener noreferrer"
              className="mk-github-link"
              aria-label="EchoDesk on GitHub (opens in a new tab)"
            >
              <Image
                src="/marketing/github.svg"
                width={16}
                height={16}
                alt=""
              />
              <ArrowUpRight size={12} />
            </a>
          </div>
          {columns.map((column) => (
            <nav aria-label={column.title.toLowerCase()} key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      {...(href.startsWith("https:")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {label}
                      {href.startsWith("https:") && (
                        <ArrowUpRight size={10} aria-hidden="true" />
                      )}
                      {href.startsWith("https:") && (
                        <span className="sr-only"> (opens in a new tab)</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mk-footer-bottom">
          <span>© {new Date().getFullYear()} EchoDesk</span>
          <span>
            Made with <span className="mk-heart">♥</span> for the people behind
            the questions.
          </span>
          <div>
            <span>A brighter view?</span>
            <ThemeToggle />
          </div>
        </div>
        <div className="mk-footer-wordmark" aria-hidden="true">
          good answers. always.
        </div>
      </div>
    </footer>
  );
}
