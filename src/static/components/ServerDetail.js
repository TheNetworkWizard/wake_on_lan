import { apiService } from "../services/api.service.js";
import { store } from "../state/store.js";

export async function ServerDetail(server, store) {
    console.log(server);
    console.log(store);
    console.log(`Getting server details for ${server.name}`)
    const div = document.createElement("div");

    console.log(store.state);

    let server_details = await getServerDetails(server.name);

    store.subscribe((e) => {
        if(server_details.status != store.state.servers[server_name].status) {
            console.log(`State change event for Server ${server_name} - ${store.state.servers[server_name].status}`)
            render(div, store.state.servers[server_name], store);
            server.status = store.state.servers[server_name].status;
        }
    });

    render(div, server_details, store);


    return div;
}

function render(div, server, store) {
    console.log('render div');
    const controls = document.createElement("div");

    if (server.status === null) {
        server.status = "Loading...";
    } else {
        if (server.status) {
            console.log("Server is online")
            controls.innerHTML = "Power Off";
            div.addEventListener('click', function() {
                PowerOffServer(server, store);
            });
        } else if (!server.status) {
            controls.innerHTML = "Power On";
            div.addEventListener('click', function() {
                PowerOnServer(server, store);
            });
        } else if (server_details.status == 2) {
            controls.innerHTML = "Loading...";
        }
    }
    
    div.innerHTML = `${server.name} - ${server.address}<br />`;

    div.append(controls);

    div.innerHTML += `<a href="/" data-link>Back</a>`;
}

async function getServerDetails(server_name) {
    const details = await apiService.request(`/getServerStatus/${server_name}`)
    .then((responseJSON) => {
        return responseJSON;
    });
    return details;
}

async function PowerOnServer(server, store){
    console.log(server);
    console.log(server["name"]);
    //window.location.href = `/server/${server.name}`
    console.log(`Power On ${server.name} - ${server.status}`);
    store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: true}}});
}

function PowerOffServer(server, store){
    console.log(`Power Off ${server.name} - ${server.status}`);
    store.setState({servers: {[server.name]: {address: server.address, name: server.name, status: false}}});
}
