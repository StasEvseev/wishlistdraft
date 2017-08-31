from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import redis


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

r = redis.StrictRedis(host='localhost', port=6379, db=0)

clients = []


@app.route('/')
def hello_world():
    return render_template('index.html')


@socketio.on('click_wish_item', namespace='/wish_list')
def test_message(message):
    item_id, completed = message['id'], message['completed']
    r.set(item_id, completed)

    emit('click_wish_item_response', message, broadcast=True)


@socketio.on('connect', namespace='/wish_list')
def test_connect():
    print('Client connected')
    keys = r.keys()
    vals = r.mget(keys)

    keys = map(lambda x: x.decode("utf-8"), keys)
    vals = map(lambda x: x.decode("utf-8"), vals)
    kv = list(zip(keys, vals))

    emit('connect', dict(kv))


@socketio.on('disconnect', namespace='/wish_list')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, debug=True)
