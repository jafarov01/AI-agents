from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify(ok=True)

@app.route('/add', methods=['POST'])
def add():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify(error='Invalid JSON'), 400
        
    if not data:
        return jsonify(error='No data provided'), 400
        
    a = data.get('a', 0)
    b = data.get('b', 0)
    
    # Validate numeric input and prevent NaN injection
    try:
        # Check for NaN strings before conversion
        if (isinstance(a, str) and a.lower() in ['nan', 'inf', '-inf']) or \
           (isinstance(b, str) and b.lower() in ['nan', 'inf', '-inf']):
            return jsonify(error='Invalid numeric values not allowed'), 400
            
        a = float(a)
        b = float(b)
        
        # Additional NaN check after conversion
        import math
        if math.isnan(a) or math.isnan(b) or math.isinf(a) or math.isinf(b):
            return jsonify(error='Invalid numeric values not allowed'), 400
    except (TypeError, ValueError):
        return jsonify(error='Invalid input: a and b must be numeric'), 400
    
    return jsonify(result=a + b)

if __name__ == '__main__':
    import os
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='127.0.0.1', port=5000)
