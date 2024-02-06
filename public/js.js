document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesDiv = document.getElementById('messages');
    const userUsername = document.getElementById('user-username'); 
    const emojiButton = document.getElementById('emoji-button'); 

    const socket = io(); 

    let username = prompt('Digite seu nome de usuário:');
    socket.emit('setUsername', username);
    userUsername.textContent = username; 

    const insertEmoji = (emoji) => {
        const currentMessage = messageInput.value;
        const newMessage = currentMessage + emoji.native;
        messageInput.value = newMessage;
    };

    emojiButton.addEventListener('click', () => {
        if (typeof EmojiMart !== 'undefined') {
            const picker = new EmojiMart.Picker();
            picker.on('emoji', (emoji) => {
                insertEmoji(emoji);
            });
            picker.togglePicker(emojiButton); 
        } else {
            console.error('A biblioteca EmojiMart não está carregada corretamente.');
        }
    });

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value;
        socket.emit('message', { text: messageText, sender: username });
        messageInput.value = '';
    });

    socket.on('message', (data) => {
        const messageDiv = document.createElement('div');
        const isSender = data.sender === username;
        messageDiv.className = `message ${isSender ? 'sender' : 'recipient'}`;
        messageDiv.innerHTML = `<p><span class="message-username">${isSender ? 'Você' : data.sender}</span>: ${data.text}</p>`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
});
