function showLoader() {
  document.getElementById("loader").style.display = "block";
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 2000);
}

async function convertTextToPDF() {
  showLoader();
  const text = prompt("Enter text to convert to PDF:");
  if (!text) return;
  const { PDFDocument } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText(text, { x: 50, y: 350, size: 20 });
  const pdfBytes = await pdfDoc.save();
  downloadPDF(pdfBytes, "text-to-pdf.pdf");
}

async function convertImageToPDF() {
  showLoader();
  document.getElementById("fileInput").click();
  document.getElementById("fileInput").onchange = async function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function (e) {
      const imageBytes = new Uint8Array(e.target.result);
      const { PDFDocument } = PDFLib;
      const pdfDoc = await PDFDocument.create();
      let img;
      if (file.type.includes("png")) {
        img = await pdfDoc.embedPng(imageBytes);
      } else {
        img = await pdfDoc.embedJpg(imageBytes);
      }
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes, "image-to-pdf.pdf");
    };
    reader.readAsArrayBuffer(file);
  };
}

function convertWordToPDF() {
  alert("Word to PDF will be added soon.");
}

function convertExcelToPDF() {
  alert("Excel to PDF will be added soon.");
}

function convertPptToPDF() {
  alert("PowerPoint to PDF will be added soon.");
}

function editPDF() {
  alert("Advanced PDF editing is coming soon.");
}

function downloadPDF(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, filename);
}
