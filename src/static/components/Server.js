import { apiService } from "../services/api.service.js";
import { ServerDetail } from "./ServerDetail.js";

let refresh_interval = null;

export function Server(server, store) {
    console.log(server);
    //console.log(`Adding server ${server.server_name} - ${server.status}`);
    const div = document.createElement("div");
    div.className = "server-container";

    let refresh_interval = refreshStatus(server, store);

    store.subscribe((e) => {
        console.log(store.state.servers[server.server_name])
        if(server.status != store.state.servers[server.server_name].status) {
            console.log(`State change event for Server ${server.server_name} - ${store.state.servers[server.server_name].status}`)
            render(div, store.state.servers[server.server_name], store);
            server.status = store.state.servers[server.server_name].status;
        }
        if(!store.state.runTimers && refresh_interval) {
            console.log(`Stopping timer for ${server.server_name}`);
            clearInterval(refresh_interval);
            refresh_interval = null;
        }
    });
    render(div, server, store);
    
    return div;
}

function render(div, server, store) {
    //console.log(`Rendering ${server.server_name} ${typeof(server.status)}`);

    div.innerHTML = `<a href="/server/${server.server_name}" data-link>${server.server_name}</a>`;

    const controls = document.createElement("span");

    if (server.status === null) {
        server.status = "Loading...";
    } else {
        if (server.status) {
            console.log("Server is online")
            div.classList.add("server-online")
            div.classList.remove("server-offline")
        } else if (!server.status) {
            div.classList.remove("server-online")
            div.classList.add("server-offline")
        } else if (server.status == 2) {
            controls.innerHTML = "Loading...";
        }
    }
    return div;
}

async function getServerDetails(server, store) {
    return ServerDetail(server, store);
}

async function PowerOnServer(server, store){
    //window.location.href = `/server/${server.server_name}`
    console.log(`Power On ${server.server_name} - ${server.status}`);
    //store.setState({servers: {[server.server_name]: {address: server.address, name: server.server_name, status: true}}});
}

function PowerOffServer(server, store){
    console.log(`Power Off ${server.server_name} - ${server.status}`);
    //store.setState({servers: {[server.server_name]: {address: server.address, name: server.server_name, status: false}}});
}

function refreshStatus(server, store) {
    console.log(`Starting timer for ${server.server_name}`);
    let refresh_interval = setInterval(async function(){
        console.log(`refresh ${server.server_name}`);
        const server_status = await apiService.request(`/getServerStatus/${server.server_name}`);
        if (server_status.status != server.status) {
            store.setState({servers: {[server.server_name]: {address: server.address, name: server.server_name, status: server_status.status}}});
        }
    }, 10000);
    return refresh_interval;
}
