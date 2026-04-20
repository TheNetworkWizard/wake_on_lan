from flask import Flask, render_template, abort, redirect
import os
import sqlite3
import json
app = Flask(__name__)

DB = '../servers.db'

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
    conn = sqlite3.connect( DB )
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute('''SELECT server_name, server_ip, status from server_list''').fetchall()

    conn.commit()
    conn.close()

    #if json_str:
    #    return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON

    servers = {}
    for row in rows:
        servers[row['server_name']] = {}
        servers[row['server_name']]['server_name'] = row['server_name'] 
        servers[row['server_name']]['status'] = row['status'] 
        servers[row['server_name']]['server)ip'] = row['server_ip'] 

    return servers
    
    return json.dumps( [dict(ix) for ix in rows] ) 

    return rows

    return server_list

@app.route("/getServerStatus/<server_name>")
def getServerStatus(server_name):
    conn = sqlite3.connect( DB )
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute('''SELECT * from server_list where server_name = ?''', (server_name, )).fetchall()

    conn.commit()
    conn.close()

    if len(rows) == 0:
        abort(404)
    
    return json.dumps( [dict(ix) for ix in rows][0] ) 

@app.route("/startServer/<server_name>")
def startServer(server_name):
    conn = sqlite3.connect( DB )
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute('''SELECT * from server_list where server_name = ?''', (server_name, )).fetchall()

    conn.commit()
   

    if len(rows) == 0:
        conn.close()
        abort(404)

    db.execute('''UPDATE server_list set status = 1 where server_name = ?''', (server_name,))
    conn.commit()
    conn.close()

    return json.dumps( [dict(ix) for ix in rows][0] ) 


@app.route("/stopServer/<server_name>")
def stopServer(server_name):
    conn = sqlite3.connect( DB )
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute('''SELECT * from server_list where server_name = ?''', (server_name, )).fetchall()

    conn.commit()
   

    if len(rows) == 0:
        conn.close()
        abort(404)

    db.execute('''UPDATE server_list set status = 0 where server_name = ?''', (server_name,))
    conn.commit()
    conn.close()

    return json.dumps( [dict(ix) for ix in rows][0] ) 

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