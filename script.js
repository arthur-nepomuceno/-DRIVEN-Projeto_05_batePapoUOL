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

let lastMessage = "";


function loadMessages(response){
    let pageContent = document.querySelector(".page-content");
    for(let i = (response.data.length-30); i < response.data.length; i++) {
        let message = `<div class="message">
                            <span class="time">(${response.data[i].time})</span>
                            <span class="from">${response.data[i].from}</span>
                            <span class="text">${response.data[i].text}</span>
                        </div>`
        pageContent.innerHTML += message;
        
    }
    pageContent.lastChild.scrollIntoView();
    let lastPosition = response.data.length-1;
    lastMessage = response.data[lastPosition].text;
}



//==================================================================================
//============================ UPDATING MESSAGES ===============================
//==================================================================================

function getLastMessage(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadLastMessage);
    promise.catch(codeError);
}

function loadLastMessage(response){
    let lastPosition = response.data.length-1;

    if (lastMessage != response.data[lastPosition].text) {
        let pageContent = document.querySelector(".page-content");
        let message = `<div class="message">
                            <span class="time">(${response.data[lastPosition].time})</span>
                            <span class="from">${response.data[lastPosition].from}</span>
                            <span class="text">${response.data[lastPosition].text}</span>
                        </div>`
        pageContent.innerHTML += message;
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
