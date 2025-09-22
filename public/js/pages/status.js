import { api } from '../api.js';
import { addGoBackButton } from '../utils/dom.js';
import { formatTimestamp } from '../utils/format.js';

export function loadCheckStatus() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Check Complaint Status</h2>
    <form id="statusForm">
      <label for="complaintId">Complaint ID:</label>
      <input type="text" id="complaintId" name="complaintId" placeholder="Enter Complaint ID" />
      <label for="maxNumber">Max Number:</label>
      <input type="text" id="maxNumber" name="maxNumber" placeholder="Enter Max Number" />
      <label for="contactNumber">Mobile Number:</label>
      <input type="text" id="contactNumber" name="contactNumber" placeholder="Enter Mobile Number" />
      <button type="submit" class="submit-btn">Check Status</button>
      <p style="font-size:12px;color:#888;margin-top:4px;">(Enter any one field to check status)</p>
    </form>
    <div id="statusResult" style="margin-top:20px;"></div>
  `;

  addGoBackButton();

  const form = document.getElementById("statusForm");
  const statusResult = document.getElementById("statusResult");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const complaintId = document.getElementById("complaintId").value.trim();
    const maxNumber = document.getElementById("maxNumber").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();

    if (!complaintId && !maxNumber && !contactNumber) {
      statusResult.style.color = "red";
      statusResult.textContent = "Please enter at least one field.";
      return;
    }

    try {
      let complaints = [];
      if (complaintId) {
        const c = await api.getComplaintById(complaintId);
        if (c) complaints = [c];
      } else {
        const all = await api.getAllComplaints();
        console.log(all);
        complaints = all.filter(c =>
          (maxNumber && c.maxNumber && c.maxNumber.trim().toLowerCase() === maxNumber.toLowerCase()) ||
          (contactNumber && c.contactNumber && c.contactNumber.trim().toLowerCase() === contactNumber.toLowerCase())
        );
      }

      if (!complaints.length) {
        statusResult.style.color = "red";
        statusResult.textContent = "Complaint not found. Please check your details.";
        return;
      }

      statusResult.style.color = "black";
      statusResult.innerHTML = complaints.map(c => `
        <div style="margin-bottom:20px;">
          <p><strong>Complaint ID:</strong> ${c.id}</p>
          <p><strong>Max Number:</strong> ${c.maxNumber}</p>
          <p><strong>Department:</strong> ${c.department}</p>
          <p><strong>Issue Type:</strong> ${c.issueType}</p>
          <p><strong>Location:</strong> ${c.location}</p>
          <p><strong>Contact Number:</strong> ${c.contactNumber}</p>
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