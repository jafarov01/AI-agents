from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify(ok=True)

@app.route('/add', methods=['POST'])
def add():
    data = request.json or {}
    a = data.get('a', 0)
    b = data.get('b', 0)
    return jsonify(result=a + b)

if __name__ == '__main__':
    app.run(port=5000)
