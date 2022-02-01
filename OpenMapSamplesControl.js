"use strict";

import { addProtocol } from 'maplibre-gl';
import './OpenMapSamplesControl.css';

/**
 * An example Sample class with function definitions.
 */
export default class SampleControl {

  constructor (options = {}) {
    this.sampleSets = [];
    this.options = options;
  }

  addSampleSet(sampleSet) {
    if (typeof sampleSet.getName !== "function") {
      throw "SampleSets must implement getName().";
    }
    if (typeof sampleSet.getDescription !== "function") {
      throw "SampleSets must implement getDescription().";
    }
    if (typeof sampleSet.getSamples !== "function") {
      throw "SampleSets must implement getSamples().";
    }

    this.sampleSets.push(sampleSet);
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

    if (!this._setsMenu) {
      this.initializeSetsMenu();
    }
    if (!this._setControls) {
      this._setControls = document.createElement('div');
      this._setControls.className = 'openmapsamples-set-controls';
      this._controls.appendChild(this._setControls);
    }

  }

  hideControls() {
    this._button.style.display = 'block';
    this._controls.style.display = 'none';
  }

  initializeSetsMenu() {
    this._setsMenu = document.createElement('select');
    this._setsMenu.className = 'openmapsamples-control-sets-menu';
    this._controls.appendChild(this._setsMenu);
    this._chooseOrClear = document.createElement('option');
    this._chooseOrClear.value = '';
    this._chooseOrClear.textContent = "Choose a Sample Set...";
    this._setsMenu.appendChild(this._chooseOrClear);
    this.sampleSets.forEach((sampleSet, i) => {
      var option = document.createElement('option');
      option.value = i;
      option.textContent = sampleSet.getName();
      this._setsMenu.appendChild(option);
    });

    this._setsMenu.onchange = this.chooseSet.bind(this);
  }

  chooseSet() {
    if (this._setsMenu.value == '') {
      this.clearDisplayedSampleSet();
      this._chooseOrClear.textContent = "Choose a Sample Set...";
    } else {
      this.displaySampleSet(this.sampleSets[this._setsMenu.value]);
      this._chooseOrClear.textContent = "Clear...";
    }

  }

  displaySampleSet(sampleSet) {
    this._setControls.innerHTML = '';
    var description = document.createElement('div');
    description.className = 'openmapsamples-set-description';
    description.textContent = sampleSet.getDescription();
    this._setControls.appendChild(description);

    // Provide back/forward controls for each sample.

    // Replace default data with sample data.
  }

  clearDisplayedSampleSet() {
    this._setControls.innerHTML = '';

    // Remove the sample data.

    // Restore the original data.
  }

}
