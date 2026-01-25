# Sourdough example styles

This repo contains examples of how to use [Sourdough vector tiles](https://sourdough.osm.fyi/) and the [MapLibre](https://maplibre.org/) map rendering engine to create zoomable interactive maps based on [OpenStreetMap](https://www.openstreetmap.org/about) data.

## Structure

MapLibre renders maps using a [Stylesheet](https://maplibre.org/maplibre-style-spec/) which is a JSON document describing what data to load and how to display it. The stylesheet specifies what colors, line styles, fonts, and icons to use for different kinds of elements found in the raw vector tile data.

Stylesheets for general-purpose maps are large and complex, and maintaining thousands of lines of JSON can become challenging. A good practice instead is to maintain your map style as a script (pick your favorite programming language; any will do) which then outputs the JSON stylesheet when you run it. This lets you divide your style code into different files, and use standard programming constructs like constants (for defining colors, fonts, etc that are referenced repeatedly throughout the style) and loops (for generating several similar style layers) to keep your code concise and easy to maintain.

The examples in this repo follow this pattern. Each example is a subdirectory with a `style.js` module which exports a JavaScript object representing the stylesheet. This object is built up by importing style layers from other files (which may reference shared constants or utility code to define these layers). A `build.js` script can load an example of your choice and serialize it to JSON, which can then be supplied to MapLibre and rendered. For example:

```
$ node build.js places
{
  "version": 8,
  "name": "Places",
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json"
    }
  },
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#f8f4f0"
      }
    },
    ... more layers ...
  ]
}
```

See [MapLibre's docs](https://maplibre.org/maplibre-gl-js/docs/examples/display-a-map/) for how to render stylesheets like this in the browser.

## License

All code in this repo is dedicated to the public domain via the [CC0](https://creativecommons.org/public-domain/cc0/) license. You may use it however you want, and do not need to give credit to the Sourdough project or its authors. See the [LICENSE](./LICENSE) file for details.
