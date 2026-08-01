# Parks

An example map showing parks and protected areas.

This example uses the `_reczoom` attribute to display park labels at an
appropriate zoom based on the park's size and importance. Reczoom attributes
are shifted downwards by 1, in order to display more parks at lower zooms. The
opposite shift could be used to display fewer parks instead.

```js
{
  "id": "park_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "leisure",
  "minzoom": 8,
  "filter": [
    "all",
    ["==", ["geometry-type"], "Point"],
    ["in", ["get", "leisure"], ["literal", ["park", "nature_reserve"]]],
    ["has", "name"],
    [">=", ["zoom"], ["+", ["get", "_reczoom"], -1]], // <-- the important part!
  ],
  "layout": { ... },
  "paint": { ... },
}
```
