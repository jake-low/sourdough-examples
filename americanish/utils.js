// Expression fragments shared by the layer modules.

// Sourdough emits a centroid point for every polygon in a layer, specifically
// so labels can be placed on it (a large polygon may be split across many
// tiles, which can't be stitched back together client-side). Label layers must
// filter to points, or MapLibre also labels the polygon itself once per tile.
export const IS_POINT = ["==", ["geometry-type"], "Point"];
export const IS_LINE = ["==", ["geometry-type"], "LineString"];
export const IS_POLYGON = ["==", ["geometry-type"], "Polygon"];

// OSM's bridge and tunnel tags take many values beyond "yes", so test for the
// tag's presence rather than comparing it.
export const IS_TUNNEL = ["has", "tunnel"];
export const IS_BRIDGE = ["has", "bridge"];
export const IS_SURFACE = ["all", ["!", IS_TUNNEL], ["!", IS_BRIDGE]];

// `_reczoom` is the zoom Sourdough recommends a feature first be displayed at,
// standing in for OpenMapTiles' precomputed `rank`. Gate labels on it so minor
// features stay hidden until the map zooms in, and sort by it so that more
// important features win collisions.
export const reczoomGate = (fallback = 0) => [
  ">=",
  ["zoom"],
  ["coalesce", ["get", "_reczoom"], fallback],
];

export const reczoomSortKey = (fallback = 10) => ["coalesce", ["get", "_reczoom"], fallback];

// Icon image naming a sprite to recolor at runtime, a protocol implemented by
// viewer.html (ported from Americana's poi.ts). `sprite` may be an expression,
// in which case the image name is assembled at render time.
export function poiIcon(sprite, color) {
  return typeof sprite === "string"
    ? `poi\nsprite=${sprite}\ncolor=${color}`
    : ["concat", "poi\nsprite=", sprite, `\ncolor=${color}`];
}
