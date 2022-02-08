import 'dotenv/config'
import { Map, Popup } from 'maplibre-gl';
import SampleControl from './OpenMapSamplesControl';
import Sample from "openmapsamples/lib/Sample";
import Layer from "openmapsamples/lib/Layer";
import { ExamplePlaceData, ExampleTransportationData } from "openmapsamples/lib/SampleData/ExampleSampleData";
import { default as highwayAttributesSample, sampleData as highwayAttributesSampleData } from "openmapsamples/samples/OpenMapTiles/HighwayAttributes";
import { default as highwayLinkAttributesSample, sampleData as highwayLinkAttributesSampleData } from "openmapsamples/samples/OpenMapTiles/HighwayLinkAttributes";
// import MaplibreInspect from "maplibre-gl-inspect";
// import "maplibre-gl-inspect/dist/maplibre-gl-inspect.css";

const m = new Map({ container: 'map', center: [-100.05, 41.0], zoom: 3 , hash: true});

async function loadStyle(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
  return res.json();
}


async function main() {
  const style = await loadStyle(
    'https://api.maptiler.com/maps/osm-standard/style.json?key=' +
      process.env.MAPTILER_API_KEY
  );

  m.setStyle(style);

  // Add our sample data.
  let sampleControl = new SampleControl();

  // Add our Highway Attributes sample.
  sampleControl.addSample(highwayAttributesSample);
  // Set a custom row-hight callback to give more space to motorways at high zooms.
  // This isn't needed for all styles, but the osm-standard style
  // inflates widths of motorways and trunk at high zooms.
  highwayAttributesSampleData.setRowHeightCallback(function(zoom, row, numRows) {
    if (zoom > 18 && row < 1) {
      return 24 / numRows / Math.pow(2, zoom - 4);
    } else if (zoom > 16 && row < 1) {
      return 22 / numRows / Math.pow(2, zoom - 4);
    } else {
      return 20 / numRows / Math.pow(2, zoom - 4);
    }
  });

  // Add our Highway Link Attributes sample.
  sampleControl.addSample(highwayLinkAttributesSample);
  // Set a custom row-hight callback to give more space to motorways at high zooms.
  // This isn't needed for all styles, but the osm-standard style
  // inflates widths of motorways and trunk at high zooms.
  highwayLinkAttributesSampleData.setRowHeightCallback(function(zoom, row, numRows) {
    if (zoom > 18 && row < 2) {
      return 24 / numRows / Math.pow(2, zoom - 4);
    } else if (zoom > 16 && row < 2) {
      return 22 / numRows / Math.pow(2, zoom - 4);
    } else {
      return 20 / numRows / Math.pow(2, zoom - 4);
    }
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
