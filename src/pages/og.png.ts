import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const prerender = true;

// ── Fonts (loaded once at build time) ────────────────────────────────────
// Read from public/fonts/ via process.cwd() so the path resolves correctly
// in both local dev and Vercel's prerender build environment.
const fontDir = join(process.cwd(), "public", "fonts");
const orbitron = await readFile(join(fontDir, "Orbitron-Black.ttf"));
const shareTechMono = await readFile(join(fontDir, "ShareTechMono-Regular.ttf"));

// ── Tiny JSX helper so we don't need a JSX runtime ───────────────────────
type Node = string | number | { type: string; props: Record<string, unknown> };
const h = (
  type: string,
  props: Record<string, unknown> = {},
  ...children: (Node | Node[] | null | false | undefined)[]
): Node => {
  const flat = children
    .flat()
    .filter((c): c is Node => c != null && c !== false);
  // satori requires every div with >1 children to declare display: flex.
  // We tighten the helper: if a non-leaf div is missing `display`, default it
  // to flex so layout never errors out.
  const props2: Record<string, unknown> = { ...props };
  if (flat.length > 1 && type === "div") {
    const style = (props2.style as Record<string, unknown> | undefined) ?? {};
    if (!("display" in style)) {
      props2.style = { ...style, display: "flex" };
    }
  }
  // Only attach `children` when there are actual children — satori
  // sometimes treats `children: []` as "more than one child".
  if (flat.length > 0) {
    props2.children = flat.length === 1 ? flat[0] : flat;
  }
  return { type, props: props2 };
};

// ── ASCII head silhouette (rendered as monospace text) ───────────────────
// Hand-tuned to read as a stylized bust at ~14px Share Tech Mono.
const asciiHead = `              .:::::::.
           :##############:
         :###################:
       :########################:
      ###########################
      ##  ##########  ###########
      ##  ##########  ###########
      ###################+#######
      #################:::#######
       ###=============#########
        ##===========###########
         ####################
           ################
              ##########
              ##########
              ##########
            ##############
          ##################
        ######################
     ###########################
   ##############################`;

// ── Corner bracket helper (returns the two arms as nodes) ────────────────
const bracket = (opts: {
  position: "tl" | "tr" | "bl" | "br";
  inset: number;
  length: number;
  thickness: number;
  color: string;
}): Node[] => {
  const { position, inset, length, thickness, color } = opts;
  const isLeft = position === "tl" || position === "bl";
  const isTop = position === "tl" || position === "tr";
  const horiz: Record<string, unknown> = {
    position: "absolute",
    width: `${length}px`,
    height: `${thickness}px`,
    background: color,
    [isTop ? "top" : "bottom"]: `${inset}px`,
    [isLeft ? "left" : "right"]: `${inset}px`,
  };
  const vert: Record<string, unknown> = {
    position: "absolute",
    width: `${thickness}px`,
    height: `${length}px`,
    background: color,
    [isTop ? "top" : "bottom"]: `${inset}px`,
    [isLeft ? "left" : "right"]: `${inset}px`,
  };
  return [h("div", { style: horiz }), h("div", { style: vert })];
};

// ── Compose the cover ────────────────────────────────────────────────────
function buildCoverTree(): Node {
  const COL_RED = "#ff2040";
  const COL_RED_DIM = "#ff6678";
  const COL_TEXT = "#e8e8f0";
  const COL_DIM = "#a8a8b8";

  return h(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        background:
          "linear-gradient(135deg, #1a0008 0%, #060001 60%, #02000c 100%)",
        fontFamily: "ShareTechMono",
        color: COL_TEXT,
      },
    },

    // ASCII head — right of center, dim red, monospace
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: "70px",
          right: "70px",
          fontFamily: "ShareTechMono",
          fontSize: "16px",
          lineHeight: "16px",
          letterSpacing: "0",
          color: COL_RED,
          opacity: 0.78,
          whiteSpace: "pre",
        },
      },
      asciiHead,
    ),

    // Top-left status pill: pulse-dot + "SIGNAL // PRESENCE"
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: "44px",
          left: "44px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "ShareTechMono",
          fontSize: "16px",
          letterSpacing: "0.28em",
          color: COL_RED,
          textTransform: "uppercase",
        },
      },
      h("div", {
        style: {
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          background: COL_RED,
          boxShadow: `0 0 10px ${COL_RED}`,
        },
      }),
      h("span", {}, "SIGNAL  //  PRESENCE"),
    ),

    // Bottom-left lockup
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: "44px",
          bottom: "44px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        },
      },
      h(
        "div",
        {
          style: {
            fontFamily: "Orbitron",
            fontWeight: 900,
            fontSize: "92px",
            color: COL_TEXT,
            letterSpacing: "0.04em",
            lineHeight: 1,
            // Faux glow via doubled text-shadow
            textShadow:
              "0 0 18px rgba(255, 32, 64, 0.35), 0 0 6px rgba(255, 32, 64, 0.25)",
          },
        },
        "SAMUEL_DYER",
      ),
      h(
        "div",
        {
          style: {
            fontFamily: "ShareTechMono",
            fontSize: "22px",
            letterSpacing: "0.32em",
            color: COL_RED_DIM,
            textTransform: "uppercase",
          },
        },
        "// CREATIVE TECHNOLOGIST",
      ),
      h(
        "div",
        {
          style: {
            fontFamily: "ShareTechMono",
            fontSize: "14px",
            letterSpacing: "0.22em",
            color: COL_DIM,
            textTransform: "uppercase",
          },
        },
        "AR · VR · SPATIAL · CREATIVE CODE",
      ),
    ),

    // Bottom-right: domain mark
    h(
      "div",
      {
        style: {
          position: "absolute",
          right: "44px",
          bottom: "44px",
          fontFamily: "ShareTechMono",
          fontSize: "18px",
          letterSpacing: "0.22em",
          color: COL_RED,
          textTransform: "uppercase",
        },
      },
      "SIRDYER.COM",
    ),

    // Top-right: build / version chip
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: "44px",
          right: "44px",
          fontFamily: "ShareTechMono",
          fontSize: "13px",
          letterSpacing: "0.28em",
          color: COL_DIM,
          textTransform: "uppercase",
        },
      },
      "PORTFOLIO_OS · v2.6",
    ),

    // Corner brackets (red, thin, 1px)
    ...bracket({ position: "tl", inset: 24, length: 38, thickness: 1, color: COL_RED }),
    ...bracket({ position: "tr", inset: 24, length: 38, thickness: 1, color: COL_RED }),
    ...bracket({ position: "bl", inset: 24, length: 38, thickness: 1, color: COL_RED }),
    ...bracket({ position: "br", inset: 24, length: 38, thickness: 1, color: COL_RED }),
  );
}

export const GET: APIRoute = async () => {
  const tree = buildCoverTree();

  // satori expects a React-element-shaped tree; our `h()` matches that shape.
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Orbitron", data: orbitron, weight: 900, style: "normal" },
      {
        name: "ShareTechMono",
        data: shareTechMono,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
