from flask import Flask
from flask import render_template

from static.TY_lib.test import testFunction
from static.TY_lib.test import test1

app = Flask(__name__)

#------------------------------------------------------------------------------
#
#------------------------------------------------------------------------------
@app.route('/')
def home():
    return render_template('index.html')

#------------------------------------------------------------------------------
#
#------------------------------------------------------------------------------
@app.route('/TY_test1', methods=['GET', 'POST'])
def TY_test1():

    return test1()

@app.route('/TY_test2', methods=['GET', 'POST'])
def TY_test2():
    b = testFunction()
    return b

#==============================================================================
#
#==============================================================================
if __name__ == '__main__':
    # 127.0.0.1:9000
    app.run('0.0.0.0', port=9000, debug=True)