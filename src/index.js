const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

document.addEventListener('DOMContentLoaded',function() {
  fetchAllToys()
});


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    document.getElementById("add-new-toy-form").addEventListener("submit", createNewToy)
  } else {
    toyForm.style.display = 'none'
  }
})

function fetchAllToys(){
  fetch(`http://localhost:3000/toys`)
  .then(res => res.json())
  .then(toys => toys.forEach(toy => displayToy(toy)))
}

function displayToy(toy){
  let div = document.createElement("div")
  div.className = "card"
  div.dataset.id = toy.id
  
  let h2 = document.createElement('h2')
  h2.dataset.id = toy.id
  h2.innerHTML = toy.name

  let img = document.createElement('img')
  img.className = "toy-avatar"
  img.src = toy.image

  let p = document.createElement('p')
  p.innerHTML = `Likes: ${toy.likes}`

  let btn = document.createElement('button')
  btn.className = "like-btn"
  btn.innerText = "Like!"
  btn.dataset.id = toy.id
  btn.addEventListener('click', editLikes)

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(btn)
  document.getElementById("toy-collection").appendChild(div)
}

function createNewToy(e){
  e.preventDefault()
  console.log(e.target)

  let newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  // debugger
  addToyToDb(newToy)
}

function addToyToDb(newToy){
  fetch(`http://localhost:3000/toys`,{
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    method:"POST",
    body: JSON.stringify({
      name: newToy.name,
      image: newToy.image,
      likes: newToy.likes
    })
  })
  .then(response => response.json())
  .then(toy => displayToy(toy))
}

function editLikes(e){
  console.log(e.target.dataset.id)
  fetch(`http://localhost:3000/toys/${e.target.dataset.id}`)
  .then(response => response.json())
  .then(toy => changeLikes(toy,e))
}

function changeLikes(toy, e){
  console.log(toy, e.target)
  toy.likes += 1
  fetch(`http://localhost:3000/toys/${e.target.dataset.id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: toy.likes })
  })
  .then(res => res.json())
  .then(toy => updateLikes(toy, e))
}

function updateLikes(toy, e){
  let div = e.target.parentElement
  div.querySelector("p").innerText = `Likes: ${toy.likes}`
}