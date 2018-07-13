#1 webSample

Node.jsでWebSocketを利用した、
チャットアプリです。
チャットの内容とIPがテキストログに保存されるようになってます。
(chat.log)


#2 インストール
```
npm init
```


#2 任意に修正

main.js
line:2
```
var ioSocket = io.connect( "http://localhost:3000" );
```

任意のURLに変更してください。
ローカルで試す場合は不要。


#2 Webサーバの開始
```
npm start
```

or

```
node app.js
```


#2 チャット画面へのアクセス

http://localhost:3000

