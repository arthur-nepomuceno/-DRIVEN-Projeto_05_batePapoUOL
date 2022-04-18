//==================================================================================
//=============================== ENTERING CHAT ROOM ===============================
//================================ & STAYING ONLINE ================================
//==================================================================================

/*
ask login
verify if login is available
if yes, go on
if not, asks for new login
*/


let user;
let userInfo;
enterChatRoom();
getContacts();
setInterval(stayOnline, 1 * 4000);

function enterChatRoom(){
    user = prompt("Enter user name:");
    userInfo = {name: user};

    const ticket = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",
    userInfo);
    ticket.then(getMessages);
    ticket.catch(userError);
}

function stayOnline(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userInfo);
}


//==================================================================================
//=============================== GETTING MESSAGES =================================
//============================ & LOADING IT ON SCREEN ==============================
//==================================================================================


let messagesList;
let lastPosition;
let lastMessage;
let pageContent = document.querySelector(".page-content");

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadMessages);
    //promise.catch(alert("Erro ao carregar mensagens. Pressione F5 e tente novamente"));
}

function isStatusMessage(messageInfo) {
    if (messageInfo.type == "status") {
        return true;
    }
    return false;
}

function isPublicMessage(messageInfo) {
    if (messageInfo.type == "message" && messageInfo.to == "Todos") {
        return true;
    }
    return false;
}

function isPrivateMessage(messageInfo) {
    if (messageInfo.type == "message" && messageInfo.to != "Todos" && messageInfo.from == user) {
        return true;
    }
    return false;
}

function writeMessages(messageInfo) {
    if (isStatusMessage(messageInfo)) { 
        let message = `<div class="message gray">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;

    } else if (isPublicMessage(messageInfo)) {
        let message = `<div class="message white">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="to">para <strong>${messageInfo.to}</strong>:</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;

    } else if (isPrivateMessage(messageInfo)) {
        let message = `<div class="message pink">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="to">reservadamente para <strong>${messageInfo.to}</strong>:</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;
    }
}

function loadMessages(response){ 
    messagesList = response.data;
    for(let i = (messagesList.length-30); i < messagesList.length; i++) {
        writeMessages(messagesList[i]);        
    }

    pageContent.lastChild.scrollIntoView();    
    lastPosition = messagesList.length-1;
    lastMessage = messagesList[lastPosition];
}




//==================================================================================
//========================= UPDATING MESSAGES AUTOMATICALLY ========================
//==================================================================================

function getLastMessage(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadLastMessage);
    //promise.catch(codeError);
}

function loadLastMessage(response){
    messagesList = response.data;
    /*
    percorrer a lista de mensagens
    verificar, a cada item da lista, se o texto da mensagem é igual ao texto da última
    mensagem enviada.
    se sim, não fazer nada.
    se não, pegar todas as novas mensagens e carregar elas na tela.
    */

    if (lastMessage.text != messagesList[lastPosition].text) {
        lastMessage = messagesList[lastPosition]
        writeMessages(lastMessage);
        pageContent.lastChild.scrollIntoView();
    }
    return;
}

setInterval(getLastMessage, 1 * 500);


//==================================================================================
//=============================== SENDING MESSAGES =================================
//==================================================================================

function sendMessages() {
    let input = document.querySelector(".bottom input");
    let message = {from: `${user}`, 
    to: "Todos", 
    text: `${input.value}`,
    type: "message"}

    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    request.then(getLastMessage);
    request.catch(sendMessageError);

    input.value = "";
}


//==================================================================================
//================================== TREATING ERROS ================================
//==================================================================================
function userError(error){
    const statusCode = error.response.status;
    alert(`Erro: ${statusCode}.
    Nome de usuário já está em uso.
    Por favor, escolha outro nome e tente novamente.`);
    enterChatRoom();
}

function sendMessageError(error){
    const statusCode = error.response.status;
    alert(`Você está offline. Aperte "ENTER" para reiniciar o chat.`);
    window.location.reload();
}

function codeError(error){
    const statusCode = error.response.status;
    alert(`Erro: ${statusCode}`)
}

//==================================================================================
//=================================== CONTACT LIST =================================
//==================================================================================

function contactList() {
    const cover = document.querySelector(".cover");
    const contacts = document.querySelector(".contacts");
    cover.classList.toggle("hidden");
    contacts.classList.toggle("hidden");
}

function check(clicked) {
    clicked.querySelector(".check").classList.toggle("hidden");
}

function getContacts() {
    const contacts = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    contacts.then(loadContacts);
    contacts.catch(codeError)
}

function loadContacts(response) {
    let contactList = document.querySelector(".contact-list");
    for (let i = 0; i < response.data.length; i++) {
        let contactOption = `<div class="contacts-list option" onclick="check(this)">
                                <img src="./img/contacts.png">
                                <p>${response.data[i].name}</p>
                                <img class="check hidden" src="./img/check.png">
                            </div>`

        contactList.innerHTML += contactOption;
    }
}