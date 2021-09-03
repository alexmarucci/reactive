import { children } from "../../src/core/dom-utils";
import { h, render } from "../../src/render/h";
import { Footer } from "./components/footer/footer";
import { HeaderElement } from "./components/header/header";
import { Main } from "./components/main/main";
import { TodoInput } from "./components/todo-input/input";
import { todoStore } from "./store/todos";

const Container = () => {
  const [{ todos }] = todoStore();

  return h("section", { class: "todoapp" }, [
    HeaderElement,
    h("h1", "TODOS"),
    TodoInput,
    children(() => todos().length && [Main, Footer])
  ]);
};

render(Container(), document.body);
