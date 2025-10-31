const shipmentsData = JSON.parse(localStorage.getItem('shipments')) || [];
const shipmentsBody = document.getElementById('shipments-body');

for(let i = shipmentsData.length - 1, j = 0; j < 3 && i >= 0; i--, j++) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${shipmentsData[i].id}</td>
        <td>${shipmentsData[i].destination}</td>
        <td>${shipmentsData[i].productWeight}</td>
        <td>${shipmentsData[i].status}</td>
    `;
    shipmentsBody.appendChild(row);
}
    
