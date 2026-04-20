import routes from './routes.js'
import { store } from "../state/store.js";

export default class Router {
	constructor() {
		console.log("router running");
	}

	getParams = match => {
	  const values = match.result.slice(1);
	  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map (result => result[1]);

	  const params =  Object.fromEntries(keys.map((key, i) => {
	    console.log(`${key} - ${values[i]}`); 
	    return [key, values[i]];
	  }));

	  if ('error' in match) {
	    params.href = match.result;
	    params.error = match.error;
	  }

	  return params;
	};

	pathToRegex(path) {
		let regex = new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
		return regex
	}

	async findRoute(path) {
		if(typeof(path) === 'undefined') {
			path = window.location.pathname;
		}

		console.log(`Finding route to ${path}`);
		store.setState({runTimers: false});

		const potentialMatches = routes.map(route => {
		    return{
		      route: route,
		      result: path.match(this.pathToRegex(route.path))
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

		history.pushState(null, null, path);

		const view = new match.route.view(this.getParams(match));

		const output = await view.render();

		app.innerHTML = '';
		if(typeof(output) === 'object') {
		  app.append(output);
		} else if (typeof(output) === 'string') {
		  app.innerHTML = output;
		}


	}

	

	
}

export const navigateTo = url => {
	  history.pushState(null, null, url);
	  router();
	}


const router = async () => {
  
  // Test each route for potential match
  

  console.log(match);


}

