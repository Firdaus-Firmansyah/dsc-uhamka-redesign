"""Import public DSC content. Run manually; never needed at build time."""
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
import json, os

root=Path(__file__).resolve().parents[1]
content=root/'src/content'; content.mkdir(parents=True,exist_ok=True)
assets=root/'public/images'; assets.mkdir(parents=True,exist_ok=True)
def soup(name): return BeautifulSoup((Path(os.environ['TEMP'])/f'dsc-{name}.html').read_text(encoding='utf-8-sig'),'html.parser')
def save(name,data): (content/name).write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding='utf-8')
team=[]
for card in soup('team').select('.member-card'):
    name=card.select_one('h5'); photo=card.select_one('img'); ps=card.select('p')
    if not name or not photo: continue
    name=name.get_text(' ',strip=True)
    if any(m['name']==name for m in team): continue
    role=ps[0].get_text(' ',strip=True)
    division=next((d for d in ['The Pixels','The Vectors','The Cyphers'] if d in role),'Core Board' if 'Secretary' in role else 'Event & PR')
    links={}
    for a in card.select('a[href]'):
        href=a['href']
        if href.startswith('http'):
            kind='LinkedIn' if 'linkedin' in href else 'GitHub' if 'github' in href else 'Instagram' if 'instagram' in href else 'Portfolio'
            links[kind]=href
    team.append(dict(name=name,role=role,division=division,image='/images/'+photo['src'].split('/')[-1],bio=ps[1].get_text(' ',strip=True) if len(ps)>1 else '',links=links))
save('team.json',team)
faq=[]
f=soup('faq')
for item in f.select('.faq-item'):
    q=item.select_one('.faq-header'); a=item.select_one('.faq-body')
    if q and a:
        question=q.get_text(' ',strip=True); answer=a.get_text(' ',strip=True)
        category='Collaboration' if 'collaborat' in question.lower() else 'Events & Certificates' if any(s in question.lower() for s in ['certificate','schedule']) else 'Recruitment' if any(s in question.lower() for s in ['core team','member','fee']) else 'General'
        faq.append(dict(question=question,answer=answer,category=category))
save('faq.json',faq)
names={'Logo-Uhamka-HD.png','Logo-Dsc-Uhamka-HD.png','Tiananmen.webp','ThePixels.png','CrashCourse.png','Ahmad.png','Rizki.png','Bimbiii.png','Media-Sponsor-GSA.png','Shinjisho.png','act.png','dsi.png','kretya.png','Run1.svg','CC1.png','CC2.png','CC3.webp','CC4.webp','CC5.webp','CC6.webp','CC7.webp','CC8.webp'}
names.update(m['image'].split('/')[-1] for m in team)
def download(name):
    path=assets/name
    if not path.exists(): path.write_bytes(urlopen('https://dscuhamka.my.id/images/'+name,timeout=40).read())
    return name,path.stat().st_size
save('asset-sources.json',sorted(names))
if '--download' in __import__('sys').argv:
    with ThreadPoolExecutor(max_workers=3) as pool:
        for result in pool.map(download,sorted(names)): print(result)
print('Imported',len(team),'members and',len(faq),'FAQ items')
