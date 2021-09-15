# Reactive Core

## Observable

```js
import { observable, effect } from "core";

const [count, setCount] = observable(0);

const incrementCount = () => setCount(count() + 1);

setInterval(incrementCount, 1000);

effect(() => console.log(count()));
```

Get previous values

```js
import { previousValue } from "core";

const
const [count, setCount] = observable(0);

effect(() => {
  console.log(`Count was ${previousValue(count)} now is ${count()}`);
});

// Logs: Count was 0 now is 10
setCount(10);
```

Computed observables

```js
const [name] = observable("Foo");
const [surname] = observable("Bar");
const fullname = computed(() => `${name()} ${surname()}`);

// logs whenever name or surname change
effect(() => console.log(fullname()));
```

Action wraps multiple observables update in one transaction

```js
const [name, setName] = observable("Foo");
const [surname, setSurname] = observable("Bar");
const fullname = computed(() => `${name()} ${surname()}`);

function updateFullName(newName, newSurname) {
  action(() => {
    setName(newName);
    setSurname(newSurname);
  });
}

effect(() => console.log(fullname()));

// Since we update two observable we should have two logs
// but thanks to action(...) these two updates run together
// in a single transaction giving us only a single log.
updateFullName("John", "Doe");
```

Untrack values

```js
const [name, setName] = observable("Foo");
const [surname, setSurname] = observable("Bar");
const fullname = computed(() => );

function updateFullName(newName, newSurname) {
  action(() => {
    setName(newName);
    setSurname(newSurname);
  });
}

// Runs only when name() changes
effect(() => console.log(`${name()} ${untrack(surname)}`));

// This is equivalent to the above
effect(untrack(() => {
  console.log(`${track(name)} ${surname()}`);
}));
```

Filter effects

```js
import { observable, effect } from "core";

const [count, setCount] = observable(0);

const incrementCount = () => setCount(count() + 1);

setInterval(incrementCount, 1000);

const isEven = () => count() % 2 == 0;

// logs even numbers only
effect(() => console.log(count()), isEven);
```

Handle Async values

```js
waitFor(() => {
  const [posts] = observable(fetch(GET_POSTS_ENDPOINT));

  // This runs once the above promise is resolved
  effect(() => {
    const totalPosts = posts().length;
    console.log(`There is a total number of ${totalPosts} posts`);
  });
});
```
