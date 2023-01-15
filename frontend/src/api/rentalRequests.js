export async function getRentals(){
    const endpoint = "http://localhost:8000/api/rentals/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function getRentalCreateData(){
    const endpoint = "http://localhost:8000/api/rental_data/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function deleteRental(id) {
    const endpoint = `http://localhost:8000/api/rentals/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    });

    if (response.ok) {
        return true;
    }

    throw new Error(`${response.statusText}`)
}


export async function postRental(data) {
    const endpoint = "http://localhost:8000/api/rentals/";

    console.log(JSON.stringify(data));

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return true;
    }

    throw new Error(`${await response.text()}`)
}


export async function updateRental(id, data) {
    const endpoint = `http://localhost:8000/api/rentals/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return true;
    }

    throw new Error(`${await response.text()}`)
}