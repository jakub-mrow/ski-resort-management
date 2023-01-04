export async function getDesserts(){
    const endpoint = "http://localhost:8000/api/desserts/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error('Response ${response.status}: ${response.statusText} - ${await response.text()}');
}


export async function postDessert(data) {
    const endpoint = "http://localhost:8000/api/desserts/";

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

    throw new Error('Response ${response.status}: ${response.statusText} - ${await response.text()}');
}

export async function deleteDessert(id) {
    const endpoint = `http://localhost:8000/api/desserts/${id}/`;

    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    });

    if (response.ok) {
        return true;
    }

    throw new Error('Response ${response.status}: ${response.statusText} - ${await response.text()}');
}

export async function updateDessert(id, data) {
    const endpoint = `http://localhost:8000/api/desserts/${id}/`;

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

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}

export async function getDessert(id) {
    const endpoint = `http://localhost:8000/api/desserts/${id}/`;

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