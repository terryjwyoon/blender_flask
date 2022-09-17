from urllib.request import urlopen
from bs4 import BeautifulSoup
import ssl
import requests

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
    
    for link in bsObject.find_all('a'):
        print(link.text.strip(), link.get('href'))

#----------------------------------------------------------------------
#
#----------------------------------------------------------------------
def movie():

    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cur&date=20200917',headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    movies = soup.select('#old_content > table > tbody > tr')

    for movie in movies:
        a_tag = movie.select_one('td.title > div > a')
        if a_tag is not None:
            print(a_tag.text)

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

#==============================================================================
#
#==============================================================================
# if __name__ == "__main__":
	
#     # articles()
#     # movie()
#     song()
