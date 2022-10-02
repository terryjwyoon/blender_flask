from urllib.request import urlopen
from bs4 import BeautifulSoup
import ssl
import requests
import random

#==============================================================================
#
#==============================================================================

#----------------------------------------------------------------------
#
#----------------------------------------------------------------------
def articles():

    context = ssl._create_unverified_context()

    html = urlopen("https://it.chosun.com/", context=context)
    
    bsObject = BeautifulSoup(html, "html.parser")
    
    articleList = []

    for link in bsObject.find_all('a'):
        # print(link.text.strip(), link.get('href'))
        # print(link.text.strip())
        articleList.append(link.text.strip())

    value = str(articleList[random.randrange(0, len(articleList))])

    while((value == '') & (len(value)<5)):

        value = str(articleList[random.randrange(0, len(articleList))])

    # print(value)
    return value

#----------------------------------------------------------------------
#
#----------------------------------------------------------------------
def movie():

    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cur&date=20200917',headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    movies = soup.select('#old_content > table > tbody > tr')

    movieList = []

    for movie in movies:
        a_tag = movie.select_one('td.title > div > a')
        if a_tag is not None:
            # print(a_tag.text)
            movieList.append(a_tag.text)
    
    value = str(movieList[random.randrange(0, len(movieList))])
    return value
    # return "Hi"
    

#----------------------------------------------------------------------
#
#----------------------------------------------------------------------
def song():

    url = 'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%B6%88%ED%98%91%ED%99%94%EC%9D%8C+%EB%A8%B8%EB%93%9C+%EA%B0%80%EC%82%AC&oquery=%EB%B6%88%ED%98%91%ED%99%94%EC%9D%8C+%EA%B0%80%EC%82%AC&tqi=hNtjdwp0J1Zssd%2FAWr0ssssssYV-300239'

    response = requests.get(url)

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        lyrics = soup.select_one('#main_pack > section.sc_new.sp_pmusic._au_music_collection._prs_mus_1st > div > div.group_music > ul > li:nth-child(1) > div.music_btn._lyrics_wrap > div > div.lyrics_txt._lyrics_txt')
        lines = lyrics.select('p')
        for line in lines:
            print(line.get_text(), "\n")

    else : 
        print(response.status_code)

#----------------------------------------------------------------------
#
#----------------------------------------------------------------------
def get_search_count(keyword):
    
    url = "https://www.google.com/search?q={}".format(keyword)
    headers = {'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.62 Safari/537.36'}
    res = requests.get(url, headers=headers)

    soup = BeautifulSoup(res.text, 'lxml')
    number = soup.select_one('#result-stats').text
    print(number)
    number = number[number.find('약',)+2:number.rfind('개')]
    number = int(number.replace(',',''))
    return {'keyword':keyword, 'number':number}

#==============================================================================
#
#==============================================================================
# if __name__ == "__main__":
	
#     articles()
#     movie()
#     # song()
#     # print(get_search_count("apple"))

