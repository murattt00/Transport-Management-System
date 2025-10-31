document.addEventListener('DOMContentLoaded', function() {
    const fleetTableBody = document.querySelector('#fleet-list tbody');

    // vehicles.json dosyasından verileri çek
    fetch('../js/vehicles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(vehicles => {
   
            fleetTableBody.innerHTML = '';

            vehicles.forEach(vehicle => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Name">${vehicle.name}</td>
                    <td data-label="Type">${vehicle.type}</td>
                    <td data-label="Capacity (kg)">${vehicle.capacity_kg.toLocaleString()}</td>
                    <td data-label="Fuel Cost/km">₺${vehicle.fuel_cost_per_km}</td>
                    <td data-label="Crew/Driver Cost">₺${vehicle.crew_driver_cost.toLocaleString()}</td>
                    <td data-label="Maintenance Cost">₺${vehicle.maintenance_cost.toLocaleString()}</td>
                `;
                fleetTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            fleetTableBody.innerHTML = '<tr><td colspan="6">Error loading fleet data.</td></tr>';
        });
});