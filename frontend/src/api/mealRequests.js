export async function getMeals(){
    const endpoint = "http://localhost:8000/api/meals/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function getMealCreateData(){
    const endpoint = "http://localhost:8000/api/meal_data/"

    const response = await fetch(endpoint, { 
        method: "GET"
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    }

    throw new Error(`${response.statusText}`)
}


export async function deleteMeal(id) {
    const endpoint = `http://localhost:8000/api/meals/${id}/`;

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


export async function postMeal(data) {
    const endpoint = "http://localhost:8000/api/meals/";

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


export async function updateMeal(id, data) {
    const endpoint = `http://localhost:8000/api/meals/${id}/`;

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


export async function getMeal(id) {
    const endpoint = `http://localhost:8000/api/meals/${id}/`;

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