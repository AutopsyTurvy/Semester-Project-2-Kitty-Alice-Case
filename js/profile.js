


// Profile.js


function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('Profile'));

    if (profile) {
        
        document.getElementById('profile-name').textContent = profile.name || 'N/A';
        document.getElementById('profile-email').textContent = profile.email || 'N/A';

       
        const avatar = profile.avatar?.url || localStorage.getItem('Avatar');
        if (avatar) {
            document.getElementById('profile-avatar').src = avatar;
        } else {
            document.getElementById('profile-avatar').src = ''; 
        }

       
        const banner = profile.banner?.url || localStorage.getItem('Banner');
        const bannerContainer = document.getElementById('profile-banner-container');
        
        if (banner) {
            document.getElementById('bannerImage').src = banner;  
            bannerContainer.style.display = 'block'; 
        } else {
            document.getElementById('bannerImage').src = '/images/stacked-boxes.jpg';  
            bannerContainer.style.display = 'block'; 
        }

        
        if (profile.credits !== undefined) {
            document.getElementById('profile-credits').textContent = profile.credits;
        } else {
            document.getElementById('profile-credits').textContent = "0";  
        }

    } else {
        alert("No user profile found! Please log in.");
        window.location.href = '/index.html';  
    }
}


document.addEventListener("DOMContentLoaded", loadProfile);
