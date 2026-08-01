const hillshade = {
  "id": "hillshade",
  "type": "raster",
  "source": "hillshade",
  "paint": {
    "raster-opacity": ["interpolate", ["linear"], ["zoom"], 12, 0.35, 18, 0.1],
  },
};

const hillshade_background = {
  "id": "hillshade_background",
  "type": "background",
  "paint": {
    "background-color": "#fff",
    "background-opacity": ["interpolate", ["linear"], ["zoom"], 12, 0.0, 18, 0.25],
  },
};

export const HILLSHADE = [hillshade_background, hillshade];
