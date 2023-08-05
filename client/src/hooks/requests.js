const API_URL = 'http://localhost:5000/v1';

// Load planets and return as JSON.

async function httpGetPlanets() {
    const res = await fetch(`${API_URL}/planets`);
    return await res.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
    const res = await fetch(`${API_URL}/launches`);
    const fetchedLaunches = await res.json();
    return fetchedLaunches.sort((a, b) => {
        return a.flightNumber - b.flightNumber;
    });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
    try {
        return await fetch(`${API_URL}/launches`, {
            method: 'post',
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify(launch),
        });
    } catch (e) {
        return {
            ok: false,
        };
    }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
    try {
        return await fetch(`${API_URL}/launches/${id}`, {
            method: 'delete',
        });
    } catch (e) {
        console.log(e);
        return {
            response: false,
        };
    }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
