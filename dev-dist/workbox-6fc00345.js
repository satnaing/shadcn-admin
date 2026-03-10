define(['exports'], (function (exports) { 'use strict';

    // @ts-ignore
    try {
      self['workbox:core:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const logger = (() => {
      // Don't overwrite this value if it's already set.
      // See https://github.com/GoogleChrome/workbox/pull/2284#issuecomment-560470923
      if (!('__WB_DISABLE_DEV_LOGS' in globalThis)) {
        self.__WB_DISABLE_DEV_LOGS = false;
      }
      let inGroup = false;
      const methodToColorMap = {
        debug: `#7f8c8d`,
        log: `#2ecc71`,
        warn: `#f39c12`,
        error: `#c0392b`,
        groupCollapsed: `#3498db`,
        groupEnd: null // No colored prefix on groupEnd
      };
      const print = function (method, args) {
        if (self.__WB_DISABLE_DEV_LOGS) {
          return;
        }
        if (method === 'groupCollapsed') {
          // Safari doesn't print all console.groupCollapsed() arguments:
          // https://bugs.webkit.org/show_bug.cgi?id=182754
          if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            console[method](...args);
            return;
          }
        }
        const styles = [`background: ${methodToColorMap[method]}`, `border-radius: 0.5em`, `color: white`, `font-weight: bold`, `padding: 2px 0.5em`];
        // When in a group, the workbox prefix is not displayed.
        const logPrefix = inGroup ? [] : ['%cworkbox', styles.join(';')];
        console[method](...logPrefix, ...args);
        if (method === 'groupCollapsed') {
          inGroup = true;
        }
        if (method === 'groupEnd') {
          inGroup = false;
        }
      };
      // eslint-disable-next-line @typescript-eslint/ban-types
      const api = {};
      const loggerMethods = Object.keys(methodToColorMap);
      for (const key of loggerMethods) {
        const method = key;
        api[method] = (...args) => {
          print(method, args);
        };
      }
      return api;
    })();

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const messages$1 = {
      'invalid-value': ({
        paramName,
        validValueDescription,
        value
      }) => {
        if (!paramName || !validValueDescription) {
          throw new Error(`Unexpected input to 'invalid-value' error.`);
        }
        return `The '${paramName}' parameter was given a value with an ` + `unexpected value. ${validValueDescription} Received a value of ` + `${JSON.stringify(value)}.`;
      },
      'not-an-array': ({
        moduleName,
        className,
        funcName,
        paramName
      }) => {
        if (!moduleName || !className || !funcName || !paramName) {
          throw new Error(`Unexpected input to 'not-an-array' error.`);
        }
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${className}.${funcName}()' must be an array.`;
      },
      'incorrect-type': ({
        expectedType,
        paramName,
        moduleName,
        className,
        funcName
      }) => {
        if (!expectedType || !paramName || !moduleName || !funcName) {
          throw new Error(`Unexpected input to 'incorrect-type' error.`);
        }
        const classNameStr = className ? `${className}.` : '';
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${classNameStr}` + `${funcName}()' must be of type ${expectedType}.`;
      },
      'incorrect-class': ({
        expectedClassName,
        paramName,
        moduleName,
        className,
        funcName,
        isReturnValueProblem
      }) => {
        if (!expectedClassName || !moduleName || !funcName) {
          throw new Error(`Unexpected input to 'incorrect-class' error.`);
        }
        const classNameStr = className ? `${className}.` : '';
        if (isReturnValueProblem) {
          return `The return value from ` + `'${moduleName}.${classNameStr}${funcName}()' ` + `must be an instance of class ${expectedClassName}.`;
        }
        return `The parameter '${paramName}' passed into ` + `'${moduleName}.${classNameStr}${funcName}()' ` + `must be an instance of class ${expectedClassName}.`;
      },
      'missing-a-method': ({
        expectedMethod,
        paramName,
        moduleName,
        className,
        funcName
      }) => {
        if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
          throw new Error(`Unexpected input to 'missing-a-method' error.`);
        }
        return `${moduleName}.${className}.${funcName}() expected the ` + `'${paramName}' parameter to expose a '${expectedMethod}' method.`;
      },
      'add-to-cache-list-unexpected-type': ({
        entry
      }) => {
        return `An unexpected entry was passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' The entry ` + `'${JSON.stringify(entry)}' isn't supported. You must supply an array of ` + `strings with one or more characters, objects with a url property or ` + `Request objects.`;
      },
      'add-to-cache-list-conflicting-entries': ({
        firstEntry,
        secondEntry
      }) => {
        if (!firstEntry || !secondEntry) {
          throw new Error(`Unexpected input to ` + `'add-to-cache-list-duplicate-entries' error.`);
        }
        return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${firstEntry} but different revision details. Workbox is ` + `unable to cache and version the asset correctly. Please remove one ` + `of the entries.`;
      },
      'plugin-error-request-will-fetch': ({
        thrownErrorMessage
      }) => {
        if (!thrownErrorMessage) {
          throw new Error(`Unexpected input to ` + `'plugin-error-request-will-fetch', error.`);
        }
        return `An error was thrown by a plugins 'requestWillFetch()' method. ` + `The thrown error message was: '${thrownErrorMessage}'.`;
      },
      'invalid-cache-name': ({
        cacheNameId,
        value
      }) => {
        if (!cacheNameId) {
          throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
        }
        return `You must provide a name containing at least one character for ` + `setCacheDetails({${cacheNameId}: '...'}). Received a value of ` + `'${JSON.stringify(value)}'`;
      },
      'unregister-route-but-not-found-with-method': ({
        method
      }) => {
        if (!method) {
          throw new Error(`Unexpected input to ` + `'unregister-route-but-not-found-with-method' error.`);
        }
        return `The route you're trying to unregister was not  previously ` + `registered for the method type '${method}'.`;
      },
      'unregister-route-route-not-registered': () => {
        return `The route you're trying to unregister was not previously ` + `registered.`;
      },
      'queue-replay-failed': ({
        name
      }) => {
        return `Replaying the background sync queue '${name}' failed.`;
      },
      'duplicate-queue-name': ({
        name
      }) => {
        return `The Queue name '${name}' is already being used. ` + `All instances of backgroundSync.Queue must be given unique names.`;
      },
      'expired-test-without-max-age': ({
        methodName,
        paramName
      }) => {
        return `The '${methodName}()' method can only be used when the ` + `'${paramName}' is used in the constructor.`;
      },
      'unsupported-route-type': ({
        moduleName,
        className,
        funcName,
        paramName
      }) => {
        return `The supplied '${paramName}' parameter was an unsupported type. ` + `Please check the docs for ${moduleName}.${className}.${funcName} for ` + `valid input types.`;
      },
      'not-array-of-class': ({
        value,
        expectedClass,
        moduleName,
        className,
        funcName,
        paramName
      }) => {
        return `The supplied '${paramName}' parameter must be an array of ` + `'${expectedClass}' objects. Received '${JSON.stringify(value)},'. ` + `Please check the call to ${moduleName}.${className}.${funcName}() ` + `to fix the issue.`;
      },
      'max-entries-or-age-required': ({
        moduleName,
        className,
        funcName
      }) => {
        return `You must define either config.maxEntries or config.maxAgeSeconds` + `in ${moduleName}.${className}.${funcName}`;
      },
      'statuses-or-headers-required': ({
        moduleName,
        className,
        funcName
      }) => {
        return `You must define either config.statuses or config.headers` + `in ${moduleName}.${className}.${funcName}`;
      },
      'invalid-string': ({
        moduleName,
        funcName,
        paramName
      }) => {
        if (!paramName || !moduleName || !funcName) {
          throw new Error(`Unexpected input to 'invalid-string' error.`);
        }
        return `When using strings, the '${paramName}' parameter must start with ` + `'http' (for cross-origin matches) or '/' (for same-origin matches). ` + `Please see the docs for ${moduleName}.${funcName}() for ` + `more info.`;
      },
      'channel-name-required': () => {
        return `You must provide a channelName to construct a ` + `BroadcastCacheUpdate instance.`;
      },
      'invalid-responses-are-same-args': () => {
        return `The arguments passed into responsesAreSame() appear to be ` + `invalid. Please ensure valid Responses are used.`;
      },
      'expire-custom-caches-only': () => {
        return `You must provide a 'cacheName' property when using the ` + `expiration plugin with a runtime caching strategy.`;
      },
      'unit-must-be-bytes': ({
        normalizedRangeHeader
      }) => {
        if (!normalizedRangeHeader) {
          throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
        }
        return `The 'unit' portion of the Range header must be set to 'bytes'. ` + `The Range header provided was "${normalizedRangeHeader}"`;
      },
      'single-range-only': ({
        normalizedRangeHeader
      }) => {
        if (!normalizedRangeHeader) {
          throw new Error(`Unexpected input to 'single-range-only' error.`);
        }
        return `Multiple ranges are not supported. Please use a  single start ` + `value, and optional end value. The Range header provided was ` + `"${normalizedRangeHeader}"`;
      },
      'invalid-range-values': ({
        normalizedRangeHeader
      }) => {
        if (!normalizedRangeHeader) {
          throw new Error(`Unexpected input to 'invalid-range-values' error.`);
        }
        return `The Range header is missing both start and end values. At least ` + `one of those values is needed. The Range header provided was ` + `"${normalizedRangeHeader}"`;
      },
      'no-range-header': () => {
        return `No Range header was found in the Request provided.`;
      },
      'range-not-satisfiable': ({
        size,
        start,
        end
      }) => {
        return `The start (${start}) and end (${end}) values in the Range are ` + `not satisfiable by the cached response, which is ${size} bytes.`;
      },
      'attempt-to-cache-non-get-request': ({
        url,
        method
      }) => {
        return `Unable to cache '${url}' because it is a '${method}' request and ` + `only 'GET' requests can be cached.`;
      },
      'cache-put-with-no-response': ({
        url
      }) => {
        return `There was an attempt to cache '${url}' but the response was not ` + `defined.`;
      },
      'no-response': ({
        url,
        error
      }) => {
        let message = `The strategy could not generate a response for '${url}'.`;
        if (error) {
          message += ` The underlying error is ${error}.`;
        }
        return message;
      },
      'bad-precaching-response': ({
        url,
        status
      }) => {
        return `The precaching request for '${url}' failed` + (status ? ` with an HTTP status of ${status}.` : `.`);
      },
      'non-precached-url': ({
        url
      }) => {
        return `createHandlerBoundToURL('${url}') was called, but that URL is ` + `not precached. Please pass in a URL that is precached instead.`;
      },
      'add-to-cache-list-conflicting-integrities': ({
        url
      }) => {
        return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${url} with different integrity values. Please remove one of them.`;
      },
      'missing-precache-entry': ({
        cacheName,
        url
      }) => {
        return `Unable to find a precached response in ${cacheName} for ${url}.`;
      },
      'cross-origin-copy-response': ({
        origin
      }) => {
        return `workbox-core.copyResponse() can only be used with same-origin ` + `responses. It was passed a response with origin ${origin}.`;
      },
      'opaque-streams-source': ({
        type
      }) => {
        const message = `One of the workbox-streams sources resulted in an ` + `'${type}' response.`;
        if (type === 'opaqueredirect') {
          return `${message} Please do not use a navigation request that results ` + `in a redirect as a source.`;
        }
        return `${message} Please ensure your sources are CORS-enabled.`;
      }
    };

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const generatorFunction = (code, details = {}) => {
      const message = messages$1[code];
      if (!message) {
        throw new Error(`Unable to find message for code '${code}'.`);
      }
      return message(details);
    };
    const messageGenerator = generatorFunction;

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Workbox errors should be thrown with this class.
     * This allows use to ensure the type easily in tests,
     * helps developers identify errors from workbox
     * easily and allows use to optimise error
     * messages correctly.
     *
     * @private
     */
    class WorkboxError extends Error {
      /**
       *
       * @param {string} errorCode The error code that
       * identifies this particular error.
       * @param {Object=} details Any relevant arguments
       * that will help developers identify issues should
       * be added as a key on the context object.
       */
      constructor(errorCode, details) {
        const message = messageGenerator(errorCode, details);
        super(message);
        this.name = errorCode;
        this.details = details;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /*
     * This method throws if the supplied value is not an array.
     * The destructed values are required to produce a meaningful error for users.
     * The destructed and restructured object is so it's clear what is
     * needed.
     */
    const isArray = (value, details) => {
      if (!Array.isArray(value)) {
        throw new WorkboxError('not-an-array', details);
      }
    };
    const hasMethod = (object, expectedMethod, details) => {
      const type = typeof object[expectedMethod];
      if (type !== 'function') {
        details['expectedMethod'] = expectedMethod;
        throw new WorkboxError('missing-a-method', details);
      }
    };
    const isType = (object, expectedType, details) => {
      if (typeof object !== expectedType) {
        details['expectedType'] = expectedType;
        throw new WorkboxError('incorrect-type', details);
      }
    };
    const isInstance = (object,
    // Need the general type to do the check later.
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectedClass, details) => {
      if (!(object instanceof expectedClass)) {
        details['expectedClassName'] = expectedClass.name;
        throw new WorkboxError('incorrect-class', details);
      }
    };
    const isOneOf = (value, validValues, details) => {
      if (!validValues.includes(value)) {
        details['validValueDescription'] = `Valid values are ${JSON.stringify(validValues)}.`;
        throw new WorkboxError('invalid-value', details);
      }
    };
    const isArrayOfClass = (value,
    // Need general type to do check later.
    expectedClass,
    // eslint-disable-line
    details) => {
      const error = new WorkboxError('not-array-of-class', details);
      if (!Array.isArray(value)) {
        throw error;
      }
      for (const item of value) {
        if (!(item instanceof expectedClass)) {
          throw error;
        }
      }
    };
    const finalAssertExports = {
      hasMethod,
      isArray,
      isInstance,
      isOneOf,
      isType,
      isArrayOfClass
    };

    // @ts-ignore
    try {
      self['workbox:routing:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The default HTTP method, 'GET', used when there's no specific method
     * configured for a route.
     *
     * @type {string}
     *
     * @private
     */
    const defaultMethod = 'GET';
    /**
     * The list of valid HTTP methods associated with requests that could be routed.
     *
     * @type {Array<string>}
     *
     * @private
     */
    const validMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @param {function()|Object} handler Either a function, or an object with a
     * 'handle' method.
     * @return {Object} An object with a handle method.
     *
     * @private
     */
    const normalizeHandler = handler => {
      if (handler && typeof handler === 'object') {
        {
          finalAssertExports.hasMethod(handler, 'handle', {
            moduleName: 'workbox-routing',
            className: 'Route',
            funcName: 'constructor',
            paramName: 'handler'
          });
        }
        return handler;
      } else {
        {
          finalAssertExports.isType(handler, 'function', {
            moduleName: 'workbox-routing',
            className: 'Route',
            funcName: 'constructor',
            paramName: 'handler'
          });
        }
        return {
          handle: handler
        };
      }
    };

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A `Route` consists of a pair of callback functions, "match" and "handler".
     * The "match" callback determine if a route should be used to "handle" a
     * request by returning a non-falsy value if it can. The "handler" callback
     * is called when there is a match and should return a Promise that resolves
     * to a `Response`.
     *
     * @memberof workbox-routing
     */
    class Route {
      /**
       * Constructor for Route class.
       *
       * @param {workbox-routing~matchCallback} match
       * A callback function that determines whether the route matches a given
       * `fetch` event by returning a non-falsy value.
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resolving to a Response.
       * @param {string} [method='GET'] The HTTP method to match the Route
       * against.
       */
      constructor(match, handler, method = defaultMethod) {
        {
          finalAssertExports.isType(match, 'function', {
            moduleName: 'workbox-routing',
            className: 'Route',
            funcName: 'constructor',
            paramName: 'match'
          });
          if (method) {
            finalAssertExports.isOneOf(method, validMethods, {
              paramName: 'method'
            });
          }
        }
        // These values are referenced directly by Router so cannot be
        // altered by minificaton.
        this.handler = normalizeHandler(handler);
        this.match = match;
        this.method = method;
      }
      /**
       *
       * @param {workbox-routing-handlerCallback} handler A callback
       * function that returns a Promise resolving to a Response
       */
      setCatchHandler(handler) {
        this.catchHandler = normalizeHandler(handler);
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * RegExpRoute makes it easy to create a regular expression based
     * {@link workbox-routing.Route}.
     *
     * For same-origin requests the RegExp only needs to match part of the URL. For
     * requests against third-party servers, you must define a RegExp that matches
     * the start of the URL.
     *
     * @memberof workbox-routing
     * @extends workbox-routing.Route
     */
    class RegExpRoute extends Route {
      /**
       * If the regular expression contains
       * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
       * the captured values will be passed to the
       * {@link workbox-routing~handlerCallback} `params`
       * argument.
       *
       * @param {RegExp} regExp The regular expression to match against URLs.
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       * @param {string} [method='GET'] The HTTP method to match the Route
       * against.
       */
      constructor(regExp, handler, method) {
        {
          finalAssertExports.isInstance(regExp, RegExp, {
            moduleName: 'workbox-routing',
            className: 'RegExpRoute',
            funcName: 'constructor',
            paramName: 'pattern'
          });
        }
        const match = ({
          url
        }) => {
          const result = regExp.exec(url.href);
          // Return immediately if there's no match.
          if (!result) {
            return;
          }
          // Require that the match start at the first character in the URL string
          // if it's a cross-origin request.
          // See https://github.com/GoogleChrome/workbox/issues/281 for the context
          // behind this behavior.
          if (url.origin !== location.origin && result.index !== 0) {
            {
              logger.debug(`The regular expression '${regExp.toString()}' only partially matched ` + `against the cross-origin URL '${url.toString()}'. RegExpRoute's will only ` + `handle cross-origin requests if they match the entire URL.`);
            }
            return;
          }
          // If the route matches, but there aren't any capture groups defined, then
          // this will return [], which is truthy and therefore sufficient to
          // indicate a match.
          // If there are capture groups, then it will return their values.
          return result.slice(1);
        };
        super(match, handler, method);
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const getFriendlyURL = url => {
      const urlObj = new URL(String(url), location.href);
      // See https://github.com/GoogleChrome/workbox/issues/2323
      // We want to include everything, except for the origin if it's same-origin.
      return urlObj.href.replace(new RegExp(`^${location.origin}`), '');
    };

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The Router can be used to process a `FetchEvent` using one or more
     * {@link workbox-routing.Route}, responding with a `Response` if
     * a matching route exists.
     *
     * If no route matches a given a request, the Router will use a "default"
     * handler if one is defined.
     *
     * Should the matching Route throw an error, the Router will use a "catch"
     * handler if one is defined to gracefully deal with issues and respond with a
     * Request.
     *
     * If a request matches multiple routes, the **earliest** registered route will
     * be used to respond to the request.
     *
     * @memberof workbox-routing
     */
    class Router {
      /**
       * Initializes a new Router.
       */
      constructor() {
        this._routes = new Map();
        this._defaultHandlerMap = new Map();
      }
      /**
       * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
       * method name ('GET', etc.) to an array of all the corresponding `Route`
       * instances that are registered.
       */
      get routes() {
        return this._routes;
      }
      /**
       * Adds a fetch event listener to respond to events when a route matches
       * the event's request.
       */
      addFetchListener() {
        // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
        self.addEventListener('fetch', event => {
          const {
            request
          } = event;
          const responsePromise = this.handleRequest({
            request,
            event
          });
          if (responsePromise) {
            event.respondWith(responsePromise);
          }
        });
      }
      /**
       * Adds a message event listener for URLs to cache from the window.
       * This is useful to cache resources loaded on the page prior to when the
       * service worker started controlling it.
       *
       * The format of the message data sent from the window should be as follows.
       * Where the `urlsToCache` array may consist of URL strings or an array of
       * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
       *
       * ```
       * {
       *   type: 'CACHE_URLS',
       *   payload: {
       *     urlsToCache: [
       *       './script1.js',
       *       './script2.js',
       *       ['./script3.js', {mode: 'no-cors'}],
       *     ],
       *   },
       * }
       * ```
       */
      addCacheListener() {
        // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
        self.addEventListener('message', event => {
          // event.data is type 'any'
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (event.data && event.data.type === 'CACHE_URLS') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const {
              payload
            } = event.data;
            {
              logger.debug(`Caching URLs from the window`, payload.urlsToCache);
            }
            const requestPromises = Promise.all(payload.urlsToCache.map(entry => {
              if (typeof entry === 'string') {
                entry = [entry];
              }
              const request = new Request(...entry);
              return this.handleRequest({
                request,
                event
              });
              // TODO(philipwalton): TypeScript errors without this typecast for
              // some reason (probably a bug). The real type here should work but
              // doesn't: `Array<Promise<Response> | undefined>`.
            })); // TypeScript
            event.waitUntil(requestPromises);
            // If a MessageChannel was used, reply to the message on success.
            if (event.ports && event.ports[0]) {
              void requestPromises.then(() => event.ports[0].postMessage(true));
            }
          }
        });
      }
      /**
       * Apply the routing rules to a FetchEvent object to get a Response from an
       * appropriate Route's handler.
       *
       * @param {Object} options
       * @param {Request} options.request The request to handle.
       * @param {ExtendableEvent} options.event The event that triggered the
       *     request.
       * @return {Promise<Response>|undefined} A promise is returned if a
       *     registered route can handle the request. If there is no matching
       *     route and there's no `defaultHandler`, `undefined` is returned.
       */
      handleRequest({
        request,
        event
      }) {
        {
          finalAssertExports.isInstance(request, Request, {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'handleRequest',
            paramName: 'options.request'
          });
        }
        const url = new URL(request.url, location.href);
        if (!url.protocol.startsWith('http')) {
          {
            logger.debug(`Workbox Router only supports URLs that start with 'http'.`);
          }
          return;
        }
        const sameOrigin = url.origin === location.origin;
        const {
          params,
          route
        } = this.findMatchingRoute({
          event,
          request,
          sameOrigin,
          url
        });
        let handler = route && route.handler;
        const debugMessages = [];
        {
          if (handler) {
            debugMessages.push([`Found a route to handle this request:`, route]);
            if (params) {
              debugMessages.push([`Passing the following params to the route's handler:`, params]);
            }
          }
        }
        // If we don't have a handler because there was no matching route, then
        // fall back to defaultHandler if that's defined.
        const method = request.method;
        if (!handler && this._defaultHandlerMap.has(method)) {
          {
            debugMessages.push(`Failed to find a matching route. Falling ` + `back to the default handler for ${method}.`);
          }
          handler = this._defaultHandlerMap.get(method);
        }
        if (!handler) {
          {
            // No handler so Workbox will do nothing. If logs is set of debug
            // i.e. verbose, we should print out this information.
            logger.debug(`No route found for: ${getFriendlyURL(url)}`);
          }
          return;
        }
        {
          // We have a handler, meaning Workbox is going to handle the route.
          // print the routing details to the console.
          logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
          debugMessages.forEach(msg => {
            if (Array.isArray(msg)) {
              logger.log(...msg);
            } else {
              logger.log(msg);
            }
          });
          logger.groupEnd();
        }
        // Wrap in try and catch in case the handle method throws a synchronous
        // error. It should still callback to the catch handler.
        let responsePromise;
        try {
          responsePromise = handler.handle({
            url,
            request,
            event,
            params
          });
        } catch (err) {
          responsePromise = Promise.reject(err);
        }
        // Get route's catch handler, if it exists
        const catchHandler = route && route.catchHandler;
        if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
          responsePromise = responsePromise.catch(async err => {
            // If there's a route catch handler, process that first
            if (catchHandler) {
              {
                // Still include URL here as it will be async from the console group
                // and may not make sense without the URL
                logger.groupCollapsed(`Error thrown when responding to: ` + ` ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
                logger.error(`Error thrown by:`, route);
                logger.error(err);
                logger.groupEnd();
              }
              try {
                return await catchHandler.handle({
                  url,
                  request,
                  event,
                  params
                });
              } catch (catchErr) {
                if (catchErr instanceof Error) {
                  err = catchErr;
                }
              }
            }
            if (this._catchHandler) {
              {
                // Still include URL here as it will be async from the console group
                // and may not make sense without the URL
                logger.groupCollapsed(`Error thrown when responding to: ` + ` ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
                logger.error(`Error thrown by:`, route);
                logger.error(err);
                logger.groupEnd();
              }
              return this._catchHandler.handle({
                url,
                request,
                event
              });
            }
            throw err;
          });
        }
        return responsePromise;
      }
      /**
       * Checks a request and URL (and optionally an event) against the list of
       * registered routes, and if there's a match, returns the corresponding
       * route along with any params generated by the match.
       *
       * @param {Object} options
       * @param {URL} options.url
       * @param {boolean} options.sameOrigin The result of comparing `url.origin`
       *     against the current origin.
       * @param {Request} options.request The request to match.
       * @param {Event} options.event The corresponding event.
       * @return {Object} An object with `route` and `params` properties.
       *     They are populated if a matching route was found or `undefined`
       *     otherwise.
       */
      findMatchingRoute({
        url,
        sameOrigin,
        request,
        event
      }) {
        const routes = this._routes.get(request.method) || [];
        for (const route of routes) {
          let params;
          // route.match returns type any, not possible to change right now.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const matchResult = route.match({
            url,
            sameOrigin,
            request,
            event
          });
          if (matchResult) {
            {
              // Warn developers that using an async matchCallback is almost always
              // not the right thing to do.
              if (matchResult instanceof Promise) {
                logger.warn(`While routing ${getFriendlyURL(url)}, an async ` + `matchCallback function was used. Please convert the ` + `following route to use a synchronous matchCallback function:`, route);
              }
            }
            // See https://github.com/GoogleChrome/workbox/issues/2079
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            params = matchResult;
            if (Array.isArray(params) && params.length === 0) {
              // Instead of passing an empty array in as params, use undefined.
              params = undefined;
            } else if (matchResult.constructor === Object &&
            // eslint-disable-line
            Object.keys(matchResult).length === 0) {
              // Instead of passing an empty object in as params, use undefined.
              params = undefined;
            } else if (typeof matchResult === 'boolean') {
              // For the boolean value true (rather than just something truth-y),
              // don't set params.
              // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353
              params = undefined;
            }
            // Return early if have a match.
            return {
              route,
              params
            };
          }
        }
        // If no match was found above, return and empty object.
        return {};
      }
      /**
       * Define a default `handler` that's called when no routes explicitly
       * match the incoming request.
       *
       * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
       *
       * Without a default handler, unmatched requests will go against the
       * network as if there were no service worker present.
       *
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       * @param {string} [method='GET'] The HTTP method to associate with this
       * default handler. Each method has its own default.
       */
      setDefaultHandler(handler, method = defaultMethod) {
        this._defaultHandlerMap.set(method, normalizeHandler(handler));
      }
      /**
       * If a Route throws an error while handling a request, this `handler`
       * will be called and given a chance to provide a response.
       *
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       */
      setCatchHandler(handler) {
        this._catchHandler = normalizeHandler(handler);
      }
      /**
       * Registers a route with the router.
       *
       * @param {workbox-routing.Route} route The route to register.
       */
      registerRoute(route) {
        {
          finalAssertExports.isType(route, 'object', {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'registerRoute',
            paramName: 'route'
          });
          finalAssertExports.hasMethod(route, 'match', {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'registerRoute',
            paramName: 'route'
          });
          finalAssertExports.isType(route.handler, 'object', {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'registerRoute',
            paramName: 'route'
          });
          finalAssertExports.hasMethod(route.handler, 'handle', {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'registerRoute',
            paramName: 'route.handler'
          });
          finalAssertExports.isType(route.method, 'string', {
            moduleName: 'workbox-routing',
            className: 'Router',
            funcName: 'registerRoute',
            paramName: 'route.method'
          });
        }
        if (!this._routes.has(route.method)) {
          this._routes.set(route.method, []);
        }
        // Give precedence to all of the earlier routes by adding this additional
        // route to the end of the array.
        this._routes.get(route.method).push(route);
      }
      /**
       * Unregisters a route with the router.
       *
       * @param {workbox-routing.Route} route The route to unregister.
       */
      unregisterRoute(route) {
        if (!this._routes.has(route.method)) {
          throw new WorkboxError('unregister-route-but-not-found-with-method', {
            method: route.method
          });
        }
        const routeIndex = this._routes.get(route.method).indexOf(route);
        if (routeIndex > -1) {
          this._routes.get(route.method).splice(routeIndex, 1);
        } else {
          throw new WorkboxError('unregister-route-route-not-registered');
        }
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let defaultRouter;
    /**
     * Creates a new, singleton Router instance if one does not exist. If one
     * does already exist, that instance is returned.
     *
     * @private
     * @return {Router}
     */
    const getOrCreateDefaultRouter = () => {
      if (!defaultRouter) {
        defaultRouter = new Router();
        // The helpers that use the default Router assume these listeners exist.
        defaultRouter.addFetchListener();
        defaultRouter.addCacheListener();
      }
      return defaultRouter;
    };

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Easily register a RegExp, string, or function with a caching
     * strategy to a singleton Router instance.
     *
     * This method will generate a Route for you if needed and
     * call {@link workbox-routing.Router#registerRoute}.
     *
     * @param {RegExp|string|workbox-routing.Route~matchCallback|workbox-routing.Route} capture
     * If the capture param is a `Route`, all other arguments will be ignored.
     * @param {workbox-routing~handlerCallback} [handler] A callback
     * function that returns a Promise resulting in a Response. This parameter
     * is required if `capture` is not a `Route` object.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     * @return {workbox-routing.Route} The generated `Route`.
     *
     * @memberof workbox-routing
     */
    function registerRoute(capture, handler, method) {
      let route;
      if (typeof capture === 'string') {
        const captureUrl = new URL(capture, location.href);
        {
          if (!(capture.startsWith('/') || capture.startsWith('http'))) {
            throw new WorkboxError('invalid-string', {
              moduleName: 'workbox-routing',
              funcName: 'registerRoute',
              paramName: 'capture'
            });
          }
          // We want to check if Express-style wildcards are in the pathname only.
          // TODO: Remove this log message in v4.
          const valueToCheck = capture.startsWith('http') ? captureUrl.pathname : capture;
          // See https://github.com/pillarjs/path-to-regexp#parameters
          const wildcards = '[*:?+]';
          if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
            logger.debug(`The '$capture' parameter contains an Express-style wildcard ` + `character (${wildcards}). Strings are now always interpreted as ` + `exact matches; use a RegExp for partial or wildcard matches.`);
          }
        }
        const matchCallback = ({
          url
        }) => {
          {
            if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
              logger.debug(`${capture} only partially matches the cross-origin URL ` + `${url.toString()}. This route will only handle cross-origin requests ` + `if they match the entire URL.`);
            }
          }
          return url.href === captureUrl.href;
        };
        // If `capture` is a string then `handler` and `method` must be present.
        route = new Route(matchCallback, handler, method);
      } else if (capture instanceof RegExp) {
        // If `capture` is a `RegExp` then `handler` and `method` must be present.
        route = new RegExpRoute(capture, handler, method);
      } else if (typeof capture === 'function') {
        // If `capture` is a function then `handler` and `method` must be present.
        route = new Route(capture, handler, method);
      } else if (capture instanceof Route) {
        route = capture;
      } else {
        throw new WorkboxError('unsupported-route-type', {
          moduleName: 'workbox-routing',
          funcName: 'registerRoute',
          paramName: 'capture'
        });
      }
      const defaultRouter = getOrCreateDefaultRouter();
      defaultRouter.registerRoute(route);
      return route;
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const _cacheNameDetails = {
      googleAnalytics: 'googleAnalytics',
      precache: 'precache-v2',
      prefix: 'workbox',
      runtime: 'runtime',
      suffix: typeof registration !== 'undefined' ? registration.scope : ''
    };
    const _createCacheName = cacheName => {
      return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter(value => value && value.length > 0).join('-');
    };
    const eachCacheNameDetail = fn => {
      for (const key of Object.keys(_cacheNameDetails)) {
        fn(key);
      }
    };
    const cacheNames = {
      updateDetails: details => {
        eachCacheNameDetail(key => {
          if (typeof details[key] === 'string') {
            _cacheNameDetails[key] = details[key];
          }
        });
      },
      getGoogleAnalyticsName: userCacheName => {
        return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
      },
      getPrecacheName: userCacheName => {
        return userCacheName || _createCacheName(_cacheNameDetails.precache);
      },
      getPrefix: () => {
        return _cacheNameDetails.prefix;
      },
      getRuntimeName: userCacheName => {
        return userCacheName || _createCacheName(_cacheNameDetails.runtime);
      },
      getSuffix: () => {
        return _cacheNameDetails.suffix;
      }
    };

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A helper function that prevents a promise from being flagged as unused.
     *
     * @private
     **/
    function dontWaitFor(promise) {
      // Effective no-op.
      void promise.then(() => {});
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    // Callbacks to be executed whenever there's a quota error.
    // Can't change Function type right now.
    // eslint-disable-next-line @typescript-eslint/ban-types
    const quotaErrorCallbacks = new Set();

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Adds a function to the set of quotaErrorCallbacks that will be executed if
     * there's a quota error.
     *
     * @param {Function} callback
     * @memberof workbox-core
     */
    // Can't change Function type
    // eslint-disable-next-line @typescript-eslint/ban-types
    function registerQuotaErrorCallback(callback) {
      {
        finalAssertExports.isType(callback, 'function', {
          moduleName: 'workbox-core',
          funcName: 'register',
          paramName: 'callback'
        });
      }
      quotaErrorCallbacks.add(callback);
      {
        logger.log('Registered a callback to respond to quota errors.', callback);
      }
    }

    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function (n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }

    const instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);
    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
      return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
      return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
      const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
          request.removeEventListener('success', success);
          request.removeEventListener('error', error);
        };
        const success = () => {
          resolve(wrap(request.result));
          unlisten();
        };
        const error = () => {
          reject(request.error);
          unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
      });
      promise.then(value => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
          cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
      }).catch(() => {});
      // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
      // is because we create many promises from a single IDBRequest.
      reverseTransformCache.set(promise, request);
      return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
      // Early bail if we've already created a done promise for this transaction.
      if (transactionDoneMap.has(tx)) return;
      const done = new Promise((resolve, reject) => {
        const unlisten = () => {
          tx.removeEventListener('complete', complete);
          tx.removeEventListener('error', error);
          tx.removeEventListener('abort', error);
        };
        const complete = () => {
          resolve();
          unlisten();
        };
        const error = () => {
          reject(tx.error || new DOMException('AbortError', 'AbortError'));
          unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
      });
      // Cache it for later retrieval.
      transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
      get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
          // Special handling for transaction.done.
          if (prop === 'done') return transactionDoneMap.get(target);
          // Polyfill for objectStoreNames because of Edge.
          if (prop === 'objectStoreNames') {
            return target.objectStoreNames || transactionStoreNamesMap.get(target);
          }
          // Make tx.store return the only store in the transaction, or undefined if there are many.
          if (prop === 'store') {
            return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
          }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
      has(target, prop) {
        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
          return true;
        }
        return prop in target;
      }
    };
    function replaceTraps(callback) {
      idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
      // Due to expected object equality (which is enforced by the caching in `wrap`), we
      // only create one new func per func.
      // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
      if (func === IDBDatabase.prototype.transaction && !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
          const tx = func.call(unwrap(this), storeNames, ...args);
          transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
          return wrap(tx);
        };
      }
      // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
      // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
      // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
      // with real promises, so each advance methods returns a new promise for the cursor object, or
      // undefined if the end of the cursor has been reached.
      if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
          // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
          // the original object.
          func.apply(unwrap(this), args);
          return wrap(cursorRequestMap.get(this));
        };
      }
      return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
      };
    }
    function transformCachableValue(value) {
      if (typeof value === 'function') return wrapFunction(value);
      // This doesn't return, it just creates a 'done' promise for the transaction,
      // which is later returned for transaction.done (see idbObjectHandler).
      if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
      if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
      // Return the same value back if we're not going to transform it.
      return value;
    }
    function wrap(value) {
      // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
      // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
      if (value instanceof IDBRequest) return promisifyRequest(value);
      // If we've already transformed this value before, reuse the transformed value.
      // This is faster, but it also provides object equality.
      if (transformCache.has(value)) return transformCache.get(value);
      const newValue = transformCachableValue(value);
      // Not all types are transformed.
      // These may be primitive types, so they can't be WeakMap keys.
      if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
      }
      return newValue;
    }
    const unwrap = value => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB(name, version, {
      blocked,
      upgrade,
      blocking,
      terminated
    } = {}) {
      const request = indexedDB.open(name, version);
      const openPromise = wrap(request);
      if (upgrade) {
        request.addEventListener('upgradeneeded', event => {
          upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
      }
      if (blocked) {
        request.addEventListener('blocked', event => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
      }
      openPromise.then(db => {
        if (terminated) db.addEventListener('close', () => terminated());
        if (blocking) {
          db.addEventListener('versionchange', event => blocking(event.oldVersion, event.newVersion, event));
        }
      }).catch(() => {});
      return openPromise;
    }
    /**
     * Delete a database.
     *
     * @param name Name of the database.
     */
    function deleteDB(name, {
      blocked
    } = {}) {
      const request = indexedDB.deleteDatabase(name);
      if (blocked) {
        request.addEventListener('blocked', event => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
      }
      return wrap(request).then(() => undefined);
    }
    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
      if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
        return;
      }
      if (cachedMethods.get(prop)) return cachedMethods.get(prop);
      const targetFuncName = prop.replace(/FromIndex$/, '');
      const useIndex = prop !== targetFuncName;
      const isWrite = writeMethods.includes(targetFuncName);
      if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
        return;
      }
      const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex) target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
      };
      cachedMethods.set(prop, method);
      return method;
    }
    replaceTraps(oldTraps => _extends({}, oldTraps, {
      get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
      has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
    }));

    // @ts-ignore
    try {
      self['workbox:expiration:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const DB_NAME = 'workbox-expiration';
    const CACHE_OBJECT_STORE = 'cache-entries';
    const normalizeURL = unNormalizedUrl => {
      const url = new URL(unNormalizedUrl, location.href);
      url.hash = '';
      return url.href;
    };
    /**
     * Returns the timestamp model.
     *
     * @private
     */
    class CacheTimestampsModel {
      /**
       *
       * @param {string} cacheName
       *
       * @private
       */
      constructor(cacheName) {
        this._db = null;
        this._cacheName = cacheName;
      }
      /**
       * Performs an upgrade of indexedDB.
       *
       * @param {IDBPDatabase<CacheDbSchema>} db
       *
       * @private
       */
      _upgradeDb(db) {
        // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
        // have to use the `id` keyPath here and create our own values (a
        // concatenation of `url + cacheName`) instead of simply using
        // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.
        const objStore = db.createObjectStore(CACHE_OBJECT_STORE, {
          keyPath: 'id'
        });
        // TODO(philipwalton): once we don't have to support EdgeHTML, we can
        // create a single index with the keyPath `['cacheName', 'timestamp']`
        // instead of doing both these indexes.
        objStore.createIndex('cacheName', 'cacheName', {
          unique: false
        });
        objStore.createIndex('timestamp', 'timestamp', {
          unique: false
        });
      }
      /**
       * Performs an upgrade of indexedDB and deletes deprecated DBs.
       *
       * @param {IDBPDatabase<CacheDbSchema>} db
       *
       * @private
       */
      _upgradeDbAndDeleteOldDbs(db) {
        this._upgradeDb(db);
        if (this._cacheName) {
          void deleteDB(this._cacheName);
        }
      }
      /**
       * @param {string} url
       * @param {number} timestamp
       *
       * @private
       */
      async setTimestamp(url, timestamp) {
        url = normalizeURL(url);
        const entry = {
          url,
          timestamp,
          cacheName: this._cacheName,
          // Creating an ID from the URL and cache name won't be necessary once
          // Edge switches to Chromium and all browsers we support work with
          // array keyPaths.
          id: this._getId(url)
        };
        const db = await this.getDb();
        const tx = db.transaction(CACHE_OBJECT_STORE, 'readwrite', {
          durability: 'relaxed'
        });
        await tx.store.put(entry);
        await tx.done;
      }
      /**
       * Returns the timestamp stored for a given URL.
       *
       * @param {string} url
       * @return {number | undefined}
       *
       * @private
       */
      async getTimestamp(url) {
        const db = await this.getDb();
        const entry = await db.get(CACHE_OBJECT_STORE, this._getId(url));
        return entry === null || entry === void 0 ? void 0 : entry.timestamp;
      }
      /**
       * Iterates through all the entries in the object store (from newest to
       * oldest) and removes entries once either `maxCount` is reached or the
       * entry's timestamp is less than `minTimestamp`.
       *
       * @param {number} minTimestamp
       * @param {number} maxCount
       * @return {Array<string>}
       *
       * @private
       */
      async expireEntries(minTimestamp, maxCount) {
        const db = await this.getDb();
        let cursor = await db.transaction(CACHE_OBJECT_STORE).store.index('timestamp').openCursor(null, 'prev');
        const entriesToDelete = [];
        let entriesNotDeletedCount = 0;
        while (cursor) {
          const result = cursor.value;
          // TODO(philipwalton): once we can use a multi-key index, we
          // won't have to check `cacheName` here.
          if (result.cacheName === this._cacheName) {
            // Delete an entry if it's older than the max age or
            // if we already have the max number allowed.
            if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
              // TODO(philipwalton): we should be able to delete the
              // entry right here, but doing so causes an iteration
              // bug in Safari stable (fixed in TP). Instead we can
              // store the keys of the entries to delete, and then
              // delete the separate transactions.
              // https://github.com/GoogleChrome/workbox/issues/1978
              // cursor.delete();
              // We only need to return the URL, not the whole entry.
              entriesToDelete.push(cursor.value);
            } else {
              entriesNotDeletedCount++;
            }
          }
          cursor = await cursor.continue();
        }
        // TODO(philipwalton): once the Safari bug in the following issue is fixed,
        // we should be able to remove this loop and do the entry deletion in the
        // cursor loop above:
        // https://github.com/GoogleChrome/workbox/issues/1978
        const urlsDeleted = [];
        for (const entry of entriesToDelete) {
          await db.delete(CACHE_OBJECT_STORE, entry.id);
          urlsDeleted.push(entry.url);
        }
        return urlsDeleted;
      }
      /**
       * Takes a URL and returns an ID that will be unique in the object store.
       *
       * @param {string} url
       * @return {string}
       *
       * @private
       */
      _getId(url) {
        // Creating an ID from the URL and cache name won't be necessary once
        // Edge switches to Chromium and all browsers we support work with
        // array keyPaths.
        return this._cacheName + '|' + normalizeURL(url);
      }
      /**
       * Returns an open connection to the database.
       *
       * @private
       */
      async getDb() {
        if (!this._db) {
          this._db = await openDB(DB_NAME, 1, {
            upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
          });
        }
        return this._db;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The `CacheExpiration` class allows you define an expiration and / or
     * limit on the number of responses stored in a
     * [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
     *
     * @memberof workbox-expiration
     */
    class CacheExpiration {
      /**
       * To construct a new CacheExpiration instance you must provide at least
       * one of the `config` properties.
       *
       * @param {string} cacheName Name of the cache to apply restrictions to.
       * @param {Object} config
       * @param {number} [config.maxEntries] The maximum number of entries to cache.
       * Entries used the least will be removed as the maximum is reached.
       * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
       * it's treated as stale and removed.
       * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
       * that will be used when calling `delete()` on the cache.
       */
      constructor(cacheName, config = {}) {
        this._isRunning = false;
        this._rerunRequested = false;
        {
          finalAssertExports.isType(cacheName, 'string', {
            moduleName: 'workbox-expiration',
            className: 'CacheExpiration',
            funcName: 'constructor',
            paramName: 'cacheName'
          });
          if (!(config.maxEntries || config.maxAgeSeconds)) {
            throw new WorkboxError('max-entries-or-age-required', {
              moduleName: 'workbox-expiration',
              className: 'CacheExpiration',
              funcName: 'constructor'
            });
          }
          if (config.maxEntries) {
            finalAssertExports.isType(config.maxEntries, 'number', {
              moduleName: 'workbox-expiration',
              className: 'CacheExpiration',
              funcName: 'constructor',
              paramName: 'config.maxEntries'
            });
          }
          if (config.maxAgeSeconds) {
            finalAssertExports.isType(config.maxAgeSeconds, 'number', {
              moduleName: 'workbox-expiration',
              className: 'CacheExpiration',
              funcName: 'constructor',
              paramName: 'config.maxAgeSeconds'
            });
          }
        }
        this._maxEntries = config.maxEntries;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._matchOptions = config.matchOptions;
        this._cacheName = cacheName;
        this._timestampModel = new CacheTimestampsModel(cacheName);
      }
      /**
       * Expires entries for the given cache and given criteria.
       */
      async expireEntries() {
        if (this._isRunning) {
          this._rerunRequested = true;
          return;
        }
        this._isRunning = true;
        const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1000 : 0;
        const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
        // Delete URLs from the cache
        const cache = await self.caches.open(this._cacheName);
        for (const url of urlsExpired) {
          await cache.delete(url, this._matchOptions);
        }
        {
          if (urlsExpired.length > 0) {
            logger.groupCollapsed(`Expired ${urlsExpired.length} ` + `${urlsExpired.length === 1 ? 'entry' : 'entries'} and removed ` + `${urlsExpired.length === 1 ? 'it' : 'them'} from the ` + `'${this._cacheName}' cache.`);
            logger.log(`Expired the following ${urlsExpired.length === 1 ? 'URL' : 'URLs'}:`);
            urlsExpired.forEach(url => logger.log(`    ${url}`));
            logger.groupEnd();
          } else {
            logger.debug(`Cache expiration ran and found no entries to remove.`);
          }
        }
        this._isRunning = false;
        if (this._rerunRequested) {
          this._rerunRequested = false;
          dontWaitFor(this.expireEntries());
        }
      }
      /**
       * Update the timestamp for the given URL. This ensures the when
       * removing entries based on maximum entries, most recently used
       * is accurate or when expiring, the timestamp is up-to-date.
       *
       * @param {string} url
       */
      async updateTimestamp(url) {
        {
          finalAssertExports.isType(url, 'string', {
            moduleName: 'workbox-expiration',
            className: 'CacheExpiration',
            funcName: 'updateTimestamp',
            paramName: 'url'
          });
        }
        await this._timestampModel.setTimestamp(url, Date.now());
      }
      /**
       * Can be used to check if a URL has expired or not before it's used.
       *
       * This requires a look up from IndexedDB, so can be slow.
       *
       * Note: This method will not remove the cached entry, call
       * `expireEntries()` to remove indexedDB and Cache entries.
       *
       * @param {string} url
       * @return {boolean}
       */
      async isURLExpired(url) {
        if (!this._maxAgeSeconds) {
          {
            throw new WorkboxError(`expired-test-without-max-age`, {
              methodName: 'isURLExpired',
              paramName: 'maxAgeSeconds'
            });
          }
        } else {
          const timestamp = await this._timestampModel.getTimestamp(url);
          const expireOlderThan = Date.now() - this._maxAgeSeconds * 1000;
          return timestamp !== undefined ? timestamp < expireOlderThan : true;
        }
      }
      /**
       * Removes the IndexedDB object store used to keep track of cache expiration
       * metadata.
       */
      async delete() {
        // Make sure we don't attempt another rerun if we're called in the middle of
        // a cache expiration.
        this._rerunRequested = false;
        await this._timestampModel.expireEntries(Infinity); // Expires all.
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * This plugin can be used in a `workbox-strategy` to regularly enforce a
     * limit on the age and / or the number of cached requests.
     *
     * It can only be used with `workbox-strategy` instances that have a
     * [custom `cacheName` property set](/web/tools/workbox/guides/configure-workbox#custom_cache_names_in_strategies).
     * In other words, it can't be used to expire entries in strategy that uses the
     * default runtime cache name.
     *
     * Whenever a cached response is used or updated, this plugin will look
     * at the associated cache and remove any old or extra responses.
     *
     * When using `maxAgeSeconds`, responses may be used *once* after expiring
     * because the expiration clean up will not have occurred until *after* the
     * cached response has been used. If the response has a "Date" header, then
     * a light weight expiration check is performed and the response will not be
     * used immediately.
     *
     * When using `maxEntries`, the entry least-recently requested will be removed
     * from the cache first.
     *
     * @memberof workbox-expiration
     */
    class ExpirationPlugin {
      /**
       * @param {ExpirationPluginOptions} config
       * @param {number} [config.maxEntries] The maximum number of entries to cache.
       * Entries used the least will be removed as the maximum is reached.
       * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
       * it's treated as stale and removed.
       * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
       * that will be used when calling `delete()` on the cache.
       * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
       * automatic deletion if the available storage quota has been exceeded.
       */
      constructor(config = {}) {
        /**
         * A "lifecycle" callback that will be triggered automatically by the
         * `workbox-strategies` handlers when a `Response` is about to be returned
         * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
         * the handler. It allows the `Response` to be inspected for freshness and
         * prevents it from being used if the `Response`'s `Date` header value is
         * older than the configured `maxAgeSeconds`.
         *
         * @param {Object} options
         * @param {string} options.cacheName Name of the cache the response is in.
         * @param {Response} options.cachedResponse The `Response` object that's been
         *     read from a cache and whose freshness should be checked.
         * @return {Response} Either the `cachedResponse`, if it's
         *     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
         *
         * @private
         */
        this.cachedResponseWillBeUsed = async ({
          event,
          request,
          cacheName,
          cachedResponse
        }) => {
          if (!cachedResponse) {
            return null;
          }
          const isFresh = this._isResponseDateFresh(cachedResponse);
          // Expire entries to ensure that even if the expiration date has
          // expired, it'll only be used once.
          const cacheExpiration = this._getCacheExpiration(cacheName);
          dontWaitFor(cacheExpiration.expireEntries());
          // Update the metadata for the request URL to the current timestamp,
          // but don't `await` it as we don't want to block the response.
          const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
          if (event) {
            try {
              event.waitUntil(updateTimestampDone);
            } catch (error) {
              {
                // The event may not be a fetch event; only log the URL if it is.
                if ('request' in event) {
                  logger.warn(`Unable to ensure service worker stays alive when ` + `updating cache entry for ` + `'${getFriendlyURL(event.request.url)}'.`);
                }
              }
            }
          }
          return isFresh ? cachedResponse : null;
        };
        /**
         * A "lifecycle" callback that will be triggered automatically by the
         * `workbox-strategies` handlers when an entry is added to a cache.
         *
         * @param {Object} options
         * @param {string} options.cacheName Name of the cache that was updated.
         * @param {string} options.request The Request for the cached entry.
         *
         * @private
         */
        this.cacheDidUpdate = async ({
          cacheName,
          request
        }) => {
          {
            finalAssertExports.isType(cacheName, 'string', {
              moduleName: 'workbox-expiration',
              className: 'Plugin',
              funcName: 'cacheDidUpdate',
              paramName: 'cacheName'
            });
            finalAssertExports.isInstance(request, Request, {
              moduleName: 'workbox-expiration',
              className: 'Plugin',
              funcName: 'cacheDidUpdate',
              paramName: 'request'
            });
          }
          const cacheExpiration = this._getCacheExpiration(cacheName);
          await cacheExpiration.updateTimestamp(request.url);
          await cacheExpiration.expireEntries();
        };
        {
          if (!(config.maxEntries || config.maxAgeSeconds)) {
            throw new WorkboxError('max-entries-or-age-required', {
              moduleName: 'workbox-expiration',
              className: 'Plugin',
              funcName: 'constructor'
            });
          }
          if (config.maxEntries) {
            finalAssertExports.isType(config.maxEntries, 'number', {
              moduleName: 'workbox-expiration',
              className: 'Plugin',
              funcName: 'constructor',
              paramName: 'config.maxEntries'
            });
          }
          if (config.maxAgeSeconds) {
            finalAssertExports.isType(config.maxAgeSeconds, 'number', {
              moduleName: 'workbox-expiration',
              className: 'Plugin',
              funcName: 'constructor',
              paramName: 'config.maxAgeSeconds'
            });
          }
        }
        this._config = config;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._cacheExpirations = new Map();
        if (config.purgeOnQuotaError) {
          registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
        }
      }
      /**
       * A simple helper method to return a CacheExpiration instance for a given
       * cache name.
       *
       * @param {string} cacheName
       * @return {CacheExpiration}
       *
       * @private
       */
      _getCacheExpiration(cacheName) {
        if (cacheName === cacheNames.getRuntimeName()) {
          throw new WorkboxError('expire-custom-caches-only');
        }
        let cacheExpiration = this._cacheExpirations.get(cacheName);
        if (!cacheExpiration) {
          cacheExpiration = new CacheExpiration(cacheName, this._config);
          this._cacheExpirations.set(cacheName, cacheExpiration);
        }
        return cacheExpiration;
      }
      /**
       * @param {Response} cachedResponse
       * @return {boolean}
       *
       * @private
       */
      _isResponseDateFresh(cachedResponse) {
        if (!this._maxAgeSeconds) {
          // We aren't expiring by age, so return true, it's fresh
          return true;
        }
        // Check if the 'date' header will suffice a quick expiration check.
        // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
        // discussion.
        const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
        if (dateHeaderTimestamp === null) {
          // Unable to parse date, so assume it's fresh.
          return true;
        }
        // If we have a valid headerTime, then our response is fresh iff the
        // headerTime plus maxAgeSeconds is greater than the current time.
        const now = Date.now();
        return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1000;
      }
      /**
       * This method will extract the data header and parse it into a useful
       * value.
       *
       * @param {Response} cachedResponse
       * @return {number|null}
       *
       * @private
       */
      _getDateHeaderTimestamp(cachedResponse) {
        if (!cachedResponse.headers.has('date')) {
          return null;
        }
        const dateHeader = cachedResponse.headers.get('date');
        const parsedDate = new Date(dateHeader);
        const headerTime = parsedDate.getTime();
        // If the Date header was invalid for some reason, parsedDate.getTime()
        // will return NaN.
        if (isNaN(headerTime)) {
          return null;
        }
        return headerTime;
      }
      /**
       * This is a helper method that performs two operations:
       *
       * - Deletes *all* the underlying Cache instances associated with this plugin
       * instance, by calling caches.delete() on your behalf.
       * - Deletes the metadata from IndexedDB used to keep track of expiration
       * details for each Cache instance.
       *
       * When using cache expiration, calling this method is preferable to calling
       * `caches.delete()` directly, since this will ensure that the IndexedDB
       * metadata is also cleanly removed and open IndexedDB instances are deleted.
       *
       * Note that if you're *not* using cache expiration for a given cache, calling
       * `caches.delete()` and passing in the cache's name should be sufficient.
       * There is no Workbox-specific method needed for cleanup in that case.
       */
      async deleteCacheAndMetadata() {
        // Do this one at a time instead of all at once via `Promise.all()` to
        // reduce the chance of inconsistency if a promise rejects.
        for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
          await self.caches.delete(cacheName);
          await cacheExpiration.delete();
        }
        // Reset this._cacheExpirations to its initial state.
        this._cacheExpirations = new Map();
      }
    }

    // @ts-ignore
    try {
      self['workbox:cacheable-response:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * This class allows you to set up rules determining what
     * status codes and/or headers need to be present in order for a
     * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
     * to be considered cacheable.
     *
     * @memberof workbox-cacheable-response
     */
    class CacheableResponse {
      /**
       * To construct a new CacheableResponse instance you must provide at least
       * one of the `config` properties.
       *
       * If both `statuses` and `headers` are specified, then both conditions must
       * be met for the `Response` to be considered cacheable.
       *
       * @param {Object} config
       * @param {Array<number>} [config.statuses] One or more status codes that a
       * `Response` can have and be considered cacheable.
       * @param {Object<string,string>} [config.headers] A mapping of header names
       * and expected values that a `Response` can have and be considered cacheable.
       * If multiple headers are provided, only one needs to be present.
       */
      constructor(config = {}) {
        {
          if (!(config.statuses || config.headers)) {
            throw new WorkboxError('statuses-or-headers-required', {
              moduleName: 'workbox-cacheable-response',
              className: 'CacheableResponse',
              funcName: 'constructor'
            });
          }
          if (config.statuses) {
            finalAssertExports.isArray(config.statuses, {
              moduleName: 'workbox-cacheable-response',
              className: 'CacheableResponse',
              funcName: 'constructor',
              paramName: 'config.statuses'
            });
          }
          if (config.headers) {
            finalAssertExports.isType(config.headers, 'object', {
              moduleName: 'workbox-cacheable-response',
              className: 'CacheableResponse',
              funcName: 'constructor',
              paramName: 'config.headers'
            });
          }
        }
        this._statuses = config.statuses;
        this._headers = config.headers;
      }
      /**
       * Checks a response to see whether it's cacheable or not, based on this
       * object's configuration.
       *
       * @param {Response} response The response whose cacheability is being
       * checked.
       * @return {boolean} `true` if the `Response` is cacheable, and `false`
       * otherwise.
       */
      isResponseCacheable(response) {
        {
          finalAssertExports.isInstance(response, Response, {
            moduleName: 'workbox-cacheable-response',
            className: 'CacheableResponse',
            funcName: 'isResponseCacheable',
            paramName: 'response'
          });
        }
        let cacheable = true;
        if (this._statuses) {
          cacheable = this._statuses.includes(response.status);
        }
        if (this._headers && cacheable) {
          cacheable = Object.keys(this._headers).some(headerName => {
            return response.headers.get(headerName) === this._headers[headerName];
          });
        }
        {
          if (!cacheable) {
            logger.groupCollapsed(`The request for ` + `'${getFriendlyURL(response.url)}' returned a response that does ` + `not meet the criteria for being cached.`);
            logger.groupCollapsed(`View cacheability criteria here.`);
            logger.log(`Cacheable statuses: ` + JSON.stringify(this._statuses));
            logger.log(`Cacheable headers: ` + JSON.stringify(this._headers, null, 2));
            logger.groupEnd();
            const logFriendlyHeaders = {};
            response.headers.forEach((value, key) => {
              logFriendlyHeaders[key] = value;
            });
            logger.groupCollapsed(`View response status and headers here.`);
            logger.log(`Response status: ${response.status}`);
            logger.log(`Response headers: ` + JSON.stringify(logFriendlyHeaders, null, 2));
            logger.groupEnd();
            logger.groupCollapsed(`View full response details here.`);
            logger.log(response.headers);
            logger.log(response);
            logger.groupEnd();
            logger.groupEnd();
          }
        }
        return cacheable;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
     * easier to add in cacheability checks to requests made via Workbox's built-in
     * strategies.
     *
     * @memberof workbox-cacheable-response
     */
    class CacheableResponsePlugin {
      /**
       * To construct a new CacheableResponsePlugin instance you must provide at
       * least one of the `config` properties.
       *
       * If both `statuses` and `headers` are specified, then both conditions must
       * be met for the `Response` to be considered cacheable.
       *
       * @param {Object} config
       * @param {Array<number>} [config.statuses] One or more status codes that a
       * `Response` can have and be considered cacheable.
       * @param {Object<string,string>} [config.headers] A mapping of header names
       * and expected values that a `Response` can have and be considered cacheable.
       * If multiple headers are provided, only one needs to be present.
       */
      constructor(config) {
        /**
         * @param {Object} options
         * @param {Response} options.response
         * @return {Response|null}
         * @private
         */
        this.cacheWillUpdate = async ({
          response
        }) => {
          if (this._cacheableResponse.isResponseCacheable(response)) {
            return response;
          }
          return null;
        };
        this._cacheableResponse = new CacheableResponse(config);
      }
    }

    // @ts-ignore
    try {
      self['workbox:strategies:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const cacheOkAndOpaquePlugin = {
      /**
       * Returns a valid response (to allow caching) if the status is 200 (OK) or
       * 0 (opaque).
       *
       * @param {Object} options
       * @param {Response} options.response
       * @return {Response|null}
       *
       * @private
       */
      cacheWillUpdate: async ({
        response
      }) => {
        if (response.status === 200 || response.status === 0) {
          return response;
        }
        return null;
      }
    };

    /*
      Copyright 2020 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    function stripParams(fullURL, ignoreParams) {
      const strippedURL = new URL(fullURL);
      for (const param of ignoreParams) {
        strippedURL.searchParams.delete(param);
      }
      return strippedURL.href;
    }
    /**
     * Matches an item in the cache, ignoring specific URL params. This is similar
     * to the `ignoreSearch` option, but it allows you to ignore just specific
     * params (while continuing to match on the others).
     *
     * @private
     * @param {Cache} cache
     * @param {Request} request
     * @param {Object} matchOptions
     * @param {Array<string>} ignoreParams
     * @return {Promise<Response|undefined>}
     */
    async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
      const strippedRequestURL = stripParams(request.url, ignoreParams);
      // If the request doesn't include any ignored params, match as normal.
      if (request.url === strippedRequestURL) {
        return cache.match(request, matchOptions);
      }
      // Otherwise, match by comparing keys
      const keysOptions = Object.assign(Object.assign({}, matchOptions), {
        ignoreSearch: true
      });
      const cacheKeys = await cache.keys(request, keysOptions);
      for (const cacheKey of cacheKeys) {
        const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
        if (strippedRequestURL === strippedCacheKeyURL) {
          return cache.match(cacheKey, matchOptions);
        }
      }
      return;
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The Deferred class composes Promises in a way that allows for them to be
     * resolved or rejected from outside the constructor. In most cases promises
     * should be used directly, but Deferreds can be necessary when the logic to
     * resolve a promise must be separate.
     *
     * @private
     */
    class Deferred {
      /**
       * Creates a promise and exposes its resolve and reject functions as methods.
       */
      constructor() {
        this.promise = new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Runs all of the callback functions, one at a time sequentially, in the order
     * in which they were registered.
     *
     * @memberof workbox-core
     * @private
     */
    async function executeQuotaErrorCallbacks() {
      {
        logger.log(`About to run ${quotaErrorCallbacks.size} ` + `callbacks to clean up caches.`);
      }
      for (const callback of quotaErrorCallbacks) {
        await callback();
        {
          logger.log(callback, 'is complete.');
        }
      }
      {
        logger.log('Finished running callbacks.');
      }
    }

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Returns a promise that resolves and the passed number of milliseconds.
     * This utility is an async/await-friendly version of `setTimeout`.
     *
     * @param {number} ms
     * @return {Promise}
     * @private
     */
    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    function toRequest(input) {
      return typeof input === 'string' ? new Request(input) : input;
    }
    /**
     * A class created every time a Strategy instance calls
     * {@link workbox-strategies.Strategy~handle} or
     * {@link workbox-strategies.Strategy~handleAll} that wraps all fetch and
     * cache actions around plugin callbacks and keeps track of when the strategy
     * is "done" (i.e. all added `event.waitUntil()` promises have resolved).
     *
     * @memberof workbox-strategies
     */
    class StrategyHandler {
      /**
       * Creates a new instance associated with the passed strategy and event
       * that's handling the request.
       *
       * The constructor also initializes the state that will be passed to each of
       * the plugins handling this request.
       *
       * @param {workbox-strategies.Strategy} strategy
       * @param {Object} options
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params] The return value from the
       *     {@link workbox-routing~matchCallback} (if applicable).
       */
      constructor(strategy, options) {
        this._cacheKeys = {};
        /**
         * The request the strategy is performing (passed to the strategy's
         * `handle()` or `handleAll()` method).
         * @name request
         * @instance
         * @type {Request}
         * @memberof workbox-strategies.StrategyHandler
         */
        /**
         * The event associated with this request.
         * @name event
         * @instance
         * @type {ExtendableEvent}
         * @memberof workbox-strategies.StrategyHandler
         */
        /**
         * A `URL` instance of `request.url` (if passed to the strategy's
         * `handle()` or `handleAll()` method).
         * Note: the `url` param will be present if the strategy was invoked
         * from a workbox `Route` object.
         * @name url
         * @instance
         * @type {URL|undefined}
         * @memberof workbox-strategies.StrategyHandler
         */
        /**
         * A `param` value (if passed to the strategy's
         * `handle()` or `handleAll()` method).
         * Note: the `param` param will be present if the strategy was invoked
         * from a workbox `Route` object and the
         * {@link workbox-routing~matchCallback} returned
         * a truthy value (it will be that value).
         * @name params
         * @instance
         * @type {*|undefined}
         * @memberof workbox-strategies.StrategyHandler
         */
        {
          finalAssertExports.isInstance(options.event, ExtendableEvent, {
            moduleName: 'workbox-strategies',
            className: 'StrategyHandler',
            funcName: 'constructor',
            paramName: 'options.event'
          });
        }
        Object.assign(this, options);
        this.event = options.event;
        this._strategy = strategy;
        this._handlerDeferred = new Deferred();
        this._extendLifetimePromises = [];
        // Copy the plugins list (since it's mutable on the strategy),
        // so any mutations don't affect this handler instance.
        this._plugins = [...strategy.plugins];
        this._pluginStateMap = new Map();
        for (const plugin of this._plugins) {
          this._pluginStateMap.set(plugin, {});
        }
        this.event.waitUntil(this._handlerDeferred.promise);
      }
      /**
       * Fetches a given request (and invokes any applicable plugin callback
       * methods) using the `fetchOptions` (for non-navigation requests) and
       * `plugins` defined on the `Strategy` object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - `requestWillFetch()`
       * - `fetchDidSucceed()`
       * - `fetchDidFail()`
       *
       * @param {Request|string} input The URL or request to fetch.
       * @return {Promise<Response>}
       */
      async fetch(input) {
        const {
          event
        } = this;
        let request = toRequest(input);
        if (request.mode === 'navigate' && event instanceof FetchEvent && event.preloadResponse) {
          const possiblePreloadResponse = await event.preloadResponse;
          if (possiblePreloadResponse) {
            {
              logger.log(`Using a preloaded navigation response for ` + `'${getFriendlyURL(request.url)}'`);
            }
            return possiblePreloadResponse;
          }
        }
        // If there is a fetchDidFail plugin, we need to save a clone of the
        // original request before it's either modified by a requestWillFetch
        // plugin or before the original request's body is consumed via fetch().
        const originalRequest = this.hasCallback('fetchDidFail') ? request.clone() : null;
        try {
          for (const cb of this.iterateCallbacks('requestWillFetch')) {
            request = await cb({
              request: request.clone(),
              event
            });
          }
        } catch (err) {
          if (err instanceof Error) {
            throw new WorkboxError('plugin-error-request-will-fetch', {
              thrownErrorMessage: err.message
            });
          }
        }
        // The request can be altered by plugins with `requestWillFetch` making
        // the original request (most likely from a `fetch` event) different
        // from the Request we make. Pass both to `fetchDidFail` to aid debugging.
        const pluginFilteredRequest = request.clone();
        try {
          let fetchResponse;
          // See https://github.com/GoogleChrome/workbox/issues/1796
          fetchResponse = await fetch(request, request.mode === 'navigate' ? undefined : this._strategy.fetchOptions);
          if ("development" !== 'production') {
            logger.debug(`Network request for ` + `'${getFriendlyURL(request.url)}' returned a response with ` + `status '${fetchResponse.status}'.`);
          }
          for (const callback of this.iterateCallbacks('fetchDidSucceed')) {
            fetchResponse = await callback({
              event,
              request: pluginFilteredRequest,
              response: fetchResponse
            });
          }
          return fetchResponse;
        } catch (error) {
          {
            logger.log(`Network request for ` + `'${getFriendlyURL(request.url)}' threw an error.`, error);
          }
          // `originalRequest` will only exist if a `fetchDidFail` callback
          // is being used (see above).
          if (originalRequest) {
            await this.runCallbacks('fetchDidFail', {
              error: error,
              event,
              originalRequest: originalRequest.clone(),
              request: pluginFilteredRequest.clone()
            });
          }
          throw error;
        }
      }
      /**
       * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
       * the response generated by `this.fetch()`.
       *
       * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
       * so you do not have to manually call `waitUntil()` on the event.
       *
       * @param {Request|string} input The request or URL to fetch and cache.
       * @return {Promise<Response>}
       */
      async fetchAndCachePut(input) {
        const response = await this.fetch(input);
        const responseClone = response.clone();
        void this.waitUntil(this.cachePut(input, responseClone));
        return response;
      }
      /**
       * Matches a request from the cache (and invokes any applicable plugin
       * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
       * defined on the strategy object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - cacheKeyWillBeUsed()
       * - cachedResponseWillBeUsed()
       *
       * @param {Request|string} key The Request or URL to use as the cache key.
       * @return {Promise<Response|undefined>} A matching response, if found.
       */
      async cacheMatch(key) {
        const request = toRequest(key);
        let cachedResponse;
        const {
          cacheName,
          matchOptions
        } = this._strategy;
        const effectiveRequest = await this.getCacheKey(request, 'read');
        const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), {
          cacheName
        });
        cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
        {
          if (cachedResponse) {
            logger.debug(`Found a cached response in '${cacheName}'.`);
          } else {
            logger.debug(`No cached response found in '${cacheName}'.`);
          }
        }
        for (const callback of this.iterateCallbacks('cachedResponseWillBeUsed')) {
          cachedResponse = (await callback({
            cacheName,
            matchOptions,
            cachedResponse,
            request: effectiveRequest,
            event: this.event
          })) || undefined;
        }
        return cachedResponse;
      }
      /**
       * Puts a request/response pair in the cache (and invokes any applicable
       * plugin callback methods) using the `cacheName` and `plugins` defined on
       * the strategy object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - cacheKeyWillBeUsed()
       * - cacheWillUpdate()
       * - cacheDidUpdate()
       *
       * @param {Request|string} key The request or URL to use as the cache key.
       * @param {Response} response The response to cache.
       * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
       * not be cached, and `true` otherwise.
       */
      async cachePut(key, response) {
        const request = toRequest(key);
        // Run in the next task to avoid blocking other cache reads.
        // https://github.com/w3c/ServiceWorker/issues/1397
        await timeout(0);
        const effectiveRequest = await this.getCacheKey(request, 'write');
        {
          if (effectiveRequest.method && effectiveRequest.method !== 'GET') {
            throw new WorkboxError('attempt-to-cache-non-get-request', {
              url: getFriendlyURL(effectiveRequest.url),
              method: effectiveRequest.method
            });
          }
          // See https://github.com/GoogleChrome/workbox/issues/2818
          const vary = response.headers.get('Vary');
          if (vary) {
            logger.debug(`The response for ${getFriendlyURL(effectiveRequest.url)} ` + `has a 'Vary: ${vary}' header. ` + `Consider setting the {ignoreVary: true} option on your strategy ` + `to ensure cache matching and deletion works as expected.`);
          }
        }
        if (!response) {
          {
            logger.error(`Cannot cache non-existent response for ` + `'${getFriendlyURL(effectiveRequest.url)}'.`);
          }
          throw new WorkboxError('cache-put-with-no-response', {
            url: getFriendlyURL(effectiveRequest.url)
          });
        }
        const responseToCache = await this._ensureResponseSafeToCache(response);
        if (!responseToCache) {
          {
            logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' ` + `will not be cached.`, responseToCache);
          }
          return false;
        }
        const {
          cacheName,
          matchOptions
        } = this._strategy;
        const cache = await self.caches.open(cacheName);
        const hasCacheUpdateCallback = this.hasCallback('cacheDidUpdate');
        const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(
        // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
        // feature. Consider into ways to only add this behavior if using
        // precaching.
        cache, effectiveRequest.clone(), ['__WB_REVISION__'], matchOptions) : null;
        {
          logger.debug(`Updating the '${cacheName}' cache with a new Response ` + `for ${getFriendlyURL(effectiveRequest.url)}.`);
        }
        try {
          await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
        } catch (error) {
          if (error instanceof Error) {
            // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
            if (error.name === 'QuotaExceededError') {
              await executeQuotaErrorCallbacks();
            }
            throw error;
          }
        }
        for (const callback of this.iterateCallbacks('cacheDidUpdate')) {
          await callback({
            cacheName,
            oldResponse,
            newResponse: responseToCache.clone(),
            request: effectiveRequest,
            event: this.event
          });
        }
        return true;
      }
      /**
       * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
       * executes any of those callbacks found in sequence. The final `Request`
       * object returned by the last plugin is treated as the cache key for cache
       * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
       * been registered, the passed request is returned unmodified
       *
       * @param {Request} request
       * @param {string} mode
       * @return {Promise<Request>}
       */
      async getCacheKey(request, mode) {
        const key = `${request.url} | ${mode}`;
        if (!this._cacheKeys[key]) {
          let effectiveRequest = request;
          for (const callback of this.iterateCallbacks('cacheKeyWillBeUsed')) {
            effectiveRequest = toRequest(await callback({
              mode,
              request: effectiveRequest,
              event: this.event,
              // params has a type any can't change right now.
              params: this.params // eslint-disable-line
            }));
          }
          this._cacheKeys[key] = effectiveRequest;
        }
        return this._cacheKeys[key];
      }
      /**
       * Returns true if the strategy has at least one plugin with the given
       * callback.
       *
       * @param {string} name The name of the callback to check for.
       * @return {boolean}
       */
      hasCallback(name) {
        for (const plugin of this._strategy.plugins) {
          if (name in plugin) {
            return true;
          }
        }
        return false;
      }
      /**
       * Runs all plugin callbacks matching the given name, in order, passing the
       * given param object (merged ith the current plugin state) as the only
       * argument.
       *
       * Note: since this method runs all plugins, it's not suitable for cases
       * where the return value of a callback needs to be applied prior to calling
       * the next callback. See
       * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
       * below for how to handle that case.
       *
       * @param {string} name The name of the callback to run within each plugin.
       * @param {Object} param The object to pass as the first (and only) param
       *     when executing each callback. This object will be merged with the
       *     current plugin state prior to callback execution.
       */
      async runCallbacks(name, param) {
        for (const callback of this.iterateCallbacks(name)) {
          // TODO(philipwalton): not sure why `any` is needed. It seems like
          // this should work with `as WorkboxPluginCallbackParam[C]`.
          await callback(param);
        }
      }
      /**
       * Accepts a callback and returns an iterable of matching plugin callbacks,
       * where each callback is wrapped with the current handler state (i.e. when
       * you call each callback, whatever object parameter you pass it will
       * be merged with the plugin's current state).
       *
       * @param {string} name The name fo the callback to run
       * @return {Array<Function>}
       */
      *iterateCallbacks(name) {
        for (const plugin of this._strategy.plugins) {
          if (typeof plugin[name] === 'function') {
            const state = this._pluginStateMap.get(plugin);
            const statefulCallback = param => {
              const statefulParam = Object.assign(Object.assign({}, param), {
                state
              });
              // TODO(philipwalton): not sure why `any` is needed. It seems like
              // this should work with `as WorkboxPluginCallbackParam[C]`.
              return plugin[name](statefulParam);
            };
            yield statefulCallback;
          }
        }
      }
      /**
       * Adds a promise to the
       * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
       * of the event associated with the request being handled (usually a
       * `FetchEvent`).
       *
       * Note: you can await
       * {@link workbox-strategies.StrategyHandler~doneWaiting}
       * to know when all added promises have settled.
       *
       * @param {Promise} promise A promise to add to the extend lifetime promises
       *     of the event that triggered the request.
       */
      waitUntil(promise) {
        this._extendLifetimePromises.push(promise);
        return promise;
      }
      /**
       * Returns a promise that resolves once all promises passed to
       * {@link workbox-strategies.StrategyHandler~waitUntil}
       * have settled.
       *
       * Note: any work done after `doneWaiting()` settles should be manually
       * passed to an event's `waitUntil()` method (not this handler's
       * `waitUntil()` method), otherwise the service worker thread may be killed
       * prior to your work completing.
       */
      async doneWaiting() {
        while (this._extendLifetimePromises.length) {
          const promises = this._extendLifetimePromises.splice(0);
          const result = await Promise.allSettled(promises);
          const firstRejection = result.find(i => i.status === 'rejected');
          if (firstRejection) {
            throw firstRejection.reason;
          }
        }
      }
      /**
       * Stops running the strategy and immediately resolves any pending
       * `waitUntil()` promises.
       */
      destroy() {
        this._handlerDeferred.resolve(null);
      }
      /**
       * This method will call cacheWillUpdate on the available plugins (or use
       * status === 200) to determine if the Response is safe and valid to cache.
       *
       * @param {Request} options.request
       * @param {Response} options.response
       * @return {Promise<Response|undefined>}
       *
       * @private
       */
      async _ensureResponseSafeToCache(response) {
        let responseToCache = response;
        let pluginsUsed = false;
        for (const callback of this.iterateCallbacks('cacheWillUpdate')) {
          responseToCache = (await callback({
            request: this.request,
            response: responseToCache,
            event: this.event
          })) || undefined;
          pluginsUsed = true;
          if (!responseToCache) {
            break;
          }
        }
        if (!pluginsUsed) {
          if (responseToCache && responseToCache.status !== 200) {
            responseToCache = undefined;
          }
          {
            if (responseToCache) {
              if (responseToCache.status !== 200) {
                if (responseToCache.status === 0) {
                  logger.warn(`The response for '${this.request.url}' ` + `is an opaque response. The caching strategy that you're ` + `using will not cache opaque responses by default.`);
                } else {
                  logger.debug(`The response for '${this.request.url}' ` + `returned a status code of '${response.status}' and won't ` + `be cached as a result.`);
                }
              }
            }
          }
        }
        return responseToCache;
      }
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * An abstract base class that all other strategy classes must extend from:
     *
     * @memberof workbox-strategies
     */
    class Strategy {
      /**
       * Creates a new instance of the strategy and sets all documented option
       * properties as public instance properties.
       *
       * Note: if a custom strategy class extends the base Strategy class and does
       * not need more than these properties, it does not need to define its own
       * constructor.
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to the cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
       * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
       * `fetch()` requests made by this strategy.
       * @param {Object} [options.matchOptions] The
       * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
       * for any `cache.match()` or `cache.put()` calls made by this strategy.
       */
      constructor(options = {}) {
        /**
         * Cache name to store and retrieve
         * requests. Defaults to the cache names provided by
         * {@link workbox-core.cacheNames}.
         *
         * @type {string}
         */
        this.cacheName = cacheNames.getRuntimeName(options.cacheName);
        /**
         * The list
         * [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
         * used by this strategy.
         *
         * @type {Array<Object>}
         */
        this.plugins = options.plugins || [];
        /**
         * Values passed along to the
         * [`init`]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters}
         * of all fetch() requests made by this strategy.
         *
         * @type {Object}
         */
        this.fetchOptions = options.fetchOptions;
        /**
         * The
         * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
         * for any `cache.match()` or `cache.put()` calls made by this strategy.
         *
         * @type {Object}
         */
        this.matchOptions = options.matchOptions;
      }
      /**
       * Perform a request strategy and returns a `Promise` that will resolve with
       * a `Response`, invoking all relevant plugin callbacks.
       *
       * When a strategy instance is registered with a Workbox
       * {@link workbox-routing.Route}, this method is automatically
       * called when the route matches.
       *
       * Alternatively, this method can be used in a standalone `FetchEvent`
       * listener by passing it to `event.respondWith()`.
       *
       * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
       *     properties listed below.
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params]
       */
      handle(options) {
        const [responseDone] = this.handleAll(options);
        return responseDone;
      }
      /**
       * Similar to {@link workbox-strategies.Strategy~handle}, but
       * instead of just returning a `Promise` that resolves to a `Response` it
       * it will return an tuple of `[response, done]` promises, where the former
       * (`response`) is equivalent to what `handle()` returns, and the latter is a
       * Promise that will resolve once any promises that were added to
       * `event.waitUntil()` as part of performing the strategy have completed.
       *
       * You can await the `done` promise to ensure any extra work performed by
       * the strategy (usually caching responses) completes successfully.
       *
       * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
       *     properties listed below.
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params]
       * @return {Array<Promise>} A tuple of [response, done]
       *     promises that can be used to determine when the response resolves as
       *     well as when the handler has completed all its work.
       */
      handleAll(options) {
        // Allow for flexible options to be passed.
        if (options instanceof FetchEvent) {
          options = {
            event: options,
            request: options.request
          };
        }
        const event = options.event;
        const request = typeof options.request === 'string' ? new Request(options.request) : options.request;
        const params = 'params' in options ? options.params : undefined;
        const handler = new StrategyHandler(this, {
          event,
          request,
          params
        });
        const responseDone = this._getResponse(handler, request, event);
        const handlerDone = this._awaitComplete(responseDone, handler, request, event);
        // Return an array of promises, suitable for use with Promise.all().
        return [responseDone, handlerDone];
      }
      async _getResponse(handler, request, event) {
        await handler.runCallbacks('handlerWillStart', {
          event,
          request
        });
        let response = undefined;
        try {
          response = await this._handle(request, handler);
          // The "official" Strategy subclasses all throw this error automatically,
          // but in case a third-party Strategy doesn't, ensure that we have a
          // consistent failure when there's no response or an error response.
          if (!response || response.type === 'error') {
            throw new WorkboxError('no-response', {
              url: request.url
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            for (const callback of handler.iterateCallbacks('handlerDidError')) {
              response = await callback({
                error,
                event,
                request
              });
              if (response) {
                break;
              }
            }
          }
          if (!response) {
            throw error;
          } else {
            logger.log(`While responding to '${getFriendlyURL(request.url)}', ` + `an ${error instanceof Error ? error.toString() : ''} error occurred. Using a fallback response provided by ` + `a handlerDidError plugin.`);
          }
        }
        for (const callback of handler.iterateCallbacks('handlerWillRespond')) {
          response = await callback({
            event,
            request,
            response
          });
        }
        return response;
      }
      async _awaitComplete(responseDone, handler, request, event) {
        let response;
        let error;
        try {
          response = await responseDone;
        } catch (error) {
          // Ignore errors, as response errors should be caught via the `response`
          // promise above. The `done` promise will only throw for errors in
          // promises passed to `handler.waitUntil()`.
        }
        try {
          await handler.runCallbacks('handlerDidRespond', {
            event,
            request,
            response
          });
          await handler.doneWaiting();
        } catch (waitUntilError) {
          if (waitUntilError instanceof Error) {
            error = waitUntilError;
          }
        }
        await handler.runCallbacks('handlerDidComplete', {
          event,
          request,
          response,
          error: error
        });
        handler.destroy();
        if (error) {
          throw error;
        }
      }
    }
    /**
     * Classes extending the `Strategy` based class should implement this method,
     * and leverage the {@link workbox-strategies.StrategyHandler}
     * arg to perform all fetching and cache logic, which will ensure all relevant
     * cache, cache options, fetch options and plugins are used (per the current
     * strategy instance).
     *
     * @name _handle
     * @instance
     * @abstract
     * @function
     * @param {Request} request
     * @param {workbox-strategies.StrategyHandler} handler
     * @return {Promise<Response>}
     *
     * @memberof workbox-strategies.Strategy
     */

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const messages = {
      strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL(request.url)}'`,
      printFinalResponse: response => {
        if (response) {
          logger.groupCollapsed(`View the final response here.`);
          logger.log(response || '[No response returned]');
          logger.groupEnd();
        }
      }
    };

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * An implementation of a
     * [network first](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache)
     * request strategy.
     *
     * By default, this strategy will cache responses with a 200 status code as
     * well as [opaque responses](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#opaque-responses).
     * Opaque responses are are cross-origin requests where the response doesn't
     * support [CORS](https://enable-cors.org/).
     *
     * If the network request fails, and there is no cache match, this will throw
     * a `WorkboxError` exception.
     *
     * @extends workbox-strategies.Strategy
     * @memberof workbox-strategies
     */
    class NetworkFirst extends Strategy {
      /**
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
       * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
       * `fetch()` requests made by this strategy.
       * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
       * @param {number} [options.networkTimeoutSeconds] If set, any network requests
       * that fail to respond within the timeout will fallback to the cache.
       *
       * This option can be used to combat
       * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
       * scenarios.
       */
      constructor(options = {}) {
        super(options);
        // If this instance contains no plugins with a 'cacheWillUpdate' callback,
        // prepend the `cacheOkAndOpaquePlugin` plugin to the plugins list.
        if (!this.plugins.some(p => 'cacheWillUpdate' in p)) {
          this.plugins.unshift(cacheOkAndOpaquePlugin);
        }
        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
        {
          if (this._networkTimeoutSeconds) {
            finalAssertExports.isType(this._networkTimeoutSeconds, 'number', {
              moduleName: 'workbox-strategies',
              className: this.constructor.name,
              funcName: 'constructor',
              paramName: 'networkTimeoutSeconds'
            });
          }
        }
      }
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        const logs = [];
        {
          finalAssertExports.isInstance(request, Request, {
            moduleName: 'workbox-strategies',
            className: this.constructor.name,
            funcName: 'handle',
            paramName: 'makeRequest'
          });
        }
        const promises = [];
        let timeoutId;
        if (this._networkTimeoutSeconds) {
          const {
            id,
            promise
          } = this._getTimeoutPromise({
            request,
            logs,
            handler
          });
          timeoutId = id;
          promises.push(promise);
        }
        const networkPromise = this._getNetworkPromise({
          timeoutId,
          request,
          logs,
          handler
        });
        promises.push(networkPromise);
        const response = await handler.waitUntil((async () => {
          // Promise.race() will resolve as soon as the first promise resolves.
          return (await handler.waitUntil(Promise.race(promises))) || (
          // If Promise.race() resolved with null, it might be due to a network
          // timeout + a cache miss. If that were to happen, we'd rather wait until
          // the networkPromise resolves instead of returning null.
          // Note that it's fine to await an already-resolved promise, so we don't
          // have to check to see if it's still "in flight".
          await networkPromise);
        })());
        {
          logger.groupCollapsed(messages.strategyStart(this.constructor.name, request));
          for (const log of logs) {
            logger.log(log);
          }
          messages.printFinalResponse(response);
          logger.groupEnd();
        }
        if (!response) {
          throw new WorkboxError('no-response', {
            url: request.url
          });
        }
        return response;
      }
      /**
       * @param {Object} options
       * @param {Request} options.request
       * @param {Array} options.logs A reference to the logs array
       * @param {Event} options.event
       * @return {Promise<Response>}
       *
       * @private
       */
      _getTimeoutPromise({
        request,
        logs,
        handler
      }) {
        let timeoutId;
        const timeoutPromise = new Promise(resolve => {
          const onNetworkTimeout = async () => {
            {
              logs.push(`Timing out the network response at ` + `${this._networkTimeoutSeconds} seconds.`);
            }
            resolve(await handler.cacheMatch(request));
          };
          timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1000);
        });
        return {
          promise: timeoutPromise,
          id: timeoutId
        };
      }
      /**
       * @param {Object} options
       * @param {number|undefined} options.timeoutId
       * @param {Request} options.request
       * @param {Array} options.logs A reference to the logs Array.
       * @param {Event} options.event
       * @return {Promise<Response>}
       *
       * @private
       */
      async _getNetworkPromise({
        timeoutId,
        request,
        logs,
        handler
      }) {
        let error;
        let response;
        try {
          response = await handler.fetchAndCachePut(request);
        } catch (fetchError) {
          if (fetchError instanceof Error) {
            error = fetchError;
          }
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        {
          if (response) {
            logs.push(`Got response from network.`);
          } else {
            logs.push(`Unable to get a response from the network. Will respond ` + `with a cached response.`);
          }
        }
        if (error || !response) {
          response = await handler.cacheMatch(request);
          {
            if (response) {
              logs.push(`Found a cached response in the '${this.cacheName}'` + ` cache.`);
            } else {
              logs.push(`No response found in the '${this.cacheName}' cache.`);
            }
          }
        }
        return response;
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Claim any currently available clients once the service worker
     * becomes active. This is normally used in conjunction with `skipWaiting()`.
     *
     * @memberof workbox-core
     */
    function clientsClaim() {
      self.addEventListener('activate', () => self.clients.claim());
    }

    /*
      Copyright 2020 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A utility method that makes it easier to use `event.waitUntil` with
     * async functions and return the result.
     *
     * @param {ExtendableEvent} event
     * @param {Function} asyncFn
     * @return {Function}
     * @private
     */
    function waitUntil(event, asyncFn) {
      const returnPromise = asyncFn();
      event.waitUntil(returnPromise);
      return returnPromise;
    }

    // @ts-ignore
    try {
      self['workbox:precaching:7.3.0'] && _();
    } catch (e) {}

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    // Name of the search parameter used to store revision info.
    const REVISION_SEARCH_PARAM = '__WB_REVISION__';
    /**
     * Converts a manifest entry into a versioned URL suitable for precaching.
     *
     * @param {Object|string} entry
     * @return {string} A URL with versioning info.
     *
     * @private
     * @memberof workbox-precaching
     */
    function createCacheKey(entry) {
      if (!entry) {
        throw new WorkboxError('add-to-cache-list-unexpected-type', {
          entry
        });
      }
      // If a precache manifest entry is a string, it's assumed to be a versioned
      // URL, like '/app.abcd1234.js'. Return as-is.
      if (typeof entry === 'string') {
        const urlObject = new URL(entry, location.href);
        return {
          cacheKey: urlObject.href,
          url: urlObject.href
        };
      }
      const {
        revision,
        url
      } = entry;
      if (!url) {
        throw new WorkboxError('add-to-cache-list-unexpected-type', {
          entry
        });
      }
      // If there's just a URL and no revision, then it's also assumed to be a
      // versioned URL.
      if (!revision) {
        const urlObject = new URL(url, location.href);
        return {
          cacheKey: urlObject.href,
          url: urlObject.href
        };
      }
      // Otherwise, construct a properly versioned URL using the custom Workbox
      // search parameter along with the revision info.
      const cacheKeyURL = new URL(url, location.href);
      const originalURL = new URL(url, location.href);
      cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
      return {
        cacheKey: cacheKeyURL.href,
        url: originalURL.href
      };
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to determine the
     * of assets that were updated (or not updated) during the install event.
     *
     * @private
     */
    class PrecacheInstallReportPlugin {
      constructor() {
        this.updatedURLs = [];
        this.notUpdatedURLs = [];
        this.handlerWillStart = async ({
          request,
          state
        }) => {
          // TODO: `state` should never be undefined...
          if (state) {
            state.originalRequest = request;
          }
        };
        this.cachedResponseWillBeUsed = async ({
          event,
          state,
          cachedResponse
        }) => {
          if (event.type === 'install') {
            if (state && state.originalRequest && state.originalRequest instanceof Request) {
              // TODO: `state` should never be undefined...
              const url = state.originalRequest.url;
              if (cachedResponse) {
                this.notUpdatedURLs.push(url);
              } else {
                this.updatedURLs.push(url);
              }
            }
          }
          return cachedResponse;
        };
      }
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to translate URLs into
     * the corresponding cache key, based on the current revision info.
     *
     * @private
     */
    class PrecacheCacheKeyPlugin {
      constructor({
        precacheController
      }) {
        this.cacheKeyWillBeUsed = async ({
          request,
          params
        }) => {
          // Params is type any, can't change right now.
          /* eslint-disable */
          const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
          /* eslint-enable */
          return cacheKey ? new Request(cacheKey, {
            headers: request.headers
          }) : request;
        };
        this._precacheController = precacheController;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @param {string} groupTitle
     * @param {Array<string>} deletedURLs
     *
     * @private
     */
    const logGroup = (groupTitle, deletedURLs) => {
      logger.groupCollapsed(groupTitle);
      for (const url of deletedURLs) {
        logger.log(url);
      }
      logger.groupEnd();
    };
    /**
     * @param {Array<string>} deletedURLs
     *
     * @private
     * @memberof workbox-precaching
     */
    function printCleanupDetails(deletedURLs) {
      const deletionCount = deletedURLs.length;
      if (deletionCount > 0) {
        logger.groupCollapsed(`During precaching cleanup, ` + `${deletionCount} cached ` + `request${deletionCount === 1 ? ' was' : 's were'} deleted.`);
        logGroup('Deleted Cache Requests', deletedURLs);
        logger.groupEnd();
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @param {string} groupTitle
     * @param {Array<string>} urls
     *
     * @private
     */
    function _nestedGroup(groupTitle, urls) {
      if (urls.length === 0) {
        return;
      }
      logger.groupCollapsed(groupTitle);
      for (const url of urls) {
        logger.log(url);
      }
      logger.groupEnd();
    }
    /**
     * @param {Array<string>} urlsToPrecache
     * @param {Array<string>} urlsAlreadyPrecached
     *
     * @private
     * @memberof workbox-precaching
     */
    function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
      const precachedCount = urlsToPrecache.length;
      const alreadyPrecachedCount = urlsAlreadyPrecached.length;
      if (precachedCount || alreadyPrecachedCount) {
        let message = `Precaching ${precachedCount} file${precachedCount === 1 ? '' : 's'}.`;
        if (alreadyPrecachedCount > 0) {
          message += ` ${alreadyPrecachedCount} ` + `file${alreadyPrecachedCount === 1 ? ' is' : 's are'} already cached.`;
        }
        logger.groupCollapsed(message);
        _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
        _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
        logger.groupEnd();
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let supportStatus;
    /**
     * A utility function that determines whether the current browser supports
     * constructing a new `Response` from a `response.body` stream.
     *
     * @return {boolean} `true`, if the current browser can successfully
     *     construct a `Response` from a `response.body` stream, `false` otherwise.
     *
     * @private
     */
    function canConstructResponseFromBodyStream() {
      if (supportStatus === undefined) {
        const testResponse = new Response('');
        if ('body' in testResponse) {
          try {
            new Response(testResponse.body);
            supportStatus = true;
          } catch (error) {
            supportStatus = false;
          }
        }
        supportStatus = false;
      }
      return supportStatus;
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Allows developers to copy a response and modify its `headers`, `status`,
     * or `statusText` values (the values settable via a
     * [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
     * object in the constructor).
     * To modify these values, pass a function as the second argument. That
     * function will be invoked with a single object with the response properties
     * `{headers, status, statusText}`. The return value of this function will
     * be used as the `ResponseInit` for the new `Response`. To change the values
     * either modify the passed parameter(s) and return it, or return a totally
     * new object.
     *
     * This method is intentionally limited to same-origin responses, regardless of
     * whether CORS was used or not.
     *
     * @param {Response} response
     * @param {Function} modifier
     * @memberof workbox-core
     */
    async function copyResponse(response, modifier) {
      let origin = null;
      // If response.url isn't set, assume it's cross-origin and keep origin null.
      if (response.url) {
        const responseURL = new URL(response.url);
        origin = responseURL.origin;
      }
      if (origin !== self.location.origin) {
        throw new WorkboxError('cross-origin-copy-response', {
          origin
        });
      }
      const clonedResponse = response.clone();
      // Create a fresh `ResponseInit` object by cloning the headers.
      const responseInit = {
        headers: new Headers(clonedResponse.headers),
        status: clonedResponse.status,
        statusText: clonedResponse.statusText
      };
      // Apply any user modifications.
      const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
      // Create the new response from the body stream and `ResponseInit`
      // modifications. Note: not all browsers support the Response.body stream,
      // so fall back to reading the entire body into memory as a blob.
      const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
      return new Response(body, modifiedResponseInit);
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A {@link workbox-strategies.Strategy} implementation
     * specifically designed to work with
     * {@link workbox-precaching.PrecacheController}
     * to both cache and fetch precached assets.
     *
     * Note: an instance of this class is created automatically when creating a
     * `PrecacheController`; it's generally not necessary to create this yourself.
     *
     * @extends workbox-strategies.Strategy
     * @memberof workbox-precaching
     */
    class PrecacheStrategy extends Strategy {
      /**
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to the cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
       * of all fetch() requests made by this strategy.
       * @param {Object} [options.matchOptions] The
       * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
       * for any `cache.match()` or `cache.put()` calls made by this strategy.
       * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
       * get the response from the network if there's a precache miss.
       */
      constructor(options = {}) {
        options.cacheName = cacheNames.getPrecacheName(options.cacheName);
        super(options);
        this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
        // Redirected responses cannot be used to satisfy a navigation request, so
        // any redirected response must be "copied" rather than cloned, so the new
        // response doesn't contain the `redirected` flag. See:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1
        this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
      }
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        const response = await handler.cacheMatch(request);
        if (response) {
          return response;
        }
        // If this is an `install` event for an entry that isn't already cached,
        // then populate the cache.
        if (handler.event && handler.event.type === 'install') {
          return await this._handleInstall(request, handler);
        }
        // Getting here means something went wrong. An entry that should have been
        // precached wasn't found in the cache.
        return await this._handleFetch(request, handler);
      }
      async _handleFetch(request, handler) {
        let response;
        const params = handler.params || {};
        // Fall back to the network if we're configured to do so.
        if (this._fallbackToNetwork) {
          {
            logger.warn(`The precached response for ` + `${getFriendlyURL(request.url)} in ${this.cacheName} was not ` + `found. Falling back to the network.`);
          }
          const integrityInManifest = params.integrity;
          const integrityInRequest = request.integrity;
          const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
          // Do not add integrity if the original request is no-cors
          // See https://github.com/GoogleChrome/workbox/issues/3096
          response = await handler.fetch(new Request(request, {
            integrity: request.mode !== 'no-cors' ? integrityInRequest || integrityInManifest : undefined
          }));
          // It's only "safe" to repair the cache if we're using SRI to guarantee
          // that the response matches the precache manifest's expectations,
          // and there's either a) no integrity property in the incoming request
          // or b) there is an integrity, and it matches the precache manifest.
          // See https://github.com/GoogleChrome/workbox/issues/2858
          // Also if the original request users no-cors we don't use integrity.
          // See https://github.com/GoogleChrome/workbox/issues/3096
          if (integrityInManifest && noIntegrityConflict && request.mode !== 'no-cors') {
            this._useDefaultCacheabilityPluginIfNeeded();
            const wasCached = await handler.cachePut(request, response.clone());
            {
              if (wasCached) {
                logger.log(`A response for ${getFriendlyURL(request.url)} ` + `was used to "repair" the precache.`);
              }
            }
          }
        } else {
          // This shouldn't normally happen, but there are edge cases:
          // https://github.com/GoogleChrome/workbox/issues/1441
          throw new WorkboxError('missing-precache-entry', {
            cacheName: this.cacheName,
            url: request.url
          });
        }
        {
          const cacheKey = params.cacheKey || (await handler.getCacheKey(request, 'read'));
          // Workbox is going to handle the route.
          // print the routing details to the console.
          logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(request.url));
          logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);
          logger.groupCollapsed(`View request details here.`);
          logger.log(request);
          logger.groupEnd();
          logger.groupCollapsed(`View response details here.`);
          logger.log(response);
          logger.groupEnd();
          logger.groupEnd();
        }
        return response;
      }
      async _handleInstall(request, handler) {
        this._useDefaultCacheabilityPluginIfNeeded();
        const response = await handler.fetch(request);
        // Make sure we defer cachePut() until after we know the response
        // should be cached; see https://github.com/GoogleChrome/workbox/issues/2737
        const wasCached = await handler.cachePut(request, response.clone());
        if (!wasCached) {
          // Throwing here will lead to the `install` handler failing, which
          // we want to do if *any* of the responses aren't safe to cache.
          throw new WorkboxError('bad-precaching-response', {
            url: request.url,
            status: response.status
          });
        }
        return response;
      }
      /**
       * This method is complex, as there a number of things to account for:
       *
       * The `plugins` array can be set at construction, and/or it might be added to
       * to at any time before the strategy is used.
       *
       * At the time the strategy is used (i.e. during an `install` event), there
       * needs to be at least one plugin that implements `cacheWillUpdate` in the
       * array, other than `copyRedirectedCacheableResponsesPlugin`.
       *
       * - If this method is called and there are no suitable `cacheWillUpdate`
       * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
       *
       * - If this method is called and there is exactly one `cacheWillUpdate`, then
       * we don't have to do anything (this might be a previously added
       * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
       *
       * - If this method is called and there is more than one `cacheWillUpdate`,
       * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
       * we need to remove it. (This situation is unlikely, but it could happen if
       * the strategy is used multiple times, the first without a `cacheWillUpdate`,
       * and then later on after manually adding a custom `cacheWillUpdate`.)
       *
       * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
       *
       * @private
       */
      _useDefaultCacheabilityPluginIfNeeded() {
        let defaultPluginIndex = null;
        let cacheWillUpdatePluginCount = 0;
        for (const [index, plugin] of this.plugins.entries()) {
          // Ignore the copy redirected plugin when determining what to do.
          if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
            continue;
          }
          // Save the default plugin's index, in case it needs to be removed.
          if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
            defaultPluginIndex = index;
          }
          if (plugin.cacheWillUpdate) {
            cacheWillUpdatePluginCount++;
          }
        }
        if (cacheWillUpdatePluginCount === 0) {
          this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
        } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
          // Only remove the default plugin; multiple custom plugins are allowed.
          this.plugins.splice(defaultPluginIndex, 1);
        }
        // Nothing needs to be done if cacheWillUpdatePluginCount is 1
      }
    }
    PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
      async cacheWillUpdate({
        response
      }) {
        if (!response || response.status >= 400) {
          return null;
        }
        return response;
      }
    };
    PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
      async cacheWillUpdate({
        response
      }) {
        return response.redirected ? await copyResponse(response) : response;
      }
    };

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Performs efficient precaching of assets.
     *
     * @memberof workbox-precaching
     */
    class PrecacheController {
      /**
       * Create a new PrecacheController.
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] The cache to use for precaching.
       * @param {string} [options.plugins] Plugins to use when precaching as well
       * as responding to fetch events for precached assets.
       * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
       * get the response from the network if there's a precache miss.
       */
      constructor({
        cacheName,
        plugins = [],
        fallbackToNetwork = true
      } = {}) {
        this._urlsToCacheKeys = new Map();
        this._urlsToCacheModes = new Map();
        this._cacheKeysToIntegrities = new Map();
        this._strategy = new PrecacheStrategy({
          cacheName: cacheNames.getPrecacheName(cacheName),
          plugins: [...plugins, new PrecacheCacheKeyPlugin({
            precacheController: this
          })],
          fallbackToNetwork
        });
        // Bind the install and activate methods to the instance.
        this.install = this.install.bind(this);
        this.activate = this.activate.bind(this);
      }
      /**
       * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
       * used to cache assets and respond to fetch events.
       */
      get strategy() {
        return this._strategy;
      }
      /**
       * Adds items to the precache list, removing any duplicates and
       * stores the files in the
       * {@link workbox-core.cacheNames|"precache cache"} when the service
       * worker installs.
       *
       * This method can be called multiple times.
       *
       * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
       */
      precache(entries) {
        this.addToCacheList(entries);
        if (!this._installAndActiveListenersAdded) {
          self.addEventListener('install', this.install);
          self.addEventListener('activate', this.activate);
          this._installAndActiveListenersAdded = true;
        }
      }
      /**
       * This method will add items to the precache list, removing duplicates
       * and ensuring the information is valid.
       *
       * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
       *     Array of entries to precache.
       */
      addToCacheList(entries) {
        {
          finalAssertExports.isArray(entries, {
            moduleName: 'workbox-precaching',
            className: 'PrecacheController',
            funcName: 'addToCacheList',
            paramName: 'entries'
          });
        }
        const urlsToWarnAbout = [];
        for (const entry of entries) {
          // See https://github.com/GoogleChrome/workbox/issues/2259
          if (typeof entry === 'string') {
            urlsToWarnAbout.push(entry);
          } else if (entry && entry.revision === undefined) {
            urlsToWarnAbout.push(entry.url);
          }
          const {
            cacheKey,
            url
          } = createCacheKey(entry);
          const cacheMode = typeof entry !== 'string' && entry.revision ? 'reload' : 'default';
          if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
            throw new WorkboxError('add-to-cache-list-conflicting-entries', {
              firstEntry: this._urlsToCacheKeys.get(url),
              secondEntry: cacheKey
            });
          }
          if (typeof entry !== 'string' && entry.integrity) {
            if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
              throw new WorkboxError('add-to-cache-list-conflicting-integrities', {
                url
              });
            }
            this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
          }
          this._urlsToCacheKeys.set(url, cacheKey);
          this._urlsToCacheModes.set(url, cacheMode);
          if (urlsToWarnAbout.length > 0) {
            const warningMessage = `Workbox is precaching URLs without revision ` + `info: ${urlsToWarnAbout.join(', ')}\nThis is generally NOT safe. ` + `Learn more at https://bit.ly/wb-precache`;
            {
              logger.warn(warningMessage);
            }
          }
        }
      }
      /**
       * Precaches new and updated assets. Call this method from the service worker
       * install event.
       *
       * Note: this method calls `event.waitUntil()` for you, so you do not need
       * to call it yourself in your event handlers.
       *
       * @param {ExtendableEvent} event
       * @return {Promise<workbox-precaching.InstallResult>}
       */
      install(event) {
        // waitUntil returns Promise<any>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return waitUntil(event, async () => {
          const installReportPlugin = new PrecacheInstallReportPlugin();
          this.strategy.plugins.push(installReportPlugin);
          // Cache entries one at a time.
          // See https://github.com/GoogleChrome/workbox/issues/2528
          for (const [url, cacheKey] of this._urlsToCacheKeys) {
            const integrity = this._cacheKeysToIntegrities.get(cacheKey);
            const cacheMode = this._urlsToCacheModes.get(url);
            const request = new Request(url, {
              integrity,
              cache: cacheMode,
              credentials: 'same-origin'
            });
            await Promise.all(this.strategy.handleAll({
              params: {
                cacheKey
              },
              request,
              event
            }));
          }
          const {
            updatedURLs,
            notUpdatedURLs
          } = installReportPlugin;
          {
            printInstallDetails(updatedURLs, notUpdatedURLs);
          }
          return {
            updatedURLs,
            notUpdatedURLs
          };
        });
      }
      /**
       * Deletes assets that are no longer present in the current precache manifest.
       * Call this method from the service worker activate event.
       *
       * Note: this method calls `event.waitUntil()` for you, so you do not need
       * to call it yourself in your event handlers.
       *
       * @param {ExtendableEvent} event
       * @return {Promise<workbox-precaching.CleanupResult>}
       */
      activate(event) {
        // waitUntil returns Promise<any>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return waitUntil(event, async () => {
          const cache = await self.caches.open(this.strategy.cacheName);
          const currentlyCachedRequests = await cache.keys();
          const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
          const deletedURLs = [];
          for (const request of currentlyCachedRequests) {
            if (!expectedCacheKeys.has(request.url)) {
              await cache.delete(request);
              deletedURLs.push(request.url);
            }
          }
          {
            printCleanupDetails(deletedURLs);
          }
          return {
            deletedURLs
          };
        });
      }
      /**
       * Returns a mapping of a precached URL to the corresponding cache key, taking
       * into account the revision information for the URL.
       *
       * @return {Map<string, string>} A URL to cache key mapping.
       */
      getURLsToCacheKeys() {
        return this._urlsToCacheKeys;
      }
      /**
       * Returns a list of all the URLs that have been precached by the current
       * service worker.
       *
       * @return {Array<string>} The precached URLs.
       */
      getCachedURLs() {
        return [...this._urlsToCacheKeys.keys()];
      }
      /**
       * Returns the cache key used for storing a given URL. If that URL is
       * unversioned, like `/index.html', then the cache key will be the original
       * URL with a search parameter appended to it.
       *
       * @param {string} url A URL whose cache key you want to look up.
       * @return {string} The versioned URL that corresponds to a cache key
       * for the original URL, or undefined if that URL isn't precached.
       */
      getCacheKeyForURL(url) {
        const urlObject = new URL(url, location.href);
        return this._urlsToCacheKeys.get(urlObject.href);
      }
      /**
       * @param {string} url A cache key whose SRI you want to look up.
       * @return {string} The subresource integrity associated with the cache key,
       * or undefined if it's not set.
       */
      getIntegrityForCacheKey(cacheKey) {
        return this._cacheKeysToIntegrities.get(cacheKey);
      }
      /**
       * This acts as a drop-in replacement for
       * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
       * with the following differences:
       *
       * - It knows what the name of the precache is, and only checks in that cache.
       * - It allows you to pass in an "original" URL without versioning parameters,
       * and it will automatically look up the correct cache key for the currently
       * active revision of that URL.
       *
       * E.g., `matchPrecache('index.html')` will find the correct precached
       * response for the currently active service worker, even if the actual cache
       * key is `'/index.html?__WB_REVISION__=1234abcd'`.
       *
       * @param {string|Request} request The key (without revisioning parameters)
       * to look up in the precache.
       * @return {Promise<Response|undefined>}
       */
      async matchPrecache(request) {
        const url = request instanceof Request ? request.url : request;
        const cacheKey = this.getCacheKeyForURL(url);
        if (cacheKey) {
          const cache = await self.caches.open(this.strategy.cacheName);
          return cache.match(cacheKey);
        }
        return undefined;
      }
      /**
       * Returns a function that looks up `url` in the precache (taking into
       * account revision information), and returns the corresponding `Response`.
       *
       * @param {string} url The precached URL which will be used to lookup the
       * `Response`.
       * @return {workbox-routing~handlerCallback}
       */
      createHandlerBoundToURL(url) {
        const cacheKey = this.getCacheKeyForURL(url);
        if (!cacheKey) {
          throw new WorkboxError('non-precached-url', {
            url
          });
        }
        return options => {
          options.request = new Request(url);
          options.params = Object.assign({
            cacheKey
          }, options.params);
          return this.strategy.handle(options);
        };
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let precacheController;
    /**
     * @return {PrecacheController}
     * @private
     */
    const getOrCreatePrecacheController = () => {
      if (!precacheController) {
        precacheController = new PrecacheController();
      }
      return precacheController;
    };

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Removes any URL search parameters that should be ignored.
     *
     * @param {URL} urlObject The original URL.
     * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
     * each search parameter name. Matches mean that the search parameter should be
     * ignored.
     * @return {URL} The URL with any ignored search parameters removed.
     *
     * @private
     * @memberof workbox-precaching
     */
    function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
      // Convert the iterable into an array at the start of the loop to make sure
      // deletion doesn't mess up iteration.
      for (const paramName of [...urlObject.searchParams.keys()]) {
        if (ignoreURLParametersMatching.some(regExp => regExp.test(paramName))) {
          urlObject.searchParams.delete(paramName);
        }
      }
      return urlObject;
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Generator function that yields possible variations on the original URL to
     * check, one at a time.
     *
     * @param {string} url
     * @param {Object} options
     *
     * @private
     * @memberof workbox-precaching
     */
    function* generateURLVariations(url, {
      ignoreURLParametersMatching = [/^utm_/, /^fbclid$/],
      directoryIndex = 'index.html',
      cleanURLs = true,
      urlManipulation
    } = {}) {
      const urlObject = new URL(url, location.href);
      urlObject.hash = '';
      yield urlObject.href;
      const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
      yield urlWithoutIgnoredParams.href;
      if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/')) {
        const directoryURL = new URL(urlWithoutIgnoredParams.href);
        directoryURL.pathname += directoryIndex;
        yield directoryURL.href;
      }
      if (cleanURLs) {
        const cleanURL = new URL(urlWithoutIgnoredParams.href);
        cleanURL.pathname += '.html';
        yield cleanURL.href;
      }
      if (urlManipulation) {
        const additionalURLs = urlManipulation({
          url: urlObject
        });
        for (const urlToAttempt of additionalURLs) {
          yield urlToAttempt.href;
        }
      }
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A subclass of {@link workbox-routing.Route} that takes a
     * {@link workbox-precaching.PrecacheController}
     * instance and uses it to match incoming requests and handle fetching
     * responses from the precache.
     *
     * @memberof workbox-precaching
     * @extends workbox-routing.Route
     */
    class PrecacheRoute extends Route {
      /**
       * @param {PrecacheController} precacheController A `PrecacheController`
       * instance used to both match requests and respond to fetch events.
       * @param {Object} [options] Options to control how requests are matched
       * against the list of precached URLs.
       * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
       * check cache entries for a URLs ending with '/' to see if there is a hit when
       * appending the `directoryIndex` value.
       * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
       * array of regex's to remove search params when looking for a cache match.
       * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
       * check the cache for the URL with a `.html` added to the end of the end.
       * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
       * This is a function that should take a URL and return an array of
       * alternative URLs that should be checked for precache matches.
       */
      constructor(precacheController, options) {
        const match = ({
          request
        }) => {
          const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
          for (const possibleURL of generateURLVariations(request.url, options)) {
            const cacheKey = urlsToCacheKeys.get(possibleURL);
            if (cacheKey) {
              const integrity = precacheController.getIntegrityForCacheKey(cacheKey);
              return {
                cacheKey,
                integrity
              };
            }
          }
          {
            logger.debug(`Precaching did not find a match for ` + getFriendlyURL(request.url));
          }
          return;
        };
        super(match, precacheController.strategy);
      }
    }

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Add a `fetch` listener to the service worker that will
     * respond to
     * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
     * with precached assets.
     *
     * Requests for assets that aren't precached, the `FetchEvent` will not be
     * responded to, allowing the event to fall through to other `fetch` event
     * listeners.
     *
     * @param {Object} [options] See the {@link workbox-precaching.PrecacheRoute}
     * options.
     *
     * @memberof workbox-precaching
     */
    function addRoute(options) {
      const precacheController = getOrCreatePrecacheController();
      const precacheRoute = new PrecacheRoute(precacheController, options);
      registerRoute(precacheRoute);
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * Please note: This method **will not** serve any of the cached files for you.
     * It only precaches files. To respond to a network request you call
     * {@link workbox-precaching.addRoute}.
     *
     * If you have a single array of files to precache, you can just call
     * {@link workbox-precaching.precacheAndRoute}.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     *
     * @memberof workbox-precaching
     */
    function precache(entries) {
      const precacheController = getOrCreatePrecacheController();
      precacheController.precache(entries);
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * This method will add entries to the precache list and add a route to
     * respond to fetch events.
     *
     * This is a convenience method that will call
     * {@link workbox-precaching.precache} and
     * {@link workbox-precaching.addRoute} in a single call.
     *
     * @param {Array<Object|string>} entries Array of entries to precache.
     * @param {Object} [options] See the
     * {@link workbox-precaching.PrecacheRoute} options.
     *
     * @memberof workbox-precaching
     */
    function precacheAndRoute(entries, options) {
      precache(entries);
      addRoute(options);
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const SUBSTRING_TO_FIND = '-precache-';
    /**
     * Cleans up incompatible precaches that were created by older versions of
     * Workbox, by a service worker registered under the current scope.
     *
     * This is meant to be called as part of the `activate` event.
     *
     * This should be safe to use as long as you don't include `substringToFind`
     * (defaulting to `-precache-`) in your non-precache cache names.
     *
     * @param {string} currentPrecacheName The cache name currently in use for
     * precaching. This cache won't be deleted.
     * @param {string} [substringToFind='-precache-'] Cache names which include this
     * substring will be deleted (excluding `currentPrecacheName`).
     * @return {Array<string>} A list of all the cache names that were deleted.
     *
     * @private
     * @memberof workbox-precaching
     */
    const deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND) => {
      const cacheNames = await self.caches.keys();
      const cacheNamesToDelete = cacheNames.filter(cacheName => {
        return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
      });
      await Promise.all(cacheNamesToDelete.map(cacheName => self.caches.delete(cacheName)));
      return cacheNamesToDelete;
    };

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Adds an `activate` event listener which will clean up incompatible
     * precaches that were created by older versions of Workbox.
     *
     * @memberof workbox-precaching
     */
    function cleanupOutdatedCaches() {
      // See https://github.com/Microsoft/TypeScript/issues/28357#issuecomment-436484705
      self.addEventListener('activate', event => {
        const cacheName = cacheNames.getPrecacheName();
        event.waitUntil(deleteOutdatedCaches(cacheName).then(cachesDeleted => {
          {
            if (cachesDeleted.length > 0) {
              logger.log(`The following out-of-date precaches were cleaned up ` + `automatically:`, cachesDeleted);
            }
          }
        }));
      });
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * NavigationRoute makes it easy to create a
     * {@link workbox-routing.Route} that matches for browser
     * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
     *
     * It will only match incoming Requests whose
     * {@link https://fetch.spec.whatwg.org/#concept-request-mode|mode}
     * is set to `navigate`.
     *
     * You can optionally only apply this route to a subset of navigation requests
     * by using one or both of the `denylist` and `allowlist` parameters.
     *
     * @memberof workbox-routing
     * @extends workbox-routing.Route
     */
    class NavigationRoute extends Route {
      /**
       * If both `denylist` and `allowlist` are provided, the `denylist` will
       * take precedence and the request will not match this route.
       *
       * The regular expressions in `allowlist` and `denylist`
       * are matched against the concatenated
       * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
       * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
       * portions of the requested URL.
       *
       * *Note*: These RegExps may be evaluated against every destination URL during
       * a navigation. Avoid using
       * [complex RegExps](https://github.com/GoogleChrome/workbox/issues/3077),
       * or else your users may see delays when navigating your site.
       *
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       * @param {Object} options
       * @param {Array<RegExp>} [options.denylist] If any of these patterns match,
       * the route will not handle the request (even if a allowlist RegExp matches).
       * @param {Array<RegExp>} [options.allowlist=[/./]] If any of these patterns
       * match the URL's pathname and search parameter, the route will handle the
       * request (assuming the denylist doesn't match).
       */
      constructor(handler, {
        allowlist = [/./],
        denylist = []
      } = {}) {
        {
          finalAssertExports.isArrayOfClass(allowlist, RegExp, {
            moduleName: 'workbox-routing',
            className: 'NavigationRoute',
            funcName: 'constructor',
            paramName: 'options.allowlist'
          });
          finalAssertExports.isArrayOfClass(denylist, RegExp, {
            moduleName: 'workbox-routing',
            className: 'NavigationRoute',
            funcName: 'constructor',
            paramName: 'options.denylist'
          });
        }
        super(options => this._match(options), handler);
        this._allowlist = allowlist;
        this._denylist = denylist;
      }
      /**
       * Routes match handler.
       *
       * @param {Object} options
       * @param {URL} options.url
       * @param {Request} options.request
       * @return {boolean}
       *
       * @private
       */
      _match({
        url,
        request
      }) {
        if (request && request.mode !== 'navigate') {
          return false;
        }
        const pathnameAndSearch = url.pathname + url.search;
        for (const regExp of this._denylist) {
          if (regExp.test(pathnameAndSearch)) {
            {
              logger.log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL matches this denylist pattern: ` + `${regExp.toString()}`);
            }
            return false;
          }
        }
        if (this._allowlist.some(regExp => regExp.test(pathnameAndSearch))) {
          {
            logger.debug(`The navigation route ${pathnameAndSearch} ` + `is being used.`);
          }
          return true;
        }
        {
          logger.log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL being navigated to doesn't ` + `match the allowlist.`);
        }
        return false;
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Helper function that calls
     * {@link PrecacheController#createHandlerBoundToURL} on the default
     * {@link PrecacheController} instance.
     *
     * If you are creating your own {@link PrecacheController}, then call the
     * {@link PrecacheController#createHandlerBoundToURL} on that instance,
     * instead of using this function.
     *
     * @param {string} url The precached URL which will be used to lookup the
     * `Response`.
     * @param {boolean} [fallbackToNetwork=true] Whether to attempt to get the
     * response from the network if there's a precache miss.
     * @return {workbox-routing~handlerCallback}
     *
     * @memberof workbox-precaching
     */
    function createHandlerBoundToURL(url) {
      const precacheController = getOrCreatePrecacheController();
      return precacheController.createHandlerBoundToURL(url);
    }

    exports.CacheableResponsePlugin = CacheableResponsePlugin;
    exports.ExpirationPlugin = ExpirationPlugin;
    exports.NavigationRoute = NavigationRoute;
    exports.NetworkFirst = NetworkFirst;
    exports.cleanupOutdatedCaches = cleanupOutdatedCaches;
    exports.clientsClaim = clientsClaim;
    exports.createHandlerBoundToURL = createHandlerBoundToURL;
    exports.precacheAndRoute = precacheAndRoute;
    exports.registerRoute = registerRoute;

}));
