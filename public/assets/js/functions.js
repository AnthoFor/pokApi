export function drawNavbar() {
    let navbarElements = document.querySelectorAll('nav .d-none');
    navbarElements.forEach(element => {
        element.classList.toggle("d-none");
    });
}

export function hide(element) {
    element.classList.add("d-none");
}

export function unhide(element) {
    element.classList.remove("d-none");
}

export function drawMsg(domElement, message) {
    document.querySelector(domElement).innerHTML = message;
}

export function drawPagination(count, page, limit) {
    if (limit == 'Tout') {
        pagiDiv.classList.add('d-none');
    } else if (count > limit) {
        // calcul du nombre de page total :
        let nbPageTotal = Math.ceil(count / limit);
        pagiDiv.classList.remove('d-none');
        let pageItems = '';
        let isActivePage;
        for (let index = 1; index <= nbPageTotal; index++) {
            if (index === page) {
                isActivePage = 'active';
            } else {
                isActivePage = '';
            }
            pageItems += `
            <li class="page-item ${isActivePage}"><a class="page-link" href="#" data-topage="${index}">${index}</a></li>`;
        }
        let isPreviousDisabled;
        if ((page - 1) === 0) {
            isPreviousDisabled = 'disabled';
        } else {
            isPreviousDisabled = '';
        }
        let isNextDisabled;
        if (page === nbPageTotal) {
            isNextDisabled = 'disabled';
        } else {
            isNextDisabled = '';
        }
        paginationId.innerHTML = `
        <li class="page-item  ${isPreviousDisabled}">
            <a class="page-link" href="#" data-topage="${page-1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        ${pageItems}
        <li class="page-item  ${isNextDisabled}">
            <a class="page-link" href="#" data-topage="${page+1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        `;
    } 
}

export function limitTerm(limit) {
    let limitTerms;
    if (Number.isInteger(limit)) {
        limitTerms = `limit=${limit}`;
    } else {
        limitTerms = '';
    }
    return limitTerms;
}

export function offsetTerm(page, limit) {
    let offsetTerms;
    if(Number.isInteger(page)) {
        if (limit == 'Tout') {
            limit = 0;
        }
        let offset = (page - 1) * limit;
        offsetTerms = `offset=${offset}`; 
    } else {
        offsetTerms = '';
    }
    return offsetTerms;
}

export async function fetchData(uri, params) {
    try {
        const response = await fetch(uri, params)
        const data = await response.json()
        return data
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}

export function fullPokeDiv(results) {
    let pokeDiv = document.querySelector('#pokemonsList > .row');
    pokeDiv.innerHTML = '';
    unhide(document.querySelector('#pokemonsList'));
    results.forEach(element => {
        pokeDiv.innerHTML += `
        <div class="card m-1 p-0" style="width: 18rem;">
            <div class="card-header">${element.name}</div>
            <img src="${element.picture}" class="card-img-top" alt="...">
            <div class="card-body">
                <a href="#" class="btn btn-primary btn-pokemon" data-id="${element.id}" data-bs-toggle="modal" data-bs-target="#pokeDetail">Détails</a>
            </div>
        </div>
        `;
    });
}

export function createFullUri(uri, search, page, limit) {
    let totalTerms = []
    if (search) {
        totalTerms.push(`name=${searchPokeInput.value}`)
    }
    let limitTerms = limitTerm(limit);
    if (limitTerms) {
        totalTerms.push(limitTerms)
    }
    let offsetTerms = offsetTerm(page, limit);
    if (offsetTerms) {
        totalTerms.push(offsetTerms)
    }
    let fullUri = uri + `api/pokemons?`+totalTerms.join("&");
    return fullUri
}