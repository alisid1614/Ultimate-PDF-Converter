document.addEventListener('DOMContentLoaded', function() {
    // User state management
    let currentUser = null;
    const userProfile = document.getElementById('userProfile');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    const headerSignupBtn = document.getElementById('headerSignupBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if user is logged in (in a real app, this would check localStorage or a session)
    function checkAuthState() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            currentUser = user;
            updateAuthUI();
        }
    }

    // Update UI based on auth state
    function updateAuthUI() {
        if (currentUser) {
            headerLoginBtn.style.display = 'none';
            headerSignupBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            usernameDisplay.textContent = currentUser.name;
        } else {
            headerLoginBtn.style.display = 'inline-block';
            headerSignupBtn.style.display = 'inline-block';
            userProfile.style.display = 'none';
        }
    }

    // Login functionality
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    
    headerLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // In a real app, this would be an API call
        if (email && password) {
            // Simulate successful login
            currentUser = {
                name: email.split('@')[0],
                email: email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            loginModal.style.display = 'none';
            loginForm.reset();
            showToast('Login successful!');
        } else {
            showToast('Please enter email and password', 'error');
        }
    });

    // Signup functionality
    const signupModal = document.getElementById('signupModal');
    const signupForm = document.getElementById('signupForm');
    
    headerSignupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (name && email && password) {
            // Simulate successful signup
            currentUser = {
                name: name,
                email: email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            signupModal.style.display = 'none';
            signupForm.reset();
            showToast('Account created successfully!');
        } else {
            showToast('Please fill all fields', 'error');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        showToast('Logged out successfully');
    });

    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // File upload functionality
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const fileMsg = dropArea.querySelector('.file-msg');
    const uploadStatus = document.createElement('div');
    uploadStatus.className = 'upload-status';
    dropArea.appendChild(uploadStatus);

    let uploadedFiles = [];

    dropArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFiles);

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length) {
            uploadedFiles = Array.from(files);
            updateFileMessage(uploadedFiles);
            showUploadSuccess(`${uploadedFiles.length} file(s) ready for conversion`);
        }
    }

    function updateFileMessage(files) {
        if (files.length === 1) {
            fileMsg.textContent = files[0].name;
        } else {
            fileMsg.textContent = `${files.length} files selected`;
        }
    }

    function showUploadSuccess(message) {
        uploadStatus.textContent = message;
        uploadStatus.className = 'upload-status success';
    }

    function showUploadError(message) {
        uploadStatus.textContent = message;
        uploadStatus.className = 'upload-status error';
    }

    // PDF Conversion Functionality
    const convertBtn = document.getElementById('convertBtn');
    const resultsList = document.getElementById('resultsList');
    const resultsPlaceholder = document.querySelector('.results-placeholder');

    convertBtn.addEventListener('click', async function() {
        if (uploadedFiles.length === 0) {
            showToast('Please upload files first', 'error');
            return;
        }

        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        
        try {
            // Simulate conversion delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Process each file
            const conversionResults = [];
            
            for (const file of uploadedFiles) {
                const result = await convertFileToPDF(file);
                conversionResults.push(result);
            }
            
            // Display results
            displayConversionResults(conversionResults);
            
            this.innerHTML = '<i class="fas fa-check"></i> Conversion Complete';
            this.style.backgroundColor = 'var(--success-color)';
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Convert Now';
                this.style.backgroundColor = 'var(--primary-color)';
                this.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Conversion error:', error);
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Convert Now';
            this.style.backgroundColor = 'var(--primary-color)';
            this.disabled = false;
            showToast('Conversion failed. Please try again.', 'error');
        }
    });

    async function convertFileToPDF(file) {
        // In a real app, this would use a PDF library to actually convert the file
        // Here we simulate the conversion and return a mock result
        
        return {
            originalName: file.name,
            convertedName: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
            size: Math.max(file.size / 1024 / 1024, 0.1).toFixed(1) + ' MB',
            blob: new Blob(['Simulated PDF content'], { type: 'application/pdf' })
        };
    }

    function displayConversionResults(results) {
        resultsPlaceholder.style.display = 'none';
        resultsList.style.display = 'flex';
        resultsList.innerHTML = '';
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-info">
                    <div class="result-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div>
                        <div class="result-name">${result.convertedName}</div>
                        <div class="result-size">${result.size}</div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="download-btn" data-filename="${result.convertedName}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <div class="download-options" id="options-${result.convertedName}">
                        <h4>Save options:</h4>
                        <div class="download-option" data-action="download">
                            <i class="fas fa-download"></i> Download PDF
                        </div>
                        ${currentUser ? `
                        <div class="download-option" data-action="drive">
                            <i class="fab fa-google-drive"></i> Save to Google Drive
                        </div>
                        <div class="download-option" data-action="dropbox">
                            <i class="fab fa-dropbox"></i> Save to Dropbox
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
            resultsList.appendChild(resultItem);
        });
        
        // Add event listeners to download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const optionsPanel = document.getElementById(`options-${this.getAttribute('data-filename')}`);
                optionsPanel.style.display = optionsPanel.style.display === 'block' ? 'none' : 'block';
            });
        });
        
        // Add event listeners to download options
        document.querySelectorAll('.download-option').forEach(option => {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const resultItem = this.closest('.result-item');
                const filename = resultItem.querySelector('.download-btn').getAttribute('data-filename');
                const result = results.find(r => r.convertedName === filename);
                
                if (action === 'download') {
                    downloadPDF(result.blob, filename);
                } else {
                    showToast(`Saving to ${action} would happen here in a real app`);
                }
                
                // Hide options panel
                this.closest('.download-options').style.display = 'none';
            });
        });
    }

    function downloadPDF(blob, filename) {
        saveAs(blob, filename);
        showToast('Download started');
    }

    // Initialize the app
    checkAuthState();
    
    // Hide loader when page is loaded
    setTimeout(function() {
        document.querySelector('.loader-wrapper').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader-wrapper').style.display = 'none';
        }, 500);
    }, 1000);

    // Rest of your existing code...
    // (Tool buttons, text formatting, animations, etc.)
});
