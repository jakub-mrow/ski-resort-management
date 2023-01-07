export async function getRooms(){
    const endpoint = "http://localhost:8000/api/rooms/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error('Response ${response.status}: ${response.statusText} - ${await response.text()}');
}


export async function postRoom(data) {
    const endpoint = "http://localhost:8000/api/rooms/";

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

    const failResponse = await response.json();
    if (failResponse.hasOwnProperty("msg")){
        throw new Error(`${failResponse.msg}`)
    } else {
        throw new Error("Internal server error. Redo an operation")
    }
}

export async function deleteRoom(id) {
    const endpoint = `http://localhost:8000/api/rooms/${id}/`;

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

export async function updateRoom(id, data) {
    const endpoint = `http://localhost:8000/api/rooms/${id}/`;

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

export async function getRoom(id) {
    const endpoint = `http://localhost:8000/api/rooms/${id}/`;

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

    // throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
    throw new Error(`${response.statusText}`)
}


export async function getRoomUnavailabilty(room_id){
    const endpoint = `http://localhost:8000/api/rooms/unavailabilty/?room_id=${room_id}`;

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