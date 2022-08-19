from flask import Flask
from flask import render_template
from flask import request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/TY_test1', methods=['GET', 'POST'])
def TY_test1():
    if request.form.get('registration') == 'success':
        return jsonify({'abc': 'successfuly registered'})

    return jsonify({'abc': 'registration unsuccessful'})

if __name__ == '__main__':
    # 127.0.0.1:9000
    app.run('0.0.0.0', port=9000, debug=True)