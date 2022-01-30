"use strict";

import { addProtocol } from 'maplibre-gl';

/**
 * An example Sample class with function definitions.
 */
export default class SampleControl {

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl';
    this._container.textContent = 'Hello, world';
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
