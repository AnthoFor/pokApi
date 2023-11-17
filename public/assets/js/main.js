import { drawNavbar, hide, unhide, fetchData } from "./functions.js";

// VAR
let usermail;
let userpw;
let uri = 'http://pokapi-env.eba-mm7ydr5d.eu-west-3.elasticbeanstalk.com/' ;


// EventListener
// LOGIN
document.querySelector("#loginBtn").addEventListener("click", async function () {
    event.preventDefault();
    usermail = document.querySelector("#usermail").value;
    userpw = document.querySelector("#userpw").value;
  // validation front
  // A FAIRE.................. 

    // FETCH 
    try { 
        const response = await fetchData(uri + "api/login", {
            method: "POST",
            body: JSON.stringify({ usermail: usermail, password: userpw }),
            headers: { "Content-type": "application/json" }
        })
        console.log(response);
        if (response.token !== undefined) {
            localStorage.setItem('token', response.token)
            drawNavbar()
            hide(document.querySelector('#loginForm'))
        } else {
            loginFormError.innerHTML = `${response.message}`;
        }
    } catch(e) {
        console.log(e)
    }
});

// LISTE DES POKEMONS
document.querySelector('#findAllPokemons').addEventListener('click', function () {
    fetch(uri + "api/pokemons", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then((res) => res.json())
    .then((res) => {
        let results = res.data;
        let pokeDiv = document.querySelector('#pokemonsList > .row');
        unhide(document.querySelector('#pokemonsList'));
        results.forEach(element => {
            let types = element.types.join(', ');
            pokeDiv.innerHTML += `
            <div class="card m-1 p-0" style="width: 18rem;">
                <div class="card-header">${element.name}</div>
                <img src="${element.picture}" class="card-img-top" alt="...">
                <div class="card-body">
                    <p class="card-text">Point de vie: ${element.hp}</p>
                    <p class="card-text">Point de combat: ${element.cp}</p>
                    <p class="card-text">type : ${types}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            `;
        });
    })
});