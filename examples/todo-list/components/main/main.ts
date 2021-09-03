import { h } from "../../../../src/render/h";
import { TodoList } from "../todo-list/todo_list";

export const Main = h("section", { class: "main" }, [TodoList]);
