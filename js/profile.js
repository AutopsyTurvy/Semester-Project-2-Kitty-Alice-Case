


// Profile.js


function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('Profile'));

    if (profile) {
        document.getElementById('profile-name').textContent = profile.name || 'N/A';
        document.getElementById('profile-email').textContent = profile.email || 'N/A';

        const avatar = profile.avatar || localStorage.getItem('Avatar');
        const banner = profile.banner || localStorage.getItem('Banner');

        if (avatar) {
            document.getElementById('profile-avatar').src = avatar;
        }

        if (banner) {
            document.getElementById('profile-banner').src = banner;
        }
    } else {
        alert("No user profile found! Please log in.");
        window.location.href = '/index.html';  
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);


