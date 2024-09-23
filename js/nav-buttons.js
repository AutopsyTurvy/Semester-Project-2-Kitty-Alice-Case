






document.addEventListener('DOMContentLoaded', function() {





     // index.html buttons
  

     const loginButton = document.getElementById('loginButton');
     if (loginButton) {
         loginButton.addEventListener('click', function() {
             window.location.href = '/pages/login.html';  
         });
     }
 
     const registerButton = document.getElementById('registerButton');
     if (registerButton) {
         registerButton.addEventListener('click', function() {
             window.location.href = '/pages/sign-up.html';  
         });
     }


// Buttons in the user's nav bar:


    const homeButton = document.getElementById('linkToHomeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = '/pages/home.html'; 
        });
    }

    const profileButton = document.getElementById('linkToProfileButton');
    if (profileButton) {
        profileButton.addEventListener('click', function() {
            window.location.href = '/pages/profile.html'; 
        });
    }

    const allProfilesButton = document.getElementById('linkToAllProfilesButton');
    if (allProfilesButton) {
        allProfilesButton.addEventListener('click', function() {
            window.location.href = '/pages/all-profiles.html'; 
        });
    }
});


// Go home button on unregistered user listing details page:

const goHomeButton = document.getElementById('go-back-home');
if (goHomeButton) {
    goHomeButton.addEventListener('click', function() {
        window.location.href = '/index.html'; 
    });
}
