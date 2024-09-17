



// This file should handle the diaplay of credits elsewhere on the sits, such as the nav bar and the profile (the latter is yet to do.)


// credit-count.js


import { load } from './login-and-register.js';  


export function updateNavCredits() {
    const profile = load('Profile');
    const credits = profile ? profile.credits : 0;

  
    const creditsDisplayElement = document.getElementById('creditsDisplay');
    if (creditsDisplayElement) {
        creditsDisplayElement.textContent = credits;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    updateNavCredits();
});
