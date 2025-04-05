// ===== DOM Elements =====
const modal = document.getElementById('modal');
const loadingScreen = document.getElementById('loading-screen');
const resultModal = document.getElementById('result-modal');
const downloadPdfBtn = document.getElementById('download-pdf');

// ===== Modal Functions =====
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// ===== File Conversion =====
async function convertToPDF(file, format) {
  showLoading();
  
  // Simulate API call delay
  setTimeout(() => {
    hideLoading();
    showResult();
    
    // For demo purposes, we'll create a dummy download link
    downloadPdfBtn.onclick = () => {
      alert("In a real app, this would download the PDF");
      // Uncomment for actual PDF generation:
      // generatePDF(file);
    };
  }, 2000);
}

// ===== PDF Generation (Client-side) =====
function generatePDF(content) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add text (for text-to-PDF)
  if (typeof content === 'string') {
    doc.text(content, 10, 10);
  } 
  // Add image (for image-to-PDF)
  else if (content instanceof File) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgData = e.target.result;
      doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);
      doc.save('converted.pdf');
    };
    reader.readAsDataURL(content);
  }
  
  doc.save('converted.pdf');
}

// ===== UI Helpers =====
function showLoading() {
  loadingScreen.style.display = 'flex';
}

function hideLoading() {
  loadingScreen.style.display = 'none';
}

function showResult() {
  resultModal.style.display = 'flex';
}

// ===== Event Listeners =====
document.querySelectorAll('.file-input').forEach(input => {
  input.addEventListener('change', function(e) {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      const uploadBox = this.closest('.file-upload');
      uploadBox.querySelector('p').textContent = fileName;
      uploadBox.style.borderColor = var(--primary);
    }
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal();
  }
});

// ===== Initialize jsPDF =====
// Load jsPDF from CDN dynamically
function loadJSPDF() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', async () => {
  await loadJSPDF();
  console.log("PDF converter ready!");
});