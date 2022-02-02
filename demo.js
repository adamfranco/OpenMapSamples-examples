import { Map, addProtocol } from 'maplibre-gl';
import SampleControl from './OpenMapSamplesControl';
import Sample from "openmapsamples/lib/Sample";
import Layer from "openmapsamples/lib/Layer";
import { ExamplePlaceData, ExampleTransportationData } from "openmapsamples/lib/SampleData/ExampleSampleData";

const m = new Map({ container: 'map', center: [-100.05, 41.0], zoom: 3 });

async function loadStyle(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
  return res.json();
}

const apiKey = '';

async function main() {
  const style = await loadStyle(
    'https://api.maptiler.com/maps/osm-standard/style.json?key=' +
      apiKey
  );

  m.setStyle(style);

  // Add our sample data.
  let sampleControl = new SampleControl();

  let sample = sampleControl.addSample(
    new Sample('example', 'Example', 'This is an example sample.', [-100.85664, 39.71282], 7)
  );
  sample.addLayer(new Layer('place'))
    .addSampleData(new ExamplePlaceData());
  var transportation = new ExampleTransportationData();
  sample.addLayer(new Layer('transportation'))
    .addSampleData(transportation);
  sample.addLayer(new Layer('transportation_name'))
    .addSampleData(transportation);

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
