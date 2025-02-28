// Function to render content based on the URL
function renderContent(url) {
    
    if (url === '/') {  // HOME
        fetch('home.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading the content:', error);
            });
    
    } else if (url === '/about') {//ABOUT ME
        fetch('about.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading the content:', error);
            });
    
    } else if (url === '/software') {//WARES
        fetch('software.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading the content:', error);
            });
    } else {
        document.getElementById('content').innerHTML = '404 - Page Not Found';
    }
}

        function renderTitle(url) {
    if (url === '/') {
        document.title = 'Home';
    } else if (url === '/about') {
        document.title = 'About';
    } else if (url === '/software') {
        document.title = 'Projects';
    } else {
        document.title = '404 - Page Not Found';
    }
}

// Update content when the URL changes
window.onpopstate = function(event) {
    renderContent(window.location.pathname);
    renderTitle(window.location.pathname);
};

// Change the URL and render content
function navigateTo(url) {
    history.pushState({}, '', url);
    renderContent(url);
    renderTitle(url);
}

document.addEventListener('click', function(event) {
    if (event.target.closest('#homeLink')) {
        event.preventDefault(); // Prevent default link behavior
        navigateTo('/');
    } else if (event.target.closest('#aboutLink')) {
        event.preventDefault();
        navigateTo('/about');
    } else if (event.target.closest('#softwareLink')) {
        event.preventDefault();
        navigateTo('/software');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let path = window.location.pathname;
    
    // Default to home if no valid route
    if (path !== '/about' && path !== '/software') {
        path = '/'; 
        history.replaceState({}, '', path); // Ensures URL updates properly
    }

    renderContent(path);
    renderTitle(path);
});