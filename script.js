//const login = prompt("Login:");
//const loginInfo = {name: login};

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

function codeError(error){
    const statusCode = error.response.status;
    alert(`Error:  ${statusCode}`);
}

getMessages()

