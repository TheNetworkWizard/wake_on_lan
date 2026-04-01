from flask import Flask, render_template, abort, redirect
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
    if server_name not in server_list:
        abort(404)
    return server_list[server_name]

@app.route("/startServer/<server_name>")
def startServer(server_name):
    if server_name not in server_list:
        abort(404)

    if not server_list[server_name]['status']:
        server_list[server_name]['status'] = True

    return server_list[server_name]


@app.route("/stopServer/<server_name>")
def stopServer(server_name):
    if server_name not in server_list:
        abort(404)

    if server_list[server_name]['status']:
        server_list[server_name]['status'] = False

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
    return redirect("/", code=302)


@app.route('/error/404')
def pageNotFound():
    return render_template('index.html'), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)