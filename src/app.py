from flask import Flask, render_template

app = Flask(__name__)

server_list = {
        "zion": {
          "name": "zion",
          "status": 1,
          "address": "192.168.0.10",
        },
        "gnosis": {
          "name": "gnosis",
          "status": 1,
          "address": "192.168.0.40",
        }
    }     

# Define a route for the root URL
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/getServerList")
def getServerList():
    return server_list

@app.route("/getServerStatus/<server_name>")
def getServerStatus(server_name):
    return {"status": server_list[server_name]["status"]}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)