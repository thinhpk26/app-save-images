"use strict";
const socket = io()

socket.on('account fail', () => {
    console.log('lỗi')
})

// nếu gửi đến @mọi người thì điền vào mảng là 1, gửi đến @user đó thì điền những IDtoken vào mảng, không thì để mảng rỗng
socket.emit('send message to a group', {to: ['gửi lên token của user đó'], group: 'gửi token của group ', msg: 'message muốn gửi lên'})

// 3 TH: - Không có 'to' thì là không có @
//       - Có 'to' và to là 1 thì gửi đến @mọi người
//       - Có 'to' và to là mảng thì là idtoken
//       - có reply thì là trả lời tin nhắn
//       - không có thì là nhắn mặc định
socket.on('receive messages from other', ({from, to, reply, IDmsgToken, msg}) => {
    
})

// sự kiện đã gửi được tin nhắn
socket.on('receive messages from own: sended', () => {

})

// sự kiện đang chat hoặc kết thúc chat
socket.on('entering msg state', ({from, group}) => {

})

socket.on('finish entering msg state', ({from, group}) => {
    
})

// ghim msg
socket.emit('stick msg', {groupIDToken: 'group', IDMsgToken: 'id của msg', msg: 'tin nhắn nào'})

// server trả về
socket.on('stick msg', ({groupIDToken, stickMsgIDToken, msg}) => {

}) 

// người ghim sẽ nhận thông báo khi ghim thành công
socket.on('stick success', () => {

})

socket.on('error server', err => {
    alert(err)
})

socket.on('error account', () => {
    alert('Lỗi tài khoản vui lòng đăng nhập lại')
    window.location.href = process.env.LINKWORK + ':3000'
})