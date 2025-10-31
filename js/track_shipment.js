document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('track-form');
    const resultDiv = document.getElementById('tracking-result');

    if (trackingForm) {
        trackingForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const orderIdInput = document.getElementById('order-id');
            const orderId = orderIdInput.value.trim();

            if (!orderId) {
                alert('Please enter an Order ID.');
                resultDiv.style.display = 'none';
                return;
            }

            const shipmentsData = JSON.parse(localStorage.getItem('shipments')) || [];
            const shipment = shipmentsData.find(s => s.id === orderId);

            if (shipment) {
                
                document.getElementById('result-order-id').innerText = shipment.id;
                document.getElementById('result-customer-name').innerText = shipment.customerName;
                document.getElementById('result-destination').innerText = shipment.destination;
                document.getElementById('result-status').innerText = shipment.status;
                document.getElementById('result-cost').innerText = shipment.totalPrice;
                document.getElementById('result-product-name').innerText = shipment.productName;
                document.getElementById('result-product-category').innerText = shipment.productCategory;
                document.getElementById('result-product-weight').innerText = shipment.productWeight;
                document.getElementById('result-road-type').innerText = shipment.roadType.charAt(0).toUpperCase() + shipment.roadType.slice(1); // "Land" veya "Sea" olarak göster
                document.getElementById('result-vehicle').innerText = shipment.vehicle;
                document.getElementById('result-container-type').innerText = shipment.containerType.charAt(0).toUpperCase() + shipment.containerType.slice(1); // "Medium" olarak göster
                document.getElementById('result-additional-info').innerText = shipment.additionalInfo || 'Not provided'; // Boşsa varsayılan metin göster

                resultDiv.style.display = 'block';
            } else {
                alert('Shipment not found. Please check the Order ID and try again.');
                resultDiv.style.display = 'none';
            }
        });
    }
});
