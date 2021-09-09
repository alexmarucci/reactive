import { h as hh } from "./h";

export const svg = (...args) => hh("svg", ...args);
export const a = (...args) => hh("a", ...args);
export const abbr = (...args) => hh("abbr", ...args);
export const address = (...args) => hh("address", ...args);
export const area = (...args) => hh("area", ...args);
export const article = (...args) => hh("article", ...args);
export const aside = (...args) => hh("aside", ...args);
export const audio = (...args) => hh("audio", ...args);
export const b = (...args) => hh("b", ...args);
export const base = (...args) => hh("base", ...args);
export const bdi = (...args) => hh("bdi", ...args);
export const bdo = (...args) => hh("bdo", ...args);
export const blockquote = (...args) => hh("blockquote", ...args);
export const body = (...args) => hh("body", ...args);
export const br = (...args) => hh("br", ...args);
export const button = (...args) => hh("button", ...args);
export const canvas = (...args) => hh("canvas", ...args);
export const caption = (...args) => hh("caption", ...args);
export const cite = (...args) => hh("cite", ...args);
export const code = (...args) => hh("code", ...args);
export const col = (...args) => hh("col", ...args);
export const colgroup = (...args) => hh("colgroup", ...args);
export const dd = (...args) => hh("dd", ...args);
export const del = (...args) => hh("del", ...args);
export const dfn = (...args) => hh("dfn", ...args);
export const dir = (...args) => hh("dir", ...args);
export const div = (...args) => hh("div", ...args);
export const dl = (...args) => hh("dl", ...args);
export const dt = (...args) => hh("dt", ...args);
export const em = (...args) => hh("em", ...args);
export const embed = (...args) => hh("embed", ...args);
export const fieldset = (...args) => hh("fieldset", ...args);
export const figcaption = (...args) => hh("figcaption", ...args);
export const figure = (...args) => hh("figure", ...args);
export const footer = (...args) => hh("footer", ...args);
export const form = (...args) => hh("form", ...args);
export const h1 = (...args) => hh("h1", ...args);
export const h2 = (...args) => hh("h2", ...args);
export const h3 = (...args) => hh("h3", ...args);
export const h4 = (...args) => hh("h4", ...args);
export const h5 = (...args) => hh("h5", ...args);
export const h6 = (...args) => hh("h6", ...args);
export const head = (...args) => hh("head", ...args);
export const header = (...args) => hh("header", ...args);
export const hgroup = (...args) => hh("hgroup", ...args);
export const hr = (...args) => hh("hr", ...args);
export const html = (...args) => hh("html", ...args);
export const i = (...args) => hh("i", ...args);
export const iframe = (...args) => hh("iframe", ...args);
export const img = (...args) => hh("img", ...args);
export const input = (...args) => hh("input", ...args);
export const ins = (...args) => hh("ins", ...args);
export const kbd = (...args) => hh("kbd", ...args);
export const keygen = (...args) => hh("keygen", ...args);
export const label = (...args) => hh("label", ...args);
export const legend = (...args) => hh("legend", ...args);
export const li = (...args) => hh("li", ...args);
export const link = (...args) => hh("link", ...args);
export const main = (...args) => hh("main", ...args);
export const map = (...args) => hh("map", ...args);
export const mark = (...args) => hh("mark", ...args);
export const menu = (...args) => hh("menu", ...args);
export const meta = (...args) => hh("meta", ...args);
export const nav = (...args) => hh("nav", ...args);
export const noscript = (...args) => hh("noscript", ...args);
export const object = (...args) => hh("object", ...args);
export const ol = (...args) => hh("ol", ...args);
export const optgroup = (...args) => hh("optgroup", ...args);
export const option = (...args) => hh("option", ...args);
export const p = (...args) => hh("p", ...args);
export const param = (...args) => hh("param", ...args);
export const pre = (...args) => hh("pre", ...args);
export const progress = (...args) => hh("progress", ...args);
export const q = (...args) => hh("q", ...args);
export const rp = (...args) => hh("rp", ...args);
export const rt = (...args) => hh("rt", ...args);
export const ruby = (...args) => hh("ruby", ...args);
export const s = (...args) => hh("s", ...args);
export const samp = (...args) => hh("samp", ...args);
export const script = (...args) => hh("script", ...args);
export const section = (...args) => hh("section", ...args);
export const select = (...args) => hh("select", ...args);
export const small = (...args) => hh("small", ...args);
export const source = (...args) => hh("source", ...args);
export const span = (...args) => hh("span", ...args);
export const strong = (...args) => hh("strong", ...args);
export const style = (...args) => hh("style", ...args);
export const sub = (...args) => hh("sub", ...args);
export const sup = (...args) => hh("sup", ...args);
export const table = (...args) => hh("table", ...args);
export const tbody = (...args) => hh("tbody", ...args);
export const td = (...args) => hh("td", ...args);
export const textarea = (...args) => hh("textarea", ...args);
export const tfoot = (...args) => hh("tfoot", ...args);
export const th = (...args) => hh("th", ...args);
export const thead = (...args) => hh("thead", ...args);
export const title = (...args) => hh("title", ...args);
export const tr = (...args) => hh("tr", ...args);
export const u = (...args) => hh("u", ...args);
export const ul = (...args) => hh("ul", ...args);
export const video = (...args) => hh("video", ...args);
export const h = (elname, ...args) => {
  const el = hh(elname, ...args);

  function func(...xargs) {
    return hh(el, ...xargs);
  }
  func.node = el;

  return func;
};
