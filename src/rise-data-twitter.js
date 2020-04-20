/* global objectHash */
/* eslint-disable no-console, no-unused-vars */

import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { CacheMixin } from "rise-common-component/src/cache-mixin.js";
import { FetchMixin } from "rise-common-component/src/fetch-mixin.js";

import { config } from "./rise-data-twitter-config.js";
import { version } from "./rise-data-twitter-version.js";

const fetchBase = CacheMixin(RiseElement);

export default class RiseDataTwitter extends FetchMixin(fetchBase) {

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
      },
      /**
       * A timestamp set to the editor so the Preview component can update whenever credentials are updateed.
       */
      credentialsUpdated: {
        type: Number
      }
    };
  }

  // Each item of observers array is a method name followed by
  // a comma-separated list of one or more dependencies.
  static get observers() {
    return [
      "_reset(username, maxitems, credentialsUpdated)"
    ];
  }

  static get BAD_REQUEST_ERROR() {
    return 400;
  }
  static get FORBIDDEN_ERROR() {
    return 403;
  }
  static get NOT_FOUND_ERROR() {
    return 404;
  }
  static get TOO_MANY_REQUESTS_ERROR() {
    return 429;
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
      refresh: 1000 * 60 * 30,
      refreshFromCacheControlHeader: true, // Cache-Control expiration overrides refresh setting above
      retry: 1000 * 60,
      cooldown: 1000 * 60 * 15, // ensures it's outside Twitter's quota window
      avoidRetriesForStatusCodes: [
        RiseDataTwitter.BAD_REQUEST_ERROR, // this component is sending a malformed URL, this is a bug
        RiseDataTwitter.FORBIDDEN_ERROR, // invalid credentials, avoid immediate retries but cooldown will apply in case customer updates credentials in apps editor in the meantime
        RiseDataTwitter.TOO_MANY_REQUESTS_ERROR // quota error, wait until it's outside Twitter's quota window
      ]
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

  _computeHash(presentationId, componentId, username) {
    return objectHash( presentationId + componentId + username );
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
        this._sendTwitterEvent(RiseDataTwitter.EVENT_DATA_UPDATE, json);
      })
      .catch( err => {
        this._sendTwitterEvent(RiseDataTwitter.EVENT_DATA_ERROR, err);
      });
  }

  _handleError(err) {
    const error = err ? err.message : null;

    if (!(err && err.isOffline)) {
      this._sendTwitterEvent(RiseDataTwitter.EVENT_REQUEST_ERROR, { error });
    }
  }

  _sendTwitterEvent(name, detail) {
    super._sendEvent(name, detail);

    switch (name) {
      case RiseDataTwitter.EVENT_DATA_ERROR:
      case RiseDataTwitter.EVENT_REQUEST_ERROR:
        super._setUptimeError( true );
        break;
      case RiseDataTwitter.EVENT_DATA_UPDATE:
        super._setUptimeError( false );
        break;
      default:
    }
  }

  logTypeForFetchError(error) {
    if (!error || !error.status) {
      return RiseDataTwitter.LOG_TYPE_ERROR;
    }

    // Invalid/missing credentials or quota exceeded should not affect component reliability
    if (
      error.status === RiseDataTwitter.FORBIDDEN_ERROR ||
      error.status === RiseDataTwitter.TOO_MANY_REQUESTS_ERROR
    ) {
      return RiseDataTwitter.LOG_TYPE_WARNING;
    }

    // Invalid username should not affect component reliability
    if (
      error.status === RiseDataTwitter.NOT_FOUND_ERROR && error.responseText &&
      error.responseText.startsWith("Username not found:")
    ) {
      return RiseDataTwitter.LOG_TYPE_WARNING;
    }

    return RiseDataTwitter.LOG_TYPE_ERROR;
  }

}

customElements.define("rise-data-twitter", RiseDataTwitter);
