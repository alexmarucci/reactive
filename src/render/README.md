# Render

A hyperscript function for creating native DOM elements

```js
import { h, render } from "render/h";

const div = h("div", { class: "container" }, [h("h1", "Hello")]);

render(div, document.body);
```

Bind events

```js
// Equivalent to div.addEventListener('click', console.log);
const div = h("div", { onclick: console.log });
```

A wrapper function to create custom tags or wrap

```js
import { div, h1 } from "h/dom";

const app = div({ class: "container" }, [h1("Hello")]);

render(app, document.body);
```

Custom tags

```js
import { h, div } from "h/dom";

const container = h(div({ class: "container" }));
const title = h("h1", { class: "title" };
// Access native node
console.log(title.node);

// <div class="container><h1 class="title">Hello</h1></div>
const app = container([title("Hello")]);

render(app);
```
