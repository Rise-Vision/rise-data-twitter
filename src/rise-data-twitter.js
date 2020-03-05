/* eslint-disable no-console, no-unused-vars */

import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { CacheMixin } from "rise-common-component/src/cache-mixin.js";
import { FetchMixin } from "rise-common-component/src/fetch-mixin.js";

import { config } from "./rise-data-twitter-config.js";
import { version } from "./rise-data-twitter-version.js";

const fetchBase = CacheMixin(RiseElement);

export default class RiseDataTwitter extends FetchMixin(fetchBase) {
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
      username: {
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
      "_reset(username, maxitems)"
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

    super.initFetch({
      refresh: 1000 * 60 * 30, // it will be overriden by service response headers
      retry: 1000 * 60 * 5,
      cooldown: 1000 * 60 * 10
    }, this._handleResponse, this._handleError);

    super.initCache({
      name: this.tagName.toLowerCase(),
      expiry: -1
    });
  }

  _reset() {
    if ( !this._initialStart ) {
      this._stop();
      this._start();
    }
  }

  _start() {
    this._loadTweets();
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

  _getUrl() {
    const companyId = RisePlayerConfiguration.getCompanyId();
    const username = this.username && this.username.indexOf("@") === 0 ?
      this.username.substring(1) : this.username;

    return `${
      config.twitterServiceURL
    }/get-tweets?companyId=${
      companyId
    }&username=${
      username
    }&count=${
      this.maxitems
    }`;
  }

  _loadTweets() {
    if (this.username) {
      super.fetch(this._getUrl(), {
        headers: { "X-Requested-With": "rise-data-twitter" }
      });
    }
  }

  _handleResponse(response) {
    return response.json()
      .then( json => {
        console.log(json); // TODO: send as event
      });
  }

  _handleError(error) {
    console.error(error); // TODO: handle properly
  }

}

customElements.define("rise-data-twitter", RiseDataTwitter);
