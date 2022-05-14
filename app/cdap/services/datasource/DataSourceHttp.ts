/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import uuidV4 from 'uuid/v4';
import ee from 'event-emitter';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/dom/ajax';
import WindowManager, { WINDOW_ON_BLUR, WINDOW_ON_FOCUS } from 'services/WindowManager';
import { objectQuery } from 'services/helpers';
import SystemDelayStore from 'services/SystemDelayStore';
import SystemDelayActions from 'services/SystemDelayStore/SystemDelayActions';
import globalEvents from 'services/global-events';
import Cookies from 'universal-cookie';
import LoadingIndicatorStore, {
  BACKENDSTATUS,
} from 'components/shared/LoadingIndicator/LoadingIndicatorStore';
import { IDataSource } from './IDataSource';
import { Subscription } from 'rxjs/Subscription';
import isNil from 'lodash/isNil';

const cookie = new Cookies();

const CDAP_API_VERSION = 'v3';
// FIXME (CDAP-14836): Right now this is scattered across node and client. Need to consolidate this.
const REQUEST_ORIGIN_ROUTER = 'ROUTER';

function isBackendDown(status) {
  return status === BACKENDSTATUS.NODESERVERDOWN || status === BACKENDSTATUS.BACKENDDOWN;
}

function debugLog(message) {
  if (window.CDAP_CONFIG.cdap.uiDebugEnabled) {
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}

interface IHeadersMap {
  [index: string]: string;
}

interface IParamsMap {
  [index: string]: any;
}

interface IInboundResource {
  id?: string;
  method?: string;
  suppressErrors?: boolean;
  json?: any;
  body?: any;
  data?: any;
  headers?: IHeadersMap;
  url?: string;
  requestOrigin?: string;
  contentType?: string;
  _cdapPath?: string;
  excludeFromHealthCheck?: boolean;
  apiVersion?: string;
  params?: IParamsMap;
  interval?: number;
}

interface IResource {
  id: string;
  method: string;
  suppressErrors: boolean;
  json?: any;
  body?: any;
  headers?: IHeadersMap;
  url?: string;
  requestOrigin?: string;
  interval?: ReturnType<typeof setTimeout>;
  intervalTime?: number;
}

interface IBinding {
  excludeFromHealthCheck: boolean;
  rx: Subject<any>;
  resource: IResource;
  type: 'POLL' | 'REQUEST';
}

interface IPollingMap {
  [index: string]: IBinding;
}

export default class Datasource implements IDataSource {
  public eventEmitter: ee;
  public polling: IPollingMap;
  public genericResponseHandlers: [() => boolean];
  public pausedPolling: boolean;
  public loadingIndicatorStoreSubscription: Subscription;

  constructor(genericResponseHandlers: [() => boolean] = [() => true]) {
    this.eventEmitter = ee(ee);
    this.polling = {};
    this.genericResponseHandlers = genericResponseHandlers;

    this.eventEmitter.on(WINDOW_ON_FOCUS, this.resumePoll.bind(this));
    this.eventEmitter.on(WINDOW_ON_BLUR, this.pausePoll.bind(this));
    SystemDelayStore.dispatch({
      type: SystemDelayActions.registerDataSource,
      payload: this,
    });

    this.pausedPolling = false;
    this.loadingIndicatorStoreSubscription = LoadingIndicatorStore.subscribe(() => {
      const { status } = LoadingIndicatorStore.getState();
      if (isBackendDown(status)) {
        debugLog('Pausing polling because backend appears down');
        this.pausePoll();
        this.pausedPolling = true;
      } else if (this.pausedPolling) {
        debugLog('Resuming polling because backend appears up');
        // TODO Resume polling with staggered timing?
        this.resumePoll();
        this.pausedPolling = false;
      }
    });
  }

  public getBindingsForHealthCheck() {
    const bindingsWithTime = {};
    // TODO This will allow callers to see the latency of polling calls
    // but not one-time requests. We should change the system delay feature
    // so that the data source collects latency data rather
    // then exposing request details
    Object.values(this.polling).forEach((binding) => {
      if (!binding.excludeFromHealthCheck) {
        const id = objectQuery(binding, 'resource', 'id');
        const requestTime = objectQuery(binding, 'resource', 'requestTime');
        bindingsWithTime[id] = requestTime;
      }
    });
    return bindingsWithTime;
  }

  public createResponseHandler(bindingInfo: IBinding) {
    return (ajaxResponse) => {
      const errorCode = objectQuery(ajaxResponse.response, 'errorCode') || null;
      this.eventEmitter.emit(globalEvents.API_ERROR, errorCode !== null);
      if (ajaxResponse.status > 299) {
        /**
         * There is an issue here. When backend goes down we stop all the poll
         * and inspite of stopping all polling calls and unsubscribing all subscribers
         * we still get the rx.error call which tries to set the observers length to 0
         * and errors out. This doesn't harm us today as when system comes up we refresh
         * the UI and everything loads.
         *
         * This is being wrapped in a try catch block in case the subscriber do not define
         * an error callback. Without this, the error will bubble up as an uncaught error
         * and terminate the socketData subscriber.
         */
        try {
          bindingInfo.rx.error({
            statusCode: ajaxResponse.statusCode,
            response: ajaxResponse.response || ajaxResponse.body || ajaxResponse.error,
          });
        } catch (e) {
          /* tslint:disable:no-console */
          console.groupCollapsed('Error: ' + ajaxResponse.resource.url);
          console.log('Resource', ajaxResponse.resource);
          console.log('Error', e);
          console.groupEnd();
          /* tslint:enable:no-console */
        }
      } else {
        debugLog(`Sending response to subscribers for ${bindingInfo.resource.id}`);
        bindingInfo.rx.next(ajaxResponse.response);

        if (bindingInfo.type === 'POLL') {
          this.startClientPoll(bindingInfo.resource.id);
        } else {
          bindingInfo.rx.complete();
        }
      }
    };
  }

  public request(resource: IInboundResource = {}) {
    const excludeFromHealthCheck = !!resource.excludeFromHealthCheck;
    const generatedResource: IResource = {
      id: resource.id || uuidV4(),
      json: resource.json === false ? false : true,
      method: resource.method || 'GET',
      suppressErrors: resource.suppressErrors || false,
    };

    if (resource.body) {
      generatedResource.body = JSON.stringify(resource.body);
    }
    if (resource.data) {
      generatedResource.body = resource.data;
    }
    if (resource.headers) {
      generatedResource.headers = resource.headers;
    } else {
      generatedResource.headers = {};
    }

    if (resource.contentType) {
      generatedResource.headers['Content-Type'] = resource.contentType;
    }
    if (!resource.url) {
      resource.url = resource._cdapPath;
      delete resource._cdapPath;
    }
    const apiVersion = resource.apiVersion || CDAP_API_VERSION;
    if (!resource.requestOrigin || resource.requestOrigin === REQUEST_ORIGIN_ROUTER) {
      resource.url = `/${apiVersion}${resource.url}`;
    }
    generatedResource.url = `/api${this.buildUrl(resource.url, resource.params)}`;

    if (resource.requestOrigin) {
      generatedResource.requestOrigin = resource.requestOrigin;
    } else {
      generatedResource.requestOrigin = REQUEST_ORIGIN_ROUTER;
    }

    if (objectQuery(window, 'CDAP_CONFIG', 'securityEnabled')) {
      const token = cookie.get('CDAP_Auth_Token');
      if (!isNil(token)) {
        generatedResource.headers.Authorization = `Bearer ${token}`;
      }
    }

    const subject = new Subject();

    // We are calling the same request from the polling function as well.
    // It is essentially requests every 10 seconds or so. So for those calls
    // the id is already added to the bindings.
    const bindingInfo: IBinding = {
      rx: subject,
      resource: generatedResource,
      type: 'REQUEST',
      excludeFromHealthCheck,
    };

    const responseHandler = this.createResponseHandler(bindingInfo);
    // TODO Handle network errors
    Observable.ajax(generatedResource).subscribe(responseHandler);
    return subject;
  }

  public poll(resource: IInboundResource = {}) {
    const excludeFromHealthCheck = !!resource.excludeFromHealthCheck;
    const id = uuidV4();
    const intervalTime = resource.interval || 10000;
    const generatedResource: IResource = {
      id,
      interval: null,
      intervalTime,
      json: resource.json || true,
      method: resource.method || 'GET',
      suppressErrors: resource.suppressErrors || false,
    };

    if (resource.body) {
      generatedResource.body = JSON.stringify(resource.body);
    }
    if (resource.data) {
      generatedResource.body = resource.data;
    }
    if (resource.headers) {
      generatedResource.headers = resource.headers;
    } else {
      generatedResource.headers = {};
    }

    if (!resource.url) {
      resource.url = resource._cdapPath;
      delete resource._cdapPath;
    }

    const apiVersion = resource.apiVersion || CDAP_API_VERSION;
    if (!resource.requestOrigin || resource.requestOrigin === REQUEST_ORIGIN_ROUTER) {
      resource.url = `/${apiVersion}${resource.url}`;
    }

    generatedResource.url = `/api${this.buildUrl(resource.url, resource.params)}`;

    if (window.CDAP_CONFIG.securityEnabled) {
      const token = cookie.get('CDAP_Auth_Token');
      if (!isNil(token)) {
        generatedResource.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (resource.requestOrigin) {
      generatedResource.requestOrigin = resource.requestOrigin;
    } else {
      generatedResource.requestOrigin = REQUEST_ORIGIN_ROUTER;
    }
    const subject = new Subject();

    // Wrap subject in an Observable for teardown
    const observable = Observable.create((obs) => {
      subject.subscribe(
        (data) => {
          obs.next(data);
        },
        (err) => {
          try {
            obs.error(err);
          } catch (e) {
            /* tslint:disable:no-console */
            console.groupCollapsed('Error: ' + resource.url);
            console.log('Resource', resource);
            console.log('Error', e);
            console.groupEnd();
            /* tslint:enable:no-console */
          }
        }
      );

      return () => {
        this.stopPoll(generatedResource.id);
      };
    });

    const bindingInfo: IBinding = {
      rx: subject,
      resource: generatedResource,
      type: 'POLL',
      excludeFromHealthCheck,
    };
    this.polling[generatedResource.id] = bindingInfo;

    debugLog(`Polling requested for ${generatedResource.id} URL ${generatedResource.url}`);

    const responseHandler = this.createResponseHandler(bindingInfo);
    Observable.ajax(generatedResource).subscribe(responseHandler);

    return observable;
  }

  public startClientPoll = (resourceId) => {
    const interval = objectQuery(this.polling, resourceId, 'resource', 'intervalTime');
    debugLog(`Setting timeout for ${resourceId} with interval ${interval}`);
    const intervalTimer = setTimeout(() => {
      const bindingInfo = this.polling[resourceId];
      const resource = objectQuery(bindingInfo, 'resource');
      if (!resource || !WindowManager.isWindowActive()) {
        clearTimeout(intervalTimer);
        return;
      }
      const responseHandler = this.createResponseHandler(bindingInfo);
      Observable.ajax(resource).subscribe(responseHandler);
    }, interval);
    return intervalTimer;
  };

  public stopPoll(resourceId) {
    let id;
    if (typeof resourceId === 'object' && resourceId !== null) {
      id = resourceId.params.pollId;
    } else {
      id = resourceId;
    }

    if (this.polling[id]) {
      debugLog(`Stopping polling for ${id}`);
      clearTimeout(this.polling[id].resource.interval);
      this.polling[id].rx.complete();
      delete this.polling[id];
    }
  }

  public pausePoll = () => {
    Object.keys(this.polling)
      .filter((subscriptionID) => this.polling[subscriptionID].type === 'POLL')
      .forEach((subscriptionID) => {
        clearTimeout(this.polling[subscriptionID].resource.interval);
        this.polling[subscriptionID].resource.interval = null;
      });
  };

  public resumePoll = () => {
    // TODO When resuming, should polling requests be staggered to avoid overloading the server?
    Object.keys(this.polling)
      .filter((subscriptionID) => this.polling[subscriptionID].type === 'POLL')
      .forEach((subscriptionID) => {
        this.polling[subscriptionID].resource.interval = this.startClientPoll(subscriptionID);
      });
  };

  public destroy() {
    // stopping existing polls
    for (const key in this.polling) {
      if (this.polling[key].type === 'POLL') {
        this.stopPoll(this.polling[key].resource.id);
      }
    }
    this.polling = {};
  }

  // TODO(https://cdap.atlassian.net/browse/CDAP-19018)
  // Update this function with modern APIs
  public buildUrl(url: string, params: IParamsMap = {}) {
    if (!params) {
      return url;
    }
    const parts = [];

    const forEachSorted = (obj: IParamsMap, iterator) => {
      const keys = Object.keys(params).sort();
      keys.forEach((key) => {
        iterator.call(null, obj[key], key);
      });
      return keys;
    };

    const encodeUriQuery = (val: string, pctEncodeSpaces?: boolean) => {
      return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
    };

    forEachSorted(params, (value, key) => {
      if (value === null || typeof value === 'undefined') {
        return;
      }
      if (!Array.isArray(value)) {
        value = [value];
      }

      value.forEach((v) => {
        if (typeof v === 'object' && v !== null) {
          if (value.toString() === '[object Date]') {
            v = v.toISOString();
          } else {
            v = JSON.stringify(v);
          }
        }
        parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
      });
    });
    if (parts.length > 0) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
    }
    return url;
  }
}
