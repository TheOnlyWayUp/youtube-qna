import { c as create_ssr_component } from "../../chunks/index2.js";
const app = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const prerender = true;
  if ($$props.prerender === void 0 && $$bindings.prerender && prerender !== void 0)
    $$bindings.prerender(prerender);
  return `${slots.default ? slots.default({}) : ``}

<footer class="footer footer-center p-4 bg-base-300 text-base-content"><div class="prose"><p>Youtube QnA<br>TheOnlyWayUp © 2023
    </p></div></footer>`;
});
export {
  Layout as default
};
