class Store {
  constructor() {
    this.state = {
      servers: {},
      loading: false,
      error: null,
    };
    this.listeners = [];

  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      if(typeof(value) == "object") {
        this.state[key] = { ...this.state[key], ...value };
      } else {
        this.state[key] = value;
      }
      /*
      if(key == "servers"){
        //console.log("server state")
        //console.log(value);
        //console.log(this.state)
        this.state['servers'] = { ...this.state['servers'], ...value };
        //console.log("updated"); 
        //console.log(this.state)
      } else {
        this.state[key] = value;
      }*/
    }
    //console.log(this.state);
    //console.log(newState);
    //this.state = { ...this.state, ...newState };
    //  console.log(this.state);

    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return this.state;
  }
}

export const store = new Store();
