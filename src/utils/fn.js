//Register

import client from "./api";

const baseUrl = "https://homefinder-backend-hxp6.onrender.com"
// const baseUrl = "http://localhost:8080"

export async function signUp(data) {
    try {
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
        const responseData = await res.json()
        return responseData
    } catch (error) {
        console.log(error)
    }
}

export async function signIn(data) {
    try {
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

        const responseData = await res.json()
        return responseData
    } catch (error) {
        console.log(error)
    }
}

export async function getProfile(token) {
    try {
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

        const responseData = await res.json()

        return responseData

    } catch (error) {
        console.log(error)
    }
}

export async function register(data) {
    try {
        const res = await client.post("/auth/register", data)
        if (!res.ok) {throw new Error()}
        const response = await res.json()
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

export async function createListing(data, token) {
    try {
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

        const responseData = await res.json()

        return responseData

    } catch (error) {
        console.log(error)
    }
}