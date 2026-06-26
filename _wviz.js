const path=require('path'),puppeteer=require('puppeteer-core');
const W=process.argv.slice(2);
(async()=>{
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:'new',args:['--no-sandbox','--disable-gpu']});
  const p=await b.newPage();
  await p.goto('file://'+path.join(process.cwd(),'index.html'),{waitUntil:'load'});
  await p.waitForFunction(()=>window.App&&window.LESSONS&&window.LESSONS.length>0&&window.Charts&&window.CODEVIZ,{timeout:15000});
  let bad=[];
  for(const id of W){
    let bucket=[];const h=m=>{if(m.type()==='error')bucket.push(m.text())};const e=er=>bucket.push('pe:'+er.message);
    p.on('console',h);p.on('pageerror',e);
    const r=await p.evaluate(i=>{
      if(!window.LESSONS.find(l=>l.id===i))return{s:'NOREG'};
      window.App.open(i);const v=window.CODEVIZ[i];
      if(!v||!v.charts||!v.charts.length)return{s:'NOVIZ'};
      const cs=[...document.querySelectorAll('canvas[data-viz^="'+i+'::"]')];
      if(cs.length!==v.charts.length)return{s:'mismatch',want:v.charts.length,got:cs.length};
      let failed=[];v.charts.forEach((ch,idx)=>{if(!window.Charts.draw(cs[idx],ch))failed.push(idx+':'+ch.type)});
      const interps=document.querySelectorAll('.viz .vizchart .vizinterp').length;
      return{s:failed.length?'draw-fail':(interps<v.charts.length?'missing-interp':'ok'),n:v.charts.length,interps,failed};
    },id);
    await new Promise(r=>setTimeout(r,140));
    p.off('console',h);p.off('pageerror',e);
    const err=bucket.filter(x=>!/favicon|net::ERR_FILE|MathJax/i.test(x));
    if(r.s!=='ok'||err.length)bad.push(`${id}(${JSON.stringify(r)}${err.length?',err='+err.slice(0,1):''})`);
  }
  if(bad.length){console.log('FAIL: '+bad.join(' | '));process.exit(2);}
  console.log('viz render clean ('+W.length+', all charts drew + interpret shown)');
})().then(()=>process.exit(0)).catch(e=>{console.error('FATAL',e.message);process.exit(1)});
