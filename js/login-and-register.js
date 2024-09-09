




export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_KEY_URL = "/create-api-key";


export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}


export async function register(name, email, password) {
    console.log("Attempting to register with:", { name, email, password });
    
    const response = await fetch(API_BASE + API_AUTH + API_REGISTER, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
        return await response.json();
    }

    throw new Error("Failed to register account");
}


export async function login(email, password) {
    console.log("Attempting to log in with:", { email, password });
    
    const response = await fetch(API_BASE + API_AUTH + API_LOGIN, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { accessToken, ...profile } = (await response.json()).data;
        save("Token", accessToken);
        save("Profile", profile);
        return profile;
    }

    throw new Error("Failed to login");
}


export async function onAuth(event) {
    event.preventDefault(); 
    
    const form = event.target;
    
    
    const name = form.elements['registerName']?.value;
    const email = form.elements['registerEmail']?.value;
    const password = form.elements['registerPassword']?.value;

    try {
       
        await register(name, email, password);
        
       
        const profile = await login(email, password);

       
        console.log("Registration and login successful, profile:", profile);

        
        window.location.href = "/pages/profile.html"; 
    } catch (error) {
        console.error("Error during registration or login:", error);
        
        document.getElementById("email-error").textContent = error.message;
    }
}


export function setAuthListeners() {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", onAuth); 
    }
}


document.addEventListener("DOMContentLoaded", () => {
    setAuthListeners();
});


export async function getApiKey() {
    try {
        const response = await fetch(API_BASE + API_AUTH + API_KEY_URL, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`, 
            },
            body: JSON.stringify({ name: "test key" }), 
        });

        if (response.ok) {
            const apiKeyData = await response.json();
            save("ApiKey", apiKeyData.data.key); 
            return apiKeyData;
        }

        throw new Error("Failed to fetch API Key");
    } catch (error) {
        console.error("Error fetching API Key:", error);
    }
}


export async function fetchWithApiKey(url) {
    const accessToken = load("Token"); 
    const apiKey = load("ApiKey"); 

    if (!accessToken || !apiKey) {
        throw new Error("Missing Token or API Key");
    }

    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return await response.json();
}
