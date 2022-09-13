import requests
from bs4 import BeautifulSoup

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