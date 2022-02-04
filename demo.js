import 'dotenv/config'
import { Map, addProtocol } from 'maplibre-gl';
import SampleControl from './OpenMapSamplesControl';
import Sample from "openmapsamples/lib/Sample";
import Layer from "openmapsamples/lib/Layer";
import { ExamplePlaceData, ExampleTransportationData } from "openmapsamples/lib/SampleData/ExampleSampleData";
import highwayAttributesSample from "openmapsamples/samples/OpenMapTiles/HighwayAttributes";

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

  sampleControl.addSample(highwayAttributesSample);

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

  let roads = sampleControl.addSample(
    new Sample('roads-only', 'Roads Only', 'This is an example sample that only shows roads.', [-100.1, 40.0], 11)
  );
  var transportation2 = new ExampleTransportationData();
  roads.addLayer(new Layer('transportation'))
    .addSampleData(transportation2);
  roads.addLayer(new Layer('transportation_name'))
    .addSampleData(transportation2);

  m.addControl(sampleControl, 'bottom-left');
}
main();
