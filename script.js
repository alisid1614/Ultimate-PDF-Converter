document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    setTimeout(function() {
        document.querySelector('.loader-wrapper').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader-wrapper').style.display = 'none';
        }, 500);
    }, 1000);

    // Tool buttons event listeners
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.closest('.tool-card').getAttribute('data-tool');
            openToolModal(tool);
        });
    });

    // File drop area functionality
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

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
            updateFileMessage(files);
        }
    }

    function updateFileMessage(files) {
        const fileMsg = dropArea.querySelector('.file-msg');
        if (files.length === 1) {
            fileMsg.textContent = files[0].name;
        } else {
            fileMsg.textContent = `${files.length} files selected`;
        }
    }

    // Advanced options toggle
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedOptions = document.getElementById('advancedOptions');

    advancedToggle.addEventListener('change', function() {
        if (this.checked) {
            advancedOptions.style.display = 'block';
        } else {
            advancedOptions.style.display = 'none';
        }
    });

    // Password protection toggle
    const enablePassword = document.getElementById('enablePassword');
    const passwordFields = document.querySelector('.password-fields');

    enablePassword.addEventListener('change', function() {
        if (this.checked) {
            passwordFields.style.display = 'flex';
        } else {
            passwordFields.style.display = 'none';
        }
    });

    // Convert button functionality
    const convertBtn = document.getElementById('convertBtn');
    const resultsArea = document.getElementById('resultsArea');
    const resultsList = document.getElementById('resultsList');
    const resultsPlaceholder = document.querySelector('.results-placeholder');

    convertBtn.addEventListener('click', function() {
        // Simulate conversion process
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        
        setTimeout(() => {
            // Simulate successful conversion
            this.innerHTML = '<i class="fas fa-check"></i> Conversion Complete';
            this.style.backgroundColor = 'var(--success-color)';
            
            // Show results
            resultsPlaceholder.style.display = 'none';
            resultsList.style.display = 'flex';
            
            // Add sample result (in a real app, this would be dynamic)
            resultsList.innerHTML = `
                <div class="result-item">
                    <div class="result-info">
                        <div class="result-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div>
                            <div class="result-name">converted_file.pdf</div>
                            <div class="result-size">1.2 MB</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="download-btn">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="save-btn">
                            <i class="fas fa-save"></i> Save to
                        </button>
                        <button class="share-btn">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            `;
            
            // Scroll to results
            resultsArea.scrollIntoView({ behavior: 'smooth' });
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Convert Now';
                this.style.backgroundColor = 'var(--primary-color)';
                this.disabled = false;
            }, 3000);
        }, 2000);
    });

    // Clear button functionality
    const clearBtn = document.getElementById('clearBtn');
    
    clearBtn.addEventListener('click', function() {
        fileInput.value = '';
        dropArea.querySelector('.file-msg').textContent = 'Drag & drop files here or click to browse';
        resultsList.innerHTML = '';
        resultsList.style.display = 'none';
        resultsPlaceholder.style.display = 'block';
        advancedOptions.style.display = 'none';
        advancedToggle.checked = false;
        enablePassword.checked = false;
        passwordFields.style.display = 'none';
    });

    // Modal functionality
    function openToolModal(tool) {
        let modalId = '';
        switch(tool) {
            case 'text':
                modalId = 'textToPdfModal';
                break;
            // Add cases for other tools here
            default:
                return;
        }
        
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        
        // Close modal when clicking on X
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Text formatting buttons in Text to PDF modal
    const boldBtn = document.getElementById('boldText');
    const italicBtn = document.getElementById('italicText');
    const underlineBtn = document.getElementById('underlineText');
    const textInput = document.getElementById('textInput');
    
    boldBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        wrapSelectedText('<strong>', '</strong>');
    });
    
    italicBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        wrapSelectedText('<em>', '</em>');
    });
    
    underlineBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        wrapSelectedText('<u>', '</u>');
    });
    
    function wrapSelectedText(prefix, suffix) {
        const start = textInput.selectionStart;
        const end = textInput.selectionEnd;
        const selectedText = textInput.value.substring(start, end);
        const beforeText = textInput.value.substring(0, start);
        const afterText = textInput.value.substring(end);
        
        textInput.value = beforeText + prefix + selectedText + suffix + afterText;
        
        // Restore cursor position
        textInput.selectionStart = start + prefix.length;
        textInput.selectionEnd = end + prefix.length;
        textInput.focus();
    }

    // Convert Text to PDF button
    const convertTextBtn = document.getElementById('convertTextBtn');
    
    convertTextBtn.addEventListener('click', function() {
        if (!textInput.value.trim()) {
            alert('Please enter some text to convert');
            return;
        }
        
        // Simulate conversion
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        this.disabled = true;
        
        setTimeout(() => {
            // In a real app, this would generate a PDF
            alert('PDF generated successfully! (This is a simulation)');
            this.innerHTML = 'Convert to PDF';
            this.disabled = false;
            document.getElementById('textToPdfModal').style.display = 'none';
        }, 1500);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.tool-card, .feature-card, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.tool-card, .feature-card');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        animateOnScroll();
    });
    
    window.addEventListener('scroll', animateOnScroll);
});
