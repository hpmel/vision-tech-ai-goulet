const fs=require('fs');
const path=require('path');
const pptxgen=require('pptxgenjs');
const out=__dirname;
const input=JSON.parse(fs.readFileSync(path.join(out,'contenu.json'),'utf8').replace(/^\uFEFF/,''));
const pptx=new pptxgen(); pptx.layout='LAYOUT_WIDE'; pptx.author='Vision Tech AI'; pptx.subject='Garages automobiles et présence web en 2026'; pptx.title=input.title; pptx.company='Vision Tech AI'; pptx.lang='fr-CA';
pptx.theme={headFontFace:'Arial',bodyFontFace:'Arial',lang:'fr-CA'};
const C={ink:'171C20',muted:'56616A',orange:'F56B32',white:'FFFFFF',pale:'F0F3F5',line:'D9E0E4'};
const pages=[]; let slide,page,dark;
function rect(x,y,w,h,fill,r=0,line){slide.addShape(r?pptx.ShapeType.roundRect:pptx.ShapeType.rect,{x,y,w,h,rectRadius:r,fill:{color:fill},line:{color:line||fill},radius:r});page.push({type:'rect',x,y,w,h,fill,r,line});}
function circle(x,y,d,fill,line){slide.addShape(pptx.ShapeType.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:line||fill}});page.push({type:'circle',x,y,w:d,h:d,fill,line});}
function text(t,x,y,w,h,size=20,color=C.ink,bold=false,opts={}){t=String(t);slide.addText(t,{x,y,w,h,fontFace:'Arial',fontSize:size,color,bold,margin:0,breakLine:false,vertAnchor:'top',fit:'shrink',...opts});page.push({type:'text',text:t,x,y,w,h,size,color,bold,align:opts.align||'left',url:opts.hyperlink?.url});}
function garage(x,y,scale=1){rect(x,y,3.8*scale,2.7*scale,'283138',.1);rect(x+.3*scale,y+.42*scale,3.2*scale,1.9*scale,'48555E');for(let i=0;i<5;i++)rect(x+.3*scale,y+(.45+i*.29)*scale,3.2*scale,.025*scale,'68747B');rect(x+.65*scale,y+1.48*scale,2.5*scale,.62*scale,C.orange,.08);rect(x+1.06*scale,y+1.13*scale,1.65*scale,.52*scale,C.orange,.08);rect(x+1.22*scale,y+1.22*scale,1.29*scale,.3*scale,'BBCDD6');circle(x+.93*scale,y+1.93*scale,.48*scale,C.ink);circle(x+2.4*scale,y+1.93*scale,.48*scale,C.ink);circle(x+1.07*scale,y+2.07*scale,.2*scale,'A5B4BD');circle(x+2.54*scale,y+2.07*scale,.2*scale,'A5B4BD');}
for(let i=0;i<input.slides.length;i++){
const d=input.slides[i];slide=pptx.addSlide();page=[];pages.push(page);dark=['cover','closing'].includes(d.layout);slide.background={color:dark?C.ink:C.white};rect(0,0,13.333,7.5,dark?C.ink:C.white);
text((d.kicker||'GARAGES AUTOMOBILES • 2026').toUpperCase(),.65,.4,11.7,.3,11,dark?C.orange:C.muted,true);
text(d.title,.65,.98,dark?8.2:12,d.layout==='closing'?2.0:1.25,dark?38:34,dark?C.white:C.ink,true);
const body=i===11?[d.body[0]+'\n\n'+d.body[1],d.body[2]+'\n\n'+d.body[3],d.body[4]+'\n\n'+d.body[5]]:d.body||[];const layout=d.layout||'cards';
if(dark){text(body.join('\n\n'),.65,d.layout==='closing'?3.2:2.6,7,d.layout==='closing'?3:3.35,23,'E4E9ED');garage(8.35,3.05,1.05);circle(10.95,1.13,1.25,C.orange);text('2026',11.03,1.56,1.1,.3,18,C.ink,true,{align:'center'});}
else if(layout==='stats'){
rect(.65,2.6,4.45,3.5,C.ink,.1);text(d.stat||'',.95,3.15,3.85,1.5,(d.stat||'').length>12?41:64,C.orange,true);text(body[0]||'',5.6,2.68,6.9,1.1,24,C.ink,true);text(body.slice(1).join('\n\n'),5.6,4.02,6.8,2.05,19,C.muted);
}else if(layout==='compare'){
const mid=Math.ceil(body.length/2);[body.slice(0,mid),body.slice(mid)].forEach((arr,j)=>{const x=.65+j*6.15;rect(x,2.53,5.9,3.83,j?C.ink:C.pale,.08);text(i===1?(j?'5 EMPLOYÉS OU PLUS':'MICROENTREPRISES'):i===7?(j?'INDÉPENDANTS':'CONCESSIONNAIRES'):(j?'AVEC UN SITE':'SANS SITE'),x+.28,2.83,5.25,.4,18,j?C.orange:C.muted,true);arr.forEach((b,k)=>text(b.replace(/^(Sans|Avec) site\s*:\s*/i,''),x+.28,3.5+k*.65,5.25,.57,17,j?C.white:C.ink));});
}else if(layout==='steps'){
const n=body.length;body.forEach((b,j)=>{const x=.65+j*12.03/n;circle(x,2.75,.63,C.orange);text(String(j+1),x,2.88,.63,.28,18,C.white,true,{align:'center'});text(b,x,3.75,12.03/n-.35,2.45,21,C.ink,true);});
}else if(layout==='sources'){
 const links=(d.notes||'').match(/https:\/\/[^\s]+/g)||[];
 body.forEach((b,j)=>{const y=2.47+j*(3.95/body.length);text(String(j+1).padStart(2,'0'),.65,y,.45,.28,11,C.orange,true);text(b,1.24,y,11.3,3.05/body.length,16,C.ink);const url=i===14?links[[0,1,3][j]]:links[j===0?0:j===1?2:-1];if(url)text('CONSULTER LA SOURCE',1.24,y+3.1/body.length,10,.2,10,C.orange,true,{hyperlink:{url}});});
}else{
const cols=body.length===4?2:Math.min(3,body.length||1);const rows=Math.ceil(body.length/cols);body.forEach((b,j)=>{const col=j%cols,row=Math.floor(j/cols),w=(12.03-(cols-1)*.3)/cols,h=(3.92-(rows-1)*.3)/rows,x=.65+col*(w+.3),y=2.5+row*(h+.3);rect(x,y,w,h,C.pale,.07);circle(x+.23,y+.24,.48,C.orange);text(String(j+1),x+.23,y+.335,.48,.25,13,C.white,true,{align:'center'});text(b,x+.25,y+(rows>1?.83:1),w-.5,h-(rows>1?.93:1.1),rows>1?18:20,C.ink,true);});
}
if(i===1)text('* Sans site = 100 % − avec site. Sans site ≠ sans présence en ligne.',.65,6.43,12,.22,10,C.muted);
if(d.source)text(d.source,.65,6.73,11.5,.35,9,dark?'B9C5CC':C.muted,false,d.url?{hyperlink:{url:d.url}}:{});
text('VISION TECH AI  /  GARAGES',.65,7.13,8,.2,9,dark?'94A4AE':C.muted);text(String(i+1).padStart(2,'0'),11.8,7.08,.85,.25,11,dark?'94A4AE':C.muted,false,{align:'right'});
slide.addNotes((d.notes||'')+'\n\nSources : '+(d.source||'')+'\n'+(d.url||''));
}
fs.writeFileSync(path.join(out,'render-primitives.json'),JSON.stringify(pages));
pptx.writeFile({fileName:path.join(out,'Garages-Web-2026.pptx')});


