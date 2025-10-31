document.addEventListener('DOMContentLoaded', function() {
    // --- DOM ELEMENTLERİ ---
    const destinationSelect = document.querySelector('#destination');
    const roadSelect = document.querySelector('#road');
    const vehicleSelect = document.querySelector('#vehicle');
    const weightInput = document.querySelector('#product-weight');
    const containerTypeSelect = document.querySelector('#container-type');
    const shipmentForm = document.querySelector('#shipment-form');
    const resultSummary = document.querySelector('#result-summary');
    const calculatedPriceSpan = document.querySelector('#calculated-price');
    const summaryDestinationSpan = document.querySelector('#summary-destination');

    // --- VERİ DEPOLAMA ---
    let citiesData = [];
    let vehiclesData = [];
    const containerCapacities = {
        small: 2000,
        medium: 5000,
        large: 10000
    };

    // --- ENVANTER YÖNETİMİ ---
    // localStorage'de envanter yoksa, varsayılan değerlerle oluştur
    let inventoryData = JSON.parse(localStorage.getItem('inventoryData'));
    if (!inventoryData) {
        inventoryData = [
            { id: 'fresh_food', name: 'Fresh Food', weight: 1200 },
            { id: 'cold_chain', name: 'Cold Chain', weight: 2500 },
            { id: 'textile', name: 'Textiles & Apparel', weight: 800 },
            { id: 'general_cargo', name: 'General Cargo', weight: 5500 },
            { id: 'other', name: 'Other', weight: 300 }
        ];
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    }

    // --- JSON VERİLERİNİ YÜKLEME ---
    Promise.all([
        fetch('../js/cities.json').then(response => response.json()),
        fetch('../js/vehicles.json').then(response => response.json())
    ])
    .then(([cities, vehicles]) => {
        citiesData = cities.sort((a, b) => a.destination_city.localeCompare(b.destination_city));
        vehiclesData = vehicles;
        
        citiesData.forEach(cityData => {
            const option = document.createElement('option');
            option.value = cityData.destination_city;
            option.textContent = cityData.destination_city;
            destinationSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('JSON dosyaları yüklenirken bir hata oluştu:', error);
    });

    // --- OLAY DİNLEYİCİLERİ ---

    // Ağırlık değiştiğinde konteyner seçeneklerini güncelle
    weightInput.addEventListener('input', function() {
        const weight = parseInt(this.value, 10) || 0;
        let isCurrentSelectionValid = false;

        // Konteyner seçeneklerini dolaş
        for (const option of containerTypeSelect.options) {
            const containerValue = option.value;
            if (!containerValue) continue; // Boş değerli ilk seçeneği atla

            const capacity = containerCapacities[containerValue];

            if (weight > capacity) {
                option.disabled = true; // Kapasite yetersizse devre dışı bırak
            } else {
                option.disabled = false; // Kapasite yeterliyse etkinleştir
            }
        }

        // Mevcut seçili konteynerin hala geçerli olup olmadığını kontrol et
        const selectedOption = containerTypeSelect.options[containerTypeSelect.selectedIndex];
        if (selectedOption && selectedOption.disabled) {
            // Eğer geçersiz hale geldiyse, seçimi sıfırla
            containerTypeSelect.selectedIndex = 0;
        }
    });

    destinationSelect.addEventListener('change', function() {
        const selectedCityName = this.value;
        roadSelect.innerHTML = '<option value="" disabled selected>Select a road type...</option>';
        vehicleSelect.innerHTML = '<option value="" disabled selected>Select a vehicle...</option>';
        const selectedCityData = citiesData.find(city => city.destination_city === selectedCityName);
        if (selectedCityData && selectedCityData.routes) {
            selectedCityData.routes.forEach(route => {
                const option = document.createElement('option');
                option.value = route.type;
                option.textContent = route.type.charAt(0).toUpperCase() + route.type.slice(1);
                roadSelect.appendChild(option);
            });
        }
    });

    roadSelect.addEventListener('change', function() {
        const selectedRoadType = this.value;
        vehicleSelect.innerHTML = '<option value="" disabled selected>Select a vehicle...</option>';
        const vehicleTypeToShow = selectedRoadType === 'land' ? 'Truck' : 'Ship';
        const filteredVehicles = vehiclesData.filter(vehicle => vehicle.type === vehicleTypeToShow);
        filteredVehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.name;
            option.textContent = vehicle.name;
            vehicleSelect.appendChild(option);
        });
    });

    shipmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedCityName = destinationSelect.value;
        const selectedRoadType = roadSelect.value;
        const selectedContainer = containerTypeSelect.value;

        if (!selectedCityName || !selectedRoadType || !selectedContainer) {
            alert('Please fill out all shipment details before calculating the price.');
            return;
        }

        const cityData = citiesData.find(city => city.destination_city === selectedCityName);
        const routeData = cityData.routes.find(route => route.type === selectedRoadType);
        const distance = routeData.distance_km;

        let ratePerKm;
        if (selectedContainer === 'small') ratePerKm = 5;
        else if (selectedContainer === 'medium') ratePerKm = 8;
        else if (selectedContainer === 'large') ratePerKm = 12;

        const totalPrice = distance * ratePerKm;
        calculatedPriceSpan.textContent = `₺${totalPrice.toFixed(2)}`;
        summaryDestinationSpan.textContent = selectedCityName;
        resultSummary.style.display = 'block';
    });

    document.querySelector('#confirm-shipment').addEventListener('click', function() {
        const productCategory = document.querySelector('#product-category').value;
        const productWeight = parseInt(document.querySelector('#product-weight').value, 10);

        // --- ENVANTER KONTROLÜ ---
        const categoryInStock = inventoryData.find(cat => cat.id === productCategory);
        
        if (!categoryInStock || categoryInStock.weight < productWeight) {
            const availableStock = categoryInStock ? categoryInStock.weight : 0;
            alert(`Insufficient stock for this category!\n\nAvailable: ${availableStock} kg\nRequested: ${productWeight} kg`);
            return;
        }

        // --- ENVANTER GÜNCELLEME ---
        categoryInStock.weight -= productWeight;
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

        // --- SHIPMENT OLUŞTURMA ---
        const shipments = JSON.parse(localStorage.getItem('shipments')) || [];
        const shipmentId = Date.now().toString();
        const newShipment = {
            id: shipmentId,
            productName: document.querySelector('#product-name').value,
            productCategory: productCategory,
            productWeight: productWeight,
            destination: destinationSelect.value,
            roadType: roadSelect.value,
            vehicle: vehicleSelect.value,
            containerType: containerTypeSelect.value,
            customerName: document.querySelector('#customer-name').value,
            additionalInfo: document.querySelector('#additional-info').value,
            totalPrice: calculatedPriceSpan.textContent,
            status: 'Pending'
        };
        shipments.push(newShipment);
        localStorage.setItem('shipments', JSON.stringify(shipments));
        alert(`Shipment created successfully! Your tracking ID is: ${shipmentId}`);
        shipmentForm.reset();
        resultSummary.style.display = 'none';
        roadSelect.innerHTML = '<option value="" disabled selected>Select a road type...</option>';
        vehicleSelect.innerHTML = '<option value="" disabled selected>Select a vehicle...</option>';
        // Konteyner seçeneklerini de sıfırla
        for (const option of containerTypeSelect.options) {
            option.disabled = false;
        }
    });
});