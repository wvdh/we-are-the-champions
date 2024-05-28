
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js"

import { getDatabase,
         ref,
         push,
         onValue,
         remove }
        from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js"

const appSettings = {
      databaseURL: "https://realtime-database-a524d-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsListInDB = ref(database, "endorsementsList")

const textFieldEl = document.getElementById("text-field")
const publishButtonEl = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements-list")

function updatePublishButtonState() {
    if (textFieldEl.value.trim() === "") {
        publishButtonEl.disabled = true
    } else {
        publishButtonEl.disabled = false
    }
}

updatePublishButtonState()
textFieldEl.addEventListener("input", updatePublishButtonState)
publishButtonEl.addEventListener("click", function() {
    let inputValue = textFieldEl.value
    
    push(endorsementsListInDB, inputValue)
    
    clearInputFieldEl()
    updatePublishButtonState()
})

onValue(endorsementsListInDB, function(snapshot) {
        
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearEndorsementsListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToEndorsementsListEl(currentItem)
        }    
    } else {
        endorsementsListEl.innerHTML = "Be the first to place a endorsement!"
    }
})

function clearEndorsementsListEl() {
    endorsementsListEl.innerHTML = ""
}

function clearInputFieldEl() {
    textFieldEl.value = ""
}

function appendItemToEndorsementsListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
        
    newEl.addEventListener("dblclick", function() {
        
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementsListEl.append(newEl)
}
