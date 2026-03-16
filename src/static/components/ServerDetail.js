import { apiService } from "../services/api.service.js";
import { store } from "../state/store.js";

export async function ServerDetail(server_name) {
    console.log(`Getting server details for ${server_name}`)
    const div = document.createElement("div");
    store.setState({runTimers: false});
    

    console.log();
    
    div.innerHTML = `${server_name} - ${await getServerDetails(server_name)} <br /><a href="/" data-link>Back</a>`;

    return div;
}

async function getServerDetails(server_name) {
    const details = await apiService.request(`/getServerStatus/${server_name}`)
    .then((responseJSON) => {
        return responseJSON;
    });
    return JSON.stringify(details);
}
