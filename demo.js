import { Map, addProtocol } from 'maplibre-gl';

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
}
main();
