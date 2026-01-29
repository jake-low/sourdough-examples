const water = {
  "id": "water",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["==", "$type", "Polygon"],
  "paint": {
    "fill-color": "#DDE2EC",
  },
};

const water_outline = {
  "id": "water_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["==", "$type", "Polygon"],
  "paint": {
    "line-color": "#C8D9E8",
    "line-width": 0.75,
  },
};

export const WATER = [water, water_outline];
