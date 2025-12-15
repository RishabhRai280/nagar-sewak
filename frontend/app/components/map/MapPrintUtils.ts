// Map Print Utilities
export const printMapView = async (mapContainer: HTMLElement, selectedItem?: any) => {
  try {
    // Create a print-friendly version of the map
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    // Get map screenshot using html2canvas if available, otherwise use a placeholder
    let mapImageSrc = '';
    
    try {
      // Dynamically import html2canvas
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(mapContainer, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: 800,
        height: 600,
        backgroundColor: '#f1f5f9'
      });
      mapImageSrc = canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Could not capture map image:', error);
      // Use a placeholder or static map
      mapImageSrc = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#f1f5f9"/>
          <text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="24" fill="#64748b">
            Map View - ${new Date().toLocaleDateString()}
          </text>
          <text x="400" y="330" text-anchor="middle" font-family="Arial" font-size="16" fill="#94a3b8">
            Interactive map content
          </text>
        </svg>
      `);
    }

    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Map View - Nagar Sewak</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
          }
          .map-container {
            text-align: center;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
          }
          .map-image {
            max-width: 100%;
            height: auto;
          }
          .item-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
          }
          .detail-row {
            display: flex;
            margin: 8px 0;
          }
          .detail-label {
            font-weight: bold;
            width: 150px;
            color: #64748b;
          }
          .detail-value {
            flex: 1;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          @media print {
            body { margin: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏛️ NAGAR SEWAK</div>
          <h1>Map View Report</h1>
          <p>Generated on ${currentDate}</p>
        </div>

        <div class="map-container">
          <img src="${mapImageSrc}" alt="Map View" class="map-image" />
        </div>

        ${selectedItem ? `
        <div class="item-details">
          <h2>${selectedItem.title}</h2>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${selectedItem.kind === 'complaint' ? 'Complaint' : 'Project'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${selectedItem.status || 'Unknown'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${selectedItem.lat?.toFixed(6)}, ${selectedItem.lng?.toFixed(6)}</span>
          </div>
          ${selectedItem.kind === 'complaint' && selectedItem.severity ? `
          <div class="detail-row">
            <span class="detail-label">Severity:</span>
            <span class="detail-value">${selectedItem.severity}/5</span>
          </div>
          ` : ''}
          ${selectedItem.kind === 'project' && selectedItem.budget ? `
          <div class="detail-row">
            <span class="detail-label">Budget:</span>
            <span class="detail-value">₹${selectedItem.budget.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${selectedItem.description || 'No description available'}</span>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Nagar Sewak Civic Management Platform</p>
          <p>This document contains a snapshot of the interactive map view.</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 1000);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  } catch (error) {
    console.error('Print failed:', error);
    alert('Print functionality failed. Please try again.');
  }
};

export const exportMapAsImage = async (mapContainer: HTMLElement): Promise<string | null> => {
  try {
    // Dynamically import html2canvas
    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(mapContainer, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      width: 1200,
      height: 800,
      backgroundColor: '#f1f5f9'
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Map export failed:', error);
    return null;
  }
};