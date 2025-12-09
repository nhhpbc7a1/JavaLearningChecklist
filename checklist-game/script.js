// Game State
let gameState = {
    level: 1,
    xp: 0,
    maxXP: 100,
    completed: 0,
    total: 0,
    items: []
};

// Milestones for achievements
const milestones = [
    { percent: 25, message: "Getting Started! 🎯" },
    { percent: 50, message: "Halfway There! 💪" },
    { percent: 75, message: "Almost Done! 🔥" },
    { percent: 100, message: "Master Achieved! 🏆" }
];

let lastMilestone = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFromLocalStorage(); // Load saved data first
    loadDefaultChecklist();
    renderCalendar();
    updateUI();
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('loadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', handleFileLoad);
    document.getElementById('saveBtn').addEventListener('click', saveToCSV);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebarCalendar').classList.toggle('collapsed');
        });
    }
}

// Load default checklist from CSV structure
function loadDefaultChecklist() {
    // Check if detailedChecklistData is already loaded (from script tag)
    if (typeof detailedChecklistData !== 'undefined' && Array.isArray(detailedChecklistData) && detailedChecklistData.length > 0) {
        // Load saved data
        const savedData = loadFromLocalStorage();
        
        if (savedData && savedData.items && savedData.items.length > 0) {
            // Merge: use saved completion status from localStorage
            const savedMap = new Map();
            savedData.items.forEach(item => {
                const key = `${item.category}|${item.session}|${item.item}`;
                savedMap.set(key, item.completed);
            });
            
            // Restore game state
            if (savedData.level) gameState.level = savedData.level;
            if (savedData.xp !== undefined) gameState.xp = savedData.xp;
            if (savedData.maxXP) gameState.maxXP = savedData.maxXP;
            if (savedData.completed !== undefined) gameState.completed = savedData.completed;
            
            // Merge items
            gameState.items = detailedChecklistData.map(item => {
                const key = `${item.category}|${item.session}|${item.item}`;
                return {
                    ...item,
                    completed: savedMap.has(key) ? savedMap.get(key) : item.completed
                };
            });
        } else {
            gameState.items = detailedChecklistData;
        }
        gameState.total = gameState.items.length;
        renderChecklist();
        updateCalendar();
    } else {
        // Try to load from file
        loadDetailedChecklistFromFile();
    }
}

// Load detailed checklist from file
function loadDetailedChecklistFromFile() {
    fetch('detailed-checklist-data.js')
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(text => {
            // Create a script element to execute the file
            const script = document.createElement('script');
            script.textContent = text;
            document.head.appendChild(script);
            
            // Wait a bit for script to execute
            setTimeout(() => {
                if (typeof detailedChecklistData !== 'undefined' && Array.isArray(detailedChecklistData)) {
                    gameState.items = detailedChecklistData;
                    gameState.total = detailedChecklistData.length;
                    renderChecklist();
                } else {
                    console.warn('Failed to load detailed checklist, using fallback');
                    useFallbackChecklist();
                }
            }, 100);
        })
        .catch(() => {
            console.warn('detailed-checklist-data.js not found, using fallback');
            useFallbackChecklist();
        });
}

// Fallback checklist
function useFallbackChecklist() {
    gameState.items = [
        { category: 'Week 1 - Day 1', session: 'Morning (4h)', item: 'Setup Java Environment', description: 'Install JDK 17+, IDE', xp: 5, completed: false },
        { category: 'Week 1 - Day 1', session: 'Morning (4h)', item: 'Java Syntax Basics', description: 'Variables, data types, control flow', xp: 10, completed: false }
    ];
    gameState.total = gameState.items.length;
    renderChecklist();
}

// Render Checklist
function renderChecklist() {
    const container = document.getElementById('checklistContent');
    container.innerHTML = '';
    
    // Group by category, then by session
    const categoryMap = {};
    gameState.items.forEach((item, index) => {
        const category = item.category || 'Uncategorized';
        const session = item.session || 'General';
        
        if (!categoryMap[category]) {
            categoryMap[category] = {};
        }
        if (!categoryMap[category][session]) {
            categoryMap[category][session] = [];
        }
        categoryMap[category][session].push({ ...item, index });
    });
    
    // Render each category
    Object.keys(categoryMap).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-section';
        
        // Extract day number for scrolling
        const dayMatch = category.match(/Day (\d+)/);
        if (dayMatch) {
            categoryDiv.id = `day-${dayMatch[1]}`;
            categoryDiv.setAttribute('data-day', dayMatch[1]);
        }
        
        // Calculate category totals
        let categoryCompleted = 0;
        let categoryTotal = 0;
        Object.values(categoryMap[category]).forEach(sessionItems => {
            categoryTotal += sessionItems.length;
            categoryCompleted += sessionItems.filter(i => i.completed).length;
        });
        
        // Category header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <span class="category-icon">📚</span>
            <span class="category-title">${category}</span>
            <span class="category-progress">${categoryCompleted}/${categoryTotal}</span>
        `;
        categoryDiv.appendChild(header);
        
        // Render sessions within category
        Object.keys(categoryMap[category]).forEach(session => {
            // Session header
            const sessionHeader = document.createElement('div');
            sessionHeader.className = 'session-header';
            const sessionItems = categoryMap[category][session];
            const sessionCompleted = sessionItems.filter(i => i.completed).length;
            sessionHeader.innerHTML = `
                <span class="session-icon">${session.includes('Morning') ? '🌅' : '🌙'}</span>
                <span class="session-title">${session}</span>
                <span class="session-progress">${sessionCompleted}/${sessionItems.length}</span>
            `;
            categoryDiv.appendChild(sessionHeader);
            
            // Session items
            sessionItems.forEach(itemData => {
                const item = createChecklistItem(itemData);
                categoryDiv.appendChild(item);
            });
        });
        
        container.appendChild(categoryDiv);
    });
    
    // Update calendar after rendering
    updateCalendar();
}

// Create checklist item element
function createChecklistItem(itemData) {
    const item = document.createElement('div');
    item.className = `checklist-item ${itemData.completed ? 'completed' : ''}`;
    item.dataset.index = itemData.index;
    
    item.innerHTML = `
        <div class="checkbox-container">
            <input type="checkbox" class="checkbox-input" ${itemData.completed ? 'checked' : ''} 
                   data-index="${itemData.index}">
            <div class="checkbox-custom"></div>
        </div>
        <div class="item-content">
            <div class="item-title">${itemData.item}</div>
            <div class="item-description">${itemData.description}</div>
        </div>
        <div class="item-xp">+${itemData.xp} XP</div>
    `;
    
    // Add click handler
    const checkbox = item.querySelector('.checkbox-input');
    checkbox.addEventListener('change', (e) => {
        handleItemToggle(itemData.index, e.target.checked);
    });
    
    return item;
}

// Handle item toggle
function handleItemToggle(index, checked) {
    const item = gameState.items[index];
    if (!item) return;
    
    item.completed = checked;
    
    if (checked) {
        gameState.xp += item.xp;
        gameState.completed++;
        
        // Check for level up
        while (gameState.xp >= gameState.maxXP) {
            gameState.xp -= gameState.maxXP;
            gameState.level++;
            gameState.maxXP = Math.floor(gameState.maxXP * 1.5);
            showAchievement(`Level Up! 🎉 Now Level ${gameState.level}`);
        }
        
        // Check for milestones
        const progress = (gameState.completed / gameState.total) * 100;
        milestones.forEach(milestone => {
            if (progress >= milestone.percent && lastMilestone < milestone.percent) {
                showAchievement(milestone.message);
                lastMilestone = milestone.percent;
            }
        });
        
        // Animation
        const itemElement = document.querySelector(`[data-index="${index}"]`);
        if (itemElement) {
            itemElement.classList.add('completed');
            // Add confetti effect (simple)
            createConfetti(itemElement);
        }
    } else {
        gameState.xp = Math.max(0, gameState.xp - item.xp);
        gameState.completed--;
        const itemElement = document.querySelector(`[data-index="${index}"]`);
        if (itemElement) {
            itemElement.classList.remove('completed');
        }
    }
    
    // Auto-save to localStorage
    saveToLocalStorage();
    
    updateUI();
    updateCalendar(); // Update calendar highlights
}

// Update UI
function updateUI() {
    document.getElementById('currentLevel').textContent = gameState.level;
    document.getElementById('currentXP').textContent = gameState.xp;
    document.getElementById('maxXP').textContent = gameState.maxXP;
    document.getElementById('completedCount').textContent = gameState.completed;
    document.getElementById('totalCount').textContent = gameState.total;
    
    const progress = gameState.total > 0 ? (gameState.completed / gameState.total) * 100 : 0;
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
    
    const xpPercent = (gameState.xp / gameState.maxXP) * 100;
    document.getElementById('xpFill').style.width = xpPercent + '%';
}

// Show achievement
function showAchievement(message) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementMessage').textContent = message;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// Create confetti effect
function createConfetti(element) {
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = ['🎉', '✨', '⭐', '🎊'][Math.floor(Math.random() * 4)];
        confetti.style.position = 'absolute';
        confetti.style.left = element.offsetLeft + 'px';
        confetti.style.top = element.offsetTop + 'px';
        confetti.style.pointerEvents = 'none';
        confetti.style.fontSize = '20px';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `confettiFall ${1 + Math.random()}s ease-out forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Save to CSV
function saveToCSV() {
    // Also save to localStorage
    saveToLocalStorage();
    
    const csv = convertToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `java-learning-checklist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('✅ Checklist saved successfully!');
}

// Export to CSV (same as save)
function exportToCSV() {
    saveToCSV();
}

// Convert data to CSV
function convertToCSV() {
    const headers = ['Category', 'Session', 'Item', 'Description', 'XP', 'Completed'];
    const rows = gameState.items.map(item => [
        item.category || '',
        item.session || '',
        item.item,
        item.description,
        item.xp,
        item.completed ? 'true' : 'false'
    ]);
    
    // Add game state
    const gameStateRow = ['GAME_STATE', '', `Level:${gameState.level}`, `XP:${gameState.xp}`, `MaxXP:${gameState.maxXP}`, `Completed:${gameState.completed}`];
    
    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        '',
        gameStateRow.join(',')
    ].join('\n');
}

// Load from CSV
function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csv = e.target.result;
            parseCSV(csv);
            showNotification('✅ Checklist loaded successfully!');
        } catch (error) {
            showNotification('❌ Error loading file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// Parse CSV
function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, ''));
    
    if (!headers.includes('Category')) {
        throw new Error('Invalid CSV format');
    }
    
    const items = [];
    let gameStateFound = false;
    const hasSession = headers.includes('Session');
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('GAME_STATE')) {
            // Parse game state
            const parts = line.split(',');
            parts.forEach(part => {
                if (part.includes('Level:')) {
                    gameState.level = parseInt(part.split(':')[1]) || 1;
                } else if (part.includes('XP:')) {
                    gameState.xp = parseInt(part.split(':')[1]) || 0;
                } else if (part.includes('MaxXP:')) {
                    gameState.maxXP = parseInt(part.split(':')[1]) || 100;
                } else if (part.includes('Completed:')) {
                    gameState.completed = parseInt(part.split(':')[1]) || 0;
                }
            });
            gameStateFound = true;
            continue;
        }
        
        // Parse CSV row (handle quoted values)
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        
        // Handle both old format (5 columns) and new format (6 columns with Session)
        const minColumns = hasSession ? 6 : 5;
        if (values.length >= minColumns) {
            const item = {
                category: values[0].replace(/^"|"$/g, ''),
                item: hasSession ? values[2].replace(/^"|"$/g, '') : values[1].replace(/^"|"$/g, ''),
                description: hasSession ? values[3].replace(/^"|"$/g, '') : values[2].replace(/^"|"$/g, ''),
                xp: parseInt(hasSession ? values[4] : values[3]) || 0,
                completed: (hasSession ? values[5] : values[4]).toLowerCase().includes('true')
            };
            
            if (hasSession) {
                item.session = values[1].replace(/^"|"$/g, '');
            }
            
            items.push(item);
        }
    }
    
    if (items.length > 0) {
        gameState.items = items;
        gameState.total = items.length;
        if (!gameStateFound) {
            // Recalculate if game state not found
            gameState.completed = items.filter(i => i.completed).length;
            gameState.xp = items.filter(i => i.completed).reduce((sum, i) => sum + i.xp, 0);
        }
        // Save to localStorage after loading CSV
        saveToLocalStorage();
        renderChecklist();
        updateUI();
        updateCalendar();
    }
}

// Reset all
function resetAll() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        gameState.items.forEach(item => {
            item.completed = false;
        });
        gameState.level = 1;
        gameState.xp = 0;
        gameState.maxXP = 100;
        gameState.completed = 0;
        lastMilestone = 0;
        localStorage.removeItem('javaLearningChecklist');
        renderChecklist();
        updateUI();
        updateCalendar();
        showNotification('🔄 All progress reset!');
    }
}

// Render Calendar Sidebar
function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Group days by week
    const weekMap = {};
    for (let day = 1; day <= 42; day++) {
        const week = Math.ceil(day / 7);
        if (!weekMap[week]) {
            weekMap[week] = [];
        }
        weekMap[week].push(day);
    }
    
    // Render each week
    Object.keys(weekMap).forEach(week => {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week-group';
        
        const weekTitle = document.createElement('div');
        weekTitle.className = 'week-title';
        weekTitle.textContent = `Tuần ${week}`;
        weekDiv.appendChild(weekTitle);
        
        weekMap[week].forEach(day => {
            const dayButton = document.createElement('button');
            dayButton.className = 'day-button';
            dayButton.setAttribute('data-day', day);
            dayButton.setAttribute('data-week', week);
            
            dayButton.innerHTML = `
                <div class="day-info">
                    <span class="day-number">Ngày ${day}</span>
                    <span class="day-label">Week ${week}</span>
                </div>
                <span class="day-progress" id="day-progress-${day}">0/0</span>
            `;
            
            dayButton.addEventListener('click', () => {
                scrollToDay(day);
            });
            
            weekDiv.appendChild(dayButton);
        });
        
        container.appendChild(weekDiv);
    });
    
    updateCalendar();
}

// Update calendar highlights and progress
function updateCalendar() {
    // Calculate progress for each day
    const dayProgress = {};
    
    gameState.items.forEach(item => {
        const dayMatch = item.category.match(/Day (\d+)/);
        if (dayMatch) {
            const day = parseInt(dayMatch[1]);
            if (!dayProgress[day]) {
                dayProgress[day] = { total: 0, completed: 0 };
            }
            dayProgress[day].total++;
            if (item.completed) {
                dayProgress[day].completed++;
            }
        }
    });
    
    // Update each day button
    for (let day = 1; day <= 42; day++) {
        const button = document.querySelector(`.day-button[data-day="${day}"]`);
        const progressEl = document.getElementById(`day-progress-${day}`);
        
        if (button && progressEl) {
            const progress = dayProgress[day] || { total: 0, completed: 0 };
            progressEl.textContent = `${progress.completed}/${progress.total}`;
            
            // Mark as completed if all tasks done
            if (progress.total > 0 && progress.completed === progress.total) {
                button.classList.add('completed');
            } else {
                button.classList.remove('completed');
            }
        }
    }
}

// Scroll to specific day
function scrollToDay(day) {
    // Remove active class from all buttons
    document.querySelectorAll('.day-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const button = document.querySelector(`.day-button[data-day="${day}"]`);
    if (button) {
        button.classList.add('active');
    }
    
    // Function to find and scroll to element
    const findAndScroll = () => {
        // Try multiple ways to find the element
        let targetElement = document.getElementById(`day-${day}`);
        
        // If not found by ID, try by data attribute
        if (!targetElement) {
            targetElement = document.querySelector(`.category-section[data-day="${day}"]`);
        }
        
        // If still not found, try to find by category name
        if (!targetElement) {
            const allSections = document.querySelectorAll('.category-section');
            for (let section of allSections) {
                const categoryTitle = section.querySelector('.category-title');
                if (categoryTitle) {
                    const dayMatch = categoryTitle.textContent.match(/Day (\d+)/);
                    if (dayMatch && parseInt(dayMatch[1]) === day) {
                        targetElement = section;
                        break;
                    }
                }
            }
        }
        
        if (!targetElement) {
            console.warn(`Element for day ${day} not found`);
            return false;
        }
        
        return targetElement;
    };
    
    // Try to find element, retry if not found
    let targetElement = findAndScroll();
    if (!targetElement) {
        // Wait a bit more and try again
        setTimeout(() => {
            targetElement = findAndScroll();
            if (targetElement) {
                performScroll(targetElement);
            }
        }, 100);
        return;
    }
    
    // Perform scroll
    performScroll(targetElement);
    
    // function performScroll(element) {
    //     // Get header height + margin
    //     const header = document.querySelector('.game-header');
    //     const headerHeight = header ? header.offsetHeight + 40 : 100;
        
    //     // Use scrollIntoView first to bring element into viewport
    //     element.scrollIntoView({
    //         behavior: 'auto', // Use auto for instant positioning
    //         block: 'start',
    //         inline: 'nearest'
    //     });
        
    //     // Then adjust for header offset
    //     requestAnimationFrame(() => {
    //         const elementRect = element.getBoundingClientRect();
    //         const elementTop = elementRect.top + window.pageYOffset;
    //         const targetScroll = elementTop - headerHeight;
            
    //         // Scroll to final position with smooth animation
    //         window.scrollTo({
    //             top: Math.max(0, targetScroll),
    //             behavior: 'smooth'
    //         });
            
    //         // Highlight after scroll
    //         setTimeout(() => {
    //             element.style.animation = 'highlight 0.5s ease';
    //             setTimeout(() => {
    //                 element.style.animation = '';
    //             }, 500);
    //         }, 200);
    //     });
    // }
    function performScroll(element) {
        // Get header height + margin
        const header = document.querySelector('.game-header');
        const headerHeight = header ? header.offsetHeight + 40 : 100;
        
        // Find the category-header within this section (the day header)
        const categoryHeader = element.querySelector('.category-header');
        const scrollTarget = categoryHeader || element;
        
        // Use scrollIntoView first to bring header into viewport
        scrollTarget.scrollIntoView({
            behavior: 'auto', // Use auto for instant positioning
            block: 'start',
            inline: 'nearest'
        });
        
        // Then adjust for header offset
        requestAnimationFrame(() => {
            const targetRect = scrollTarget.getBoundingClientRect();
            const targetTop = targetRect.top + window.pageYOffset;
            const targetScroll = targetTop - headerHeight;
            
            // Scroll to final position with smooth animation
            window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
            
            // Highlight after scroll
            setTimeout(() => {
                element.style.animation = 'highlight 0.5s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }, 200);
        });
    }
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        const dataToSave = {
            items: gameState.items.map(item => ({
                category: item.category,
                session: item.session,
                item: item.item,
                description: item.description,
                xp: item.xp,
                completed: item.completed
            })),
            level: gameState.level,
            xp: gameState.xp,
            maxXP: gameState.maxXP,
            completed: gameState.completed,
            total: gameState.total,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('javaLearningChecklist', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('javaLearningChecklist');
        if (saved) {
            const data = JSON.parse(saved);
            return data; // Return full data object
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return null;
}

// Show notification
function showNotification(message, type = 'success') {
    // Simple alert for now, can be enhanced with toast notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add slide animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

