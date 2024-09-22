






document.addEventListener("DOMContentLoaded", function() {
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const navMenu = document.getElementById('nav-dropdown-menu');

    
    hamburgerIcon.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

   
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1000) {
            
            navMenu.classList.remove('active');
        }
    });
});
