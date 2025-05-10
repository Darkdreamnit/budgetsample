        // DOM Elements
        const eventTypeBtns = document.querySelectorAll('.event-type-btn');
        const customEventBtn = document.getElementById('customEventBtn');
        const customEventName = document.getElementById('customEventName');
        const checklistSection = document.getElementById('checklistSection');
        const eventTitle = document.getElementById('eventTitle');
        const taskList = document.getElementById('taskList');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskName = document.getElementById('taskName');
        const taskPriority = document.getElementById('taskPriority');
        const taskDeadline = document.getElementById('taskDeadline');
        const taskNotes = document.getElementById('taskNotes');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const progressPercent = document.getElementById('progressPercent');
        const progressCircle = document.getElementById('progressCircle');
        const motivationalMessage = document.getElementById('motivationalMessage');
        const actionButtons = document.getElementById('actionButtons');
        const saveChecklistBtn = document.getElementById('saveChecklistBtn');
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        const emailChecklistBtn = document.getElementById('emailChecklistBtn');
        const newChecklistBtn = document.getElementById('newChecklistBtn');
        const savedChecklistsSection = document.getElementById('savedChecklistsSection');
        const savedChecklists = document.getElementById('savedChecklists');
        const sortPriorityBtn = document.getElementById('sortPriorityBtn');
        const sortDeadlineBtn = document.getElementById('sortDeadlineBtn');

        // Event Data
        const eventTemplates = {
            wedding: [
                { name: "Book venue", priority: "high", deadline: "", notes: "Visit at least 3 options" },
                { name: "Choose wedding date", priority: "high", deadline: "", notes: "Consult with family" },
                { name: "Create guest list", priority: "medium", deadline: "", notes: "Include addresses for invites" },
                { name: "Order invitations", priority: "medium", deadline: "", notes: "Consider digital options" },
                { name: "Hire photographer", priority: "high", deadline: "", notes: "Check portfolios" },
                { name: "Select wedding dress", priority: "medium", deadline: "", notes: "Allow time for alterations" },
                { name: "Book caterer", priority: "high", deadline: "", notes: "Schedule tasting" },
                { name: "Choose wedding cake", priority: "low", deadline: "", notes: "Consider dietary restrictions" },
                { name: "Plan honeymoon", priority: "low", deadline: "", notes: "Check passport validity" },
                { name: "Arrange transportation", priority: "low", deadline: "", notes: "For wedding party and guests" }
            ],
            birthday: [
                { name: "Choose date and time", priority: "high", deadline: "", notes: "Check guest availability" },
                { name: "Select venue", priority: "high", deadline: "", notes: "Home or external location" },
                { name: "Create guest list", priority: "medium", deadline: "", notes: "Consider age groups" },
                { name: "Send invitations", priority: "medium", deadline: "", notes: "Digital or paper" },
                { name: "Order cake", priority: "medium", deadline: "", notes: "Theme and dietary needs" },
                { name: "Plan activities/games", priority: "medium", deadline: "", notes: "Age appropriate" },
                { name: "Buy decorations", priority: "low", deadline: "", notes: "Theme colors" },
                { name: "Prepare party favors", priority: "low", deadline: "", notes: "Small gifts for guests" },
                { name: "Arrange food and drinks", priority: "high", deadline: "", notes: "Consider dietary restrictions" },
                { name: "Plan music playlist", priority: "low", deadline: "", notes: "Or hire DJ" }
            ],
            corporate: [
                { name: "Define event purpose", priority: "high", deadline: "", notes: "Clear objectives" },
                { name: "Set budget", priority: "high", deadline: "", notes: "Include contingency" },
                { name: "Choose date and venue", priority: "high", deadline: "", notes: "Check conflicts" },
                { name: "Create guest list", priority: "medium", deadline: "", notes: "VIPs first" },
                { name: "Send save-the-dates", priority: "medium", deadline: "", notes: "Follow with formal invite" },
                { name: "Arrange catering", priority: "medium", deadline: "", notes: "Dietary requirements" },
                { name: "Plan agenda/speakers", priority: "high", deadline: "", notes: "Rehearsals needed" },
                { name: "Organize AV equipment", priority: "medium", deadline: "", notes: "Tech check" },
                { name: "Prepare materials/swag", priority: "low", deadline: "", notes: "Branded items" },
                { name: "Arrange transportation", priority: "low", deadline: "", notes: "For guests if needed" }
            ],
            festival: [
                { name: "Secure permits", priority: "high", deadline: "", notes: "Local regulations" },
                { name: "Book venue", priority: "high", deadline: "", notes: "Capacity and facilities" },
                { name: "Line up performers", priority: "high", deadline: "", notes: "Contracts signed" },
                { name: "Arrange stage/sound", priority: "high", deadline: "", notes: "Technical requirements" },
                { name: "Plan food vendors", priority: "medium", deadline: "", notes: "Variety of options" },
                { name: "Organize security", priority: "high", deadline: "", notes: "Crowd control" },
                { name: "Arrange sanitation", priority: "medium", deadline: "", notes: "Restrooms, trash" },
                { name: "Create marketing plan", priority: "medium", deadline: "", notes: "Social media, posters" },
                { name: "Plan parking/shuttles", priority: "low", deadline: "", notes: "Accessibility" },
                { name: "Prepare first aid", priority: "medium", deadline: "", notes: "Medical staff on site" }
            ],
            fundraiser: [
                { name: "Define fundraising goal", priority: "high", deadline: "", notes: "Specific amount" },
                { name: "Choose event type", priority: "high", deadline: "", notes: "Gala, auction, etc." },
                { name: "Set budget", priority: "high", deadline: "", notes: "Keep costs low" },
                { name: "Secure venue", priority: "high", deadline: "", notes: "Donated if possible" },
                { name: "Recruit volunteers", priority: "medium", deadline: "", notes: "Assign roles" },
                { name: "Solicit sponsors", priority: "high", deadline: "", notes: "Local businesses" },
                { name: "Create invitation list", priority: "medium", deadline: "", notes: "Potential donors" },
                { name: "Plan program/speakers", priority: "medium", deadline: "", notes: "Inspiring stories" },
                { name: "Arrange payment method", priority: "low", deadline: "", notes: "Mobile payments" },
                { name: "Plan thank you gifts", priority: "low", deadline: "", notes: "For major donors" }
            ]
        };

        const motivationalMessages = [
            { threshold: 0, message: "Let's get started! Every journey begins with the first step." },
            { threshold: 20, message: "Great start! You're on your way to event planning success." },
            { threshold: 40, message: "Keep going! You're making excellent progress." },
            { threshold: 60, message: "More than halfway there! Your event is taking shape." },
            { threshold: 80, message: "Almost done! Just a few more items to complete." },
            { threshold: 95, message: "You're crushing it! Just dotting the i's and crossing the t's now." },
            { threshold: 100, message: "Congratulations! Your event planning is complete. Time to celebrate!" }
        ];

        // Current State
        let currentEventType = '';
        let tasks = [];
        let sortBy = 'none';

        // Initialize
        function init() {
            loadSavedChecklists();
            setupEventListeners();
        }

        // Event Listeners
        function setupEventListeners() {
            // Event type selection
            eventTypeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const eventType = btn.dataset.event;
                    startNewChecklist(eventType);
                });
            });
            
            // Custom event
            customEventBtn.addEventListener('click', () => {
                if (customEventName.value.trim()) {
                    startNewChecklist('custom', customEventName.value.trim());
                    customEventName.value = '';
                }
            });
            
            // Add task
            addTaskBtn.addEventListener('click', addNewTask);
            taskName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addNewTask();
            });
            
            // Task actions (delegated)
            taskList.addEventListener('click', handleTaskActions);
            
            // Sorting
            sortPriorityBtn.addEventListener('click', () => sortTasks('priority'));
            sortDeadlineBtn.addEventListener('click', () => sortTasks('deadline'));
            
            // Action buttons
            saveChecklistBtn.addEventListener('click', saveChecklist);
            exportPdfBtn.addEventListener('click', exportToPDF);
            emailChecklistBtn.addEventListener('click', emailChecklist);
            newChecklistBtn.addEventListener('click', resetChecklist);
        }

        // Checklist Functions
        function startNewChecklist(eventType, customName = '') {
            currentEventType = eventType;
            
            if (eventType === 'custom') {
                eventTitle.textContent = customName;
            } else {
                eventTitle.textContent = eventType.charAt(0).toUpperCase() + eventType.slice(1);
            }
            
            // Load template tasks or start empty for custom
            tasks = eventType === 'custom' ? [] : [...eventTemplates[eventType]].map(task => ({
                ...task,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                completed: false
            }));
            
            renderTaskList();
            checklistSection.classList.remove('hidden');
            actionButtons.classList.remove('hidden');
            
            // Scroll to checklist
            checklistSection.scrollIntoView({ behavior: 'smooth' });
        }

        function addNewTask() {
            const name = taskName.value.trim();
            if (!name) return;
            
            const newTask = {
                name,
                priority: taskPriority.value,
                deadline: taskDeadline.value,
                notes: taskNotes.value,
                completed: false,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            };
            
            tasks.push(newTask);
            renderTaskList();
            
            // Clear form
            taskName.value = '';
            taskNotes.value = '';
            taskDeadline.value = '';
            taskPriority.value = 'medium';
            
            // Re-sort if needed
            if (sortBy !== 'none') {
                sortTasks(sortBy);
            }
        }

        function renderTaskList() {
            if (tasks.length === 0) {
                taskList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-tasks text-4xl mb-2"></i>
                        <p>No tasks yet. Add your first task to get started!</p>
                    </div>
                `;
                updateProgress();
                return;
            }
            
            taskList.innerHTML = '';
            
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item p-4 rounded-lg shadow-sm transition-all ${task.completed ? 'completed opacity-80' : ''}`;
                taskItem.dataset.id = task.id;
                
                // Priority color
                let priorityClass = '';
                if (task.priority === 'high') priorityClass = 'priority-high';
                if (task.priority === 'medium') priorityClass = 'priority-medium';
                if (task.priority === 'low') priorityClass = 'priority-low';
                
                // Deadline display
                let deadlineDisplay = '';
                if (task.deadline) {
                    const deadlineDate = new Date(task.deadline);
                    deadlineDisplay = `
                        <span class="text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}">
                            <i class="far fa-calendar-alt mr-1"></i>
                            ${deadlineDate.toLocaleDateString()}
                        </span>
                    `;
                }
                
                taskItem.innerHTML = `
                    <div class="flex items-start gap-3">
                        <button class="complete-btn mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500 text-white' : `border-gray-300 ${priorityClass ? 'border-' + task.priority + '-500' : ''}`} flex items-center justify-center transition-colors">
                            ${task.completed ? '<i class="fas fa-check text-xs checkmark-animate"></i>' : ''}
                        </button>
                        
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}">
                                    ${task.name}
                                </h3>
                                ${task.priority === 'high' ? '<span class="text-xs px-2 py-0.5 priority-high rounded-full">High</span>' : ''}
                                ${task.priority === 'medium' ? '<span class="text-xs px-2 py-0.5 priority-medium rounded-full">Medium</span>' : ''}
                                ${task.priority === 'low' ? '<span class="text-xs px-2 py-0.5 priority-low rounded-full">Low</span>' : ''}
                            </div>
                            
                            ${task.notes ? `
                                <p class="text-sm text-gray-600 mb-2">
                                    <i class="far fa-sticky-note mr-1"></i>
                                    ${task.notes}
                                </p>
                            ` : ''}
                            
                            <div class="flex items-center gap-3 text-sm">
                                ${deadlineDisplay}
                                
                                <button class="edit-btn ${task.completed ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}">
                                    <i class="far fa-edit mr-1"></i> Edit
                                </button>
                                
                                <button class="delete-btn ${task.completed ? 'text-gray-400' : 'text-red-600 hover:text-red-800'}">
                                    <i class="far fa-trash-alt mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
            });
            
            updateProgress();
        }

        function handleTaskActions(e) {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = taskItem.dataset.id;
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (e.target.closest('.complete-btn')) {
                // Toggle completion status
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                renderTaskList();
            }
            else if (e.target.closest('.edit-btn')) {
                // Edit task
                editTask(taskIndex);
            }
            else if (e.target.closest('.delete-btn')) {
                // Delete task
                tasks.splice(taskIndex, 1);
                renderTaskList();
            }
        }

        function editTask(index) {
            const task = tasks[index];
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Edit Task</h3>
                        <button class="close-modal text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Task Name</label>
                            <input type="text" value="${task.name}" class="task-edit-name w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Priority</label>
                                <select class="task-edit-priority w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm text-gray-600 mb-1">Deadline</label>
                                <input type="date" value="${task.deadline}" class="task-edit-deadline w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm text-gray-600 mb-1">Notes</label>
                            <textarea class="task-edit-notes w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3">${task.notes || ''}</textarea>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-2">
                            <button class="cancel-edit px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button class="save-edit px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Event listeners for modal
            modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
            modal.querySelector('.cancel-edit').addEventListener('click', () => modal.remove());
            
            modal.querySelector('.save-edit').addEventListener('click', () => {
                tasks[index] = {
                    ...tasks[index],
                    name: modal.querySelector('.task-edit-name').value.trim(),
                    priority: modal.querySelector('.task-edit-priority').value,
                    deadline: modal.querySelector('.task-edit-deadline').value,
                    notes: modal.querySelector('.task-edit-notes').value.trim()
                };
                
                renderTaskList();
                modal.remove();
                
                // Re-sort if needed
                if (sortBy !== 'none') {
                    sortTasks(sortBy);
                }
            });
        }

        function sortTasks(criteria) {
            sortBy = criteria;
            
            if (criteria === 'priority') {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            }
            
            else if (criteria === 'deadline') {
                tasks.sort((a, b) => {
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
            }
            
            renderTaskList();
            
            // Update active sort button
            if (criteria === 'priority') {
                sortPriorityBtn.classList.add('bg-blue-100', 'text-blue-800');
                sortPriorityBtn.classList.remove('bg-gray-100');
                sortDeadlineBtn.classList.remove('bg-blue-100', 'text-blue-800');
                sortDeadlineBtn.classList.add('bg-gray-100');
            }
            
            else if (criteria === 'deadline') {
                sortDeadlineBtn.classList.add('bg-blue-100', 'text-blue-800');
                sortDeadlineBtn.classList.remove('bg-gray-100');
                sortPriorityBtn.classList.remove('bg-blue-100', 'text-blue-800');
                sortPriorityBtn.classList.add('bg-gray-100');
            }
        }

        function updateProgress() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Update progress bar
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% complete`;
            progressPercent.textContent = `${progress}%`;
            
            // Update circular progress
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = offset;
            
            // Update motivational message
            let message = '';
            for (let i = motivationalMessages.length - 1; i >= 0; i--) {
                if (progress >= motivationalMessages[i].threshold) {
                    message = motivationalMessages[i].message;
                    break;
                }
            }
            motivationalMessage.textContent = message;
        }

        // Save/Load Functions
        function saveChecklist() {
            if (!currentEventType || tasks.length === 0) return;
            
            const checklistData = {
                eventType: currentEventType,
                eventName: eventTitle.textContent.replace(' Checklist', ''),
                tasks: tasks,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Get existing checklists from localStorage
            const savedChecklistsData = JSON.parse(localStorage.getItem('eventChecklists') || '[]');
            
            // Add new checklist
            savedChecklistsData.push(checklistData);
            
            // Save back to localStorage
            localStorage.setItem('eventChecklists', JSON.stringify(savedChecklistsData));
            
            // Show success message
            alert('Checklist saved successfully!');
            
            // Update saved checklists display
            loadSavedChecklists();
        }

        function loadSavedChecklists() {
            const savedChecklistsData = JSON.parse(localStorage.getItem('eventChecklists') || '[]');
            
            if (savedChecklistsData.length === 0) {
                savedChecklistsSection.classList.add('hidden');
                return;
            }
            
            savedChecklistsSection.classList.remove('hidden');
            savedChecklists.innerHTML = '';
            
            savedChecklistsData.forEach((checklist, index) => {
                const completedTasks = checklist.tasks.filter(task => task.completed).length;
                const totalTasks = checklist.tasks.length;
                const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                const checklistCard = document.createElement('div');
                checklistCard.className = 'bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow';
                
                checklistCard.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-semibold text-lg text-gray-800">${checklist.eventName}</h3>
                        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            ${checklist.eventType === 'custom' ? 'Custom' : checklist.eventType.charAt(0).toUpperCase() + checklist.eventType.slice(1)}
                        </span>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <span class="text-sm font-medium text-blue-600">${progress}%</span>
                    </div>
                    
                    <div class="flex justify-between text-sm text-gray-600 mb-4">
                        <span><i class="far fa-calendar-alt mr-1"></i> ${new Date(checklist.updatedAt).toLocaleDateString()}</span>
                        <span>${completedTasks}/${totalTasks} tasks</span>
                    </div>
                    
                    <div class="flex gap-2">
                        <button class="load-checklist-btn px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-1">
                            <i class="fas fa-tasks mr-1"></i> Open
                        </button>
                        <button class="delete-checklist-btn px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                checklistCard.querySelector('.load-checklist-btn').addEventListener('click', () => {
                    loadChecklist(index);
                });
                
                checklistCard.querySelector('.delete-checklist-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this checklist?')) {
                        deleteChecklist(index);
                    }
                });
                
                savedChecklists.appendChild(checklistCard);
            });
        }

        function loadChecklist(index) {
            const savedChecklistsData = JSON.parse(localStorage.getItem('eventChecklists') || '[]');
            const checklist = savedChecklistsData[index];
            
            currentEventType = checklist.eventType;
            eventTitle.textContent = checklist.eventName;
            tasks = [...checklist.tasks];
            
            renderTaskList();
            checklistSection.classList.remove('hidden');
            actionButtons.classList.remove('hidden');
            
            // Scroll to checklist
            checklistSection.scrollIntoView({ behavior: 'smooth' });
        }

        function deleteChecklist(index) {
            const savedChecklistsData = JSON.parse(localStorage.getItem('eventChecklists') || '[]');
            savedChecklistsData.splice(index, 1);
            localStorage.setItem('eventChecklists', JSON.stringify(savedChecklistsData));
            loadSavedChecklists();
        }

        function resetChecklist() {
            if (confirm('Are you sure you want to start a new checklist? Your current checklist will be lost unless saved.')) {
                tasks = [];
                renderTaskList();
                checklistSection.classList.add('hidden');
                actionButtons.classList.add('hidden');
            }
        }

        // Export Functions
        function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Title
            doc.setFontSize(20);
            doc.setTextColor(14, 165, 233); // blue-500
            doc.text(`${eventTitle.textContent} Checklist`, 105, 20, { align: 'center' });
            
            // Progress
            const completedTasks = tasks.filter(task => task.completed).length;
            const totalTasks = tasks.length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Progress: ${progress}% (${completedTasks} of ${totalTasks} tasks completed)`, 14, 35);
            
            // Tasks
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            
            let yPosition = 50;
            tasks.forEach((task, index) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                // Task name with checkbox
                doc.setFont(task.completed ? 'helvetica-bold' : 'helvetica', 'normal');
                doc.text(`${index + 1}. ${task.name}`, 20, yPosition);
                
                if (task.completed) {
                    doc.setFillColor(16, 185, 129); // emerald-500
                    doc.rect(14, yPosition - 4, 5, 5, 'F');
                } else {
                    doc.rect(14, yPosition - 4, 5, 5);
                }
                
                yPosition += 7;
                
                // Priority and deadline
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                let details = [];
                if (task.priority) details.push(`Priority: ${task.priority}`);
                if (task.deadline) details.push(`Deadline: ${new Date(task.deadline).toLocaleDateString()}`);
                
                if (details.length > 0) {
                    doc.text(details.join(' | '), 20, yPosition);
                    yPosition += 5;
                }
                
                // Notes
                if (task.notes) {
                    const splitNotes = doc.splitTextToSize(`Notes: ${task.notes}`, 170);
                    doc.text(splitNotes, 20, yPosition);
                    yPosition += splitNotes.length * 5;
                }
                
                yPosition += 8;
            });
            
            // Footer
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated by Event Checklist Generator on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });
            
            // Save the PDF
            doc.save(`${eventTitle.textContent.replace(' ', '_')}_Checklist.pdf`);
        }

        function emailChecklist() {
            const email = prompt('Enter your email address to receive the checklist:');
            if (email) {
                // In a real app, this would send to a server
                alert(`Checklist will be sent to ${email}. (Note: This is a demo - no email will actually be sent)`);
            }
        }

       