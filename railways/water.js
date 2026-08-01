const water = {
  "id": "water",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["==", "$type", "Polygon"],
  "paint": {
    "fill-color": "#e4e4e4",
  },
};

const water_outline = {
  "id": "water_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["==", "$type", "Polygon"],
  "paint": {
    "line-color": "#cfcfcf",
    "line-width": 0.75,
  },
};

export const WATER = [water, water_outline];
