from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # isto irá permitir todas as origens

title = str()

@app.route('/title', methods=['POST'])
def get_title():
    global title
    title = request.json['title']
    print(f"Server: O título do vídeo é '{title}'")
    # aqui você pode adicionar o código para fazer algo com o título
    return '', 200

@app.route('/title', methods=['GET'])
def get_title_2():
    global title
    return jsonify({'title': title if title is not None else ''})

if __name__ == '__main__':
    app.run(port=5000)