/* eslint-disable no-console, no-unused-vars */

import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { version } from "./rise-data-twitter-version.js";

export default class RiseDataTwitter extends RiseElement {
  static get template() {
    // TODO: this is temporary for skeleton
    return html`<h1>Rise Data Twitter component</h1>`;
  }

  static get properties() {
    return {
      /**
       * The Twitter handle whose content will be retrieved. The @ symbol may be omitted.
       * If not provided at design time, users need to provide it on Attribute Editor.
       */
      account: {
        type: String,
        value: ""
      },
      /**
       * An integer between 1 and 100, indicating the number of items that will be provided to users of the component.
       */
      maxitems: {
        type: Number,
        value: 25
      }
    };
  }

  // Each item of observers array is a method name followed by
  // a comma-separated list of one or more dependencies.
  static get observers() {
    return [
      "_reset(account, maxitems)"
    ];
  }

  constructor() {
    super();

    this._setVersion( version );
    this._initialStart = true;
  }

  ready() {
    super.ready();

    this.addEventListener( "rise-presentation-play", () => this._reset());
    this.addEventListener( "rise-presentation-stop", () => this._stop());
  }

  _reset() {
    if ( !this._initialStart ) {
      this._stop();
      this._start();
    }
  }

  _start() {
    // TODO: coming soon ..
  }

  _stop() {
    // TODO: coming soon
  }

  _handleStart() {
    super._handleStart();

    if (this._initialStart) {
      this._initialStart = false;

      this._start();
    }
  }
}

customElements.define("rise-data-twitter", RiseDataTwitter);
