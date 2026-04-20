import Index from "../views/Index.js";
import Server from "../views/Server.js";
import AddServer from "../views/AddServer.js"
import Error from "../views/Error.js";

const routes = [
    { 
        path: "/error", 
    view: Error
    },
    { path: "/", view: Index },
    { path: "/server/:server_name", view: Server },
    { path: "/addServer", view: AddServer}, 
    { path: "/error/:error_code", view: Error}
  ];

export default routes;