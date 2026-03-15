import AbstractView from "./AbstractView.js";

import { store } from "../state/store.js";
import { ServerList } from "../components/ServerList.js";
import { apiService } from "../services/api.service.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN Server");
    }

    async getHtml() {
        //store.setState({loading: true});
        const server_list = await apiService.request("/getServerList")
        .then((responseJSON) => {
            store.setState({loading: false, servers: responseJSON});
            return ServerList(responseJSON, store);
        });
        return server_list;
    }

    render(state) {
        if (state.loading) {
            return "<p>Loading...</p>";
        }
        if (state.error) {
            return `<p class="error">${state.error}</p>`;
        }
        if(state.servers) {
            return "Hello World"; 
            return app.appendChild(ServerList(state.servers, store));
        }    
    }
}