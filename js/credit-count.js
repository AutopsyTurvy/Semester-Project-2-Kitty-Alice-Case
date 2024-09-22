



// This file should handle the diaplay of credits elsewhere on the sits, such as the nav bar and the profile (the latter is yet to do.)


// credit-count.js


import { load } from './login-and-register.js';  


export function updateNavCredits() {
    const profile = load('Profile');
    const credits = profile ? profile.credits : 0;

    const creditsDisplayElements = document.querySelectorAll('#creditsDisplay'); 
    creditsDisplayElements.forEach(element => {
        element.textContent = credits;
    });
}



document.addEventListener('DOMContentLoaded', () => {
    updateNavCredits();
});
