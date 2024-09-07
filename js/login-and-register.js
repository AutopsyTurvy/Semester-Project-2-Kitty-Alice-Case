




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


export async function getApiKey(){
    const response = await fetch(API_BASE + API_AUTH + API_KEY_URL, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${load("Token")}`,
           },
        body: JSON.stringify({}),
           name: "test key",
        });
}


export async function register(name, email, password) {
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

    const name = form.elements['registerName']?.value || "";
    const email = form.elements['loginEmail']?.value || form.elements['registerEmail']?.value;
    const password = form.elements['loginPassword']?.value || form.elements['registerPassword']?.value;

   
    if (event.submitter.textContent.trim() === "Log In") {
        await login(email, password);
    } else {
        await register(name, email, password);
        await login(email, password); 
    }
}


export function setAuthListeners() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", onAuth);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", onAuth);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    setAuthListeners();
});


getApiKey().then(console.log)