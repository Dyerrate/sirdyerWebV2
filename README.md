# sirdyer.dev — v2

> A retro-futuristic personal portfolio with a HUD aesthetic, glitchy ASCII art, looping video backdrops, and a 3D Three.js head that probably stares back at you.

This is the source for my personal portfolio site — built fast, kept lean, and styled like a cyberpunk ops terminal. It showcases my experience, projects, and vision without a single React component in sight.

---

## ? Features

- **Hero section** with a full-bleed looping video background, animated grid, and HUD corner brackets
- **ASCII art head** rendered live in the browser
- **3D Three.js scene** for that extra dimension of personality
- **Vision, Experience & Projects** sections for the substance
- **Dynamic OG image** and Apple Touch Icon generated at build time via Satori + resvg
- Retro monospace fonts: **Orbitron** & **Share Tech Mono**

---

## ?? Tech Stack

| Layer | Tool |
| :--- | :--- |
| Framework | [Astro v6](https://astro.build) |
| 3D Graphics | [Three.js](https://threejs.org) |
| OG Image Generation | [Satori](https://github.com/vercel/satori) + [@resvg/resvg-js](https://github.com/yisibl/resvg-js) |
| Typography | [@fontsource/orbitron](https://fontsource.org/fonts/orbitron), [@fontsource/share-tech-mono](https://fontsource.org/fonts/share-tech-mono) |
| Runtime | Node.js >= 22.12 |
| Language | TypeScript |

No UI framework, no unnecessary runtime JS — just Astro islands where needed and plain CSS doing the heavy lifting.

---

## ?? Project Structure

```
/
+-- public/               # Static assets (fonts, video, icons)
+-- src/
¦   +-- assets/           # Build-time assets (fonts for OG generation)
¦   +-- components/       # Astro components
¦   ¦   +-- AsciiHead.astro
¦   ¦   +-- Experience.astro
¦   ¦   +-- Footer.astro
¦   ¦   +-- Hero.astro
¦   ¦   +-- Nav.astro
¦   ¦   +-- Projects.astro
¦   ¦   +-- Vision.astro
¦   ¦   +-- Welcome.astro
¦   +-- layouts/
¦   ¦   +-- Layout.astro
¦   +-- pages/
¦       +-- index.astro
¦       +-- og.png.ts           # Dynamically generated OG image
¦       +-- apple-touch-icon.png.ts
+-- astro.config.mjs
+-- package.json
+-- tsconfig.json
```

---

## ?? Running It Locally

Want to poke around or fork it for your own portfolio? Here's how:

**Prerequisites:** Node.js >= 22.12.0

```sh
# 1. Clone the repo
git clone https://github.com/sirdyer/sirdyerWebV2.git
cd sirdyerWebV2

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open http://localhost:4321 in your browser.

### All available commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands |

---

## ?? License

Feel free to draw inspiration — just don't ship it as your own. If you use substantial chunks, a credit would be appreciated.
