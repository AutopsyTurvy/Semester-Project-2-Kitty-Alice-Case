







// dropdown-buttons.js


const homeButton = document.getElementById('dropdownLinkToHomeButton');
if (homeButton) {
    homeButton.addEventListener('click', function() {
        window.location.href = '/pages/home.html';  
    });
}

// Profile Button
const profileButton = document.getElementById('dropdownLinkToProfileButton');
if (profileButton) {
    profileButton.addEventListener('click', function() {
        window.location.href = '/pages/profile.html';  
    });
}

// All Profiles Button
const allProfilesButton = document.getElementById('dropdownLinkToAllProfilesButton');
if (allProfilesButton) {
    allProfilesButton.addEventListener('click', function() {
        window.location.href = '/pages/all-profiles.html';  
    });
}