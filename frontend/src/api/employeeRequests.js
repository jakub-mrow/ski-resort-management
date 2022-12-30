export async function getEmployees(){
    const endpoint = "http://localhost:8000/api/employees/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error('Response ${response.status}: ${response.statusText} - ${await response.text()}');
}


export async function postEmployee(data) {
    const endpoint = "http://localhost:8000/api/employees/";

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

export async function deleteEmployee(id) {
    const endpoint = `http://localhost:8000/api/employees/${id}/`;

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