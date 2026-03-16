import { apiService } from "../services/api.service.js";

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
    console.log(`Rendering ${server.name}`);

    
    const controls = document.createElement("span");

    if (server.status === null) {
    server.status = "Loading...";
    } else {
    if (server.status == 1) {
        div.classList.add("server-online")
        controls.innerHTML = "Power Off";
        div.addEventListener('click', function() {
            PowerOffServer(server, store);
        });
    } else if (server.status == 0) {
        div.classList.add("server-offline")
        controls.innerHTML = "Power On";
        div.addEventListener('click', function() {
            PowerOnServer(server, store);
        });
    } else if (server.status == 2) {
        controls.innerHTML = "Loading...";
    }
    }

    div.innerHTML = `<b><a href="/server/${server.name}" data-link>${server.name}</a></b> `;
    div.append(controls);
    return div;
}

async function PowerOnServer(server, store){
    console.log(`Power On ${server.name} - ${server.status}`);
    store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: 1}}});
}

function PowerOffServer(server, store){
    console.log(`Power Off ${server.name} - ${server.status}`);
    store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: 0}}});
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
