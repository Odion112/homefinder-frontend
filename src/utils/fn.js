import client from "./api";

const baseUrl = "https://homefinder-backend-hxp6.onrender.com"
// const baseUrl = "http://localhost:8080"

export async function signUp(data) {
    const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);
        throw error;
    }
    return await res.json()
}

export async function signIn(data) {
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);
        throw error;
    }
    return await res.json()
}

export async function getProfile(token) {
    const res = await fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);
        throw error;
    }
    return await res.json()
}

export async function createListing(data, token) {
    const res = await fetch(`${baseUrl}/properties`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);
        throw error;
    }
    return await res.json()
}