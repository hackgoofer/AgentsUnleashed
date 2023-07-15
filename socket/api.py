from flask import Flask, request
from flask_socketio import SocketIO, emit
import asyncio
import eventlet
from babyagi import babyagi

eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="*") 

# # Define your tasks
async def babyagi_api():
    print('Task 1 started')
    babyagi.babyagi_function(socketio)
    # babyagi_function(socketio)
    print('Task 1 finished')

async def task2():
    print('Task 2 started')
    await asyncio.sleep(4)  # simulate task taking time
    socketio.emit('message', 'from task2')
    print('Task 2 finished')

# Function to run both tasks concurrently
async def run_concurrently():
    # Schedule both the tasks to run
    task1_handle = asyncio.create_task(babyagi_api())
    # task2_handle = asyncio.create_task(task2())

    # Await on the tasks to make sure they complete
    await task1_handle
    # await task2_handle

@app.route('/trigger', methods=['GET'])
async def trigger():
    # emit 'message' event with data 'Hello' to all connected clients
    await run_concurrently()
    return {"status": "Message sent"}

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=8080)