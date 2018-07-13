var http = require( 'http' ); // HTTPモジュール読み込み
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み
var path = require('path');
var url = require("url");
var mime = {
  ".html": "text/html",
  ".css" : "text/css",
  ".js"  : "text/javascript",
  ".jpg":  "image/jpeg",
  ".gif":  "image/gif",
  ".png":  "image/png"
};

// 3000番ポートでHTTPサーバーを立てる
var server = http.createServer( function( req, res ) {

    if (req.url == '/') {
      req.url = '/index.html';
    }

    var Response = {
      "200":function(file, filename){
          var extname = path.extname(filename);
          var header = {
              "Access-Control-Allow-Origin":"*",
              "Pragma": "no-cache",
              "Cache-Control" : "no-cache",
              "Content-Type": mime[path.extname(filename)] || "text/plain"
          }

          res.writeHead(200, header);
          res.write(file, "binary");
          res.end();
      },
      "404":function(){
          res.writeHead(404, {"Content-Type": "text/plain"});
          res.write("404 Not Found\n");
          res.end();

      },
      "500":function(err){
          res.writeHead(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();

      }
  }

  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists){
    if (!exists) { Response["404"](); return ; }
    if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

    fs.readFile(filename, "binary", function(err, file){
        if (err) { Response["500"](err); return ; }
        Response["200"](file, filename);   
    }); 

});


}).listen(3000);

// サーバーをソケットに紐付ける
var io = socketio.listen( server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {

    // ip取得
    var address = socket.handshake.address;
    //console.log(address);
    
    // クライアントからサーバーへ メッセージ送信ハンドラ（自分を含む全員宛に送る）
    socket.on( 'c2s_message', function( data ) {
    
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 's2c_message', { value : data.value } );
        
        // Log出力
        var setLogText = (new Date()) + ", " + address + ", " + data.value + "\n";
        fs.appendFile('chat.log', setLogText, function(err){
           if( err != null ){
                console.log(err);
           }
        });
        
    });

    // クライアントからサーバーへ メッセージ送信ハンドラ（自分以外の全員宛に送る）
    socket.on( 'c2s_broadcast', function( data ) {
        // サーバーからクライアントへ メッセージを送り返し
        socket.broadcast.emit( 's2c_message', { value : data.value } );
        
        // Log出力
        var setLogText = (new Date()) + ", " + address + ", " + data.value + "\n";
        fs.appendFile('chat.log', setLogText, function(err){
           if( err != null ){
                console.log(err);
           }
        });

    });
});
