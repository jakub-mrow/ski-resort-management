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

    throw new Error(`Response ${response.status}: ${response.statusText} - ${await response.text()}`);
}