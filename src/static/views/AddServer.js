import AbstractView from "./AbstractView.js";

import { store } from "../state/store.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN Server");
    }

    async render() {

        return `<h1>Add Server</h1>`;
    }
}