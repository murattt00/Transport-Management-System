document.addEventListener('DOMContentLoaded', function() {
  
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalCostsEl = document.getElementById('total-costs');
    const netIncomeEl = document.getElementById('net-income');
    const taxEl = document.getElementById('tax');
    const profitAfterTaxEl = document.getElementById('profit-after-tax');
    const recalculateBtn = document.getElementById('recalculate-btn');

    const TAX_RATE = 0.20; 

    function calculateAndDisplayFinancials() {
        const financialRecords = JSON.parse(localStorage.getItem('financialRecords')) || [];

        let totalRevenue = 0;
        let totalCosts = 0;

        financialRecords.forEach(record => {
            totalRevenue += record.revenue || 0;
            totalCosts += record.cost || 0;
        });

        const netIncome = totalRevenue - totalCosts;
        const tax = netIncome > 0 ? netIncome * TAX_RATE : 0;
        const profitAfterTax = netIncome - tax;

        totalRevenueEl.textContent = `₺${totalRevenue.toFixed(2)}`;
        totalCostsEl.textContent = `₺${totalCosts.toFixed(2)}`;
        netIncomeEl.innerHTML = `<strong>₺${netIncome.toFixed(2)}</strong>`;
        taxEl.textContent = `₺${tax.toFixed(2)}`;
        profitAfterTaxEl.innerHTML = `<strong>₺${profitAfterTax.toFixed(2)}</strong>`;

        netIncomeEl.style.color = netIncome >= 0 ? 'green' : 'red';
        profitAfterTaxEl.style.color = profitAfterTax >= 0 ? 'green' : 'red';
    }

    recalculateBtn.addEventListener('click', () => {
        calculateAndDisplayFinancials();
        alert('Financial summary has been recalculated.');
    });

    // Sayfa ilk yüklendiğinde hesaplamayı çalıştır
    calculateAndDisplayFinancials();
});