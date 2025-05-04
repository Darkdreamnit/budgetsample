<script>
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('open');
                // Change icon based on menu state
                const icon = mobileMenuButton.querySelector('i');
                if (mobileMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Close menu when clicking on a link
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('open');
                    mobileMenuButton.querySelector('i').classList.remove('fa-times');
                    mobileMenuButton.querySelector('i').classList.add('fa-bars');
                });
            });

            const calculateBtn = document.getElementById('calculateBtn');
            const resetBtn = document.getElementById('resetBtn');
            const resultsSection = document.getElementById('resultsSection');
            const placeholderSection = document.getElementById('placeholderSection');
            const budgetRange = document.getElementById('budgetRange');
            const budgetValue = document.getElementById('budgetValue');
                        
            // Update budget range display
            budgetRange.addEventListener('input', function() {
                budgetValue.textContent = '$' + (this.value / 1000) + 'K';
            });
                        
            // Event types with detailed cost structures
            const eventTypes = {
                wedding: {
                     base: 8000,
                     venue: 0.35,
                     catering: 0.4,
                     av: 0.08,
                     decor: 0.1,
                     staff: 0.05,
                     marketing: 0.02
                 },
                corporate: {
                     base: 5000,
                     venue: 0.3,
                     catering: 0.35,
                     av: 0.15,
                     decor: 0.08,
                     staff: 0.08,
                     marketing: 0.04
                 },
                conference: {
                     base: 15000,
                     venue: 0.4,
                     catering: 0.3,
                     av: 0.15,
                     decor: 0.05,
                     staff: 0.07,
                     marketing: 0.03
                 },
                birthday: {
                     base: 2000,
                     venue: 0.25,
                     catering: 0.5,
                     av: 0.05,
                     decor: 0.15,
                     staff: 0.03,
                     marketing: 0.02
                 },
                charity: {
                     base: 10000,
                     venue: 0.3,
                     catering: 0.35,
                     av: 0.1,
                     decor: 0.15,
                     staff: 0.07,
                     marketing: 0.03
                 },
                trade: {
                     base: 20000,
                     venue: 0.45,
                     catering: 0.25,
                     av: 0.15,
                     decor: 0.1,
                     staff: 0.03,
                     marketing: 0.02
                 }
            };
                        
            // Budget optimization tips by event type
            const optimizationTips = {
                wedding: [
                    "Consider a Friday or Sunday wedding for 15-20% venue savings",
                    "Opt for seasonal flowers to reduce floral costs by 30%",
                    "Limit bar options to beer, wine, and signature cocktails to reduce beverage costs",
                    "Digital invitations can save $500-$1000 compared to printed"
                ],
                corporate: [
                    "Morning or afternoon events reduce catering costs by 25-40% vs. dinner",
                    "Package AV with venue for 15-20% savings",
                    "Early bird registration improves budget predictability",
                    "Virtual attendance options can expand reach while reducing venue needs"
                ],
                conference: [
                    "Sponsorships can offset 30-50% of total costs",
                    "Multi-year venue contracts often provide 10-15% discounts",
                    "Streamlined conference materials can save $5-$10 per attendee",
                    "Shared booth spaces reduce exhibitor costs by 40%"
                ],
                birthday: [
                    "Weekday parties often have lower venue minimums",
                    "Potluck-style or dessert-only events reduce catering costs",
                    "DIY decor can save hundreds with some creative effort",
                    "Digital invitations eliminate printing and postage costs"
                ],
                charity: [
                    "Sponsorships can cover 60-80% of event costs",
                    "Silent auctions typically generate 20-30% of total revenue",
                    "Volunteer staff can reduce labor costs by thousands",
                    "Media partnerships provide free promotion"
                ],
                trade: [
                    "Early exhibitor discounts increase booth sales",
                    "Shared freight services reduce shipping costs by 25%",
                    "Digital goody bags eliminate swag costs",
                    "Multi-event contracts with venues provide better rates"
                ]
            };
                        
            calculateBtn.addEventListener('click', function() {
                // Get form values
                const eventType = document.getElementById('eventType').value;
                const guestCount = parseInt(document.getElementById('guestCount').value) || 100;
                const duration = parseInt(document.getElementById('duration').value) || 4;
                const locationType = document.getElementById('locationType').value;
                                
                if (!eventType) {
                    alert('Please select an event type');
                    return;
                }
                                
                if (!locationType) {
                    alert('Please select a location type');
                    return;
                }
                                
                // Calculate costs based on event type
                const eventData = eventTypes[eventType];
                                
                // Location multiplier (urban more expensive, etc.)
                let locationMultiplier = 1;
                if (locationType === 'urban') locationMultiplier = 1.2;
                if (locationType === 'unique') locationMultiplier = 1.3;
                if (locationType === 'suburban') locationMultiplier = 0.9;
                if (locationType === 'outdoor') locationMultiplier = 0.8; // but may need tent, etc.
                                
                // Duration multiplier (non-linear scaling)
                const durationMultiplier = Math.min(2, 1 + (duration / 10));
                                
                // Calculate base cost with adjustments
                const adjustedBase = eventData.base * (guestCount / 100) * locationMultiplier * durationMultiplier;
                                
                // Calculate category costs
                const venueCost = adjustedBase * eventData.venue;
                const cateringCost = adjustedBase * eventData.catering;
                const avCost = adjustedBase * eventData.av;
                const decorCost = adjustedBase * eventData.decor;
                const staffCost = adjustedBase * eventData.staff;
                const marketingCost = adjustedBase * eventData.marketing;
                const miscCost = adjustedBase * 0.05; // Standard 5% contingency
                                
                const totalCost = venueCost + cateringCost + avCost + decorCost + staffCost + marketingCost + miscCost;
                                
                // Update UI with calculated values
                document.getElementById('totalCost').textContent = '$' + Math.round(totalCost).toLocaleString();
                document.getElementById('venueCost').textContent = '$' + Math.round(venueCost).toLocaleString();
                document.getElementById('cateringCost').textContent = '$' + Math.round(cateringCost).toLocaleString();
                document.getElementById('avCost').textContent = '$' + Math.round(avCost).toLocaleString();
                document.getElementById('decorCost').textContent = '$' + Math.round(decorCost).toLocaleString();
                document.getElementById('staffCost').textContent = '$' + Math.round(staffCost).toLocaleString();
                document.getElementById('marketingCost').textContent = '$' + Math.round(marketingCost).toLocaleString();
                document.getElementById('miscCost').textContent = '$' + Math.round(miscCost).toLocaleString();
                                
                // Calculate budget percentage
                const userBudget = parseInt(budgetRange.value);
                const budgetPercentage = Math.min(100, Math.round((totalCost / userBudget) * 100));
                document.getElementById('budgetPercentage').textContent = budgetPercentage + '%';
                document.getElementById('progressBar').style.width = budgetPercentage + '%';
                                
                // Set optimization tips
                const tipsContainer = document.getElementById('optimizationTips');
                tipsContainer.innerHTML = '';
                                
                optimizationTips[eventType].forEach(tip => {
                    const tipElement = document.createElement('div');
                    tipElement.className = 'flex items-start';
                    tipElement.innerHTML = `
                        <div class="bg-indigo-100 p-2 rounded-full mr-3">
                            <i class="fas fa-lightbulb text-indigo-600"></i>
                        </div>
                        <p class="text-sm text-gray-700">${tip}</p>
                    `;
                    tipsContainer.appendChild(tipElement);
                });
                                
                // Show results
                resultsSection.classList.remove('hidden');
                placeholderSection.classList.add('hidden');
            });
                        
            resetBtn.addEventListener('click', function() {
                // Reset form
                document.getElementById('eventType').value = '';
                document.getElementById('guestCount').value = '';
                document.getElementById('duration').value = '';
                document.getElementById('eventDate').value = '';
                document.getElementById('locationType').value = '';
                budgetRange.value = 25000;
                budgetValue.textContent = '$25K';
                                
                // Show placeholder
                resultsSection.classList.add('hidden');
                placeholderSection.classList.remove('hidden');
            });
        });
    </script>