import json
import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

ROOT = os.path.dirname(__file__)
pdfmetrics.registerFont(TTFont('ArialKMD', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialKMDBold', 'C:/Windows/Fonts/arialbd.ttf'))
file_path = os.path.join(ROOT, 'KMD-Web-Services.pdf')
page_width, page_height = 960, 540
pdf = canvas.Canvas(file_path, pagesize=(page_width, page_height))
pdf.setTitle('Services KMD Web | Sites, design et automatisation IA')
pdf.setAuthor('KMD Web')

for page in json.load(open(os.path.join(ROOT, 'render-primitives.json'), encoding='utf-8')):
    for item in page:
        x, y, width, height = [item[key] * 72 for key in ('x', 'y', 'w', 'h')]
        if item['type'] in ('rect', 'circle'):
            pdf.setFillColor(HexColor('#' + item['fill']))
            if item['type'] == 'circle':
                pdf.ellipse(x, page_height - y - height, x + width, page_height - y, fill=1, stroke=0)
            else:
                pdf.roundRect(x, page_height - y - height, width, height, item.get('r', 0) * 72, fill=1, stroke=0)
            continue

        font = 'ArialKMDBold' if item['bold'] else 'ArialKMD'
        size = item['size']
        lines = []
        while True:
            lines = []
            for paragraph in item['text'].split('\n'):
                lines.extend(simpleSplit(paragraph, font, size, width) if paragraph else [''])
            if len(lines) * size * 1.2 <= height + 2 or size <= 7:
                break
            size -= 0.25
        pdf.setFillColor(HexColor('#' + item['color']))
        pdf.setFont(font, size)
        for index, line in enumerate(lines):
            baseline = page_height - y - size * .94 - index * size * 1.2
            if item.get('align') == 'center':
                pdf.drawCentredString(x + width / 2, baseline, line)
            elif item.get('align') == 'right':
                pdf.drawRightString(x + width, baseline, line)
            else:
                pdf.drawString(x, baseline, line)
        if item.get('url'):
            pdf.linkURL(item['url'], (x, page_height - y - height, x + width, page_height - y), relative=0)
    pdf.showPage()

pdf.save()
print(file_path)
