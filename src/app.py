from flask import Flask, render_template
import os
app = Flask(__name__)

server_list = {
        "zion": {
          "name": "zion",
          "status": False,
          "address": "192.168.1.10",
        },
        "gnosis": {
          "name": "gnosis",
          "status": False,
          "address": "192.168.1.40",
        }
    }     

# Define a route for the root URL
@app.route("/getServerList")
def getServerList():
    return server_list

@app.route("/getServerStatus/<server_name>")
def getServerStatus(server_name):
    return server_list[server_name]

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')


@app.route('/updateStatus')
def updateStatus():
    for server in server_list:
        print(f"Pinging {server_list[server]['name']}")
        server_list[server]['status'] = os.system(f"ping -c 1 {server_list[server]['address']}  &> /dev/null") == False
    return ""


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)