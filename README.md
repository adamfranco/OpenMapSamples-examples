# OpenMapSamples-examples

[OpenMapSamples](https://github.com/adamfranco/OpenMapSamples) is a library to
generate and provide sample data for testing vector-based map renderings. Sample
data is returned as GeoJSON and can be rendered by mapping systems and styles to
validate their coverage of combinations of data at different zooms without
hand-mapping all possible combinations.

You can view a demonstration of this control at https://adamfranco.github.io/OpenMapSamples-examples/.
Look for the control in the bottom left of the map and choose a sample to replace
the normal map data with sample data and jump to the sample-data locations.

![Screen-shot of a Highway sample](https://user-images.githubusercontent.com/25242/152425778-14b8c108-e8a1-47ce-9ae0-9abe554c1d68.png)

The [OpenMapSamples-MapLibre](https://github.com/adamfranco/OpenMapSamples-MapLibre)
package provides a [MapLibre](https://github.com/maplibre) control that allows
OpenMapSamples to be swapped for real data in MapLibre-based maps.

## Development and demo.

Use `npm install` to install all of the main dependencies and development dependencies.

Copy the config.example.js file to `config.js` in the project root and add a personal MapTiler cloud key like this:
```
export default {
  MAPTILER_API_KEY: 'YourMapTilerAPIKey',
};
```
You can register a free MapTiler API Key at: https://cloud.maptiler.com/account/keys/

After your `config.js` file is in place you can start the demo with:

```
npm start
```

### Building the demo

Running this command will build a self-contained build of the demo site in the `dist/` directory:

```
npm run build
```
