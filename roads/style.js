import { WATER } from "./water.js";
import { ROADS, ROAD_LABELS } from "./roads.js";

export const style = {
  "version": 8,
  "name": "Roads",
  "center": [-122.282, 37.818],
  "zoom": 13,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json",
    },
  },
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
  "sprite": "https://sourdough.osm.fyi/assets/sprites",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "hsl(40, 45%, 89%)",
      },
    },
    ...WATER,
    ...ROADS[0],
    ...ROADS[1],
    ...ROADS[2],
    ...ROADS[3],
    ...ROADS[4],
    ...ROADS[5],
    ...ROAD_LABELS,
  ],
};
