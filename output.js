//Fri Aug 14 2026 06:53:32 GMT+0000 (Coordinated Universal Time)
//Base:<url id="cv1cref6o68qmpt26ol0" type="url" status="parsed" title="GitHub - echo094/decode-js: JS混淆代码的AST分析工具 AST analysis tool for obfuscated JS code" wc="2165">https://github.com/echo094/decode-js</url>
//Modify:<url id="cv1cref6o68qmpt26olg" type="url" status="parsed" title="GitHub - smallfawn/decode_action: 世界上本来不存在加密，加密的人多了，也便成就了解密" wc="741">https://github.com/smallfawn/decode_action</url>
var compose = (a, b, c) => {
  return (d, e) => {
    let f = -1;
    return g(0);
    async function g(h) {
      if (h <= f) {
        throw new Error("next() called multiple times");
      }
      f = h;
      let j;
      let k = false;
      let l;
      a[h] ? (l = a[h][0][0], d.req.routeIndex = h) : l = h === a.length && e || undefined;
      if (l) {
        try {
          j = await l(d, () => g(h + 1));
        } catch (m) {
          if (m instanceof Error && b) {
            d.error = m;
            j = await b(m, d);
            k = true;
          } else {
            throw m;
          }
        }
      } else {
        d.finalized === false && c && (j = await c(d));
      }
      j && (d.finalized === false || k) && (d.res = j);
      return d;
    }
  };
};
var GET_MATCH_RESULT = Symbol();
var parseBody = async (b, c = Object.create(null)) => {
  const {
    all = false,
    dot = false
  } = c;
  const d = b instanceof HonoRequest ? b.raw.headers : b.headers;
  const e = d.get("Content-Type");
  if (e?.["startsWith"]("multipart/form-data") || e?.["startsWith"]("application/x-www-form-urlencoded")) {
    const f = {
      all: all,
      dot: dot
    };
    return parseFormData(b, f);
  }
  return {};
};
async function parseFormData(a, b) {
  const c = await a.formData();
  if (c) {
    return convertFormDataToBodyData(c, b);
  }
  return {};
}
function convertFormDataToBodyData(a, b) {
  const c = Object.create(null);
  a.forEach((d, e) => {
    const f = b.all || e.endsWith("[]");
    !f ? c[e] = d : handleParsingAllValues(c, e, d);
  });
  b.dot && Object.entries(c).forEach(([d, e]) => {
    const f = d.includes(".");
    f && (handleParsingNestedValues(c, d, e), delete c[d]);
  });
  return c;
}
var handleParsingAllValues = (a, b, c) => {
  if (a[b] !== undefined) {
    if (Array.isArray(a[b])) {
      a[b].push(c);
    } else {
      a[b] = [a[b], c];
    }
  } else {
    !b.endsWith("[]") ? a[b] = c : a[b] = [c];
  }
};
var handleParsingNestedValues = (a, b, c) => {
  let d = a;
  const e = b.split(".");
  e.forEach((f, g) => {
    g === e.length - 1 ? d[f] = c : ((!d[f] || typeof d[f] !== "object" || Array.isArray(d[f]) || d[f] instanceof File) && (d[f] = Object.create(null)), d = d[f]);
  });
};
var splitPath = a => {
  const b = a.split("/");
  b[0] === "" && b.shift();
  return b;
};
var splitRoutingPath = a => {
  const {
    groups: b,
    path: c
  } = extractGroupsFromPath(a);
  const d = splitPath(c);
  return replaceGroupMarks(d, b);
};
var extractGroupsFromPath = b => {
  const c = [];
  b = b.replace(/\{[^}]+\}/g, (e, f) => {
    const g = "@" + f;
    c.push([g, e]);
    return g;
  });
  const d = {
    groups: c,
    path: b
  };
  return d;
};
var replaceGroupMarks = (a, b) => {
  for (let c = b.length - 1; c >= 0; c--) {
    const [d] = b[c];
    for (let e = a.length - 1; e >= 0; e--) {
      if (a[e].includes(d)) {
        a[e] = a[e].replace(d, b[c][1]);
        break;
      }
    }
  }
  return a;
};
var patternCache = {};
var getPattern = (a, b) => {
  if (a === "*") {
    return "*";
  }
  const c = a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (c) {
    const d = a + "#" + b;
    !patternCache[d] && (c[2] ? patternCache[d] = b && b[0] !== ":" && b[0] !== "*" ? [d, c[1], new RegExp("^" + c[2] + "(?=/" + b + ")")] : [a, c[1], new RegExp("^" + c[2] + "$")] : patternCache[d] = [a, c[1], true]);
    return patternCache[d];
  }
  return null;
};
var tryDecode = (a, b) => {
  try {
    return b(a);
  } catch {
    return a.replace(/(?:%[0-9A-Fa-f]{2})+/g, c => {
      try {
        return b(c);
      } catch {
        return c;
      }
    });
  }
};
var tryDecodeURI = a => tryDecode(a, decodeURI);
var getPath = a => {
  const b = a.url;
  const c = b.indexOf("/", b.indexOf(":") + 4);
  let d = c;
  for (; d < b.length; d++) {
    const e = b.charCodeAt(d);
    if (e === 37) {
      const f = b.indexOf("?", d);
      const g = b.slice(c, f === -1 ? undefined : f);
      return tryDecodeURI(g.includes("%25") ? g.replace(/%25/g, "%2525") : g);
    } else {
      if (e === 63) {
        break;
      }
    }
  }
  return b.slice(c, d);
};
var getPathNoStrict = a => {
  const b = getPath(a);
  return b.length > 1 && b.at(-1) === "/" ? b.slice(0, -1) : b;
};
var mergePath = (a, b, ...c) => {
  c.length && (b = mergePath(b, ...c));
  return "" + (a?.[0] === "/" ? "" : "/") + a + (b === "/" ? "" : "" + (a?.["at"](-1) === "/" ? "" : "/") + (b?.[0] === "/" ? b.slice(1) : b));
};
var checkOptionalParameter = a => {
  if (a.charCodeAt(a.length - 1) !== 63 || !a.includes(":")) {
    return null;
  }
  const b = a.split("/");
  const c = [];
  let d = "";
  b.forEach(e => {
    if (e !== "" && !/\:/.test(e)) {
      d += "/" + e;
    } else {
      if (/\:/.test(e)) {
        if (/\?/.test(e)) {
          c.length === 0 && d === "" ? c.push("/") : c.push(d);
          const f = e.replace("?", "");
          d += "/" + f;
          c.push(d);
        } else {
          d += "/" + e;
        }
      }
    }
  });
  return c.filter((e, f, g) => g.indexOf(e) === f);
};
var _decodeURI = a => {
  if (!/[%+]/.test(a)) {
    return a;
  }
  a.indexOf("+") !== -1 && (a = a.replace(/\+/g, " "));
  return a.indexOf("%") !== -1 ? tryDecode(a, decodeURIComponent_) : a;
};
var _getQueryParam = (a, b, c) => {
  let d;
  if (!c && b && !/[%+]/.test(b)) {
    let g = a.indexOf("?", 8);
    if (g === -1) {
      return undefined;
    }
    !a.startsWith(b, g + 1) && (g = a.indexOf("&" + b, g + 1));
    while (g !== -1) {
      const h = a.charCodeAt(g + b.length + 1);
      if (h === 61) {
        const i = g + b.length + 2;
        const j = a.indexOf("&", i);
        return _decodeURI(a.slice(i, j === -1 ? undefined : j));
      } else {
        if (h == 38 || isNaN(h)) {
          return "";
        }
      }
      g = a.indexOf("&" + b, g + 1);
    }
    d = /[%+]/.test(a);
    if (!d) {
      return undefined;
    }
  }
  const e = {};
  d ??= /[%+]/.test(a);
  let f = a.indexOf("?", 8);
  while (f !== -1) {
    const k = a.indexOf("&", f + 1);
    let l = a.indexOf("=", f);
    l > k && k !== -1 && (l = -1);
    let m = a.slice(f + 1, l === -1 ? k === -1 ? undefined : k : l);
    d && (m = _decodeURI(m));
    f = k;
    if (m === "") {
      continue;
    }
    let n;
    l === -1 ? n = "" : (n = a.slice(l + 1, k === -1 ? undefined : k), d && (n = _decodeURI(n)));
    if (c) {
      !(e[m] && Array.isArray(e[m])) && (e[m] = []);
      e[m].push(n);
    } else {
      e[m] ??= n;
    }
  }
  return b ? e[b] : e;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (a, b) => {
  return _getQueryParam(a, b, true);
};
var decodeURIComponent_ = decodeURIComponent;
var tryDecodeURIComponent = a => tryDecode(a, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(a, b = "/", c = [[]]) {
    this.raw = a;
    this.path = b;
    this.#matchResult = c;
    this.#validatedData = {};
  }
  param(a) {
    return a ? this.#getDecodedParam(a) : this.#getAllDecodedParams();
  }
  #getDecodedParam(a) {
    const b = this.#matchResult[0][this.routeIndex][1][a];
    const c = this.#getParamValue(b);
    return c && /\%/.test(c) ? tryDecodeURIComponent(c) : c;
  }
  #getAllDecodedParams() {
    const a = {};
    const b = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const c of b) {
      const d = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][c]);
      d !== undefined && (a[c] = /\%/.test(d) ? tryDecodeURIComponent(d) : d);
    }
    return a;
  }
  #getParamValue(a) {
    return this.#matchResult[1] ? this.#matchResult[1][a] : a;
  }
  query(a) {
    return getQueryParam(this.url, a);
  }
  queries(a) {
    return getQueryParams(this.url, a);
  }
  header(a) {
    if (a) {
      return this.raw.headers.get(a) ?? undefined;
    }
    const b = {};
    this.raw.headers.forEach((c, d) => {
      b[d] = c;
    });
    return b;
  }
  async parseBody(a) {
    return this.bodyCache.parsedBody ??= await parseBody(this, a);
  }
  #cachedBody = a => {
    const {
      bodyCache: b,
      raw: c
    } = this;
    const d = b[a];
    if (d) {
      return d;
    }
    const e = Object.keys(b)[0];
    if (e) {
      return b[e].then(f => {
        e === "json" && (f = JSON.stringify(f));
        return new Response(f)[a]();
      });
    }
    return b[a] = c[a]();
  };
  json() {
    return this.#cachedBody("text").then(a => JSON.parse(a));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(a, b) {
    this.#validatedData[a] = b;
  }
  valid(a) {
    return this.#validatedData[a];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, a]]) => a);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, a]]) => a)[this.routeIndex].path;
  }
};
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (a, b) => {
  const c = new String(a);
  c.isEscaped = true;
  c.callbacks = b;
  return c;
};
var resolveCallback = async (b, c, d, e, f) => {
  typeof b === "object" && !(b instanceof String) && (!(b instanceof Promise) && (b = b.toString()), b instanceof Promise && (b = await b));
  const g = b.callbacks;
  if (!g?.["length"]) {
    return Promise.resolve(b);
  }
  f ? f[0] += b : f = [b];
  const h = {
    phase: c,
    buffer: f,
    context: e
  };
  const i = Promise.all(g.map(j => j(h))).then(j => Promise.all(j.filter(Boolean).map(k => resolveCallback(k, c, false, e, f))).then(() => f[0]));
  return d ? raw(await i, g) : i;
};
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (b, c) => {
  const d = {
    "Content-Type": b,
    ...c
  };
  return d;
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(a, b) {
    this.#rawRequest = a;
    b && (this.#executionCtx = b.executionCtx, this.env = b.env, this.#notFoundHandler = b.notFoundHandler, this.#path = b.path, this.#matchResult = b.matchResult);
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(a) {
    if (this.#res && a) {
      a = new Response(a.body, a);
      for (const [b, c] of this.#res.headers.entries()) {
        if (b === "content-type") {
          continue;
        }
        if (b === "set-cookie") {
          const d = this.#res.headers.getSetCookie();
          a.headers.delete("set-cookie");
          for (const e of d) {
            a.headers.append("set-cookie", e);
          }
        } else {
          a.headers.set(b, c);
        }
      }
    }
    this.#res = a;
    this.finalized = true;
  }
  render = (...a) => {
    this.#renderer ??= b => this.html(b);
    return this.#renderer(...a);
  };
  setLayout = a => this.#layout = a;
  getLayout = () => this.#layout;
  setRenderer = a => {
    this.#renderer = a;
  };
  header = (a, b, c) => {
    this.finalized && (this.#res = new Response(this.#res.body, this.#res));
    const d = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (b === undefined) {
      d.delete(a);
    } else {
      c?.["append"] ? d.append(a, b) : d.set(a, b);
    }
  };
  status = a => {
    this.#status = a;
  };
  set = (a, b) => {
    this.#var ??= new Map();
    this.#var.set(a, b);
  };
  get = a => {
    return this.#var ? this.#var.get(a) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(b, c, d) {
    const e = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof c === "object" && "headers" in c) {
      const h = c.headers instanceof Headers ? c.headers : new Headers(c.headers);
      for (const [i, j] of h) {
        i.toLowerCase() === "set-cookie" ? e.append(i, j) : e.set(i, j);
      }
    }
    if (d) {
      for (const [l, m] of Object.entries(d)) {
        if (typeof m === "string") {
          e.set(l, m);
        } else {
          e.delete(l);
          for (const n of m) {
            e.append(l, n);
          }
        }
      }
    }
    const f = typeof c === "number" ? c : c?.["status"] ?? this.#status;
    const g = {
      status: f,
      headers: e
    };
    return new Response(b, g);
  }
  newResponse = (...a) => this.#newResponse(...a);
  body = (a, b, c) => this.#newResponse(a, b, c);
  text = (a, b, c) => {
    return !this.#preparedHeaders && !this.#status && !b && !c && !this.finalized ? new Response(a) : this.#newResponse(a, b, setDefaultContentType(TEXT_PLAIN, c));
  };
  json = (a, b, c) => {
    return this.#newResponse(JSON.stringify(a), b, setDefaultContentType("application/json", c));
  };
  html = (a, b, c) => {
    const d = e => this.#newResponse(e, b, setDefaultContentType("text/html; charset=UTF-8", c));
    return typeof a === "object" ? resolveCallback(a, HtmlEscapedCallbackPhase.Stringify, false, {}).then(d) : d(a);
  };
  redirect = (a, b) => {
    const c = String(a);
    this.header("Location", !/[^\x00-\xFF]/.test(c) ? c : encodeURI(c));
    return this.newResponse(null, b ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {};
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
var notFoundHandler = a => {
  return a.text("404 Not Found", 404);
};
var errorHandler = (a, b) => {
  if ("getResponse" in a) {
    const d = a.getResponse();
    return b.newResponse(d.body, d);
  }
  console.error(a);
  return b.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(a = {}) {
    const b = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    b.forEach(e => {
      this[e] = (f, ...g) => {
        typeof f === "string" ? this.#path = f : this.#addRoute(e, this.#path, f);
        g.forEach(h => {
          this.#addRoute(e, this.#path, h);
        });
        return this;
      };
    });
    this.on = (e, f, ...g) => {
      for (const h of [f].flat()) {
        this.#path = h;
        for (const i of [e].flat()) {
          g.map(j => {
            this.#addRoute(i.toUpperCase(), this.#path, j);
          });
        }
      }
      return this;
    };
    this.use = (e, ...f) => {
      typeof e === "string" ? this.#path = e : (this.#path = "*", f.unshift(e));
      f.forEach(g => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, g);
      });
      return this;
    };
    const {
      strict: c,
      ...d
    } = a;
    Object.assign(this, d);
    this.getPath = c ?? true ? a.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const b = {
      router: this.router,
      getPath: this.getPath
    };
    const c = new Hono(b);
    c.errorHandler = this.errorHandler;
    c.#notFoundHandler = this.#notFoundHandler;
    c.routes = this.routes;
    return c;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(a, b) {
    const c = this.basePath(a);
    b.routes.map(d => {
      let e;
      b.errorHandler === errorHandler ? e = d.handler : (e = async (f, g) => (await compose([], b.errorHandler)(f, () => d.handler(f, g))).res, e[COMPOSED_HANDLER] = d.handler);
      c.#addRoute(d.method, d.path, e);
    });
    return this;
  }
  basePath(a) {
    const b = this.#clone();
    b._basePath = mergePath(this._basePath, a);
    return b;
  }
  onError = a => {
    this.errorHandler = a;
    return this;
  };
  notFound = a => {
    this.#notFoundHandler = a;
    return this;
  };
  mount(a, b, c) {
    let d;
    let e;
    c && (typeof c === "function" ? e = c : (e = c.optionHandler, c.replaceRequest === false ? d = h => h : d = c.replaceRequest));
    const f = e ? h => {
      const i = e(h);
      return Array.isArray(i) ? i : [i];
    } : h => {
      let i = undefined;
      try {
        i = h.executionCtx;
      } catch {}
      return [h.env, i];
    };
    d ||= (() => {
      const h = mergePath(this._basePath, a);
      const i = h === "/" ? 0 : h.length;
      return j => {
        const k = new URL(j.url);
        k.pathname = k.pathname.slice(i) || "/";
        return new Request(k, j);
      };
    })();
    const g = async (h, i) => {
      const j = await b(d(h.req.raw), ...f(h));
      if (j) {
        return j;
      }
      await i();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(a, "*"), g);
    return this;
  }
  #addRoute(b, c, d) {
    b = b.toUpperCase();
    c = mergePath(this._basePath, c);
    const f = {
      basePath: this._basePath,
      path: c,
      method: b,
      handler: d
    };
    this.router.add(b, c, [d, f]);
    this.routes.push(f);
  }
  #handleError(a, b) {
    if (a instanceof Error) {
      return this.errorHandler(a, b);
    }
    throw a;
  }
  #dispatch(d, e, f, g) {
    if (g === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(d, e, f, "GET")))();
    }
    const h = {
      env: f
    };
    const i = this.getPath(d, h);
    const j = this.router.match(g, i);
    const k = {
      path: i,
      matchResult: j,
      env: f,
      executionCtx: e,
      notFoundHandler: this.#notFoundHandler
    };
    const l = new Context(d, k);
    if (j[0].length === 1) {
      let n;
      try {
        n = j[0][0][0][0](l, async () => {
          l.res = await this.#notFoundHandler(l);
        });
      } catch (o) {
        return this.#handleError(o, l);
      }
      return n instanceof Promise ? n.then(p => p || (l.finalized ? l.res : this.#notFoundHandler(l))).catch(p => this.#handleError(p, l)) : n ?? this.#notFoundHandler(l);
    }
    const m = compose(j[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const p = await m(l);
        if (!p.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return p.res;
      } catch (q) {
        return this.#handleError(q, l);
      }
    })();
  }
  fetch = (a, ...b) => {
    return this.#dispatch(a, b[1], b[0], a.method);
  };
  request = (a, b, c, d) => {
    if (a instanceof Request) {
      return this.fetch(b ? new Request(a, b) : a, c, d);
    }
    a = a.toString();
    return this.fetch(new Request(/^https?:\/\//.test(a) ? a : "http://localhost" + mergePath("/", a), b), c, d);
  };
  fire = () => {
    addEventListener("fetch", a => {
      a.respondWith(this.#dispatch(a.request, a, undefined, a.request.method));
    });
  };
};
var emptyParam = [];
function match(a, b) {
  const c = this.buildAllMatchers();
  const d = (e, f) => {
    const g = c[e] || c[METHOD_NAME_ALL];
    const h = g[2][f];
    if (h) {
      return h;
    }
    const i = f.match(g[0]);
    if (!i) {
      return [[], emptyParam];
    }
    const j = i.indexOf("", 1);
    return [g[1][j], i];
  };
  this.match = d;
  return d(a, b);
}
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(c, d) {
  if (c.length === 1) {
    return d.length === 1 ? c < d ? -1 : 1 : -1;
  }
  if (d.length === 1) {
    return 1;
  }
  if (c === ONLY_WILDCARD_REG_EXP_STR || c === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else {
    if (d === ONLY_WILDCARD_REG_EXP_STR || d === TAIL_WILDCARD_REG_EXP_STR) {
      return -1;
    }
  }
  if (c === LABEL_REG_EXP_STR) {
    return 1;
  } else {
    if (d === LABEL_REG_EXP_STR) {
      return -1;
    }
  }
  return c.length === d.length ? c < d ? -1 : 1 : d.length - c.length;
}
var Node = class {
  #index;
  #varIndex;
  #children = Object.create(null);
  insert(a, b, c, d, e) {
    if (a.length === 0) {
      if (this.#index !== undefined) {
        throw PATH_ERROR;
      }
      if (e) {
        return;
      }
      this.#index = b;
      return;
    }
    const [f, ...g] = a;
    const h = f === "*" ? g.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : f === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : f.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let i;
    if (h) {
      const j = h[1];
      let k = h[2] || LABEL_REG_EXP_STR;
      if (j && h[2]) {
        if (k === ".*") {
          throw PATH_ERROR;
        }
        k = k.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(k)) {
          throw PATH_ERROR;
        }
      }
      i = this.#children[k];
      if (!i) {
        if (Object.keys(this.#children).some(l => l !== ONLY_WILDCARD_REG_EXP_STR && l !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (e) {
          return;
        }
        i = this.#children[k] = new Node();
        j !== "" && (i.#varIndex = d.varIndex++);
      }
      !e && j !== "" && c.push([j, i.#varIndex]);
    } else {
      i = this.#children[f];
      if (!i) {
        if (Object.keys(this.#children).some(l => l.length > 1 && l !== ONLY_WILDCARD_REG_EXP_STR && l !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (e) {
          return;
        }
        i = this.#children[f] = new Node();
      }
    }
    i.insert(g, b, c, d, e);
  }
  buildRegExpStr() {
    const a = Object.keys(this.#children).sort(compareKey);
    const b = a.map(d => {
      const e = this.#children[d];
      return (typeof e.#varIndex === "number" ? "(" + d + ")@" + e.#varIndex : regExpMetaChars.has(d) ? "\\" + d : d) + e.buildRegExpStr();
    });
    typeof this.#index === "number" && b.unshift("#" + this.#index);
    if (b.length === 0) {
      return "";
    }
    if (b.length === 1) {
      return b[0];
    }
    return "(?:" + b.join("|") + ")";
  }
};
const a0f = {
  varIndex: 0
};
var Trie = class {
  #context = a0f;
  #root = new Node();
  insert(a, b, c) {
    const d = [];
    const e = [];
    for (let g = 0;;) {
      let h = false;
      a = a.replace(/\{[^}]+\}/g, k => {
        const l = "@\\" + g;
        e[g] = [l, k];
        g++;
        h = true;
        return l;
      });
      if (!h) {
        break;
      }
    }
    const f = a.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let k = e.length - 1; k >= 0; k--) {
      const [l] = e[k];
      for (let m = f.length - 1; m >= 0; m--) {
        if (f[m].indexOf(l) !== -1) {
          f[m] = f[m].replace(l, e[k][1]);
          break;
        }
      }
    }
    this.#root.insert(f, b, d, this.#context, c);
    return d;
  }
  buildRegExp() {
    let a = this.#root.buildRegExpStr();
    if (a === "") {
      return [/^$/, [], []];
    }
    let b = 0;
    const c = [];
    const d = [];
    a = a.replace(/#(\d+)|@(\d+)|\.\*\$/g, (e, f, g) => {
      if (f !== undefined) {
        c[++b] = Number(f);
        return "$()";
      }
      if (g !== undefined) {
        d[Number(g)] = ++b;
        return "";
      }
      return "";
    });
    return [new RegExp("^" + a), c, d];
  }
};
var nullMatcher = [/^$/, [], Object.create(null)];
var wildcardRegExpCache = Object.create(null);
function buildWildcardRegExp(a) {
  return wildcardRegExpCache[a] ??= new RegExp(a === "*" ? "" : "^" + a.replace(/\/\*$|([.\\+*[^\]$()])/g, (b, c) => c ? "\\" + c : "(?:|/.*)") + "$");
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(a) {
  const b = new Trie();
  const c = [];
  if (a.length === 0) {
    return nullMatcher;
  }
  const d = a.map(n => [!/\*|\/:/.test(n[0]), ...n]).sort(([n, o], [p, q]) => n ? 1 : p ? -1 : o.length - q.length);
  const f = Object.create(null);
  for (let n = 0, o = -1, p = d.length; n < p; n++) {
    const [q, r, s] = d[n];
    q ? f[r] = [s.map(([u]) => [u, Object.create(null)]), emptyParam] : o++;
    let t;
    try {
      t = b.insert(r, o, q);
    } catch (u) {
      throw u === PATH_ERROR ? new UnsupportedPathError(r) : u;
    }
    if (q) {
      continue;
    }
    c[o] = s.map(([v, w]) => {
      const x = Object.create(null);
      w -= 1;
      for (; w >= 0; w--) {
        const [y, z] = t[w];
        x[y] = z;
      }
      return [v, x];
    });
  }
  const [g, h, l] = b.buildRegExp();
  for (let v = 0, w = c.length; v < w; v++) {
    for (let x = 0, y = c[v].length; x < y; x++) {
      const z = c[v][x]?.[1];
      if (!z) {
        continue;
      }
      const A = Object.keys(z);
      for (let B = 0, C = A.length; B < C; B++) {
        z[A[B]] = l[z[A[B]]];
      }
    }
  }
  const m = [];
  for (const D in h) {
    m[D] = c[h[D]];
  }
  return [g, m, f];
}
function findMiddleware(a, b) {
  if (!a) {
    return undefined;
  }
  for (const c of Object.keys(a).sort((d, e) => e.length - d.length)) {
    if (buildWildcardRegExp(c).test(b)) {
      return [...a[c]];
    }
  }
  return undefined;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = {
      [METHOD_NAME_ALL]: Object.create(null)
    };
    this.#routes = {
      [METHOD_NAME_ALL]: Object.create(null)
    };
  }
  add(a, b, c) {
    const d = this.#middleware;
    const e = this.#routes;
    if (!d || !e) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!d[a]) {
      [d, e].forEach(h => {
        h[a] = Object.create(null);
        Object.keys(h[METHOD_NAME_ALL]).forEach(j => {
          h[a][j] = [...h[METHOD_NAME_ALL][j]];
        });
      });
    }
    b === "/*" && (b = "*");
    const f = (b.match(/\/:/g) || []).length;
    if (/\*$/.test(b)) {
      const h = buildWildcardRegExp(b);
      a === METHOD_NAME_ALL ? Object.keys(d).forEach(j => {
        d[j][b] ||= findMiddleware(d[j], b) || findMiddleware(d[METHOD_NAME_ALL], b) || [];
      }) : d[a][b] ||= findMiddleware(d[a], b) || findMiddleware(d[METHOD_NAME_ALL], b) || [];
      Object.keys(d).forEach(j => {
        (a === METHOD_NAME_ALL || a === j) && Object.keys(d[j]).forEach(k => {
          h.test(k) && d[j][k].push([c, f]);
        });
      });
      Object.keys(e).forEach(j => {
        (a === METHOD_NAME_ALL || a === j) && Object.keys(e[j]).forEach(k => h.test(k) && e[j][k].push([c, f]));
      });
      return;
    }
    const g = checkOptionalParameter(b) || [b];
    for (let j = 0, k = g.length; j < k; j++) {
      const l = g[j];
      Object.keys(e).forEach(n => {
        (a === METHOD_NAME_ALL || a === n) && (e[n][l] ||= [...(findMiddleware(d[n], l) || findMiddleware(d[METHOD_NAME_ALL], l) || [])], e[n][l].push([c, f - k + j + 1]));
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const a = Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach(b => {
      a[b] ||= this.#buildMatcher(b);
    });
    this.#middleware = this.#routes = undefined;
    clearWildcardRegExpCache();
    return a;
  }
  #buildMatcher(a) {
    const b = [];
    let c = a === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach(d => {
      const e = d[a] ? Object.keys(d[a]).map(f => [f, d[a][f]]) : [];
      if (e.length !== 0) {
        c ||= true;
        b.push(...e);
      } else {
        a !== METHOD_NAME_ALL && b.push(...Object.keys(d[METHOD_NAME_ALL]).map(f => [f, d[METHOD_NAME_ALL][f]]));
      }
    });
    return !c ? null : buildMatcherFromPreprocessedRoutes(b);
  }
};
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(a) {
    this.#routers = a.routers;
  }
  add(a, b, c) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([a, b, c]);
  }
  match(a, b) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const c = this.#routers;
    const d = this.#routes;
    const f = c.length;
    let g = 0;
    let h;
    for (; g < f; g++) {
      const j = c[g];
      try {
        for (let k = 0, l = d.length; k < l; k++) {
          j.add(...d[k]);
        }
        h = j.match(a, b);
      } catch (m) {
        if (m instanceof UnsupportedPathError) {
          continue;
        }
        throw m;
      }
      this.match = j.match.bind(j);
      this.#routers = [j];
      this.#routes = undefined;
      break;
    }
    if (g === f) {
      throw new Error("Fatal error");
    }
    this.name = "SmartRouter + " + this.activeRouter.name;
    return h;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};
var emptyParams = Object.create(null);
var Node2 = class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(b, c, d) {
    this.#children = d || Object.create(null);
    this.#methods = [];
    if (b && c) {
      const e = Object.create(null);
      const f = {
        handler: c,
        possibleKeys: [],
        score: 0
      };
      e[b] = f;
      this.#methods = [e];
    }
    this.#patterns = [];
  }
  insert(a, b, c) {
    this.#order = ++this.#order;
    let d = this;
    const e = splitRoutingPath(b);
    const f = [];
    for (let g = 0, h = e.length; g < h; g++) {
      const j = e[g];
      const k = e[g + 1];
      const l = getPattern(j, k);
      const m = Array.isArray(l) ? l[0] : j;
      if (m in d.#children) {
        d = d.#children[m];
        l && f.push(l[1]);
        continue;
      }
      d.#children[m] = new Node2();
      l && (d.#patterns.push(l), f.push(l[1]));
      d = d.#children[m];
    }
    d.#methods.push({
      [a]: {
        handler: c,
        possibleKeys: f.filter((n, o, q) => q.indexOf(n) === o),
        score: this.#order
      }
    });
    return d;
  }
  #getHandlerSets(a, b, c, d) {
    const e = [];
    for (let f = 0, g = a.#methods.length; f < g; f++) {
      const h = a.#methods[f];
      const j = h[b] || h[METHOD_NAME_ALL];
      const k = {};
      if (j !== undefined) {
        j.params = Object.create(null);
        e.push(j);
        if (c !== emptyParams || d && d !== emptyParams) {
          for (let l = 0, n = j.possibleKeys.length; l < n; l++) {
            const o = j.possibleKeys[l];
            const p = k[j.score];
            j.params[o] = d?.[o] && !p ? d[o] : c[o] ?? d?.[o];
            k[j.score] = true;
          }
        }
      }
    }
    return e;
  }
  search(a, b) {
    const c = [];
    this.#params = emptyParams;
    const d = this;
    let e = [d];
    const f = splitPath(b);
    const g = [];
    for (let h = 0, l = f.length; h < l; h++) {
      const n = f[h];
      const o = h === l - 1;
      const p = [];
      for (let q = 0, r = e.length; q < r; q++) {
        const s = e[q];
        const t = s.#children[n];
        t && (t.#params = s.#params, o ? (t.#children["*"] && c.push(...this.#getHandlerSets(t.#children["*"], a, s.#params)), c.push(...this.#getHandlerSets(t, a, s.#params))) : p.push(t));
        for (let u = 0, v = s.#patterns.length; u < v; u++) {
          const w = s.#patterns[u];
          const x = s.#params === emptyParams ? {} : {
            ...s.#params
          };
          if (w === "*") {
            const D = s.#children["*"];
            D && (c.push(...this.#getHandlerSets(D, a, s.#params)), D.#params = x, p.push(D));
            continue;
          }
          const [y, z, A] = w;
          if (!n && !(A instanceof RegExp)) {
            continue;
          }
          const B = s.#children[y];
          const C = f.slice(h).join("/");
          if (A instanceof RegExp) {
            const E = A.exec(C);
            if (E) {
              x[z] = E[0];
              c.push(...this.#getHandlerSets(B, a, s.#params, x));
              if (Object.keys(B.#children).length) {
                B.#params = x;
                const F = E[0].match(/\//)?.["length"] ?? 0;
                g[F] ||= [];
                const G = g[F];
                G.push(B);
              }
              continue;
            }
          }
          (A === true || A.test(n)) && (x[z] = n, o ? (c.push(...this.#getHandlerSets(B, a, x, s.#params)), B.#children["*"] && c.push(...this.#getHandlerSets(B.#children["*"], a, x, s.#params))) : (B.#params = x, p.push(B)));
        }
      }
      e = p.concat(g.shift() ?? []);
    }
    c.length > 1 && c.sort((H, I) => {
      return H.score - I.score;
    });
    return [c.map(({
      handler: H,
      params: I
    }) => [H, I])];
  }
};
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(a, b, c) {
    const d = checkOptionalParameter(b);
    if (d) {
      for (let e = 0, f = d.length; e < f; e++) {
        this.#node.insert(a, d[e], c);
      }
      return;
    }
    this.#node.insert(a, b, c);
  }
  match(a, b) {
    return this.#node.search(a, b);
  }
};
var Hono2 = class extends Hono {
  constructor(a = {}) {
    super(a);
    this.router = a.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};
import { createRequire } from "module";
function isNodeEnvironment() {
  if (typeof globalThis.addEventListener !== "undefined") {
    return false;
  }
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    return true;
  }
  return true;
}
var config;
var isNodeEnvironment2 = isNodeEnvironment;
function processConfig(a) {
  (a.token_prefix === "/" || a.token_prefix === "//" || a.token_prefix === "") && (a.token_prefix = "/default/", a.default_password = true);
  return a;
}
function getConfig() {
  if (isNodeEnvironment2()) {
    if (config === undefined) {
      const c = {
        proxy_url: globalThis.proxy_url || "http://localhost:5006",
        local_listen_port: globalThis.local_listen_port || 5006,
        token_prefix: globalThis.token_prefix || "/user22334455/"
      };
      return c;
    }
    !("token_prefix" in config) && (config.token_prefix = globalThis.token_prefix || "/user22334455/");
    return config;
  } else {
    const d = {
      proxy_url: globalThis.proxy_url,
      token_prefix: globalThis.token_prefix,
      local_listen_port: 443
    };
    config = d;
    config = processConfig(config);
    return config;
  }
}
var bodyModifyExcludeHosts = ["telegram.org"];
function isExcludedForBodyModify(a) {
  let b = false;
  bodyModifyExcludeHosts.forEach(c => {
    a.includes(c) && (b = true);
  });
  return b;
}
var filterList = ["telegram.org/service_worker.js", "elcomercio.pe", "exchangebank.com"];
function need2beFiltered(a) {
  if (!a || typeof a !== "string") {
    return false;
  }
  let b = false;
  filterList.map(c => {
    a.includes(c) && (b = true);
  });
  return b;
}
function replaceOutsideQuotes(a, b, d) {
  const e = a.length;
  let f = 0;
  let g = 0;
  let h = "";
  let l = ";";
  const n = "(,;:!&|?=+-*~<>{}[]^%";
  const o = new Set(["return", "throw", "typeof", "delete", "instanceof", "in", "of", "new", "void", "yield", "await", "case", "do", "else"]);
  function p(s) {
    g < s && (h += a.slice(g, s).replace(b, d));
    g = s;
  }
  function q(s) {
    g < s && (h += a.slice(g, s));
    g = s;
  }
  function r(s) {
    let t = s - 1;
    while (t >= 0 && /[\s\n\r\t]/.test(a[t])) {
      t--;
    }
    if (t < 0) {
      return false;
    }
    if (!/[a-zA-Z_$]/.test(a[t])) {
      return false;
    }
    let u = t + 1;
    while (t >= 0 && /[a-zA-Z0-9_$]/.test(a[t])) {
      t--;
    }
    const v = a.slice(t + 1, u);
    if (!o.has(v)) {
      return false;
    }
    if (t >= 0 && a[t] === ".") {
      return false;
    }
    return true;
  }
  while (f < e) {
    const s = a[f];
    if (s === "/" && a[f + 1] === "*") {
      p(f);
      let t = f + 2;
      while (t < e) {
        if (a[t] === "*" && a[t + 1] === "/") {
          t += 2;
          break;
        }
        t++;
      }
      q(t);
      f = t;
      l = "/";
      continue;
    }
    if (s === "/" && (n.indexOf(l) !== -1 || r(f))) {
      let u = f + 1;
      let v = false;
      let w = -1;
      while (u < e) {
        const x = a[u];
        if (x === "\\" && u + 1 < e) {
          u += 2;
          continue;
        }
        if (x === "\n") {
          break;
        }
        if (x === "[") {
          v = true;
        } else {
          if (x === "]") {
            v = false;
          } else {
            if (x === "/" && !v) {
              w = u;
              break;
            }
          }
        }
        u++;
      }
      if (w > 0) {
        let y = w + 1;
        while (y < e && /[gimsuy]/.test(a[y])) {
          y++;
        }
        const z = a[y];
        if (z === undefined || /[\s)\],;:!&|?+\-*=<>}.]/.test(z)) {
          p(f);
          q(y);
          f = y;
          l = "/";
          continue;
        }
      }
    }
    if (s === "/" && a[f + 1] === "/") {
      p(f);
      let A = f + 2;
      while (A < e && a[A] !== "\n") {
        A++;
      }
      q(A);
      f = A;
      l = "/";
      continue;
    }
    if (s === "\"" || s === "'" || s === "`") {
      p(f);
      const B = s;
      let C = f + 1;
      while (C < e) {
        const D = a[C];
        if (D === "\\" && C + 1 < e) {
          C += 2;
          continue;
        }
        if (B === "`" && D === "$" && a[C + 1] === "{") {
          q(C + 2);
          let E = 1;
          let F = C + 2;
          const G = F;
          while (F < e && E > 0) {
            const I = a[F];
            if (I === "\"" || I === "'" || I === "`") {
              const J = I;
              F++;
              while (F < e) {
                const K = a[F];
                if (K === "\\") {
                  F += 2;
                  continue;
                }
                if (J === "`" && K === "$" && a[F + 1] === "{") {
                  let L = 1;
                  let M = F + 2;
                  while (M < e && L > 0) {
                    const N = a[M];
                    if (N === "{") {
                      L++;
                    } else {
                      if (N === "}") {
                        L--;
                      }
                    }
                    M++;
                  }
                  F = M;
                  continue;
                }
                if (K === J) {
                  F++;
                  break;
                }
                F++;
              }
              continue;
            }
            if (I === "{") {
              E++;
            } else {
              if (I === "}") {
                E--;
                if (E === 0) {
                  break;
                }
              }
            }
            F++;
          }
          const H = F;
          h += replaceOutsideQuotes(a.slice(G, H), b, d);
          g = H;
          C = H;
          continue;
        }
        if (D === B) {
          C++;
          break;
        }
        C++;
      }
      q(C);
      f = C;
      l = ")";
      continue;
    }
    s !== " " && s !== "\t" && s !== "\n" && s !== "\r" && (l = s);
    f++;
  }
  p(e);
  return h;
}
const a0g = {
  regex: /;\w+?\.integrity='sha.+?';/,
  replacement: ";"
};
const a0h = {
  domain: "google.com",
  replacements: [a0g]
};
var domainRegexMap = [a0h];
const a0i = {
  regex: /(?<![-\w])location(?![-\w])/,
  replacement: "___location"
};
const a0j = {
  regex: /\bnavigator.serviceWorker\b/,
  replacement: "navigator.___serviceWorker"
};
const a0k = {
  regex: /\bdocument.requestStorageAccessFor\b/,
  replacement: "document.___requestStorageAccessFor"
};
var bodyRegexMap = [a0i, a0j, a0k];
function modifyBody({
  body: a,
  proxy_real_host: b,
  proxy_real_protocol: c,
  proxy_url_prefix: d,
  token_prefix = "/user22334455/",
  skipUrlRewrite = false
}) {
  let e = String(a);
  typeof a === "string" && a.indexOf("document.URL") !== -1;
  !skipUrlRewrite && domainRegexMap.forEach(f => {
    b.includes(f.domain) && f.replacements.forEach(g => {
      e = e.replace(new RegExp(g.regex, "g"), g.replacement);
    });
  });
  bodyRegexMap.forEach(({
    regex: f,
    replacement: g
  }) => {
    e = replaceOutsideQuotes(e, new RegExp(f, "g"), g);
  });
  e = e.replace(/\bwindow\.location\.href\b/g, "window.___location.href");
  !skipUrlRewrite && (e = e.replace(/<script[^>]*>/gi, f => f.replace(/\s+integrity\s*=\s*['\"][^'\"]*['\"]/i, "")), e = e.replace(/<link[^>]*>/gi, f => f.replace(/\s+integrity\s*=\s*['\"][^'\"]*['\"]/i, "")));
  if (!isExcludedForBodyModify(b) && !skipUrlRewrite) {
    const f = g => {
      const h = d.endsWith(token_prefix) && token_prefix.length > 0 && d.length > token_prefix.length ? d.slice(0, -token_prefix.length) : "";
      g = g.replace(/(url)\s*\(\s*([^)'\"\s]+)\s*\)/g, (m, n, o) => {
        if (o.startsWith("data:") || o.startsWith("#") || o.startsWith(d) || o.startsWith(token_prefix) || h && o.startsWith(h)) {
          return m;
        }
        let p = o;
        if (p.match(/^https?:\/\//i)) {
          const q = p.split("://")[0];
          const r = p.split("://")[1];
          p = d + q + "/" + r;
        } else {
          if (!p.match(/^[a-z]+:/i)) {
            if (p.startsWith("//")) {
              p = d + "https/" + p.slice(2);
            } else {
              if (p.startsWith("/")) {
                p = d + c + "/" + b + p;
              } else {
                p = d + c + "/" + b + "/" + p;
              }
            }
          }
        }
        return n + "(" + p + ")";
      });
      function i(m, n) {
        let o = n - 1;
        let p = 0;
        while (o >= 0 && m[o] === "\\") {
          p++;
          o--;
        }
        if (o >= 0 && m[o] === "/") {
          let q = m.substring(o + 1, n);
          let r = (q.match(/\\/g) || []).length;
          if (r % 2 === 0) {
            let s = n + 1;
            let t = 100;
            while (s < m.length && s < n + t && m[s] !== "/") {
              s++;
            }
            if (s < m.length && m[s] === "/") {
              let u = s + 1;
              while (u < m.length && /[gimsuy]/.test(m[u])) {
                u++;
              }
              return true;
            }
          }
        }
        return false;
      }
      function j(m, n) {
        const o = 16384;
        let p = 0;
        for (let q = n - 1; q >= Math.max(0, n - o); q--) {
          const r = m[q];
          if (r === ")") {
            p++;
          } else {
            if (r === "(") {
              if (p === 0) {
                let s = q - 1;
                while (s >= 0 && /\s/.test(m[s])) {
                  s--;
                }
                if (s >= 2 && m.substring(s - 2, s + 1).toLowerCase() === "url") {
                  const t = m.substring(q + 1, n);
                  if (/\bdata:/i.test(t)) {
                    return true;
                  }
                }
                return false;
              }
              p--;
            }
          }
        }
        return false;
      }
      const k = /([\"'])((https?:\/\/[^'\"\s]+)|(\/[^'\"\s]*))[\"']/gi;
      g = g.replace(k, (m, n, o, p, q, r, t) => {
        let u = o || q;
        if (!u) {
          return m;
        }
        if (u.startsWith(d) || u.startsWith(token_prefix) || h && u.startsWith(h)) {
          return m;
        }
        if (i(t, r)) {
          return m;
        }
        if (j(t, r)) {
          return m;
        }
        let v = u;
        if (u.match(/^https?:\/\//i)) {
          const w = u.split("://")[0];
          const x = u.split("://")[1];
          v = d + w + "/" + x;
        } else {
          if (!u.match(/^[a-z]+:/i)) {
            if (u.startsWith("//")) {
              v = d + "https/" + u.slice(2);
            } else {
              if (u.startsWith("/")) {
                v = d + c + "/" + b + u;
              } else {
                v = d + c + "/" + b + "/" + u;
              }
            }
          }
        }
        return n + v + n;
      });
      const l = /\b(src|href|action|data-url|poster|cite|manifest)\s*=\s*(["']?)([^"'\s>]+)\2/gi;
      g = g.replace(l, (m, n, o, p) => {
        if (p.startsWith(d) || p.startsWith(token_prefix) || h && p.startsWith(h)) {
          return m;
        }
        let q = p;
        if (p.match(/^https?:\/\//i)) {
          const r = p.split("://")[0];
          const s = p.split("://")[1];
          q = d + r + "/" + s;
        } else {
          if (!p.match(/^[a-z]+:/i)) {
            if (p.startsWith("//")) {
              q = d + "https/" + p.slice(2);
            } else {
              if (p.startsWith("/")) {
                q = d + c + "/" + b + p;
              } else {
                q = d + c + "/" + b + "/" + p;
              }
            }
          }
        }
        return n + "=" + o + q + o;
      });
      return g;
    };
    if (e.includes("<script") || e.includes("<SCRIPT")) {
      const g = /(<script[^>]*>)([\s\S]*?)(<\/script>)/gi;
      let h = "";
      let i = 0;
      let j;
      while ((j = g.exec(e)) !== null) {
        const l = e.substring(i, j.index);
        h += f(l);
        const m = j[1];
        const n = j[2];
        const o = j[3];
        h += f(m) + n + o;
        i = j.index + j[0].length;
      }
      const k = e.substring(i);
      h += f(k);
      e = h;
    } else {
      e = f(e);
    }
  }
  return e;
}
var zlib;
var WORKER_LOCATION_FALLBACK_PROLOGUE = "if(typeof self!=='undefined'&&typeof self.___location==='undefined'){try{self.___location=self.location}catch(e){}}\n";
function updateCharsetMeta(a, b = "utf-8") {
  let c = a.replace(/<meta\s+[^>]*charset\s*=\s*[\"']?([0-9a-zA-Z\-]+)[\"']?[^>]*>/gi, d => d.replace(/charset\s*=\s*[\"']?[0-9a-zA-Z\-]+[\"']?/i, "charset=\"" + b + "\""));
  c = c.replace(/<meta\s+http-equiv=[\"']?Content-Type[\"']?\s+[^>]*content=[\"'][^\"']*charset=[^\"']*[\"'][^>]*>/gi, "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + b + "\">");
  return c;
}
function updateContentTypeCharset(a, b) {
  const c = a.get("content-type");
  if (c) {
    const d = c.replace(/charset\s*=\s*[^;]+/i, "charset=" + b);
    d === c ? a.set("content-type", c + "; charset=" + b) : a.set("content-type", d);
  }
}
function replaceWindowLocationAssignments(a) {
  a = a.replace(/\bwindow\.location\s*=(.*?)/g, "window.___location=$1");
  a = a.replace(/\bwindow\.location\.href\s*=(.*?)/g, "window.___location.href=$1");
  return a;
}
var location_regex_replace = ({
  location_value: b,
  proxy_url_prefix: c,
  proxy_real_protocol: d,
  proxy_real_host: e,
  token_prefix = ""
}) => {
  if (b.startsWith(c)) {
    return b;
  }
  if (token_prefix && token_prefix.length < c.length) {
    const h = c.slice(0, -token_prefix.length);
    if (h && b.startsWith(h)) {
      return b;
    }
  }
  const g = {
    "^(http[s]?)://([-a-zA-Z0-9.]+(:[0-9]+)?)": c + "$1/$2"
  };
  for (let i in g) {
    let j = new RegExp(i, "g");
    b = b.replace(j, g[i]);
  }
  return b;
};
function responseLocationModify({
  location_value: b,
  proxy_url_prefix: c,
  proxy_real_protocol: d,
  proxy_real_host: e,
  token_prefix = ""
}) {
  if (token_prefix && b.startsWith(token_prefix)) {
    return b;
  }
  const f = {
    location_value: b,
    proxy_url_prefix: c,
    proxy_real_protocol: d,
    proxy_real_host: e,
    token_prefix: token_prefix
  };
  let g = location_regex_replace(f);
  b.startsWith("/") && (g = c + d + "/" + e + g);
  return g;
}
var isNodeEnvironment3 = isNodeEnvironment;
async function decompression(a, b) {
  return isNodeEnvironment3() ? await decompressResponse(a, b) : await decompress_cf(a, b);
}
async function compression(a, b) {
  return isNodeEnvironment3() ? await compressResponse(a, b) : await compress_cf(a, b);
}
async function decompressResponse(a, b) {
  !zlib && (zlib = await import("zlib"));
  if (b === "gzip") {
    const c = new Uint8Array(a);
    if (c.length < 2 || c[0] !== 31 || c[1] !== 139) {
      return a;
    }
  }
  try {
    if (b === "br") {
      const d = zlib.brotliDecompressSync(a);
      return d;
    } else {
      if (b === "gzip") {
        const e = zlib.gunzipSync(a);
        return e;
      } else {
        return a;
      }
    }
  } catch (f) {
    console.error("Decompression error:", f);
    return a;
  }
}
async function compressResponse(a, b) {
  !zlib && (zlib = await import("zlib"));
  if (!a || a.byteLength === 0 || a.length === 0) {
    return Buffer.alloc(0);
  }
  try {
    if (b === "br") {
      return zlib.brotliCompressSync(a);
    } else {
      return b === "gzip" ? zlib.gzipSync(a) : a;
    }
  } catch (c) {
    console.error("Compression error:", c);
    return a;
  }
}
async function compress_cf(a, b) {
  if (!a || a.byteLength === 0) {
    return new Uint8Array();
  }
  if (typeof CompressionStream !== "undefined") {
    try {
      let c;
      if (b === "gzip" || b === "br") {
        c = a.pipeThrough(new CompressionStream(b));
      } else {
        return a;
      }
      const d = c.getReader();
      let e = [];
      let f;
      while (!(f = await d.read()).done) {
        e.push(f.value);
      }
      const g = new Uint8Array(e.reduce((h, i) => h.concat(Array.from(i)), []));
      return g;
    } catch (h) {
      console.error("Compression error:", h);
      return a;
    }
  } else {
    console.error("Compression not supported in this environment or for the specified format.");
    return a;
  }
}
async function decompress_cf(a, b) {
  if (!a || a.byteLength === 0) {
    return new Uint8Array();
  }
  if (typeof DecompressionStream !== "undefined") {
    try {
      let c;
      if (b === "gzip" || b === "br") {
        c = a.pipeThrough(new DecompressionStream(b));
      } else {
        return a;
      }
      const d = c.getReader();
      let e = [];
      let f;
      while (!(f = await d.read()).done) {
        e.push(f.value);
      }
      const g = new Uint8Array(e.reduce((h, i) => h.concat(Array.from(i)), []));
      return g;
    } catch (h) {
      console.error("Decompression error:", h);
      return a;
    }
  } else {
    console.error("Decompression not supported in this environment or for the specified format.");
    return a;
  }
}
var OVERSIZED_HEADER_SENTINEL_BYTES = new Uint8Array([0, 0, 83, 73, 84, 69, 80, 82, 79, 88, 89, 72, 68, 82, 0]);
function prependOversizedHeaderPreamble(a, b) {
  const c = JSON.stringify(b);
  const d = new TextEncoder().encode(c);
  const e = new Uint8Array(4);
  e[0] = d.length >>> 24 & 255;
  e[1] = d.length >>> 16 & 255;
  e[2] = d.length >>> 8 & 255;
  e[3] = d.length & 255;
  const f = OVERSIZED_HEADER_SENTINEL_BYTES.length + e.length + d.length + a.byteLength;
  const g = new Uint8Array(f);
  let h = 0;
  g.set(OVERSIZED_HEADER_SENTINEL_BYTES, h);
  h += OVERSIZED_HEADER_SENTINEL_BYTES.length;
  g.set(e, h);
  h += e.length;
  g.set(d, h);
  h += d.length;
  g.set(new Uint8Array(a instanceof Uint8Array ? a.buffer : a, a instanceof Uint8Array ? a.byteOffset : 0, a.byteLength), h);
  return g;
}
async function responseModification({
  proxyResponse: b,
  newResHeaders: d,
  req: f,
  oversizedHeaders: g
}, h, i = isExcludedForBodyModify, j = decompression, k = compression) {
  const l = h || getConfig();
  const m = (l.proxy_url.endsWith("/") ? l.proxy_url.slice(0, -1) : l.proxy_url) + l.token_prefix;
  const n = f.proxy_real_protocol;
  const o = f.proxy_real_host;
  const p = "<script>\n  if (!window.siteproxy_injected_flag) {\n    var proxy_url_prefix = '" + m + "';\n    var proxy_real_protocol = '" + n + "';\n    var proxy_real_host = '" + o + "';\n    var config_proxy_url = '" + l.proxy_url + "';\n    var config_token_prefix = '" + l.token_prefix + "';\n    function proxyRewrite(url) {\n      if (typeof url !== \"string\") return url;\n      if (url.startsWith(proxy_url_prefix)) return url;\n      if (url.startsWith(\"http://\") || url.startsWith(\"https://\")) {\n        var protocol = url.split(\"://\")[0];\n        var rest = url.substring(protocol.length + 3);\n        return proxy_url_prefix + protocol + \"/\" + rest;\n      }\n      if (url.startsWith(\"//\")) {\n        return proxy_url_prefix + \"https/\" + url.substring(2);\n      }\n      if (url.startsWith(\"/\")) {\n        return proxy_url_prefix + proxy_real_protocol + \"/\" + proxy_real_host + url;\n      }\n      // relative path without leading slash\n      return proxy_url_prefix + proxy_real_protocol + \"/\" + proxy_real_host + \"/\" + url;\n    }\n    window.___location = (function() {\n      var target = window.location;\n      return {\n        get href() { return target.href; },\n        set href(v) { target.href = proxyRewrite(v); },\n        replace(v) { target.replace(proxyRewrite(v)); },\n        assign(v) { target.assign(proxyRewrite(v)); },\n        reload: target.reload.bind(target)\n      };\n    })();\n    var originalReplaceState = window.history.replaceState;\n    var originalPushState = window.history.pushState;\n    window.history.___replaceState = function(state, title, url) {\n      var rewritten = url !== undefined ? proxyRewrite(url) : url;\n      return originalReplaceState.call(this, state, title, rewritten);\n    };\n    window.history.___pushState = function(state, title, url) {\n      var rewritten = url !== undefined ? proxyRewrite(url) : url;\n      return originalPushState.call(this, state, title, rewritten);\n    };\n  } else {\n    proxy_url_prefix = '" + m + "';\n    proxy_real_protocol = '" + n + "';\n    proxy_real_host = '" + o + "';\n    config_proxy_url = '" + l.proxy_url + "';\n    config_token_prefix = '" + l.token_prefix + "';\n    window.siteproxy_injected_flag = false; // reset flag to allow script re-execution\n    if (window.proxy_worker_registration && window.proxy_worker_registration.active) {\n      window.proxy_worker_registration.active.postMessage({\n        type: 'PROXY_CUR_LOCATION',\n        data: { protocol: proxy_real_protocol, host: proxy_real_host }\n      });\n    }\n  }\n</script>";
  const q = p + "<script src=\"/siteproxy-response-injected.js?v=4\"></script>";
  const r = l.token_prefix;
  handleRedirects(b, d, m, n, o, r);
  let s = await modifyContent(b, d, q, f, l, i, j, k);
  (b.status === 204 || [301, 302, 303, 304, 307, 308].includes(b.status)) && (s = undefined, d.delete("content-length"), d.delete("content-encoding"), d.delete("transfer-encoding"));
  if (g && Object.keys(g).length > 0 && s !== undefined) {
    let v;
    if (s instanceof Uint8Array || s instanceof ArrayBuffer) {
      v = s;
    } else {
      if (s && typeof s.getReader === "function") {
        const x = s.getReader();
        const y = [];
        let z = 0;
        while (true) {
          const {
            value: B,
            done: C
          } = await x.read();
          if (C) {
            break;
          }
          y.push(B);
          z += B.byteLength;
        }
        v = new Uint8Array(z);
        let A = 0;
        for (const D of y) {
          v.set(D, A);
          A += D.byteLength;
        }
      } else {
        typeof s === "string" ? v = new TextEncoder().encode(s) : v = new Uint8Array(0);
      }
    }
    const w = d.get("content-encoding");
    if (w && v.byteLength > 0) {
      try {
        v = await j(v, w);
        if (v && !(v instanceof Uint8Array)) {
          v = new Uint8Array(v);
        }
      } catch (E) {
        console.error("Failed to decompress for oversized-header smuggling:", E);
      }
    }
    if (!(v instanceof Uint8Array)) {
      v = new Uint8Array(v || 0);
    }
    s = prependOversizedHeaderPreamble(v, g);
    d.delete("content-encoding");
    d.set("content-length", String(s.byteLength));
    d.set("x-siteproxy-body-headers", "1");
  }
  const t = {
    status: b.status,
    headers: d
  };
  let u = new Response(s, t);
  return u;
}
function handleRedirects(b, c, d, e, f, g = "") {
  if ([301, 302, 303, 307, 308].includes(b.status)) {
    let h = b.headers.get("location");
    if (h) {
      const i = {
        location_value: h,
        proxy_url_prefix: d,
        proxy_real_protocol: e,
        proxy_real_host: f,
        token_prefix: g
      };
      const j = responseLocationModify(i);
      c.set("Location", j);
    }
  }
}
async function modifyContent(a, b, c, d, f, g, h, i) {
  const j = f || getConfig();
  const k = (j.proxy_url.endsWith("/") ? j.proxy_url.slice(0, -1) : j.proxy_url) + j.token_prefix;
  const l = d.proxy_real_protocol;
  const m = d.proxy_real_host;
  let n = j.token_prefix;
  if (!n.endsWith("/")) {
    n += "/";
  }
  n += l + "/" + m + "/";
  const o = "<script>\n  if (!window.siteproxy_injected_flag) {\n    var proxy_url_prefix = '" + k + "';\n    var proxy_real_protocol = '" + l + "';\n    var proxy_real_host = '" + m + "';\n    var config_proxy_url = '" + j.proxy_url + "';\n    var config_token_prefix = '" + j.token_prefix + "';\n    function proxyRewrite(url) {\n      if (typeof url !== \"string\") return url;\n      if (url.startsWith(proxy_url_prefix)) return url;\n      if (url.startsWith(\"http://\") || url.startsWith(\"https://\")) {\n        var protocol = url.split(\"://\")[0];\n        var rest = url.substring(protocol.length + 3);\n        return proxy_url_prefix + protocol + \"/\" + rest;\n      }\n      if (url.startsWith(\"//\")) {\n        return proxy_url_prefix + \"https/\" + url.substring(2);\n      }\n      if (url.startsWith(\"/\")) {\n        return proxy_url_prefix + proxy_real_protocol + \"/\" + proxy_real_host + url;\n      }\n      // relative path without leading slash\n      return proxy_url_prefix + proxy_real_protocol + \"/\" + proxy_real_host + \"/\" + url;\n    }\n    window.___location = (function() {\n      var target = window.location;\n      return {\n        get href() { return target.href; },\n        set href(v) { target.href = proxyRewrite(v); },\n        replace(v) { target.replace(proxyRewrite(v)); },\n        assign(v) { target.assign(proxyRewrite(v)); },\n        reload: target.reload.bind(target)\n      };\n    })();\n    var originalReplaceState = window.history.replaceState;\n    var originalPushState = window.history.pushState;\n    window.history.___replaceState = function(state, title, url) {\n      var rewritten = url !== undefined ? proxyRewrite(url) : url;\n      return originalReplaceState.call(this, state, title, rewritten);\n    };\n    window.history.___pushState = function(state, title, url) {\n      var rewritten = url !== undefined ? proxyRewrite(url) : url;\n      return originalPushState.call(this, state, title, rewritten);\n    };\n  } else {\n    proxy_url_prefix = '" + k + "';\n    proxy_real_protocol = '" + l + "';\n    proxy_real_host = '" + m + "';\n    config_proxy_url = '" + j.proxy_url + "';\n    config_token_prefix = '" + j.token_prefix + "';\n    window.siteproxy_injected_flag = false; // reset flag to allow script re-execution\n    if (window.proxy_worker_registration && window.proxy_worker_registration.active) {\n      window.proxy_worker_registration.active.postMessage({\n        type: 'PROXY_CUR_LOCATION',\n        data: { protocol: proxy_real_protocol, host: proxy_real_host }\n      });\n    }\n  }\n</script>";
  let p;
  const q = a.headers.get("content-encoding");
  const r = a.headers.get("content-type") || "";
  const s = /text\/html/i.test(r);
  const t = /^(application|text)\/(x-)?(javascript|ecmascript)/i.test(r);
  let u = a.body;
  let v = "utf-8";
  let w;
  q && (p = await a.arrayBuffer(), w = p.byteLength, (s || t) && a.status < 500 && (p = await h(p, q)));
  if ((s || t) && a.status < 500) {
    !q && (p = await a.arrayBuffer(), w = p.byteLength);
    if (!w || w < 32) {
      if (!w || a.status === 204) {
        p = undefined;
        return p;
      }
    }
    const x = new TextDecoder("iso-8859-1");
    const y = x.decode(p);
    let z = y.match(/<meta\s+[^>]*charset\s*=\s*["']?([0-9a-zA-Z\-]+)["']?[^>]*>/i);
    if (s && z && z[1]) {
      v = z[1].toLowerCase();
    } else {
      const D = r.match(/charset=([^;]+)/i);
      D && (v = D[1].toLowerCase());
    }
    const A = r.toLowerCase().indexOf("gbk") !== -1;
    let B;
    try {
      B = new TextDecoder(v);
    } catch (E) {
      console.error("Unsupported charset, falling back to utf-8", E);
      B = new TextDecoder("utf-8");
    }
    let C = B.decode(p);
    if (!g(m)) {
      if (s || t) {
        p = C;
        if (v !== "utf-8") {
          if (s) {
            p = updateCharsetMeta(p, "utf-8");
          }
          updateContentTypeCharset(b, "utf-8");
        }
        t && (p = replaceWindowLocationAssignments(p));
        p = modifyBody({
          body: p,
          proxy_real_host: m,
          proxy_real_protocol: l,
          proxy_url_prefix: k,
          token_prefix: j.token_prefix,
          skipUrlRewrite: t
        });
        t && (p = WORKER_LOCATION_FALLBACK_PROLOGUE + p);
        if (s) {
          if (p.indexOf("<head") !== -1) {
            p = p.replace(/<head(.*?)>/, "<head$1>" + c);
          } else {
            if (p.indexOf("<html") !== -1) {
              p = p.replace(/<html(.*?)>/, "<html$1>" + c);
            } else {
              if (p.indexOf("<body") !== -1) {
                p = p.replace(/<body(.*?)>/, "<body$1>" + c);
              } else {
                const G = new RegExp("</[a-zA-Z0-9]+>");
                p = p.replace(G, H => H + c);
              }
            }
          }
        }
        const F = new TextEncoder("utf-8");
        p = F.encode(p);
      }
    } else {
      if (t) {
        p = C;
        if (v !== "utf-8") {
          if (s) {
            p = updateCharsetMeta(p, "utf-8");
          }
          updateContentTypeCharset(b, "utf-8");
        }
        p = replaceWindowLocationAssignments(p);
        p = WORKER_LOCATION_FALLBACK_PROLOGUE + p;
        const H = new TextEncoder("utf-8");
        p = H.encode(p);
      } else {
        if (s) {
          p = C;
          v !== "utf-8" && (p = updateCharsetMeta(p, "utf-8"), updateContentTypeCharset(b, "utf-8"));
          if (p.indexOf("<head") !== -1) {
            p = p.replace(/<head(.*?)>/, "<head$1>" + c);
          } else {
            if (p.indexOf("<html") !== -1) {
              p = p.replace(/<html(.*?)>/, "<html$1>" + c);
            } else {
              if (p.indexOf("<body") !== -1) {
                p = p.replace(/<body(.*?)>/, "<body$1>" + c);
              } else {
                const J = new RegExp("</[a-zA-Z0-9]+>");
                p = p.replace(J, K => K + c);
              }
            }
          }
          const I = new TextEncoder("utf-8");
          p = I.encode(p);
        }
      }
    }
    if (d.proxy_real_protocol) {
      const K = "proxy_real_protocol=" + d.proxy_real_protocol + "; Path=/; HttpOnly";
      const L = "proxy_real_host=" + d.proxy_real_host + "; Path=/; HttpOnly";
      b.append("set-cookie", K);
      b.append("set-cookie", L);
      b.delete("x-frame-options");
    }
    u = p;
  }
  q && (isNodeEnvironment3() && a.status < 500 && ((p === undefined || p === null) && (p = new Uint8Array(0)), p = await i(p, q), (p === undefined || p === null) && (p = new Uint8Array(0)), b.set("content-length", String(p.byteLength || p.length || 0)), b.set("content-encoding", q)), u = p, b.delete("transfer-encoding"));
  u !== undefined && u !== null && ((u?.["byteLength"] !== undefined || u?.["length"] !== undefined) && b.set("content-length", String(u.byteLength || u.length || 0)), b.delete("transfer-encoding"));
  u instanceof ArrayBuffer && (u = new Uint8Array(u));
  return u;
}
function pathname2protocol_host(b) {
  const c = /^([^:/?#]+)\/([^/?#]+)/;
  const d = b.match(c);
  let e;
  let f;
  d && (e = d[1], f = d[2]);
  const g = {
    protocol: e,
    host: f
  };
  return g;
}
var isNodeEnvironment4 = isNodeEnvironment;
var nodeCrypto;
var isNode = isNodeEnvironment4();
isNode && import("crypto").then(a => nodeCrypto = a);
var privateKey = function () {
  const a = ["Sp3n1YTD", "SYeGvUPy", "qPe/RGpz", "A7kThFxt", "c/s8TgRl", "nYR5w4/T", "cuO+pvoB", "akziqr87", "CtqllsDe", "auSI7Wqy", "rwQCYU8l", "p5qsws8G", "rqwipDlI", "AjGUeKGP", "8juSbeC1", "STKpvnu3", "GyTZ5R15", "M1l0aXOP", "9KtQUw4m", "L26y6Puo", "oyh4elie", "Djrw0Pyg", "kNe3DIAg", "r0Hmd11/", "4Z0B1hjw", "1ZYBh1By", "fCOTRIjA", "xJwo+R4a", "JtViMHws", "v35RLRAI", "4I8x8T5A", "ImP3VNQS", "qhipSFdq", "UT1L75KM", "NPpTNmUv", "ApyJ9wMt", "mJDYSGET", "ySDbjhr8", "WIZQUDSc", "cEXX25yi", "Iji3pP6j", "It8yAZkP", "h6F59l7Y", "PbJz37OB", "uHQssYEL", "AItf2niX", "xoRkbX05", "B/9z3a+R", "LqWqI4Gj", "uq+M2bJx", "E5s+8HUw", "9tEo5y19", "I1cUSa6j", "4Zp1wEjf", "+lnKAExT", "XQBPyNbU", "8r9/lcCb", "cDeeuDzy", "kKAeOZU0", "bNybo7i3", "mOMqC6x7", "/DdEgTM6", "x3PvaSSl", "YXIjEZyY", "yefQ2Ip3", "70c0lwAX", "fQVZMBub", "fpmP5/5z", "pvBzfxBe", "7rDtZvvo", "2dmkhAgJ", "TY2qcbGA", "ZK/5JZYF", "zzi+GRmH", "Pug9ek4J", "MtygmbvA", "7sZWiCew", "sf1LVJjp", "hdy5OlMX", "56qbC9e4", "AKVmuGBn", "zUDTSG8d", "h8cznsck", "JZNrAczZ", "iACj5Dv5", "vcPUHcdf", "tU40/tjL", "5hAhx6+f", "PAQcglGE", "Csr4DNwV", "SO+D4zMc", "qr0EhEPH", "v+ewZiBQ", "rdF1sNNu", "vGNJEaUp", "X/QhhIWA", "YtylenLc", "Q1Ll76/W", "zhtSmAE0", "RnRLN+iz", "0AT0ZyHB", "2bhZgL+v", "eMsmeIRG", "1pygHliN", "KCxOGPwk", "vQz7Zv3K", "d5bRRh9X", "+7f4ly/N", "c3DZ+oc3", "PvMwzv6Y", "V79LkVFq", "cXru2f1A", "omqif/AE", "CYtqCS9B", "wnKon0x0", "86GyFubz", "VZlVTlj5", "cC4zzjWp", "xbUqKJxn", "317LwMzb", "x8adwkZX", "WvCHm+I2", "85m1tmrq", "vJ0mGZzJ", "bSNPv69r", "l0xRDkCr", "2Ft+IdnY", "+SMXOa+Q", "J86MM7xe", "2H7YSHxw", "nmSne8En", "J9FvRb3g", "Pp2rOs4e", "veYYyyOV", "Q/5eDl7h", "HJXphjeg", "j1AynMcd", "ugCchTmh", "Yk+DxgVa", "KGYZYoFA", "wrfffoKC", "VRVPMGmo", "DdPA0xHE", "a/yfVJ83", "sFxCyF6Z", "xj7H6jxZ", "a7Iu5IH2", "dpi/VwxC", "E6kDCkAS", "pYzJk0pQ", "rKZWjDm2", "KzCflNG1", "5ayUvVZk", "hcCnX59z", "UgiGKVUR", "3GW9l+gC", "jSoU5Ui4", "LDnxtke6", "/ksIysJT", "achHrt/2", "bQ/2nQrl", "Mm2WrSdH", "QMIzaQ4r", "iP1CIH21", "Rfcy/SgT", "NgAnB//W", "/hgeG6Tx", "r62yBgPd", "JBVxfMsQ", "QiXMcrZ4", "eSZiNfUr", "FbMYS99i", "lj+c0wHh", "LfsmeBrL", "YZJcKJFX", "nTeyU/5i", "RfTwevFK", "gOSqgRyl", "MSyyi25G", "OpeCjmsl", "gYWiM6nz", "Ipppt2d2", "m2NEPjzx", "83/MI3mX", "XZQ8NZmD", "MHS3bEdT", "1pO3mt0S", "qeMd1myW", "nbWnFjv6", "pO93QOoO", "FoIiBmZ4", "at3+BMt3", "eV43gv7F", "6Sd9gZzA", "MOYBdrU8", "NIBD4xm2", "PyUNE1d3", "t2N5nldN", "IaItxPrn", "6Rc0xEdM", "Ck99X3VF", "IB9as2sr", "P7L1XqbT"];
  const b = ["eh/ja4bC", "SbeLu0rY", "Lr85s2dy", "ArgWhFjv", "d1MMzADB", "n4V5wQ3S", "c+N+5LXj", "bwHmFXkk", "CdVPGMKX", "AfTx0Nya", "GQeC++pw", "3U6HzDOO", "XJOVUoLa", "i4dL6Btx", "M/8WQ9QV", "+9HccrOX", "yeJqrRbw", "/1rpGhK3", "vxwVqUcw", "IXyIYViI", "6X9F+Fp8", "mWl7LWHk", "4b3sCb2b", "3hW1YquU", "tMIMcMz/", "Aw3nz2L0", "3y7cRoUz", "YEGZbBjy", "mihJwBPE", "wMe2JBTz", "ety+DQpi", "Cnr+eYCJ", "rw6FF2Lz", "JQU04nt/", "nklJgj4o", "6H5r9gR8", "qrhPqy43", "1JaTUYoc", "qHuE5/rH", "g7yIkjxP", "Cb+SlJaz", "mpkZCwyS", "7si2cys/", "/fkZmNX4", "Yk7zhT8l", "yTpwudgb", "kRjBpDW4", "upy6o83i", "4KH4Em4o", "uKyN2bNz", "kZo+w9CM", "TDykeYwG", "0U7etOSM", "AY5BpX1X", "swmyCSiS", "iYBx1TfB", "saHDJ4nf", "E2ogzAWF", "Ctd2AUUy", "vJ41iK8s", "FWLr6YTr", "AMdGa6qJ", "e7KhPggF", "te9PBKw7", "mq4F5EVI", "LW0LUuQP", "d+875Uxc", "57sS1fzO", "ozRGpy/e", "p/4dTXrC", "REo0RDg2", "17YCKTrG", "L2FZxpG2", "5UjxvybP", "+Kh9wPqN", "So41F1GA", "TsLyacrf", "TNLDGGys", "E/uOGRil", "FhcxWG8d", "gVOLv9iQ", "nbbWXjda", "eQ+aFfMR", "UsAVEu7D", "1pn1u7/e", "HS6rjwIz", "HdhAvX5U", "K5RfXXbE", "e7j2Ikt0", "JHn2ec07", "gluc3TmO", "flUAllth", "14KfF5aV", "cNP0MdOD", "7xjL6AJk", "8V22D1SF", "QOQ7HhRl", "DDbAReMd", "JRytrXbW", "Dmy7zZI6", "muCjHjmT", "I2qRJU15", "eoNWVhpe", "YoQIvDYZ", "49GEJ22J", "sLiykKuY", "YNh35PjE", "cm7A8KkS", "RM9P77nj", "UrTP+eNH", "y34MgQvM", "w4sY8YWn", "dmpEf/HS", "2c87yWi4", "Y7chX0lb", "9KMzl+Y8", "NpEDSnZM", "s0rjBZPB", "RHU1ansP", "rXlo+rTx", "uwpmSndC", "hWYWaBUq", "AMIdUKCn", "UTS3g96c", "U7QyZ9p2", "bFs0UIMg", "3MU5PxPG", "QEI/0Ngp", "oQ9WVjvX", "/2EtTMVW", "ISrTOj3E", "BjkV2gCA", "Q741+uQ2", "i+8DPXFO", "/4RN6R5x", "neINH9og", "3G41scfL", "5wIdBSQJ", "FW9yyAAD", "HBpwrB5z", "XyxiytIq", "fCiM8OiL", "RdVOeRNr", "UCIu2jWS", "LxPF7M+T", "5WeMOf9f", "sbC0FEsf", "8Fvjbj3B", "Nzcktc6s", "aCPBFJ9e", "3DGQ+9+c", "BtmzAjH3", "vOx+h5Ox", "n5KbzI5X", "lcIRm8l/", "qA/RL7dS", "3A556oV+", "oRrT9Bvb", "F0DLK6Om", "a0nGrlf0", "+wwNNTBX", "4bcZaA0F", "tuB5EI2C", "6rLP+F7o", "AgkYJ4ZB", "i+gPyrj0", "oUHTUTpy", "jx44KrsY", "eR5PxwOG", "l231Ra0c", "O9vVg1gK", "qKDEmcov", "XoyLNiUw", "PPx9Qrxg", "rzFqT1mt", "HjXCsQMX", "sUOH3x8B", "yRizNlca", "BlBKp2yf", "jLsrNJ1K", "oPure22+", "IBvot4BC", "BG5KSg91", "yRgt+WMG", "nIDqzx1b", "6la0RBa+", "GjblXkRg", "gOoHVvS2", "YxNPSoSh", "5m6k8PbF", "5NO7gHlx", "TiegzDYI", "sdLbCti4", "b5wDTk5J", "DIvkzf5Z", "qMPjDafN", "dQFxe7wb", "2DOEX+r1", "UKDohB00", "NSmOXJ/w", "3by2eLvP", "oODG7vvA", "aQohDgDn"];
  const c = j => {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      return Buffer.from(j, "base64");
    }
    const k = atob(j);
    const l = new Uint8Array(k.length);
    for (let m = 0; m < k.length; m++) {
      l[m] = k.charCodeAt(m);
    }
    return l;
  };
  const d = j => {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      return Buffer.from(j).toString("base64");
    }
    let k = "";
    for (let l = 0; l < j.length; l++) {
      k += String.fromCharCode(j[l]);
    }
    return btoa(k);
  };
  const e = c(a.join(""));
  const f = c(b.join(""));
  const g = new Uint8Array(e.length);
  for (let j = 0; j < e.length; j++) {
    g[j] = e[j] ^ f[j];
  }
  const h = d(g);
  return "-----BEGIN PRIVATE KEY-----\n" + h.match(/.{1,64}/g).join("\n") + "\n-----END PRIVATE KEY-----\n";
}();
async function decrypt(d) {
  if (isNode) {
    const e = Buffer.from(d, "base64");
    const f = nodeCrypto.privateDecrypt({
      key: privateKey,
      padding: nodeCrypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    }, e);
    return f.toString("utf8");
  } else {
    const g = "-----BEGIN PRIVATE KEY-----";
    const h = "-----END PRIVATE KEY-----";
    const j = privateKey.replace(g, "").replace(h, "").replace(/\s/g, "");
    const k = atob(j);
    const l = new Uint8Array(k.length);
    for (let s = 0; s < k.length; s++) {
      l[s] = k.charCodeAt(s);
    }
    const m = {
      name: "SHA-256"
    };
    const n = {
      name: "RSA-OAEP",
      hash: m
    };
    const o = await crypto.subtle.importKey("pkcs8", l.buffer, n, false, ["decrypt"]);
    const p = Uint8Array.from(atob(d), t => t.charCodeAt(0));
    const q = {
      name: "RSA-OAEP"
    };
    const r = await crypto.subtle.decrypt(q, o, p);
    return new TextDecoder().decode(r);
  }
}
async function decryptAESCBC(c, d) {
  let e;
  let f;
  let g;
  let h;
  if (isNode) {
    e = Buffer.from(c, "base64");
    f = e.subarray(0, 16);
    g = e.subarray(16);
    h = Buffer.from(d, "base64");
  } else {
    const i = Uint8Array.from(atob(c), k => k.charCodeAt(0));
    f = i.slice(0, 16);
    g = i.slice(16);
    const j = Uint8Array.from(atob(d), k => k.charCodeAt(0));
    h = j;
  }
  if (isNode) {
    const k = nodeCrypto.createDecipheriv("aes-256-cbc", h, f);
    let l = k.update(g);
    l = Buffer.concat([l, k.final()]);
    return l.toString("utf8");
  } else {
    const m = {
      name: "AES-CBC"
    };
    const n = await crypto.subtle.importKey("raw", h, m, false, ["decrypt"]);
    const o = {
      name: "AES-CBC",
      iv: f
    };
    const p = await crypto.subtle.decrypt(o, n, g);
    return new TextDecoder().decode(p);
  }
}
var isNodeEnvironment5 = isNodeEnvironment;
function invalidCookie(a) {
  let b = a.indexOf(";");
  if (b !== -1) {
    let c = a.substring(0, b);
    if (c.indexOf("=") === -1) {
      return true;
    }
  }
  return false;
}
function parseCookies(a) {
  const b = {};
  if (!a) {
    return b;
  }
  a.split(";").forEach(c => {
    const [d, e] = c.trim().split("=");
    if (d && e) {
      b[d] = e;
    }
  });
  return b;
}
function filterProxyRealCookies(a) {
  if (!a) {
    return "";
  }
  const b = a.split(";");
  const c = [];
  for (const d of b) {
    const e = d.trim();
    if (!e) {
      continue;
    }
    const f = e.indexOf("=");
    if (f === -1) {
      c.push(e);
      continue;
    }
    const g = e.substring(0, f).trim();
    !g.startsWith("proxy_real_") && c.push(e);
  }
  return c.join("; ");
}
function generateDeletionCookies(a, b, c = "/") {
  a = a.replace(/;?\s*Secure;?/gi, "");
  a = a.replace(/;?\s*HttpOnly;?/gi, "");
  let d = a.replace(/;?\s*Domain\s*=[^;]*/ig, "");
  d = d.replace(/;?\s*Path\s*=[^;]*/ig, "");
  d = d.replace(/; ;/g, ";").replace(/;;/g, ";").trim();
  d = d.replace(/^;|;$/g, "");
  const e = d + ("; Path=" + c);
  const f = d + "; Domain=" + b + "; Path=" + c;
  const g = d + "; Domain=." + b + "; Path=" + c;
  const h = d + "; Path=/";
  const i = d + "; Domain=" + b + "; Path=/";
  const j = d + "; Domain=." + b + "; Path=/";
  return [e, f, g, h, i, j];
}
function isExpiresInPast(a) {
  const b = new Date(a);
  const c = new Date();
  return b < c;
}
function cookieModify(a, b, c = "/") {
  const d = a.match(/^([^=]+)=/);
  const e = d ? d[1] : "";
  const f = e === "proxy_real_host" || e === "proxy_real_protocol";
  const g = /Expires\s*=/i.test(a);
  const h = /Max-Age\s*=/i.test(a);
  let i = a.replace(/Domain\s*=\s*[^;]*?(;|$)/ig, "Domain=" + b + ";");
  const j = a.match(/Path\s*=\s*([^;]*)(;|$)/i);
  let k = j ? j[1].trim() : "/";
  !k.startsWith("/") && (k = "/" + k);
  let l;
  if (f) {
    l = "/";
  } else {
    if (k === "/") {
      l = c;
    } else {
      const n = c.endsWith("/") ? c.slice(0, -1) : c;
      k.startsWith(n) && (k.length === n.length || k[n.length] === "/") ? l = k : l = c.slice(0, -1) + k;
    }
  }
  /Path\s*=/i.test(i) ? i = i.replace(/Path\s*=\s*([^;]*)(;|$)/ig, "Path=" + l + ";") : i += "; Path=" + l + ";";
  !/Domain\s*=/i.test(i) && (i += "; Domain=" + b + ";");
  i = i.replace(/Max-Age\s*=\s*[^;]*?(;|$)/ig, "");
  const m = i.match(/Expires\s*=\s*([^;]*?)(;|$)/i);
  if (m) {
    const o = m[1];
    !isExpiresInPast(o) && (i = i.replace(/Expires\s*=\s*[^;]*?(;|$)/ig, ""), i += "; Max-Age=1800");
  } else {
    !g && !h && (i += "; Max-Age=1800");
  }
  i = i.replace(/; ;|;;/g, ";");
  return i;
}
function CustomPathRewrite(a, b) {
  const c = b.token_prefix;
  const d = b.proxy_url + c + "https/";
  const e = b.proxy_url + c + "http/";
  let f = a;
  let g = a.indexOf(d);
  if (g !== -1) {
    let i = g + d.length;
    let j = a.substring(i);
    f = a.substring(0, g) + "https://" + j;
  }
  let h = a.indexOf(e);
  if (h !== -1 && g === -1) {
    let k = h + e.length;
    let l = a.substring(k);
    f = a.substring(0, h) + "http://" + l;
  }
  return f;
}
function removeSiteproxyHeaders(a) {
  if (!a) {
    return;
  }
  const b = [];
  a.forEach((c, d) => {
    (d.startsWith("siteproxy") || d.toLowerCase() === "x-forwarded-for" || d.toLowerCase() === "cf-connecting-ip") && b.push(d);
  });
  b.forEach(c => {
    a.delete(c);
  });
}
var proxyMiddleware = async (i, j, k = {}) => {
  const l = k.getConfig || getConfig;
  const m = k.need2beFiltered || need2beFiltered;
  const n = k.pathname2protocol_host || pathname2protocol_host;
  const o = k.decrypt || decrypt;
  const p = k.decryptAESCBC || decryptAESCBC;
  const q = k.responseModification || responseModification;
  const r = k.fetch || fetch;
  const s = l();
  let {
    req: t,
    res: u
  } = i;
  const v = s.token_prefix;
  const w = s.proxy_url + v;
  let x = s.proxy_url.substring(s.proxy_url.indexOf("//") + 2);
  x.indexOf(":") !== -1 && (x = x.substring(0, x.indexOf(":")));
  const y = m(t.extractedUrl);
  if (y) {
    return j();
  }
  let z = new URL(t.extractedUrl);
  if (!z.pathname.startsWith(v)) {
    const S = i.req.header("referer");
    if (S && S.startsWith(w)) {
      const T = S.substring(w.length);
      const U = T.split("/");
      if (U.length >= 2) {
        const V = U[0];
        const W = U[1];
        (V === "http" || V === "https") && (z.pathname = v + V + "/" + W + z.pathname, t.extractedUrl = z.toString());
      }
    }
  }
  if (!z.pathname.startsWith(v)) {
    const X = parseCookies(t.raw.headers.cookie || "");
    const Y = X.proxy_real_protocol;
    const Z = X.proxy_real_host;
    Y && Z && (Y === "http" || Y === "https") && (z.pathname = v + Y + "/" + Z + z.pathname, t.extractedUrl = z.toString());
  }
  if (!z.pathname.startsWith(v)) {
    return j();
  }
  let A = z.pathname.substring(v.length);
  let {
    protocol: B,
    host: C
  } = n(A);
  const D = parseCookies(t.raw.headers.cookie || "");
  (!B || !C) && (B = D.proxy_real_protocol, C = D.proxy_real_host);
  if (B !== "http" && B !== "https") {
    return j();
  }
  let E = B + "://" + C;
  t.proxy_real_host = C;
  t.proxy_real_protocol = B;
  const F = a0 => {
    let a1 = a0.replace(new RegExp("^" + v + B + "/[^/]+"), "");
    a1 = CustomPathRewrite(a1, s);
    return a1 === "" ? "/" : a1;
  };
  if (i.req.method === "OPTIONS") {
    const a0 = E + F(z.pathname) + z.search;
    const a1 = new Headers(i.req.raw.headers);
    removeSiteproxyHeaders(a1);
    a1.set("host", C);
    const a2 = {
      method: "OPTIONS",
      headers: a1,
      redirect: "manual"
    };
    const a3 = await r(a0, a2);
    i.res = a3;
    return;
  }
  t.proxy_real_host = C;
  const G = async (a4, a5, a6) => {
    const a7 = l();
    const a8 = a7.proxy_url + a7.token_prefix;
    let a9 = {};
    a4.forEach((ac, ad) => {
      a9[ad] = ac;
    });
    let aa = "";
    let ab = null;
    for (const ac in a9) {
      if (ac.toLowerCase() === "cookie") {
        aa = a9[ac];
        ab = ac;
        break;
      }
    }
    if (aa) {
      const ad = filterProxyRealCookies(aa);
      ad ? a9[ab] = ad : delete a9[ab];
      aa = ad;
    }
    if (aa) {
      const ae = isNodeEnvironment5() ? Buffer.byteLength(aa) : new TextEncoder().encode(aa).byteLength;
      console.log("cookieHeader length:" + ae);
      if (ae > 4000) {
        const af = aa.split(";").map(am => am.trim().split("=", 2));
        const ag = af.map(([am]) => {
          if (!am.startsWith("proxy_real_")) {
            return am + "=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/";
          }
          return null;
        }).filter(Boolean);
        const ah = 1800;
        const ai = 900;
        const aj = Math.max(1, Math.floor(ah / ai));
        const ak = ag.slice(0, aj);
        const al = {
          type: "header_too_large",
          expireCookies: ak
        };
        throw al;
      }
    }
    if (a9["siteproxy-newreferer"]) {
      a9.referer = a9["siteproxy-newreferer"];
      const am = new URL(a9["siteproxy-newreferer"]);
      a9.origin = am.origin;
    } else {
      if (a9.referer && a9.referer.startsWith(a8)) {
        a9.referer = a9.referer.substring(a8.length);
        a9.referer.startsWith("/") && (a9.referer = a9.referer.substring(1));
        if (a9.referer.startsWith("https/")) {
          a9.referer = "https://" + a9.referer.substring(6);
        } else {
          a9.referer.startsWith("http/") && (a9.referer = "http://" + a9.referer.substring(5));
        }
        a9.origin = a5 + "://" + a6;
      } else {
        a9.origin === a7.proxy_url && (a9.origin = a5 + "://" + a6);
      }
    }
    return a9;
  };
  const H = async (a4, a5) => {
    let a6 = new Headers();
    let a7 = [];
    const a8 = 4096;
    const a9 = new Set(["report-to", "nel", "reporting-endpoints", "cross-origin-embedder-policy-report-only", "cross-origin-opener-policy-report-only", "permissions-policy-report-only", "content-security-policy-report-only"]);
    const aa = a4.has("transfer-encoding");
    a4.forEach((ac, ad) => {
      const ae = ad.toLowerCase();
      if (ae !== "set-cookie") {
        if (a9.has(ae)) {
          return;
        }
        if (ae === "content-length" && aa) {
          return;
        }
        if (ac && ac.length > a8) {
          const af = (a4.get("content-type") || "").toLowerCase();
          const ag = af.includes("text/event-stream");
          if (ag) {
            console.log("Dropping oversized response header (streaming response):", ad, "size=", ac.length);
            return;
          }
          if (a5) {
            a5[ad] = ac;
          }
          console.log("Smuggling oversized response header via body:", ad, "size=", ac.length);
          return;
        }
        a6.set(ad, ac);
      } else {
        a7.push(ac);
      }
    });
    let ab = v;
    if (!ab.endsWith("/")) {
      ab += "/";
    }
    ab += B + "/" + C + "/";
    if (!ab.startsWith("/")) {
      ab = "/" + ab;
    }
    a7.forEach(ac => {
      ac.split(/,(?!(?:\s+[0-9]{2}))/).forEach(ad => {
        if (invalidCookie(ad)) {
          return;
        }
        let ae = cookieModify(ad, x, ab);
        a6.append("Set-Cookie", ae);
      });
    });
    return a6;
  };
  const I = E + F(z.pathname) + z.search;
  let J;
  try {
    J = await G(i.req.raw.headers, B, C);
  } catch (a4) {
    console.error("Error in proxyHeaderProcess:", a4);
    if (a4.type === "header_too_large") {
      const a6 = new Headers();
      let a7 = v;
      if (!a7.endsWith("/")) {
        a7 += "/";
      }
      a7 += B + "/" + C + "/";
      a4.expireCookies.forEach(a9 => {
        const aa = generateDeletionCookies(a9, x, a7);
        for (const ab of aa) {
          a6.append("Set-Cookie", ab);
        }
      });
      const a8 = {
        status: 431,
        headers: a6
      };
      i.res = new Response("Request Header Fields Too Large", a8);
      return;
    }
    const a5 = {
      status: 500
    };
    i.res = new Response("Internal Server Error: Header processing failed", a5);
    return;
  }
  let K;
  if (J["siteproxy-encrypt-aes-base64key"]) {
    try {
      K = await o(J["siteproxy-encrypt-aes-base64key"]);
    } catch (a9) {
      console.error("Error decrypting AES key:", a9);
      i.res.status = 500;
      return;
    }
  }
  if (J["siteproxy-encrypt-aes-authorization"]) {
    let aa = J["siteproxy-encrypt-aes-authorization"];
    try {
      const ab = await p(aa, K);
      J.authorization = ab;
    } catch (ac) {
      console.error("Error decrypting authorization:", ac);
      i.res.status = 500;
      return;
    }
  }
  let L = J;
  J = new Headers();
  for (const ad in L) {
    L.hasOwnProperty(ad) && J.append(ad, L[ad]);
  }
  let M = i.req.method !== "GET" ? await i.req.arrayBuffer() : undefined;
  const N = J.get("content-type");
  if (M && M.byteLength === 0) {
    M = undefined;
  } else {
    if (N && J.get("siteproxy-encrypted-body")) {
      !(typeof M === "string" || M instanceof String) && (M = new TextDecoder().decode(M));
      try {
        M = await p(M, K);
        J.set("content-length", M.length);
      } catch (ae) {
        console.error("Error decrypting body:", ae);
        i.res.status = 500;
        return;
      }
    }
  }
  removeSiteproxyHeaders(J);
  J.set("host", C);
  J.set("Accept-Encoding", "gzip");
  let O;
  try {
    console.log("Fetching real website:", I);
    const af = {
      method: i.req.method,
      headers: J,
      body: M,
      redirect: "manual",
      decompress: false
    };
    O = await r(I, af);
  } catch (ag) {
    console.error("Fetch error occurred:", ag.message, "Proxy URL:", I, "Method:", i.req.method);
    const ah = {
      status: 502
    };
    i.res = new Response("Proxy fetch error", ah);
    return;
  }
  for (const [ai, aj] of J.entries()) {}
  const P = {};
  const Q = await H(O.headers, P);
  const R = {
    proxyResponse: O,
    newResHeaders: Q,
    req: t,
    oversizedHeaders: P
  };
  i.res = await q(R);
  return;
};
var loadProxyServiceWorker = async (b, d) => {
  const e = getConfig();
  const f = e.token_prefix;
  const g = e.proxy_url + e.token_prefix;
  let h = new URL(b.req.url);
  b.req.extractedUrl && (h = new URL(b.req.extractedUrl));
  if (h.pathname === "/siteproxy_service_worker.js") {
    const i = h.searchParams;
    const j = i.get("proxy_real_protocol");
    const k = i.get("proxy_real_host");
    if (!k) {
      return d();
    }
    const l = "\n      const proxy_url_prefix = '" + g + "';\n      const proxy_real_protocol = '" + j + "';\n      const proxy_real_host = '" + k + "';\n      const config_proxy_url = '" + e.proxy_url + "';\n      const config_token_prefix = '" + e.token_prefix + "';\n    ";
    const m = "const _0x3a32d7 = _0x39ff;\n(function (_0x4de678, _0x23a2a3) {\n    const _0x5af7c7 = _0x39ff, _0x1ba79d = _0x4de678();\n    while (!![]) {\n        try {\n            const _0x1ef5ae = parseInt(_0x5af7c7(0x1fc)) / 0x1 * (-parseInt(_0x5af7c7(0x1c1)) / 0x2) + -parseInt(_0x5af7c7(0x18e)) / 0x3 + parseInt(_0x5af7c7(0x1e9)) / 0x4 * (-parseInt(_0x5af7c7(0x216)) / 0x5) + -parseInt(_0x5af7c7(0x1eb)) / 0x6 + -parseInt(_0x5af7c7(0x1a5)) / 0x7 + parseInt(_0x5af7c7(0x184)) / 0x8 * (-parseInt(_0x5af7c7(0x203)) / 0x9) + parseInt(_0x5af7c7(0x1ea)) / 0xa * (parseInt(_0x5af7c7(0x190)) / 0xb);\n            if (_0x1ef5ae === _0x23a2a3)\n                break;\n            else\n                _0x1ba79d['push'](_0x1ba79d['shift']());\n        } catch (_0x141261) {\n            _0x1ba79d['push'](_0x1ba79d['shift']());\n        }\n    }\n}(_0x25c4, 0x85ce2));\nconst _0x325ca2 = _0x3a32d7(0x1ed);\nfunction _0x337069(_0x2dddc3) {\n    const _0x253685 = _0x3a32d7, _0x2a1583 = {\n            'bCiyu': function (_0x8513bf, _0x5ac357) {\n                return _0x8513bf < _0x5ac357;\n            }\n        }, _0x2634d4 = new ArrayBuffer(_0x2dddc3[_0x253685(0x1da)]), _0x5e00df = new Uint8Array(_0x2634d4);\n    for (let _0x5527db = 0x0, _0x2b2267 = _0x2dddc3[_0x253685(0x1da)]; _0x2a1583[_0x253685(0x1d9)](_0x5527db, _0x2b2267); _0x5527db++) {\n        _0x5e00df[_0x5527db] = _0x2dddc3[_0x253685(0x1a8)](_0x5527db);\n    }\n    return _0x2634d4;\n}\nfunction _0x4a49b8(_0x4ede4) {\n    const _0x36759e = _0x3a32d7, _0x590c4d = {\n            'NQLcy': function (_0x2eb31f, _0x2ce20d) {\n                return _0x2eb31f < _0x2ce20d;\n            },\n            'LOOPl': function (_0xc41be2, _0x310e40) {\n                return _0xc41be2 === _0x310e40;\n            },\n            'vboZP': function (_0x2427ca, _0x338bbf) {\n                return _0x2427ca - _0x338bbf;\n            }\n        }, _0x3453d5 = new Uint8Array(_0x4ede4);\n    let _0x477acb = '';\n    for (let _0x2c012f = 0x0; _0x590c4d[_0x36759e(0x1d5)](_0x2c012f, _0x3453d5['length']); _0x2c012f++) {\n        _0x477acb += _0x3453d5[_0x2c012f][_0x36759e(0x194)](0x10)['padStart'](0x2, '0')[_0x36759e(0x1e6)](), _0x590c4d[_0x36759e(0x20e)](_0x2c012f % 0x10, 0xf) || _0x2c012f === _0x590c4d[_0x36759e(0x1ba)](_0x3453d5[_0x36759e(0x1da)], 0x1) ? _0x477acb = '' : _0x477acb += ' ';\n    }\n}\nasync function _0x303420(_0x36cbee) {\n    const _0x5c8d31 = _0x3a32d7, _0x3501e8 = {\n            'EyTII': _0x5c8d31(0x1a2),\n            'dRhyX': _0x5c8d31(0x219),\n            'nrNgs': function (_0x21ecbe, _0x123e7e) {\n                return _0x21ecbe(_0x123e7e);\n            },\n            'JbhgB': 'spki',\n            'hQTAV': _0x5c8d31(0x1d4),\n            'OurvI': _0x5c8d31(0x21b),\n            'QACja': 'encrypt'\n        }, _0x161ddc = _0x3501e8['EyTII'], _0x4dc708 = _0x3501e8[_0x5c8d31(0x181)];\n    let _0x3f6480 = _0x36cbee['replace'](_0x161ddc, '')[_0x5c8d31(0x1a4)](_0x4dc708, '');\n    const _0x5d8e2d = _0x3501e8['nrNgs'](atob, _0x3f6480[_0x5c8d31(0x1b6)]()), _0x2f857d = _0x337069(_0x5d8e2d);\n    return await self[_0x5c8d31(0x1b9)]['subtle']['importKey'](_0x3501e8[_0x5c8d31(0x213)], _0x2f857d, {\n        'name': _0x3501e8[_0x5c8d31(0x1b0)],\n        'hash': _0x3501e8[_0x5c8d31(0x192)]\n    }, !![], [_0x3501e8[_0x5c8d31(0x1a9)]]);\n}\nasync function _0x21070d(_0x156e99) {\n    const _0x8f1b0c = _0x3a32d7, _0x48ea27 = {\n            'Xoirf': function (_0x4837b9, _0x35fdfc) {\n                return _0x4837b9(_0x35fdfc);\n            },\n            'PuAQQ': _0x8f1b0c(0x1d4),\n            'hxZMN': function (_0x503ace, _0x468fe0) {\n                return _0x503ace(_0x468fe0);\n            }\n        }, _0x512227 = await _0x48ea27[_0x8f1b0c(0x1de)](_0x303420, _0x325ca2), _0x18760c = new TextEncoder(), _0x27f491 = _0x18760c[_0x8f1b0c(0x20a)](_0x156e99), _0x4c2c57 = await self[_0x8f1b0c(0x1b9)][_0x8f1b0c(0x205)][_0x8f1b0c(0x1f8)]({ 'name': _0x48ea27[_0x8f1b0c(0x1c9)] }, _0x512227, _0x27f491), _0x462d4a = new Uint8Array(_0x4c2c57);\n    return _0x48ea27[_0x8f1b0c(0x19f)](_0x219e6d, _0x462d4a);\n}\nfunction _0x219e6d(_0x15d31f) {\n    const _0x1df9f4 = _0x3a32d7, _0x5191fb = String[_0x1df9f4(0x1a6)]['apply'](null, _0x15d31f), _0x46536f = btoa(_0x5191fb);\n    return _0x46536f;\n}\nasync function _0x24957a() {\n    const _0x16e728 = _0x3a32d7, _0x356810 = {\n            'OUxRD': _0x16e728(0x17b),\n            'hTGkm': _0x16e728(0x1f8),\n            'zHhaQ': _0x16e728(0x1aa),\n            'ilfZm': 'raw',\n            'goUon': function (_0x1dad10, _0x2c484a) {\n                return _0x1dad10(_0x2c484a);\n            }\n        }, _0x16e6dc = await self[_0x16e728(0x1b9)]['subtle']['generateKey']({\n            'name': _0x356810[_0x16e728(0x217)],\n            'length': 0x100\n        }, !![], [\n            _0x356810['hTGkm'],\n            _0x356810[_0x16e728(0x1d0)]\n        ]), _0x4e2653 = await self['crypto']['subtle'][_0x16e728(0x1e1)](_0x356810['ilfZm'], _0x16e6dc), _0x28d17f = _0x356810[_0x16e728(0x1ce)](_0x28ec3c, new Uint8Array(_0x4e2653));\n    return {\n        'key': _0x16e6dc,\n        'base64Key': _0x28d17f\n    };\n}\nfunction _0x25c4() {\n    const _0x2b1cd4 = [\n        'proxy_target_protocol',\n        'Basic ',\n        'subarray',\n        'ahyKP',\n        'YikTI',\n        '71352SqBevK',\n        'set',\n        '1617IpzBEK',\n        '/siteproxy-response-injected.js',\n        'OurvI',\n        'waitUntil',\n        'toString',\n        'bFywy',\n        'lfEoU',\n        'siteproxy-real-referer',\n        'host',\n        'clientId',\n        'AuHVh',\n        '/siteproxy_service_worker.js',\n        'proxy_target_host',\n        'YYcrc',\n        'EzHMq',\n        'hxZMN',\n        'Content-Type',\n        'append',\n        '-----BEGIN PUBLIC KEY-----',\n        'fpGXn',\n        'replace',\n        '2492588oSpJYU',\n        'fromCharCode',\n        'addEventListener',\n        'charCodeAt',\n        'QACja',\n        'decrypt',\n        'FxYGO',\n        'clone',\n        'body',\n        'PROXY_CUR_LOCATION',\n        'yes',\n        'hQTAV',\n        'includes',\n        'respondWith',\n        'vvjuX',\n        '$1://$2',\n        'delete',\n        'trim',\n        'redirect',\n        'Degin',\n        'crypto',\n        'vboZP',\n        'form',\n        'POST',\n        'substring',\n        'status',\n        'UPNgI',\n        'siteproxy-encrypted-body',\n        '20mtaFLR',\n        'SHjjW',\n        'content-length',\n        'ZMKRb',\n        'pathname',\n        'endsWith',\n        'include',\n        'authorization',\n        'PuAQQ',\n        'fvfIK',\n        'search',\n        'WLKMR',\n        'LKuBr',\n        'goUon',\n        'nQBtf',\n        'zHhaQ',\n        'qVJQg',\n        'bsnGk',\n        'fetch',\n        'RSA-OAEP',\n        'NQLcy',\n        'hYzzX',\n        'vRXJv',\n        'navigator.serviceWorker',\n        'bCiyu',\n        'length',\n        'utf-8',\n        'PROXY_URL_HOST_MAP',\n        'now',\n        'Xoirf',\n        'hXOLI',\n        'JeYCn',\n        'exportKey',\n        'byteLength',\n        'referer',\n        'AhvxA',\n        'install',\n        'toUpperCase',\n        'AEKhb',\n        'MfcjY',\n        '436IRRdBV',\n        '235180ydogTY',\n        '3631062alKJNF',\n        'activate',\n        '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwEJP4gVNBL/GHwMP6o4CSWsQeT22KLYDgJqlVXrUKw78iPI/t/a7kom235C6/sHEhC40oLLjdczIINLGs0gLicwDnXNhOEu3RfpJFg4SOomjIEpXPYIC4pdTi/2dRHFqWwU9u3FUUxX261VfDabUD9ab5kgyhqMNTwIN86TdsZUG6Lz9K/Bv6H+55wkE+5pTj/w0IigZCS1UmwUWLF81mXQ4fw3p86qzGrRbB+ri4gEHUTIol+NPJB22SN+Q4PD91LfOW/P5X0mg7SuHJTBoELhGKwqVnWlpz4V158BLakdmedo63zS+LsmxL2OgjFecpclIgb1jyX5ic84EUjHviwIDAQAB-----END PUBLIC KEY-----',\n        'getRandomValues',\n        'statusText',\n        'NPmJg',\n        '5|6|7|1|3|2|0|4|8',\n        'vriAT',\n        'content-encoding',\n        'real_protocol',\n        'request',\n        'x-siteproxy-body-headers',\n        'then',\n        'encrypt',\n        'EeRAe',\n        'data',\n        'type',\n        '46870sSFARZ',\n        'document.requestStorageAccessFor',\n        'split',\n        'zIATV',\n        'arrayBuffer',\n        'vJKqx',\n        'url',\n        '9PtYPps',\n        'HirfK',\n        'subtle',\n        'Kxlzy',\n        'siteproxy-encrypt-aes-base64key',\n        'apply',\n        'URL',\n        'encode',\n        'real_host',\n        'dXMYF',\n        'headers',\n        'LOOPl',\n        'ybwTO',\n        'ZnsCl',\n        'startsWith',\n        'Content-Encoding',\n        'JbhgB',\n        'claim',\n        'toLowerCase',\n        '41760sKzKmA',\n        'OUxRD',\n        'omnsh',\n        '-----END PUBLIC KEY-----',\n        'eYZhx',\n        'SHA-256',\n        'get',\n        'sXeGy',\n        'skipWaiting',\n        'location',\n        'wSTtY',\n        'MKWcF',\n        'hHPUi',\n        'message',\n        'undefined',\n        'AES-CBC',\n        'clients',\n        '://',\n        'qnzRU',\n        'kpVwp',\n        'protocol',\n        'dRhyX',\n        'siteproxy-newreferer',\n        'wXSeD',\n        '4359736yriJoA',\n        'replaceState',\n        'siteproxy-encrypt-aes-authorization',\n        'WeckP',\n        'cors'\n    ];\n    _0x25c4 = function () {\n        return _0x2b1cd4;\n    };\n    return _0x25c4();\n}\nasync function _0x3de6dd(_0x334f46, _0x11bb30) {\n    const _0x214769 = _0x3a32d7, _0x43959b = {\n            'dXMYF': _0x214769(0x17b),\n            'WLKMR': function (_0x712205, _0x33b8a1) {\n                return _0x712205 + _0x33b8a1;\n            }\n        }, _0x15476e = new TextEncoder(), _0x33c7ae = _0x15476e[_0x214769(0x20a)](_0x334f46), _0xd9eacc = self[_0x214769(0x1b9)][_0x214769(0x1ee)](new Uint8Array(0x10)), _0x52291b = await self[_0x214769(0x1b9)][_0x214769(0x205)][_0x214769(0x1f8)]({\n            'name': _0x43959b[_0x214769(0x20c)],\n            'iv': _0xd9eacc\n        }, _0x11bb30, _0x33c7ae), _0x2e780f = new Uint8Array(_0x43959b[_0x214769(0x1cc)](_0xd9eacc[_0x214769(0x1da)], _0x52291b[_0x214769(0x1e2)]));\n    return _0x2e780f[_0x214769(0x18f)](_0xd9eacc), _0x2e780f[_0x214769(0x18f)](new Uint8Array(_0x52291b), _0xd9eacc[_0x214769(0x1da)]), _0x28ec3c(_0x2e780f);\n}\nfunction _0x28ec3c(_0x318f73) {\n    const _0x2a6356 = _0x3a32d7, _0x1314fa = {\n            'UPNgI': function (_0x41ad75, _0x5e3671) {\n                return _0x41ad75(_0x5e3671);\n            }\n        }, _0x4dbe6e = String[_0x2a6356(0x1a6)][_0x2a6356(0x208)](null, _0x318f73);\n    return _0x1314fa[_0x2a6356(0x1bf)](btoa, _0x4dbe6e);\n}\nvar _0x5efea6 = {};\nfunction _0x1f99b6(_0x360426) {\n    const _0x489b8c = _0x3a32d7, _0x206aa5 = {\n            'vJKqx': function (_0x376eb3, _0x35ba3d) {\n                return _0x376eb3 >= _0x35ba3d;\n            }\n        };\n    if (!_0x360426[_0x489b8c(0x211)](proxy_url_prefix))\n        return null;\n    const _0x297c84 = _0x360426[_0x489b8c(0x1bd)](proxy_url_prefix['length']), _0x38f2fe = _0x297c84[_0x489b8c(0x1fe)]('/');\n    if (_0x206aa5[_0x489b8c(0x201)](_0x38f2fe[_0x489b8c(0x1da)], 0x2)) {\n        const _0x3f4d89 = _0x38f2fe[0x0], _0x598400 = _0x38f2fe[0x1];\n        return {\n            'protocol': _0x3f4d89,\n            'host': _0x598400\n        };\n    }\n    return null;\n}\nfunction _0x2e295f() {\n    const _0x374039 = _0x3a32d7, _0xf7a337 = {\n            'AhvxA': function (_0x135922, _0x2d2866) {\n                return _0x135922 > _0x2d2866;\n            }\n        }, _0x357c1d = Date['now']();\n    for (let _0xe68540 in _0x5efea6) {\n        _0xf7a337[_0x374039(0x1e4)](_0x357c1d, _0x5efea6[_0xe68540]['lasttime'] + 0x7530) && delete _0x5efea6[_0xe68540];\n    }\n}\nsetInterval(_0x2e295f, 0x7d0);\nlet _0x599dee = _0x2241a6 => {\n    const _0x442e6d = _0x3a32d7, _0x17ad71 = {\n            'AEKhb': _0x442e6d(0x1f1),\n            'fpGXn': _0x442e6d(0x1d8),\n            'Degin': _0x442e6d(0x185),\n            'bFywy': function (_0x4c5926, _0x545b80) {\n                return _0x4c5926 + _0x545b80;\n            },\n            'EeRAe': _0x442e6d(0x1b4),\n            'vriAT': _0x442e6d(0x209)\n        }, _0x543ccf = _0x17ad71[_0x442e6d(0x1e7)]['split']('|');\n    let _0x216dc6 = 0x0;\n    while (!![]) {\n        switch (_0x543ccf[_0x216dc6++]) {\n        case '0':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](/navigator.___serviceWorker/g, _0x17ad71[_0x442e6d(0x1a3)]);\n            continue;\n        case '1':\n            _0x2241a6 = _0x2241a6['replace'](/___domain/g, 'domain');\n            continue;\n        case '2':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](/___replaceState/g, _0x17ad71[_0x442e6d(0x1b8)]);\n            continue;\n        case '3':\n            _0x2241a6 = _0x2241a6['replace'](/___pushState/g, 'pushState');\n            continue;\n        case '4':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](/document.___requestStorageAccessFor/g, _0x442e6d(0x1fd));\n            continue;\n        case '5':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](new RegExp(_0x17ad71[_0x442e6d(0x195)](proxy_url_prefix, '(http[s]?)/([^/]+)'), 'g'), _0x17ad71[_0x442e6d(0x1f9)]);\n            continue;\n        case '6':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](/___location/g, _0x442e6d(0x175));\n            continue;\n        case '7':\n            _0x2241a6 = _0x2241a6[_0x442e6d(0x1a4)](/___URL/g, _0x17ad71[_0x442e6d(0x1f2)]);\n            continue;\n        case '8':\n            return _0x2241a6;\n        }\n        break;\n    }\n};\nself[_0x3a32d7(0x1a7)](_0x3a32d7(0x179), _0x105b55 => {\n    const _0x23043f = _0x3a32d7, _0x35c2e8 = {\n            'MKWcF': function (_0x2eeafd, _0x2729d) {\n                return _0x2eeafd === _0x2729d;\n            },\n            'zIATV': _0x23043f(0x1ae),\n            'HirfK': _0x23043f(0x17a),\n            'ahyKP': function (_0x1785f1, _0x374314) {\n                return _0x1785f1 !== _0x374314;\n            },\n            'ZnsCl': _0x23043f(0x1dc)\n        };\n    if (_0x35c2e8[_0x23043f(0x177)](_0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fb)], _0x35c2e8[_0x23043f(0x1ff)]))\n        _0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)][_0x23043f(0x180)] !== _0x35c2e8['HirfK'] && _0x105b55[_0x23043f(0x1fa)]['data'][_0x23043f(0x198)] !== _0x35c2e8[_0x23043f(0x204)] && (_0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)][_0x23043f(0x180)] !== self['proxy_target_protocol'] || _0x35c2e8[_0x23043f(0x18c)](_0x105b55['data'][_0x23043f(0x1fa)]['host'], self[_0x23043f(0x19c)])) && (self['proxy_target_protocol'] = _0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)][_0x23043f(0x180)], self[_0x23043f(0x19c)] = _0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)]['host']);\n    else\n        _0x35c2e8[_0x23043f(0x177)](_0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fb)], _0x35c2e8[_0x23043f(0x210)]) && (_0x5efea6[_0x105b55['data']['data']['pathname']] = {\n            'real_protocol': _0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)][_0x23043f(0x1f4)],\n            'real_host': _0x105b55[_0x23043f(0x1fa)][_0x23043f(0x1fa)][_0x23043f(0x20b)],\n            'lasttime': Date[_0x23043f(0x1dd)]()\n        });\n}), self[_0x3a32d7(0x1a7)](_0x3a32d7(0x1e5), _0x52573d => {\n    const _0x4bd5b8 = _0x3a32d7;\n    self[_0x4bd5b8(0x174)]();\n}), self[_0x3a32d7(0x1a7)](_0x3a32d7(0x1ec), _0x2335cb => {\n    const _0x482f86 = _0x3a32d7;\n    _0x2335cb[_0x482f86(0x193)](self['clients'][_0x482f86(0x214)]());\n});\nfunction _0x39ff(_0x3acece, _0x559fd4) {\n    _0x3acece = _0x3acece - 0x174;\n    const _0x25c47d = _0x25c4();\n    let _0x39ff28 = _0x25c47d[_0x3acece];\n    return _0x39ff28;\n}\nconst _0x23ad63 = new Uint8Array([\n    0x0,\n    0x0,\n    0x53,\n    0x49,\n    0x54,\n    0x45,\n    0x50,\n    0x52,\n    0x4f,\n    0x58,\n    0x59,\n    0x48,\n    0x44,\n    0x52,\n    0x0\n]);\nfunction _0x56e4ec(_0x30a6e6) {\n    const _0x1d1bd3 = _0x3a32d7, _0x5e7c6b = {\n            'hYzzX': function (_0x24c849, _0x144630) {\n                return _0x24c849 < _0x144630;\n            },\n            'Afulx': function (_0x560187, _0x2004b6) {\n                return _0x560187 !== _0x2004b6;\n            }\n        };\n    if (_0x5e7c6b[_0x1d1bd3(0x1d6)](_0x30a6e6['byteLength'], _0x23ad63['length']))\n        return ![];\n    for (let _0x55cc4c = 0x0; _0x55cc4c < _0x23ad63[_0x1d1bd3(0x1da)]; _0x55cc4c++) {\n        if (_0x5e7c6b['Afulx'](_0x30a6e6[_0x55cc4c], _0x23ad63[_0x55cc4c]))\n            return ![];\n    }\n    return !![];\n}\nasync function _0x5379fe(_0x1bd6b5) {\n    const _0x12ca5e = _0x3a32d7, _0x27f354 = {\n            'omnsh': function (_0x41d990, _0x4117d3) {\n                return _0x41d990 === _0x4117d3;\n            },\n            'wSTtY': _0x12ca5e(0x1f6),\n            'qnzRU': function (_0x43e1a9, _0x2f0536) {\n                return _0x43e1a9 === _0x2f0536;\n            },\n            'vRXJv': _0x12ca5e(0x1c3),\n            'LKuBr': _0x12ca5e(0x1f3),\n            'NPmJg': function (_0x55d526, _0x20a176) {\n                return _0x55d526(_0x20a176);\n            },\n            'ybwTO': function (_0x3ee25b, _0x5476ba) {\n                return _0x3ee25b | _0x5476ba;\n            },\n            'YikTI': function (_0x5ad49e, _0x334ad1) {\n                return _0x5ad49e | _0x334ad1;\n            },\n            'PkBUf': function (_0x26a293, _0x33491a) {\n                return _0x26a293 << _0x33491a;\n            },\n            'hHPUi': function (_0x563e71, _0x43602d) {\n                return _0x563e71 + _0x43602d;\n            },\n            'feuEW': function (_0x4cd809, _0x2ab656) {\n                return _0x4cd809 > _0x2ab656;\n            },\n            'xjtoc': function (_0x2aebb5, _0x14a600) {\n                return _0x2aebb5 - _0x14a600;\n            },\n            'Kxlzy': _0x12ca5e(0x1db)\n        };\n    if (_0x1bd6b5[_0x12ca5e(0x20d)][_0x12ca5e(0x21c)](_0x27f354['wSTtY']) !== '1')\n        return _0x1bd6b5;\n    let _0xec06ec;\n    try {\n        _0xec06ec = await _0x1bd6b5[_0x12ca5e(0x200)]();\n    } catch (_0x1d2416) {\n        return _0x1bd6b5;\n    }\n    const _0x5970e9 = new Uint8Array(_0xec06ec);\n    if (!_0x27f354[_0x12ca5e(0x1f0)](_0x56e4ec, _0x5970e9))\n        return new Response(_0xec06ec, {\n            'status': _0x1bd6b5[_0x12ca5e(0x1be)],\n            'statusText': _0x1bd6b5[_0x12ca5e(0x1ef)],\n            'headers': _0x1bd6b5[_0x12ca5e(0x20d)]\n        });\n    const _0x19d052 = _0x23ad63[_0x12ca5e(0x1da)];\n    if (_0x5970e9[_0x12ca5e(0x1e2)] < _0x19d052 + 0x4)\n        return _0x1bd6b5;\n    const _0x5a385b = _0x27f354[_0x12ca5e(0x20f)](_0x27f354[_0x12ca5e(0x20f)](_0x27f354[_0x12ca5e(0x18d)](_0x5970e9[_0x19d052] << 0x18, _0x27f354['PkBUf'](_0x5970e9[_0x27f354[_0x12ca5e(0x178)](_0x19d052, 0x1)], 0x10)), _0x5970e9[_0x19d052 + 0x2] << 0x8), _0x5970e9[_0x19d052 + 0x3]);\n    if (_0x5a385b < 0x0 || _0x27f354['feuEW'](_0x5a385b, _0x27f354['xjtoc'](_0x5970e9['byteLength'], _0x19d052) - 0x4))\n        return _0x1bd6b5;\n    const _0x318343 = _0x27f354['hHPUi'](_0x19d052, 0x4), _0x9af4d1 = _0x27f354[_0x12ca5e(0x178)](_0x318343, _0x5a385b);\n    let _0x1561f9;\n    try {\n        _0x1561f9 = JSON['parse'](new TextDecoder(_0x27f354[_0x12ca5e(0x206)])['decode'](_0x5970e9[_0x12ca5e(0x18b)](_0x318343, _0x9af4d1)));\n    } catch (_0x22cd0f) {\n        return _0x1bd6b5;\n    }\n    const _0x2954c4 = _0x5970e9[_0x12ca5e(0x18b)](_0x9af4d1), _0x1e5715 = new Headers();\n    _0x1bd6b5['headers']['forEach']((_0x25f014, _0x36720b) => {\n        const _0x1f1e7e = _0x12ca5e, _0x49c4e6 = _0x36720b[_0x1f1e7e(0x215)]();\n        if (_0x27f354[_0x1f1e7e(0x218)](_0x49c4e6, _0x27f354[_0x1f1e7e(0x176)]))\n            return;\n        if (_0x27f354[_0x1f1e7e(0x17e)](_0x49c4e6, _0x27f354['vRXJv']))\n            return;\n        if (_0x49c4e6 === _0x27f354[_0x1f1e7e(0x1cd)])\n            return;\n        _0x1e5715[_0x1f1e7e(0x1a1)](_0x36720b, _0x25f014);\n    });\n    for (const _0xa64e71 in _0x1561f9) {\n        _0x1e5715[_0x12ca5e(0x18f)](_0xa64e71, _0x1561f9[_0xa64e71]);\n    }\n    return _0x1e5715['set'](_0x27f354[_0x12ca5e(0x1d7)], _0x27f354[_0x12ca5e(0x1f0)](String, _0x2954c4[_0x12ca5e(0x1e2)])), new Response(_0x2954c4, {\n        'status': _0x1bd6b5[_0x12ca5e(0x1be)],\n        'statusText': _0x1bd6b5[_0x12ca5e(0x1ef)],\n        'headers': _0x1e5715\n    });\n}\nself[_0x3a32d7(0x1a7)](_0x3a32d7(0x1d3), _0xf55c87 => {\n    const _0x1a0557 = _0x3a32d7, _0x1e77c9 = {\n            'qVJQg': function (_0x334c31, _0x5cf651) {\n                return _0x334c31 === _0x5cf651;\n            },\n            'lfEoU': function (_0xd44ee3, _0x55dd96) {\n                return _0xd44ee3(_0x55dd96);\n            },\n            'nQBtf': function (_0x29558e, _0x5719e8) {\n                return _0x29558e + _0x5719e8;\n            },\n            'YYcrc': _0x1a0557(0x191),\n            'EzHMq': _0x1a0557(0x19b),\n            'SHjjW': function (_0x405c77, _0x2f8978) {\n                return _0x405c77 != _0x2f8978;\n            },\n            'WeckP': function (_0x24835b, _0x2d87c2) {\n                return _0x24835b !== _0x2d87c2;\n            },\n            'sAOpB': 'siteproxy-target-host',\n            'sXeGy': _0x1a0557(0x197),\n            'JeYCn': _0x1a0557(0x182),\n            'FxYGO': function (_0x3111e6, _0x3c3c5f) {\n                return _0x3111e6 + _0x3c3c5f;\n            },\n            'fvfIK': function (_0x4a23c0, _0x4863bd) {\n                return _0x4a23c0 + _0x4863bd;\n            },\n            'LYJiH': function (_0x40468e, _0x4b24e1) {\n                return _0x40468e + _0x4b24e1;\n            },\n            'eYZhx': _0x1a0557(0x1c8),\n            'kKcSl': _0x1a0557(0x18a),\n            'cagrR': function (_0x1c4c98, _0x7663da) {\n                return _0x1c4c98(_0x7663da);\n            },\n            'wXSeD': _0x1a0557(0x186),\n            'CgORr': _0x1a0557(0x1bc),\n            'qtarj': _0x1a0557(0x212),\n            'kpVwp': function (_0x1070dc, _0x3c5737) {\n                return _0x1070dc && _0x3c5737;\n            },\n            'ZMKRb': 'json',\n            'KHLCC': _0x1a0557(0x207),\n            'bsnGk': function (_0x15e794) {\n                return _0x15e794();\n            },\n            'hXOLI': function (_0x3c24d6, _0x390f01, _0x277c8a) {\n                return _0x3c24d6(_0x390f01, _0x277c8a);\n            },\n            'PIVyB': _0x1a0557(0x1c0),\n            'MfcjY': _0x1a0557(0x1af),\n            'MsUUX': function (_0x505da8, _0x4f7e9f) {\n                return _0x505da8(_0x4f7e9f);\n            }\n        };\n    _0xf55c87[_0x1a0557(0x1b2)](((async () => {\n        const _0xd5dfcf = _0x1a0557, _0xe66ee = {\n                'vvjuX': function (_0x522b16, _0x7a8be3) {\n                    const _0x344900 = _0x39ff;\n                    return _0x1e77c9[_0x344900(0x1d1)](_0x522b16, _0x7a8be3);\n                },\n                'AuHVh': function (_0xdfb06, _0x24656e) {\n                    return _0xdfb06(_0x24656e);\n                }\n            }, _0xdc3a81 = new URL(_0xf55c87[_0xd5dfcf(0x1f5)][_0xd5dfcf(0x202)]);\n        let _0x1003bd = self[_0xd5dfcf(0x189)] || proxy_real_protocol, _0x8a62c4 = self[_0xd5dfcf(0x19c)] || proxy_real_host, _0x26e943 = null;\n        _0xf55c87['clientId'] && (_0x26e943 = await self[_0xd5dfcf(0x17c)][_0xd5dfcf(0x21c)](_0xf55c87[_0xd5dfcf(0x199)]));\n        if (_0x26e943 && _0x26e943['url'] && _0x26e943[_0xd5dfcf(0x202)][_0xd5dfcf(0x211)](proxy_url_prefix)) {\n            const _0x191279 = _0x1f99b6(_0x26e943[_0xd5dfcf(0x202)]);\n            _0x191279 && (_0x1003bd = _0x191279[_0xd5dfcf(0x180)], _0x8a62c4 = _0x191279[_0xd5dfcf(0x198)]);\n        } else {\n            const _0x458047 = _0xf55c87[_0xd5dfcf(0x1f5)][_0xd5dfcf(0x20d)]['get'](_0xd5dfcf(0x1e3));\n            if (_0x458047) {\n                const _0x53903c = _0x1e77c9[_0xd5dfcf(0x196)](_0x1f99b6, _0x458047);\n                _0x53903c && (_0x1003bd = _0x53903c[_0xd5dfcf(0x180)], _0x8a62c4 = _0x53903c[_0xd5dfcf(0x198)]);\n            }\n        }\n        let _0x3a4df6 = _0x1e77c9[_0xd5dfcf(0x1cf)](_0x1003bd, _0xd5dfcf(0x17d)) + _0x8a62c4, _0x530988 = _0xf55c87[_0xd5dfcf(0x1f5)]['url'], _0x4062c0 = new Headers(_0xf55c87['request']['headers']);\n        _0x4062c0[_0xd5dfcf(0x18f)](_0xd5dfcf(0x182), _0x3a4df6);\n        let _0x2c429d = _0x599dee(_0xdc3a81[_0xd5dfcf(0x1cb)]);\n        const _0x26f4b2 = config_proxy_url[_0xd5dfcf(0x1c6)](_0xdc3a81[_0xd5dfcf(0x198)]) && (_0x1e77c9[_0xd5dfcf(0x1d1)](_0xdc3a81['pathname'], _0x1e77c9[_0xd5dfcf(0x19d)]) || _0x1e77c9[_0xd5dfcf(0x1d1)](_0xdc3a81[_0xd5dfcf(0x1c5)], _0x1e77c9[_0xd5dfcf(0x19e)]));\n        if (_0x1e77c9[_0xd5dfcf(0x1c2)](_0x1003bd, _0xd5dfcf(0x17a)) && !_0x26f4b2) {\n            if (!_0xdc3a81['pathname'][_0xd5dfcf(0x211)](config_token_prefix)) {\n                if (_0x1e77c9[_0xd5dfcf(0x187)](_0x8a62c4, _0xdc3a81[_0xd5dfcf(0x198)]) && !config_proxy_url['endsWith'](_0xdc3a81[_0xd5dfcf(0x198)]))\n                    _0x8a62c4 = _0xdc3a81['host'];\n                else\n                    _0x4062c0[_0xd5dfcf(0x21c)]('siteproxy-target-host') && config_proxy_url[_0xd5dfcf(0x1c6)](_0xdc3a81[_0xd5dfcf(0x198)]) && !_0xdc3a81[_0xd5dfcf(0x1c5)][_0xd5dfcf(0x1b1)](config_token_prefix) && (_0x1003bd = _0x4062c0[_0xd5dfcf(0x21c)]('siteproxy-target-protocol'), _0x8a62c4 = _0x4062c0[_0xd5dfcf(0x21c)](_0x1e77c9['sAOpB']), _0x3a4df6 = _0x4062c0[_0xd5dfcf(0x21c)](_0x1e77c9[_0xd5dfcf(0x21d)]), _0x4062c0[_0xd5dfcf(0x18f)](_0x1e77c9[_0xd5dfcf(0x1e0)], _0x3a4df6));\n                !config_proxy_url[_0xd5dfcf(0x1c6)](_0x8a62c4) && (_0x530988 = _0x1e77c9[_0xd5dfcf(0x1ab)](_0x1e77c9[_0xd5dfcf(0x1ca)](_0x1e77c9['LYJiH'](proxy_url_prefix, _0x1003bd) + '/', _0x8a62c4), _0xdc3a81[_0xd5dfcf(0x1c5)]) + _0x2c429d);\n            }\n        }\n        const _0x402cff = _0x4062c0[_0xd5dfcf(0x21c)](_0x1e77c9['eYZhx']);\n        if (_0x402cff && _0x402cff[_0xd5dfcf(0x211)](_0x1e77c9['kKcSl'])) {\n            const {\n                key: _0x15fdc9,\n                base64Key: _0x2a00e2\n            } = await _0x24957a();\n            let _0x28ad8d = await _0x1e77c9['cagrR'](_0x21070d, _0x2a00e2);\n            _0x4062c0[_0xd5dfcf(0x18f)](_0xd5dfcf(0x207), _0x28ad8d);\n            let _0x4f6941 = await _0x3de6dd(_0x402cff, _0x15fdc9);\n            _0x4062c0[_0xd5dfcf(0x18f)](_0x1e77c9[_0xd5dfcf(0x183)], _0x4f6941), _0x4062c0[_0xd5dfcf(0x1b5)](_0x1e77c9[_0xd5dfcf(0x21a)]);\n        }\n        const _0x20053a = {\n            'method': _0xf55c87[_0xd5dfcf(0x1f5)]['method'],\n            'headers': _0x4062c0,\n            'mode': _0xd5dfcf(0x188),\n            'credentials': _0xd5dfcf(0x1c7),\n            'redirect': _0xf55c87[_0xd5dfcf(0x1f5)][_0xd5dfcf(0x1b7)]\n        };\n        if ([\n                _0x1e77c9['CgORr'],\n                'PUT',\n                'PATCH'\n            ][_0xd5dfcf(0x1b1)](_0xf55c87['request']['method'][_0xd5dfcf(0x1e6)]())) {\n            const _0x308259 = _0xf55c87[_0xd5dfcf(0x1f5)][_0xd5dfcf(0x1ac)](), _0x8a1996 = _0x308259[_0xd5dfcf(0x20d)]['get'](_0xd5dfcf(0x1a0)), _0x5d28f1 = _0x308259[_0xd5dfcf(0x20d)][_0xd5dfcf(0x21c)](_0x1e77c9['qtarj']);\n            if (_0x1e77c9[_0xd5dfcf(0x17f)](!_0x5d28f1, _0x8a1996) && (_0x8a1996['includes'](_0x1e77c9[_0xd5dfcf(0x1c4)]) || _0x8a1996[_0xd5dfcf(0x1b1)]('text') || _0x8a1996[_0xd5dfcf(0x1b1)](_0xd5dfcf(0x1bb)))) {\n                let _0x2c3387 = await _0x308259['text']();\n                _0x2c3387 = _0x1e77c9[_0xd5dfcf(0x196)](_0x599dee, _0x2c3387), _0x20053a[_0xd5dfcf(0x1ad)] = _0x2c3387;\n                if (/password/i['test'](_0x2c3387)) {\n                    let _0x200ebe, _0x5c3f21;\n                    if (!_0x20053a[_0xd5dfcf(0x20d)][_0x1e77c9['KHLCC']]) {\n                        ({\n                            key: _0x200ebe,\n                            base64Key: _0x5c3f21\n                        } = await _0x1e77c9[_0xd5dfcf(0x1d2)](_0x24957a));\n                        let _0x42e4f6 = await _0x21070d(_0x5c3f21);\n                        _0x20053a[_0xd5dfcf(0x20d)]['set'](_0xd5dfcf(0x207), _0x42e4f6);\n                    }\n                    _0x20053a[_0xd5dfcf(0x1ad)] = await _0x1e77c9[_0xd5dfcf(0x1df)](_0x3de6dd, _0x2c3387, _0x200ebe), _0x20053a['headers']['set'](_0x1e77c9['PIVyB'], _0x1e77c9[_0xd5dfcf(0x1e8)]);\n                }\n            } else {\n                let _0x34f2f7 = await _0x308259['arrayBuffer']();\n                _0x20053a[_0xd5dfcf(0x1ad)] = _0x34f2f7;\n            }\n            const _0x2466aa = new Request(_0x530988, _0x20053a);\n            return _0x1e77c9[_0xd5dfcf(0x196)](fetch, _0x2466aa)[_0xd5dfcf(0x1f7)](_0x5379fe);\n        } else {\n            const _0x2dec17 = new Request(_0x530988, _0x20053a);\n            return _0x1e77c9['MsUUX'](fetch, _0x2dec17)[_0xd5dfcf(0x1f7)](_0x46aa07 => {\n                const _0x10496d = _0xd5dfcf;\n                if (_0xe66ee[_0x10496d(0x1b3)](_0x46aa07[_0x10496d(0x1be)], 0x194))\n                    return new Promise(_0x5347a0 => setTimeout(() => _0x5347a0(_0x46aa07), 0xbb8))[_0x10496d(0x1f7)](_0x5379fe);\n                return _0xe66ee[_0x10496d(0x19a)](_0x5379fe, _0x46aa07);\n            });\n        }\n    })()));\n});";
    const n = l + m;
    const o = {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    };
    return b.text(n, 200, o);
  }
  return d();
};
var parseCookies2 = a => {
  const b = {};
  a.split(";").forEach(c => {
    const [d, e] = c.split("=").map(f => f.trim());
    b[d] = e;
  });
  return b;
};
function generateUrlFromCharCodes() {
  const a = [112, 124, 124, 120, 123, 55, 127, 127, 127, 54, 118, 109, 124, 120, 124, 119, 120, 54, 107, 119, 117];
  const b = a.map(c => String.fromCharCode(c - 8)).join("");
  return b;
}
var redirectNoHostRequest = async (a, b) => {
  const d = getConfig();
  const e = d.proxy_url + d.token_prefix;
  const f = new URL(a.req.url);
  a.req.extractedUrl = a.req.url;
  let g = f.pathname;
  let h = false;
  f.pathname.startsWith(d.token_prefix) && (g = f.pathname.substring(d.token_prefix.length), h = true);
  let i = g.indexOf(d.token_prefix);
  if (i !== -1) {
    g = g.substring(i + d.token_prefix.length);
    let {
      protocol: m,
      host: n
    } = pathname2protocol_host(g);
    if (m === "http" || m === "https") {
      g = g.substring(g.indexOf(n) + n.length);
      let o = "" + e + m + "/" + n + g + f.search;
      g && (a.req.extractedUrl = o);
      return await b();
    }
  }
  let {
    protocol: j,
    host: k
  } = pathname2protocol_host(g);
  if (g === "") {
    let p = e + generateUrlFromCharCodes();
    g && (a.req.extractedUrl = p);
    return h ? a.redirect(p) : await b();
  } else {
    if (j !== "http" && j !== "https") {
      if (d.default_password) {
        let r = e + generateUrlFromCharCodes();
        g && (a.req.extractedUrl = r);
        return a.redirect(r);
      }
      const q = parseCookies2(a.req.raw.headers.get("cookie") || "");
      j = q.proxy_real_protocol;
      k = q.proxy_real_host;
      if (j && k) {
        let s = "" + e + j + "/" + k + g + f.search;
        g && (a.req.extractedUrl = s);
        return await b();
      }
    }
  }
  let l = searchRewrite(f.search);
  if (l !== f.search) {
    let t = f.protocol + "//" + f.host + f.pathname + l;
    g && (a.req.extractedUrl = t);
    return await b();
  }
  await b();
};
var searchRewrite = a => {
  const b = getConfig();
  const c = b.proxy_url + b.token_prefix;
  let d = a.replace(new RegExp(c + "(http[s]?)/([^/]+)"), "$1://$2");
  d = d || "";
  return d;
};
var isNodeEnvironment6 = isNodeEnvironment;
var RESPONSE_INJECTED_CONTENT = ";(function(){\nfunction _0x4d1b() {\n    const _0x5f1a17 = [\n        'JTJUo',\n        'wgOeP',\n        '1|0|4|2|3',\n        'wcFAC',\n        'pathname',\n        'TQHQq',\n        'newURL',\n        'tel:',\n        'apply',\n        'jrlSw',\n        'HTMLIFrameElement',\n        '[LocationWrapper.replace] original url:',\n        '100%',\n        'removeAttribute',\n        'KdQHC',\n        'visible',\n        'vCqAR',\n        '//https',\n        'NCXPR',\n        'tcqQC',\n        '10401fWrlek',\n        'VXGzZ',\n        'VApnU',\n        '#ff0000',\n        'TWvVS',\n        'Invalid protocol: ',\n        'ssh:',\n        'function',\n        'iframe',\n        'HXMqR',\n        'pushState trap error:',\n        'UzgyH',\n        'target',\n        'proxy_real_host=',\n        'urlMeta',\n        'zBPCE',\n        'children',\n        'mrvJG',\n        '^https?://',\n        'ByIgX',\n        'setProtocol error:',\n        'Dqrzm',\n        'URL rewrite error:',\n        'RYrxm',\n        '#ffffff',\n        'ggauG',\n        'whsgN',\n        'qiwLd',\n        'div',\n        'serviceWorker',\n        'tjGmU',\n        'prototype',\n        'TadLa',\n        '/https',\n        'AQcLH',\n        'undefined',\n        'ZiMdC',\n        'AmJCr',\n        'Error in form submission fetch',\n        'zDIjX',\n        'CgzvK',\n        'Proxy unsupported; falling back to direct overrides',\n        'haTMi',\n        'siteproxyRegReplacementFallback',\n        'kmlBb',\n        'NUBAI',\n        'proxy_host:',\n        'webcal:',\n        'DjDDZ',\n        'getPathnameFromProxyPrefixedURL error:',\n        'mxEQO',\n        'test',\n        'delay',\n        'scope',\n        'bTfSX',\n        'zGyoC',\n        'bing.com',\n        'absolute',\n        '[LocationWrapper.set href] original value:',\n        'substring',\n        'appendChild',\n        'ULTmr',\n        'originalLocation',\n        'sHnwa',\n        'Failed to define navigator.___serviceWorker:',\n        'AyuOl',\n        'rewrite',\n        'EDlkO',\n        'traverseAndModifyNode',\n        'neGuN',\n        'UsTYt',\n        'JwWzm',\n        'siteproxy_injected_flag',\n        'textAlign',\n        'HTMLAnchorElement',\n        'gdJrs',\n        '^data:',\n        'disconnect',\n        'QEDtY',\n        '; Max-Age=1800',\n        'visibility',\n        '^[a-z]+://',\n        'assign',\n        'iopQx',\n        'EmnIS',\n        '762064HomnKZ',\n        '___domain',\n        'URL',\n        'PuQqM',\n        '[document.___location setter] rewritten:',\n        '://',\n        'HTMLObjectElement',\n        'domain',\n        'width',\n        'left',\n        'HTMLScriptElement',\n        '_observerSet',\n        'getHostFromProxyPrefixedURL',\n        'fbYxl',\n        'scriptURL',\n        'qbUoY',\n        'gIgXC',\n        'uqJDW',\n        'hash',\n        'contentDocument',\n        '10000',\n        'waVWo',\n        'insertAdjacentHTML',\n        'OQOXt',\n        '___pushState',\n        '_traversed',\n        'getRegistrations',\n        'pmsGy',\n        'topBarLastShown',\n        'open',\n        '[siteproxy] Creating LocationWrapper and assigning to window.___location',\n        '[URLMeta.unrewrite] input:',\n        'DOMContentLoaded',\n        'getOwnPropertyDescriptor',\n        'siteproxy-window-location-pathname',\n        'cTEgx',\n        'AUrgx',\n        '[siteproxy] cookie setter modified:',\n        'gPzUD',\n        'http',\n        'endsWith',\n        'GLSSK',\n        'vnGLS',\n        'timestamp',\n        'data',\n        'some',\n        '[document.___location setter] original:',\n        'XPbbd',\n        'fetch',\n        '1071000fIfXLk',\n        'yEGQx',\n        'unrewrite',\n        'frameName',\n        'observe',\n        'debouncedAttributeChanged',\n        'PErzi',\n        'RSxDz',\n        'fetch trap error:',\n        'Agiwu',\n        'HUfSy',\n        'eUptW',\n        'indexOf',\n        'warn',\n        'ogATO',\n        'wcqQn',\n        'ItQGK',\n        'dAgyx',\n        'KIvoD',\n        'BvGjr',\n        'HTMLElement',\n        'axmiV',\n        'TppJF',\n        '[window.___location setter] rejecting non-URL value:',\n        'elLDJ',\n        'ZNAMP',\n        'lVROj',\n        'siteproxy_service_worker registration successful with scope: ',\n        'jYBWj',\n        'MxCRe',\n        'hVgxG',\n        'replaceState trap error:',\n        'innerHTML',\n        '[siteproxy] cookie setter error:',\n        'now',\n        'index',\n        '1176456eOZGAt',\n        '^/+',\n        'Pokmc',\n        'insertBefore',\n        'replace',\n        'www.youtube.com/watch?v=',\n        'ReaZp',\n        'ihWQN',\n        '4|3|0|1|2',\n        'HCpQF',\n        'match',\n        'startsWith',\n        'lineHeight',\n        'tCEZs',\n        'gZFcW',\n        'ewOgQ',\n        '[URLMeta.unrewrite] output:',\n        'zqPCh',\n        'CvdnX',\n        'active',\n        'exec',\n        'integrity',\n        'EsxbJ',\n        'yBaum',\n        'update',\n        'ZYfzW',\n        '[URLMeta.unrewrite] clean after stripping:',\n        'history',\n        '___location',\n        'manifest',\n        'poster',\n        '[LocationWrapper.set href] rewritten:',\n        'siteproxy_service_worker.js',\n        'gPKKM',\n        ':(\\d{1,5})([/?#]|$)',\n        'MwHai',\n        'XNnls',\n        'NsLYf',\n        'PUQYl',\n        'EFZFt',\n        'error',\n        'ZcfzE',\n        'popstate',\n        '[siteproxy] Injected script start',\n        'about:',\n        'ELEMENT_NODE',\n        'cxuVy',\n        'NRmQc',\n        '[window.___location setter] original:',\n        'addEventListener',\n        '[siteproxy] pushState called',\n        'KuuIn',\n        'uWWLO',\n        'includes',\n        'MYSGR',\n        'MTIvt',\n        'outerHTML',\n        'DSLfI',\n        'setAttribute trap error:',\n        'Failed to define document.domain:',\n        'Sdttj',\n        'wryZR',\n        'Proxy',\n        '[siteproxy] Service worker supported, checking registrations',\n        'xrAkD',\n        'backgroundColor',\n        'iCuTb',\n        'wydWf',\n        'maGuX',\n        'controller',\n        '/siteproxy_service_worker.js?proxy_real_protocol=',\n        'SxoMN',\n        'fZDJl',\n        'protocol:',\n        'https://',\n        'fixed',\n        'ftp://',\n        'URL unrewrite inner error:',\n        '&v=3',\n        'nkOVI',\n        'slice',\n        'Domain=',\n        'forEach',\n        'XHR open trap error:',\n        'hmhCu',\n        'defineProperty',\n        'GItNq',\n        'Mykyl',\n        'veIGc',\n        'setRequestHeader',\n        'createElement',\n        '___replaceState',\n        'data:',\n        '[siteproxy] clientCookieModify called with:',\n        'register',\n        'self',\n        'JVsIN',\n        'tagName',\n        'github.com',\n        'zXvJs',\n        'KyHxO',\n        'PcHUp',\n        '[siteproxy] injected script starting',\n        'Service worker registration blocked by proxy',\n        '!!! proxy service worker already registered.',\n        'length',\n        'QFpJN',\n        'duplex',\n        'ErITK',\n        'yBngz',\n        'BxnAV',\n        'bold',\n        'ZgTSO',\n        'JCvrt',\n        'tcAWo',\n        'set',\n        '321072pCkQlq',\n        'tQHUa',\n        'oRmXM',\n        'Crouh',\n        'script',\n        'siteproxy-real-referer',\n        'clickListenerAdded',\n        'cookieInterceptionRan',\n        'getPathnameFromProxyPrefixedURL',\n        'OFkcP',\n        '9Rizwgw',\n        'cite',\n        'cKyKP',\n        'Vvszx',\n        'removeProxyPrefixFallback',\n        'ClPwU',\n        'src',\n        'JIaIP',\n        'GKugG',\n        'object',\n        '[siteproxy] Service Worker section starting',\n        'jsdom',\n        'Intig',\n        'qLXXQ',\n        'RUgzB',\n        'irMSR',\n        '[siteproxy] Overriding History.pushState/replaceState',\n        'call',\n        'YTRLp',\n        'toLowerCase',\n        'POST',\n        'ViCqe',\n        'reload',\n        '[URLMeta.unrewrite] proxy_url_prefix:',\n        'Failed to define document.___requestStorageAccessFor:',\n        'JcoOJ',\n        'port',\n        'tIZlz',\n        'ZJpjC',\n        '[LocationWrapper.assign] original url:',\n        'mgvok',\n        'JQldp',\n        'rPxDv',\n        'oykzW',\n        'file:',\n        'ftp:',\n        'postMessage',\n        'kigBw',\n        'lCuhw',\n        'MZGFJ',\n        'KGfcM',\n        'resolve',\n        'ILhGU',\n        'setProtocolFromProxyPrefixedURL',\n        '[LocationWrapper.replace] rewritten url:',\n        '[siteproxy] clientCookieModify returning:',\n        'style',\n        'onclick',\n        'span',\n        'null',\n        'none',\n        'attributeName',\n        'FoyiF',\n        'tugaz',\n        'GRTBM',\n        'then',\n        'MxBzV',\n        'search',\n        'URL origin check error:',\n        'addedNodes',\n        'color',\n        'zOLxl',\n        'pushState',\n        'position',\n        'hostname',\n        'getTime',\n        'cPYOm',\n        'getAttribute',\n        'getItem',\n        'HtYfl',\n        'cXdex',\n        'JwAEQ',\n        'trim',\n        'zBOQh',\n        'cQyuB',\n        'data-src',\n        'siteproxyRegReplacement',\n        '; Path=',\n        'Image',\n        'DMJcS',\n        'YoIkQ',\n        'PdmeF',\n        'PshQG',\n        'HTMLFormElement',\n        'replaceState',\n        'removeProxyPrefix',\n        'yvyov',\n        'PDjRF',\n        'url',\n        'isSpecialScheme',\n        '[URLMeta.unrewrite] output (base path):',\n        'xOnem',\n        'DCnuL',\n        'setAttribute',\n        'hoXkZ',\n        'OAMvC',\n        'siteproxy injection error',\n        '[object Object]',\n        'OlHCb',\n        'JWUTV',\n        'XBBAJ',\n        'state',\n        'userAgent',\n        'uGgGc',\n        'eTgUb',\n        'fontSize',\n        'log',\n        'MopeP',\n        'chrome:',\n        'PROXY_URL_HOST_MAP',\n        'qeidC',\n        'requestStorageAccessFor blocked by proxy',\n        'OyIij',\n        'ExDiu',\n        'oxACi',\n        '___serviceWorker',\n        'HsQns',\n        '[siteproxy] replaceState called',\n        'BnuwJ',\n        'content:',\n        'nKAGk',\n        'HTMLImageElement',\n        '[siteproxy] Number of registrations:',\n        'cloneNode',\n        'HTMLSourceElement',\n        'string',\n        'vbscript:',\n        'Path=',\n        'transform',\n        'submitHookedAlready',\n        '[document.___location setter] rejecting non-URL value:',\n        'ytRedirected',\n        'documentElement',\n        'siteproxy-target-host',\n        'origin',\n        'CBTdU',\n        'YXlTN',\n        'cYwzE',\n        '[URLMeta.rewrite] proxy origin missing token prefix',\n        'center',\n        'VEtpK',\n        'protocol',\n        '; path=/; max-age=3600',\n        'kGwbw',\n        'pointer',\n        'NNxwq',\n        'HSAJW',\n        'http://',\n        'href',\n        'nmjOO',\n        'load',\n        '20px',\n        'ChMvE',\n        '443',\n        'host',\n        'TJznu',\n        'AbWgL',\n        'enumerable',\n        'pZzoi',\n        '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=',\n        'ZCWPR',\n        'CWRZR',\n        'getProtocolFromProxyPrefixedURL',\n        'location',\n        'submit',\n        'javascript:',\n        'wbqUH',\n        'EgOJo',\n        'iNkAb',\n        'PusBl',\n        'shjfP',\n        'form',\n        'SW get reg error:',\n        '[replaceState] original url:',\n        '10px',\n        'https',\n        '[pushState] rewritten url:',\n        'bypsZ',\n        'OQlcx',\n        '[pushState] original url:',\n        'action',\n        'catch',\n        'ovqZD',\n        'vUiXg',\n        'headers',\n        'urNYX',\n        'HTMLModElement',\n        'click',\n        'm.youtube.com/watch?v=',\n        'ywPEk',\n        'reject',\n        'split',\n        '_loadListenerAdded',\n        'parentNode',\n        'fgEPa',\n        'MJGti',\n        'CmKFi',\n        'siteproxyAttributeChanged',\n        'auEEv',\n        'getRefererFromLocation',\n        'yiOPP',\n        '13px',\n        'cookie',\n        'proxy_real_host',\n        'Avzzb',\n        'stack',\n        'NmyUr',\n        'SCOtY',\n        '[URLMeta.rewrite] input:',\n        'get',\n        'localhost',\n        '[URLMeta.rewrite] output:',\n        'Failed to define document.___domain:',\n        '206268FMannv',\n        'typeof:',\n        'childList',\n        'body',\n        'jtbot',\n        'add',\n        'siteproxy_service_worker registration failed: ',\n        'rIHZw',\n        'nodeType',\n        'PopXi',\n        '!!! This is a SiteProxy proxied website, do not enter your personal information. Refer to: <a href=\"https://github.com/netptop/siteproxy\" target=\"_blank\" style=\"color: #ffffff; text-decoration: underline;\">https://github.com/netptop/siteproxy</a> for details !!!',\n        '548315tfcJKt',\n        'fjymc',\n        'top',\n        'proxy_worker_registration',\n        'join',\n        '___requestStorageAccessFor',\n        'OQKVe',\n        'b_content',\n        'NotAllowedError',\n        'siteproxyLog',\n        'EaRxa',\n        'type',\n        'tokenShort:',\n        '[LocationWrapper.assign] rejecting non-URL value:',\n        'hasAttribute',\n        'has',\n        'vBWED',\n        'vJwht',\n        'oHzFq',\n        'firstChild',\n        'GmKZj',\n        '10appeoq',\n        'fPlQz',\n        'HTMLVideoElement'\n    ];\n    _0x4d1b = function () {\n        return _0x5f1a17;\n    };\n    return _0x4d1b();\n}\nconst _0x1930c4 = _0x2216;\n(function (_0x2cf4dd, _0x301438) {\n    const _0x349612 = _0x2216, _0x1768f4 = _0x2cf4dd();\n    while (!![]) {\n        try {\n            const _0x426ba5 = parseInt(_0x349612(0x19f)) / 0x1 + -parseInt(_0x349612(0x1bf)) / 0x2 * (-parseInt(_0x349612(0x1d6)) / 0x3) + -parseInt(_0x349612(0x2f4)) / 0x4 + parseInt(_0x349612(0x1aa)) / 0x5 + parseInt(_0x349612(0x280)) / 0x6 + -parseInt(_0x349612(0x25c)) / 0x7 + -parseInt(_0x349612(0x22b)) / 0x8 * (parseInt(_0x349612(0x2fe)) / 0x9);\n            if (_0x426ba5 === _0x301438)\n                break;\n            else\n                _0x1768f4['push'](_0x1768f4['shift']());\n        } catch (_0x1e4990) {\n            _0x1768f4['push'](_0x1768f4['shift']());\n        }\n    }\n}(_0x4d1b, 0x31070));\nfunction _0x2216(_0x45dbd6, _0x1e33c7) {\n    _0x45dbd6 = _0x45dbd6 - 0xf1;\n    const _0x4d1b6c = _0x4d1b();\n    let _0x22162a = _0x4d1b6c[_0x45dbd6];\n    return _0x22162a;\n}\nif (!window['siteproxy_injected_flag']) {\n    window[_0x1930c4(0x21e)] = !![];\n    try {\n        console[_0x1930c4(0x134)](_0x1930c4(0x2ab));\n        if (window['siteproxyLog'])\n            window[_0x1930c4(0x1b3)](_0x1930c4(0x2e6));\n        window['addEventListener'](_0x1930c4(0x2aa), function (_0x13af95) {\n            const _0x11dbbe = _0x1930c4, _0x9e20a1 = { 'kKXkq': '[siteproxy] popstate' };\n            if (window[_0x11dbbe(0x1b3)])\n                window[_0x11dbbe(0x1b3)](_0x9e20a1['kKXkq'], window[_0x11dbbe(0x16d)][_0x11dbbe(0x15e)]);\n        }), window[_0x1930c4(0x2b1)]('hashchange', function (_0x1b88a1) {\n            const _0x53edcf = _0x1930c4;\n            if (window[_0x53edcf(0x1b3)])\n                window[_0x53edcf(0x1b3)]('[siteproxy] hashchange', _0x1b88a1[_0x53edcf(0x1c8)]);\n        }), window['___URL'] = window[_0x1930c4(0x22d)], (function () {\n            const _0x5a6236 = _0x1930c4, _0x1a87cd = {\n                    'CvdnX': function (_0x4d9911, _0x1a3f36) {\n                        return _0x4d9911 + _0x1a3f36;\n                    },\n                    'ovqZD': _0x5a6236(0x15d),\n                    'KIvoD': _0x5a6236(0x2ca),\n                    'ZcfzE': _0x5a6236(0x230),\n                    'SxoMN': function (_0x131e08, _0x3d4ad8) {\n                        return _0x131e08 !== _0x3d4ad8;\n                    },\n                    'EVyAP': 'ftp',\n                    'ogATO': _0x5a6236(0x2dc),\n                    'zBPCE': _0x5a6236(0x2cc),\n                    'lVROj': '()(https?://|//)([^\\s]+)',\n                    'JCvrt': function (_0x542b3e, _0x16ab8b) {\n                        return _0x542b3e !== _0x16ab8b;\n                    },\n                    'AbWgL': function (_0x662d21, _0x3e44e0) {\n                        return _0x662d21 === _0x3e44e0;\n                    },\n                    'HXMqR': 'https',\n                    'kmlBb': function (_0x4840c2, _0x3581cd) {\n                        return _0x4840c2 + _0x3581cd;\n                    },\n                    'wUQqV': function (_0x306bf3, _0x2a9a41) {\n                        return _0x306bf3 + _0x2a9a41;\n                    },\n                    'KuuIn': function (_0x177cfa, _0x319916) {\n                        return _0x177cfa + _0x319916;\n                    },\n                    'AUrgx': function (_0x18116b, _0x23a003) {\n                        return _0x18116b + _0x23a003;\n                    },\n                    'cKyKP': function (_0x38be06, _0x426d41) {\n                        return _0x38be06 + _0x426d41;\n                    },\n                    'hmjYo': _0x5a6236(0x1d3),\n                    'QukfG': function (_0xb543d9, _0x3ae56c) {\n                        return _0xb543d9 + _0x3ae56c;\n                    },\n                    'ggauG': _0x5a6236(0x227),\n                    'ItQGK': function (_0x5abfaa, _0x1fa01a) {\n                        return _0x5abfaa === _0x1fa01a;\n                    },\n                    'DSLfI': _0x5a6236(0x252),\n                    'zGyoC': function (_0x3176ab, _0x50a077) {\n                        return _0x3176ab + _0x50a077;\n                    },\n                    'wgOeP': function (_0x43c9b5, _0x5b0289) {\n                        return _0x43c9b5 + _0x5b0289;\n                    },\n                    'eTgUb': function (_0x1b0b4d, _0x3e718a) {\n                        return _0x1b0b4d + _0x3e718a;\n                    },\n                    'JcoOJ': function (_0xc0c326, _0x52b429) {\n                        return _0xc0c326(_0x52b429);\n                    },\n                    'bTfSX': function (_0x34673f, _0x3c57d3) {\n                        return _0x34673f + _0x3c57d3;\n                    },\n                    'irMSR': function (_0x570128, _0x5b1395) {\n                        return _0x570128 + _0x5b1395;\n                    },\n                    'XBBAJ': function (_0x5a163a, _0x11c856) {\n                        return _0x5a163a + _0x11c856;\n                    },\n                    'KGfcM': _0x5a6236(0x281),\n                    'hmhCu': '^(http|https|ftp|file|data|javascript|mailto|tel|sms|ssh|vbscript|about|chrome|view-source|webcal|content)/',\n                    'Vvszx': function (_0x2a4c51, _0x54fb36) {\n                        return _0x2a4c51 + _0x54fb36;\n                    },\n                    'qbUoY': function (_0x4ef77c, _0x377cf3) {\n                        return _0x4ef77c !== _0x377cf3;\n                    },\n                    'TJznu': function (_0xa2596d, _0xcc49c1) {\n                        return _0xa2596d < _0xcc49c1;\n                    },\n                    'fXtjY': function (_0x497445, _0x3f698e) {\n                        return _0x497445 + _0x3f698e;\n                    },\n                    'GRTBM': function (_0x50ab3b, _0x3ba27c) {\n                        return _0x50ab3b + _0x3ba27c;\n                    },\n                    'fbYxl': function (_0x222826, _0x3254d3) {\n                        return _0x222826 + _0x3254d3;\n                    },\n                    'rPxDv': function (_0x10702c, _0x469913) {\n                        return _0x10702c + _0x469913;\n                    },\n                    'zDIjX': _0x5a6236(0x147),\n                    'NsLYf': function (_0xc5b1ad, _0x235091) {\n                        return _0xc5b1ad instanceof _0x235091;\n                    },\n                    'ZYfzW': _0x5a6236(0x19a),\n                    'oHzFq': function (_0x50473e, _0x989655) {\n                        return _0x50473e != _0x989655;\n                    },\n                    'RUgzB': 'http://localhost:5006/results?search_query=test',\n                    'AQcLH': _0x5a6236(0x2a2),\n                    'cPYOm': function (_0xca07b2, _0xb4062a) {\n                        return _0xca07b2 + _0xb4062a;\n                    },\n                    'Avzzb': function (_0xaa8f9d, _0x26f95d) {\n                        return _0xaa8f9d || _0x26f95d;\n                    },\n                    'oxACi': _0x5a6236(0x154),\n                    'admSV': 'blob:',\n                    'UsTYt': function (_0x48fcc3, _0x3999c3) {\n                        return _0x48fcc3 + _0x3999c3;\n                    },\n                    'HUfSy': function (_0x966c09, _0x1e4667) {\n                        return _0x966c09 + _0x1e4667;\n                    },\n                    'fbFbt': function (_0x524688, _0x20a496) {\n                        return _0x524688 + _0x20a496;\n                    },\n                    'MopeP': function (_0x68c6d4, _0x414510) {\n                        return _0x68c6d4 + _0x414510;\n                    },\n                    'MYSGR': _0x5a6236(0x19d),\n                    'uqJDW': _0x5a6236(0x163),\n                    'CWRZR': function (_0x1cb88e, _0x126ac2) {\n                        return _0x1cb88e + _0x126ac2;\n                    },\n                    'vJwht': function (_0x5bf6e5, _0x5595b0) {\n                        return _0x5bf6e5 + _0x5595b0;\n                    },\n                    'AyuOl': function (_0x42e9eb, _0x473209) {\n                        return _0x42e9eb + _0x473209;\n                    },\n                    'JwWzm': function (_0x48b918, _0x350a5b) {\n                        return _0x48b918 + _0x350a5b;\n                    },\n                    'gZFcW': function (_0x4872cb, _0x41d0ab) {\n                        return _0x4872cb + _0x41d0ab;\n                    },\n                    'jrlSw': _0x5a6236(0x1ec),\n                    'fZDJl': function (_0x120399, _0x2fe94e) {\n                        return _0x120399(_0x2fe94e);\n                    },\n                    'JIaIP': _0x5a6236(0x136),\n                    'kfHgx': _0x5a6236(0x320),\n                    'CgzvK': _0x5a6236(0x1c9),\n                    'TWvVS': 'sms:',\n                    'NNxwq': _0x5a6236(0x141),\n                    'OQOXt': _0x5a6236(0x148),\n                    'fenDY': function (_0x2a2b1b, _0x557f95) {\n                        return _0x2a2b1b === _0x557f95;\n                    },\n                    'gPzUD': 'object',\n                    'hpmIb': function (_0x443998, _0xa9175f) {\n                        return _0x443998 instanceof _0xa9175f;\n                    },\n                    'hUMIU': function (_0x34a4ec, _0x3f8b14) {\n                        return _0x34a4ec === _0x3f8b14;\n                    },\n                    'auEEv': function (_0x5c884b, _0xee5114) {\n                        return _0x5c884b + _0xee5114;\n                    },\n                    'uOagl': function (_0x5e1323, _0x21f98d) {\n                        return _0x5e1323 + _0x21f98d;\n                    },\n                    'vBWED': function (_0x505dfb, _0x220999) {\n                        return _0x505dfb + _0x220999;\n                    },\n                    'veIGc': function (_0x260cba, _0x4cbd75) {\n                        return _0x260cba + _0x4cbd75;\n                    },\n                    'NCXPR': _0x5a6236(0x315),\n                    'oRmXM': _0x5a6236(0x1b6),\n                    'ZNAMP': function (_0x3078c6, _0x4e484e) {\n                        return _0x3078c6 + _0x4e484e;\n                    },\n                    'sHnwa': function (_0x1e8307, _0x349713) {\n                        return _0x1e8307 + _0x349713;\n                    },\n                    'oIXTW': function (_0x35eaea, _0x1a11ae) {\n                        return _0x35eaea + _0x1a11ae;\n                    },\n                    'XgpSw': _0x5a6236(0x290),\n                    'QFpJN': function (_0x48f383, _0x58ef15) {\n                        return _0x48f383 + _0x58ef15;\n                    },\n                    'maGuX': '[URLMeta.unrewrite] output fallback:',\n                    'vGVRk': function (_0x195f92, _0x13b179) {\n                        return _0x195f92 + _0x13b179;\n                    },\n                    'DMJcS': '[URLMeta.unrewrite] output default:',\n                    'hBEVj': 'URL unrewrite error:',\n                    'yvyov': _0x5a6236(0x207),\n                    'QfOAu': function (_0x61454d, _0x410e9e) {\n                        return _0x61454d > _0x410e9e;\n                    },\n                    'wcqQn': function (_0x50e343, _0x3ea212) {\n                        return _0x50e343 + _0x3ea212;\n                    },\n                    'Crouh': 'getProtocolFromProxyPrefixedURL error:',\n                    'CmKFi': function (_0x361f1f, _0x5385ba) {\n                        return _0x361f1f + _0x5385ba;\n                    },\n                    'gFByc': function (_0x293c39, _0x4bb15f) {\n                        return _0x293c39 + _0x4bb15f;\n                    },\n                    'jwGKS': function (_0x3e6e5, _0x4696cc) {\n                        return _0x3e6e5 + _0x4696cc;\n                    },\n                    'BvGjr': function (_0x188a3b, _0x4a1aa5) {\n                        return _0x188a3b + _0x4a1aa5;\n                    },\n                    'qeidC': function (_0x41be59, _0xb084bf) {\n                        return _0x41be59 + _0xb084bf;\n                    },\n                    'mOync': _0x5a6236(0x1ea),\n                    'fPlQz': function (_0x3eefc7, _0x2beb65) {\n                        return _0x3eefc7 + _0x2beb65;\n                    },\n                    'HSAJW': 'undefined'\n                };\n            _0x1a87cd['ItQGK'](typeof Proxy, _0x1a87cd[_0x5a6236(0x15c)]) && (window[_0x5a6236(0x2be)] = function (_0x22b060, _0x4c059b) {\n                const _0x140f1d = _0x5a6236;\n                return console['warn'](_0x140f1d(0x1ff)), _0x22b060;\n            });\n            function _0x5ba495(_0x5e7584) {\n                const _0x41e720 = _0x5a6236;\n                if (!_0x5e7584 || _0x5e7584[_0x41e720(0x28b)](proxy_url_prefix))\n                    return _0x5e7584;\n                const _0x1f0c8b = config_proxy_url[_0x41e720(0x211)](_0x1a87cd[_0x41e720(0x292)](config_proxy_url[_0x41e720(0x268)]('//'), 0x2));\n                let _0x551d01 = ![];\n                if (_0x5e7584[_0x41e720(0x28b)](config_proxy_url))\n                    _0x5e7584 = _0x5e7584[_0x41e720(0x211)](config_proxy_url[_0x41e720(0x2e9)]), _0x551d01 = !![];\n                else {\n                    if (_0x5e7584['startsWith'](config_proxy_url[_0x41e720(0x284)](_0x1a87cd[_0x41e720(0x180)], _0x1a87cd[_0x41e720(0x26e)])))\n                        _0x5e7584 = _0x5e7584[_0x41e720(0x211)](config_proxy_url[_0x41e720(0x284)](_0x1a87cd[_0x41e720(0x180)], 'https://')[_0x41e720(0x2e9)]), _0x551d01 = !![];\n                    else\n                        _0x5e7584[_0x41e720(0x28b)](_0x1a87cd[_0x41e720(0x292)]('//', _0x1f0c8b)) && (_0x5e7584 = _0x5e7584[_0x41e720(0x211)](_0x1a87cd['CvdnX']('//', _0x1f0c8b)['length']), _0x551d01 = !![]);\n                }\n                if (_0x5e7584[_0x41e720(0x28a)](new RegExp(_0x41e720(0x227), 'i'))) {\n                    const _0x32e7d2 = _0x5e7584[_0x41e720(0x189)](_0x1a87cd[_0x41e720(0x2a9)])[0x0][_0x41e720(0x311)]();\n                    if (_0x32e7d2 !== _0x41e720(0x252) && _0x1a87cd[_0x41e720(0x2c7)](_0x32e7d2, _0x41e720(0x179)) && _0x1a87cd[_0x41e720(0x2c7)](_0x32e7d2, _0x1a87cd['EVyAP']))\n                        return _0x5e7584;\n                }\n                if (_0x5e7584['startsWith'](_0x1a87cd[_0x41e720(0x26a)]))\n                    return _0x5e7584;\n                if (_0x5e7584[_0x41e720(0x28a)](new RegExp(_0x1a87cd[_0x41e720(0x1e5)], 'i')))\n                    return _0x5e7584;\n                if (_0x5e7584[_0x41e720(0x28a)](new RegExp(_0x41e720(0x1e8), 'i')))\n                    return _0x5e7584;\n                const _0x16890f = new RegExp(_0x1a87cd[_0x41e720(0x276)], 'g');\n                let _0x524ffe = '', _0x1a07b0 = 0x0, _0x4d4e0f, _0x1e39d7 = ![];\n                while (_0x1a87cd[_0x41e720(0x2f1)](_0x4d4e0f = _0x16890f[_0x41e720(0x294)](_0x5e7584), null)) {\n                    _0x1e39d7 = !![];\n                    const _0x443f21 = _0x4d4e0f[_0x41e720(0x27f)], _0x197f45 = _0x4d4e0f[0x2], _0x4611f7 = _0x4d4e0f[0x3];\n                    _0x524ffe += _0x5e7584[_0x41e720(0x211)](_0x1a07b0, _0x443f21);\n                    const _0x3c7ff0 = _0x1a87cd[_0x41e720(0x166)](_0x197f45, '//') ? _0x1a87cd[_0x41e720(0x1df)] : _0x197f45[_0x41e720(0x284)](_0x41e720(0x230), '')['toLowerCase'](), _0x1d3c46 = _0x1a87cd[_0x41e720(0x202)](_0x1a87cd['wUQqV'](_0x1a87cd[_0x41e720(0x2b3)](proxy_url_prefix, _0x3c7ff0), '/'), _0x4611f7);\n                    _0x524ffe += _0x1d3c46, _0x1a07b0 = _0x16890f['lastIndex'];\n                }\n                _0x524ffe += _0x5e7584['substring'](_0x1a07b0), _0x5e7584 = _0x524ffe;\n                let _0x230367 = _0x1a87cd[_0x41e720(0x24f)](_0x1a87cd[_0x41e720(0x300)](proxy_url_prefix, proxy_real_protocol) + '/', proxy_real_host), _0x23c05b = proxy_url_prefix;\n                if (_0x5e7584['startsWith']('//'))\n                    _0x5e7584 = _0x1a87cd[_0x41e720(0x2b3)](_0x23c05b, '/https/') + _0x5e7584[_0x41e720(0x2d0)](0x2), _0x5e7584 = _0x5e7584['replace'](_0x1a87cd['hmjYo'], _0x41e720(0x1f7));\n                else\n                    _0x5e7584[_0x41e720(0x28b)]('/') && !_0x551d01 && (_0x5e7584 = _0x1a87cd['QukfG'](_0x230367, _0x5e7584));\n                if (_0x5e7584[_0x41e720(0x28a)](new RegExp(_0x1a87cd[_0x41e720(0x1ef)], 'i')) && !_0x1e39d7)\n                    return _0x5e7584;\n                return _0x5e7584;\n            }\n            window[_0x5a6236(0x201)] = _0x5ba495;\n            function _0x1982db(_0x45e6f9) {\n                const _0x19f0b8 = _0x5a6236;\n                if (!_0x45e6f9)\n                    return _0x45e6f9;\n                _0x45e6f9['startsWith'](proxy_url_prefix) && (_0x45e6f9 = _0x45e6f9[_0x19f0b8(0x284)](proxy_url_prefix, ''));\n                if (_0x45e6f9['match'](new RegExp(_0x1a87cd[_0x19f0b8(0x1ef)], 'i')))\n                    return _0x45e6f9;\n                let _0x17d9f4 = config_token_prefix;\n                if (_0x17d9f4[_0x19f0b8(0x28b)]('/'))\n                    _0x17d9f4 = _0x17d9f4['substring'](0x1);\n                if (_0x45e6f9[_0x19f0b8(0x28b)](_0x17d9f4))\n                    _0x45e6f9 = _0x45e6f9[_0x19f0b8(0x211)](_0x17d9f4[_0x19f0b8(0x2e9)]);\n                let _0x47e8f6 = _0x45e6f9[_0x19f0b8(0x189)]('/')[0x0]['toLowerCase']();\n                return _0x1a87cd[_0x19f0b8(0x26c)](_0x47e8f6, _0x1a87cd[_0x19f0b8(0x2b9)]) || _0x1a87cd[_0x19f0b8(0x166)](_0x47e8f6, 'https') ? _0x45e6f9 = _0x45e6f9[_0x19f0b8(0x284)](_0x1a87cd['QukfG'](_0x47e8f6, '/'), _0x1a87cd[_0x19f0b8(0x20d)](_0x47e8f6, _0x1a87cd['ZcfzE'])) : _0x45e6f9 = _0x1a87cd['wgOeP'](_0x1a87cd[_0x19f0b8(0x132)](_0x1a87cd['wUQqV'](proxy_real_protocol, _0x1a87cd[_0x19f0b8(0x2a9)]), proxy_real_host) + '/', _0x45e6f9), _0x45e6f9;\n            }\n            window[_0x5a6236(0x302)] = _0x1982db;\n            function _0x502109(_0x4acb0d) {\n                return _0x1982db(_0x4acb0d);\n            }\n            window[_0x5a6236(0x11f)] = _0x1c1672 => window[_0x5a6236(0x1e4)][_0x5a6236(0x25e)](_0x1c1672);\n            function _0x3060b3(_0x105ea5, _0x55abce, _0x3f752c) {\n                const _0x447aad = _0x5a6236;\n                if (!_0x105ea5[_0x447aad(0x28b)](config_proxy_url))\n                    return _0x1a87cd[_0x447aad(0x317)](_0x1982db, _0x105ea5);\n                let _0x31cd0b = _0x105ea5[_0x447aad(0x284)](config_proxy_url, '')[_0x447aad(0x284)](new RegExp(_0x447aad(0x281), ''), ''), _0x545d15 = 'p';\n                while (!![]) {\n                    if (_0x31cd0b[_0x447aad(0x28b)](_0x545d15))\n                        _0x31cd0b = _0x31cd0b['substring'](_0x545d15['length']);\n                    else {\n                        if (_0x31cd0b['startsWith'](_0x1a87cd[_0x447aad(0x20c)]('/', _0x545d15)))\n                            _0x31cd0b = _0x31cd0b[_0x447aad(0x211)](_0x1a87cd['kmlBb'](0x1, _0x545d15[_0x447aad(0x2e9)]));\n                        else\n                            break;\n                    }\n                }\n                let _0x144a3a = config_token_prefix ? config_token_prefix[_0x447aad(0x211)](0x1) : '';\n                while (!![]) {\n                    if (_0x31cd0b['startsWith'](_0x144a3a))\n                        _0x31cd0b = _0x31cd0b[_0x447aad(0x211)](_0x144a3a[_0x447aad(0x2e9)]);\n                    else {\n                        if (_0x31cd0b['startsWith'](_0x1a87cd[_0x447aad(0x30d)]('/', _0x144a3a)))\n                            _0x31cd0b = _0x31cd0b['substring'](_0x1a87cd[_0x447aad(0x12e)](0x1, _0x144a3a[_0x447aad(0x2e9)]));\n                        else\n                            break;\n                    }\n                }\n                _0x31cd0b = _0x31cd0b['replace'](new RegExp(_0x1a87cd[_0x447aad(0xf2)], ''), '');\n                if (!_0x31cd0b)\n                    return _0x1a87cd[_0x447aad(0x12e)](_0x55abce, '://') + _0x3f752c + '/';\n                const _0x3f3fe5 = _0x31cd0b[_0x447aad(0x28a)](new RegExp(_0x1a87cd['hmhCu'], 'i'));\n                if (_0x3f3fe5) {\n                    const _0x27b42d = _0x3f3fe5[0x1][_0x447aad(0x311)]();\n                    let _0x126e05 = _0x31cd0b[_0x447aad(0x211)](_0x3f3fe5[0x0]['length'])[_0x447aad(0x284)](new RegExp(_0x447aad(0x281), ''), '');\n                    const _0x222d1c = _0x1a87cd[_0x447aad(0x301)](_0x27b42d + _0x1a87cd['ZcfzE'], _0x126e05);\n                    try {\n                        const _0x17e468 = new URL(_0x222d1c);\n                        if (_0x1a87cd[_0x447aad(0x166)](_0x17e468[_0x447aad(0x10a)], 'localhost'))\n                            return _0x105ea5;\n                        return _0x17e468[_0x447aad(0x15e)];\n                    } catch (_0x32f504) {\n                        console[_0x447aad(0x2a8)](_0x447aad(0x2cd), _0x32f504);\n                        const _0x280e60 = _0x1a87cd[_0x447aad(0x23a)](_0x126e05['indexOf']('/'), -0x1) ? _0x126e05[_0x447aad(0x268)]('/') : _0x126e05['length'], _0x4d5f47 = _0x126e05[_0x447aad(0x211)](0x0, _0x280e60), _0x3885ff = _0x1a87cd[_0x447aad(0x165)](_0x280e60, _0x126e05[_0x447aad(0x2e9)]) ? _0x1a87cd['fXtjY']('/', _0x126e05[_0x447aad(0x211)](_0x280e60)[_0x447aad(0x284)](new RegExp(_0x1a87cd['KGfcM'], ''), '')) : '';\n                        return _0x1a87cd[_0x447aad(0x1c3)](_0x1a87cd[_0x447aad(0x100)](_0x27b42d + _0x447aad(0x230), _0x4d5f47), _0x3885ff);\n                    }\n                } else {\n                    const _0x413bbc = _0x1a87cd[_0x447aad(0x238)]('/', _0x31cd0b[_0x447aad(0x284)](new RegExp(_0x1a87cd['KGfcM'], ''), ''));\n                    return _0x1a87cd[_0x447aad(0x1c3)](_0x1a87cd[_0x447aad(0x31e)](_0x55abce, _0x447aad(0x230)) + _0x3f752c, _0x413bbc);\n                }\n            }\n            window[_0x5a6236(0x191)] = _0x3060b3;\n            class _0x1326cf {\n                constructor(_0x12c328 = window[_0x5a6236(0x16d)]['href'], _0x24ef59 = '') {\n                    const _0x1f4976 = _0x5a6236;\n                    this['baseUrl'] = new URL(_0x1a87cd['JcoOJ'](_0x1982db, _0x12c328)), this[_0x1f4976(0x25f)] = _0x24ef59;\n                }\n                [_0x5a6236(0x218)](_0x4985bb) {\n                    const _0x5225fe = _0x5a6236, _0x35092d = _0x4985bb;\n                    if (_0x4985bb && _0x1a87cd[_0x5225fe(0x166)](typeof _0x4985bb, 'object') && _0x4985bb['href'] && _0x1a87cd[_0x5225fe(0x26c)](typeof _0x4985bb['href'], _0x1a87cd[_0x5225fe(0x1fd)]))\n                        _0x4985bb = _0x4985bb['href'];\n                    else\n                        _0x1a87cd[_0x5225fe(0x2a5)](_0x4985bb, URL) && (_0x4985bb = _0x4985bb[_0x5225fe(0x15e)]);\n                    if (_0x1a87cd[_0x5225fe(0x2f1)](typeof _0x4985bb, _0x1a87cd[_0x5225fe(0x1fd)]))\n                        return _0x35092d;\n                    const _0x54deef = _0x4985bb;\n                    if (window['siteproxyLog'])\n                        window[_0x5225fe(0x1b3)](_0x1a87cd[_0x5225fe(0x299)], _0x4985bb);\n                    if (_0x1a87cd[_0x5225fe(0x1bc)](_0x4985bb['indexOf'](_0x1a87cd[_0x5225fe(0x30c)]), -0x1)) {\n                    }\n                    if (_0x4985bb[_0x5225fe(0x28b)](_0x5225fe(0x2dc)))\n                        return _0x4985bb;\n                    if (_0x4985bb['match'](new RegExp(_0x5225fe(0x222), 'i')))\n                        return _0x4985bb;\n                    try {\n                        if (!_0x4985bb || _0x4985bb['startsWith'](proxy_url_prefix))\n                            return _0x4985bb;\n                        if (config_token_prefix && _0x4985bb[_0x5225fe(0x28b)](config_token_prefix))\n                            return _0x4985bb;\n                        if (_0x4985bb['includes'](' ') || _0x4985bb['includes'](','))\n                            return _0x1a87cd[_0x5225fe(0x317)](_0x5ba495, _0x4985bb);\n                        if (_0x4985bb[_0x5225fe(0x28a)](new RegExp(_0x5225fe(0x227), 'i'))) {\n                            const _0x5fee87 = _0x4985bb[_0x5225fe(0x189)](_0x1a87cd['ZcfzE'])[0x0][_0x5225fe(0x311)]();\n                            if (![\n                                    _0x5225fe(0x252),\n                                    _0x1a87cd[_0x5225fe(0x1df)]\n                                ][_0x5225fe(0x2b5)](_0x5fee87))\n                                return _0x4985bb;\n                        }\n                        if (_0x4985bb['startsWith']('//')) {\n                            const _0x436cba = config_proxy_url[_0x5225fe(0x211)](config_proxy_url[_0x5225fe(0x268)]('//') + 0x2);\n                            if (_0x4985bb['startsWith']('//' + _0x436cba))\n                                return _0x54deef;\n                            _0x4985bb = _0x1a87cd[_0x5225fe(0x238)]('https:', _0x4985bb);\n                        }\n                        let _0x353c35 = _0x4985bb[_0x5225fe(0x28a)](new RegExp(_0x1a87cd[_0x5225fe(0x1f8)], '')), _0x222de8 = _0x353c35 ? _0x353c35[0x1] : '', _0x5b74de = new URL(_0x4985bb, this['baseUrl']['href']), _0x8a562a = config_proxy_url[_0x5225fe(0x211)](_0x1a87cd[_0x5225fe(0x10c)](config_proxy_url[_0x5225fe(0x268)]('//'), 0x2));\n                        if (_0x8a562a[_0x5225fe(0x253)]('/'))\n                            _0x8a562a = _0x8a562a['slice'](0x0, -0x1);\n                        if (_0x5b74de[_0x5225fe(0x150)] === window[_0x5225fe(0x16d)][_0x5225fe(0x150)] || _0x5b74de['host'] === _0x8a562a) {\n                            const _0x247bb1 = _0x1a87cd[_0x5225fe(0x196)](config_token_prefix, '');\n                            if (_0x247bb1 && _0x5b74de[_0x5225fe(0x1c6)][_0x5225fe(0x28b)](_0x247bb1))\n                                return _0x54deef;\n                            if (window[_0x5225fe(0x1b3)])\n                                window['siteproxyLog'](_0x1a87cd[_0x5225fe(0x13c)], _0x5b74de[_0x5225fe(0x15e)], _0x247bb1);\n                            if (_0x5b74de[_0x5225fe(0x157)] === _0x1a87cd['admSV'])\n                                return _0x54deef;\n                            const _0x4c6588 = proxy_real_protocol, _0x3a3b28 = proxy_real_host, _0x266d42 = _0x1a87cd[_0x5225fe(0x21c)](_0x1a87cd[_0x5225fe(0x266)](_0x5b74de[_0x5225fe(0x1c6)], _0x5b74de[_0x5225fe(0x103)]), _0x5b74de[_0x5225fe(0x23d)]), _0x4d44f4 = _0x1a87cd['fbFbt'](_0x3a3b28, _0x266d42), _0x318d9d = _0x1a87cd[_0x5225fe(0x135)](proxy_url_prefix + _0x4c6588, '/') + _0x4d44f4;\n                            if (window['siteproxyLog'])\n                                window[_0x5225fe(0x1b3)](_0x1a87cd['MYSGR'], _0x318d9d);\n                            return _0x318d9d;\n                        }\n                        if (this[_0x5225fe(0x123)](_0x5b74de['protocol']))\n                            return _0x54deef;\n                        let _0xa75dd2 = _0x5b74de[_0x5225fe(0x157)][_0x5225fe(0x284)](':', ''), _0x2df7ea = _0x5b74de['hostname'];\n                        const _0x2c9479 = _0x1a87cd['ItQGK'](_0xa75dd2, _0x1a87cd[_0x5225fe(0x2b9)]) ? '80' : _0x1a87cd[_0x5225fe(0x23c)];\n                        if (_0x222de8)\n                            _0x2df7ea += _0x1a87cd[_0x5225fe(0x16b)](':', _0x222de8);\n                        else\n                            _0x5b74de['port'] && _0x5b74de[_0x5225fe(0x318)] !== _0x2c9479 && (_0x2df7ea += _0x1a87cd[_0x5225fe(0x1bb)](':', _0x5b74de[_0x5225fe(0x318)]));\n                        let _0x53f00b = _0x1a87cd[_0x5225fe(0x217)](_0x1a87cd[_0x5225fe(0x21d)](_0x5b74de[_0x5225fe(0x1c6)], _0x5b74de[_0x5225fe(0x103)]), _0x5b74de[_0x5225fe(0x23d)]), _0xf2b8d2 = _0x1a87cd['bTfSX'](_0x2df7ea, _0x53f00b);\n                        const _0x132c1d = _0x1a87cd[_0x5225fe(0x28e)](_0x1a87cd['zGyoC'](_0x1a87cd[_0x5225fe(0x300)](proxy_url_prefix, _0xa75dd2), '/'), _0xf2b8d2);\n                        if (window['siteproxyLog'])\n                            window[_0x5225fe(0x1b3)](_0x1a87cd[_0x5225fe(0x2b6)], _0x132c1d);\n                        return _0x132c1d;\n                    } catch (_0x237d92) {\n                        return console['error'](_0x1a87cd[_0x5225fe(0x1cb)], _0x237d92), _0x1a87cd[_0x5225fe(0x2c8)](_0x5ba495, _0x54deef);\n                    }\n                }\n                [_0x5a6236(0x123)](_0x13d083) {\n                    const _0x22a2a5 = _0x5a6236;\n                    return [\n                        'blob:',\n                        _0x22a2a5(0x16f),\n                        'mailto:',\n                        '#',\n                        _0x22a2a5(0x2ac),\n                        _0x1a87cd[_0x22a2a5(0x305)],\n                        _0x22a2a5(0x2dc),\n                        _0x22a2a5(0x321),\n                        _0x1a87cd['kfHgx'],\n                        _0x1a87cd[_0x22a2a5(0x1fe)],\n                        _0x1a87cd[_0x22a2a5(0x1da)],\n                        'view-source:',\n                        _0x22a2a5(0x205),\n                        _0x1a87cd[_0x22a2a5(0x15b)],\n                        _0x22a2a5(0x1dc),\n                        _0x1a87cd[_0x22a2a5(0x242)]\n                    ][_0x22a2a5(0x258)](_0xf58274 => _0x13d083[_0x22a2a5(0x28b)](_0xf58274));\n                }\n                [_0x5a6236(0x25e)](_0x4a4bcd) {\n                    const _0x44f70e = _0x5a6236;\n                    try {\n                        const _0x35dbe0 = _0x4a4bcd;\n                        if (_0x4a4bcd && _0x1a87cd['fenDY'](typeof _0x4a4bcd, _0x1a87cd[_0x44f70e(0x251)]) && _0x4a4bcd[_0x44f70e(0x15e)] && _0x1a87cd['fenDY'](typeof _0x4a4bcd[_0x44f70e(0x15e)], 'string'))\n                            _0x4a4bcd = _0x4a4bcd[_0x44f70e(0x15e)];\n                        else\n                            _0x1a87cd['hpmIb'](_0x4a4bcd, URL) && (_0x4a4bcd = _0x4a4bcd[_0x44f70e(0x15e)]);\n                        if (typeof _0x4a4bcd !== _0x44f70e(0x147))\n                            return _0x35dbe0;\n                        if (window[_0x44f70e(0x1b3)])\n                            window[_0x44f70e(0x1b3)](_0x44f70e(0x24a), _0x4a4bcd);\n                        if (!_0x4a4bcd[_0x44f70e(0x28b)](proxy_url_prefix)) {\n                            try {\n                                const _0x40c8ee = new URL(_0x4a4bcd);\n                                if (_0x1a87cd['hUMIU'](_0x40c8ee['origin'], window['location']['origin'])) {\n                                    const _0x9f7e83 = _0x1a87cd[_0x44f70e(0x190)](_0x40c8ee[_0x44f70e(0x1c6)], _0x40c8ee['search']) + _0x40c8ee[_0x44f70e(0x23d)], _0x53a2da = _0x1a87cd['uOagl'](_0x1a87cd[_0x44f70e(0x1ba)](_0x1a87cd[_0x44f70e(0x2d8)](proxy_real_protocol, _0x44f70e(0x230)), proxy_real_host), _0x9f7e83);\n                                    if (window[_0x44f70e(0x1b3)])\n                                        window[_0x44f70e(0x1b3)](_0x44f70e(0x124), _0x53a2da);\n                                    return _0x53a2da;\n                                }\n                            } catch (_0x27af14) {\n                                console[_0x44f70e(0x2a8)](_0x44f70e(0x104), _0x27af14);\n                            }\n                            return _0x4a4bcd;\n                        }\n                        let _0x58c6c7 = _0x4a4bcd[_0x44f70e(0x284)](proxy_url_prefix, ''), _0x306cba = config_token_prefix ? config_token_prefix[_0x44f70e(0x211)](0x1) : '';\n                        if (window[_0x44f70e(0x1b3)])\n                            window[_0x44f70e(0x1b3)](_0x1a87cd[_0x44f70e(0x1d4)], proxy_url_prefix, _0x1a87cd[_0x44f70e(0x2f6)], _0x306cba);\n                        while (!![]) {\n                            if (_0x58c6c7['startsWith'](_0x306cba))\n                                _0x58c6c7 = _0x58c6c7[_0x44f70e(0x211)](_0x306cba[_0x44f70e(0x2e9)]);\n                            else {\n                                if (_0x58c6c7[_0x44f70e(0x28b)]('/' + _0x306cba))\n                                    _0x58c6c7 = _0x58c6c7[_0x44f70e(0x211)](_0x1a87cd['JwWzm'](0x1, _0x306cba[_0x44f70e(0x2e9)]));\n                                else\n                                    break;\n                            }\n                        }\n                        _0x58c6c7 = _0x58c6c7[_0x44f70e(0x284)](new RegExp(_0x44f70e(0x281), ''), '');\n                        if (window['siteproxyLog'])\n                            window[_0x44f70e(0x1b3)](_0x44f70e(0x29a), _0x58c6c7);\n                        if (!_0x58c6c7)\n                            return _0x1a87cd['fbYxl'](_0x1a87cd[_0x44f70e(0x275)](_0x1a87cd[_0x44f70e(0x215)](proxy_real_protocol, _0x44f70e(0x230)), proxy_real_host), '/');\n                        const _0x12dbae = _0x58c6c7[_0x44f70e(0x28a)](new RegExp(_0x1a87cd[_0x44f70e(0x2d4)], 'i'));\n                        if (_0x12dbae) {\n                            const _0x3b7717 = _0x12dbae[0x1][_0x44f70e(0x311)](), _0x50bc9d = _0x58c6c7[_0x44f70e(0x211)](_0x12dbae[0x0][_0x44f70e(0x2e9)]), _0xefbdd9 = _0x1a87cd['rPxDv'](_0x1a87cd['oIXTW'](_0x3b7717, _0x44f70e(0x230)), _0x50bc9d);\n                            try {\n                                const _0x2927f9 = new URL(_0xefbdd9);\n                                if (_0x1a87cd['AbWgL'](_0x2927f9[_0x44f70e(0x10a)], _0x44f70e(0x19c)))\n                                    return _0x4a4bcd;\n                                const _0x348c28 = _0x2927f9[_0x44f70e(0x15e)];\n                                if (window[_0x44f70e(0x1b3)])\n                                    window['siteproxyLog'](_0x1a87cd['XgpSw'], _0x348c28);\n                                return _0x348c28;\n                            } catch (_0x2cb4af) {\n                                console[_0x44f70e(0x2a8)]('URL unrewrite inner error:', _0x2cb4af);\n                                const _0x5d2ce0 = _0x1a87cd[_0x44f70e(0x23a)](_0x50bc9d[_0x44f70e(0x268)]('/'), -0x1) ? _0x50bc9d['indexOf']('/') : _0x50bc9d[_0x44f70e(0x2e9)], _0x1dd906 = _0x50bc9d[_0x44f70e(0x211)](0x0, _0x5d2ce0), _0x359ec8 = _0x1a87cd['TJznu'](_0x5d2ce0, _0x50bc9d[_0x44f70e(0x2e9)]) ? _0x1a87cd[_0x44f70e(0x2ea)]('/', _0x50bc9d[_0x44f70e(0x211)](_0x5d2ce0)[_0x44f70e(0x284)](new RegExp(_0x1a87cd['KGfcM'], ''), '')) : '', _0x47f758 = _0x1a87cd['QFpJN'](_0x3b7717 + _0x1a87cd[_0x44f70e(0x2a9)] + _0x1dd906, _0x359ec8);\n                                if (window['siteproxyLog'])\n                                    window[_0x44f70e(0x1b3)](_0x1a87cd[_0x44f70e(0x2c4)], _0x47f758);\n                                return _0x47f758;\n                            }\n                        } else {\n                            const _0x15ca91 = '/' + _0x58c6c7[_0x44f70e(0x284)](new RegExp(_0x1a87cd['KGfcM'], ''), ''), _0xac3145 = _0x1a87cd['vGVRk'](_0x1a87cd[_0x44f70e(0x301)](proxy_real_protocol, _0x1a87cd[_0x44f70e(0x2a9)]), proxy_real_host) + _0x15ca91;\n                            if (window[_0x44f70e(0x1b3)])\n                                window[_0x44f70e(0x1b3)](_0x1a87cd[_0x44f70e(0x119)], _0xac3145);\n                            return _0xac3145;\n                        }\n                    } catch (_0x34ee82) {\n                        return console[_0x44f70e(0x2a8)](_0x1a87cd['hBEVj'], _0x34ee82), _0x1a87cd[_0x44f70e(0x317)](_0x1982db, _0x4a4bcd);\n                    }\n                }\n            }\n            window[_0x5a6236(0x1e4)] = new _0x1326cf();\n            function _0x5777c6(_0x1225a6) {\n                return new _0x1326cf()['unrewrite'](_0x1225a6)['split']('/')[0x2] || proxy_real_host;\n            }\n            window[_0x5a6236(0x237)] = _0x5777c6;\n            function _0x4936cc(_0x14561f) {\n                const _0xfbdc2a = _0x5a6236;\n                if (!_0x14561f || _0x1a87cd[_0xfbdc2a(0x23a)](typeof _0x14561f, _0xfbdc2a(0x147)))\n                    return '/';\n                if (!_0x14561f[_0xfbdc2a(0x28b)](proxy_url_prefix))\n                    return '/';\n                try {\n                    const _0x234cff = window[_0xfbdc2a(0x1e4)][_0xfbdc2a(0x25e)](_0x14561f);\n                    if (_0x234cff[_0xfbdc2a(0x28b)](proxy_url_prefix))\n                        return '/';\n                    const _0x58961d = new URL(_0x234cff);\n                    return _0x58961d[_0xfbdc2a(0x1c6)] || '/';\n                } catch (_0x413508) {\n                    console[_0xfbdc2a(0x2a8)](_0x1a87cd[_0xfbdc2a(0x120)], _0x413508);\n                    const _0x406011 = _0x14561f[_0xfbdc2a(0x211)](proxy_url_prefix[_0xfbdc2a(0x2e9)]), _0x1030c4 = _0x406011['split']('/');\n                    if (_0x1a87cd['QfOAu'](_0x1030c4[_0xfbdc2a(0x2e9)], 0x2)) {\n                        const _0x2c816b = _0x1030c4['slice'](0x2)[_0xfbdc2a(0x1ae)]('/')['replace'](new RegExp(_0xfbdc2a(0x281), ''), '');\n                        return _0x1a87cd[_0xfbdc2a(0x26b)]('/', _0x2c816b);\n                    }\n                    return '/';\n                }\n            }\n            window[_0x5a6236(0x2fc)] = _0x4936cc;\n            function _0x57181e(_0x56d127) {\n                const _0x4c1c20 = _0x5a6236;\n                if (!_0x56d127 || _0x1a87cd[_0x4c1c20(0x23a)](typeof _0x56d127, _0x1a87cd[_0x4c1c20(0x1fd)]))\n                    return proxy_real_protocol;\n                const _0x320462 = new _0x1326cf()[_0x4c1c20(0x25e)](_0x56d127);\n                if (_0x320462['startsWith'](proxy_url_prefix))\n                    return proxy_real_protocol;\n                try {\n                    return new URL(_0x320462)[_0x4c1c20(0x157)][_0x4c1c20(0x284)](':', '');\n                } catch (_0x1b1357) {\n                    return console[_0x4c1c20(0x2a8)](_0x1a87cd[_0x4c1c20(0x2f7)], _0x1b1357), proxy_real_protocol;\n                }\n            }\n            window[_0x5a6236(0x16c)] = _0x57181e;\n            function _0x45639c(_0x3e7837, _0x3c1fb8) {\n                const _0x115cb9 = _0x5a6236;\n                if (!_0x3e7837 || _0x1a87cd[_0x115cb9(0x23a)](typeof _0x3e7837, _0x1a87cd[_0x115cb9(0x1fd)]))\n                    return _0x3e7837;\n                if (!_0x3e7837[_0x115cb9(0x28b)](proxy_url_prefix))\n                    return _0x3e7837;\n                try {\n                    const _0x3030a0 = window[_0x115cb9(0x1e4)]['unrewrite'](_0x3e7837), _0x1a845d = new URL(_0x3030a0);\n                    if (_0x3c1fb8) {\n                        if (_0x1a87cd[_0x115cb9(0x2f1)](_0x3c1fb8, _0x1a87cd[_0x115cb9(0x2b9)]) && _0x3c1fb8 !== 'https')\n                            throw new Error(_0x115cb9(0x1db) + _0x3c1fb8);\n                        _0x1a845d['protocol'] = _0x3c1fb8 + ':';\n                    }\n                    const _0x2d2de6 = _0x1a87cd[_0x115cb9(0x18e)](_0x1a845d[_0x115cb9(0x10a)], _0x1a845d[_0x115cb9(0x318)] ? _0x1a87cd['gFByc'](':', _0x1a845d['port']) : ''), _0x1021a2 = _0x1a87cd[_0x115cb9(0x275)](_0x1a845d[_0x115cb9(0x1c6)], _0x1a845d['search']) + _0x1a845d['hash'];\n                    return _0x1a87cd['jwGKS'](_0x1a87cd[_0x115cb9(0x26f)](_0x1a87cd[_0x115cb9(0x138)](proxy_url_prefix, _0x1a845d[_0x115cb9(0x157)]['replace'](':', '')), '/') + _0x2d2de6, _0x1021a2);\n                } catch (_0x5956a8) {\n                    console['error'](_0x1a87cd['mOync'], _0x5956a8);\n                    const _0x512f55 = _0x3e7837[_0x115cb9(0x211)](proxy_url_prefix[_0x115cb9(0x2e9)]), _0x5068fb = _0x512f55[_0x115cb9(0x189)]('/');\n                    if (_0x5068fb[_0x115cb9(0x2e9)] >= 0x1)\n                        return _0x5068fb[0x0] = _0x3c1fb8 || _0x5068fb[0x0], _0x1a87cd[_0x115cb9(0x1c0)](proxy_url_prefix, _0x5068fb[_0x115cb9(0x1ae)]('/'));\n                    return _0x3e7837;\n                }\n            }\n            window[_0x5a6236(0xf5)] = _0x45639c;\n        }()), (function () {\n            const _0x55e87c = _0x1930c4, _0x3c0d96 = {\n                    'ExDiu': 'window.open trap error:',\n                    'PErzi': _0x55e87c(0x288),\n                    'RRLod': _0x55e87c(0x17a),\n                    'ewOgQ': _0x55e87c(0x17d),\n                    'MxCRe': _0x55e87c(0x2b2),\n                    'OlHCb': _0x55e87c(0x1c4),\n                    'elLDJ': _0x55e87c(0x13f),\n                    'DxFSR': _0x55e87c(0x27b),\n                    'nkOVI': function (_0x4b58e2, _0x491270) {\n                        return _0x4b58e2 instanceof _0x491270;\n                    },\n                    'FoyiF': function (_0x4b59bd, _0x51021d) {\n                        return _0x4b59bd === _0x51021d;\n                    },\n                    'CBTdU': function (_0x5effbc, _0x7c28bb) {\n                        return _0x5effbc(_0x7c28bb);\n                    },\n                    'neGuN': _0x55e87c(0x12b),\n                    'YXlTN': _0x55e87c(0x1f9),\n                    'pmsGy': function (_0x3a345c, _0x3b0e07) {\n                        return _0x3a345c === _0x3b0e07;\n                    },\n                    'neeZu': _0x55e87c(0xfb),\n                    'iopQx': '[LocationWrapper.assign] rewritten url:',\n                    'xrVQV': function (_0x2d47d9, _0xefb359) {\n                        return _0x2d47d9(_0xefb359);\n                    },\n                    'DjDDZ': '[LocationWrapper.replace] rejecting non-URL value:',\n                    'ihWQN': _0x55e87c(0x1cd),\n                    'zcocH': _0x55e87c(0xf6),\n                    'wbqUH': '[LocationWrapper.set href] rejecting non-URL value:',\n                    'cOsYW': function (_0x304a2b, _0x4c02dd) {\n                        return _0x304a2b + _0x4c02dd;\n                    },\n                    'uGgGc': _0x55e87c(0x230),\n                    'KRigX': function (_0x72c2ca, _0x59c7f3, _0x2c1b32) {\n                        return _0x72c2ca(_0x59c7f3, _0x2c1b32);\n                    },\n                    'pZzoi': function (_0x1ebd4a, _0x2228b5) {\n                        return _0x1ebd4a !== _0x2228b5;\n                    },\n                    'augGP': _0x55e87c(0x273),\n                    'axmiV': function (_0x331bf3, _0x447a9d) {\n                        return _0x331bf3(_0x447a9d);\n                    },\n                    'bQZfV': _0x55e87c(0x2b0),\n                    'gIgXC': '[window.___location setter] rewritten:',\n                    'tCEZs': function (_0x569a48, _0x16af75) {\n                        return _0x569a48 === _0x16af75;\n                    },\n                    'ByIgX': function (_0x4c802a, _0x555f20) {\n                        return _0x4c802a(_0x555f20);\n                    },\n                    'wsGjh': _0x55e87c(0x259),\n                    'lCuhw': _0x55e87c(0x22f),\n                    'GmKZj': function (_0x4c260a, _0x1f964f) {\n                        return _0x4c260a === _0x1f964f;\n                    },\n                    'ydvWG': function (_0x287333, _0xc58408) {\n                        return _0x287333 in _0xc58408;\n                    },\n                    'DCnuL': _0x55e87c(0x1dd),\n                    'cTEgx': function (_0x5321f0, _0x585bc1) {\n                        return _0x5321f0(_0x585bc1);\n                    },\n                    'AvmbX': _0x55e87c(0x2e7),\n                    'JQldp': _0x55e87c(0x1b2),\n                    'GKugG': _0x55e87c(0x2c5),\n                    'MSVdI': _0x55e87c(0x139),\n                    'Dqrzm': 'src',\n                    'Mykyl': 'siteproxy-target-protocol',\n                    'JVsIN': _0x55e87c(0x14f),\n                    'MwHai': _0x55e87c(0x2f9),\n                    'UzgyH': _0x55e87c(0x24d),\n                    'NRmQc': function (_0x6338a5, _0x453dd4) {\n                        return _0x6338a5 instanceof _0x453dd4;\n                    },\n                    'PshQG': _0x55e87c(0x147),\n                    'qiwLd': function (_0x4c17d8, _0x28d102) {\n                        return _0x4c17d8 !== _0x28d102;\n                    },\n                    'xIWJT': 'none',\n                    'QEDtY': _0x55e87c(0x264),\n                    'YTRLp': _0x55e87c(0x2d3),\n                    'zOLxl': _0x55e87c(0x30e),\n                    'wryZR': _0x55e87c(0x29c),\n                    'cYwzE': 'URL',\n                    'KyHxO': _0x55e87c(0x22c),\n                    'xrAkD': _0x55e87c(0x13d),\n                    'ChEce': _0x55e87c(0x216),\n                    'Agiwu': _0x55e87c(0x1af),\n                    'OKyNy': _0x55e87c(0x316),\n                    'YoIkQ': _0x55e87c(0x235),\n                    'zBOQh': _0x55e87c(0x143),\n                    'TebcM': _0x55e87c(0x1cc)\n                };\n            var _0x59b34d = window[_0x55e87c(0x248)];\n            window[_0x55e87c(0x248)] = new Proxy(_0x59b34d, {\n                'apply'(_0x5a4470, _0x1a0c77, _0x4027f4) {\n                    const _0x1ced49 = _0x55e87c;\n                    try {\n                        let [_0xdc30d7, _0x48af9e, _0x1f105d] = _0x4027f4;\n                        return _0x4027f4[0x0] = window[_0x1ced49(0x1e4)]['rewrite'](_0xdc30d7), Reflect['apply'](_0x5a4470, _0x1a0c77, _0x4027f4);\n                    } catch (_0x4c707a) {\n                        return console[_0x1ced49(0x2a8)](_0x3c0d96[_0x1ced49(0x13b)], _0x4c707a), _0x59b34d[_0x1ced49(0x1ca)](_0x1a0c77, _0x4027f4);\n                    }\n                }\n            });\n            var _0x5cce94 = History[_0x55e87c(0x1f5)]['pushState'], _0x5829e6 = History[_0x55e87c(0x1f5)]['replaceState'];\n            if (window['siteproxyLog'])\n                window[_0x55e87c(0x1b3)](_0x3c0d96[_0x55e87c(0x107)]);\n            console['log'](_0x3c0d96[_0x55e87c(0x107)]);\n            _0x3c0d96[_0x55e87c(0x28d)](window['self'], window[_0x55e87c(0x1ac)]) && (History['prototype'][_0x55e87c(0x108)] = function (_0x521ec6, _0x38fd7e, _0xa699bb) {\n                const _0x22c74f = _0x55e87c;\n                try {\n                    const _0x38780b = _0x3c0d96[_0x22c74f(0x262)]['split']('|');\n                    let _0x3396c0 = 0x0;\n                    while (!![]) {\n                        switch (_0x38780b[_0x3396c0++]) {\n                        case '0':\n                            _0xa699bb = window[_0x22c74f(0x1e4)][_0x22c74f(0x218)](_0xa699bb);\n                            continue;\n                        case '1':\n                            if (window[_0x22c74f(0x1b3)])\n                                window[_0x22c74f(0x1b3)](_0x3c0d96['RRLod'], _0xa699bb);\n                            continue;\n                        case '2':\n                            return _0x5cce94[_0x22c74f(0x30f)](this, _0x521ec6, _0x38fd7e, _0xa699bb);\n                        case '3':\n                            if (window['siteproxyLog'])\n                                window[_0x22c74f(0x1b3)](_0x3c0d96[_0x22c74f(0x28f)], _0xa699bb);\n                            continue;\n                        case '4':\n                            console[_0x22c74f(0x134)](_0x3c0d96[_0x22c74f(0x279)], _0xa699bb);\n                            continue;\n                        }\n                        break;\n                    }\n                } catch (_0x525af4) {\n                    return console[_0x22c74f(0x2a8)](_0x22c74f(0x1e0), _0x525af4), _0x5cce94[_0x22c74f(0x30f)](this, _0x521ec6, _0x38fd7e, _0xa699bb);\n                }\n            }, History[_0x55e87c(0x1f5)][_0x55e87c(0x11e)] = function (_0x5a1bd7, _0x19003c, _0x51e45d) {\n                const _0x333a68 = _0x55e87c;\n                try {\n                    const _0x181881 = _0x3c0d96[_0x333a68(0x12c)][_0x333a68(0x189)]('|');\n                    let _0x5d7c2 = 0x0;\n                    while (!![]) {\n                        switch (_0x181881[_0x5d7c2++]) {\n                        case '0':\n                            if (window[_0x333a68(0x1b3)])\n                                window[_0x333a68(0x1b3)](_0x333a68(0x177), _0x51e45d);\n                            continue;\n                        case '1':\n                            console[_0x333a68(0x134)](_0x3c0d96[_0x333a68(0x274)], _0x51e45d);\n                            continue;\n                        case '2':\n                            if (window[_0x333a68(0x1b3)])\n                                window[_0x333a68(0x1b3)]('[replaceState] rewritten url:', _0x51e45d);\n                            continue;\n                        case '3':\n                            return _0x5829e6['call'](this, _0x5a1bd7, _0x19003c, _0x51e45d);\n                        case '4':\n                            _0x51e45d = window[_0x333a68(0x1e4)][_0x333a68(0x218)](_0x51e45d);\n                            continue;\n                        }\n                        break;\n                    }\n                } catch (_0x5bcb98) {\n                    return console['error'](_0x3c0d96['DxFSR'], _0x5bcb98), _0x5829e6['call'](this, _0x5a1bd7, _0x19003c, _0x51e45d);\n                }\n            });\n            History[_0x55e87c(0x1f5)][_0x55e87c(0x243)] = _0x5cce94, History[_0x55e87c(0x1f5)][_0x55e87c(0x2db)] = _0x5829e6;\n            const _0x25ea95 = window[_0x55e87c(0x16d)];\n            function _0x5621ff(_0x170492) {\n                const _0x56b75c = _0x55e87c;\n                if (_0x170492 == null)\n                    return !![];\n                if (typeof _0x170492 === _0x56b75c(0x307) && !_0x3c0d96[_0x56b75c(0x2cf)](_0x170492, URL))\n                    try {\n                        return _0x3c0d96[_0x56b75c(0xfe)](_0x3c0d96['CBTdU'](String, _0x170492), _0x3c0d96[_0x56b75c(0x21b)]);\n                    } catch (_0x2c7a24) {\n                        return !![];\n                    }\n                if (typeof _0x170492 === _0x56b75c(0x147) && (_0x3c0d96['FoyiF'](_0x170492, _0x56b75c(0x12b)) || _0x3c0d96['FoyiF'](_0x170492, _0x3c0d96[_0x56b75c(0x152)]) || _0x3c0d96[_0x56b75c(0x246)](_0x170492, _0x3c0d96['neeZu'])))\n                    return !![];\n                return ![];\n            }\n            class _0x1bba93 {\n                constructor(_0x4fdf83) {\n                    const _0x5125df = _0x55e87c;\n                    this[_0x5125df(0x214)] = _0x4fdf83;\n                }\n                ['toString']() {\n                    const _0x12fefa = _0x55e87c;\n                    return window['urlMeta'][_0x12fefa(0x25e)](this[_0x12fefa(0x214)][_0x12fefa(0x15e)]);\n                }\n                [_0x55e87c(0x228)](_0x462091) {\n                    const _0x49315c = _0x55e87c;\n                    if (_0x5621ff(_0x462091)) {\n                        console[_0x49315c(0x269)](_0x49315c(0x1b7), _0x462091);\n                        return;\n                    }\n                    if (window['siteproxyLog'])\n                        window[_0x49315c(0x1b3)](_0x49315c(0x31b), _0x462091);\n                    const _0x224924 = window[_0x49315c(0x1e4)][_0x49315c(0x218)](_0x462091);\n                    if (window['siteproxyLog'])\n                        window['siteproxyLog'](_0x3c0d96[_0x49315c(0x229)], _0x224924);\n                    if (_0x224924 === this[_0x49315c(0x214)]['href'])\n                        return;\n                    this[_0x49315c(0x214)][_0x49315c(0x228)](_0x224924);\n                }\n                ['reload'](_0xa2b8c = ![]) {\n                    const _0x3fe238 = _0x55e87c;\n                    this[_0x3fe238(0x214)][_0x3fe238(0x314)](_0xa2b8c);\n                }\n                [_0x55e87c(0x284)](_0x3aaed5) {\n                    const _0x13a76b = _0x55e87c;\n                    if (_0x3c0d96['xrVQV'](_0x5621ff, _0x3aaed5)) {\n                        console['warn'](_0x3c0d96[_0x13a76b(0x206)], _0x3aaed5);\n                        return;\n                    }\n                    if (window[_0x13a76b(0x1b3)])\n                        window[_0x13a76b(0x1b3)](_0x3c0d96[_0x13a76b(0x287)], _0x3aaed5);\n                    const _0x20db8d = window[_0x13a76b(0x1e4)][_0x13a76b(0x218)](_0x3aaed5);\n                    if (window['siteproxyLog'])\n                        window[_0x13a76b(0x1b3)](_0x3c0d96['zcocH'], _0x20db8d);\n                    if (_0x20db8d === this[_0x13a76b(0x214)][_0x13a76b(0x15e)])\n                        return;\n                    this[_0x13a76b(0x214)][_0x13a76b(0x284)](_0x20db8d);\n                }\n                get [_0x55e87c(0x15e)]() {\n                    const _0x580b27 = _0x55e87c, _0xde523b = window['urlMeta'][_0x580b27(0x25e)](this[_0x580b27(0x214)]['href']);\n                    return _0xde523b;\n                }\n                set [_0x55e87c(0x15e)](_0x346224) {\n                    const _0x100c6e = _0x55e87c;\n                    if (_0x5621ff(_0x346224)) {\n                        console[_0x100c6e(0x269)](_0x3c0d96[_0x100c6e(0x170)], _0x346224);\n                        return;\n                    }\n                    if (window[_0x100c6e(0x1b3)])\n                        window['siteproxyLog'](_0x100c6e(0x210), _0x346224);\n                    const _0x336b6b = window[_0x100c6e(0x1e4)][_0x100c6e(0x218)](_0x346224);\n                    if (window['siteproxyLog'])\n                        window['siteproxyLog'](_0x100c6e(0x29f), _0x336b6b);\n                    if (_0x3c0d96['pmsGy'](_0x336b6b, this[_0x100c6e(0x214)][_0x100c6e(0x15e)]))\n                        return;\n                    this[_0x100c6e(0x214)][_0x100c6e(0x15e)] = _0x336b6b;\n                }\n                get [_0x55e87c(0x150)]() {\n                    const _0x4bdfb6 = _0x55e87c;\n                    return _0x3c0d96['cOsYW'](proxy_real_protocol + _0x3c0d96[_0x4bdfb6(0x131)], proxy_real_host);\n                }\n                get ['protocol']() {\n                    const _0x51f631 = _0x55e87c;\n                    return getProtocolFromProxyPrefixedURL(this['originalLocation'][_0x51f631(0x15e)]) + ':';\n                }\n                set [_0x55e87c(0x157)](_0x584f10) {\n                    const _0x2eec79 = _0x55e87c, _0x418829 = _0x584f10[_0x2eec79(0x284)](':', ''), _0x56ae21 = _0x3c0d96['KRigX'](setProtocolFromProxyPrefixedURL, this[_0x2eec79(0x214)][_0x2eec79(0x15e)], _0x418829);\n                    if (_0x3c0d96[_0x2eec79(0x246)](_0x56ae21, this[_0x2eec79(0x214)][_0x2eec79(0x15e)]))\n                        return;\n                    this[_0x2eec79(0x214)][_0x2eec79(0x15e)] = _0x56ae21;\n                }\n                get [_0x55e87c(0x1c6)]() {\n                    const _0x32cee7 = _0x55e87c;\n                    return getPathnameFromProxyPrefixedURL(this[_0x32cee7(0x214)][_0x32cee7(0x15e)]);\n                }\n                set [_0x55e87c(0x1c6)](_0x462131) {\n                }\n                get [_0x55e87c(0x164)]() {\n                    const _0x52958d = _0x55e87c;\n                    return _0x3c0d96[_0x52958d(0x151)](getHostFromProxyPrefixedURL, this[_0x52958d(0x214)][_0x52958d(0x15e)]);\n                }\n                set [_0x55e87c(0x164)](_0x7e250f) {\n                }\n                get [_0x55e87c(0x103)]() {\n                    const _0x5cfa1c = _0x55e87c;\n                    return this['originalLocation'][_0x5cfa1c(0x103)];\n                }\n                set [_0x55e87c(0x103)](_0x5c65ca) {\n                }\n                get [_0x55e87c(0x23d)]() {\n                    const _0x34c231 = _0x55e87c;\n                    return this[_0x34c231(0x214)][_0x34c231(0x23d)];\n                }\n                set [_0x55e87c(0x23d)](_0x58c100) {\n                    const _0x166b83 = _0x55e87c;\n                    this[_0x166b83(0x214)][_0x166b83(0x23d)] = _0x58c100;\n                }\n                get ['hostname']() {\n                    const _0x81bba7 = _0x55e87c;\n                    let _0x1a6ea2 = _0x3c0d96[_0x81bba7(0x151)](getHostFromProxyPrefixedURL, this[_0x81bba7(0x214)]['href']);\n                    const _0x3e497b = _0x1a6ea2[_0x81bba7(0x268)](':');\n                    return _0x3c0d96[_0x81bba7(0x168)](_0x3e497b, -0x1) && (_0x1a6ea2 = _0x1a6ea2[_0x81bba7(0x211)](0x0, _0x3e497b)), _0x1a6ea2;\n                }\n                set [_0x55e87c(0x10a)](_0x4909ed) {\n                }\n                get [_0x55e87c(0x318)]() {\n                    const _0x1b13a8 = _0x55e87c, _0x19b040 = getHostFromProxyPrefixedURL(this['originalLocation'][_0x1b13a8(0x15e)]), _0x3ea3a5 = _0x19b040[_0x1b13a8(0x268)](':');\n                    let _0x567797 = '';\n                    return _0x3ea3a5 !== -0x1 && (_0x567797 = _0x19b040[_0x1b13a8(0x211)](_0x3ea3a5 + 0x1)), _0x567797;\n                }\n                set ['port'](_0x11c382) {\n                }\n            }\n            let _0x3f98f9 = new _0x1bba93(_0x25ea95);\n            if (window[_0x55e87c(0x1b3)])\n                window[_0x55e87c(0x1b3)]('[siteproxy] Creating LocationWrapper and assigning to window.___location');\n            console[_0x55e87c(0x134)](_0x55e87c(0x249)), window['___location'] = _0x3f98f9, document[_0x55e87c(0x29c)] = window[_0x55e87c(0x29c)], Object['defineProperty'](window, _0x3c0d96[_0x55e87c(0x2bd)], {\n                'set': function (_0x42b12f) {\n                    const _0x22d957 = _0x55e87c;\n                    if (_0x5621ff(_0x42b12f)) {\n                        console[_0x22d957(0x269)](_0x3c0d96['augGP'], _0x42b12f);\n                        return;\n                    }\n                    const _0xd6cc37 = _0x3c0d96[_0x22d957(0x271)](String, _0x42b12f);\n                    if (window[_0x22d957(0x1b3)])\n                        window[_0x22d957(0x1b3)](_0x3c0d96['bQZfV'], _0xd6cc37);\n                    const _0x248752 = window[_0x22d957(0x1e4)]['rewrite'](_0xd6cc37);\n                    if (window[_0x22d957(0x1b3)])\n                        window[_0x22d957(0x1b3)](_0x3c0d96[_0x22d957(0x23b)], _0x248752);\n                    if (_0x3c0d96[_0x22d957(0x28d)](_0x248752, _0x3f98f9[_0x22d957(0x214)][_0x22d957(0x15e)]))\n                        return;\n                    _0x3f98f9[_0x22d957(0x214)][_0x22d957(0x15e)] = _0x248752;\n                },\n                'get': function () {\n                    return _0x3f98f9;\n                },\n                'configurable': !![]\n            }), Object[_0x55e87c(0x2d5)](document, _0x3c0d96[_0x55e87c(0x2bd)], {\n                'set': function (_0x3798f3) {\n                    const _0x3a14bf = _0x55e87c;\n                    if (_0x3c0d96[_0x3a14bf(0x1e9)](_0x5621ff, _0x3798f3)) {\n                        console[_0x3a14bf(0x269)](_0x3a14bf(0x14c), _0x3798f3);\n                        return;\n                    }\n                    const _0x48c1c9 = String(_0x3798f3);\n                    if (window['siteproxyLog'])\n                        window['siteproxyLog'](_0x3c0d96['wsGjh'], _0x48c1c9);\n                    const _0x287202 = window[_0x3a14bf(0x1e4)][_0x3a14bf(0x218)](_0x48c1c9);\n                    if (window['siteproxyLog'])\n                        window[_0x3a14bf(0x1b3)](_0x3c0d96[_0x3a14bf(0x324)], _0x287202);\n                    if (_0x3c0d96[_0x3a14bf(0x1be)](_0x287202, _0x3f98f9['originalLocation'][_0x3a14bf(0x15e)]))\n                        return;\n                    _0x3f98f9[_0x3a14bf(0x214)]['href'] = _0x287202;\n                },\n                'get': function () {\n                    return _0x3f98f9;\n                },\n                'configurable': !![]\n            }), window[_0x55e87c(0x29c)] = new Proxy(window['___location'], {\n                'get'(_0x457e26, _0x48fae6) {\n                    const _0x3f3878 = _0x55e87c;\n                    if (_0x3c0d96['ydvWG'](_0x48fae6, _0x457e26)) {\n                        const _0x4c0517 = _0x457e26[_0x48fae6];\n                        return _0x3c0d96[_0x3f3878(0x28d)](typeof _0x4c0517, _0x3c0d96[_0x3f3878(0x126)]) ? _0x4c0517['bind'](_0x457e26) : _0x4c0517;\n                    }\n                    return _0x25ea95[_0x48fae6];\n                },\n                'set'(_0x23dd3f, _0x326762, _0x156bfc) {\n                    if (_0x326762 in _0x23dd3f)\n                        return _0x23dd3f[_0x326762] = _0x156bfc, !![];\n                    return _0x25ea95[_0x326762] = _0x156bfc, !![];\n                }\n            }), Object['defineProperty'](document, _0x3c0d96[_0x55e87c(0x153)], {\n                'get'() {\n                    const _0x26b718 = _0x55e87c;\n                    return window[_0x26b718(0x29c)][_0x26b718(0x15e)];\n                },\n                'set'(_0x41598a) {\n                    const _0x2c749c = _0x55e87c;\n                    window[_0x2c749c(0x29c)][_0x2c749c(0x15e)] = window[_0x2c749c(0x1e4)][_0x2c749c(0x218)](_0x41598a);\n                },\n                'configurable': !![]\n            });\n            try {\n                delete document[_0x55e87c(0x22c)], Object[_0x55e87c(0x2d5)](document, _0x3c0d96[_0x55e87c(0x2e4)], {\n                    'get': function () {\n                        const _0x27f12e = _0x55e87c;\n                        return _0x3c0d96[_0x27f12e(0x24e)](getHostFromProxyPrefixedURL, document[_0x27f12e(0x22d)]);\n                    },\n                    'set': function (_0x554905) {\n                    },\n                    'configurable': !![]\n                });\n            } catch (_0x1f93cf) {\n                console[_0x55e87c(0x269)](_0x55e87c(0x19e), _0x1f93cf);\n            }\n            try {\n                Object['defineProperty'](document, _0x55e87c(0x232), {\n                    'get': function () {\n                        const _0x2e2092 = _0x55e87c;\n                        return _0x3c0d96[_0x2e2092(0x1e9)](getHostFromProxyPrefixedURL, document[_0x2e2092(0x22d)]);\n                    },\n                    'set': function (_0x13914b) {\n                    },\n                    'configurable': !![]\n                });\n            } catch (_0x3c27c4) {\n                console[_0x55e87c(0x269)](_0x55e87c(0x2bb), _0x3c27c4);\n            }\n            try {\n                delete navigator['___serviceWorker'], Object[_0x55e87c(0x2d5)](navigator, _0x3c0d96[_0x55e87c(0x2c0)], {\n                    'value': ((() => {\n                        const _0x41820e = _0x55e87c, _0x433400 = new DOMException(_0x3c0d96['AvmbX'], _0x3c0d96['JQldp']), _0x1d256e = new Promise((_0x393ff0, _0xd0496f) => {\n                            });\n                        _0x1d256e[_0x41820e(0x17f)](() => {\n                        });\n                        var _0x2271f8 = {};\n                        const _0x15fc78 = {\n                            'controller': null,\n                            'ready': _0x1d256e,\n                            'onmessage': null,\n                            'oncontrollerchange': null,\n                            'register': function (_0x2c4380, _0x10726f) {\n                                const _0xd14705 = _0x41820e;\n                                return Promise[_0xd14705(0x188)](_0x433400);\n                            },\n                            'getRegistrations': function () {\n                                const _0x21e032 = _0x41820e;\n                                return Promise[_0x21e032(0xf3)]([]);\n                            },\n                            'addEventListener': function (_0x30ced9, _0xb7237c, _0x2bce43) {\n                            },\n                            'removeEventListener': function (_0x22053c, _0x3f2b59, _0x44f3dc) {\n                            },\n                            'dispatchEvent': function (_0x30ceb0) {\n                                return !![];\n                            }\n                        };\n                        return Object[_0x41820e(0x2d5)](_0x15fc78, _0x3c0d96[_0x41820e(0x306)], {\n                            'value': null,\n                            'writable': ![],\n                            'configurable': ![]\n                        }), _0x15fc78;\n                    })()),\n                    'writable': ![],\n                    'configurable': !![]\n                });\n            } catch (_0x2ff2b3) {\n                console[_0x55e87c(0x269)](_0x3c0d96['ChEce'], _0x2ff2b3);\n            }\n            try {\n                delete document[_0x55e87c(0x1af)], Object[_0x55e87c(0x2d5)](document, _0x3c0d96[_0x55e87c(0x265)], {\n                    'value': function () {\n                        const _0x5ae521 = _0x55e87c;\n                        return Promise[_0x5ae521(0x188)](new DOMException(_0x3c0d96['MSVdI'], _0x3c0d96[_0x5ae521(0x31d)]));\n                    },\n                    'writable': ![],\n                    'configurable': !![]\n                });\n            } catch (_0x334526) {\n                console[_0x55e87c(0x269)](_0x3c0d96['OKyNy'], _0x334526);\n            }\n            [\n                _0x3c0d96[_0x55e87c(0x11a)],\n                _0x3c0d96[_0x55e87c(0x113)],\n                _0x3c0d96['TebcM']\n            ][_0x55e87c(0x2d2)](_0x41c413 => {\n                const _0x47d1a0 = _0x55e87c, _0x4e3931 = window[_0x41c413]?.[_0x47d1a0(0x1f5)];\n                if (_0x4e3931) {\n                    const _0x19b763 = Object['getOwnPropertyDescriptor'](_0x4e3931, _0x3c0d96[_0x47d1a0(0x1eb)]);\n                    _0x19b763 && _0x19b763[_0x47d1a0(0x2f3)] && Object['defineProperty'](_0x4e3931, _0x47d1a0(0x304), {\n                        'get': _0x19b763[_0x47d1a0(0x19b)],\n                        'set': function (_0x1c4f16) {\n                            const _0x18ff91 = _0x47d1a0, _0x341781 = window['urlMeta'][_0x18ff91(0x218)](_0x1c4f16);\n                            _0x19b763[_0x18ff91(0x2f3)][_0x18ff91(0x30f)](this, _0x341781);\n                        },\n                        'configurable': !![],\n                        'enumerable': _0x19b763[_0x47d1a0(0x167)]\n                    });\n                }\n            });\n            if (_0x3c0d96[_0x55e87c(0xfe)](typeof window[_0x55e87c(0x25b)], _0x3c0d96[_0x55e87c(0x126)])) {\n                var _0x5c4ba4 = window[_0x55e87c(0x25b)];\n                window[_0x55e87c(0x25b)] = new Proxy(_0x5c4ba4, {\n                    'apply'(_0x2ec724, _0x34509e, _0x31aa89) {\n                        const _0xc0b76 = _0x55e87c;\n                        try {\n                            let [_0x3f4484, _0x4aa013] = _0x31aa89;\n                            const _0x37ea94 = getRefererFromLocation(window[_0xc0b76(0x16d)]['href'], proxy_real_protocol, proxy_real_host), _0x5c38f8 = _0x4aa013 ? _0x4aa013['headers'] ? new Headers(_0x4aa013['headers']) : new Headers() : new Headers();\n                            _0x5c38f8['set'](_0x3c0d96['Mykyl'], proxy_real_protocol), _0x5c38f8[_0xc0b76(0x2f3)](_0x3c0d96[_0xc0b76(0x2e0)], proxy_real_host), _0x5c38f8[_0xc0b76(0x2f3)](_0x3c0d96['MwHai'], _0x37ea94), _0x5c38f8['set'](_0x3c0d96[_0xc0b76(0x1e1)], window[_0xc0b76(0x29c)][_0xc0b76(0x1c6)]);\n                            let _0x53186e = _0x3f4484;\n                            const _0x145d2f = _0x3c0d96[_0xc0b76(0x2af)](_0x3f4484, Request) && _0x3c0d96[_0xc0b76(0x246)](typeof _0x3f4484[_0xc0b76(0x2eb)], _0x3c0d96[_0xc0b76(0x11c)]) && _0x3c0d96[_0xc0b76(0x1f1)](_0x3f4484[_0xc0b76(0x2eb)], _0x3c0d96['xIWJT']);\n                            try {\n                                if (_0x3c0d96[_0xc0b76(0x246)](typeof _0x3f4484, _0x3c0d96[_0xc0b76(0x11c)]))\n                                    _0x53186e = window[_0xc0b76(0x1e4)][_0xc0b76(0x218)](_0x3f4484);\n                                else {\n                                    if (_0x3f4484 instanceof Request)\n                                        _0x53186e = new Request(window[_0xc0b76(0x1e4)][_0xc0b76(0x218)](_0x3f4484[_0xc0b76(0x122)]), _0x4aa013 || _0x3f4484);\n                                    else\n                                        _0x3f4484 instanceof URL && (_0x53186e = window['urlMeta'][_0xc0b76(0x218)](_0x3f4484[_0xc0b76(0x15e)]));\n                                }\n                            } catch (_0x156929) {\n                                _0x53186e = _0x3f4484;\n                            }\n                            return _0x31aa89[0x0] = _0x53186e, _0x4aa013 ? _0x4aa013[_0xc0b76(0x182)] = _0x5c38f8 : _0x31aa89[0x1] = { 'headers': _0x5c38f8 }, Reflect['apply'](_0x2ec724, _0x34509e, _0x31aa89);\n                        } catch (_0x219ce9) {\n                            console['error'](_0x3c0d96[_0xc0b76(0x224)], _0x219ce9);\n                            if (_0x31aa89[0x1]) {\n                                const _0x3dd3c4 = _0x31aa89[0x1][_0xc0b76(0x182)] ? new Headers(_0x31aa89[0x1]['headers']) : new Headers();\n                                _0x3dd3c4[_0xc0b76(0x2f3)](_0x3c0d96[_0xc0b76(0x2d7)], proxy_real_protocol), _0x3dd3c4[_0xc0b76(0x2f3)](_0x3c0d96['JVsIN'], proxy_real_host), _0x31aa89[0x1][_0xc0b76(0x182)] = _0x3dd3c4;\n                            } else\n                                _0x31aa89[0x1] = { 'headers': new Headers() }, _0x31aa89[0x1][_0xc0b76(0x182)][_0xc0b76(0x2f3)](_0x3c0d96[_0xc0b76(0x2d7)], proxy_real_protocol), _0x31aa89[0x1][_0xc0b76(0x182)][_0xc0b76(0x2f3)](_0xc0b76(0x14f), proxy_real_host);\n                            return Reflect[_0xc0b76(0x1ca)](_0x2ec724, _0x34509e, _0x31aa89);\n                        }\n                    }\n                });\n            }\n            var _0x510276 = XMLHttpRequest[_0x55e87c(0x1f5)][_0x55e87c(0x248)];\n            XMLHttpRequest[_0x55e87c(0x1f5)][_0x55e87c(0x248)] = function (_0x151759, _0x507e39, ..._0x2fb424) {\n                const _0x4a2db4 = _0x55e87c;\n                try {\n                    _0x507e39 = window[_0x4a2db4(0x1e4)][_0x4a2db4(0x218)](_0x507e39), _0x510276[_0x4a2db4(0x30f)](this, _0x151759, _0x507e39, ..._0x2fb424), this[_0x4a2db4(0x2d9)](_0x3c0d96[_0x4a2db4(0x2d7)], proxy_real_protocol), this[_0x4a2db4(0x2d9)](_0x3c0d96[_0x4a2db4(0x2e0)], proxy_real_host);\n                    const _0x534460 = getRefererFromLocation(window['location'][_0x4a2db4(0x15e)], proxy_real_protocol, proxy_real_host);\n                    this[_0x4a2db4(0x2d9)](_0x3c0d96[_0x4a2db4(0x2a3)], _0x534460), this[_0x4a2db4(0x2d9)](_0x3c0d96['UzgyH'], window['___location'][_0x4a2db4(0x1c6)]);\n                } catch (_0x7e8ea6) {\n                    console[_0x4a2db4(0x2a8)](_0x3c0d96[_0x4a2db4(0x310)], _0x7e8ea6), _0x510276[_0x4a2db4(0x30f)](this, _0x151759, _0x507e39, ..._0x2fb424);\n                }\n            };\n        }()), (function () {\n            const _0x2dc505 = _0x1930c4, _0x7cbf10 = {\n                    'ChMvE': _0x2dc505(0x304),\n                    'JWUTV': 'href',\n                    'fjymc': 'action',\n                    'jtbot': _0x2dc505(0x29e),\n                    'uWWLO': _0x2dc505(0x257),\n                    'TadLa': 'srcset',\n                    'PdmeF': _0x2dc505(0x115),\n                    'EDlkO': _0x2dc505(0x29d),\n                    'cxuVy': _0x2dc505(0x220),\n                    'PcHUp': _0x2dc505(0x235),\n                    'EFZFt': 'HTMLLinkElement',\n                    'bypsZ': _0x2dc505(0x11d),\n                    'ClPwU': _0x2dc505(0x146),\n                    'VEtpK': _0x2dc505(0x1c1),\n                    'tcqQC': _0x2dc505(0x231),\n                    'TCfvR': 'HTMLQuoteElement',\n                    'VXGzZ': function (_0x5afea5, _0x428432) {\n                        return _0x5afea5(_0x428432);\n                    },\n                    'zXvJs': function (_0x52e7ee, _0x5d9a4d) {\n                        return _0x52e7ee === _0x5d9a4d;\n                    },\n                    'dAgyx': _0x2dc505(0x2f8),\n                    'iCuTb': _0x2dc505(0x295),\n                    'izknW': _0x2dc505(0x2ba),\n                    'YibkJ': _0x2dc505(0x1f2),\n                    'HYpEX': function (_0x541518, _0x5c9930) {\n                        return _0x541518 !== _0x5c9930;\n                    },\n                    'MJGti': function (_0x156f46, _0x5dedc3, _0x15fcb3) {\n                        return _0x156f46(_0x5dedc3, _0x15fcb3);\n                    },\n                    'wydWf': function (_0x409359, _0x2ade02) {\n                        return _0x409359 !== _0x2ade02;\n                    },\n                    'OFkcP': function (_0xc31cd1, _0x5db617) {\n                        return _0xc31cd1 === _0x5db617;\n                    },\n                    'wcFAC': function (_0x280bac, _0x214aa1) {\n                        return _0x280bac === _0x214aa1;\n                    },\n                    'vnGLS': _0x2dc505(0x1de),\n                    'dTvAF': _0x2dc505(0x160),\n                    'ViCqe': function (_0x1e81b9, _0x52bb0a) {\n                        return _0x1e81b9 === _0x52bb0a;\n                    },\n                    'tugaz': function (_0x5722b8, _0x17fc50) {\n                        return _0x5722b8(_0x17fc50);\n                    },\n                    'BnuwJ': function (_0xd0f748, _0x250002) {\n                        return _0xd0f748 instanceof _0x250002;\n                    },\n                    'JwAEQ': 'submit',\n                    'hVgxG': 'data-url',\n                    'gIGku': 'innerHTML'\n                }, _0x37fe0f = [\n                    _0x2dc505(0x304),\n                    _0x7cbf10[_0x2dc505(0x12d)],\n                    _0x7cbf10['fjymc'],\n                    _0x7cbf10[_0x2dc505(0x27a)],\n                    _0x7cbf10[_0x2dc505(0x1f6)],\n                    _0x2dc505(0x115),\n                    _0x7cbf10[_0x2dc505(0x1a3)],\n                    'cite',\n                    _0x7cbf10[_0x2dc505(0x219)]\n                ], _0xa2da75 = {\n                    'attributes': !![],\n                    'childList': !![],\n                    'subtree': !![],\n                    'attributeOldValue': !![],\n                    'characterDataOldValue': !![],\n                    'attributeFilter': _0x37fe0f\n                };\n            (function () {\n                const _0x1e31ac = _0x2dc505, _0x6cf658 = [\n                        _0x7cbf10['ChMvE'],\n                        _0x7cbf10[_0x1e31ac(0x12d)],\n                        _0x7cbf10['fjymc'],\n                        _0x7cbf10['jtbot'],\n                        _0x7cbf10[_0x1e31ac(0x2b4)],\n                        _0x1e31ac(0x2ff),\n                        _0x7cbf10[_0x1e31ac(0x1f6)],\n                        _0x7cbf10[_0x1e31ac(0x11b)],\n                        _0x7cbf10[_0x1e31ac(0x219)]\n                    ], _0x5e99a7 = [\n                        _0x1e31ac(0x270),\n                        _0x1e31ac(0x143),\n                        _0x7cbf10[_0x1e31ac(0x2ae)],\n                        _0x7cbf10[_0x1e31ac(0x2e5)],\n                        _0x7cbf10[_0x1e31ac(0x2a7)],\n                        _0x7cbf10[_0x1e31ac(0x17b)],\n                        _0x7cbf10[_0x1e31ac(0x303)],\n                        _0x7cbf10[_0x1e31ac(0x156)],\n                        _0x7cbf10[_0x1e31ac(0x1d5)],\n                        _0x7cbf10['TCfvR'],\n                        _0x1e31ac(0x184)\n                    ];\n                _0x5e99a7[_0x1e31ac(0x2d2)](_0x11284d => {\n                    const _0x10df02 = _0x1e31ac, _0x25c601 = window[_0x11284d] ? window[_0x11284d][_0x10df02(0x1f5)] : null;\n                    if (!_0x25c601)\n                        return;\n                    _0x6cf658[_0x10df02(0x2d2)](_0x47ec4e => {\n                        const _0x196c08 = _0x10df02, _0x208640 = Object[_0x196c08(0x24c)](_0x25c601, _0x47ec4e);\n                        _0x208640 && _0x208640['set'] && Object[_0x196c08(0x2d5)](_0x25c601, _0x47ec4e, {\n                            'set'(_0xb8cc62) {\n                                const _0x586d4d = _0x196c08, _0x4d05e4 = window[_0x586d4d(0x1e4)][_0x586d4d(0x218)](_0xb8cc62);\n                                return _0x208640[_0x586d4d(0x2f3)][_0x586d4d(0x30f)](this, _0x4d05e4);\n                            },\n                            'get': _0x208640[_0x196c08(0x19b)],\n                            'configurable': !![],\n                            'enumerable': _0x208640[_0x196c08(0x167)]\n                        });\n                    });\n                });\n            }());\n            const _0x455bfc = window['Image'];\n            window[_0x2dc505(0x118)] = function (..._0x10ba0f) {\n                const _0x33e0e7 = new _0x455bfc(..._0x10ba0f);\n                return _0x33e0e7;\n            };\n            const _0x1f9e31 = Document[_0x2dc505(0x1f5)][_0x2dc505(0x2da)];\n            Document[_0x2dc505(0x1f5)][_0x2dc505(0x2da)] = function (_0x3ccb2f, _0xfec4d8) {\n                const _0x478518 = _0x2dc505, _0x44aec7 = _0x1f9e31[_0x478518(0x30f)](this, _0x3ccb2f, _0xfec4d8);\n                return _0x44aec7;\n            };\n            function _0x837cb0(_0x5c614d, _0x563a31) {\n                let _0x2abeea;\n                return (..._0x36e4ae) => {\n                    const _0xa6d7b0 = _0x2216;\n                    _0x7cbf10[_0xa6d7b0(0x1d7)](clearTimeout, _0x2abeea), _0x2abeea = setTimeout(() => _0x5c614d(..._0x36e4ae), _0x563a31);\n                };\n            }\n            var _0x5ab212 = Element[_0x2dc505(0x1f5)]['setAttribute'];\n            Element[_0x2dc505(0x1f5)][_0x2dc505(0x127)] = new Proxy(_0x5ab212, {\n                'apply'(_0x51d963, _0x3830ad, _0x168584) {\n                    const _0x271746 = _0x2dc505;\n                    try {\n                        let [_0x3f163e, _0x2fb958] = _0x168584;\n                        return _0x37fe0f[_0x271746(0x2b5)](_0x3f163e) && _0x2fb958 && (_0x2fb958 = window[_0x271746(0x1e4)][_0x271746(0x218)](_0x2fb958), _0x7cbf10[_0x271746(0x2e3)](_0x3830ad[_0x271746(0x2e1)][_0x271746(0x311)](), _0x7cbf10[_0x271746(0x26d)]) && _0x3830ad[_0x271746(0x1b8)](_0x7cbf10[_0x271746(0x2c2)]) && _0x3830ad[_0x271746(0x1cf)](_0x7cbf10[_0x271746(0x2c2)])), _0x168584[0x1] = _0x2fb958, Reflect['apply'](_0x51d963, _0x3830ad, _0x168584);\n                    } catch (_0x587ac0) {\n                        return console[_0x271746(0x2a8)](_0x7cbf10['izknW'], _0x587ac0), _0x5ab212[_0x271746(0x30f)](_0x3830ad, attr, value);\n                    }\n                }\n            });\n            var _0x4ca73f = Object['getOwnPropertyDescriptor'](Element[_0x2dc505(0x1f5)], _0x2dc505(0x27c));\n            _0x4ca73f && _0x4ca73f[_0x2dc505(0x2f3)] && Object[_0x2dc505(0x2d5)](Element[_0x2dc505(0x1f5)], _0x7cbf10['gIGku'], {\n                'set': function (_0x4984eb) {\n                    const _0x15950c = _0x2dc505;\n                    _0x4ca73f[_0x15950c(0x2f3)][_0x15950c(0x30f)](this, _0x4984eb);\n                    for (let _0x52b39d of this[_0x15950c(0x1e6)]) {\n                        _0x2aa4c3(_0x52b39d);\n                    }\n                },\n                'get': _0x4ca73f[_0x2dc505(0x19b)],\n                'configurable': !![],\n                'enumerable': _0x4ca73f['enumerable']\n            });\n            var _0x4ca6bd = Object[_0x2dc505(0x24c)](Element[_0x2dc505(0x1f5)], _0x2dc505(0x2b8));\n            _0x4ca6bd && _0x4ca6bd['set'] && Object[_0x2dc505(0x2d5)](Element['prototype'], _0x2dc505(0x2b8), {\n                'set': function (_0x50eda3) {\n                    _0x4ca6bd['set']['call'](this, _0x50eda3);\n                },\n                'get': _0x4ca6bd[_0x2dc505(0x19b)],\n                'configurable': !![],\n                'enumerable': _0x4ca6bd[_0x2dc505(0x167)]\n            });\n            var _0x127618 = Node[_0x2dc505(0x1f5)][_0x2dc505(0x145)];\n            Node['prototype'][_0x2dc505(0x145)] = function (_0x11dc22) {\n                const _0x4e6974 = _0x2dc505;\n                var _0x1e5ad3 = _0x127618[_0x4e6974(0x30f)](this, _0x11dc22);\n                return _0x2aa4c3(_0x1e5ad3), _0x1e5ad3;\n            };\n            var _0x1f9d6a = Element[_0x2dc505(0x1f5)][_0x2dc505(0x241)];\n            Element['prototype'][_0x2dc505(0x241)] = function (_0x5493f2, _0x43efb1) {\n                const _0x16b225 = _0x2dc505;\n                var _0x3a23cc = document[_0x16b225(0x2da)](_0x7cbf10['YibkJ']);\n                _0x3a23cc['innerHTML'] = _0x43efb1, _0x7cbf10['VXGzZ'](_0x2aa4c3, _0x3a23cc);\n                var _0x1fc629 = _0x3a23cc['innerHTML'];\n                return _0x1f9d6a['call'](this, _0x5493f2, _0x1fc629);\n            };\n            function _0x2a452c(_0x368a9a) {\n                const _0x3a7d26 = _0x2dc505;\n                return _0x7cbf10[_0x3a7d26(0x18d)](_0x837cb0, (_0x57d04a, _0x555dfb) => {\n                    const _0x4ef5f2 = _0x3a7d26, _0x84a06d = {\n                            'nmjOO': function (_0x3ba3e9, _0xc38cf4) {\n                                return _0x7cbf10['HYpEX'](_0x3ba3e9, _0xc38cf4);\n                            },\n                            'RSxDz': _0x7cbf10['ChMvE'],\n                            'NUBAI': function (_0x50a6e7, _0x8ba809) {\n                                return _0x50a6e7 === _0x8ba809;\n                            },\n                            'KqrrJ': _0x7cbf10[_0x4ef5f2(0x26d)]\n                        };\n                    _0x555dfb[_0x4ef5f2(0x223)](), _0x57d04a[_0x4ef5f2(0x2d2)](_0x452509 => {\n                        const _0x290a7d = _0x4ef5f2;\n                        if (_0x452509[_0x290a7d(0x1b5)] === 'attributes' && _0x37fe0f[_0x290a7d(0x2b5)](_0x452509[_0x290a7d(0xfd)])) {\n                            let _0x299f12 = _0x452509[_0x290a7d(0x1e2)]['getAttribute'](_0x452509[_0x290a7d(0xfd)]), _0x27f251 = window[_0x290a7d(0x1e4)][_0x290a7d(0x218)](_0x299f12);\n                            if (_0x84a06d[_0x290a7d(0x15f)](_0x27f251, _0x299f12))\n                                _0x452509[_0x290a7d(0x1e2)][_0x290a7d(0x127)](_0x452509[_0x290a7d(0xfd)], _0x27f251);\n                            _0x452509[_0x290a7d(0xfd)] === _0x84a06d[_0x290a7d(0x263)] && _0x84a06d[_0x290a7d(0x203)](_0x452509['target'][_0x290a7d(0x2e1)][_0x290a7d(0x311)](), _0x84a06d['KqrrJ']) && _0x452509[_0x290a7d(0x1e2)][_0x290a7d(0x1cf)](_0x290a7d(0x295));\n                        } else\n                            _0x452509['type'] === _0x290a7d(0x1a1) && _0x452509[_0x290a7d(0x105)]['forEach'](_0x3ba0ef => _0x2aa4c3(_0x3ba0ef));\n                    }), _0x555dfb[_0x4ef5f2(0x260)](_0x368a9a, _0xa2da75);\n                }, 0xa);\n            }\n            window[_0x2dc505(0x261)] = _0x7cbf10[_0x2dc505(0x1d7)](_0x2a452c, document[_0x2dc505(0x14e)]);\n            function _0x2aa4c3(_0x24d5c7) {\n                const _0x31f7ad = _0x2dc505, _0x4b66b7 = {\n                        'PopXi': function (_0x4e3ac7, _0x497b69) {\n                            return _0x4e3ac7(_0x497b69);\n                        }\n                    };\n                if (_0x24d5c7['_traversed'])\n                    return;\n                _0x24d5c7[_0x31f7ad(0x244)] = !![], _0x24d5c7['childNodes'][_0x31f7ad(0x2d2)](_0x2aa4c3);\n                _0x7cbf10[_0x31f7ad(0x2e3)](_0x24d5c7[_0x31f7ad(0x1a7)], Node[_0x31f7ad(0x2ad)]) && _0x37fe0f['forEach'](_0x123a65 => {\n                    const _0x45ba35 = _0x31f7ad;\n                    if (_0x24d5c7['hasAttribute'](_0x123a65)) {\n                        let _0x4ab14e = _0x24d5c7[_0x45ba35(0x10d)](_0x123a65), _0x56446d = window[_0x45ba35(0x1e4)][_0x45ba35(0x218)](_0x4ab14e);\n                        if (_0x7cbf10[_0x45ba35(0x2c3)](_0x56446d, _0x4ab14e))\n                            _0x24d5c7['setAttribute'](_0x123a65, _0x56446d);\n                        if (_0x7cbf10[_0x45ba35(0x2fd)](_0x123a65, _0x7cbf10[_0x45ba35(0x162)]) && _0x7cbf10[_0x45ba35(0x1c5)](_0x24d5c7[_0x45ba35(0x2e1)][_0x45ba35(0x311)](), _0x7cbf10['dAgyx']))\n                            _0x24d5c7['removeAttribute'](_0x7cbf10['iCuTb']);\n                    }\n                });\n                _0x24d5c7[_0x31f7ad(0x2e1)] && _0x24d5c7[_0x31f7ad(0x2e1)]['toLowerCase']() === _0x7cbf10[_0x31f7ad(0x255)] && !_0x24d5c7[_0x31f7ad(0x18a)] && (_0x24d5c7[_0x31f7ad(0x18a)] = !![], _0x24d5c7[_0x31f7ad(0x2b1)](_0x7cbf10['dTvAF'], () => {\n                    const _0x2c927a = _0x31f7ad;\n                    if (_0x24d5c7[_0x2c927a(0x23e)] && !_0x24d5c7[_0x2c927a(0x23e)]['_observerSet']) {\n                        _0x24d5c7['contentDocument']['_observerSet'] = !![], _0x4b66b7[_0x2c927a(0x1a8)](_0x2aa4c3, _0x24d5c7[_0x2c927a(0x23e)]);\n                        if (_0x24d5c7[_0x2c927a(0x23e)]['documentElement']) {\n                            let _0x59b822 = new MutationObserver(_0x2a452c(_0x24d5c7[_0x2c927a(0x23e)][_0x2c927a(0x14e)]));\n                            _0x59b822[_0x2c927a(0x260)](_0x24d5c7[_0x2c927a(0x23e)][_0x2c927a(0x14e)], _0xa2da75);\n                        }\n                    }\n                }));\n                if (_0x24d5c7['tagName'] && _0x7cbf10[_0x31f7ad(0x313)](_0x24d5c7['tagName']['toLowerCase'](), _0x7cbf10[_0x31f7ad(0x255)])) {\n                    const _0x13d76e = _0x24d5c7[_0x31f7ad(0x23e)];\n                    if (_0x13d76e && !_0x13d76e[_0x31f7ad(0x236)]) {\n                        _0x13d76e[_0x31f7ad(0x236)] = !![], _0x7cbf10[_0x31f7ad(0xff)](_0x2aa4c3, _0x13d76e);\n                        if (_0x13d76e['documentElement']) {\n                            let _0x2f9963 = new MutationObserver(_0x7cbf10[_0x31f7ad(0x1d7)](_0x2a452c, _0x13d76e[_0x31f7ad(0x14e)]));\n                            _0x2f9963[_0x31f7ad(0x260)](_0x13d76e[_0x31f7ad(0x14e)], _0xa2da75);\n                        }\n                    }\n                }\n            }\n            window[_0x2dc505(0x21a)] = _0x2aa4c3;\n            function _0x5f00b8(_0x443f5a, _0x398958) {\n                const _0x764bb0 = _0x2dc505, _0x59770b = {\n                        'JTJUo': function (_0x539bf, _0x4b4982) {\n                            return _0x539bf !== _0x4b4982;\n                        }\n                    };\n                if (!_0x7cbf10[_0x764bb0(0x140)](_0x443f5a, HTMLElement) || !_0x443f5a[_0x764bb0(0x1b8)](_0x398958) || _0x443f5a[_0x764bb0(0x2fa)])\n                    return;\n                _0x443f5a[_0x764bb0(0x2fa)] = !![], _0x443f5a[_0x764bb0(0x2b1)](_0x764bb0(0x185), _0x41b4c2 => {\n                    const _0x2a8426 = _0x764bb0, _0x36fed8 = _0x443f5a[_0x2a8426(0x10d)](_0x398958), _0x88c6e3 = window[_0x2a8426(0x1e4)]['rewrite'](_0x36fed8);\n                    if (_0x59770b[_0x2a8426(0x1c2)](_0x88c6e3, _0x36fed8))\n                        _0x443f5a[_0x2a8426(0x127)](_0x398958, _0x88c6e3);\n                });\n            }\n            function _0x331c6c(_0x88948c) {\n                const _0x10054c = _0x2dc505;\n                if (!(_0x88948c instanceof HTMLFormElement) || !_0x88948c[_0x10054c(0x1b8)](_0x7cbf10[_0x10054c(0x1ab)]) || _0x88948c[_0x10054c(0x14b)])\n                    return;\n                _0x88948c[_0x10054c(0x14b)] = !![], _0x88948c[_0x10054c(0x2b1)](_0x7cbf10[_0x10054c(0x111)], _0x297bab => {\n                    const _0x84858b = _0x10054c;\n                    if (!_0x88948c[_0x84858b(0x18b)])\n                        return;\n                    _0x297bab['preventDefault'](), _0x297bab[_0x84858b(0x1e2)][_0x84858b(0x17e)] = window[_0x84858b(0x1e4)]['rewrite'](_0x297bab[_0x84858b(0x1e2)][_0x84858b(0x17e)]), _0x297bab[_0x84858b(0x1e2)][_0x84858b(0x16e)]();\n                });\n            }\n        }()), (function () {\n            const _0xb44284 = _0x1930c4, _0xef7111 = {\n                    'yravr': _0xb44284(0x137),\n                    'MRVqd': _0xb44284(0x1a5),\n                    'qmgdb': function (_0x25e607) {\n                        return _0x25e607();\n                    },\n                    'spDrl': _0xb44284(0x2c9),\n                    'PUQYl': 'host:',\n                    'iNkAb': _0xb44284(0x144),\n                    'vUiXg': function (_0x3c1214, _0xe003f) {\n                        return _0x3c1214 + _0xe003f;\n                    },\n                    'OAMvC': function (_0x43dc7b, _0x26e43a) {\n                        return _0x43dc7b + _0x26e43a;\n                    },\n                    'shjfP': _0xb44284(0x2c6),\n                    'OQKVe': _0xb44284(0x2ce),\n                    'eUptW': _0xb44284(0x176),\n                    'GLSSK': _0xb44284(0x308),\n                    'ywPEk': function (_0x3fd47f, _0x5c4564) {\n                        return _0x3fd47f in _0x5c4564;\n                    },\n                    'MTIvt': 'serviceWorker',\n                    'OyIij': _0xb44284(0x2bf)\n                };\n            console[_0xb44284(0x134)](_0xef7111[_0xb44284(0x254)]);\n            function _0x262b5f(_0x5c7278, _0xcb2db1, _0x39a741) {\n                const _0x557d26 = _0xb44284;\n                window[_0x557d26(0x1ad)] && window[_0x557d26(0x1ad)]['active'] && window[_0x557d26(0x1ad)][_0x557d26(0x293)][_0x557d26(0x322)]({\n                    'type': _0xef7111['yravr'],\n                    'data': {\n                        'pathname': _0x5c7278,\n                        'real_protocol': _0xcb2db1,\n                        'real_host': _0x39a741\n                    }\n                });\n            }\n            function _0x5ad7b7() {\n                const _0x48ca1c = _0xb44284;\n                if (!proxy_real_protocol || window['self'] !== window[_0x48ca1c(0x1ac)])\n                    return;\n                window['proxy_worker_registration'] && window[_0x48ca1c(0x1ad)][_0x48ca1c(0x293)] && window['proxy_worker_registration'][_0x48ca1c(0x293)][_0x48ca1c(0x322)]({\n                    'type': 'PROXY_CUR_LOCATION',\n                    'data': {\n                        'protocol': proxy_real_protocol,\n                        'host': proxy_real_host\n                    }\n                });\n            }\n            if (_0xef7111[_0xb44284(0x187)](_0xef7111[_0xb44284(0x2b7)], navigator)) {\n                console['log'](_0xef7111[_0xb44284(0x13a)]);\n                var _0x435d5f;\n                navigator[_0xb44284(0x1f3)][_0xb44284(0x245)]()['then'](function (_0xb03c65) {\n                    const _0x30534f = _0xb44284, _0x1d9972 = {\n                            'PuQqM': _0x30534f(0x2a0),\n                            'KcPKL': function (_0x41daff) {\n                                return _0xef7111['qmgdb'](_0x41daff);\n                            },\n                            'cQyuB': _0xef7111['spDrl'],\n                            'tIZlz': _0xef7111[_0x30534f(0x2a6)]\n                        };\n                    _0x435d5f = _0xb03c65, console['log'](_0xef7111[_0x30534f(0x172)], _0x435d5f['length']);\n                    var _0x349c6c = _0x435d5f[_0x30534f(0x258)](function (_0x274353) {\n                        const _0x285af7 = _0x30534f;\n                        if (_0x274353['active'] && _0x274353['active'][_0x285af7(0x239)][_0x285af7(0x2b5)](_0x1d9972[_0x285af7(0x22e)])) {\n                            console[_0x285af7(0x134)](_0x285af7(0x2e8)), window['proxy_worker_registration'] = _0x274353, _0x1d9972['KcPKL'](_0x5ad7b7);\n                            try {\n                                _0x274353[_0x285af7(0x298)]();\n                            } catch (_0x3d4850) {\n                            }\n                            return !![];\n                        }\n                        return ![];\n                    });\n                    if (!_0x349c6c) {\n                        if (window[_0x30534f(0x1ad)] && window[_0x30534f(0x1ad)][_0x30534f(0x293)])\n                            return;\n                        navigator[_0x30534f(0x1f3)][_0x30534f(0x2de)](_0xef7111[_0x30534f(0x181)](_0xef7111['OAMvC'](_0xef7111[_0x30534f(0x129)](_0xef7111[_0x30534f(0x174)], proxy_real_protocol) + '&proxy_real_host=', proxy_real_host), _0xef7111[_0x30534f(0x1b0)]))['then'](function (_0x5e8282) {\n                            const _0x25175f = _0x30534f;\n                            console[_0x25175f(0x134)](_0x25175f(0x277), _0x5e8282[_0x25175f(0x20b)], _0x1d9972[_0x25175f(0x114)], proxy_real_protocol, _0x1d9972[_0x25175f(0x319)], proxy_real_host), window[_0x25175f(0x1ad)] = _0x5e8282, _0x5ad7b7();\n                        }, function (_0x230e2c) {\n                            const _0x1b2816 = _0x30534f;\n                            console[_0x1b2816(0x2a8)](_0xef7111['MRVqd'], _0x230e2c);\n                        });\n                    }\n                })[_0xb44284(0x17f)](function (_0x12532f) {\n                    const _0x305e1d = _0xb44284;\n                    console[_0x305e1d(0x2a8)](_0xef7111[_0x305e1d(0x267)], _0x12532f);\n                });\n            }\n        }()), (function () {\n            const _0x4058a5 = _0x1930c4, _0x1dd148 = {\n                    'HsQns': function (_0x4489d9, _0x328cf4) {\n                        return _0x4489d9 < _0x328cf4;\n                    },\n                    'MZGFJ': _0x4058a5(0x2dd),\n                    'QlYBP': function (_0x12d4db, _0x310cee) {\n                        return _0x12d4db === _0x310cee;\n                    },\n                    'mrvJG': function (_0xdbcce3, _0x45ea5a) {\n                        return _0xdbcce3 === _0x45ea5a;\n                    },\n                    'XPbbd': 'proxy_real_protocol',\n                    'mgvok': function (_0x537a55, _0x35dcd9) {\n                        return _0x537a55 + _0x35dcd9;\n                    },\n                    'ILhGU': function (_0x5d610e, _0x29a9cc) {\n                        return _0x5d610e === _0x29a9cc;\n                    },\n                    'puphp': function (_0x5a6081, _0x3697b8) {\n                        return _0x5a6081 === _0x3697b8;\n                    },\n                    'tjGmU': function (_0x42d39a, _0x1240ca) {\n                        return _0x42d39a + _0x1240ca;\n                    },\n                    'PDjRF': '; Max-Age=1800',\n                    'TppJF': function (_0x61dcb8, _0x318592) {\n                        return _0x61dcb8 && _0x318592;\n                    },\n                    'ZiMdC': _0x4058a5(0xf7),\n                    'EmnIS': function (_0x4d9222, _0x4f75f3) {\n                        return _0x4d9222 === _0x4f75f3;\n                    },\n                    'EaRxa': function (_0x2d07e9, _0x5d66dc) {\n                        return _0x2d07e9 === _0x5d66dc;\n                    },\n                    'whsgN': _0x4058a5(0x195),\n                    'ZJpjC': function (_0x2bcc72, _0x17454a) {\n                        return _0x2bcc72 === _0x17454a;\n                    },\n                    'cKwSu': '[siteproxy] removeRootPathCookies error:',\n                    'haTMi': _0x4058a5(0x250),\n                    'nKAGk': function (_0x4456fe) {\n                        return _0x4456fe();\n                    },\n                    'EsxbJ': function (_0x32a439, _0x438bae) {\n                        return _0x32a439 + _0x438bae;\n                    },\n                    'rIHZw': function (_0x246206, _0x1c0536) {\n                        return _0x246206 !== _0x1c0536;\n                    },\n                    'PusBl': function (_0x33e621, _0x78cd04) {\n                        return _0x33e621 !== _0x78cd04;\n                    },\n                    'fgEPa': '[siteproxy] cookiePath:',\n                    'ULTmr': _0x4058a5(0x204),\n                    'KdQHC': _0x4058a5(0x194),\n                    'AmJCr': function (_0x200b42, _0xd364b3) {\n                        return _0x200b42 + _0xd364b3;\n                    },\n                    'RYrxm': _0x4058a5(0x1e3),\n                    'XSjGq': _0x4058a5(0x158)\n                };\n            window[_0x4058a5(0x2fb)] = !![];\n            let _0x1ec871 = config_token_prefix;\n            if (!_0x1ec871[_0x4058a5(0x253)]('/'))\n                _0x1ec871 += '/';\n            _0x1ec871 += _0x1dd148['mgvok'](_0x1dd148[_0x4058a5(0x1f4)](proxy_real_protocol + '/', proxy_real_host), '/');\n            if (!_0x1ec871[_0x4058a5(0x28b)]('/'))\n                _0x1ec871 = '/' + _0x1ec871;\n            let _0x531b5d = config_proxy_url[_0x4058a5(0x211)](_0x1dd148[_0x4058a5(0x296)](config_proxy_url[_0x4058a5(0x268)]('//'), 0x2));\n            _0x1dd148[_0x4058a5(0x1a6)](_0x531b5d[_0x4058a5(0x268)](':'), -0x1) && (_0x531b5d = _0x531b5d['substring'](0x0, _0x531b5d[_0x4058a5(0x268)](':')));\n            const _0x58ccf5 = _0x531b5d[_0x4058a5(0x268)]('/');\n            _0x1dd148[_0x4058a5(0x173)](_0x58ccf5, -0x1) && (_0x531b5d = _0x531b5d['substring'](0x0, _0x58ccf5));\n            console[_0x4058a5(0x134)](_0x1dd148[_0x4058a5(0x18c)], _0x1ec871, _0x1dd148[_0x4058a5(0x213)], _0x531b5d);\n            let _0x605b21 = new Set();\n            function _0x45020d(_0x136f2d) {\n                const _0x80cd = _0x4058a5, _0x3a6d7d = new Date(_0x136f2d), _0x38b379 = new Date();\n                return _0x1dd148[_0x80cd(0x13e)](_0x3a6d7d, _0x38b379);\n            }\n            function _0x353c95(_0xcfff80) {\n                const _0x10a229 = _0x4058a5;\n                console['log'](_0x1dd148[_0x10a229(0xf1)], _0xcfff80);\n                const _0x8c0625 = _0xcfff80[_0x10a229(0x28a)](/^([^=]+)=/), _0x4e3a15 = _0x8c0625 ? _0x8c0625[0x1] : '', _0x5b0ef0 = _0x1dd148['QlYBP'](_0x4e3a15, _0x10a229(0x195)) || _0x1dd148[_0x10a229(0x1e7)](_0x4e3a15, _0x1dd148[_0x10a229(0x25a)]);\n                if (!_0x5b0ef0)\n                    _0x605b21[_0x10a229(0x1a4)](_0x4e3a15);\n                const _0x2912a5 = /Expiress*=/i['test'](_0xcfff80), _0x4bf447 = /Max-Ages*=/i[_0x10a229(0x209)](_0xcfff80);\n                let _0x2e7e6d = _0xcfff80[_0x10a229(0x284)](/Domains*=s*[^;]*?(;|$)/ig, _0x10a229(0x2d1) + _0x531b5d + ';');\n                const _0xaf3f8b = _0xcfff80['match'](/Paths*=s*([^;]*)(;|$)/i);\n                let _0x128c80 = _0xaf3f8b ? _0xaf3f8b[0x1][_0x10a229(0x112)]() : '/';\n                !_0x128c80['startsWith']('/') && (_0x128c80 = _0x1dd148[_0x10a229(0x31c)]('/', _0x128c80));\n                let _0x24a3c4;\n                if (_0x5b0ef0)\n                    _0x24a3c4 = '/';\n                else {\n                    if (_0x128c80 === '/')\n                        _0x24a3c4 = _0x1ec871;\n                    else {\n                        const _0x3c2960 = _0x1ec871[_0x10a229(0x253)]('/') ? _0x1ec871[_0x10a229(0x2d0)](0x0, -0x1) : _0x1ec871;\n                        _0x128c80[_0x10a229(0x28b)](_0x3c2960) && (_0x1dd148[_0x10a229(0xf4)](_0x128c80[_0x10a229(0x2e9)], _0x3c2960[_0x10a229(0x2e9)]) || _0x1dd148['puphp'](_0x128c80[_0x3c2960[_0x10a229(0x2e9)]], '/')) ? _0x24a3c4 = _0x128c80 : _0x24a3c4 = _0x1dd148[_0x10a229(0x1f4)](_0x1ec871[_0x10a229(0x2d0)](0x0, -0x1), _0x128c80);\n                    }\n                }\n                /Paths*=/i[_0x10a229(0x209)](_0x2e7e6d) ? _0x2e7e6d = _0x2e7e6d[_0x10a229(0x284)](/Paths*=s*([^;]*)(;|$)/ig, _0x10a229(0x149) + _0x24a3c4 + ';') : _0x2e7e6d += _0x10a229(0x117) + _0x24a3c4 + ';';\n                !/Domains*=/i[_0x10a229(0x209)](_0x2e7e6d) && (_0x2e7e6d += '; Domain=' + _0x531b5d + ';');\n                if (!_0x5b0ef0) {\n                    _0x2e7e6d = _0x2e7e6d[_0x10a229(0x284)](/Max-Ages*=s*[^;]*?(;|$)/ig, '');\n                    const _0x74561b = _0x2e7e6d[_0x10a229(0x28a)](/Expiress*=s*([^;]*?)(;|$)/i);\n                    if (_0x74561b) {\n                        const _0x244919 = _0x74561b[0x1];\n                        !_0x45020d(_0x244919) && (_0x2e7e6d = _0x2e7e6d[_0x10a229(0x284)](/Expiress*=s*([^;]*?)(;|$)/ig, ''), _0x2e7e6d += _0x1dd148[_0x10a229(0x121)]);\n                    } else\n                        _0x1dd148[_0x10a229(0x272)](!_0x2912a5, !_0x4bf447) && (_0x2e7e6d += _0x10a229(0x225));\n                }\n                return _0x2e7e6d = _0x2e7e6d[_0x10a229(0x284)](/; ;|;;/g, ';'), console['log'](_0x1dd148[_0x10a229(0x1fa)], _0x2e7e6d), _0x2e7e6d;\n            }\n            const _0x442a42 = Object[_0x4058a5(0x24c)](Document['prototype'], _0x1dd148[_0x4058a5(0x1d0)]);\n            if (_0x442a42) {\n                const _0x4521fc = _0x442a42[_0x4058a5(0x19b)], _0x1884b9 = _0x442a42['set'];\n                function _0x2c7505() {\n                    const _0x39780e = _0x4058a5;\n                    try {\n                        const _0x2db39a = _0x4521fc[_0x39780e(0x30f)](document);\n                        if (!_0x2db39a)\n                            return;\n                        const _0x5d1c62 = _0x2db39a[_0x39780e(0x189)]('; ');\n                        for (let _0x5afbf5 of _0x5d1c62) {\n                            const _0x446417 = _0x5afbf5[_0x39780e(0x268)]('=');\n                            if (_0x1dd148[_0x39780e(0x22a)](_0x446417, -0x1))\n                                continue;\n                            const _0x2cd5fe = _0x5afbf5[_0x39780e(0x211)](0x0, _0x446417);\n                            if (_0x1dd148[_0x39780e(0x1b4)](_0x2cd5fe, _0x1dd148[_0x39780e(0x1f0)]) || _0x1dd148[_0x39780e(0x31a)](_0x2cd5fe, _0x1dd148[_0x39780e(0x25a)]))\n                                continue;\n                            if (_0x605b21[_0x39780e(0x1b9)](_0x2cd5fe))\n                                continue;\n                            const _0x4a62ab = _0x2cd5fe + _0x39780e(0x169) + _0x531b5d;\n                            _0x1884b9[_0x39780e(0x30f)](document, _0x4a62ab);\n                        }\n                    } catch (_0x1b27af) {\n                        console['error'](_0x1dd148['cKwSu'], _0x1b27af);\n                    }\n                }\n                Object[_0x4058a5(0x2d5)](document, _0x1dd148['KdQHC'], {\n                    'get': _0x4521fc,\n                    'set': function (_0x3f36d1) {\n                        const _0x23952d = _0x4058a5, _0x45c6bf = _0x353c95(_0x3f36d1);\n                        console['log'](_0x1dd148[_0x23952d(0x200)], _0x45c6bf);\n                        try {\n                            const _0x201997 = _0x1884b9['call'](this, _0x45c6bf);\n                            return _0x1dd148[_0x23952d(0x142)](_0x2c7505), _0x201997;\n                        } catch (_0x24beca) {\n                            console['error'](_0x23952d(0x27d), _0x24beca);\n                            throw _0x24beca;\n                        }\n                    },\n                    'configurable': !![],\n                    'enumerable': _0x442a42['enumerable']\n                });\n            }\n            document[_0x4058a5(0x194)] = _0x1dd148[_0x4058a5(0x1fb)](_0x1dd148[_0x4058a5(0x31c)](_0x1dd148[_0x4058a5(0x1ed)], proxy_real_host), _0x1dd148['XSjGq']), document[_0x4058a5(0x194)] = _0x1dd148[_0x4058a5(0x1fb)]('proxy_real_protocol=' + proxy_real_protocol, _0x1dd148['XSjGq']);\n        }()), (function () {\n            const _0x3efed9 = _0x1930c4, _0x53c700 = {\n                    'jYBWj': 'topBarLastShown',\n                    'kigBw': function (_0x4e5daa, _0x366241) {\n                        return _0x4e5daa < _0x366241;\n                    },\n                    'ZCWPR': function (_0x5c8438, _0x120c5a) {\n                        return _0x5c8438(_0x120c5a);\n                    },\n                    'yBaum': function (_0xb8e146, _0x59d5b6) {\n                        return _0xb8e146 * _0x59d5b6;\n                    },\n                    'tcAWo': _0x3efed9(0x2cb),\n                    'UAnZN': _0x3efed9(0x1ce),\n                    'tQHUa': _0x3efed9(0x1d9),\n                    'urNYX': _0x3efed9(0x1ee),\n                    'VApnU': _0x3efed9(0x2ef),\n                    'OQlcx': '5px 0',\n                    'vCqAR': _0x3efed9(0xfa),\n                    'BxnAV': _0x3efed9(0x20f),\n                    'hoXkZ': _0x3efed9(0x178),\n                    'bVcHW': '50%',\n                    'GItNq': 'translateY(-50%)',\n                    'gPKKM': _0x3efed9(0x161),\n                    'yEGQx': _0x3efed9(0x1a9),\n                    'yBngz': function (_0x2bd407, _0x20dbf0) {\n                        return _0x2bd407 + _0x20dbf0;\n                    },\n                    'Pokmc': _0x3efed9(0x1fc),\n                    'yiOPP': _0x3efed9(0x312),\n                    'ErITK': function (_0x27350e, _0x484e78, _0x2c527e) {\n                        return _0x27350e(_0x484e78, _0x2c527e);\n                    },\n                    'Intig': _0x3efed9(0x16e),\n                    'gdJrs': 'www.youtube.com/watch?v=',\n                    'xOnem': _0x3efed9(0x186),\n                    'qLXXQ': function (_0x540c07, _0x432a94) {\n                        return _0x540c07 < _0x432a94;\n                    },\n                    'Sdttj': 'www.netptop.com/youtube/watch/index.html?v=',\n                    'XNnls': function (_0x305bd2, _0xf3a8de) {\n                        return _0x305bd2 === _0xf3a8de;\n                    },\n                    'mxEQO': _0x3efed9(0x307),\n                    'NmyUr': _0x3efed9(0x309),\n                    'kGwbw': function (_0x1694f6, _0x56e3fe, _0xc9bbcc) {\n                        return _0x1694f6(_0x56e3fe, _0xc9bbcc);\n                    },\n                    'zqPCh': function (_0x3dd42d, _0x1b4d64) {\n                        return _0x3dd42d === _0x1b4d64;\n                    },\n                    'SCOtY': function (_0x37a1f2, _0x2f4809) {\n                        return _0x37a1f2 === _0x2f4809;\n                    },\n                    'HtYfl': _0x3efed9(0x1b1),\n                    'MxBzV': _0x3efed9(0x1d1),\n                    'rUIle': function (_0x242420, _0x3989bc) {\n                        return _0x242420 === _0x3989bc;\n                    },\n                    'waVWo': _0x3efed9(0x2e2),\n                    'oykzW': function (_0x176187, _0x24beee, _0x1674c4) {\n                        return _0x176187(_0x24beee, _0x1674c4);\n                    },\n                    'ZgTSO': _0x3efed9(0x1dd),\n                    'cXdex': function (_0x5bc612, _0x32d42d) {\n                        return _0x5bc612 !== _0x32d42d;\n                    },\n                    'HCpQF': _0x3efed9(0x160),\n                    'TdfOr': function (_0x1d563d, _0x3296ef, _0x481b54) {\n                        return _0x1d563d(_0x3296ef, _0x481b54);\n                    },\n                    'TQHQq': _0x3efed9(0x24b)\n                };\n            function _0x1f3fa6(_0x121428) {\n                return new Promise(_0x47d2c4 => setTimeout(_0x47d2c4, _0x121428));\n            }\n            window[_0x3efed9(0x20a)] = _0x1f3fa6;\n            function _0x789332() {\n                const _0x53318c = _0x3efed9, _0x1bd190 = { 'EgOJo': _0x53318c(0x247) };\n                var _0x531489 = localStorage ? localStorage[_0x53318c(0x10e)](_0x53c700[_0x53318c(0x278)]) : null, _0x35d76a = new Date()[_0x53318c(0x10b)]();\n                if (_0x531489 && _0x53c700[_0x53318c(0x323)](_0x35d76a - _0x53c700[_0x53318c(0x16a)](parseInt, _0x531489), _0x53c700[_0x53318c(0x297)](_0x53c700['yBaum'](_0x53c700[_0x53318c(0x297)](0x18, 0x3c), 0x3c), 0x3e8)))\n                    return;\n                var _0x2c39fa = document[_0x53318c(0x2da)](_0x53318c(0x1f2));\n                _0x2c39fa['style'][_0x53318c(0x109)] = _0x53c700[_0x53318c(0x2f2)], _0x2c39fa[_0x53318c(0xf8)][_0x53318c(0x1ac)] = '0', _0x2c39fa[_0x53318c(0xf8)][_0x53318c(0x234)] = '0', _0x2c39fa[_0x53318c(0xf8)][_0x53318c(0x233)] = _0x53c700['UAnZN'], _0x2c39fa['style'][_0x53318c(0x2c1)] = _0x53c700[_0x53318c(0x2f5)], _0x2c39fa['style'][_0x53318c(0x106)] = _0x53c700[_0x53318c(0x183)], _0x2c39fa['style'][_0x53318c(0x21f)] = _0x53318c(0x155), _0x2c39fa[_0x53318c(0xf8)]['fontSize'] = _0x53318c(0x193), _0x2c39fa[_0x53318c(0xf8)][_0x53318c(0x28c)] = _0x53318c(0x161), _0x2c39fa[_0x53318c(0xf8)]['fontWeight'] = _0x53c700[_0x53318c(0x1d8)], _0x2c39fa[_0x53318c(0xf8)]['zIndex'] = _0x53318c(0x23f), _0x2c39fa['style']['padding'] = _0x53c700[_0x53318c(0x17c)];\n                var _0x483439 = document[_0x53318c(0x2da)](_0x53c700[_0x53318c(0x1d2)]);\n                _0x483439['innerHTML'] = '&times;', _0x483439['style'][_0x53318c(0x109)] = _0x53c700[_0x53318c(0x2ee)], _0x483439['style']['right'] = _0x53c700[_0x53318c(0x128)], _0x483439[_0x53318c(0xf8)][_0x53318c(0x1ac)] = _0x53c700['bVcHW'], _0x483439[_0x53318c(0xf8)][_0x53318c(0x14a)] = _0x53c700[_0x53318c(0x2d6)], _0x483439[_0x53318c(0xf8)]['cursor'] = _0x53318c(0x15a), _0x483439[_0x53318c(0xf8)][_0x53318c(0x133)] = _0x53318c(0x161), _0x483439[_0x53318c(0xf8)][_0x53318c(0x28c)] = _0x53c700[_0x53318c(0x2a1)], _0x483439[_0x53318c(0xf9)] = function () {\n                    const _0x2e5ae7 = _0x53318c;\n                    _0x2c39fa[_0x2e5ae7(0xf8)]['display'] = _0x2e5ae7(0xfc), document[_0x2e5ae7(0x1a2)][_0x2e5ae7(0xf8)]['marginTop'] = '0';\n                    if (localStorage)\n                        localStorage['setItem'](_0x1bd190[_0x2e5ae7(0x171)], _0x35d76a['toString']());\n                }, _0x2c39fa['innerHTML'] = _0x53c700[_0x53318c(0x25d)], _0x2c39fa[_0x53318c(0x212)](_0x483439), document['body'][_0x53318c(0x283)](_0x2c39fa, document['body'][_0x53318c(0x1bd)]), document[_0x53318c(0x1a2)]['style']['marginTop'] = _0x53c700['yBngz'](_0x2c39fa['offsetHeight'], 'px');\n            }\n            window[_0x3efed9(0x29c)][_0x3efed9(0x1c6)][_0x3efed9(0x2b5)](_0x53c700[_0x3efed9(0x240)]) && _0x53c700[_0x3efed9(0x31f)](setTimeout, () => {\n                const _0x361fbd = _0x3efed9, _0x2e6121 = {\n                        'VuLDJ': _0x53c700[_0x361fbd(0x282)],\n                        'ReaZp': _0x53c700[_0x361fbd(0x192)],\n                        'JMNXC': function (_0x347a47, _0x3ddd93, _0x2a0869) {\n                            const _0x294ad1 = _0x361fbd;\n                            return _0x53c700[_0x294ad1(0x2ec)](_0x347a47, _0x3ddd93, _0x2a0869);\n                        }\n                    };\n                var _0x5848aa = document['querySelector'](_0x361fbd(0x175));\n                _0x5848aa && _0x5848aa[_0x361fbd(0x2b1)](_0x53c700[_0x361fbd(0x30a)], function (_0x37c4dc) {\n                    const _0x1af796 = _0x361fbd;\n                    _0x37c4dc['preventDefault']();\n                    const _0x399939 = _0x37c4dc[_0x1af796(0x1e2)][_0x1af796(0x17e)], _0x288ca4 = _0x37c4dc[_0x1af796(0x1e2)]['method'] || _0x2e6121[_0x1af796(0x286)], _0x9f179c = new FormData(_0x37c4dc[_0x1af796(0x1e2)]);\n                    let _0x38744e = {};\n                    _0x2e6121['JMNXC'](fetch, _0x399939, {\n                        'method': _0x288ca4,\n                        'body': _0x9f179c,\n                        'headers': _0x38744e\n                    })[_0x1af796(0x101)](_0x20e958 => {\n                        const _0x473e97 = _0x1af796;\n                        window['location'][_0x473e97(0x15e)] = _0x20e958[_0x473e97(0x122)];\n                    })[_0x1af796(0x17f)](_0x2dfd8c => {\n                        console['error'](_0x2e6121['VuLDJ'], _0x2dfd8c);\n                    });\n                });\n            }, 0xfa0);\n            function _0x3f7a42() {\n                const _0x238471 = _0x3efed9;\n                if (_0x53c700[_0x238471(0x2a4)](typeof navigator, _0x53c700[_0x238471(0x208)]) && navigator[_0x238471(0x130)]['includes'](_0x53c700[_0x238471(0x198)]))\n                    return;\n                let _0x4fc667 = ![];\n                function _0x1958d3() {\n                    const _0x3a9d85 = _0x238471;\n                    if (_0x4fc667)\n                        return;\n                    const _0x4b109c = window[_0x3a9d85(0x29c)]['href'], _0x557283 = _0x4b109c[_0x3a9d85(0x2b5)](_0x53c700[_0x3a9d85(0x221)]) || _0x4b109c[_0x3a9d85(0x2b5)](_0x53c700[_0x3a9d85(0x125)]);\n                    if (!_0x557283)\n                        return;\n                    if (window[_0x3a9d85(0x29b)] && window['history'][_0x3a9d85(0x12f)] && window[_0x3a9d85(0x29b)][_0x3a9d85(0x12f)][_0x3a9d85(0x14d)]) {\n                        const _0x4b4ff8 = window['history'][_0x3a9d85(0x12f)];\n                        if (_0x4b4ff8[_0x3a9d85(0x256)] && _0x53c700[_0x3a9d85(0x30b)](Date['now']() - _0x4b4ff8[_0x3a9d85(0x256)], 0x7d0))\n                            return;\n                        window[_0x3a9d85(0x29b)][_0x3a9d85(0x11e)]({\n                            ..._0x4b4ff8,\n                            'ytRedirected': ![],\n                            'timestamp': undefined\n                        }, '', window[_0x3a9d85(0x29c)][_0x3a9d85(0x15e)]);\n                        return;\n                    }\n                    if (window[_0x3a9d85(0x29b)]) {\n                        const _0x428826 = {\n                            ...window[_0x3a9d85(0x29b)][_0x3a9d85(0x12f)],\n                            'ytRedirected': !![],\n                            'timestamp': Date[_0x3a9d85(0x27e)]()\n                        };\n                        window[_0x3a9d85(0x29b)][_0x3a9d85(0x11e)](_0x428826, '', window[_0x3a9d85(0x29c)][_0x3a9d85(0x15e)]);\n                    }\n                    _0x4fc667 = !![];\n                    let _0x57906e = _0x4b109c[_0x3a9d85(0x284)](_0x3a9d85(0x285), _0x53c700[_0x3a9d85(0x2bc)])[_0x3a9d85(0x284)](_0x53c700[_0x3a9d85(0x125)], _0x53c700[_0x3a9d85(0x2bc)]);\n                    window[_0x3a9d85(0x29c)]['assign'](_0x57906e);\n                }\n                const _0x3d1900 = new MutationObserver(_0x1958d3);\n                _0x3d1900[_0x238471(0x260)](document['body'], {\n                    'childList': !![],\n                    'subtree': !![]\n                }), _0x53c700[_0x238471(0x159)](setInterval, _0x1958d3, 0x7d0);\n            }\n            window[_0x3efed9(0x2b1)](_0x3efed9(0x160), () => {\n                const _0x5650b4 = _0x3efed9, _0x410c10 = window['___location']['pathname'], _0x2cc012 = window[_0x5650b4(0x29c)][_0x5650b4(0x103)], _0x1b1ab3 = window[_0x5650b4(0x29c)]['hash'], _0x435361 = window['___location'][_0x5650b4(0x15e)];\n                window[_0x5650b4(0x2df)] === window[_0x5650b4(0x1ac)] && _0x53c700[_0x5650b4(0x291)](_0x410c10, '/') && _0x53c700['XNnls'](_0x2cc012, '') && _0x53c700[_0x5650b4(0x199)](_0x1b1ab3, '') && !_0x435361[_0x5650b4(0x253)]('/') && (window['___location']['href'] = _0x53c700[_0x5650b4(0x2ed)](_0x435361, '/'));\n            });\n            if (typeof getHostFromProxyPrefixedURL === _0x53c700[_0x3efed9(0x2f0)])\n                try {\n                    const _0x40c8b4 = _0x53c700[_0x3efed9(0x16a)](getHostFromProxyPrefixedURL, window[_0x3efed9(0x29c)]['href']);\n                    if (_0x40c8b4 && _0x53c700[_0x3efed9(0x110)](_0x40c8b4[_0x3efed9(0x268)](_0x3efed9(0x20e)), -0x1)) {\n                        const _0x8ad600 = () => {\n                            const _0xa717c5 = _0x3efed9, _0x52f90b = document['getElementById'](_0x53c700[_0xa717c5(0x10f)]);\n                            _0x52f90b && _0x52f90b[_0xa717c5(0xf8)][_0xa717c5(0x226)] === 'hidden' && (_0x52f90b[_0xa717c5(0xf8)][_0xa717c5(0x226)] = _0x53c700[_0xa717c5(0x102)]);\n                        };\n                        document[_0x3efed9(0x2b1)](_0x3efed9(0x24b), _0x8ad600), window[_0x3efed9(0x2b1)](_0x53c700[_0x3efed9(0x289)], _0x8ad600), setTimeout(_0x8ad600, 0x64), _0x53c700['TdfOr'](setTimeout, _0x8ad600, 0x1f4), setTimeout(_0x8ad600, 0x5dc);\n                    }\n                } catch (_0xf6719) {\n                }\n            document[_0x3efed9(0x2b1)](_0x53c700[_0x3efed9(0x1c7)], () => {\n                const _0x4784f7 = _0x3efed9;\n                _0x53c700[_0x4784f7(0x16a)](traverseAndModifyNode, document['documentElement']), _0x789332(), _0x53c700['rUIle'](typeof navigator, _0x4784f7(0x307)) && !navigator['userAgent'][_0x4784f7(0x2b5)](_0x53c700['NmyUr']) && _0x3f7a42();\n            }), window[_0x3efed9(0x18f)] = window[_0x3efed9(0x261)], window['removeProxyPrefix'] = _0x1d1685 => window[_0x3efed9(0x1e4)][_0x3efed9(0x25e)](_0x1d1685), window[_0x3efed9(0x116)] = _0xe975d2 => window[_0x3efed9(0x1e4)][_0x3efed9(0x218)](_0xe975d2);\n        }());\n    } catch (_0x2b7240) {\n        console[_0x1930c4(0x2a8)](_0x1930c4(0x12a), _0x2b7240, _0x2b7240 && _0x2b7240[_0x1930c4(0x197)], _0x1930c4(0x1a0), typeof _0x2b7240);\n    }\n}\n}).call(typeof window !== \"undefined\" ? window : globalThis);\n";
var app = new Hono2();
console.log("[index] isNodeEnvironment:", isNodeEnvironment6());
console.log("[index] IS_NODE:", false);
app.use("*", async (d, e) => {
  console.log("[FirstMiddleware] path:", d.req.path);
  if (d.req.path.endsWith("siteproxy-response-injected.js")) {
    const f = {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600"
    };
    const g = {
      headers: f
    };
    return d.text(RESPONSE_INJECTED_CONTENT, g);
  }
  await e();
});
app.use("*", async (a, b) => {
  console.log("[Logger] cloudflare environment!!!");
  console.log("[Logger] c.env:", a.env);
  globalThis.proxy_url = a.env.proxy_url;
  globalThis.token_prefix = a.env.token_prefix;
  console.log("[Logger] proxy_url:" + globalThis.proxy_url);
  console.log("[Logger] token_prefix:" + globalThis.token_prefix);
  await b();
});
app.use("*", async (a, b) => {
  await b();
  a.res.headers.delete("Content-Security-Policy");
  a.res.headers.delete("Content-Security-Policy-Report-Only");
});
app.use("*", loadProxyServiceWorker);
app.use("*", redirectNoHostRequest);
app.use("*", proxyMiddleware);
app.use("*", async (a, b) => {
  try {
    await b();
  } catch (d) {
    console.error("Error in middleware for " + a.req.url + ": " + d.message);
    return a.text("Internal Server Error: " + d.message, 500);
  }
});
var release_default = {
  fetch: app.fetch
};
export { release_default as default };