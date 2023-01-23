export async function getDuties(){
    const endpoint = "http://localhost:8000/api/duties/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function getDutyCreateData(){
    const endpoint = "http://localhost:8000/api/duty_data/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function deleteDuty(id) {
    const endpoint = `http://localhost:8000/api/duties/${id}/`;

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


export async function postDuty(data) {
    const endpoint = "http://localhost:8000/api/duties/";

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


export async function updateDuty(id, data) {
    const endpoint = `http://localhost:8000/api/duties/${id}/`;

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

    throw new Error(`${response.statusText}`)
}


export async function getDuty(id) {
    const endpoint = `http://localhost:8000/api/duties/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "GET",
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${await response.text()}`);
}