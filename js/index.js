$("#editor").emoji({
    button: "#btn",
    // showTab: false,
    animation: 'slide',
    position: 'topLeft',
    icons: [{
        name: "QQ表情",
        path: "/dist/img/qq/",
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: ".gif",
        placeholder: "#qq_{alias}#",
    }],
});
window.onload = function(){
    $("#emoji_container_1").css({
        left:'42.8333px',
        top:'43vh'
    })
    var socket = io('ws://localhost:3000');
    console.log(socket)
    var nickName = null;
    $('#l_btn').click(function(){
        nickName = $('#login_name').val();
        if(nickName){
            socket.emit('login',{userName:nickName})
        }else{
            alert("请输入用户名")
        }
    })
    socket.on("loginSuccess",function(data){
        if(nickName === data){
            $(".chat").show('slow')
            $(".login").hide('slow')
        }
    })
    socket.on("loginFail",function(data){
        alert("登录失败")
    })
    socket.on("add",function(data){
        var html = `<div class="office">${data}加入群聊</div>`
        $(".content").append(html);
    })
    $(".send").click(function(){
        let message = $("#editor").html();
        console.log(message)
        //清空
        $("#editor").html("");
        if(message){
            socket.emit("sendMessage",{userName:nickName,msg:message})
        }
        var str = `<div class="my">
                    
        <span>${message}</span>
        <span>${nickName}</span>
        </div>`
        $(".content").append(str);
    })
    socket.on("otherMessage", function(data){
        if(data.userName === nickName){
            return
        }
        var str = `<div class="other">
        <span>${data.userName}</span>
        <span>${data.msg}</span>
        </div>`
        $(".content").append(str);
    })
    socket.on('leave',function(name){
        if(name != null){
            var html = `<div class="office">${name}退出群聊</div>`
            $(".content").append(html);
        }
    })
}