# webSample

Node.jsでWebSocketを利用した、  
チャットアプリです。  
チャットの内容とIPがテキストログに保存されるようになってます。  
(chat.log)  
  
  
## インストール
```
npm init
```
  
  
## 任意に修正

main.js  
line:2  
```
var ioSocket = io.connect( "http://localhost:3000" );
```
  
任意のURLに変更してください。  
ローカルで試す場合は不要。  
  
  
## Webサーバの開始
```
npm start
```
  
or  
  
```
node app.js
```
  
  
## チャット画面へのアクセス
  
http://localhost:3000  
  
