import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist/client');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req,res)=>{
 if(req.url==='/__externapp'){res.writeHead(200,{'Content-Type':'text/plain'});res.end('ExternApp demo');return;}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{if(err){res.writeHead(404);res.end('Arquivo indisponivel');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(bytes);});
}).listen(4174,'127.0.0.1',()=>console.log('ExternApp: http://127.0.0.1:4174'));
