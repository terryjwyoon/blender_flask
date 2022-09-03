from urllib.request import urlopen
from bs4 import BeautifulSoup
import ssl

context = ssl._create_unverified_context()

html = urlopen("https://it.chosun.com/", context=context)
 
bsObject = BeautifulSoup(html, "html.parser")
 
for link in bsObject.find_all('a'):
    print(link.text.strip(), link.get('href'))