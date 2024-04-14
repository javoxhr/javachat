document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById("messages_container");
    const nameInput = document.getElementById("name-input");
    const messageInput = document.getElementById("message-input");
    const sendMessageButton = document.getElementById("send-message-button");

    let websocketClient = new WebSocket("ws://192.168.100.11:7815");

    // Функция для добавления сообщения в хранилище браузера
    function addMessageToStorage(message) {
        let messages = localStorage.getItem('messages');
        messages = messages ? JSON.parse(messages) : [];
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Функция для загрузки сообщений из хранилища браузера
    function loadMessagesFromStorage() {
        let messages = localStorage.getItem('messages');
        messages = messages ? JSON.parse(messages) : [];
        messages.forEach(message => {
            const messageDiv = createMessageDiv(message.name, message.message, message.type);
            messagesContainer.appendChild(messageDiv);
        });
    }

    // При открытии соединения с сервером WebSocket
    websocketClient.onopen = () => {
        console.log("Client connected!");

        // Обработчик нажатия кнопки отправки сообщения
        sendMessageButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            if (name !== "" && message !== "") {
                const data = JSON.stringify({ name: name, message: message, type: "outgoing" });
                websocketClient.send(data);
                messageInput.value = ""; // Очищаем поле ввода после отправки
                // Добавляем сообщение в хранилище браузера
                addMessageToStorage({ name: name, message: message, type: "outgoing" });
            }
        });
    };

    // При закрытии соединения с сервером WebSocket
    websocketClient.onclose = () => {
        console.log("Connection closed!");
    };

    websocketClient.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const messageDiv = createMessageDiv(data.name, data.message, data.type);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Прокручиваем контейнер сообщений вниз
        // Добавляем входящее сообщение в хранилище браузера
        addMessageToStorage(data);
    };

    function createMessageDiv(name, message, type) {
        const messageWrapper = document.createElement("div");
        const messageDiv = document.createElement("div");
        const nameElement = document.createElement("span");
        nameElement.textContent = name + ": ";
        messageDiv.appendChild(nameElement);
        const messageText = document.createTextNode(message);
        messageDiv.appendChild(messageText);
        messageDiv.style.padding = "10px";
        messageDiv.style.borderRadius = "5px 5px 5px 0";
        messageDiv.style.marginBottom = "10px";
        messageDiv.style.maxWidth = "100%"; // Ограничиваем максимальную ширину сообщения
        messageDiv.style.overflowWrap = "break-word"; // Добавляем перенос текста при необходимости
        
        messageWrapper.appendChild(messageDiv);
        messageWrapper.style.clear = "both"; // Очищаем float, чтобы обертки сообщений располагались вертикально
    
        if (type === "outgoing") {
            // Код для исходящих сообщений
            messageWrapper.style.justifyContent = "flex-end"; // Выравниваем исходящие сообщения справа
            messageDiv.style.backgroundColor = "rgb(145, 253, 254)"; // Цвет для исходящих сообщений
        } else {
            // Код для входящих сообщений
            console.log("Incoming message"); // Отладочный вывод
            messageWrapper.style.justifyContent = "flex-start"; // Выравниваем входящие сообщения слева
            messageDiv.style.backgroundColor = "red"; // Цвет для входящих сообщений
        }        
        
        return messageWrapper;
    }
    

    // При загрузке страницы вызываем функцию для загрузки сообщений из хранилища браузера
    loadMessagesFromStorage();
});
