from flask import Flask
from flask import render_template
from flask import Flask, render_template, request

from urllib.request import urlopen
from bs4 import BeautifulSoup
import ssl
import requests

from static.TY_lib.test import testFunction
from static.TY_lib.test import test1
import static.TY_lib.crawling as crawling

app = Flask(__name__)

#------------------------------------------------------------------------------
#
#------------------------------------------------------------------------------
@app.route('/')
def home():
    return render_template('index.html')

#==============================================================================
#
#==============================================================================
@app.route('/TY_test1', methods=['GET', 'POST'])
def TY_test1():

    return test1()

@app.route('/TY_test2', methods=['GET', 'POST'])
def TY_test2():
    b = testFunction()
    return b

#----------------------------------------------------------
#
#----------------------------------------------------------
@app.route('/Interface_Movie', methods=['GET', 'POST'])
def Interface_Movie():
    
    ddd = crawling.movie()

    return ddd

@app.route('/Interface_Article', methods=['GET', 'POST'])
def Interface_Article():
    
    ddd = crawling.articles()

    return ddd

@app.route('/Interface_Song', methods=['GET', 'POST'])
def Interface_Song():
    
    ddd = crawling.song()

    return ddd

#==============================================================================
#
#==============================================================================
if __name__ == '__main__':
    # 127.0.0.1:9000
    app.run('0.0.0.0', port=9000, debug=True)