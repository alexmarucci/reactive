# Observable Render bindings

Bind text

```js
import { bindText } from "core/dom-utils";
import { h1 } from "render/dom";

const [count] = observable(0);

// Changes the text content every time count is updated
h1(bindText`Count is ${count}`);
```

Bind Class

```js
const [isActive, setIsActive] = observable(false);
const activeClass = () => (isActive() ? "active" : "");

div({ class: bindClass`${activeClass}` });

// side effect -> div.classlist.add('active')
setIsActive(true);
```

Bind attributes and properties

```js
const [name, setName] = observable("Foo");
const hasName = computed(() => name().length > 0);

h("input", { value: bindToProperty(name) });
h("input", { active: bindToAttribute(hasName) });
```

Binds to children elements

```js
const [isLoggedIn] = observable(false);

h("div", [
  header,
  children(() => isLoggedIn() && h1(`Welcome back ${username}!`),
 ]);
```

Handles Observable Arrays

```js
// given an array of objects
const todos$ = observableArray([{ text: "Todo 1" }, { text: "Todo 2" }]);

// you'd want to manually track changes in the actual elements
// when these are objects so that the map function is not re-computed
// by observing the single objects of the Array
function todo_component(todo) {
  const { text } = todos$.observe(todo);

  // now when we change a text of one todo
  // only the text content of this element will update
  // as oppose to re-run the entire function and
  // re-create this dom tree
  return h1(bindText`- ${text}`);
}

// this map functions is only ran once for new elements
// while we are able to observe the single item directly
// in the child component
forEach(todos$, (todo) => todo_component(todo));
// OR
forEach(todos$, todo_component);

// The same applies for a given array of primitive values
const numbers$ = observableArray([1, 2, 3, 4, 5]);

function title(number) {
  const { number } = numbers$.observe({ number });

  return h1(bindText`My number is ${number}`);
}

// We can  map function re-runs only for newly added elements
div([forEach(numbers$, (number) => title(number))]);

// side effect -> relevant_h1.textContent = 30;
numbers$.replace(3, 30);

// Almost never recommended but you could enable changeDetection
// which re-runs the map function also for element changes
forEach(numbers$, (number) => h1("My number is " + number), {
  changeDetection: true
});
```
