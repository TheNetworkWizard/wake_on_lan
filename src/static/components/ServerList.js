import { Server } from "./Server.js"

export function ServerList(servers, store) {
  const container = document.createElement("div");
  container.className = "server-list";

  container.innerHTML = `
    <div style="margin: 0px auto; width: 90%;">

    <div style="line-height: 30px; text-align: center; font-size: 30px; padding: 20px;">
      <a href="/" data-link>LAB Server Status</a>
    </div>
    
    <h2>Servers</h2>
  `
  store.setState({runTimers: true});
  Object.keys(servers).forEach(function(key) {
      container.appendChild(Server(servers[key], store))
  });

  
  return container;
}




