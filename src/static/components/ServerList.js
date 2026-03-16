import { Server } from "./Server.js"

export function ServerList(servers, store) {
  const container = document.createElement("div");
  container.className = "server-list";
  store.setState({runTimers: true});
  Object.keys(servers).forEach(function(key) {
      container.appendChild(Server(servers[key], store))
  });
  return container;
}




