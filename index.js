
// Mobile menu toggle
document.getElementById('mobileMenuButton').addEventListener('click', function() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
});

// Budget range slider
const budgetRange = document.getElementById('budgetRange');
const budgetValue = document.getElementById('budgetValue');

budgetRange.addEventListener('input', function() {
    const value = parseInt(this.value);
    budgetValue.textContent = `$${(value / 1000)}K`;
});

// Calculate button functionality
document.getElementById('calculateBtn').addEventListener('click', function() {
    const eventType = document.getElementById('eventType').value;
    const guestCount = parseInt(document.getElementById('guestCount').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const budget = parseInt(document.getElementById('budgetRange').value) || 25000;
    
    if (!eventType || guestCount <= 0 || duration <= 0) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    // Calculate costs based on inputs (simplified for demo)
    const venueCost = calculateVenueCost(eventType, guestCount, duration);
    const cateringCost = calculateCateringCost(eventType, guestCount);
    const avCost = calculateAVCost(eventType, duration);
    const decorCost = calculateDecorCost(eventType, guestCount);
    const staffCost = calculateStaffCost(guestCount, duration);
    const marketingCost = calculateMarketingCost(eventType, guestCount);
    const miscCost = calculateMiscCost(eventType);
    
    const totalCost = venueCost + cateringCost + avCost + decorCost + staffCost + marketingCost + miscCost;
    
    // Update UI
    document.getElementById('venueCost').textContent = `$${venueCost.toLocaleString()}`;
    document.getElementById('cateringCost').textContent = `$${cateringCost.toLocaleString()}`;
    document.getElementById('avCost').textContent = `$${avCost.toLocaleString()}`;
    document.getElementById('decorCost').textContent = `$${decorCost.toLocaleString()}`;
    document.getElementById('staffCost').textContent = `$${staffCost.toLocaleString()}`;
    document.getElementById('marketingCost').textContent = `$${marketingCost.toLocaleString()}`;
    document.getElementById('miscCost').textContent = `$${miscCost.toLocaleString()}`;
    document.getElementById('totalCost').textContent = `$${totalCost.toLocaleString()}`;
    
    const budgetPercentage = Math.min(100, Math.round((totalCost / budget) * 100));
    document.getElementById('budgetPercentage').textContent = `${budgetPercentage}%`;
    document.getElementById('progressBar').style.width = `${budgetPercentage}%`;
    
    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('placeholderSection').classList.add('hidden');
    
    // Generate optimization tips
    generateOptimizationTips(eventType, guestCount, duration, budget, totalCost);
});

// Reset button functionality
document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('placeholderSection').classList.remove('hidden');
});

// Calculation functions (simplified for demo)
function calculateVenueCost(eventType, guests, duration) {
    let base = 0;
    switch(eventType) {
        case 'wedding': base = 5000; break;
        case 'corporate': base = 4000; break;
        case 'conference': base = 4500; break;
        case 'birthday': base = 1500; break;
        case 'charity': base = 6000; break;
        case 'trade': base = 7000; break;
        default: base = 3000;
    }
    return base + (guests * 15) + (duration * 100);
}

function calculateCateringCost(eventType, guests) {
    let perPerson = 0;
    switch(eventType) {
        case 'wedding': perPerson = 85; break;
        case 'corporate': perPerson = 55; break;
        case 'conference': perPerson = 45; break;
        case 'birthday': perPerson = 35; break;
        case 'charity': perPerson = 95; break;
        case 'trade': perPerson = 65; break;
        default: perPerson = 40;
    }
    return guests * perPerson;
}

function calculateAVCost(eventType, duration) {
    let base = 0;
    switch(eventType) {
        case 'wedding': base = 1200; break;
        case 'corporate': base = 2500; break;
        case 'conference': base = 3500; break;
        case 'birthday': base = 500; break;
        case 'charity': base = 1800; break;
        case 'trade': base = 4200; break;
        default: base = 1500;
    }
    return base + (duration * 100);
}

function calculateDecorCost(eventType, guests) {
    let base = 0;
    switch(eventType) {
        case 'wedding': base = 2500; break;
        case 'corporate': base = 1200; break;
        case 'conference': base = 800; break;
        case 'birthday': base = 600; break;
        case 'charity': base = 3500; break;
        case 'trade': base = 2800; break;
        default: base = 1000;
    }
    return base + (guests * 5);
}

function calculateStaffCost(guests, duration) {
    const staffCount = Math.ceil(guests / 25);
    return staffCount * duration * 35;
}

function calculateMarketingCost(eventType, guests) {
    let base = 0;
    switch(eventType) {
        case 'wedding': base = 500; break;
        case 'corporate': base = 800; break;
        case 'conference': base = 1200; break;
        case 'birthday': base = 100; break;
        case 'charity': base = 1500; break;
        case 'trade': base = 2000; break;
        default: base = 300;
    }
    return base + (guests * 2);
}

function calculateMiscCost(eventType) {
    switch(eventType) {
        case 'wedding': return 1200;
        case 'corporate': return 800;
        case 'conference': return 1000;
        case 'birthday': return 300;
        case 'charity': return 1500;
        case 'trade': return 1800;
        default: return 500;
    }
}

function generateOptimizationTips(eventType, guests, duration, budget, totalCost) {
    const tipsContainer = document.getElementById('optimizationTips');
    tipsContainer.innerHTML = '';
    
    // Clear previous tips
    while (tipsContainer.firstChild) {
        tipsContainer.removeChild(tipsContainer.firstChild);
    }
    
    // Add general tips
    addTip(tipsContainer, "Consider reducing your guest count by 10% to save approximately $" + Math.round(calculateCateringCost(eventType, guests * 0.1)) + " on catering alone.");
    
    if (totalCost > budget) {
        const overBudget = totalCost - budget;
        addTip(tipsContainer, `You're currently $${overBudget.toLocaleString()} over budget. Consider these cost-saving measures:`);
        
        if (eventType === 'wedding') {
            addTip(tipsContainer, "Choose seasonal flowers for your decor to save 25-30% on floral arrangements.");
            addTip(tipsContainer, "Consider a brunch or lunch reception instead of dinner to reduce catering costs by 20-25%.");
        }
        
        if (guests > 100) {
            addTip(tipsContainer, "For events with 100+ guests, buffet service is typically 15-20% cheaper than plated meals.");
        }
        
        if (duration > 5) {
            addTip(tipsContainer, "Reducing your event duration by 1 hour could save approximately $" + Math.round(calculateStaffCost(guests, 1)) + " in staffing costs.");
        }
    } else {
        const underBudget = budget - totalCost;
        addTip(tipsContainer, `You're currently $${underBudget.toLocaleString()} under budget. Consider these upgrades:`);
        
        if (eventType === 'wedding' || eventType === 'charity') {
            addTip(tipsContainer, "Upgrade your photography package for better coverage and more edited images.");
        }
        
        if (eventType === 'corporate' || eventType === 'conference') {
            addTip(tipsContainer, "Consider adding a coffee bar or dessert station to enhance attendee experience.");
        }
    }
    
    // Add event-specific tips
    switch(eventType) {
        case 'wedding':
            addTip(tipsContainer, "Friday or Sunday weddings can save 15-25% on venue costs compared to Saturday.");
            addTip(tipsContainer, "Digital save-the-dates and RSVPs can save hundreds on printing and postage.");
            break;
        case 'corporate':
            addTip(tipsContainer, "Morning events typically have lower catering costs than lunch or dinner events.");
            addTip(tipsContainer, "Consider co-branding with another company to share costs for larger venues.");
            break;
        case 'conference':
            addTip(tipsContainer, "Early bird registration discounts can improve cash flow and reduce marketing costs.");
            addTip(tipsContainer, "Virtual or hybrid options can reduce venue and catering expenses significantly.");
            break;
        case 'birthday':
            addTip(tipsContainer, "Home venues can save thousands compared to rented spaces.");
            addTip(tipsContainer, "DIY decor projects can personalize your event while saving money.");
            break;
    }
}

function addTip(container, text) {
    const tipDiv = document.createElement('div');
    tipDiv.className = 'flex items-start';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'bg-indigo-100 p-2 rounded-full mr-3';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-lightbulb text-indigo-600';
    
    iconDiv.appendChild(icon);
    tipDiv.appendChild(iconDiv);
    
    const textP = document.createElement('p');
    textP.className = 'text-sm text-gray-700';
    textP.textContent = text;
    
    tipDiv.appendChild(textP);
    container.appendChild(tipDiv);
}

// Download functionality
document.getElementById('downloadPngBtn').addEventListener('click', function() {
    const element = document.getElementById('resultsSection');
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'event-budget.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('resultsSection');
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('event-budget.pdf');
    });
});

document.getElementById('downloadExcelBtn').addEventListener('click', function() {
    // Get all the data from the budget breakdown
    const eventType = document.getElementById('eventType').value || 'Not specified';
    const guestCount = document.getElementById('guestCount').value || '0';
    const duration = document.getElementById('duration').value || '0';
    const totalCost = document.getElementById('totalCost').textContent || '$0';
    
    const venueCost = document.getElementById('venueCost').textContent || '$0';
    const cateringCost = document.getElementById('cateringCost').textContent || '$0';
    const avCost = document.getElementById('avCost').textContent || '$0';
    const decorCost = document.getElementById('decorCost').textContent || '$0';
    const staffCost = document.getElementById('staffCost').textContent || '$0';
    const marketingCost = document.getElementById('marketingCost').textContent || '$0';
    const miscCost = document.getElementById('miscCost').textContent || '$0';
    
    // Create a worksheet
    const wsData = [
        ['Event Budget Breakdown'],
        [''],
        ['Event Type', eventType],
        ['Guest Count', guestCount],
        ['Duration (hours)', duration],
        ['Total Estimated Cost', totalCost],
        [''],
        ['Category', 'Cost'],
        ['Venue Rental', venueCost],
        ['Food & Beverage', cateringCost],
        ['AV & Technology', avCost],
        ['Decor & Floral', decorCost],
        ['Staffing', staffCost],
        ['Marketing & Invitations', marketingCost],
        ['Miscellaneous', miscCost]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Budget");
    
    // Generate Excel file and download
    XLSX.writeFile(wb, "event-budget.xlsx");
});

// Budget Comparison Tool
document.getElementById('customComparisonBtn').addEventListener('click', function() {
    document.getElementById('comparisonModal').style.display = 'flex';
});

document.getElementById('closeComparisonModal').addEventListener('click', function() {
    document.getElementById('comparisonModal').style.display = 'none';
});

document.getElementById('generateComparisonBtn').addEventListener('click', function() {
    // Get all input values
    const comparisonName = document.getElementById('comparisonName').value || 'Budget Comparison';
    const option1Name = document.getElementById('option1Name').value || 'Option 1';
    const option2Name = document.getElementById('option2Name').value || 'Option 2';
    
    const option1Venue = parseFloat(document.getElementById('option1Venue').value) || 0;
    const option1Catering = parseFloat(document.getElementById('option1Catering').value) || 0;
    const option1Entertainment = parseFloat(document.getElementById('option1Entertainment').value) || 0;
    const option1Decor = parseFloat(document.getElementById('option1Decor').value) || 0;
    const option1Staffing = parseFloat(document.getElementById('option1Staffing').value) || 0;
    
    const option2Venue = parseFloat(document.getElementById('option2Venue').value) || 0;
    const option2Catering = parseFloat(document.getElementById('option2Catering').value) || 0;
    const option2Entertainment = parseFloat(document.getElementById('option2Entertainment').value) || 0;
    const option2Decor = parseFloat(document.getElementById('option2Decor').value) || 0;
    const option2Staffing = parseFloat(document.getElementById('option2Staffing').value) || 0;
    
    // Calculate totals
    const option1Total = option1Venue + option1Catering + option1Entertainment + option1Decor + option1Staffing;
    const option2Total = option2Venue + option2Catering + option2Entertainment + option2Decor + option2Staffing;
    
    // Calculate savings
    const savingsAmount = Math.abs(option1Total - option2Total);
    const savingsPercentage = Math.round((savingsAmount / Math.max(option1Total, option2Total)) * 100);
    
    // Update results UI
    document.getElementById('comparisonResultsTitle').textContent = comparisonName;
    document.getElementById('option1ResultsTitle').textContent = option1Name;
    document.getElementById('option2ResultsTitle').textContent = option2Name;
    
    document.getElementById('option1VenueResult').textContent = `$${option1Venue.toLocaleString()}`;
    document.getElementById('option1CateringResult').textContent = `$${option1Catering.toLocaleString()}`;
    document.getElementById('option1EntertainmentResult').textContent = `$${option1Entertainment.toLocaleString()}`;
    document.getElementById('option1DecorResult').textContent = `$${option1Decor.toLocaleString()}`;
    document.getElementById('option1StaffingResult').textContent = `$${option1Staffing.toLocaleString()}`;
    document.getElementById('option1TotalResult').textContent = `$${option1Total.toLocaleString()}`;
    
    document.getElementById('option2VenueResult').textContent = `$${option2Venue.toLocaleString()}`;
    document.getElementById('option2CateringResult').textContent = `$${option2Catering.toLocaleString()}`;
    document.getElementById('option2EntertainmentResult').textContent = `$${option2Entertainment.toLocaleString()}`;
    document.getElementById('option2DecorResult').textContent = `$${option2Decor.toLocaleString()}`;
    document.getElementById('option2StaffingResult').textContent = `$${option2Staffing.toLocaleString()}`;
    document.getElementById('option2TotalResult').textContent = `$${option2Total.toLocaleString()}`;
    
    if (option1Total > option2Total) {
        document.getElementById('savingsAnalysis').innerHTML = 
            `${option2Name} saves you <span id="savingsAmount" class="font-bold">$${savingsAmount.toLocaleString()}</span> compared to ${option1Name}, which is a <span id="savingsPercentage" class="font-bold">${savingsPercentage}%</span> reduction in costs.`;
    } else if (option2Total > option1Total) {
        document.getElementById('savingsAnalysis').innerHTML = 
            `${option1Name} saves you <span id="savingsAmount" class="font-bold">$${savingsAmount.toLocaleString()}</span> compared to ${option2Name}, which is a <span id="savingsPercentage" class="font-bold">${savingsPercentage}%</span> reduction in costs.`;
    } else {
        document.getElementById('savingsAnalysis').textContent = 'Both options have the same total cost.';
    }
    
    // Show results and hide modal
    document.getElementById('comparisonModal').style.display = 'none';
    document.getElementById('comparisonResults').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('comparisonResults').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('newComparisonBtn').addEventListener('click', function() {
    document.getElementById('comparisonResults').classList.add('hidden');
    document.getElementById('comparisonModal').style.display = 'flex';
});

document.getElementById('downloadComparisonPdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('comparisonResults');
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('budget-comparison.pdf');
    });
});
