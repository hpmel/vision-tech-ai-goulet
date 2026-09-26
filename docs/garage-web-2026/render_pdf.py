import json, os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
ROOT=os.path.dirname(__file__)
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
c=canvas.Canvas(os.path.join(ROOT,'Garages-Web-2026.pdf'),pagesize=(960,540))
c.setTitle('Garages automobiles : pourquoi un site web en 2026')
c.setAuthor('Vision Tech AI')
for page in json.load(open(os.path.join(ROOT,'render-primitives.json'),encoding='utf8')):
 for a in page:
  x,y,w,h=[a[k]*72 for k in ('x','y','w','h')]
  if a['type'] in ('rect','circle'):
   c.setFillColor(HexColor('#'+a['fill']));c.setStrokeColor(HexColor('#'+(a.get('line') or a['fill'])))
   if a['type']=='circle':c.ellipse(x,540-y-h,x+w,540-y,fill=1,stroke=0)
   else:c.roundRect(x,540-y-h,w,h,a.get('r',0)*72,fill=1,stroke=0)
  else:
   font='ArialBold' if a['bold'] else 'Arial';size=a['size'];lines=[]
   while True:
    lines=[]
    for p in a['text'].split('\n'):lines+=simpleSplit(p,font,size,w) if p else ['']
    if len(lines)*size*1.18<=h+2 or size<8:break
    size-=.25
   c.setFillColor(HexColor('#'+a['color']));c.setFont(font,size)
   for j,line in enumerate(lines):
    yy=540-y-size*.94-j*size*1.18
    if a['align']=='center':c.drawCentredString(x+w/2,yy,line)
    elif a['align']=='right':c.drawRightString(x+w,yy,line)
    else:c.drawString(x,yy,line)
   if a.get('url'):c.linkURL(a['url'],(x,540-y-h,x+w,540-y),relative=0)
 c.showPage()
c.save()
print('PDF created')
