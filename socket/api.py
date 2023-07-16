from flask import Flask, request
from flask_socketio import SocketIO
from babyagi import babyagi
from metaagent import MetaAgent
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/trigger", methods=["POST"])
def trigger():
    # emit 'message' event with data 'Hello' to all connected clients
    data = request.get_json()  # get the JSON data from the request
    objective = data.get("objective")  # get 'objective' parameter from the JSON data
    
    # Creating metagents
    babyagi_metagent = MetaAgent("babyagi_metagent", socket_name=socketio)
    print("Starting Baby AGI")
    babyagi.babyagi_function(
        socket_name=socketio, objective=objective, metaent=babyagi_metagent
    )
    return {"status": "Message sent"}


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=8080)
