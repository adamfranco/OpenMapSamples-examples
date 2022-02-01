import { Map, addProtocol } from 'maplibre-gl';
import SampleControl from './OpenMapSamplesControl';
import SampleSet from "openmapsamples/lib/SampleSet";
import ExampleSample from "openmapsamples/lib/Sample/ExampleSample";
import SimpleSample from "openmapsamples/lib/Sample/SimpleSample";

const m = new Map({ container: 'map', center: [-109.05, 41.0], zoom: 3 });

async function loadStyle(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch: ' + res.statusText);
  return res.json();
}

const apiKey = 'c01ftcggrdjg98wbw8ev08t1dnf';

async function main() {
  const style = await loadStyle(
    'https://dev.basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:3857/style/basic.json?api=' +
      apiKey
  );

  m.setStyle(style);
  var exampleSample = new ExampleSample();
  exampleSet.addSample(exampleSample);
  sampleControl.addSampleSet(exampleSet);

  m.addControl(sampleControl, 'bottom-left');
}
main();
