import { api } from '../api.js';
import { addGoBackButton } from '../utils/dom.js';
import { formatTimestamp } from '../utils/format.js';

export function loadCheckStatus() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Check Complaint Status</h2>
    <form id="statusForm">
      <label for="searchQuery">Search:</label>
      <input type="text" id="searchQuery" name="searchQuery" placeholder="Enter Complaint ID, Max Number, or Contact Number" />
      <button type="submit" class="submit-btn">&#128269; Check Status</button>
    </form>
    <div id="statusResult" style="margin-top:20px;"></div>
  `;

  addGoBackButton();

  const form = document.getElementById("statusForm");
  const statusResult = document.getElementById("statusResult");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById("searchQuery").value.trim().toLowerCase();

    if (!searchQuery) {
      statusResult.style.color = "red";
      statusResult.textContent = "Please enter a search term.";
      return;
    }

    try {
      const all = await api.getAllComplaints();
      const complaints = all.filter(c =>
        (c.id && c.id.toString().toLowerCase() === searchQuery) ||
        (c.maxNumber && c.maxNumber.trim().toLowerCase() === searchQuery) ||
        (c.contactNumber && c.contactNumber.trim().toLowerCase() === searchQuery)
      );

      if (!complaints.length) {
        statusResult.style.color = "red";
        statusResult.textContent = "Complaint not found. Please check your details.";
        return;
      }

      statusResult.style.color = "black";
      statusResult.innerHTML = complaints.map(c => `
        <div style="margin-bottom:20px;">
          <p><strong>Complaint ID:</strong> ${c.id}</p>
          <p><strong># Max Number:</strong> ${c.maxNumber}</p>
          <p><strong>&#127970; Department:</strong> ${c.department}</p>
          <p><strong>&#128220; Issue Type:</strong> ${c.issueType}</p>
          <p><strong>&#128205; Location:</strong> ${c.location}</p>
          <p><strong>&#128222; Contact Number:</strong> ${c.contactNumber}</p>
          <p><strong>Status:</strong> ${!c.status || !c.status.trim() ? "In Progress" : c.status}</p>
          <p><strong>Progress:</strong> ${c.progressText || ""}</p>
          <p><strong>Last Updated:</strong> ${formatTimestamp(c.updatedAt)}</p>
        </div>
      `).join('');
    } catch (err) {
      statusResult.style.color = "red";
      statusResult.textContent = "Complaint not found. Please check your details.";
    }
  };
}