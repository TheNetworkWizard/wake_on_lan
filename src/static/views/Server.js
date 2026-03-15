import AbstractView from "./AbstractView.js";

import { store } from "../state/store.js";
import { apiService } from "../services/api.service.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN Server");
    }

    async getHtml() {
        const server_list = await apiService.request(`/getServerStatus/${this.params.server_name}`)
        .then((responseJSON) => {
            return responseJSON;
            store.setState({loading: false, servers: responseJSON});
            return ServerList(responseJSON, store);
        });
        console.log(server_list);
        return JSON.stringify(server_list);
        return `Server Page ${this.params.server_name}`;
    }
}