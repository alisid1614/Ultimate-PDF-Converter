document.addEventListener('DOMContentLoaded', function() {
    // File upload functionality
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const fileMsg = document.querySelector('.file-msg');
    const uploadStatus = document.getElementById('uploadStatus');
    const proceedBtn = document.getElementById('proceedBtn');
    
    let uploadedFiles = [];
    
    if (dropArea && fileInput) {
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
                proceedBtn.disabled = false;
                
                // Store files for the next page (simplified approach)
                sessionStorage.setItem('uploadedFiles', JSON.stringify({
                    count: uploadedFiles.length,
                    names: uploadedFiles.map(f => f.name)
                }));
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
    }
    
    // Cancel button functionality
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = 'tools.html';
        });
    }
});
