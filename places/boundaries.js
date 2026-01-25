const boundaries_country = {
  "id": "boundaries_country",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": ["all", ["==", "boundary", "administrative"], ["==", "admin_level", 2]],
  "paint": {
    "line-color": "#888888",
    "line-width": 1,
  },
};

const boundaries_state = {
  "id": "boundaries_state",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": ["all", ["==", "boundary", "administrative"], ["==", "admin_level", 4]],
  "paint": {
    "line-color": "#888888",
    "line-width": 0.5,
    "line-dasharray": [4, 4],
  },
};

export const BOUNDARIES = [boundaries_state, boundaries_country];
