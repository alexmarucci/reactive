import { h, render } from "../../src/render/h";
import { HeaderElement } from "./components/header/header.view";

render(h("section", { class: "todoapp" }, [HeaderElement()]), document.body);
