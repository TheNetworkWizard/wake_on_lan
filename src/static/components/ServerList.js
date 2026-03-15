import { Server } from "./Server.js"
import { apiService } from "../services/api.service.js";

function setState(server, store) {
    console.log(store.servers);
}

export function ServerList(servers, store) {
  /*store.subscribe((e) => {
    console.log("Refreshing server list");
  });*/
  const container = document.createElement("div");
  Object.keys(servers).forEach(function(key) {
      container.appendChild(Server(servers[key], store))
    });

  return container;
}




