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
    return {};
  }

  constructor() {
    super();

    this._setVersion( version );
  }
}

customElements.define("rise-data-twitter", RiseDataTwitter);
