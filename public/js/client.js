const socket = io();

const chats = document.querySelector(".chats")
const user_list = document.querySelector(".user-list")
const user_count = document.querySelector(".user-count")
const msg_send = document.querySelector("#user-send")
const user_msg = document.querySelector("#user-msg")
const audio = new Audio('icons/ding_music.mp3')

do { 
    username = prompt("Enter your name")
} while (!username)

// it will be called when user will join   
socket.emit("new-user-joineded", username);

// notifying that user is joined
socket.on('user-connected', (name) => {
    userJoinleft(name, 'joined')
    // console.log(socket_name);
})


// funvcion to create joined/left status div
function userJoinleft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join')
    let content = `<p><b>${name}</b> ${status} the chat</p>`
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

// notifying that user is left
socket.on('user-disconnected', (user) => {
    userJoinleft(user, 'left')
})

//   for updating user list and user counts
socket.on('user-list', (users) => {
    user_list.innerHTML = "";
    user_arr = Object.values(users);
    for (i = 0; i < user_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = user_arr[i];
        user_list.appendChild(p);

    }
    user_count.innerHTML = user_arr.length;
})
// for sending message                                                                      
msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value

    };
    if (user_msg.value != '') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        user_msg.value = '';
    }
})
function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status)
    let content = `                                                              
    <h5>${data.user}</h5>                                                              
    <p>${data.msg}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
    if (status=='outgoing') {
        audio.play();
    }
    
}
socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})