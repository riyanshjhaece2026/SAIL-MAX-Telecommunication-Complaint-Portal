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
      statusResult.innerHTML = `
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: left;
          }
        </style>
        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Max Number</th>
              <th>Department</th>
              <th>Issue Type</th>
              <th>Location</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            ${complaints.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.maxNumber}</td>
                <td>${c.department}</td>
                <td>${c.issueType}</td>
                <td>${c.location}</td>
                <td>${c.contactNumber}</td>
                <td>${!c.status || !c.status.trim() ? "In Progress" : c.status}</td>
                <td>${c.progressText || ""}</td>
                <td>${formatTimestamp(c.updatedAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      statusResult.style.color = "red";
      statusResult.textContent = "Complaint not found. Please check your details.";
    }
  };
}