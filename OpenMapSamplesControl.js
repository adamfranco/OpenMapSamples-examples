"use strict";

import { addProtocol } from 'maplibre-gl';
import './OpenMapSamplesControl.css';

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
    description.textContent = sample.getDescription();
    this._sampleControls.appendChild(description);

    // Provide back/forward controls for each sample.

    // Replace default data with sample data.
  }

  clearDisplayedSample() {
    this._sampleControls.innerHTML = '';

    // Remove the sample data.

    // Restore the original data.
  }

}
