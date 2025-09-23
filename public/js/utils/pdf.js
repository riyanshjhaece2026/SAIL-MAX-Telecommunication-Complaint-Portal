import { formatTimestamp } from './format.js';

export function downloadComplaintsPdf(list) {
  if (!Array.isArray(list) || !list.length) {
    alert('No complaints to download.');
    return;
  }
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF || typeof (new jsPDF()).autoTable !== 'function') {
    alert('AutoTable plugin is missing.');
    return;
  }
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.text("Report Generated on " + new Date().toLocaleString(), 14, 16);

  // Updated headers and row order
  const headers = [
    "Complaint ID",         // 1
    "Registered On",        // 2
    "Department",           // 3
    "Location",             // 4
    "Contact Number",       // 5
    "Max Number",           // 6
    "Issue Type",           // 7
    "Status",               // 8
    "Progress Details",     // 9
    "Last Updated"          // 10
  ];
  const rows = list.map(c => [
    c.id,                           // Complaint ID
    formatTimestamp(c.createdAt),   // Registered On
    c.department,                   // Department
    c.location,                     // Location
    c.contactNumber,                // Contact Number
    c.maxNumber,                    // Max Number
    c.issueType,                    // Issue Type
    c.status,                       // Status
    c.progressText || "",           // Progress Details
    formatTimestamp(c.updatedAt)    // Last Updated
  ]);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 22,
    styles: { fontSize: 9, cellWidth: 'wrap' },
    headStyles: { fillColor: [0, 119, 204] },
    margin: { left: 8, right: 8 },
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 28 }, // Complaint ID
      1: { cellWidth: 34 }, // Registered On
      2: { cellWidth: 32 }, // Department
      3: { cellWidth: 36 }, // Location
      4: { cellWidth: 30 }, // Contact
      5: { cellWidth: 22 }, // Max Number
      6: { cellWidth: 32 }, // Issue Type
      7: { cellWidth: 26 }, // Status
      8: { cellWidth: 48 }, // Progress
      9: { cellWidth: 38 }  // Last Updated
    }
  });

  // Generate unique filename with date and time
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const filename = `Complaints_Report_${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.pdf`;

  doc.save(filename);
}