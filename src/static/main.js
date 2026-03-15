import { store } from "./state/store.js";
import { ServerList } from "./components/ServerList.js";
import { apiService } from "./services/api.service.js";

const app = document.getElementById("app");

//store.subscribe(render);

console.log("Loading");

document.addEventListener('DOMContentLoaded', function() {
   store.setState({loading: true});
   const server_list = apiService.request("/getServerList")
    .then((responseJSON) => {
       store.setState({loading: false, servers: responseJSON});
       render(store.state)
    });
}, false);

function render(state) {
  app.innerHTML = "";

  if (state.loading) {
    app.innerHTML = "<p>Loading...</p>";
    return;
  }

  if (state.error) {
    app.innerHTML = `<p class="error">${state.error}</p>`;
    return;
  }
  console.log(state.servers);
  if(state.servers) {
    app.appendChild(ServerList(state.servers, store));
  }

  
}