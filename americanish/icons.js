// Americanish draws highway shields and POI icons at runtime instead of baking
// them into a sprite sheet: the stylesheet emits image names that describe what
// to draw, and this module draws them on demand. Any page that displays the
// style needs to call renderIcons() on its map.

import {
  URLShieldRenderer,
  transposeImageData,
} from "https://cdn.jsdelivr.net/npm/@americana/maplibre-shield-generator@0.1.1/dist/index.js";

const SHIELD_DEFINITIONS = "https://americanamap.org/shields.json";
const SHIELD_FONT = "https://webfont.americanamap.org/noto/NotoSans-CondensedMedium-PropNums.woff2";

// Shield text is drawn on a canvas, so it needs a real browser font (the glyph
// PBFs only apply to map labels).
const fontFace = document.createElement("style");
fontFace.textContent = `
  @font-face {
    font-family: "Noto Sans Condensed";
    src: url("${SHIELD_FONT}") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
`;
document.head.appendChild(fontFace);

// Image names produced by the style's highway_shield layer follow Americana's
// protocol: "shield\n{network}\n{ref}\n{name}\n{color}".
const routeAttributes = ["network", "ref", "name", "color"];
const routeParser = {
  parse: (id) => {
    const lines = id.split("\n");
    lines.shift();
    const parsed = Object.fromEntries(routeAttributes.map((a, i) => [a, lines[i]]));
    parsed.imageName = id;
    return parsed;
  },
  format: (network, ref, name) => `shield\n${network}\n${ref}\n${name}\n`,
};

// Draws the images that the Americanish style generates at runtime: highway
// shields (via Americana's shieldlib) and recolored POI icons.
export function renderIcons(map) {
  const shieldRenderer = new URLShieldRenderer(SHIELD_DEFINITIONS, routeParser)
    .debugOptions({})
    .filterImageID((id) => id && id.startsWith("shield"))
    .filterNetwork((network) => !/^[lrni][chimpw]n$/.test(network))
    .renderOnMaplibreGL(map);

  // POI and airport icons use "poi\nsprite={name}\ncolor={color}" image names;
  // recolor the named sprite on the fly (see Americana's poi.ts).
  map.on("styleimagemissing", (e) => {
    if (!e.id.startsWith("poi")) return;

    const sprite = e.id.split("\n")[1].split("=")[1];
    const color = e.id.split("\n")[2].split("=")[1];
    const sourceSprite = map.style.getImage(sprite);
    if (!sourceSprite) {
      console.error(`No such sprite ${sprite}`);
      return;
    }

    const { width, height } = sourceSprite.data;
    const ctx = shieldRenderer.createGraphics({ width, height });
    transposeImageData(ctx, sourceSprite, 0, false, color);
    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    map.addImage(
      e.id,
      { width: ctx.canvas.width, height: ctx.canvas.height, data: imgData.data },
      { pixelRatio: shieldRenderer.pixelRatio() },
    );
  });
}
