const dogBar = document.querySelector("div#dog-bar")
const url = "http://localhost:3000/pups"
const mainDiv = document.querySelector("div#dog-summary-container")
const filterBtn = document.querySelector('button')


document.addEventListener("DOMContentLoaded", function(event) {
    loadDogs().then(addAllDogsToDogBar)
})

filterBtn.addEventListener('click', function(event) {
    // console.log("filter click")
    if (filterBtn.textContent === "Filter good dogs: OFF") {
        filterBtn.textContent = "Filter good dogs: ON"
    }
    else if (filterBtn.textContent === "Filter good dogs: ON") {
        filterBtn.textContent = "Filter good dogs: OFF"
    }
})

dogBar.addEventListener("click", function(event) {
    console.log("cloicked)")
    if (event.target.matches('span')) {
    const id = event.target.dataset.id 
    fetchDog(id)
    }
})

function loadDogs() {
    fetch(url)
    .then(response => response.json())
    .then(dogsData => {
    dogsData.forEach(dogObj => {
        renderDogBar(dogObj)
    })
    })
}

function renderDogBar(dogObj) {
    
    const div = document.createElement('div')
    div.dataset.id = dogObj.id
    const span = document.createElement('span')
    span.innerHTML = `${dogObj.name}` 
    span.dataset.id = dogObj.id
    const li = document.createElement('li')
    li.dataset.id = dogObj.id
    li.classList.add('dog-card')
    // debugger
    span.innerHTML = `
    <h3>${dogObj.name}</h3>`
    dogBar.append(span)
}

function renderDog(dogObj) {

    const dogInfo = document.querySelector('div#dog-info')
    dogInfo.innerHTML = ""
    let img = document.createElement('img')
    let h2 = document.createElement('h2')
    let button = document.createElement('button')
    button.classList.add('toggle-button')

    dogInfo.dataset.id = dogObj.id 

    img.src = dogObj.image 
    img.alt = dogObj.name 
    h2.textContent = dogObj.name
    if (dogObj.isGoodDog === true) {
        button.textContent = "Good Dog!"
    }
    if (dogObj.isGoodDog === false) {
    button.textContent = "Bad Dog!"
    }
    
    button.addEventListener('click', function(event) {
        let newValue
        if (button.textContent === "Good Dog!") {
            button.textContent = "Bad Dog!"
            let id = event.target.parentNode.dataset.id
            newValue = false 
            toggleGoodDog(id, newValue)
        }
        else if (button.textContent === "Bad Dog!") {
            button.textContent = "Good Dog!"
            newValue = true 
            let id = event.target.parentNode.dataset.id
            toggleGoodDog(id, newValue)
        }
    })
    dogInfo.append(img, h2, button)
    // debugger
}

function fetchDog(dogId) {
    fetch(`${url}/${dogId}`)
    .then(res => res.json())
    .then(dogObj => {
        renderDog(dogObj)
    })
}

function toggleGoodDog(id, newValue) {
    const options = {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: newValue
        })
    }
     fetch(`${url}/${id}`, options)
    .then(r => r.json())
}

function getDogs(){
    return fetch(url)
    .then(r => r.json())
}

function updateDogBar() {
    if (filterBtn.textContent.includes("OFF")) {
        getDogs().then(dogArray => addAllDogsToDogBar(dogArray))
    } else {
        getDogs().then(dogArray => addAllDogsToDogBar(dogArray, true))
        }
    }

function addAllDogsToDogBar(dogArray, filter = false) {
    dogBar.innerHTML = ""
    if (filter) {
        dogArray.filter(dog => dog.isGoodDog).forEach(renderDogBar())
    } else {
        dogArray.forEach(renderDogBar(dogObj))
    }
}