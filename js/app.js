let app = require('http').createServer();
let io = require("socket.io")(app);
let port = 3000
let user = []
io.on('connection', function (socket) {
    /*监听登录*/
    let userName = null;
    socket.on('login',function(data){
        userName = data.userName;
        let index = user.findIndex(e => e==userName)
        if(index === -1){
            user.push(userName);
            socket.emit("loginSuccess",userName);
            io.sockets.emit("add",userName)
        }else{
            socket.emit("loginFail",'')
        }
    })
    socket.on('sendMessage',function(data){
        console.log(data)
        io.sockets.emit("otherMessage",data)
    })
    socket.on('disconnect',function(){
        /*向所有连接的客户端广播leave事件*/
        io.sockets.emit('leave',userName)
        user.map(function(val,index){
            if(val === userName){
                user.splice(index,1);
            }
        })
     })
})

app.listen(port,function(){
    console.log("3000端口已启用")
})