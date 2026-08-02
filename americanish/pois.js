import { BACKGROUND_FILL, POI } from "./colors.js";
import { IS_POINT, poiIcon, reczoomSortKey } from "./utils.js";

const SORT_KEY = reczoomSortKey(15);

// builds a ["match", ["get", field], ...] expression from a table of POI kinds
function fieldMatch(field, kinds, pick, fallback) {
  const expr = ["match", ["get", field]];
  for (const kind of kinds) {
    expr.push(kind.match, pick(kind));
  }
  expr.push(fallback);
  return expr;
}

// build the text-field expression for a POI layer
function textField(field, kinds) {
  const delays = [...new Set(kinds.map((kind) => kind.textDelayZoom).filter(Boolean))];
  if (delays.length === 0) return ["get", "name"];
  delays.sort((a, b) => a - b);

  // some POI types show icons only initially (by setting text-field to "" until
  // a threshold zoom is reached)
  const namesAt = (zoom) => [
    "match",
    ["get", field],
    kinds.filter((kind) => kind.textDelayZoom > zoom).flatMap((kind) => kind.match),
    "",
    ["get", "name"],
  ];

  return [
    "step",
    ["zoom"],
    namesAt(0),
    ...delays.slice(0, -1).flatMap((zoom) => [zoom, namesAt(zoom)]),
    delays.at(-1),
    ["get", "name"],
  ];
}

function poiLayer(id, sourceLayer, field, table) {
  const kinds = table.map((kind) => ({ ...kind, "match": [kind.match].flat() }));

  return {
    "id": id,
    "type": "symbol",
    "source": "sourdough",
    "source-layer": sourceLayer,
    "filter": ["all", IS_POINT, ["<=", fieldMatch(field, kinds, (k) => k.zoom, 99), ["zoom"]]],
    "layout": {
      "text-font": ["Americana-Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 15, 10, 17, 12],
      "icon-image": fieldMatch(field, kinds, (k) => poiIcon(k.sprite, k.color), ""),
      "text-field": textField(field, kinds),
      "text-variable-anchor": ["left", "right", "bottom"],
      "text-radial-offset": 1.2,
      "text-justify": "auto",
      "text-optional": true,
      "icon-optional": false,
      "symbol-sort-key": SORT_KEY,
    },
    "paint": {
      "text-color": fieldMatch(field, kinds, (k) => k.color, POI.infrastructure),
      "text-halo-color": BACKGROUND_FILL,
      "text-halo-width": 1.5,
    },
  };
}

const EDUCATION_KINDS = [
  {
    "match": ["college", "university"],
    "sprite": "poi_mortarboard",
    "color": POI.infrastructure,
    "zoom": 14,
  },
  {
    "match": ["school", "kindergarten"],
    "sprite": "poi_school",
    "color": POI.infrastructure,
    "zoom": 15,
  },
];

const RELIGIONS = [
  "christian",
  "buddhist",
  "hindu",
  "jewish",
  "muslim",
  "sikh",
  "shinto",
  "taoist",
];

const PLACE_OF_WORSHIP_SPRITE = [
  "match",
  ["get", "religion"],
  ...RELIGIONS.flatMap((religion) => [[religion], `poi_pow_${religion}`]),
  ["unitarian_universalist"],
  "poi_pow_uu",
  "poi_pow_christian",
];

const AMENITY_KINDS = [
  {
    "match": ["bar", "pub", "biergarten"],
    "sprite": "poi_martini_glass",
    "color": POI.consumer,
    "zoom": 16,
  },
  { "match": "bus_station", "sprite": "poi_bus_circle", "color": POI.transport, "zoom": 14 },
  { "match": "cafe", "sprite": "poi_coffee_cup", "color": POI.consumer, "zoom": 16 },
  {
    "match": "charging_station",
    "sprite": "poi_charging_station",
    "color": POI.consumer,
    "zoom": 15,
    "textDelayZoom": 16,
  },
  { "match": "fast_food", "sprite": "poi_restaurant_circle", "color": POI.consumer, "zoom": 16 },
  {
    "match": "food_court",
    "sprite": "poi_restaurant_circle",
    "color": POI.consumer,
    "zoom": 15,
    "textDelayZoom": 16,
  },
  { "match": "restaurant", "sprite": "poi_restaurant", "color": POI.consumer, "zoom": 16 },
  {
    "match": "fire_station",
    "sprite": "poi_fire_station",
    "color": POI.infrastructure,
    "zoom": 15,
  },
  {
    "match": "fuel",
    "sprite": "poi_fuel",
    "color": POI.consumer,
    "zoom": 15,
    "textDelayZoom": 16,
  },
  { "match": "library", "sprite": "poi_book_upright", "color": POI.infrastructure, "zoom": 15 },
  { "match": "police", "sprite": "poi_police_shield", "color": POI.infrastructure, "zoom": 15 },
  { "match": "post_office", "sprite": "poi_envelope", "color": POI.infrastructure, "zoom": 15 },
  { "match": "townhall", "sprite": "poi_town_hall", "color": POI.infrastructure, "zoom": 15 },
  { "match": "taxi", "sprite": "poi_taxi", "color": POI.transport, "zoom": 16 },
  { "match": "parking", "sprite": "poi_p", "color": POI.infrastructure, "zoom": 17 },
  {
    "match": "place_of_worship",
    "sprite": PLACE_OF_WORSHIP_SPRITE,
    "color": POI.infrastructure,
    "zoom": 15,
  },
  ...EDUCATION_KINDS,
];

const SHOP_KINDS = [
  { "match": "books", "sprite": "poi_book_upright", "color": POI.consumer, "zoom": 16 },
  { "match": "car", "sprite": "poi_car_shop", "color": POI.consumer, "zoom": 16 },
  { "match": "car_repair", "sprite": "poi_car_repair", "color": POI.consumer, "zoom": 16 },
  {
    "match": "supermarket",
    "sprite": "poi_supermarket",
    "color": POI.consumer,
    "zoom": 15,
    "textDelayZoom": 16,
  },
];

const TOURISM_KINDS = [
  {
    "match": ["hotel", "motel", "guest_house"],
    "sprite": "poi_hotel",
    "color": POI.consumer,
    "zoom": 16,
  },
  { "match": "hostel", "sprite": "poi_hostel", "color": POI.consumer, "zoom": 16 },
  { "match": "museum", "sprite": "poi_museum", "color": POI.attraction, "zoom": 15 },
];

const HEALTHCARE_KINDS = [
  { "match": "hospital", "sprite": "poi_hospital", "color": POI.infrastructure, "zoom": 14 },
  {
    "match": ["clinic", "doctor"],
    "sprite": "poi_health_cross",
    "color": POI.infrastructure,
    "zoom": 17,
  },
];

const STATION_ZOOM = ["match", ["get", "station"], ["subway"], 14, 12];

const RAILWAY_KINDS = [
  { "match": "station", "sprite": "poi_rail_circle", "color": POI.transport, "zoom": STATION_ZOOM },
  { "match": "halt", "sprite": "poi_rail_circle", "color": POI.transport, "zoom": 12 },
  {
    "match": "tram_stop",
    "sprite": "poi_rail",
    "color": POI.transport,
    "zoom": 15,
    "textDelayZoom": 16,
  },
];

const AERIALWAY_KINDS = [
  { "match": "station", "sprite": "poi_aerialway_circle", "color": POI.transport, "zoom": 14 },
];

const HIGHWAY_KINDS = [
  {
    "match": "bus_stop",
    "sprite": "poi_bus",
    "color": POI.transport,
    "zoom": 15,
    "textDelayZoom": 17,
  },
];

const CEMETERY_KINDS = [
  { "match": "cemetery", "sprite": "poi_gravestone", "color": POI.outdoor, "zoom": 17 },
];

const poi_cemetery_label = {
  "id": "poi_cemetery_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "landuse",
  "minzoom": 15,
  "maxzoom": 17,
  "filter": ["all", IS_POINT, ["==", ["get", "landuse"], "cemetery"], ["has", "name"]],
  "layout": {
    "text-font": ["Americana-Bold"],
    "text-size": 10,
    "text-field": ["get", "name"],
    "symbol-sort-key": SORT_KEY,
  },
  "paint": {
    "text-color": POI.outdoor,
    "text-halo-color": BACKGROUND_FILL,
    "text-halo-width": 1.5,
  },
};

export const POIS = [
  poiLayer("poi_education", "education", "education", EDUCATION_KINDS),
  poiLayer("poi_railway", "railways", "railway", RAILWAY_KINDS),
  poiLayer("poi_amenity", "amenities", "amenity", AMENITY_KINDS),
  poiLayer("poi_shop", "shops", "shop", SHOP_KINDS),
  poiLayer("poi_tourism", "tourism", "tourism", TOURISM_KINDS),
  poiLayer("poi_healthcare", "healthcare", "healthcare", HEALTHCARE_KINDS),
  poiLayer("poi_aerialway", "aerialways", "aerialway", AERIALWAY_KINDS),
  poiLayer("poi_highway", "highways", "highway", HIGHWAY_KINDS),
  poi_cemetery_label,
  poiLayer("poi_cemetery_icon", "landuse", "landuse", CEMETERY_KINDS),
];
