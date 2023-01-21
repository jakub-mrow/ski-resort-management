export async function getReservations(){
    const endpoint = "http://localhost:8000/api/reservations/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}


export async function getReservationCreateData(){
    const endpoint = "http://localhost:8000/api/reservation_data/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}


export async function deleteReservation(id) {
    const endpoint = `http://localhost:8000/api/reservations/${id}/`;

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


export async function postReservation(data) {
    const endpoint = "http://localhost:8000/api/reservations/";

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


export async function updateReservation(id, data) {
    const endpoint = `http://localhost:8000/api/reservations/${id}/`;

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