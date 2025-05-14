         // Initialize the application when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // State management
            const state = {
                currentBudget: null,
                categories: [],
                expenses: [],
                budgets: [],
                googleAuth: {
                    isConnected: false,
                    spreadsheetId: null,
                    spreadsheetName: 'Event Budget Tracker'
                }
            };

            // DOM elements
            const elements = {
                newBudgetBtn: document.getElementById('newBudgetBtn'),
                addExpenseBtn: document.getElementById('addExpenseBtn'),
                addCategoryBtn: document.getElementById('addCategoryBtn'),
                exportPdfBtn: document.getElementById('exportPdfBtn'),
                exportExcelBtn: document.getElementById('exportExcelBtn'),
                importDataBtn: document.getElementById('importDataBtn'),
                clearDataBtn: document.getElementById('clearDataBtn'),
                connectGoogleBtn: document.getElementById('connectGoogleBtn'),
                syncToGoogleBtn: document.getElementById('syncToGoogleBtn'),
                syncFromGoogleBtn: document.getElementById('syncFromGoogleBtn'),
                syncControls: document.getElementById('syncControls'),
                newBudgetModal: document.getElementById('newBudgetModal'),
                addCategoryModal: document.getElementById('addCategoryModal'),
                addExpenseModal: document.getElementById('addExpenseModal'),
                clearDataModal: document.getElementById('clearDataModal'),
                importDataModal: document.getElementById('importDataModal'),
                googleSheetsModal: document.getElementById('googleSheetsModal'),
                closeBudgetModal: document.getElementById('closeBudgetModal'),
                closeCategoryModal: document.getElementById('closeCategoryModal'),
                closeExpenseModal: document.getElementById('closeExpenseModal'),
                closeClearDataModal: document.getElementById('closeClearDataModal'),
                closeImportDataModal: document.getElementById('closeImportDataModal'),
                closeGoogleSheetsModal: document.getElementById('closeGoogleSheetsModal'),
                cancelClearData: document.getElementById('cancelClearData'),
                confirmClearData: document.getElementById('confirmClearData'),
                cancelImportData: document.getElementById('cancelImportData'),
                confirmImportData: document.getElementById('confirmImportData'),
                connectGoogleBtnModal: document.getElementById('connectGoogleBtnModal'),
                disconnectGoogleBtn: document.getElementById('disconnectGoogleBtn'),
                googleAuthStatusText: document.getElementById('googleAuthStatusText'),
                googleAuthStatus: document.getElementById('googleAuthStatus'),
                googleSheetControls: document.getElementById('googleSheetControls'),
                googleSheetName: document.getElementById('googleSheetName'),
                googleSheetId: document.getElementById('googleSheetId'),
                budgetForm: document.getElementById('budgetForm'),
                categoryForm: document.getElementById('categoryForm'),
                expenseForm: document.getElementById('expenseForm'),
                categoryTableBody: document.getElementById('categoryTableBody'),
                transactionsTableBody: document.getElementById('transactionsTableBody'),
                totalBudget: document.getElementById('totalBudget'),
                totalSpent: document.getElementById('totalSpent'),
                remainingBudget: document.getElementById('remainingBudget'),
                budgetProgress: document.getElementById('budgetProgress'),
                progressPercentage: document.getElementById('progressPercentage'),
                expenseCategory: document.getElementById('expenseCategory'),
                timeFilter: document.getElementById('timeFilter'),
                notificationContainer: document.getElementById('notificationContainer'),
                expenseChart: document.getElementById('expenseChart'),
                fileInput: document.getElementById('fileInput'),
                fileInfo: document.getElementById('fileInfo'),
                fileName: document.getElementById('fileName'),
                viewAllBtn: document.getElementById('viewAllBtn')
            };

            // Chart instance
            let expenseChart = null;
            let selectedFile = null;
            let googleAuthInstance = null;

            // Event listeners
            elements.newBudgetBtn.addEventListener('click', showNewBudgetModal);
            elements.addExpenseBtn.addEventListener('click', showAddExpenseModal);
            elements.addCategoryBtn.addEventListener('click', showAddCategoryModal);
            elements.exportPdfBtn.addEventListener('click', exportToPdf);
            elements.exportExcelBtn.addEventListener('click', exportToExcel);
            elements.importDataBtn.addEventListener('click', showImportDataModal);
            elements.clearDataBtn.addEventListener('click', showClearDataModal);
            elements.connectGoogleBtn.addEventListener('click', showGoogleSheetsModal);
            elements.syncToGoogleBtn.addEventListener('click', syncToGoogleSheets);
            elements.syncFromGoogleBtn.addEventListener('click', syncFromGoogleSheets);
            elements.closeBudgetModal.addEventListener('click', () => elements.newBudgetModal.classList.add('hidden'));
            elements.closeCategoryModal.addEventListener('click', () => elements.addCategoryModal.classList.add('hidden'));
            elements.closeExpenseModal.addEventListener('click', () => elements.addExpenseModal.classList.add('hidden'));
            elements.closeClearDataModal.addEventListener('click', () => elements.clearDataModal.classList.add('hidden'));
            elements.closeImportDataModal.addEventListener('click', () => elements.importDataModal.classList.add('hidden'));
            elements.closeGoogleSheetsModal.addEventListener('click', () => elements.googleSheetsModal.classList.add('hidden'));
            elements.cancelClearData.addEventListener('click', () => elements.clearDataModal.classList.add('hidden'));
            elements.cancelImportData.addEventListener('click', () => elements.importDataModal.classList.add('hidden'));
            elements.connectGoogleBtnModal.addEventListener('click', handleGoogleAuth);
            elements.disconnectGoogleBtn.addEventListener('click', disconnectGoogle);
            elements.confirmClearData.addEventListener('click', clearAllData);
            elements.confirmImportData.addEventListener('click', importData);
            elements.budgetForm.addEventListener('submit', handleBudgetSubmit);
            elements.categoryForm.addEventListener('submit', handleCategorySubmit);
            elements.expenseForm.addEventListener('submit', handleExpenseSubmit);
            elements.timeFilter.addEventListener('change', updateUI);
            elements.fileInput.addEventListener('change', handleFileSelect);
            elements.viewAllBtn.addEventListener('click', () => {
                elements.timeFilter.value = 'all';
                updateUI();
            });

            // Set default date for expense and budget forms
            function setDefaultDates() {
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('expenseDate').value = today;
                document.getElementById('eventDate').value = today;
            }

            // Load data from localStorage if available
            function loadData() {
                const savedData = localStorage.getItem('eventBudgetTracker');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    state.currentBudget = parsedData.currentBudget;
                    state.categories = parsedData.categories || [];
                    state.expenses = parsedData.expenses || [];
                    state.budgets = parsedData.budgets || [];
                    state.googleAuth = parsedData.googleAuth || {
                        isConnected: false,
                        spreadsheetId: null,
                        spreadsheetName: 'Event Budget Tracker'
                    };
                    
                    // Update UI for Google connection status
                    if (state.googleAuth.isConnected) {
                        elements.connectGoogleBtn.innerHTML = '<i class="fab fa-google mr-2"></i>Google Sheets Connected';
                        elements.connectGoogleBtn.classList.remove('google-btn');
                        elements.connectGoogleBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                        elements.syncControls.classList.remove('hidden');
                    }
                }
            }

            // Initialize UI
            loadData();
            updateUI();
            setDefaultDates();

            // Initialize Google API client
            function onGAPILoad() {
                gapi.load('client:auth2', () => {
                    gapi.client.init({
                        apiKey: 'AIzaSyD9vxQz5q3J1J4J4J4J4J4J4J4J4J4J4', // Replace with your API key
                        clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your client ID
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                        scope: 'https://www.googleapis.com/auth/spreadsheets'
                    }).then(() => {
                        googleAuthInstance = gapi.auth2.getAuthInstance();
                        
                        // Listen for sign-in state changes
                        googleAuthInstance.isSignedIn.listen(updateGoogleSigninStatus);
                        
                        // Handle initial sign-in state
                        updateGoogleSigninStatus(googleAuthInstance.isSignedIn.get());
                    }).catch(error => {
                        console.error('Error initializing Google API client:', error);
                        showNotification('Failed to initialize Google Sheets integration', 'error');
                    });
                });
            }

            // Update Google sign-in status
            function updateGoogleSigninStatus(isSignedIn) {
                state.googleAuth.isConnected = isSignedIn;
                
                if (isSignedIn) {
                    // User is signed in
                    elements.googleAuthStatusText.textContent = 'Connected';
                    elements.googleAuthStatus.classList.remove('bg-gray-100');
                    elements.googleAuthStatus.classList.add('bg-green-100');
                    elements.connectGoogleBtnModal.classList.add('hidden');
                    elements.disconnectGoogleBtn.classList.remove('hidden');
                    elements.googleSheetControls.classList.remove('hidden');
                    elements.syncControls.classList.remove('hidden');
                    
                    // Update the main button
                    elements.connectGoogleBtn.innerHTML = '<i class="fab fa-google mr-2"></i>Google Sheets Connected';
                    elements.connectGoogleBtn.classList.remove('google-btn');
                    elements.connectGoogleBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    
                    // Get user info
                    const profile = googleAuthInstance.currentUser.get().getBasicProfile();
                    showNotification(`Connected to Google Sheets as ${profile.getName()}`, 'success');
                } else {
                    // User is signed out
                    elements.googleAuthStatusText.textContent = 'Not connected';
                    elements.googleAuthStatus.classList.remove('bg-green-100');
                    elements.googleAuthStatus.classList.add('bg-gray-100');
                    elements.connectGoogleBtnModal.classList.remove('hidden');
                    elements.disconnectGoogleBtn.classList.add('hidden');
                    elements.googleSheetControls.classList.add('hidden');
                    elements.syncControls.classList.add('hidden');
                    
                    // Update the main button
                    elements.connectGoogleBtn.innerHTML = '<i class="fab fa-google mr-2"></i>Connect Google Sheets';
                    elements.connectGoogleBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    elements.connectGoogleBtn.classList.add('google-btn');
                }
                
                saveData();
            }

            // Handle Google authentication
            function handleGoogleAuth() {
                if (state.googleAuth.isConnected) {
                    return;
                }
                
                googleAuthInstance.signIn().then(() => {
                    // Update UI will be handled by the listener
                }).catch(error => {
                    console.error('Error signing in:', error);
                    showNotification('Failed to sign in to Google', 'error');
                });
            }

            // Disconnect Google account
            function disconnectGoogle() {
                googleAuthInstance.signOut().then(() => {
                    // Update UI will be handled by the listener
                    state.googleAuth.spreadsheetId = null;
                    saveData();
                }).catch(error => {
                    console.error('Error signing out:', error);
                    showNotification('Failed to disconnect Google account', 'error');
                });
            }

            // Sync data to Google Sheets
            function syncToGoogleSheets() {
                if (!state.googleAuth.isConnected) {
                    showNotification('Please connect to Google Sheets first', 'error');
                    return;
                }
                
                if (!state.currentBudget) {
                    showNotification('No budget data to sync', 'error');
                    return;
                }
                
                showNotification('Syncing data to Google Sheets...', 'info');
                
                const spreadsheetName = elements.googleSheetName.value || state.googleAuth.spreadsheetName;
                const spreadsheetId = elements.googleSheetId.value || state.googleAuth.spreadsheetId;
                
                // Prepare data for Google Sheets
                const budgetData = [
                    ['Budget Name', 'Total Amount', 'Event Date', 'Created At'],
                    [state.currentBudget.name, state.currentBudget.totalAmount, state.currentBudget.eventDate, state.currentBudget.createdAt]
                ];
                
                const categoriesData = [
                    ['Category ID', 'Name', 'Budget', 'Spent']
                ];
                
                state.categories.forEach(category => {
                    categoriesData.push([
                        category.id, 
                        category.name, 
                        category.budget, 
                        category.spent
                    ]);
                });
                
                const expensesData = [
                    ['Expense ID', 'Date', 'Category ID', 'Category Name', 'Description', 'Amount', 'Created At']
                ];
                
                state.expenses.forEach(expense => {
                    expensesData.push([
                        expense.id,
                        expense.date,
                        expense.categoryId,
                        expense.categoryName,
                        expense.description,
                        expense.amount,
                        expense.createdAt
                    ]);
                });
                
                // Create or update spreadsheet
                if (spreadsheetId) {
                    // Update existing spreadsheet
                    updateSpreadsheet(spreadsheetId, spreadsheetName, budgetData, categoriesData, expensesData);
                } else {
                    // Create new spreadsheet
                    createSpreadsheet(spreadsheetName, budgetData, categoriesData, expensesData);
                }
            }

            // Create new spreadsheet
            function createSpreadsheet(name, budgetData, categoriesData, expensesData) {
                gapi.client.sheets.spreadsheets.create({
                    properties: {
                        title: name
                    }
                }).then(response => {
                    const spreadsheetId = response.result.spreadsheetId;
                    state.googleAuth.spreadsheetId = spreadsheetId;
                    state.googleAuth.spreadsheetName = name;
                    saveData();
                    
                    // Update the spreadsheet with our data
                    return updateSpreadsheet(spreadsheetId, name, budgetData, categoriesData, expensesData);
                }).then(() => {
                    showNotification('Spreadsheet created and data synced successfully!', 'success');
                    elements.googleSheetId.value = state.googleAuth.spreadsheetId;
                }).catch(error => {
                    console.error('Error creating spreadsheet:', error);
                    showNotification('Failed to create spreadsheet', 'error');
                });
            }

            // Update existing spreadsheet
            function updateSpreadsheet(spreadsheetId, name, budgetData, categoriesData, expensesData) {
                const requests = [
                    // Clear existing data
                    {
                        updateCells: {
                            range: {
                                sheetId: 0
                            },
                            fields: '*'
                        }
                    },
                    // Add budget data to first sheet
                    {
                        updateCells: {
                            start: {
                                sheetId: 0,
                                rowIndex: 0,
                                columnIndex: 0
                            },
                            rows: budgetData.map(row => ({
                                values: row.map(cell => ({
                                    userEnteredValue: {
                                        stringValue: typeof cell === 'string' ? cell : cell.toString()
                                    }
                                }))
                            })),
                            fields: '*'
                        }
                    },
                    // Add categories data to second sheet (create if doesn't exist)
                    {
                        addSheet: {
                            properties: {
                                title: 'Categories'
                            }
                        }
                    },
                    {
                        updateCells: {
                            start: {
                                sheetId: 1,
                                rowIndex: 0,
                                columnIndex: 0
                            },
                            rows: categoriesData.map(row => ({
                                values: row.map(cell => ({
                                    userEnteredValue: {
                                        stringValue: typeof cell === 'string' ? cell : cell.toString()
                                    }
                                }))
                            })),
                            fields: '*'
                        }
                    },
                    // Add expenses data to third sheet (create if doesn't exist)
                    {
                        addSheet: {
                            properties: {
                                title: 'Expenses'
                            }
                        }
                    },
                    {
                        updateCells: {
                            start: {
                                sheetId: 2,
                                rowIndex: 0,
                                columnIndex: 0
                            },
                            rows: expensesData.map(row => ({
                                values: row.map(cell => ({
                                    userEnteredValue: {
                                        stringValue: typeof cell === 'string' ? cell : cell.toString()
                                    }
                                }))
                            })),
                            fields: '*'
                        }
                    }
                ];
                
                return gapi.client.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: spreadsheetId,
                    resource: {
                        requests: requests
                    }
                }).then(response => {
                    state.googleAuth.spreadsheetId = spreadsheetId;
                    state.googleAuth.spreadsheetName = name;
                    saveData();
                    return response;
                });
            }

            // Sync data from Google Sheets
            function syncFromGoogleSheets() {
                if (!state.googleAuth.isConnected) {
                    showNotification('Please connect to Google Sheets first', 'error');
                    return;
                }
                
                if (!state.googleAuth.spreadsheetId) {
                    showNotification('No spreadsheet selected', 'error');
                    return;
                }
                
                showNotification('Syncing data from Google Sheets...', 'info');
                
                // Get data from all sheets
                gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: state.googleAuth.spreadsheetId,
                    includeGridData: true
                }).then(response => {
                    const sheets = response.result.sheets;
                    let budgetData = [];
                    let categoriesData = [];
                    let expensesData = [];
                    
                    // Extract data from each sheet
                    sheets.forEach(sheet => {
                        const sheetTitle = sheet.properties.title;
                        const rows = sheet.data[0].rowData || [];
                        
                        if (sheetTitle === 'Sheet1') {
                            // Budget data
                            budgetData = rows.slice(1).map(row => {
                                return {
                                    id: row.values[0]?.userEnteredValue?.stringValue || Date.now().toString(),
                                    name: row.values[1]?.userEnteredValue?.stringValue || '',
                                    totalAmount: parseFloat(row.values[2]?.userEnteredValue?.stringValue) || 0,
                                    eventDate: row.values[3]?.userEnteredValue?.stringValue || new Date().toISOString().split('T')[0],
                                    createdAt: row.values[4]?.userEnteredValue?.stringValue || new Date().toISOString()
                                };
                            });
                        } else if (sheetTitle === 'Categories') {
                            // Categories data
                            categoriesData = rows.slice(1).map(row => {
                                return {
                                    id: row.values[0]?.userEnteredValue?.stringValue || Date.now().toString(),
                                    name: row.values[1]?.userEnteredValue?.stringValue || '',
                                    budget: parseFloat(row.values[2]?.userEnteredValue?.stringValue) || 0,
                                    spent: parseFloat(row.values[3]?.userEnteredValue?.stringValue) || 0
                                };
                            });
                        } else if (sheetTitle === 'Expenses') {
                            // Expenses data
                            expensesData = rows.slice(1).map(row => {
                                return {
                                    id: row.values[0]?.userEnteredValue?.stringValue || Date.now().toString(),
                                    date: row.values[1]?.userEnteredValue?.stringValue || new Date().toISOString().split('T')[0],
                                    categoryId: row.values[2]?.userEnteredValue?.stringValue || '',
                                    categoryName: row.values[3]?.userEnteredValue?.stringValue || '',
                                    description: row.values[4]?.userEnteredValue?.stringValue || '',
                                    amount: parseFloat(row.values[5]?.userEnteredValue?.stringValue) || 0,
                                    createdAt: row.values[6]?.userEnteredValue?.stringValue || new Date().toISOString()
                                };
                            });
                        }
                    });
                    
                    // Validate data
                    if (budgetData.length === 0 || categoriesData.length === 0) {
                        throw new Error('Invalid data format in spreadsheet');
                    }
                    
                    // Ask for confirmation before overwriting
                    if (!confirm('This will overwrite your current budget data. Continue?')) {
                        return;
                    }
                    
                    // Update state with imported data
                    state.currentBudget = budgetData[0];
                    state.categories = categoriesData;
                    state.expenses = expensesData;
                    
                    saveData();
                    updateUI();
                    
                    showNotification('Data synced from Google Sheets successfully!', 'success');
                }).catch(error => {
                    console.error('Error syncing from Google Sheets:', error);
                    showNotification('Failed to sync data from Google Sheets', 'error');
                });
            }

            // Show Google Sheets modal
            function showGoogleSheetsModal() {
                elements.googleSheetsModal.classList.remove('hidden');
                
                // Set default spreadsheet name
                if (state.currentBudget) {
                    elements.googleSheetName.value = `${state.currentBudget.name} Budget`;
                } else {
                    elements.googleSheetName.value = 'Event Budget Tracker';
                }
                
                // Set spreadsheet ID if we have one
                if (state.googleAuth.spreadsheetId) {
                    elements.googleSheetId.value = state.googleAuth.spreadsheetId;
                } else {
                    elements.googleSheetId.value = '';
                }
            }

            // Modal functions
            function showNewBudgetModal() {
                elements.newBudgetModal.classList.remove('hidden');
            }

            function showAddCategoryModal() {
                if (!state.currentBudget) {
                    showNotification('Please create a budget first', 'error');
                    return;
                }
                elements.addCategoryModal.classList.remove('hidden');
            }

            function showAddExpenseModal() {
                if (!state.currentBudget) {
                    showNotification('Please create a budget first', 'error');
                    return;
                }
                if (state.categories.length === 0) {
                    showNotification('Please add at least one category first', 'error');
                    return;
                }
                
                // Populate category dropdown
                elements.expenseCategory.innerHTML = '<option value="">Select a category</option>';
                state.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    elements.expenseCategory.appendChild(option);
                });
                
                // Set default date to today
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('expenseDate').value = today;
                
                elements.addExpenseModal.classList.remove('hidden');
            }

            function showClearDataModal() {
                if (!state.currentBudget && state.categories.length === 0 && state.expenses.length === 0) {
                    showNotification('No data to clear', 'info');
                    return;
                }
                elements.clearDataModal.classList.remove('hidden');
            }

            function showImportDataModal() {
                elements.importDataModal.classList.remove('hidden');
                elements.fileInfo.classList.add('hidden');
                elements.confirmImportData.disabled = true;
                elements.fileInput.value = '';
                selectedFile = null;
            }

            function handleFileSelect(e) {
                const file = e.target.files[0];
                if (!file) return;

                selectedFile = file;
                elements.fileName.textContent = file.name;
                elements.fileInfo.classList.remove('hidden');
                elements.confirmImportData.disabled = false;
            }

            // Form handlers
            function handleBudgetSubmit(e) {
                e.preventDefault();
                
                const name = document.getElementById('budgetName').value.trim();
                const amount = parseFloat(document.getElementById('totalBudgetAmount').value);
                const eventDate = document.getElementById('eventDate').value;
                
                if (!name || isNaN(amount) || amount <= 0 || !eventDate) {
                    showNotification('Please fill all fields with valid values', 'error');
                    return;
                }
                
                const newBudget = {
                    id: Date.now().toString(),
                    name,
                    totalAmount: amount,
                    eventDate,
                    createdAt: new Date().toISOString()
                };
                
                state.currentBudget = newBudget;
                state.budgets.push(newBudget);
                state.categories = [];
                state.expenses = [];
                
                saveData();
                elements.newBudgetModal.classList.add('hidden');
                elements.budgetForm.reset();
                setDefaultDates();
                
                showNotification('Budget created successfully! Now add some categories.', 'success');
                updateUI();
                
                // Show add category modal after a short delay
                setTimeout(showAddCategoryModal, 1000);
            }

            function handleCategorySubmit(e) {
                e.preventDefault();
                
                const name = document.getElementById('categoryName').value.trim();
                const budget = parseFloat(document.getElementById('categoryBudget').value);
                
                if (!name || isNaN(budget) || budget <= 0) {
                    showNotification('Please fill all fields with valid values', 'error');
                    return;
                }
                
                // Check if category already exists
                if (state.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
                    showNotification('Category with this name already exists', 'error');
                    return;
                }
                
                const newCategory = {
                    id: Date.now().toString(),
                    name,
                    budget,
                    spent: 0
                };
                
                state.categories.push(newCategory);
                saveData();
                elements.addCategoryModal.classList.add('hidden');
                elements.categoryForm.reset();
                
                showNotification('Category added successfully!', 'success');
                updateUI();
            }

            function handleExpenseSubmit(e) {
                e.preventDefault();
                
                const date = document.getElementById('expenseDate').value;
                const categoryId = document.getElementById('expenseCategory').value;
                const description = document.getElementById('expenseDescription').value.trim();
                const amount = parseFloat(document.getElementById('expenseAmount').value);
                
                if (!date || !categoryId || !description || isNaN(amount) || amount <= 0) {
                    showNotification('Please fill all fields with valid values', 'error');
                    return;
                }
                
                const category = state.categories.find(cat => cat.id === categoryId);
                if (!category) {
                    showNotification('Selected category not found', 'error');
                    return;
                }
                
                // Check if expense exceeds category budget
                if ((category.spent + amount) > category.budget) {
                    showNotification(`Warning: This expense will exceed the ${category.name} budget!`, 'warning');
                }
                
                const newExpense = {
                    id: Date.now().toString(),
                    date,
                    categoryId,
                    categoryName: category.name,
                    description,
                    amount,
                    createdAt: new Date().toISOString()
                };
                
                state.expenses.push(newExpense);
                
                // Update category spent amount
                category.spent += amount;
                
                saveData();
                elements.addExpenseModal.classList.add('hidden');
                elements.expenseForm.reset();
                setDefaultDates();
                
                showNotification('Expense recorded successfully!', 'success');
                updateUI();
            }

            // Data management functions
            function clearAllData() {
                state.currentBudget = null;
                state.categories = [];
                state.expenses = [];
                state.budgets = [];
                
                saveData();
                elements.clearDataModal.classList.add('hidden');
                
                showNotification('All data has been cleared', 'success');
                updateUI();
            }

            function importData() {
                if (!selectedFile) {
                    showNotification('No file selected', 'error');
                    return;
                }

                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        let importedData;
                        
                        if (selectedFile.name.endsWith('.json')) {
                            importedData = JSON.parse(e.target.result);
                        } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                            // Parse Excel file
                            const workbook = XLSX.read(e.target.result, { type: 'array' });
                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                            importedData = XLSX.utils.sheet_to_json(firstSheet);
                            
                            // Convert Excel data to our format
                            // This is a simplified conversion - you might need to adjust based on your Excel structure
                            if (Array.isArray(importedData)) {
                                const convertedData = {
                                    currentBudget: importedData.find(item => item.type === 'budget'),
                                    categories: importedData.filter(item => item.type === 'category'),
                                    expenses: importedData.filter(item => item.type === 'expense'),
                                    budgets: importedData.filter(item => item.type === 'budget')
                                };
                                importedData = convertedData;
                            }
                        }
                        
                        // Validate imported data
                        if (!importedData || 
                            (!importedData.currentBudget && 
                             (!importedData.categories || importedData.categories.length === 0) && 
                             (!importedData.expenses || importedData.expenses.length === 0))) {
                            showNotification('Invalid data format in the file', 'error');
                            return;
                        }
                        
                        // Ask for confirmation before overwriting
                        if (!confirm('This will overwrite your current budget data. Continue?')) {
                            return;
                        }
                        
                        // Update state with imported data
                        state.currentBudget = importedData.currentBudget || null;
                        state.categories = importedData.categories || [];
                        state.expenses = importedData.expenses || [];
                        state.budgets = importedData.budgets || [];
                        
                        saveData();
                        elements.importDataModal.classList.add('hidden');
                        
                        showNotification('Data imported successfully!', 'success');
                        updateUI();
                    } catch (error) {
                        console.error('Error importing data:', error);
                        showNotification('Error importing data. Please check the file format.', 'error');
                    }
                };
                
                if (selectedFile.name.endsWith('.json')) {
                    reader.readAsText(selectedFile);
                } else {
                    reader.readAsArrayBuffer(selectedFile);
                }
            }

            // Export functions
            function exportToPdf() {
                if (!state.currentBudget) {
                    showNotification('No budget data to export', 'error');
                    return;
                }
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Title
                doc.setFontSize(20);
                doc.text(`Event Budget Report: ${state.currentBudget.name}`, 14, 20);
                
                // Summary section
                doc.setFontSize(14);
                doc.text('Budget Summary', 14, 35);
                
                doc.setFontSize(12);
                doc.text(`Total Budget: $${state.currentBudget.totalAmount.toFixed(2)}`, 20, 45);
                
                const totalSpent = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
                doc.text(`Total Spent: $${totalSpent.toFixed(2)}`, 20, 55);
                
                const remaining = state.currentBudget.totalAmount - totalSpent;
                doc.text(`Remaining: $${remaining.toFixed(2)}`, 20, 65);
                
                // Categories table
                doc.setFontSize(14);
                doc.text('Expense Categories', 14, 80);
                
                const categoryData = state.categories.map(cat => [
                    cat.name,
                    `$${cat.budget.toFixed(2)}`,
                    `$${cat.spent.toFixed(2)}`,
                    `$${(cat.budget - cat.spent).toFixed(2)}`,
                    `${Math.min(100, (cat.spent / cat.budget) * 100).toFixed(1)}%`
                ]);
                
                doc.autoTable({
                    startY: 85,
                    head: [['Category', 'Budget', 'Spent', 'Remaining', 'Progress']],
                    body: categoryData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [79, 70, 229]
                    }
                });
                
                // Recent transactions
                doc.setFontSize(14);
                doc.text('Recent Transactions', 14, doc.lastAutoTable.finalY + 15);
                
                const transactionData = state.expenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map(exp => [
                        new Date(exp.date).toLocaleDateString(),
                        exp.description,
                        exp.categoryName,
                        `-$${exp.amount.toFixed(2)}`
                    ]);
                
                doc.autoTable({
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['Date', 'Description', 'Category', 'Amount']],
                    body: transactionData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [79, 70, 229]
                    }
                });
                
                // Save the PDF
                doc.save(`EventBudget_${state.currentBudget.name.replace(/\s+/g, '_')}.pdf`);
                showNotification('PDF report generated successfully!', 'success');
            }

            function exportToExcel() {
                if (!state.currentBudget) {
                    showNotification('No budget data to export', 'error');
                    return;
                }
                
                try {
                    // Prepare data for export
                    const exportData = [];
                    
                    // Add budget
                    exportData.push({
                        type: 'budget',
                        id: state.currentBudget.id,
                        name: state.currentBudget.name,
                        totalAmount: state.currentBudget.totalAmount,
                        eventDate: state.currentBudget.eventDate,
                        createdAt: state.currentBudget.createdAt
                    });
                    
                    // Add categories
                    state.categories.forEach(category => {
                        exportData.push({
                            type: 'category',
                            id: category.id,
                            name: category.name,
                            budget: category.budget,
                            spent: category.spent
                        });
                    });
                    
                    // Add expenses
                    state.expenses.forEach(expense => {
                        exportData.push({
                            type: 'expense',
                            id: expense.id,
                            date: expense.date,
                            categoryId: expense.categoryId,
                            categoryName: expense.categoryName,
                            description: expense.description,
                            amount: expense.amount,
                            createdAt: expense.createdAt
                        });
                    });
                    
                    // Create worksheet
                    const worksheet = XLSX.utils.json_to_sheet(exportData);
                    
                    // Create workbook
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "BudgetData");
                    
                    // Export to file
                    XLSX.writeFile(workbook, `EventBudget_${state.currentBudget.name.replace(/\s+/g, '_')}.xlsx`);
                    
                    showNotification('Excel file exported successfully!', 'success');
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                    showNotification('Error exporting to Excel', 'error');
                }
            }

            // UI update functions
            function updateUI() {
                if (!state.currentBudget) {
                    // No budget created yet
                    elements.totalBudget.textContent = '$0.00';
                    elements.totalSpent.textContent = '$0.00';
                    elements.remainingBudget.textContent = '$0.00';
                    elements.budgetProgress.style.width = '0%';
                    elements.progressPercentage.textContent = '0%';
                    
                    // Clear tables
                    elements.categoryTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">No categories added yet</td>
                        </tr>
                    `;
                    
                    elements.transactionsTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">No transactions recorded yet</td>
                        </tr>
                    `;
                    
                    // Clear chart
                    if (expenseChart) {
                        expenseChart.destroy();
                    }
                    
                    return;
                }
                
                // Update budget summary
                const totalBudget = state.currentBudget.totalAmount;
                const totalSpent = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
                const remaining = totalBudget - totalSpent;
                const progressPercentage = Math.min(100, (totalSpent / totalBudget) * 100);
                
                elements.totalBudget.textContent = `$${totalBudget.toFixed(2)}`;
                elements.totalSpent.textContent = `$${totalSpent.toFixed(2)}`;
                elements.remainingBudget.textContent = `$${remaining.toFixed(2)}`;
                elements.budgetProgress.style.width = `${progressPercentage}%`;
                elements.progressPercentage.textContent = `${progressPercentage.toFixed(1)}%`;
                
                // Update progress bar color based on percentage
                if (progressPercentage > 90) {
                    elements.budgetProgress.classList.remove('bg-gradient-to-r', 'from-indigo-500', 'to-purple-500');
                    elements.budgetProgress.classList.add('bg-gradient-to-r', 'from-red-500', 'to-pink-500');
                } else if (progressPercentage > 70) {
                    elements.budgetProgress.classList.remove('bg-gradient-to-r', 'from-indigo-500', 'to-purple-500');
                    elements.budgetProgress.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500');
                } else {
                    elements.budgetProgress.classList.remove('bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'from-yellow-500', 'to-orange-500');
                    elements.budgetProgress.classList.add('bg-gradient-to-r', 'from-indigo-500', 'to-purple-500');
                }
                
                // Update categories table
                updateCategoriesTable();
                
                // Update transactions table
                updateTransactionsTable();
                
                // Update chart
                updateChart();
            }

            function updateCategoriesTable() {
                if (state.categories.length === 0) {
                    elements.categoryTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">No categories added yet</td>
                        </tr>
                    `;
                    return;
                }
                
                elements.categoryTableBody.innerHTML = '';
                
                state.categories.forEach(category => {
                    const remaining = category.budget - category.spent;
                    const progressPercentage = Math.min(100, (category.spent / category.budget) * 100);
                    
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-50';
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <i class="fas fa-tag text-indigo-600"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${category.name}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            $${category.budget.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            $${category.spent.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${remaining < 0 ? 'text-red-500' : 'text-green-500'}">
                            $${remaining.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="h-2.5 rounded-full ${progressPercentage > 90 ? 'bg-red-500' : progressPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}" 
                                     style="width: ${progressPercentage}%"></div>
                            </div>
                        </td>
                    `;
                    
                    elements.categoryTableBody.appendChild(row);
                });
            }

            function updateTransactionsTable() {
                // Filter expenses based on time filter
                let filteredExpenses = [...state.expenses];
                const filterValue = elements.timeFilter.value;
                
                if (filterValue === 'month') {
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();
                    
                    filteredExpenses = filteredExpenses.filter(expense => {
                        const expenseDate = new Date(expense.date);
                        return expenseDate.getMonth() === currentMonth && 
                               expenseDate.getFullYear() === currentYear;
                    });
                } else if (filterValue === 'week') {
                    const now = new Date();
                    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    
                    filteredExpenses = filteredExpenses.filter(expense => {
                        const expenseDate = new Date(expense.date);
                        return expenseDate >= oneWeekAgo;
                    });
                }
                
                if (filteredExpenses.length === 0) {
                    elements.transactionsTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">No transactions found for selected period</td>
                        </tr>
                    `;
                    return;
                }
                
                elements.transactionsTableBody.innerHTML = '';
                
                // Sort by date (newest first)
                filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                filteredExpenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-50';
                    
                    const date = new Date(expense.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${formattedDate}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">${expense.description}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-500">${expense.categoryName}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                            -$${expense.amount.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="editExpense('${expense.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-900" onclick="deleteExpense('${expense.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    
                    elements.transactionsTableBody.appendChild(row);
                });
            }

            function updateChart() {
                // Prepare data for chart
                const categories = state.categories.map(cat => cat.name);
                const spentData = state.categories.map(cat => cat.spent);
                const budgetData = state.categories.map(cat => cat.budget);
                
                // Get canvas context
                const ctx = elements.expenseChart.getContext('2d');
                
                // Destroy previous chart if exists
                if (expenseChart) {
                    expenseChart.destroy();
                }
                
                // Create new chart
                expenseChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: categories,
                        datasets: [
                            {
                                label: 'Budget',
                                data: budgetData,
                                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                borderColor: 'rgba(99, 102, 241, 1)',
                                borderWidth: 1
                            },
                            {
                                label: 'Spent',
                                data: spentData,
                                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                                borderColor: 'rgba(220, 38, 38, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value;
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': $' + context.raw.toFixed(2);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Data persistence
            function saveData() {
                localStorage.setItem('eventBudgetTracker', JSON.stringify({
                    currentBudget: state.currentBudget,
                    categories: state.categories,
                    expenses: state.expenses,
                    budgets: state.budgets,
                    googleAuth: state.googleAuth
                }));
            }

            // Notification system
            function showNotification(message, type) {
                const notification = document.createElement('div');
                notification.className = `notification px-4 py-3 rounded-lg shadow-md flex items-center ${type === 'error' ? 'bg-red-100 text-red-800' : type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`;
                
                let icon;
                if (type === 'error') {
                    icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
                } else if (type === 'warning') {
                    icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
                } else {
                    icon = '<i class="fas fa-check-circle mr-2"></i>';
                }
                
                notification.innerHTML = `${icon}${message}`;
                elements.notificationContainer.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }

            // Global functions for inline event handlers
            window.editExpense = function(id) {
                const expense = state.expenses.find(exp => exp.id === id);
                if (!expense) return;
                
                showNotification('Edit functionality coming soon!', 'info');
            };

            window.deleteExpense = function(id) {
                if (!confirm('Are you sure you want to delete this expense?')) return;
                
                const expenseIndex = state.expenses.findIndex(exp => exp.id === id);
                if (expenseIndex === -1) return;
                
                const expense = state.expenses[expenseIndex];
                const category = state.categories.find(cat => cat.id === expense.categoryId);
                
                if (category) {
                    category.spent -= expense.amount;
                }
                
                state.expenses.splice(expenseIndex, 1);
                saveData();
                updateUI();
                
                showNotification('Expense deleted successfully', 'success');
            };
        });
    