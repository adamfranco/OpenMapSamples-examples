"use strict";

import { addProtocol } from 'maplibre-gl';
import './OpenMapSamplesControl.css';
import Layer from "openmapsamples/lib/Layer";

/**
 * An example Sample class with function definitions.
 */
export default class SampleControl {

  constructor (options = {}) {
    this.samples = {};
    this.options = options;
  }

  addSample(sample) {
    if (typeof sample.getId !== "function") {
      throw "Samples must implement getId().";
    }
    if (typeof sample.getName !== "function") {
      throw "Samples must implement getName().";
    }
    if (typeof sample.getDescription !== "function") {
      throw "Samples must implement getDescription().";
    }
    if (typeof sample.getLayers !== "function") {
      throw "Samples must implement getLayers().";
    }

    this.samples[sample.getId()] = sample;
    return sample;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl openmapsamples-control-container';

    this._button = document.createElement('button');
    this._container.appendChild(this._button);
    this._button.textContent = 'Samples';
    this._button.onclick = this.showControls.bind(this);

    this._controls = document.createElement('div');
    this._controls.className = 'openmapsamples-control-overlay';
    this._container.appendChild(this._controls);

    this._closer = document.createElement('button');
    this._closer.className = 'openmapsamples-control-closer';
    this._controls.appendChild(this._closer);
    this._closer.textContent = 'x';
    this._closer.onclick = this.hideControls.bind(this);

    this._title = document.createElement('h2');
    this._title.className = 'openmapsamples-control-title';
    this._controls.appendChild(this._title);
    this._title.textContent = 'Samples';

    this.hideControls();

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  showControls() {
    this._button.style.display = 'none';
    this._controls.style.display = 'block';

    if (!this._samplesMenu) {
      this.initializeSamplesMenu();
    }
    if (!this._sampleControls) {
      this._sampleControls = document.createElement('div');
      this._sampleControls.className = 'openmapsamples-sample-controls';
      this._controls.appendChild(this._sampleControls);
    }

  }

  hideControls() {
    this._button.style.display = 'block';
    this._controls.style.display = 'none';
  }

  initializeSamplesMenu() {
    this._samplesMenu = document.createElement('select');
    this._samplesMenu.className = 'openmapsamples-control-samples-menu';
    this._controls.appendChild(this._samplesMenu);
    this._chooseOrClear = document.createElement('option');
    this._chooseOrClear.value = '';
    this._chooseOrClear.textContent = "Choose a Sample...";
    this._samplesMenu.appendChild(this._chooseOrClear);
    for (const id in this.samples) {
      var sample = this.samples[id];
      var option = document.createElement('option');
      option.value = id;
      option.textContent = sample.getName();
      this._samplesMenu.appendChild(option);
    };

    this._samplesMenu.onchange = this.chooseSample.bind(this);
  }

  chooseSample() {
    if (this._samplesMenu.value == '') {
      this.clearDisplayedSample();
      this._chooseOrClear.textContent = "Choose a Sample...";
    } else {
      this.displaySample(this.samples[this._samplesMenu.value]);
      this._chooseOrClear.textContent = "Clear...";
    }
  }

  displaySample(sample) {
    this._sampleControls.innerHTML = '';
    var description = document.createElement('div');
    description.className = 'openmapsamples-sample-description';
    description.innerHTML = sample.getDescription();
    this._sampleControls.appendChild(description);

    var label = document.createElement('label');
    label.htmlFor = 'openmapsamples-variant-select';
    label.textContent = "Variants: ";
    this._sampleControls.appendChild(label);

    this._variantSelect = document.createElement('select');
    this._variantSelect.className = 'openmapsamples-variant-select';
    this._variantSelect.id = 'openmapsamples-variant-select';
    this._sampleControls.appendChild(this._variantSelect);
    this.variant = sample.getZoom();
    const zoomVariants = sample.getZoomVariants();
    console.log(zoomVariants);
    var keys = Object.keys(zoomVariants);
    keys.sort((n1,n2) => n1 - n2)
    keys.forEach((key) => {
      var option = document.createElement('option');
      option.value = key;
      option.textContent = 'z=' + key;
      this._variantSelect.appendChild(option);
    });
    this._variantSelect.value = this.variant;
    this._variantSelect.onchange = this.changeVariant.bind(this, sample);


    // Save default source data and replace with sample data.
    this.restoreOriginalStyle();
    this.saveOriginalStyle();
    this.replaceStyleWithSampleData(sample);
    // Jump to our starting zoom/location.
    this._map.setCenter(sample.getCenter());
    this._map.setZoom(sample.getZoom());
  }

  clearDisplayedSample() {
    this._sampleControls.innerHTML = '';
    // Restore the original data.
    this.restoreOriginalStyle();
  }

  saveOriginalStyle() {
    if (!this.originalStyle) {
      this.originalStyle = this._map.getStyle();
      this.originalCenter = this._map.getCenter();
      this.originalZoom = this._map.getZoom();
    }
  }

  restoreOriginalStyle() {
    if (this.originalStyle) {
      this._map.setCenter(this.originalCenter);
      this._map.setZoom(this.originalZoom);
      this._map.setStyle(this.originalStyle);
      delete this.originalStyle;
    }
  }

  replaceStyleWithSampleData(sample) {
    var sampleControl = this;
    var style = this._map.getStyle();

    // Load a GeoJSON object and then filter what data is returned based off the feature's`layerId` property
    addProtocol('openmapsamples-' + sample.getId(), (params, cb) => {
      // console.log(params);
      const chunks = params.url.split('/');
      const layerId = chunks[2];
      const zoom = sampleControl.getSampleZoom(sample);
      if (sample.hasLayer(layerId)) {
        var ret = sample.getLayer(layerId).getGeoJson(zoom);
      } else {
        // Return empty data.
        var ret = new Layer().getGeoJson(zoom);
      }
      // console.log('openmapsamples-' + sample.getId(), { layerId, params, ret, chunks });
      return cb(null, ret);
    });

    var originalSourceIds = [];
    for (const layer of style.layers) {
      const layerId = layer['id'];
      const sourceId = layer['source'];
      const sourceLayerId =  layer['source-layer'];
      if (layerId && sourceId && sourceLayerId) {
        originalSourceIds.push(sourceId);
        // Swap the current source with our sample source.
        const sampleSourceId = 'openmapsamples-' + sample.getId() + '-' + sourceLayerId;
        style.sources[sampleSourceId] = {
          type: 'geojson',
          data: `openmapsamples-${sample.getId()}://${sourceLayerId}`,
        };

        layer['source'] = sampleSourceId;
        // geojson objects dont support 'source-layer'
        delete layer['source-layer'];
      }
    }

    // Clear out the original vector tile sources from the style.
    for (const originalSourceId in originalSourceIds) {
      delete style.sources[originalSourceId];
    }

    this._map.setStyle(style);
  }

  /**
   * Answer the zoom to use for loading sample data.
   *
   */
  getSampleZoom(sample) {
    let variants = sample.getZoomVariants();
    if (variants && variants[this.variant]) {
      return this.variant;
    } else {
      return sample.getZoom();
    }
  }

  /**
   * Change the selected variant.
   *
   */
  changeVariant(sample) {
    if (this.variant != this._variantSelect.value) {
      this.variant = this._variantSelect.value;

      // Save default source data and replace with sample data.
      this.restoreOriginalStyle();
      this.saveOriginalStyle();
      this.replaceStyleWithSampleData(sample);
      // Jump to our starting zoom/location.
      this._map.setCenter(sample.getZoomVariantCenter(this.variant));
      this._map.setZoom(this.variant);
    }
  }

}
