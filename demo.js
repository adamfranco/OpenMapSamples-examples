import config from "./config.js";
import { Map, Popup } from 'maplibre-gl';
import SampleControl from 'openmapsamples-maplibre/OpenMapSamplesControl';
import Sample from "openmapsamples/lib/Sample";
import Layer from "openmapsamples/lib/Layer";
import { ExamplePlaceData, ExampleTransportationData } from "openmapsamples/lib/SampleData/ExampleSampleData";
import { default as OpenMapTilesSamples } from "openmapsamples/samples/OpenMapTiles";
// import MaplibreInspect from "maplibre-gl-inspect";
// import "maplibre-gl-inspect/dist/maplibre-gl-inspect.css";

const MAPTILER_API_KEY = config.MAPTILER_API_KEY;
console.log(config, MAPTILER_API_KEY);

const m = new Map({ container: 'map', center: [-100.05, 41.0], zoom: 3 , hash: true});

async function loadStyle(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
  return res.json();
}

async function main() {
  const style = await loadStyle(
    'https://api.maptiler.com/maps/osm-standard/style.json?key=' +
      MAPTILER_API_KEY
  );

  m.setStyle(style);

  // Add our sample data.
  let sampleControl = new SampleControl({'permalinks': true});

  OpenMapTilesSamples.forEach((sample, i) => {
    sampleControl.addSample(sample);
  });

  let sample = sampleControl.addSample(
    new Sample('example', 'Example', 'This is an example sample showing hand-crafted GeoJSON that mocks OpenMapTiles data. (<a href="https://github.com/adamfranco/OpenMapSamples/blob/main/lib/SampleData/ExampleSampleData.js">source</a>)', [-100.85664, 39.71282], 7)
  );
  sample.addLayer(new Layer('place'))
    .addSampleData(new ExamplePlaceData());
  var transportation = new ExampleTransportationData();
  sample.addLayer(new Layer('transportation'))
    .addSampleData(transportation);
  sample.addLayer(new Layer('transportation_name'))
    .addSampleData(transportation);
  sample.setZoomVariant(10, [-100.1, 40.0])

  m.addControl(sampleControl, 'bottom-left');

  // m.addControl(new MaplibreInspect({
  //   popup: new Popup({
  //     closeButton: false,
  //     closeOnClick: false
  //   })
  // }));
}
main();
