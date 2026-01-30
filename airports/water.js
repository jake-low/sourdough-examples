const water = {
  "id": "water",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["==", "$type", "Polygon"],
  "paint": {
    "fill-color": "#b2d8fc",
  },
};

export const WATER = [water];
