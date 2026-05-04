import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const prerender = true;

// Read from public/fonts/ via process.cwd() so the path resolves correctly
// in both local dev and Vercel's prerender build environment.
const fontDir = join(process.cwd(), "public", "fonts");
const orbitron = await readFile(join(fontDir, "Orbitron-Black.ttf"));

// 180×180 home-screen icon: neon-red "SD" monogram on a dark crimson backdrop.
// Used by iOS when the site is added to the Home Screen, and helps iMessage
// rich-link previews show a tinted favicon-style chip alongside the OG image.
export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1a0008 0%, #060001 60%, #02000c 100%)",
          fontFamily: "Orbitron",
        },
        children: {
          type: "div",
          props: {
            style: {
              fontFamily: "Orbitron",
              fontWeight: 900,
              fontSize: "92px",
              color: "#ff2040",
              letterSpacing: "0.04em",
              textShadow:
                "0 0 16px rgba(255, 32, 64, 0.6), 0 0 6px rgba(255, 32, 64, 0.5)",
            },
            children: "SD",
          },
        },
      },
    },
    {
      width: 180,
      height: 180,
      fonts: [
        { name: "Orbitron", data: orbitron, weight: 900, style: "normal" },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 180 } })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
