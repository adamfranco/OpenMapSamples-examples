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
    if (this.options['permalinks']) {
      this.permalinks = true;
    }
    else {
      this.permalinks = false;
    }
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
    this._container.className = 'maplibregl-ctrl mapboxgl-ctrl openmapsamples-control-container';

    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'maplibregl-ctrl-group mapboxgl-ctrl-group';
    this._container.appendChild(buttonWrapper);
    this._button = document.createElement('button');
    this._button.className = 'openmapsamples-control-button';
    buttonWrapper.appendChild(this._button);
    this._button.textContent = 'Samples';
    this._button.onclick = this.showControls.bind(this);

    this._controls = document.createElement('div');
    this._controls.className = 'openmapsamples-control-overlay';
    this._container.appendChild(this._controls);

    this._closer = document.createElement('button');
    this._closer.className = 'openmapsamples-control-closer';
    this._controls.appendChild(this._closer);
    this._closer.textContent = '×';
    this._closer.onclick = this.hideControls.bind(this);

    this._title = document.createElement('h2');
    this._title.className = 'openmapsamples-control-title';
    this._controls.appendChild(this._title);
    this._title.textContent = 'Samples';

    this.hideControls();

    // Try loading our sampledata if specified in the url.
    if (this.permalinks) {
      setTimeout(this.setStateFromUrl.bind(this), 2000);
      window.addEventListener("popstate", this.setStateFromUrl.bind(this));
    }

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

  updatePermalink() {
    if (this.permalinks) {
      var url = new URL(window.location.href);
      // Add/remove the active sample state.
      if (this.getActiveSampleId()) {
        url.searchParams.set('omss', this.getActiveSampleId());
        url.searchParams.set('omsv', this.getActiveSampleVariantId());
      } else {
        url.searchParams.delete('omss');
        url.searchParams.delete('omsv');
      }

      var state = {
        'hash': url.hash,
        'omss':this.getActiveSampleId(),
        'omsv': this.getActiveSampleVariantId(),
      };
      window.history.pushState(state, 'oms', url);
    }
  }

  setStateFromUrl() {
    if (this.permalinks) {
      const url = new URL(window.location.href);

      // Store incoming zoom and center for resetting after load of a sample.
      var zoom = null;
      var center = null;
      const hash = window.location.hash.replace('#', '');
      const parts = hash.split('/');
      if (parts.length === 3 || parts.length === 4) {
        zoom = parseFloat(parts[0]);
        center = [
          parseFloat(parts[2]),
          parseFloat(parts[1]),
        ];
      }

      const sampleId = url.searchParams.get('omss');
      if (sampleId) {
        this.showControls();
        this.setActiveSampleId(sampleId);

        const sampleVariantId = url.searchParams.get('omsv');
        if (sampleVariantId) {
          this.setActiveSampleVariantId(sampleVariantId);
        }
      } else if (this.getActiveSampleId()) {
        this.clearDisplayedSample();
      }


      // Reset zoom from URL.
      if (sampleId && zoom) {
        this._map.setZoom(zoom);
      }
      if (sampleId && center) {
        this._map.setCenter(center);
      }
    }
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

  getActiveSampleId() {
    if (this._samplesMenu) {
      return this._samplesMenu.value;
    } else {
      return null;
    }
  }

  getActiveSampleVariantId() {
    if (this._variantSelect) {
      return this._variantSelect.value;
    } else {
      return null;
    }
  }

  setActiveSampleId(id) {
    this._samplesMenu.value = id;
    this.chooseSample();
  }

  setActiveSampleVariantId(id) {
    if (this._variantSelect) {
      this._variantSelect.value = id;
      this.changeVariant(this.samples[this.getActiveSampleId()]);
    }
  }

  chooseSample() {
    if (this.getActiveSampleId() == '') {
      this.clearDisplayedSample();
      this._chooseOrClear.textContent = "Choose a Sample...";
      this.updatePermalink();
    } else {
      this.displaySample(this.samples[this.getActiveSampleId()]);
      this._chooseOrClear.textContent = "Clear...";
      this.updatePermalink();
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

    this._previousVariantButton = document.createElement('button');
    this._previousVariantButton.className = 'openmapsamples-variant-increment';
    this._previousVariantButton.id = 'openmapsamples-variant-previous';
    this._previousVariantButton.textContent = '◀︎';
    this._previousVariantButton.onclick = this.decrementVariant.bind(this, sample);
    this._sampleControls.appendChild(this._previousVariantButton);

    this._variantSelect = document.createElement('select');
    this._variantSelect.className = 'openmapsamples-variant-select';
    this._variantSelect.id = 'openmapsamples-variant-select';
    this._sampleControls.appendChild(this._variantSelect);
    this.variant = sample.getZoom();
    const zoomVariants = sample.getZoomVariants();
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

    this._nextVariantButton = document.createElement('button');
    this._nextVariantButton.className = 'openmapsamples-variant-increment';
    this._nextVariantButton.id = 'openmapsamples-variant-next';
    this._nextVariantButton.textContent = '►';
    this._nextVariantButton.onclick = this.incrementVariant.bind(this, sample);
    this._sampleControls.appendChild(this._nextVariantButton);

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
      this.updatePermalink();
    }
  }

  decrementVariant(sample) {
    if (this._variantSelect.selectedIndex > 0) {
      this._variantSelect.selectedIndex = this._variantSelect.selectedIndex - 1;
      this.changeVariant(sample);
    }
  }

  incrementVariant(sample) {
    if (this._variantSelect.selectedIndex < this._variantSelect.options.length) {
      this._variantSelect.selectedIndex = this._variantSelect.selectedIndex + 1;
      this.changeVariant(sample);
    }
  }

}
