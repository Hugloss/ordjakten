/* Zero-dependency local development server with safe paths and correct MIME types. */
'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT)||4173;
http.createServer((req,res)=>{
  const raw=new URL(req.url,'http://localhost');
  const filename=path.resolve(root,'.'+decodeURIComponent(raw.pathname==='/'?'/index.html':raw.pathname));
  if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403);res.end('Forbidden');return;}
  fs.readFile(filename,(err,buffer)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(buffer);
  });
}).listen(port,'127.0.0.1',()=>process.stdout.write(`Ordjakten: http://127.0.0.1:${port}\n`));
