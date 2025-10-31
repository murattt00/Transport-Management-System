document.addEventListener('DOMContentLoaded', function() {
    const inventoryGrid = document.getElementById('inventory');
  
    const LOW_STOCK_THRESHOLD = 5000; 

    let inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [
        { id: 'fresh_food', name: 'Fresh Food', weight: 1200 },
        { id: 'cold_chain', name: 'Cold Chain', weight: 2500 },
        { id: 'textile', name: 'Textiles & Apparel', weight: 800 },
        { id: 'general_cargo', name: 'General Cargo', weight: 5500 },
        { id: 'other', name: 'Other', weight: 300 }
    ];

    
    function renderInventory() {
        inventoryGrid.innerHTML = ''; 

        inventoryData.forEach(category => {
            const isLow = category.weight < LOW_STOCK_THRESHOLD;
            const statusClass = isLow ? 'status-low' : 'status-ok';
            const statusText = isLow ? 'Low' : 'OK';

            const card = document.createElement('div');
            card.className = 'inventory-card';
            card.innerHTML = `
                <h3>${category.name}</h3>
                <p><strong>Total Weight:</strong> ${category.weight} kg</p>
                <div class="status ${statusClass}">${statusText}</div>
                <button class="add-stock-btn" data-id="${category.id}">Add Stock</button>
            `;
            inventoryGrid.appendChild(card);
        });
    }

  
    function addStock(categoryId, amountToAdd) {
        const category = inventoryData.find(cat => cat.id === categoryId);
        if (category) {
            category.weight += amountToAdd;
      
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
       
            renderInventory();
        }
    }

 
    inventoryGrid.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-stock-btn')) {
            const categoryId = event.target.dataset.id;
            const amountStr = prompt('Enter the amount of stock to add (kg):');
            
            if (amountStr) { 
                const amount = parseInt(amountStr, 10);
                
                if (!isNaN(amount) && amount > 0) {
                    addStock(categoryId, amount);
                } else {
                    alert('Please enter a valid positive number.');
                }
            }
        }
    });

    // Sayfa ilk yüklendiğinde envanteri çiz
    renderInventory();
});