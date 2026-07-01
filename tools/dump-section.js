/* tools/dump-section.js — print the current content of one math section's lessons.
   Usage: node tools/dump-section.js math-26   */
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'), dir=path.join(ROOT,'lessons');
const pref=process.argv[2]; if(!pref){console.error('usage: node tools/dump-section.js math-NN');process.exit(1);}
global.window={LESSONS:[]};
fs.readdirSync(dir).filter(f=>new RegExp('^'+pref+'-.*\\.js$').test(f)).sort()
  .forEach(f=>{try{eval(fs.readFileSync(path.join(dir,f),'utf8'))}catch(e){console.error('ERR',f,e.message)}});
const L=window.LESSONS.filter(l=>l.template==='math');
const strip=s=>(s||'')
  .replace(/<\/?(?:p|b|i|em|strong|br|ul|ol|li|sub|sup|table|tr|td|th|thead|tbody|div|span|h[1-6]|code|pre|small|blockquote)\b[^>]*>/gi,' ')
  .replace(/\s+/g,' ').trim();
console.log('SECTION',pref,'—',L.length,'lessons\n');
L.forEach(l=>{
  console.log('======== '+l.id+' — '+l.title+' ========');
  console.log('TAGLINE: '+strip(l.tagline));
  console.log('MOTIVATION: '+strip(l.motivation));
  console.log('DEFINITION: '+strip(l.definition));
  const w=l.worked||{}; console.log('WORKED.problem: '+strip(w.problem));
  console.log('APPLICATIONS ('+(l.applications||[]).length+'):');
  (l.applications||[]).forEach((a,i)=>console.log('  '+(i+1)+'. '+a.title+' :: '+strip(a.background)+' | NUMBERS: '+strip(a.numbers)));
  console.log('');
});
