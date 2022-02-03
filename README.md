# OpenMapSamples-MapLibre

OpenMapSamples is a library to generate and provide sample data for testing vector-based map renderings. Sample data is returned as GeoJSON and can be rendered by mapping systems and styles to validate their coverage of combinations of data.

The OpenMapSamples-MapLibre package provides a MapLibre control and integration
that allows OpenMapSamples to be rendered in MapLibre.

## Developement and demo.

Use `npm install --include=dev` to install all of the main dependencies and development dependencies.

Add a file called `.env` in the project root and add a personal MapTiler cloud key like this:
```
MAPTILER_API_KEY=YourMapTileAPIKey
```
You can register a free MapTiler API Key at: https://cloud.maptiler.com/account/keys/

After your `.env` file is in place you can start the demo with:

```
npm start
```

### Building the demo

Running this command will build a self-contained build of the demo site in the `dist/` directory:

```
npm run build
```
