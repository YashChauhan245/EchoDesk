# EchoDesk marketing redesign

The public homepage is a dark-first, responsive product story with a complete light theme. The demo workspace, chat, inbox, and exports use explicitly labeled sample content. Pricing mirrors the real dashboard plans; the Toothly case study comes from the repository README.

## Dependencies added

- `motion` (`^14.14.0`): scroll progress, parallax, setup transitions, and inbox perspective.
- `lenis` (`^1.3.27`): smooth scrolling and anchor navigation, mounted only on the marketing route and disabled for reduced motion.

Playwright, axe, and Lighthouse were used as temporary workspace QA tools; they are not project dependencies. GSAP and 3D libraries were not added.

## Files created

All components live in `src/components/marketing/`:

- `Navbar.tsx`: floating navigation, active anchors, native modal mobile menu.
- `Hero.tsx`: headline, illustrative workspace, streaming sample chat with source chips.
- `TrustStrip.tsx`: real technology marks and a pausable marquee.
- `HowItWorks.tsx`: pinned three-step setup; stacked previews on mobile and with reduced motion.
- `RagPipeline.tsx`: five-step knowledge-to-answer explanation.
- `FeatureBento.tsx`: nine capabilities, pointer spotlight, and miniature product previews.
- `EmbedDemo.tsx`: type-on script, working clipboard control, interactive installation preview.
- `InboxShowcase.tsx`: selectable sample conversations and valid CSV, JSON, and PDF downloads.
- `CaseStudy.tsx`: documented Toothly use cases and a link to its real website.
- `Pricing.tsx`: Free / Starter / Pro monthly prices and limits; links to existing flows.
- `Faq.tsx`: eight questions with keyboard-accessible accordion controls.
- `FinalCta.tsx`: closing call to action and decorative aurora.
- `Footer.tsx`: real navigation, GitHub link, and synchronized theme control.
- `Shared.tsx`: brand, actions, section headings, progressive reveals, and marketing motion lifecycle.
- `README.md`: this implementation and validation record.

Assets in `public/marketing/`:

- `github.svg`, `googlegemini.svg`, `mongodb.svg`, `nextdotjs.svg`, `razorpay.svg`, `vercel.svg`.
- `scalekit.png`, `toothly.png`, `og.png`.

## Files changed

- `src/app/page.tsx`: composed homepage, separate demo bundles, canonical/social metadata, SoftwareApplication JSON-LD.
- `src/app/globals.css`: documented design tokens and marketing styles scoped under `.marketing` and `mk-` classes. Existing application tokens and utilities are preserved.
- `src/app/layout.tsx`: Bricolage Grotesque and JetBrains Mono; retained app fonts; dark homepage default while honoring saved theme. Outfit uses its variable font to avoid query-string URLs that the current Turbopack font resolver rejects.
- `src/components/ThemeToggle.tsx`: synchronize multiple controls through the document theme; keep switching functional when storage is blocked.
- `package.json`, `package-lock.json`: the two new production dependencies.

API routes, auth logic, middleware, database models, Razorpay code, and dashboard files have no changes.

## Design tokens

- Canvas: `#07060F` dark / `#FAFAFF` light; surface: `#0F0D1B` dark / white light.
- Primary button: `#7C5CFF` to `#4F46E5`; accessible violet text: `#B5A1FF` dark / `#6244D4` light.
- Cyan and warm highlights use theme-aware text variants; muted copy: `#A3A3BF` dark / `#655E78` light.
- Bricolage Grotesque for display, Inter for marketing UI, JetBrains Mono for code. Fonts are self-hosted through `next/font/google`.
- 8px spacing scale; 1200px maximum container; section padding scales between 80px and 144px.
- Reduced motion disables CSS animation and Lenis, completes typing without animation, and replaces pinned setup scenes with stacked content.

## Product sources

- Prices/limits: `src/app/dashboard/pricing/PricingClient.tsx`; paid amounts also match the existing Razorpay checkout route. Only monthly billing exists, so no annual toggle was added.
- Script format: `src/app/dashboard/embed/EmbedCodeClient.tsx`; the public sample uses `your_chatbot_id` and directs users to their real dashboard snippet.
- Toothly: repository README, linking to https://toothly-ai.vercel.app. Its logo was obtained from that site's `/logo1.png`.
- Technology marks: Simple Icons (CC0) from https://github.com/simple-icons/simple-icons/tree/develop/icons. Scalekit's icon comes from the favicon declared by https://www.scalekit.com.
- `og.png` is a 1200×630 capture of the implemented hero, without browser or development UI.

## Validation

- `npm run build`: passes with zero errors. The existing Next.js middleware-to-proxy deprecation warning remains; middleware was left unchanged.
- `npx tsc --noEmit` and `git diff --check`: pass.
- Production Chromium review at **360, 768, 1440, and 1920 pixels**, in dark and light themes: no horizontal page overflow, broken images, or browser errors. Each section was reviewed in screenshots.
- axe WCAG checks at 360 and 1440 pixels, both themes: **zero violations**.
- Browser interaction checks: navbar/footer theme synchronization, sample chat answers and unknown questions, clipboard contents, embed install/reset, inbox selection, valid CSV/JSON/PDF downloads, FAQ keyboard activation, modal scroll lock, Escape/focus restoration, reduced-motion changes and clean reduced-motion startup, server-rendered content, login, and protected-pricing redirects.
- The sample PDF was also validated with `pdfinfo` and `pdftotext`: one valid A4 page with the sample questions and answers.
- Local production Lighthouse, simulated mobile: **95 Performance / 100 Accessibility / 100 SEO**.
- Local production Lighthouse, desktop: **100 Performance / 100 Accessibility / 100 SEO**.

Lighthouse numbers are local lab results rather than production field measurements. Authenticated SSO and Razorpay checkout were not exercised without service credentials; their implementation is unchanged.
