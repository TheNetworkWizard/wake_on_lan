import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Wake On LAN");
    }   

    async render() {

        if (this.params.error == 404) {
           // window.location.href = "/error/404";
            return `404 Not Found - ${params.href}`;
        }

        if (this.params.error == 403) {
            return "403 Not Authorised";
        }
        
    }
}