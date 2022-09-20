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

# @app.route("/TT", methods=["GET", "POST"]) # 접속 url
# def index():
# 		# page에서 두 개의 키워드 입력받음
#     print(request.form.get('keyword1'))
#     print(request.form.get('keyword2'))
#     keyword1 = request.form.get('keyword1')
#     keyword2 = request.form.get('keyword2')

#     # 두 개의 키워드 모두 결과가 있을 때만 검색 결과 반환
#     if keyword1 is not None and keyword2 is not None:
#         data = {
#             keyword1 : crawling.get_search_count(keyword1).get('number'),
#             keyword2 : crawling.get_search_count(keyword2).get('number')
#         }
#         return render_template("index.html", data = data)
#     else:
#         return render_template("index.html")

#==============================================================================
#
#==============================================================================
if __name__ == '__main__':
    # 127.0.0.1:9000
    app.run('0.0.0.0', port=9000, debug=True)