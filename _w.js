const path=require('path'),puppeteer=require('puppeteer-core');
const W=process.argv.slice(2);
(async()=>{
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:'new',args:['--no-sandbox','--disable-gpu']});
  const p=await b.newPage();
  await p.goto('file://'+path.join(process.cwd(),'index.html'),{waitUntil:'load'});
  await p.waitForFunction(()=>window.App&&window.LESSONS&&window.LESSONS.length>0,{timeout:15000});
  let bad=[];
  for(const id of W){
    let bucket=[];const h=m=>{if(m.type()==='error')bucket.push(m.text())};const e=er=>bucket.push('pe:'+er.message);
    p.on('console',h);p.on('pageerror',e);
    const r=await p.evaluate(i=>{if(!window.LESSONS.find(l=>l.id===i))return"NOREG";window.App.open(i);return document.querySelector('.papercard')?"ok":"nocard";},id);
    await new Promise(r=>setTimeout(r,220));
    const eqCard=await p.evaluate(()=>[...document.querySelectorAll('.card h3')].some(h=>/Key equations/.test(h.textContent)));
    p.off('console',h);p.off('pageerror',e);
    const err=bucket.filter(x=>!/favicon|net::ERR_FILE|MathJax/i.test(x));
    if(r!=="ok"||!eqCard||err.length) bad.push(`${id}(r=${r},eq=${eqCard},${err.slice(0,1)})`);
  }
  if(bad.length){console.log("FAIL: "+bad.join(" | "));process.exit(2);}
  console.log("render clean ("+W.length+")");
})().then(()=>process.exit(0)).catch(e=>{console.error('FATAL',e.message);process.exit(1)});
