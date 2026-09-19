document.addEventListener('DOMContentLoaded', function() {
    // --- DOM ELEMENTS ---
    const dashboardBody = document.getElementById('dashboard-body');
    const totalShipmentsSpan = document.getElementById('total-shipments');
    const totalIncomeSpan = document.getElementById('income');
    const earningSpan = document.getElementById('earning');
    const optimizeBtn = document.getElementById('optimize-btn');
    const optimizationResultsDiv = document.getElementById('optimization-results');
    const vehicleListDiv = document.getElementById('vehicle-list');

    // --- DATA STORAGE ---
    let allShipments = [];
    let allVehicles = [];
    let allCities = [];
    const containerCapacities = { small: 2000, medium: 5000, large: 10000 };

    // --- INITIALIZATION ---
    Promise.all([
        Promise.resolve(JSON.parse(localStorage.getItem('shipments')) || []),
        fetch('../js/vehicles.json').then(res => res.json()),
        fetch('../js/cities.json').then (res => res.json())
    ])
    .then(([shipments, vehicles, cities]) => {
        allShipments = shipments;
        allVehicles = vehicles;
        allCities = cities;

        loadDashboard();
        loadBasicInfos();
        displayVehicleOccupancy();

        optimizeBtn.addEventListener('click', displayOptimizedContainers);
        // Merkezi olay dinleyicisini ekle
        vehicleListDiv.addEventListener('click', handleVehicleAction);
    })
    .catch(error => {
        console.error("Failed to load necessary data:", error);
        document.querySelector('main').innerHTML = '<p style="color: red; text-align: center;">Error loading dashboard data. Please try again later.</p>';
    });


    // --- FUNCTIONS ---

    function loadDashboard() {
        dashboardBody.innerHTML = '';
        allShipments.forEach(shipment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Shipment ID">${shipment.id}</td>
                <td data-label="Customer">${shipment.customerName}</td>
                <td data-label="Destination">${shipment.destination}</td>
                <td data-label="Amount">${shipment.totalPrice}</td>
                <td data-label="Container Type">${shipment.containerType}</td>
                <td data-label="Vehicle">${shipment.vehicle}</td>
                <td data-label="Status">${shipment.status}</td>
            `;
            dashboardBody.appendChild(row);
        });
    }

    function loadBasicInfos() {
        totalShipmentsSpan.textContent = allShipments.length;
        const totalIncome = allShipments.reduce((sum, s) => sum + parseFloat(s.totalPrice.replace('₺', '') || 0), 0);
        totalIncomeSpan.textContent = `₺${totalIncome.toFixed(2)}`;
        earningSpan.textContent = `₺${(totalIncome * 0.25).toFixed(2)}`;
    }

    function displayOptimizedContainers() {
        optimizationResultsDiv.innerHTML = '<h3>Optimization Results:</h3>';
        const pendingShipments = allShipments.filter(s => s.status === 'Pending');
        const shipmentsByGroup = {};
        pendingShipments.forEach(shipment => {
            const groupKey = `${shipment.destination}-${shipment.containerType}`;
            if (!shipmentsByGroup[groupKey]) shipmentsByGroup[groupKey] = [];
            shipmentsByGroup[groupKey].push(shipment);
        });
        for (const groupKey in shipmentsByGroup) {
            const groupShipments = shipmentsByGroup[groupKey].sort((a, b) => b.productWeight - a.productWeight);
            const [destination, containerType] = groupKey.split('-');
            const optimizedContainers = [];
            groupShipments.forEach(shipment => {
                const shipmentWeight = parseInt(shipment.productWeight);
                let placed = false;
                for (const container of optimizedContainers) {
                    if ((container.currentLoad + shipmentWeight) <= containerCapacities[container.type]) {
                        container.shipments.push(shipment.id);
                        container.currentLoad += shipmentWeight;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    optimizedContainers.push({ type: containerType, currentLoad: shipmentWeight, shipments: [shipment.id] });
                }
            });
            const resultHTML = `<h4>${destination} (${containerType.charAt(0).toUpperCase() + containerType.slice(1)} Containers)</h4><ul>${optimizedContainers.map(c => `<li><strong>Container:</strong> ${c.currentLoad}kg / ${containerCapacities[c.type]}kg filled. (Shipments: ${c.shipments.join(', ')})</li>`).join('')}</ul>`;
            optimizationResultsDiv.innerHTML += resultHTML;
        }
        if (Object.keys(shipmentsByGroup).length === 0) {
            optimizationResultsDiv.innerHTML += '<p>No pending shipments to optimize.</p>';
        }
    }

    /**
     * YENİLENDİ: Araç kapasitesini aşmayacak ve destinasyona göre gruplandıracak şekilde araçları listeler.
     */
    function displayVehicleOccupancy() {
        vehicleListDiv.innerHTML = '';
        const activeShipments = allShipments.filter(s => s.status === 'Pending' || s.status === 'In Transit');
        
        // Destinasyon ve araç ismine göre grupla
        const groupedShipments = {};
        
        activeShipments.forEach(shipment => {
            const vehicleData = allVehicles.find(v => v.name === shipment.vehicle);
            if (!vehicleData) return;
            
            const groupKey = `${shipment.vehicle}-${shipment.destination}-${shipment.roadType}`;
            
            if (!groupedShipments[groupKey]) {
                groupedShipments[groupKey] = [];
            }
            
            // Mevcut grupları kontrol et ve kapasite aşımını önle
            let placed = false;
            for (let i = 0; i < groupedShipments[groupKey].length; i++) {
                const currentGroup = groupedShipments[groupKey][i];
                const currentLoad = currentGroup.reduce((sum, s) => sum + parseInt(s.productWeight), 0);
                const newLoad = currentLoad + parseInt(shipment.productWeight);
                
                // Kapasite kontrolü
                if (newLoad <= vehicleData.capacity_kg) {
                    currentGroup.push(shipment);
                    placed = true;
                    break;
                }
            }
            
            // Eğer hiçbir gruba sığmadıysa yeni bir grup oluştur
            if (!placed) {
                groupedShipments[groupKey].push([shipment]);
            }
        });

        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>Vehicle</th><th>Destination</th><th>Load / Occupancy</th><th>Revenue</th><th>Est. Cost</th><th>Est. Profit</th><th>Action</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');

        // Grupları tabloya ekle
        for (const groupKey in groupedShipments) {
            const [vehicleName, destinationName, roadType] = groupKey.split('-');
            const vehicleData = allVehicles.find(v => v.name === vehicleName);
            if (!vehicleData) continue;

            const vehicleGroups = groupedShipments[groupKey];
            
            // Her bir alt grup için ayrı satır oluştur
            vehicleGroups.forEach((vehicleShipments, index) => {
                const totalLoad = vehicleShipments.reduce((sum, s) => sum + parseInt(s.productWeight), 0);
                const totalRevenue = vehicleShipments.reduce((sum, s) => sum + parseFloat(s.totalPrice.replace('₺', '') || 0), 0);
                const occupancyRate = (totalLoad / vehicleData.capacity_kg) * 100;
                
                const cityData = allCities.find(c => c.destination_city === destinationName);
                const routeData = cityData ? cityData.routes.find(r => r.type === roadType) : null;
                const distance = routeData ? routeData.distance_km : 0;
                const fuelCost = (vehicleData.fuel_cost_per_km / vehicleData.capacity_kg) * totalLoad * distance;
                const totalCost = fuelCost + vehicleData.crew_driver_cost + vehicleData.maintenance_cost;
                const totalProfit = totalRevenue - totalCost;
                const shipmentIdsForAction = vehicleShipments.map(s => s.id).join(',');

                // Duruma göre hangi butonun gösterileceğini belirle
                const groupStatus = vehicleShipments[0].status;
                let actionButtonHTML = '';
                if (groupStatus === 'Pending') {
                    actionButtonHTML = `<button class="dispatch-btn" data-shipment-ids="${shipmentIdsForAction}">Dispatch</button>`;
                } else if (groupStatus === 'In Transit') {
                    actionButtonHTML = `<button class="arrive-btn" data-shipment-ids="${shipmentIdsForAction}">Mark Arrived</button>`;
                }

                // Eğer birden fazla grup varsa araç isminin sonuna numara ekle
                const vehicleDisplayName = vehicleGroups.length > 1 ? `${vehicleName} #${index + 1}` : vehicleName;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Vehicle">${vehicleDisplayName}</td>
                    <td data-label="Destination">${destinationName}</td>
                    <td data-label="Load / Occupancy">${totalLoad}kg / ${vehicleData.capacity_kg}kg <strong>(${occupancyRate.toFixed(1)}%)</strong></td>
                    <td data-label="Revenue">₺${totalRevenue.toFixed(2)}</td>
                    <td data-label="Est. Cost" style="color: red;">₺${totalCost.toFixed(2)}</td>
                    <td data-label="Est. Profit" style="color: ${totalProfit > 0 ? 'green' : 'red'}; font-weight: bold;">₺${totalProfit.toFixed(2)}</td>
                    <td data-label="Action">${actionButtonHTML}</td>`;
                tbody.appendChild(row);
            });
        }
        vehicleListDiv.appendChild(table);
    }

    function dispatchVehicle(idsToDispatch) {
        let vehicleName = '';
        allShipments.forEach(shipment => {
            if (idsToDispatch.includes(shipment.id)) {
                shipment.status = 'In Transit';
                vehicleName = shipment.vehicle;
            }
        });
        localStorage.setItem('shipments', JSON.stringify(allShipments));
        alert(`Shipments for vehicle ${vehicleName} have been dispatched!`);
        loadDashboard();
        displayVehicleOccupancy();
    }

    /**
     * YENİ: Aracı "Vardı" olarak işaretler, gönderileri günceller ve finansal kayıt oluşturur.
     */
    function markVehicleArrived(idsToUpdate) {
        const arrivedShipments = allShipments.filter(s => idsToUpdate.includes(s.id));
        if (arrivedShipments.length === 0) return;

        const vehicleName = arrivedShipments[0].vehicle;

        // --- Finansal Hesaplama Başlangıcı ---
        const vehicleData = allVehicles.find(v => v.name === vehicleName);
        const totalRevenue = arrivedShipments.reduce((sum, s) => sum + parseFloat(s.totalPrice.replace('₺', '') || 0), 0);
        const totalLoad = arrivedShipments.reduce((sum, s) => sum + parseInt(s.productWeight), 0);
        
        const destinationName = arrivedShipments[0].destination;
        const roadType = arrivedShipments[0].roadType;
        const cityData = allCities.find(c => c.destination_city === destinationName);
        const routeData = cityData ? cityData.routes.find(r => r.type === roadType) : null;
        const distance = routeData ? routeData.distance_km : 0;

        const fuelCost = (vehicleData.fuel_cost_per_km / vehicleData.capacity_kg) * totalLoad * distance;
        const totalCost = fuelCost + vehicleData.crew_driver_cost + vehicleData.maintenance_cost;
        // --- Finansal Hesaplama Sonu ---

        // Finansal kaydı localStorage'a ekle
        const financialRecords = JSON.parse(localStorage.getItem('financialRecords')) || [];
        financialRecords.push({
            revenue: totalRevenue,
            cost: totalCost,
            date: new Date().toISOString()
        });
        localStorage.setItem('financialRecords', JSON.stringify(financialRecords));

        // Gönderi durumlarını güncelle
        arrivedShipments.forEach(shipment => {
            shipment.status = 'Delivered';
        });
        localStorage.setItem('shipments', JSON.stringify(allShipments));

        alert(`Vehicle ${vehicleName} has arrived. Financial record saved. Shipments marked as Delivered.`);
        loadDashboard();
        displayVehicleOccupancy();
    }

    /**
     * YENİ: Araç tablosundaki tüm aksiyonları yönetir.
     */
    function handleVehicleAction(event) {
        const target = event.target;
        const ids = target.dataset.shipmentIds ? target.dataset.shipmentIds.split(',') : [];

        if (ids.length === 0) return;

        if (target.classList.contains('dispatch-btn')) {
            dispatchVehicle(ids);
        } else if (target.classList.contains('arrive-btn')) {
            markVehicleArrived(ids);
        }
    }

    function groupData(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
});