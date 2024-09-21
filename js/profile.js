


// Profile.js


import { load, save } from './login-and-register.js'; 

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('Profile'));

    if (profile) {
        document.getElementById('profile-name').textContent = profile.name || 'N/A';
        document.getElementById('profile-email').textContent = profile.email || 'N/A';

      
        const schoolDefaultImageUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";
        const avatar = (!profile.avatar?.url || profile.avatar.url === schoolDefaultImageUrl)
            ? '/images/default-avatar.jpg'
            : profile.avatar.url;

        document.getElementById('profile-avatar').src = avatar;

      
        const apiDefaultBanner = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";
        let banner = profile.banner?.url;
        if (!banner || banner === apiDefaultBanner) {
            banner = '/images/stacked-boxes.jpg';
        }

        document.getElementById('bannerImage').src = banner;
        const bannerContainer = document.getElementById('profile-banner-container');
        bannerContainer.style.display = 'block';

     
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







async function updateProfile(updatedData) {
    const API_BASE = "https://v2.api.noroff.dev";
    const profile = load('Profile');  
    const url = `${API_BASE}/auction/profiles/${profile.name}`;  

    let token = load('Token');
    let apiKey = load('ApiKey');
    token = token.replace(/^"|"$/g, ''); 

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to update profile: ${errorText}`);
        throw new Error(`Failed to update profile: ${errorText}`);
    }

    const updatedProfile = await response.json();

    const newProfileData = { ...profile, ...updatedData }; 
    save('Profile', newProfileData);  

    return newProfileData;
}

document.querySelector('.edit-avatar').addEventListener('click', async () => {
    const avatarElement = document.getElementById('profile-avatar');
    const newAvatarUrl = prompt("Enter a new avatar URL:", avatarElement.src);

    if (newAvatarUrl) {
        try {
            const updatedProfile = await updateProfile({
                avatar: { url: newAvatarUrl }
            });

            if (updatedProfile.avatar?.url) {
                avatarElement.src = updatedProfile.avatar.url;

                const profile = load('Profile');
                profile.avatar.url = newAvatarUrl;
                save('Profile', profile);

                alert('Avatar updated successfully!');
            } else {
                alert('Avatar URL was not returned from the server.');
            }
        } catch (error) {
            console.error('Failed to update the avatar:', error);
            alert('Failed to update the avatar. Please try again.');
        }
    }
});

document.addEventListener("DOMContentLoaded", loadProfile);
