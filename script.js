let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".delete-btn");
let modal = document.querySelector(".modal-cont");
let textarea = document.querySelector(".text-cont");
let mainCont = document.querySelector(".main-cont")
let allPriorityColor = document.querySelectorAll(".priority-color");
let color = ["lightpink", "lightblue", "lightgreen", "black"];
let defaultPriorityColor = color[color.length - 1];
let lockCont = document.querySelector(".ticket-lock");
let allTicketColor = document.querySelectorAll(".ticket-color");
let toolboxColor = document.querySelectorAll(".color");

let addflag = false;
let removeFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-unlock";
let ticketsArr = [];

if(localStorage.getItem("jira-ticket")){
    ticketsArr = JSON.parse(localStorage.getItem("jira-ticket"));
    ticketsArr.forEach(ticketObj => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketText, ticketObj.ticketId);
    })
}

toolboxColor.forEach((colorDiv, idx) => {
    colorDiv.addEventListener("click", (e) => {
        let currentSelectedColor = colorDiv.classList[0];
        let filteredArr = ticketsArr.filter(ticketObj => {
            return ticketObj.ticketColor === currentSelectedColor;
        })

        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        allTicketsCont.forEach(ticketCont => {
            ticketCont.remove();
        })

        filteredArr.forEach(ticketCont => {
            createTicket(ticketCont.ticketColor, ticketCont.ticketText, ticketCont.ticketId);
        })
        
    })

    colorDiv.addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        allTicketsCont.forEach(ticketCont => {
            ticketCont.remove();
        })

        ticketsArr.forEach(ticketCont => {
            createTicket(ticketCont.ticketColor, ticketCont.ticketText, ticketCont.ticketId);
        })
    })
})

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    if(removeFlag){
        removeBtn.classList.add("delete-default");
    }
    else if(!removeFlag){
        removeBtn.classList.remove("delete-default");
    }
})

allPriorityColor.forEach((colorEle, idx) => {
    colorEle.addEventListener("click", (e) => {
        allPriorityColor.forEach((tempColorEle, idx) => {
            tempColorEle.classList.remove("default");
        })
        colorEle.classList.add("default");
        
        defaultPriorityColor = colorEle.classList[0];
    })
})

addBtn.addEventListener('click', (e) => {

    addflag = !addflag;
    if (addflag) {
        modal.style.display = "flex";
    }
    else {
        modal.style.display = "none";
    }
})

modal.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key == "Shift") {
        createTicket(defaultPriorityColor, textarea.value);
        addflag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketText, ticketId) {
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">
            ${id}
            </div>
        <div class="ticket-text">
            ${ticketText}
        </div>
        <div class="ticket-lock">
        <i class="fas fa-lock"></i>
        </div>
        `
    mainCont.appendChild(ticketCont);
    if(!ticketId){
        let ticketObj = {ticketColor, ticketId: id, ticketText};
        ticketsArr.push(ticketObj);
        localStorage.setItem('jira-ticket', JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id){
    ticket.addEventListener("click", (e) => {
        if(removeFlag){
            let ticketidx = getTicketIdx(id);
            ticketsArr.splice(ticketidx, 1);
            localStorage.setItem("jira-ticket", JSON.stringify(ticketsArr));
            ticket.remove();
        }
    }) 
}
function handleLock(ticket, id){
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let tickettext = ticket.querySelector(".ticket-text");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            tickettext.setAttribute("contenteditable", "true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            tickettext.setAttribute("contenteditable", "false");
        }

        ticketsArr[ticketIdx].ticketText = tickettext.innerText;
        localStorage.setItem("jira-ticket", JSON.stringify(ticketsArr));
    })
}
function handleColor(ticket, id){
    let ticketColorEle = ticket.querySelector(".ticket-color");
    ticketColorEle.addEventListener("click", e => {
        let ticketIdx = getTicketIdx(id);

        let currentColor = ticketColorEle.classList[1];
        let currentColorIdx = color.findIndex((colorObj) => {
            return colorObj===currentColor;
        });
        currentColorIdx++;
        let newColorIdx = currentColorIdx % color.length;
        let newColor = color[newColorIdx];
        ticketColorEle.classList.remove(currentColor);
        ticketColorEle.classList.add(newColor);

        ticketsArr[ticketIdx].ticketColor = newColor;
        localStorage.setItem("jira-ticket", JSON.stringify(ticketsArr));
    })  
}

function getTicketIdx(id){
    let idx = ticketsArr.findIndex(ticketObj => {
        return ticketObj.ticketId === id;
    })
    return idx;
}
function setModalToDefault(){
    modal.style.display = "none";
    textarea.value = "";
    allPriorityColor.forEach((tempColorEle, idx) => {
        tempColorEle.classList.remove("default");
    })
    allPriorityColor[3].classList.add("default");
    defaultPriorityColor = color[color.length - 1];
}