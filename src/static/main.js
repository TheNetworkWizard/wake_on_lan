
import Index from "./views/Index.js";
import Server from "./views/Server.js";
import AddServer from "./views/AddServer.js"
import Error from "./views/Error.js";
import { store } from "./state/store.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
  console.log('getParams');
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map (result => result[1]);

  const params =  Object.fromEntries(keys.map((key, i) => {
    console.log(`${key} - ${values[i]}`); 
    return [key, values[i]];
  }));

  console.log(match);
  if ('error' in match) {
    params.href = match.result;
    params.error = match.error;
  }

  console.log(params);
  return params;
};

export const navigateTo = url => {
  history.pushState(null, null, url);
  router();
}

const router = async () => {
  console.log("router running");
  store.setState({runTimers: false});

  const routes = [
    { path: "/error", view: Error},
    { path: "/", view: Index },
    { path: "/server/:server_name", view: Server },
    { path: "/addServer", view: AddServer}, 
    { path: "/error/:error_code", view: Error}
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

  const output = await view.render();

  app.innerHTML = '';
  if(typeof(output) === 'object') {
    app.append(output);
  } else if (typeof(output) === 'string') {
    app.innerHTML = output;
  }

  



    
}

window.addEventListener("popstate", e => {
  router();
});

console.log("Loading");

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener("click", e => {
    console.log(`Click Event ${e.target}`);
    if (e.target.matches("[data-link]")) {  
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
}, false);

