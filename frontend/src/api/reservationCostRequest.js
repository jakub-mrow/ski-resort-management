export async function getReservationCost(id) {
    const endpoint = `http://localhost:8000/api/reservation_cost/?reservation_id=${id}`;

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