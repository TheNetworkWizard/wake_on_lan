
import Index from "./views/Index.js";
import Server from "./views/Server.js";
import Error from "./views/Error.js";
import { store } from "./state/store.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map (result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
}

const router = async () => {
  store.setState({runTimers: false});

  const routes = [
    { path: "/error", view: Error},
    { path: "/", view: Index },
    { path: "/server/:server_name", view: Server }
  ];

  // Test each route for potential match
  const potentialMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    }
  })

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: location.pathname,
      error: 404,
    }
  }

  const view = new match.route.view(getParams(match));

  const app = document.getElementById("app");

  app.innerHTML = '';

  app.append(await view.render());  
}

window.addEventListener("popstate", router);

console.log("Loading");

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {  
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
}, false);

