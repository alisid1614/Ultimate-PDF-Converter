// Check authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    setupAuthForms();
    setupLogout();
});

// Check if user is logged in
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameDisplay = document.getElementById('username');
    
    if (logoutBtn && usernameDisplay) {
        if (user) {
            usernameDisplay.textContent = user.name || user.email.split('@')[0];
        } else {
            // Redirect to login if not authenticated and not on login page
            if (!window.location.pathname.includes('login.html') && 
                !window.location.pathname.includes('index.html')) {
                window.location.href = 'login.html';
            }
        }
    }
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                // Simulate login
                const user = {
                    name: email.split('@')[0],
                    email: email
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to tools page
                window.location.href = 'tools.html';
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (name && email && password) {
                // Simulate signup
                const user = {
                    name: name,
                    email: email
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to tools page
                window.location.href = 'tools.html';
            }
        });
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}
