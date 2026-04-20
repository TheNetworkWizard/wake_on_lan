import { apiService } from "../services/api.service.js";
import { store } from "../state/store.js";
import { navigateTo } from "../utils/router.js";

export async function ServerDetail(server, store) {
    console.log(`Getting server details for ${server}`)
    const div = document.createElement("div");

    let server_details = await getServerDetails(server);
    render(div, server_details, store);

    return div;
}

function render(div, server, store) {
    const controls = document.createElement("div");

    if (server.status === null) {
        server.status = "Loading...";
    } else {
        if (server.status) {
            console.log("Server is online")
            controls.innerText = "Power Off";
            controls.addEventListener('click', function() {
                console.log("Power off click");
                controls.innerText = "Loading...";
                PowerOffServer(server, store);
                //controls.innerText = "Power On";
            });
        } else if (!server.status) {
            controls.innerText = "Power On";
            controls.addEventListener('click', function() {
                console.log("Power on click");
                controls.innerText = "Loading...";
                PowerOnServer(server, store);
                
            });
        } else if (server_details.status == 2) {
            controls.innerHTML = "Loading...";
        }
    }
    
    div.innerHTML = `${server.server_name} - ${server.server_ip}<br />`;

    div.append(controls);

    const backButton = document.createElement("div")

    backButton.innerHTML = `<br /><a href="/" data-link>Back</a>`;

    div.append(backButton);

    
}

async function getServerDetails(server_name) {
    const details = await apiService.request(`/getServerStatus/${server_name}`)
    .then((responseJSON) => {
        return responseJSON;
    });
    return details;
}

async function PowerOnServer(server, store){
    //window.location.href = `/server/${server.name}`
    console.log(`Power On ${server.server_name} - ${server.status} 2`);
    const server_state = await apiService.request(`/startServer/${server.server_name}`)
        .then((responseJSON) => {
            return responseJSON;
    });

    store.setState({servers: {[server.server_name]: {address: server.server_ip, name: server.server_name, status: true}}});
    

    await new Promise(r => setTimeout(r, 2000));

    console.log('Sleep finish');
    window.router.findRoute("/");
}

async function PowerOffServer(server, store){
    console.log(`Power Off ${server.server_name} - ${server.status}`);

    const server_state = await apiService.request(`/stopServer/${server.server_name}`)
        .then((responseJSON) => {
            return responseJSON;
    });
    store.setState({servers: {[server.server_name]: {address: server.server_ip, name: server.server_name, status: false}}});
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Sleep finish');
    window.router.findRoute("/");


}
