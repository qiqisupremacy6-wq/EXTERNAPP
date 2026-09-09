const {app,BrowserWindow,protocol,net,session,Menu}=require('electron');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
protocol.registerSchemesAsPrivileged([{scheme:'externapp',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
const testArg=process.argv.find(a=>a.startsWith('--smoke-output='));
const testDir=testArg?path.resolve(testArg.slice('--smoke-output='.length)):null;
if(testDir){fs.mkdirSync(testDir,{recursive:true});app.setPath('userData',path.join(testDir,'profile'));}
app.setName('ExternApp');

if(!app.requestSingleInstanceLock()){app.quit();}else{
let win;
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
app.whenReady().then(async()=>{
 protocol.handle('externapp',request=>{const u=new URL(request.url);if(u.host!=='app')return new Response('Forbidden',{status:403});let target;try{target=path.resolve(__dirname,'ui','.'+decodeURIComponent(u.pathname));}catch{return new Response('Invalid path',{status:400});}const root=path.join(__dirname,'ui');if(!target.startsWith(root+path.sep))return new Response('Forbidden',{status:403});try{const type={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'}[path.extname(target)]||'application/octet-stream';return new Response(fs.readFileSync(target),{headers:{'Content-Type':type}});}catch{return new Response('Arquivo indisponivel',{status:404});}});
 session.defaultSession.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
 session.defaultSession.on('will-download',(_event,item)=>item.setSaveDialogOptions({defaultPath:path.join(app.getPath('downloads'),item.getFilename())}));
 win=new BrowserWindow({width:1440,height:960,minWidth:1024,minHeight:720,title:'ExternApp · Prévia',backgroundColor:'#020f21',show:false,autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false}});
 Menu.setApplicationMenu(null);
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('externapp://app/'))e.preventDefault();});
 win.webContents.on('did-fail-load',(_e,code,desc)=>{if(testDir)fs.writeFileSync(path.join(testDir,'failure.txt'),`${code} ${desc}`);});
 app.on('child-process-gone',(_e,details)=>{if(testDir)fs.appendFileSync(path.join(testDir,'children.txt'),JSON.stringify(details)+'\n');});
 try{await win.loadURL('externapp://app/index.html');}catch(e){if(testDir){fs.writeFileSync(path.join(testDir,'failure.txt'),String(e));app.exit(1);}return;}
 if(!testDir){win.show();return;}
 try{
  await new Promise(r=>setTimeout(r,1500));
  const result=await win.webContents.executeJavaScript('('+require('./smoke.cjs').toString()+')()');
  fs.writeFileSync(path.join(testDir,'smoke.json'),JSON.stringify(result,null,2));
  const image=await win.webContents.capturePage();fs.writeFileSync(path.join(testDir,'externapp-windows.png'),image.toPNG());
  app.exit(Object.values(result).every(value=>value===true)?0:1);
 }catch(e){fs.writeFileSync(path.join(testDir,'failure.txt'),String(e.stack));app.exit(1);}
});
app.on('window-all-closed',()=>app.quit());
}


