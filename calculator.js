
        // Mobile menu toggle
        document.getElementById('mobileMenuButton').addEventListener('click', function() {
            document.getElementById('mobileMenu').classList.toggle('open');
        });

        // Budget calculation logic
        function calculateBudget() {
            const totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
            const inputs = document.querySelectorAll('.category-input');
            
            let totalUsed = 0;
            inputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                totalUsed += value;
            });
            
            const percentage = Math.min(100, (totalUsed / totalBudget) * 100);
            const remaining = totalBudget - totalUsed;
            
            document.getElementById('budgetUsed').textContent = '$' + totalUsed.toLocaleString();
            document.getElementById('budgetProgress').style.width = percentage + '%';
            document.getElementById('budgetRemainingLabel').textContent = '$' + remaining.toLocaleString() + ' remaining';
            document.getElementById('budgetPercentage').textContent = percentage.toFixed(1) + '%';
            
            // Update summary
            document.getElementById('venue-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="venue"]').value) || 0).toLocaleString();
            document.getElementById('food-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="food"]').value) || 0).toLocaleString();
            document.getElementById('av-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="av"]').value) || 0).toLocaleString();
            document.getElementById('decor-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="decor"]').value) || 0).toLocaleString();
            document.getElementById('entertainment-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="entertainment"]').value) || 0).toLocaleString();
            document.getElementById('misc-summary').textContent = '$' + (parseFloat(document.querySelector('[data-category="misc"]').value) || 0).toLocaleString();
            document.getElementById('total-summary').textContent = '$' + totalUsed.toLocaleString();
            
            updateChart();
        }

        // Initialize chart
        let budgetChart;
        function initChart() {
            const ctx = document.getElementById('budgetPieChart').getContext('2d');
            budgetChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Venue', 'Food & Beverage', 'AV/Technology', 'Decor', 'Entertainment', 'Miscellaneous'],
                    datasets: [{
                        data: [3000, 3500, 800, 1200, 1000, 500],
                        backgroundColor: [
                            '#4f46e5',
                            '#7c3aed',
                            '#9333ea',
                            '#a855f7',
                            '#c084fc',
                            '#d8b4fe'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
            // Hide chart initially
            document.getElementById('pieChartContainer').classList.add('hidden');
        }

        // Update chart with current values
        function updateChart() {
            const venue = parseFloat(document.querySelector('[data-category="venue"]').value) || 0;
            const food = parseFloat(document.querySelector('[data-category="food"]').value) || 0;
            const av = parseFloat(document.querySelector('[data-category="av"]').value) || 0;
            const decor = parseFloat(document.querySelector('[data-category="decor"]').value) || 0;
            const entertainment = parseFloat(document.querySelector('[data-category="entertainment"]').value) || 0;
            const misc = parseFloat(document.querySelector('[data-category="misc"]').value) || 0;
            
            budgetChart.data.datasets[0].data = [venue, food, av, decor, entertainment, misc];
            budgetChart.update();
        }

        // Toggle chart visibility
        document.getElementById('toggleChart').addEventListener('click', function() {
            const chartContainer = document.getElementById('pieChartContainer');
            const listView = document.getElementById('listView');
            
            if (chartContainer.classList.contains('hidden')) {
                chartContainer.classList.remove('hidden');
                listView.classList.add('hidden');
                this.innerHTML = '<i class="fas fa-list mr-1"></i> View List';
            } else {
                chartContainer.classList.add('hidden');
                listView.classList.remove('hidden');
                this.innerHTML = '<i class="fas fa-chart-pie mr-1"></i> View Chart';
            }
        });

        // Show recommendations modal
        function showRecommendations(category) {
            const modal = document.getElementById('recommendationsModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            modalTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Recommendations';
            
            let content = '';
            switch(category) {
                case 'venue':
                    content = `
                        <h4 class="font-bold mb-2">Venue Selection Tips</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Consider off-peak dates for better rates</li>
                            <li>Ask about package deals that include tables, chairs, and linens</li>
                            <li>Negotiate based on catering minimums</li>
                            <li>Look for venues that allow outside vendors</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 30-40% of total budget</p>
                    `;
                    break;
                case 'food':
                    content = `
                        <h4 class="font-bold mb-2">Food & Beverage Savings</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Opt for buffet or family-style service to reduce staffing costs</li>
                            <li>Consider seasonal and local ingredients</li>
                            <li>Limit bar options to beer, wine, and a signature cocktail</li>
                            <li>Ask about per-person vs. per-item pricing</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 35-45% of total budget</p>
                    `;
                    break;
                case 'av':
                    content = `
                        <h4 class="font-bold mb-2">AV/Technology Advice</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Determine must-have vs. nice-to-have AV elements</li>
                            <li>Consider renting instead of buying equipment</li>
                            <li>Ask about venue-provided AV packages</li>
                            <li>Hire a professional for important presentations</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 5-10% of total budget</p>
                    `;
                    break;
                case 'decor':
                    content = `
                        <h4 class="font-bold mb-2">Decor Ideas</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Use lighting creatively to transform spaces</li>
                            <li>Repurpose ceremony decor for reception</li>
                            <li>Consider DIY options for centerpieces</li>
                            <li>Rent large decor items instead of purchasing</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 10-15% of total budget</p>
                    `;
                    break;
                case 'entertainment':
                    content = `
                        <h4 class="font-bold mb-2">Entertainment Options</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Book local talent to reduce travel costs</li>
                            <li>Consider a DJ instead of a live band</li>
                            <li>Ask about weekday vs. weekend pricing</li>
                            <li>Look for package deals with ceremony and reception music</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 8-12% of total budget</p>
                    `;
                    break;
                case 'misc':
                    content = `
                        <h4 class="font-bold mb-2">Miscellaneous Savings</h4>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li>Set aside 5-10% for unexpected expenses</li>
                            <li>Combine shipping for multiple orders</li>
                            <li>Ask vendors about cash payment discounts</li>
                            <li>Track all expenses in one place</li>
                        </ul>
                        <p class="text-sm text-gray-600">Typical allocation: 5-10% of total budget</p>
                    `;
                    break;
                default:
                    content = '<p>Select a category to see specific recommendations.</p>';
            }
            
            modalContent.innerHTML = content;
            modal.classList.remove('hidden');
        }

        // Hide recommendations modal
        function hideRecommendations() {
            document.getElementById('recommendationsModal').classList.add('hidden');
        }

        // Custom category form
        function showCustomCategoryForm() {
            document.getElementById('customCategoryForm').classList.remove('hidden');
        }

        function hideCustomCategoryForm() {
            document.getElementById('customCategoryForm').classList.add('hidden');
        }

        function addCustomCategory() {
            const name = document.getElementById('newCategoryName').value;
            const amount = parseFloat(document.getElementById('newCategoryAmount').value) || 0;
            
            if (name && amount > 0) {
                const form = document.getElementById('customCategoryForm');
                const container = form.parentElement;
                
                // Create new budget item
                const newItem = document.createElement('div');
                newItem.className = 'budget-item bg-gray-50 p-4 rounded-lg';
                newItem.innerHTML = `
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-bold flex items-center">
                            <i class="fas fa-tag text-indigo-600 mr-2"></i>
                            ${name}
                        </h3>
                        <div class="flex items-center">
                            <span class="text-gray-500 mr-2">$</span>
                            <input type="number" data-category="${name.toLowerCase()}" value="${amount}" class="category-input bg-gray-100 border border-gray-300 rounded-md px-3 py-1 w-24 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex-1 mr-4">
                            <div class="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Custom Category</span>
                                <span>${((amount / parseFloat(document.getElementById('totalBudget').value)) * 100).toFixed(1)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-indigo-200" style="width: ${((amount / parseFloat(document.getElementById('totalBudget').value)) * 100).toFixed(1)}%"></div>
                            </div>
                        </div>
                        <button class="text-indigo-600 hover:text-indigo-800" onclick="showRecommendations('${name.toLowerCase()}')">
                            <i class="fas fa-lightbulb"></i> Tips
                        </button>
                    </div>
                `;
                
                // Insert before the "Add Custom Category" button
                container.insertBefore(newItem, form.previousElementSibling);
                
                // Reset form
                document.getElementById('newCategoryName').value = '';
                document.getElementById('newCategoryAmount').value = '';
                hideCustomCategoryForm();
                
                // Add event listener to new input
                newItem.querySelector('.category-input').addEventListener('input', calculateBudget);
                
                // Update chart data
                updateChart();
            }
        }

        // Load template
        function loadTemplate(type) {
            let venue, food, av, decor, entertainment, misc;
            
            switch(type) {
                case 'wedding':
                    venue = 3500;
                    food = 4000;
                    av = 800;
                    decor = 1500;
                    entertainment = 1200;
                    misc = 1000;
                    document.getElementById('totalBudget').value = 12000;
                    break;
                case 'corporate':
                    venue = 2500;
                    food = 3000;
                    av = 1500;
                    decor = 800;
                    entertainment = 1000;
                    misc = 800;
                    document.getElementById('totalBudget').value = 9600;
                    break;
                case 'conference':
                    venue = 8000;
                    food = 10000;
                    av = 5000;
                    decor = 2000;
                    entertainment = 3000;
                    misc = 2000;
                    document.getElementById('totalBudget').value = 30000;
                    break;
                case 'birthday':
                    venue = 800;
                    food = 1200;
                    av = 300;
                    decor = 500;
                    entertainment = 800;
                    misc = 400;
                    document.getElementById('totalBudget').value = 4000;
                    break;
                default:
                    return;
            }
            
            document.querySelector('[data-category="venue"]').value = venue;
            document.querySelector('[data-category="food"]').value = food;
            document.querySelector('[data-category="av"]').value = av;
            document.querySelector('[data-category="decor"]').value = decor;
            document.querySelector('[data-category="entertainment"]').value = entertainment;
            document.querySelector('[data-category="misc"]').value = misc;
            
            document.getElementById('eventType').value = type;
            calculateBudget();
        }

        // Export functions
        function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(18);
            doc.text('Event Budget Summary', 105, 20, { align: 'center' });
            
            // Add event details
            doc.setFontSize(12);
            doc.text(`Event Type: ${document.getElementById('eventType').options[document.getElementById('eventType').selectedIndex].text}`, 20, 35);
            doc.text(`Total Budget: $${parseFloat(document.getElementById('totalBudget').value).toLocaleString()}`, 20, 45);
            doc.text(`Budget Used: ${document.getElementById('budgetUsed').textContent} (${document.getElementById('budgetPercentage').textContent})`, 20, 55);
            
            // Add budget items
            let y = 75;
            doc.setFontSize(14);
            doc.text('Budget Breakdown', 20, y);
            y += 10;
            
            doc.setFontSize(12);
            const items = document.querySelectorAll('#listView > div > div:not(.border-t)');
            items.forEach(item => {
                const text = item.textContent.trim();
                doc.text(text, 20, y);
                y += 10;
            });
            
            // Add total
            y += 5;
            const total = document.querySelector('#listView > div > div.border-t').textContent.trim();
            doc.setFont('helvetica', 'bold');
            doc.text(total, 20, y);
            
            // Save the PDF
            doc.save('Event_Budget_Summary.pdf');
        }

        function exportToExcel() {
            // Create workbook
            const wb = XLSX.utils.book_new();
            
            // Prepare data
            const data = [
                ['Category', 'Amount'],
                ['Venue', parseFloat(document.querySelector('[data-category="venue"]').value) || 0],
                ['Food & Beverage', parseFloat(document.querySelector('[data-category="food"]').value) || 0],
                ['AV/Technology', parseFloat(document.querySelector('[data-category="av"]').value) || 0],
                ['Decor', parseFloat(document.querySelector('[data-category="decor"]').value) || 0],
                ['Entertainment', parseFloat(document.querySelector('[data-category="entertainment"]').value) || 0],
                ['Miscellaneous', parseFloat(document.querySelector('[data-category="misc"]').value) || 0],
                ['Total', document.getElementById('budgetUsed').textContent.replace('$', '')]
            ];
            
            // Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(data);
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, "Budget Summary");
            
            // Generate and download Excel file
            XLSX.writeFile(wb, "Event_Budget.xlsx");
        }

        function exportToPNG() {
            // Capture the budget summary section
            const element = document.querySelector('.bg-white.rounded-xl.shadow-md.overflow-hidden.sticky-sidebar');
            
            html2canvas(element).then(canvas => {
                // Create download link
                const link = document.createElement('a');
                link.download = 'Event_Budget_Summary.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initChart();
            calculateBudget();
            
            // Add event listeners
            document.getElementById('totalBudget').addEventListener('input', calculateBudget);
            document.querySelectorAll('.category-input').forEach(input => {
                input.addEventListener('input', calculateBudget);
            });
            
            document.getElementById('addCategoryBtn').addEventListener('click', showCustomCategoryForm);
            
            // Close modal when clicking outside
            document.getElementById('recommendationsModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    hideRecommendations();
                }
            });
        });
    