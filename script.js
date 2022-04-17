//==================================================================================
//=============================== ENTERING CHAT ROOM ===============================
//================================ & STAYING ONLINE ================================
//==================================================================================

const login = prompt("Login:");
const loginInfo = {name: login};
enterChatRoom();
setInterval(stayOnline, 1 * 4000);

function enterChatRoom(){
    const enterRequest = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", loginInfo);
    enterRequest.then(getMessages);
    enterRequest.catch(codeError);
}

function stayOnline(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", loginInfo);
}


//==================================================================================
//=============================== GETTING MESSAGES =================================
//============================ & LOADING IT ON SCREEN ==============================
//==================================================================================

function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadMessages);
    promise.catch(codeError);
}


let lastMessage;
let lastPosition;
let pageContent = document.querySelector(".page-content");

function loadMessages(response){    
    for(let i = (response.data.length-30); i < response.data.length; i++) {
        writeMessage(response.data[i]);        
    }

    pageContent.lastChild.scrollIntoView();
    
    lastPosition = response.data.length-1;
    lastMessage = response.data[lastPosition].text;
}

function writeMessage(messageInfo) {
    if (messageInfo.type == "status") { 
        let message = `<div class="message gray">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;

    } else if (messageInfo.type == "message" && messageInfo.to == "Todos") {
        let message = `<div class="message white">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="to">para <strong>${messageInfo.to}</strong>:</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;

    } else if (messageInfo.type == "message" && messageInfo.to != "Todos") {
        let message = `<div class="message pink">
                            <span class="time">(${messageInfo.time})</span>
                            <span class="from">${messageInfo.from}</span>
                            <span class="to">reservadamente para <strong>${messageInfo.to}</strong>:</span>
                            <span class="text">${messageInfo.text}</span>
                        </div>`
        pageContent.innerHTML += message;
    }
}




//==================================================================================
//========================= UPDATING MESSAGES AUTOMATICALLY ========================
//==================================================================================

function getLastMessage(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadLastMessage);
    promise.catch(codeError);
}

function loadLastMessage(response){
    lastPosition = response.data.length-1;

    if (lastMessage != response.data[lastPosition].text) {
        
        writeMessage(response.data[lastPosition]);
        pageContent.lastChild.scrollIntoView();
        lastMessage = response.data[lastPosition].text;
    }
    return;
}

setInterval(getLastMessage, 1 * 1000);


//==================================================================================
//=============================== SENDING MESSAGES =================================
//==================================================================================

function sendMessages() {
    let input = document.querySelector(".bottom input");
    let message = {from: `${login}`, 
    to: "Todos", 
    text: `${input.value}`,
    type: "message"}

    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    request.then(loadMessages);
    request.catch(codeError);

    input.value = "";
}


//==================================================================================
//================================== TREATING ERROS ================================
//==================================================================================
function codeError(error){
    const statusCode = error.response.status;
    alert(`Error:  ${statusCode}`);
}
