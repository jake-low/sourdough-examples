// Helper to parse voltage from various formats (e.g., "110000", "110 kV", "110000;110000")
function getVoltage() {
  return [
    "coalesce",
    [
      "to-number",
      ["slice", ["get", "voltage"], 0, ["index-of", ";", ["concat", ["get", "voltage"], ";"]]],
    ],
    ["to-number", ["get", "voltage"]],
    0,
  ];
}

const power_line = {
  "id": "power_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["==", "power", "line"],
  "paint": {
    "line-color": [
      "let",
      "voltage",
      getVoltage(),
      [
        "case",
        [">=", ["var", "voltage"], 550000],
        "rgb(0, 193, 207)",
        [">=", ["var", "voltage"], 310000],
        "rgb(181, 78, 178)",
        [">=", ["var", "voltage"], 220000],
        "rgb(199, 48, 48)",
        [">=", ["var", "voltage"], 132000],
        "rgb(181, 93, 0)",
        [">=", ["var", "voltage"], 52000],
        "rgb(181, 159, 16)",
        [">=", ["var", "voltage"], 25000],
        "rgb(85, 181, 85)",
        [">=", ["var", "voltage"], 10000],
        "rgb(110, 151, 184)",
        "rgb(122, 122, 133)",
      ],
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 14, 2, 18, 4],
    // "line-opacity": 0.8
  },
};

const power_cable = {
  "id": "power_cable",
  "type": "line",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["==", "power", "cable"],
  "paint": {
    "line-color": [
      "let",
      "voltage",
      getVoltage(),
      [
        "case",
        [">=", ["var", "voltage"], 550000],
        "rgb(0, 193, 207)",
        [">=", ["var", "voltage"], 310000],
        "rgb(181, 78, 178)",
        [">=", ["var", "voltage"], 220000],
        "rgb(199, 48, 48)",
        [">=", ["var", "voltage"], 132000],
        "rgb(181, 93, 0)",
        [">=", ["var", "voltage"], 52000],
        "rgb(181, 159, 16)",
        [">=", ["var", "voltage"], 25000],
        "rgb(85, 181, 85)",
        [">=", ["var", "voltage"], 10000],
        "rgb(110, 151, 184)",
        "rgb(122, 122, 133)",
      ],
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 14, 2, 18, 4],
    "line-dasharray": [4, 2],
  },
};

const power_minor_line = {
  "id": "power_minor_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["==", "power", "minor_line"],
  "paint": {
    "line-color": "rgb(122, 122, 133)",
    "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 18, 2],
    "line-opacity": 0.6,
  },
};

const power_substation_fill = {
  "id": "power_substation_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "power", "substation"]],
  "paint": {
    "fill-color": "#d1d5db",
    "fill-opacity": 0.5,
  },
};

const power_substation_outline = {
  "id": "power_substation_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "power", "substation"]],
  "paint": {
    "line-color": "#6b7280",
    "line-width": 1.5,
  },
};

const power_plant_fill = {
  "id": "power_plant_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Polygon"], ["in", "power", "plant", "generator"]],
  "paint": {
    "fill-color": "#d1d5db",
    "fill-opacity": 0.5,
  },
};

const power_plant_outline = {
  "id": "power_plant_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Polygon"], ["in", "power", "plant", "generator"]],
  "paint": {
    "line-color": "#6b7280",
    "line-width": 2,
  },
};

const power_tower = {
  "id": "power_tower",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["in", "power", "tower", "pole"],
  "paint": {
    "circle-color": "#4b5563",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 1, 18, 3],
    "circle-opacity": 0.7,
  },
};

const power_substation_label = {
  "id": "power_substation_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Point"], ["==", "power", "substation"]],
  "layout": {
    "icon-image": "temaki-power_transformer",
    "icon-size": 0.8,
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Regular"],
    "text-size": 11,
    "text-max-width": 10,
    "text-padding": 5,
    "text-anchor": "top",
    "text-offset": [0, 0.8],
    "text-optional": true,
  },
  "paint": {
    "icon-halo-color": "#ffffff",
    "icon-halo-width": 2,
    "text-color": "#000000",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1.0,
  },
};

const power_plant_label = {
  "id": "power_plant_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "power",
  "filter": ["all", ["==", "$type", "Point"], ["in", "power", "plant", "generator"]],
  "layout": {
    "icon-image": [
      "case",
      ["==", ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""], "wind"],
      "temaki-wind_turbine",
      [
        "in",
        ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""],
        ["literal", ["hydro", "water"]],
      ],
      "maki-dam",
      ["==", ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""], "nuclear"],
      "temaki-cooling_tower_radiation",
      ["==", ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""], "coal"],
      "temaki-chimney",
      ["==", ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""], "gas"],
      "temaki-gas",
      ["==", ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""], "oil"],
      "temaki-oil_well",
      [
        "in",
        ["coalesce", ["get", "generator:source"], ["get", "plant:source"], ""],
        ["literal", ["biomass", "waste"]],
      ],
      "temaki-chimney",
      "maki-industry",
    ],
    "icon-size": 0.9,
    "icon-optional": false,
    "icon-allow-overlap": true,
    "text-field": [
      "format",
      ["get", "name"],
      {},
      [
        "case",
        ["has", "plant:output:electricity"],
        ["concat", "\n", ["get", "plant:output:electricity"]],
        "",
      ],
      { "font-scale": 0.85 },
    ],
    "text-optional": true,
    "text-allow-overlap": false,
    "text-font": ["Noto Sans Bold"],
    "text-size": 12,
    "text-max-width": 10,
    "text-padding": 5,
    "text-anchor": "top",
    "text-offset": [0, 1.0],
  },
  "paint": {
    "icon-halo-color": "#ffffff",
    "icon-halo-width": 2,
    "text-color": "#000000",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1.0,
  },
};

export const POWER_LINES = [power_line, power_cable, power_minor_line];
export const POWER_INFRASTRUCTURE = [
  power_plant_fill,
  power_plant_outline,
  power_substation_fill,
  power_substation_outline,
  power_tower,
];
export const POWER_LABELS = [power_substation_label, power_plant_label];
export const POWER = [...POWER_INFRASTRUCTURE, ...POWER_LINES, ...POWER_LABELS];
