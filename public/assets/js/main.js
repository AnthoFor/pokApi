import { drawNavbar, hide, unhide, fetchData, drawMsg, drawPagination, fullPokeDiv, createFullUri } from "./functions.js";

// VAR
let usermail;
let userpw;
let uri = 'http://localhost:8080/' ;
// let uri = 'https://pokapi.anthony-foret.fr/';
let limit ='Tout';
let page = 1;
let headerParams = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};

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
        unhide(document.querySelector('#selectResultPerPage'));
        // hide(document.querySelector('#loginForm'));
        drawMsg('#welcDiv > span', `bonjour ${firstnameB}, connexion établie.`)
    })
    .catch((err) => {
        console.log('erreur : ', err.message);
        unhide(document.querySelector('#loginForm'))
    })
} else {
    unhide(document.querySelector('#loginForm'))

}

// Pas encore de compte
document.querySelector('#signupBtn').addEventListener('click', () => {
    event.preventDefault();
    usermailCheckDiv.classList.toggle('d-none');
    userPwCheck.classList.toggle('d-none');
    loginBtn.innerHTML = 'Créer';
    signupBtn.classList.toggle('d-none');
    alreadySignedBtn.classList.toggle('d-none');
})

// Deja un compte mais j'ai cliqué sur pas encore de compte ( ca mongolise !!)
document.querySelector('#alreadySignedBtn').addEventListener('click', () => {
    event.preventDefault();
    usermailCheckDiv.classList.toggle('d-none');
    userPwCheck.classList.toggle('d-none');
    loginBtn.innerHTML = 'Connexion';
    signupBtn.classList.toggle('d-none');
    alreadySignedBtn.classList.toggle('d-none');
    usermailCheck.value = '';
})

// LOGIN ou SIGNUP ?
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
                if (response.status !== 500) {
                    drawMsg('#welcDiv > span', `Veuillez vérifier vos mail (spam inclus)`)
                } else {
                    loginFormError.innerHTML = `${response.message}`;
                }
            } catch(e) {
                console.log(e)
            }
        }
    } 
    // SIGN IN
    else {
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
                headerParams = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
                // localStorage.setItem('lastname', lastname);
                drawNavbar();
                hide(document.querySelector('#loginForm'));
                unhide(document.querySelector('#selectResultPerPage'));
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
document.querySelector('#findAllPokemons').addEventListener('click', async function () {
    page = 1;
    searchPokeInput.value = '';
    let fullUri = createFullUri(uri, searchPokeInput.value, page, limit);
    try {
        const res = await fetchData(fullUri, headerParams);
        drawPagination(res.count, page, limit)
        fullPokeDiv(res.data);
        msgFromDb.innerHTML = res.message;
    } catch(e) {
        console.log(e)
    }
});

// LISTE DES POKEMONS avec recherches
document.querySelector('#pokemonSearchBtn').addEventListener('click', async function() {
    event.preventDefault();
    page = 1;
    let fullUri = createFullUri(uri, searchPokeInput.value, page, limit);
    try {
        const res = await fetchData(fullUri, headerParams)
        drawPagination(res.count, page, limit)
        fullPokeDiv(res.data);
        msgFromDb.innerHTML = res.message;
    } catch(e) {
        console.error(e)
    }
})

// Event Listener spécifique
document.addEventListener('click', async function(event) {
    // Afficher un pokemon en mode solo
    if (event.target.classList.contains('btn-pokemon')) {
        let idPoke = parseInt(event.target.dataset.id);
        let fullUri = uri + `api/pokemons/${idPoke}`; 
        try {
            const res = await fetchData(fullUri, headerParams)
            let results = res.data;
            unhide(document.querySelector('#pokemonsList'));
            let types = results.types.join(', ');
            pokeModalTitle.innerHTML = `${results.name}`;
            pokeModalBody.innerHTML = `
            <img src="${results.picture}" class="card-img-top" alt="${results.name} picture">
            <p class="card-text">Point de vie: ${results.hp}</p>
            <p class="card-text">Point de combat: ${results.cp}</p>
            <p class="card-text">type : ${types}</p>
            `;
        } catch(e) {
            console.error(e);
        }
        searchPokeInput.value = '';
    }
    // Prise en compte d'un nombre maxi (limit)
    if (event.target.id ==='resultPerPage') {
        if (event.target.value !== 'Tout') {
            limit = parseInt(event.target.value);
        } else {
            limit = 'Tout';
        }
        let fullUri = createFullUri(uri, searchPokeInput.value, page, limit);
        try {
            const res = await fetchData(fullUri, headerParams)
            drawPagination(res.count, page, limit)
            fullPokeDiv(res.data);
            msgFromDb.innerHTML = res.message;
        } catch(e) {
            console.log(e)
        }
    }
    // Gestion de la page (offset)
    if (event.target.classList.contains('page-link')) {
        page = parseInt(event.target.dataset.topage);
        let fullUri = createFullUri(uri, searchPokeInput.value, page, limit);
        try {
            const res = await fetchData(fullUri, headerParams)
            drawPagination(res.count, page, limit)
            fullPokeDiv(res.data);
            msgFromDb.innerHTML = res.message;
        } catch(e) {
            console.log(e)
        }
    }
    // Déconnexion
    if (event.target.id === "signout") {
        localStorage.clear();
        location.reload(true);
    }
})