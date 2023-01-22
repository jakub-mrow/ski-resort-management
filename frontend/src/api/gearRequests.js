export async function getGearList(){
    const endpoint = "http://localhost:8000/api/gear/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${await response.text()}`);
}


export async function postGear(data) {
    const endpoint = "http://localhost:8000/api/gear/";

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

export async function deleteGear(id) {
    const endpoint = `http://localhost:8000/api/gear/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    });

    if (response.ok) {
        return true;
    }

    throw new Error(`${await response.text()}`);
}

export async function updateGear(id, data) {
    const endpoint = `http://localhost:8000/api/gear/${id}/`;

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

export async function getGear(id) {
    const endpoint = `http://localhost:8000/api/gear/${id}/`;

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

    throw new Error(`${await response.text()}`);
}


export async function getGearUnavailabilty(gear_id){
    const endpoint = `http://localhost:8000/api/gear/unavailabilty/?gear_id=${gear_id}`;

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

    throw new Error(`${response.statusText}`)
}