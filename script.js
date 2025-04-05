// ===== Global Variables =====
let selectedFile = null;

// ===== Modal Functions =====
function openModal(modalType) {
    closeModal();
    document.getElementById(`${modalType}-modal`).style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ===== File Upload Handling =====
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            selectedFile = this.files[0];
            const uploadBox = this.closest('.file-upload');
            uploadBox.querySelector('p').textContent = selectedFile.name;
            uploadBox.style.borderColor = '#6c5ce7';
        }
    });
});

// ===== PDF Conversion Functions =====
function convertTextToPdf() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value || (selectedFile ? readFileAsText(selectedFile) : null);
    
    if (!text) {
        alert("Please enter text or upload a file!");
        return;
    }

    generatePDF(text);
}

function convertImageToPdf() {
    if (!selectedFile) {
        alert("Please upload an image first!");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        generatePDF(null, e.target.result);
    };
    reader.readAsDataURL(selectedFile);
}

// ===== Core PDF Generation =====
function generatePDF(text = null, imageData = null) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Text PDF
    if (text) {
        doc.text(text, 10, 10);
    } 
    // Image PDF
    else if (imageData) {
        doc.addImage(imageData, 'JPEG', 15, 15, 180, 160);
    }
    
    doc.save(`converted-${Date.now()}.pdf`);
    closeModal();
}

// ===== Helper Functions =====
function readFileAsText(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
    });
}

// ===== Event Listeners =====
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) closeModal();
});

// Initialize jsPDF
window.addEventListener('DOMContentLoaded', () => {
    console.log("PDF Converter Ready!");
});
