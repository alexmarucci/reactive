import m from "mithril";

export default m("header", { class: "header" }, [
  m("h1", "todos"),
  m("input", {
    class: "new-todo",
    placeholder: "What needs to be done?"
  })
]);
