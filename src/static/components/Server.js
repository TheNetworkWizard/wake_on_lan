import { apiService } from "../services/api.service.js";

export function Server(server, store) {
    console.log(`Adding server ${server.name} - ${server.status}`);
    const div = document.createElement("div");
    store.subscribe((e) => {      
        if(server.status != store.state.servers[server.name].status) {
            console.log(`State change event for Server ${server.name} - ${store.state.servers[server.name].status}`)
            render(div, store.state.servers[server.name], store);
            server.status = store.state.servers[server.name].status;
        } 
    });
    render(div, server, store);
    refreshStatus(server, store);
    return div;
}

function render(div, server, store) {
    console.log(`Rendering ${server.name}`);

    div.className = "server-container";
    const controls = document.createElement("span");

    if (server.status === null) {
    server.status = "Loading...";
    } else {
    if (server.status == 1) {
        
        controls.innerHTML = "Power Off";
        controls.addEventListener('click', function() {
            PowerOffServer(server, store);
        });
    } else if (server.status == 0) {
        controls.innerHTML = "Power On";
        controls.addEventListener('click', function() {
            PowerOnServer(server, store);
        });
    } else if (server.status == 2) {
        controls.innerHTML = "Loading...";
    }
    }

    div.innerHTML = `<b>${server.name}</b> - <span id="status">${server.status}</span>  - `;
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
    setInterval(async function(){
        const server_status = await apiService.request(`/getServerStatus/${server.name}`);
        if (server_status.status != server.status) {
            store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: server_status.status}}});
        }
    }, 60000);
}
