// Mobile menu toggle
document.getElementById('mobileMenuButton').addEventListener('click', function() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
});

// Budget calculation functionality
const totalBudgetInput = document.getElementById('totalBudget');
const categoryInputs = document.querySelectorAll('.category-input');
const eventTypeSelect = document.getElementById('eventType');

// Initialize Chart.js
let budgetChart;
const ctx = document.getElementById('budgetPieChart').getContext('2d');

function initializeChart() {
    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Venue', 'Food & Beverage', 'AV/Technology', 'Decor', 'Entertainment', 'Miscellaneous'],
            datasets: [{
                data: [3000, 3500, 800, 1200, 1000, 500],
                backgroundColor: [
                    '#4f46e5',
                    '#7c3aed',
                    '#a78bfa',
                    '#c4b5fd',
                    '#ddd6fe',
                    '#f5f3ff'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// Toggle between chart and list view
document.getElementById('toggleChart').addEventListener('click', function() {
    const pieChart = document.getElementById('pieChartContainer');
    const listView = document.getElementById('listView');
    
    if (pieChart.classList.contains('hidden')) {
        pieChart.classList.remove('hidden');
        listView.classList.add('hidden');
        this.innerHTML = '<i class="fas fa-list mr-1"></i> View List';
    } else {
        pieChart.classList.add('hidden');
        listView.classList.remove('hidden');
        this.innerHTML = '<i class="fas fa-chart-pie mr-1"></i> View Chart';
    }
});

// Calculate total budget used
function calculateBudget() {
    let totalUsed = 0;
    const totalBudget = parseFloat(totalBudgetInput.value) || 0;
    
    categoryInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalUsed += value;
        
        // Update summary values
        const category = input.getAttribute('data-category');
        document.getElementById(`${category}-summary`).textContent = `$${value.toLocaleString()}`;
    });
    
    // Update totals
    document.getElementById('budgetUsed').textContent = `$${totalUsed.toLocaleString()}`;
    document.getElementById('total-summary').textContent = `$${totalUsed.toLocaleString()}`;
    
    // Update progress bar
    const percentage = Math.min((totalUsed / totalBudget) * 100, 100);
    document.getElementById('budgetProgress').style.width = `${percentage}%`;
    document.getElementById('budgetPercentage').textContent = `${Math.round(percentage)}%`;
    
    // Update remaining budget
    const remaining = totalBudget - totalUsed;
    const remainingElement = document.getElementById('budgetRemainingLabel');
    remainingElement.textContent = `$${remaining.toLocaleString()} remaining`;
    
    if (remaining < 0) {
        remainingElement.classList.add('text-red-600');
        remainingElement.classList.remove('text-gray-500');
    } else {
        remainingElement.classList.remove('text-red-600');
        remainingElement.classList.add('text-gray-500');
    }
    
    // Update chart if it exists
    if (budgetChart) {
        budgetChart.data.datasets[0].data = [
            parseFloat(document.querySelector('[data-category="venue"]').value) || 0,
            parseFloat(document.querySelector('[data-category="food"]').value) || 0,
            parseFloat(document.querySelector('[data-category="av"]').value) || 0,
            parseFloat(document.querySelector('[data-category="decor"]').value) || 0,
            parseFloat(document.querySelector('[data-category="entertainment"]').value) || 0,
            parseFloat(document.querySelector('[data-category="misc"]').value) || 0
        ];
        budgetChart.update();
    }
}

// Show recommendations modal
function showRecommendations(category) {
    const modal = document.getElementById('recommendationsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    // Set title based on category
    modalTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Recommendations`;
    
    // Set content based on category
    let content = '';
    const currentValue = parseFloat(document.querySelector(`[data-category="${category}"]`).value) || 0;
    const totalBudget = parseFloat(totalBudgetInput.value) || 1;
    const percentage = (currentValue / totalBudget) * 100;
    
    switch(category) {
        case 'venue':
            content = `
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Current Allocation: ${Math.round(percentage)}%</h4>
                    <p class="text-gray-700 mb-2">Recommended range: 30-40% of total budget</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill bg-indigo-200" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Consider weekday or off-season dates for 15-25% savings</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Ask about package deals that include catering or AV</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Non-traditional venues (museums, galleries) often have lower fees</p>
                    </div>
                </div>
            `;
            break;
            
        case 'food':
            content = `
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Current Allocation: ${Math.round(percentage)}%</h4>
                    <p class="text-gray-700 mb-2">Recommended range: 35-45% of total budget</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill bg-indigo-200" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Buffet or food stations typically cost 20-30% less than plated meals</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Limit bar options to beer, wine, and signature cocktails</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Seasonal and local ingredients reduce costs by 15-25%</p>
                    </div>
                </div>
            `;
            break;
            
        case 'av':
            content = `
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Current Allocation: ${Math.round(percentage)}%</h4>
                    <p class="text-gray-700 mb-2">Recommended range: 5-10% of total budget</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill bg-indigo-200" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Venue-provided AV packages are often 15-20% cheaper</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Consider renting instead of buying equipment</p>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                            <i class="fas fa-check text-indigo-600 text-sm"></i>
                        </div>
                        <p class="text-gray-700">Student AV technicians can provide quality service at lower rates</p>
                    </div>
                </div>
            `;
            break;
            
        default:
            content = `
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Current Allocation: ${Math.round(percentage)}%</h4>
                    <p class="text-gray-700 mb-2">Recommended range varies by category</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill bg-indigo-200" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
                <p class="text-gray-700">Adjust this category to see specific recommendations for optimizing your budget allocation.</p>
            `;
    }
    
    modalContent.innerHTML = content;
    modal.classList.remove('hidden');
}

// Hide recommendations modal
function hideRecommendations() {
    document.getElementById('recommendationsModal').classList.add('hidden');
}

// Show custom category form
document.getElementById('addCategoryBtn').addEventListener('click', function() {
    document.getElementById('customCategoryForm').classList.remove('hidden');
});

// Hide custom category form
function hideCustomCategoryForm() {
    document.getElementById('customCategoryForm').classList.add('hidden');
    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryAmount').value = '';
}

// Add custom category
function addCustomCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const amount = parseFloat(document.getElementById('newCategoryAmount').value) || 0;
    
    if (name) {
        // In a real app, we would add this to the budget items list
        alert(`Custom category "${name}" with amount $${amount} would be added here.`);
        hideCustomCategoryForm();
    } else {
        alert('Please enter a category name');
    }
}

// Load template based on event type
function loadTemplate(type) {
    let venue, food, av, decor, entertainment, misc;
    
    switch(type) {
        case 'wedding':
            venue = 4000;
            food = 4500;
            av = 800;
            decor = 1500;
            entertainment = 1200;
            misc = 1000;
            break;
            
        case 'corporate':
            venue = 3500;
            food = 4000;
            av = 1500;
            decor = 800;
            entertainment = 1000;
            misc = 800;
            break;
            
        case 'conference':
            venue = 8000;
            food = 6000;
            av = 3000;
            decor = 1500;
            entertainment = 2000;
            misc = 1500;
            break;
            
        case 'birthday':
            venue = 800;
            food = 1200;
            av = 300;
            decor = 500;
            entertainment = 800;
            misc = 400;
            break;
            
        default:
            // Custom - leave as is
            return;
    }
    
    // Update input values
    document.querySelector('[data-category="venue"]').value = venue;
    document.querySelector('[data-category="food"]').value = food;
    document.querySelector('[data-category="av"]').value = av;
    document.querySelector('[data-category="decor"]').value = decor;
    document.querySelector('[data-category="entertainment"]').value = entertainment;
    document.querySelector('[data-category="misc"]').value = misc;
    
    // Update event type dropdown
    document.getElementById('eventType').value = type;
    
    // Recalculate budget
    calculateBudget();
    
    // Show confirmation
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} template loaded successfully!`);
}

// Event listeners
totalBudgetInput.addEventListener('input', calculateBudget);
categoryInputs.forEach(input => {
    input.addEventListener('input', calculateBudget);
});

eventTypeSelect.addEventListener('change', function() {
    if (this.value !== 'custom') {
        loadTemplate(this.value);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    calculateBudget();
    
    // Hide chart by default on mobile
    if (window.innerWidth < 768) {
        document.getElementById('pieChartContainer').classList.add('hidden');
        document.getElementById('toggleChart').innerHTML = '<i class="fas fa-list mr-1"></i> View List';
    }
});