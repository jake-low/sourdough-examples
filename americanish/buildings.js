const building = {
  "id": "building",
  "type": "fill-extrusion",
  "source": "sourdough",
  "source-layer": "buildings",
  "minzoom": 13,
  "paint": {
    "fill-extrusion-color": [
      "interpolate",
      ["linear"],
      ["zoom"],
      13,
      "hsl(0, 0%, 87%)",
      16,
      "hsl(0, 0%, 80%)",
    ],
    "fill-extrusion-height": 3,
    "fill-extrusion-opacity": 0.85,
  },
};

export const BUILDINGS = [building];
