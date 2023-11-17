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