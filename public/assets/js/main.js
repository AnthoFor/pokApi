import { drawNavbar, hide, unhide, fetchData, drawMsg } from "./functions.js";

// VAR
let usermail;
let userpw;
// let uri = 'http://localhost:8080/' ;
let uri = 'https://pokapi.anthony-foret.fr/';


// Déjà loggé ?
if (localStorage.getItem('token')) {
    // On récupère le token et on l'envoie pour vérifier si c'est valide ou pas
    fetch(uri + "api/validUser", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then((res) => {
        if (res.status === 401) {
            throw new Error(`erreur de validation : ${res.status}`)
        }
        return res;
    })
    .then((res) => {
        let firstnameB = localStorage.getItem('firstname');
        drawNavbar();
        hide(document.querySelector('#loginForm'));
        drawMsg('#welcDiv > span', `bonjour ${firstnameB}, connexion établie.`)
    })
    .catch((err) => {
        console.log('erreur : ', err.message);
    })
}

// EventListener
// Pas encore de compte
document.querySelector('#signupBtn').addEventListener('click', () => {
    usermailCheckDiv.classList.toggle('d-none');
    userPwCheck.classList.toggle('d-none');
    loginBtn.innerHTML = 'Créer';
    signupBtn.classList.toggle('d-none');
    alreadySignedBtn.classList.toggle('d-none');
})

// Deja un compte mais j'ai cliqué sur pas encore de compte ( ca mongolise !!)
document.querySelector('#alreadySignedBtn').addEventListener('click', () => {
    usermailCheckDiv.classList.toggle('d-none');
    userPwCheck.classList.toggle('d-none');
    loginBtn.innerHTML = 'Connexion';
    signupBtn.classList.toggle('d-none');
    alreadySignedBtn.classList.toggle('d-none');
    usermailCheck.value = '';
})

// LOGIN ou signup ?
document.querySelector("#loginBtn").addEventListener("click", async function () {
    event.preventDefault();
    usermail = document.querySelector("#usermail").value;
    userpw = document.querySelector("#userpw").value;
    // validation front
    // A FAIRE.................. 
    // SIGN UP
    if (document.querySelector("#usermailCheck").value) {
        let userMailCheck = document.querySelector("#usermailCheck").value;
        let userPwCheck = document.querySelector("#userpwCheck").value;
        if (userPwCheck !== userpw) {
            loginFormError.innerHTML = `Les mots de passse doivent être identique.`
        } else if (userMailCheck !== usermail) {
            loginFormError.innerHTML = `Les 2 mails ne correspondent pas.`
        } else {
            try { 
                const response = await fetchData(uri + "api/signup", {
                    method: "POST",
                    body: JSON.stringify({ usermail: usermail, password: userpw }),
                    headers: { "Content-type": "application/json" }
                })
                if (response.status ==! 500) {
                    drawMsg('#welcDiv > span', `Veuillez vérifier vos mail (spam inclus)`)
                } else {
                    loginFormError.innerHTML = `${response.message}`;
                }
            } catch(e) {
                console.log(e)
            }
        }
    // SIGN IN
    } else {
        try { 
            const response = await fetchData(uri + "api/login", {
                method: "POST",
                body: JSON.stringify({ usermail: usermail, password: userpw }),
                headers: { "Content-type": "application/json" }
            })
            if (response.token !== undefined) {
                let usermail = response.data.usermail;
                let [username, domaine] = usermail.split('@');
                let [lastname, firstname] = username.split('.');
                const firstnameB = firstname != undefined ? firstname : username;
                localStorage.setItem('token', response.token);
                localStorage.setItem('firstname', firstnameB);
                // localStorage.setItem('lastname', lastname);
                drawNavbar();
                hide(document.querySelector('#loginForm'));
                drawMsg('#welcDiv > span', `bonjour ${firstnameB}, connexion établie.`)
            } else {
                loginFormError.innerHTML = `${response.message}`;
            }
        } catch(e) {
            console.log(e)
        }
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

// LISTE DES POKEMONS avec recherches
document.querySelector('#pokemonSearchBtn').addEventListener('click', function() {
    event.preventDefault();
    console.log('cherche!')
})