// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuración de tu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOXdMYgBNqJbjDYR0bJsDNMUFdUNKQy0g",
  authDomain: "muro-d311c.firebaseapp.com",
  databaseURL: "https://muro-d311c-default-rtdb.firebaseio.com",
  projectId: "muro-d311c",
  storageBucket: "muro-d311c.firebasestorage.app",
  messagingSenderId: "903674843279",
  appId: "1:903674843279:web:50456702788b2a08f7a0fa",
  measurementId: "G-LLZ3FZBMWW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const reportsRef = ref(db, 'reports');

// Elementos del DOM
const newReportBtn = document.getElementById('newReportBtn');
const reportFormContainer = document.getElementById('reportFormContainer');
const reportInput = document.getElementById('reportInput');
const reportFile = document.getElementById('reportFile');
const saveReportBtn = document.getElementById('saveReportBtn');
const reportsDiv = document.getElementById('reports');

newReportBtn.addEventListener('click', () => {
  reportFormContainer.classList.toggle('hidden');
});

saveReportBtn.addEventListener('click', () => {
  let content = reportInput.value;

  if (reportFile.files.length > 0) {
    const file = reportFile.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      content += `\n\n[Archivo adjunto: ${file.name}]\n${reader.result}`;
      saveReport(content);
    };
    reader.readAsText(file);
  } else {
    saveReport(content);
  }

  reportInput.value = '';
  reportFile.value = '';
  reportFormContainer.classList.add('hidden');
});

// Guardar en Firebase
function saveReport(content) {
  const timestamp = new Date().toLocaleString();
  push(reportsRef, { content, timestamp });
}

// Leer datos en tiempo real
onValue(reportsRef, (snapshot) => {
  const data = snapshot.val();
  reportsDiv.innerHTML = '';

  if (data) {
    Object.values(data).forEach(report => {
      const card = document.createElement('div');
      card.classList.add('reportCard');
      card.innerHTML = `
        <div class="reportContent"><strong>${report.timestamp}</strong><br>${report.content}</div>
        <button class="exportBtn">Exportar PDF</button>
      `;
      const exportBtn = card.querySelector('.exportBtn');
      exportBtn.addEventListener('click', () => exportPDF(report));
      reportsDiv.appendChild(card);
    });
  }
});

// Exportar a PDF
function exportPDF(report) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`Informe - ${report.timestamp}\n\n${report.content}`, 10, 10);
  doc.save(`Informe-${report.timestamp}.pdf`);
}