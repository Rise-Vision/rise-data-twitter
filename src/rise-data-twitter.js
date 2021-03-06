/* global JSEncrypt */
/* eslint-disable no-console, no-unused-vars */

import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { CacheMixin } from "rise-common-component/src/cache-mixin.js";
import { FetchMixin } from "rise-common-component/src/fetch-mixin.js";

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
      },
      /**
       * A flag set to to identify if component configured from Apps Staging
       */
      isStaging: {
        type: Boolean
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
  static get PUBLIC_KEY() {
    return "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9eHOyNvEs7d0wuw7cHG1Hn+O4" +
    "YP2zpgpsKmRqTM93q/SGrGNi1AJEl1U8Hab9FWjdCtwZpIjwfqe77+IfQu5ioSzo" +
    "/+i1JmBBRZ/jNa1z08cWFYWv0DAWCzL5L8bIZjMbxPh1Bb1ycaA4SN8dFAiBkIrC" +
    "BMrE1bGUIm2MDs1kwwIDAQAB" +
    "-----END PUBLIC KEY-----";
  }
  static get SERVICE_URL_STAGING() {
    return "https://services-stage.risevision.com/twitter";
  }
  static get SERVICE_URL_PROD() {
    return "https://services.risevision.com/twitter";
  }

  constructor() {
    super();

    this._setVersion( version );
    this._initialStart = true;
  }

  ready() {
    super.ready();

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
      name: `${this.tagName.toLowerCase()}_v${version.charAt(0)}`,
      expiry: -1
    });
  }

  _reset() {
    if ( !this._initialStart ) {
      this._loadTweets();
    }
  }

  _handleStart() {
    super._handleStart();

    if (this._initialStart) {
      this._initialStart = false;

      this._loadTweets()
    }
  }

  _getServiceUrl() {
    if (RisePlayerConfiguration.isPreview()) {
      // On preview, if running in Apps staging, it is guaranteed the 'staging' version of templates are loaded, so we use the Helper function.
      // We use Helper function instead of isStaging attribute to account for initial selection of Template and no attribute data available yet.
      return RisePlayerConfiguration.Helpers.isStaging() ? RiseDataTwitter.SERVICE_URL_STAGING : RiseDataTwitter.SERVICE_URL_PROD;
    } else {
      // On a display player is guaranteed to load the 'stable' version of templates, so we need to check isStaging flag attribute.
      return this.isStaging ? RiseDataTwitter.SERVICE_URL_STAGING : RiseDataTwitter.SERVICE_URL_PROD;
    }
  }

  _getUsername() {
    return this.username && this.username.indexOf("@") === 0 ? this.username.substring(1) : this.username
  }

  _getUrl() {
    const presentationId = RisePlayerConfiguration.getPresentationId(),
      username = this._getUsername(),
      serviceUrl = this._getServiceUrl();

    if (!presentationId || !username) {
      return "";
    }

    return `${
      serviceUrl
    }/get-tweets-secure?presentationId=${
      presentationId
    }&componentId=${
      this.id
    }&username=${
      this._encryptParam(username)
    }&count=${
      this.maxitems
    }`;
  }

  _encryptParam(value) {
    let encrypt = new JSEncrypt();

    encrypt.setPublicKey(RiseDataTwitter.PUBLIC_KEY);
    return encodeURIComponent(encrypt.encrypt(value));
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

  _getCacheKey() {
    return `${this._getUsername()}_${this.maxitems}`;
  }

  logFetchError( err ) {
    const details = super.eventDetailFor( err );

    if ( err && err.isOffline ) {
      super.log( RiseDataTwitter.LOG_TYPE_WARNING, "client offline", null, details );
    } else {
      const errorCode = this._errorCodeForFetchError( err );

      super.log( RiseDataTwitter.LOG_TYPE_ERROR, "request error", { errorCode }, details );
    }
  }

  _errorCodeForFetchError(error) {
    if (!error || !error.status || error.status === 0) {
      // Could not connect to the Twitter Service
      return "E000000037";
    }

    if (error.status === RiseDataTwitter.BAD_REQUEST_ERROR) {
      // The Twitter component sent an invalid request to the Twitter Service.
      return "E000000095";
    }

    if (error.status === RiseDataTwitter.FORBIDDEN_ERROR) {
      // Twitter authentication credentials are missing or have expired.
      return "E000000096";
    }

    if (error.status === RiseDataTwitter.NOT_FOUND_ERROR && error.responseText && error.responseText.startsWith("Username not found:")) {
      // The Twitter Username could not be found.
      return "E000000099";
    }

    if (error.status === RiseDataTwitter.TOO_MANY_REQUESTS_ERROR) {
      // The Twitter Account has reached the quota limit for the statuses/user_timeline API within 15 minute window.
      return "E000000097";
    }

    /*
    This error code E000000098 is a catch all for problems with the Twitter Service. Possible issues are:
      - general unexpected problems with Twitter Service (500)
      - when presentation data not found from Core with the presentation id used in request (404)
      - a concurrent request for user timeline is loading and is severely delayed in completing (409)
      - any status codes unaccounted for
     */
    return "E000000098";
  }

  getCacheRequestKey() {
    return this._getCacheKey();
  }

  getCacheResponseKey() {
    return this._getCacheKey();
  }

}

customElements.define("rise-data-twitter", RiseDataTwitter);
