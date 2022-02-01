import { Map, addProtocol } from 'maplibre-gl';
import SampleControl from './OpenMapSamplesControl';
import Sample from "openmapsamples/lib/Sample";
import Layer from "openmapsamples/lib/Layer";
import ExampleSampleData from "openmapsamples/lib/SampleData/ExampleSampleData";
import SimpleSampleData from "openmapsamples/lib/SampleData/SimpleSampleData";

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
    .addSampleData(new ExampleSampleData());
  var transportation = new SimpleSampleData(
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [-103.1, 40.3],
              [-100.1, 40.1],
              [-99.9, 39.8],
            ]
           },
           "properties": {
             "class": "trunk",
             "oneway": 0,
             "ramp": 0,
             "surface": "paved",
             "name": "Captain Picard Highway",
             "name_en": "Captain Picard Highway",
             "ref": "999",
             "network": "us-highway",
           }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [-99.9, 40.1],
              [-100.1, 39.9],
            ]
           },
           "properties": {
             "class": "primary",
             "oneway": 0,
             "ramp": 0,
             "surface": "paved",
             "name": "Captain Kirk Highway",
             "name_en": "Captain Kirk Highway",
             "ref": "998",
             "network": "us-highway",
           }
        },
      ]
    }
  );
  sample.addLayer(new Layer('transportation'))
    .addSampleData(transportation);
  sample.addLayer(new Layer('transportation_name'))
    .addSampleData(transportation);

  m.addControl(sampleControl, 'bottom-left');
}
main();
