




// login-and-register.js



import { fetchUserCredits, updateUserCredits } from './credits.js'; 

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

export async function fetchCompleteProfile() {
    const token = load('Token'); 

    if (!token) {
        console.error('No token found.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const profileData = await response.json();
            console.log('Complete Profile Data:', profileData);

            save('Profile', profileData); 
            return profileData;
        } else {
            const error = await response.json();
            console.error('Failed to fetch complete profile:', error);
        }
    } catch (error) {
        console.error('Error fetching complete profile:', error);
    }
}









// Register Function
export async function register(name, email, password, avatarUrl, bannerUrl) {
    console.log("Attempting to register with:", { name, email, password, avatarUrl, bannerUrl });
    
    const response = await fetch(`${API_BASE}${API_AUTH}${API_REGISTER}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password,
            avatar: { url: avatarUrl },  
            banner: { url: bannerUrl }
        }),
    });

    if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Registration successful:", jsonResponse);

       
        const updateResult = await updateUserCredits(jsonResponse.name, 1000); 

        if (updateResult) {
            console.log("Credits successfully added to the API:", updateResult);
        } else {
            console.error("Failed to add credits to the API.");
        }

      
        const storedCredits = await fetchUserCredits(jsonResponse.name); 
        if (storedCredits !== null) {
            console.log(`Credits successfully fetched from API for user ${jsonResponse.name}:`, storedCredits);
        } else {
            console.error(`Failed to fetch credits for user ${jsonResponse.name}.`);
        }

        return jsonResponse;
    }

    const errorText = await response.text();
    console.error("Registration failed with response:", errorText);
    throw new Error("Failed to register account");
}









// Login function
export async function login(email, password) {
    console.log("Attempting to log in with:", { email, password });

    const response = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const responseData = await response.json();
        const { accessToken, name, email, avatar, banner, credits } = responseData.data;

        console.log("Login successful, received profile:", responseData.data);
        
        save("Token", accessToken);

        const completeProfile = await fetchCompleteProfile();
        console.log("Complete profile after login:", completeProfile);

       
        console.log(`Fetching credits for user ${name}...`);  
        const storedCredits = await fetchUserCredits(name);
        if (storedCredits !== null) {
            console.log(`Credits successfully fetched for user ${name}:`, storedCredits);
        } else {
            console.error(`Failed to fetch credits for user ${name}.`);
        }

        const updatedProfile = {
            name,
            email,
            avatar: avatar || 'https://default-avatar-url.com/avatar.jpg',
            banner: banner || '/images/stacked-boxes.jpg',
            credits: storedCredits ?? credits  
        };

        console.log("Updated profile after login:", updatedProfile);

        save("Profile", updatedProfile);

        return updatedProfile;
    }

    const errorText = await response.text();
    console.error("Login failed with response:", errorText);
    throw new Error("Failed to login");
}













// Handles Registration Event
export async function onAuth(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.elements['registerName']?.value;
    const email = form.elements['registerEmail']?.value;
    const password = form.elements['registerPassword']?.value;
    const avatarUrl = form.elements['avatar']?.value;  
    const avatarAlt = form.elements['avatarAlt']?.value;
    const bannerUrl = form.elements['banner']?.value;  
    const bannerAlt = form.elements['bannerAlt']?.value;

    console.log("Form data:", { name, email, avatarUrl, bannerUrl, avatarAlt, bannerAlt });

    try {
        await register(name, email, password, avatarUrl, bannerUrl);
        console.log("User successfully registered.");
        
        const profile = await login(email, password);
        console.log("User logged in, updating profile with avatar, banner, and credits.");

        const updatedProfile = {
            name,
            email,
            avatar: { url: avatarUrl || 'https://default-avatar-url.com/avatar.jpg', alt: avatarAlt || "" },
            banner: { url: bannerUrl || '/images/stacked-boxes.jpg', alt: bannerAlt || "" },
            credits: 1000  
        };

        console.log("Updated profile with initial credits, avatar, and banner:", updatedProfile);

        save("Profile", updatedProfile);  

        if (!load("ApiKey")) {
            console.log("No API key found, attempting to fetch API key...");
            await getApiKey(); 
        } else {
            console.log("API key already exists.");
        }

        console.log("Redirecting to profile page.");
        window.location.href = "/pages/profile.html";
    } catch (error) {
        console.error("Error during registration or login:", error);
        document.getElementById("email-error").textContent = error.message;
    }
}











// Set listeners for registration form
export function setAuthListeners() {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", onAuth);
        console.log("Auth listeners set.");
    } else {
        console.warn("Registration form was not found.");
    }
}












// Set listeners for login form
export async function onLogin(event) {
    event.preventDefault(); 

    const form = event.target;
    const email = form.elements['loginEmail']?.value;
    const password = form.elements['loginPassword']?.value;

    try {
        const profile = await login(email, password);
        console.log("User logged in successfully:", profile);

        if (!load("ApiKey")) {
            console.log("No API key found, attempting to fetch API key...");
            await getApiKey();  
        } else {
            console.log("API key already exists.");
        }

        window.location.href = "/pages/home.html";
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("email-error").textContent = error.message;
    }
}








// Set listeners for login form
export function setLoginListeners() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", onLogin); 
        console.log("Login listeners set.");
    } else {
        console.warn("Login form was not found.");
    }
}








// Log out Function
export function logout() {
    console.log("Logging out...");

    localStorage.removeItem("Token");  
    localStorage.removeItem("ApiKey"); 
    localStorage.removeItem("Profile");  

    window.location.href = "/index.html";
}

export function setLogoutListener() {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            console.log("Logout button clicked");
            logout();
        });
        console.log("Logout listener set.");
    } else {
        console.warn("Logout button was not found, bypassing logout functionality.");
    }
}










// Get the API Key
export async function getApiKey() {
    try {
        console.log("Attempting to fetch API key.");
        const response = await fetch(`${API_BASE}${API_AUTH}${API_KEY_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${load("Token")}`,
            },
            body: JSON.stringify({ name: "test key" }),
        });

        if (response.ok) {
            const apiKeyData = await response.json();
            console.log("API key fetched successfully:", apiKeyData);
            save("ApiKey", apiKeyData.data.key);
            return apiKeyData;
        }

        const errorText = await response.text();
        console.error("Failed to fetch API key:", errorText);
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

    console.log("Fetching data from:", url);
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
        const errorText = await response.text();
        console.error("Failed to fetch data:", errorText);
        throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("Data fetched successfully:", data);
    return data;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("loginForm")) {
        setLoginListeners();
    }

    if (document.getElementById("registerForm")) {
        setAuthListeners();
    }

    setLogoutListener(); 
});

