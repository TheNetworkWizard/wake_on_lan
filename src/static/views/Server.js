import AbstractView from "./AbstractView.js";
import { ServerDetail } from "../components/ServerDetail.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN Server");
    }

    async getHtml() {
        return ServerDetail(this.params.server_name);
    }
}