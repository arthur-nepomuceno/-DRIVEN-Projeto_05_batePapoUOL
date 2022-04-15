//==================================================================================
//=============================== ENTERING CHAT ROOM ===============================
//================================ & STAYING ONLINE ================================
//==================================================================================

const login = prompt("Login:");
const loginInfo = {name: login};
enterChatRoom();
setInterval(stayOnline, 1 * 3000);

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

function loadMessages(response){
    let pageContent = document.querySelector(".page-content");
    for(let i = 0; i < response.data.length; i++) {
        let message = `<div class="message">
                            <span>${i}</span>
                            <span class="time">(${response.data[i].time})</span>
                            <span class="from">${response.data[i].from}</span>
                            <span class="text">${response.data[i].text}</span>
                        </div>`
        pageContent.innerHTML += message;
    }
}


//==================================================================================
//=============================== SENDING MESSAGES =================================
//==================================================================================

function sendMessages() {
    let inputText = document.querySelector(".bottom input").value;
    let message = {from: `${login}`, 
    to: "Todos", 
    text: `${inputText}`,
    type: "message"}

    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    request.then(loadMessages);
    request.catch(codeError);
}


//==================================================================================
//================================== TREATING ERROS ================================
//==================================================================================
function codeError(error){
    const statusCode = error.response.status;
    alert(`Error:  ${statusCode}`);
}
