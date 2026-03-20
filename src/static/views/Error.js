import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN");
    }

    async render() {
        return "404 Not Found";
    }
}