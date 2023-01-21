export async function getGuests(){
    const endpoint = "http://localhost:8000/api/guests/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}


export async function postGuest(data) {
    const endpoint = "http://localhost:8000/api/guests/";

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

    throw new Error(`${await response.text()}`);
}


export async function deleteGuest(id) {
    const endpoint = `http://localhost:8000/api/guests/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    });

    if (response.ok) {
        return true;
    }

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}


export async function updateGuest(id, data) {
    const endpoint = `http://localhost:8000/api/guests/${id}/`;

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

    throw new Error(`${await response.text()}`);
}


export async function getGuest(id) {
    const endpoint = `http://localhost:8000/api/guests/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}


export async function getGuestInfo(id) {
    const endpoint = `http://localhost:8000/api/guests/${id}/info/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "GET",
    });

    if (response.ok) {
        const json = await response.json();
        console.log(json);
        return json;
    }

    throw new Error(`${await response.text()}`);
}