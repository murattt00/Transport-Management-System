document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-report-btn');
    const reportOutput = document.getElementById('report-output');

    generateBtn.addEventListener('click', generateReport);

    function generateReport() {
       
        const shipments = JSON.parse(localStorage.getItem('shipments')) || [];
        const financialRecords = JSON.parse(localStorage.getItem('financialRecords')) || [];
        const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];

        
        const totalRevenue = financialRecords.reduce((sum, record) => sum + (record.revenue || 0), 0);
        const totalCosts = financialRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
        const netIncome = totalRevenue - totalCosts;
        const tax = netIncome > 0 ? netIncome * 0.20 : 0;
        const profitAfterTax = netIncome - tax;

        
        const weightByCategory = {};
        shipments.forEach(shipment => {
           
            if (shipment.status === 'In Transit' || shipment.status === 'Delivered') {
                const category = shipment.productCategory;
                const weight = parseInt(shipment.productWeight) || 0;
                if (!weightByCategory[category]) {
                    weightByCategory[category] = 0;
                }
                weightByCategory[category] += weight;
            }
        });

        
        let reportHTML = `
            <hr>
            <h3>Financial Summary</h3>
            <ul>
                <li>Total Revenue: <strong>₺${totalRevenue.toFixed(2)}</strong></li>
                <li>Total Costs: <strong>₺${totalCosts.toFixed(2)}</strong></li>
                <li>Net Income: <strong style="color:${netIncome >= 0 ? 'green' : 'red'};">₺${netIncome.toFixed(2)}</strong></li>
                <li>Tax (20%): <strong>₺${tax.toFixed(2)}</strong></li>
                <li>Profit After Tax: <strong style="color:${profitAfterTax >= 0 ? 'green' : 'red'};">₺${profitAfterTax.toFixed(2)}</strong></li>
            </ul>

            <h3>Current Inventory Status</h3>
            <ul>
                ${inventoryData.map(item => `<li>${item.name}: <strong>${item.weight} kg</strong></li>`).join('')}
            </ul>

            <h3>Total Weight Shipped by Category</h3>
            <ul>
                ${Object.keys(weightByCategory).map(category => `<li>${category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: <strong>${weightByCategory[category]} kg</strong></li>`).join('')}
            </ul>

            <h3>All Shipments List</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Destination</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${shipments.map(s => `
                        <tr>
                            <td>${s.id}</td>
                            <td>${s.destination}</td>
                            <td>${s.totalPrice}</td>
                            <td>${s.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        
        reportOutput.innerHTML = reportHTML;
        alert('Report has been generated successfully!');
    }
});