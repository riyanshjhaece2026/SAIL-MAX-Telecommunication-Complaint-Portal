import { loadRegisterComplaint } from './register.js';
import { loadCheckStatus } from './status.js';
import { loadAdminLogin } from './admin.js';

export function loadHomePage() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Welcome to Max Complaint Portal</h2>
    <div class="home-actions">
      <button id="homeRegisterBtn" class="btn-home">&#128221; Register Complaint</button>
      <button id="homeCheckStatusBtn" class="btn-home">&#128269; Check Status</button>
    </div>
  `;

  document.getElementById("homeRegisterBtn").onclick = loadRegisterComplaint;
  document.getElementById("homeCheckStatusBtn").onclick = loadCheckStatus;
}