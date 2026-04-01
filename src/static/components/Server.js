import { apiService } from "../services/api.service.js";
import { ServerDetail } from "./ServerDetail.js";

let refresh_interval = null;

export function Server(server, store) {
    console.log(`Adding server ${server.name} - ${server.status}`);
    const div = document.createElement("div");
    div.className = "server-container";

    let refresh_interval = refreshStatus(server, store);

    store.subscribe((e) => {
        if(server.status != store.state.servers[server.name].status) {
            console.log(`State change event for Server ${server.name} - ${store.state.servers[server.name].status}`)
            render(div, store.state.servers[server.name], store);
            server.status = store.state.servers[server.name].status;
        }
        if(!store.state.runTimers && refresh_interval) {
            console.log(`Stopping timer for ${server.name}`);
            clearInterval(refresh_interval);
            refresh_interval = null;
        }
    });
    render(div, server, store);
    
    return div;
}

function render(div, server, store) {
    console.log(`Rendering ${server.name} ${typeof(server.status)}`);

    div.innerHTML = `<a href="/server/${server.name}" data-link>${server.name}</a>`;

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
    //window.location.href = `/server/${server.name}`
    console.log(`Power On ${server.name} - ${server.status}`);
    //store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: true}}});
}

function PowerOffServer(server, store){
    console.log(`Power Off ${server.name} - ${server.status}`);
    //store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: false}}});
}

function refreshStatus(server, store) {
    console.log(`Starting timer for ${server.name}`);
    let refresh_interval = setInterval(async function(){
        console.log(`refresh ${server.name}`);
        const server_status = await apiService.request(`/getServerStatus/${server.name}`);
        if (server_status.status != server.status) {
            store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: server_status.status}}});
        }
    }, 10000);
    return refresh_interval;
}
