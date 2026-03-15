
import Index from "./views/Index.js";
import Server from "./views/Server.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
  console.log(match);
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map (result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));

  console.log( Array.from(match.route.path.matchAll(/:(\w+)/g)));
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
}

const router = async () => {
  const routes = [
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
      result: location.pathname
    }
  }

  const view = new match.route.view(getParams(match));

  const app = document.getElementById("app");
   console.log(app.hasChildNodes());
  if(!app.hasChildNodes()) {
    app.replaceChildren(await view.getHtml());
  }
  console.log(app.hasChildNodes());

  
}

window.addEventListener("popstate", router);

const app = document.getElementById("app");

console.log("Loading");

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      
      e.preventDefault();
      const app = document.getElementById("app");
      if(app.hasChildNodes()) {
        while (app.firstChild) {
          app.removeChild(app.lastChild);
        }
      }
      navigateTo(e.target.href);
    }
  });
  router();
}, false);

