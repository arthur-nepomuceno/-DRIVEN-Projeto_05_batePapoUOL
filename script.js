//==================================================================================
//=============================== ENTERING CHAT ROOM ===============================
//================================ & STAYING ONLINE ================================
//==================================================================================

let user;
let userInfo;

function enterLogin() {
    user = document.querySelector(".entrance-login input").value;
    userInfo = {name: user};
    enterChatRoom();
    getContacts();
    document.querySelector(".entrance").classList.add("hidden");

}

function enterChatRoom(){    
    const ticket = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",
    userInfo);
    ticket.then(getMessages);
    ticket.catch(userError);
}

function stayOnline(){
    if (userInfo != null) {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userInfo);
    }    
}

setInterval(stayOnline, 1 * 4000);


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

function loadMessages(response){ 
    messagesList = response.data;
    for(let i = (messagesList.length-30); i < messagesList.length; i++) {
        writeMessages(messagesList[i]);        
    }

    pageContent.lastChild.scrollIntoView();    
    lastPosition = messagesList.length-1;
    lastMessage = messagesList[lastPosition];
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

function isStatusMessage(messageInfo) {
    if (messageInfo.type == "status") {
        return true;
    }
    return false;
}

function isPublicMessage(messageInfo) {
    if (messageInfo.type == "message" && typeOfMessage == "Público") {
        return true;
    }
    return false;
}

function isPrivateMessage(messageInfo) {
    if (messageInfo.type == "message" && typeOfMessage == "Reservadamente" && messageInfo.from == user) {
        return true;
    }
    return false;
}

setInterval(getMessages, 1 * 3000);

//==================================================================================
//========================= UPDATING MESSAGES AUTOMATICALLY ========================
//==================================================================================
/*
function getLastMessage(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadLastMessage);
    //promise.catch(codeError);
}

function loadLastMessage(response){
    messagesList = response.data;
    if (lastMessage.text != messagesList[lastPosition].text) {
        lastMessage = messagesList[lastPosition]
        writeMessages(lastMessage);
        pageContent.lastChild.scrollIntoView();
    }
    return;
}

setInterval(getLastMessage, 1 * 500);*/


//==================================================================================
//=============================== SENDING MESSAGES =================================
//==================================================================================
let destinyUser = "Todos";
let typeOfMessage;

function sendMessages() {
    let input = document.querySelector(".bottom input");
    let message = {from: `${user}`, 
    to: `${destinyUser}`,
    text: `${input.value}`,
    type: "message"}

    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    request.then(getMessages);
    request.catch(sendMessageError);

    input.value = "";

}

function sendingTo(){
    const sendTo = document.querySelector(".bottom p");
    if (typeOfMessage == "Reservadamente") {
        sendTo.innerHTML = `Enviando para ${destinyUser} (reservadamente)`;
    } else if (typeOfMessage == "Público") {
        sendTo.innerHTML = `Enviando para ${destinyUser} (publicamente)`;
    }
    
}


//==================================================================================
//================================== TREATING ERROS ================================
//==================================================================================
function userError(error){
    const statusCode = error.response.status;
    alert(`Erro: ${statusCode}.
    Nome de usuário já está em uso.
    Por favor, escolha outro nome e tente novamente.`);
    window.location.reload();
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

function chooseUser(clicked) {
    const selectedOption = document.querySelector(".contacts-list-options .selected");
    if (selectedOption != null) {
        clicked.querySelector(".check").classList.add("selected");
        selectedOption.classList.remove("selected");
    }
    clicked.querySelector(".check").classList.add("selected");

    destinyUser = clicked.querySelector(".selected").parentNode.querySelector("p").innerHTML;
    sendingTo()
}

function chooseTypeOfMessage(clicked) {
    const selectedOption = document.querySelector(".contacts-visibility-options .selected");
    if (selectedOption != null) {
        clicked.querySelector(".check").classList.add("selected");
        selectedOption.classList.remove("selected");
    }
    clicked.querySelector(".check").classList.add("selected");
    
    typeOfMessage = clicked.querySelector(".selected").parentNode.querySelector("p").innerHTML;
    sendingTo();
}

function getContacts() {
    const contacts = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    contacts.then(loadContacts);
    contacts.catch(codeError)
}


let contactListNames;
let contactListContent = document.querySelector(".contacts-list-options");

function loadContacts(response) {   
    contactListContent.innerHTML = `<div class="contacts-list option" onclick="chooseUser(this)">
                                        <img src="./img/contacts.png">
                                        <p>Todos</p>
                                        <img class="check selected" src="./img/check.png">
                                    </div>`
    
    contactListNames = response.data;
    for (let i = 0; i < contactListNames.length; i++) {
        if (contactListNames[i].name != user) {
            let contactOption = `<div class="contacts-list option" onclick="chooseUser(this)">
                                    <img src="./img/contacts.png">
                                    <p>${contactListNames[i].name}</p>
                                    <img class="check" src="./img/check.png">
                                </div>`

            contactListContent.innerHTML += contactOption;
        }        
    }
}

setInterval(getContacts, 1 * 10000);