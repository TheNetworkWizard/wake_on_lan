
import { store } from "./state/store.js";
import routes from "./utils/routes.js";
import router from './utils/router.js';

const app = document.getElementById("app");

window.router = new router(app);

window.addEventListener("popstate", e => {
  window.router;
});

console.log("Loading");

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener("click", e => {
    console.log(`Click Event ${e.target}`);
    if (e.target.matches("[data-link]")) {  
      e.preventDefault();
      window.history.pushState(null, null, e.target);
      window.router.findRoute();
    }
  });
  window.router.findRoute();
}, false);

