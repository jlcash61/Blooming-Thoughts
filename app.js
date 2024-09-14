// Store journal entries in localStorage with the key 'journalEntries'
let entries = JSON.parse(localStorage.getItem('journalEntries')) || {};  // Initialize as an empty object if null
let currentDate = new Date();  // The currently displayed date

// Set background image for the selected month
function setBackgroundForMonth(monthIndex) {
    const monthImages = {
        0: 'january.jpg',
        1: 'february.jpg',
        2: 'march.jpg',
        3: 'april.jpg',
        4: 'may.jpg',
        5: 'june.jpg',
        6: 'july.jpg',
        7: 'august.jpg',
        8: 'september.jpg',
        9: 'october.jpg',
        10: 'november.jpg',
        11: 'december.jpg'
    };

    const backgroundImage = monthImages[monthIndex];

    if (backgroundImage) {
        document.body.style.backgroundImage = `url('./flowers/${backgroundImage}')`;
    }
}

// Display the calendar for the selected month
function displayCalendar() {
    const calendar = document.getElementById('calendar');
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const today = new Date(); // Today’s actual date

    // Update the month label
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Clear previous calendar
    calendar.innerHTML = '';

    // Add day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(label => {
        const dayLabel = document.createElement('div');
        dayLabel.classList.add('day-label');
        dayLabel.textContent = label;
        calendar.appendChild(dayLabel);
    });

    // Add blank days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const blankDiv = document.createElement('div');
        calendar.appendChild(blankDiv);
    }

    // Create a div for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        // Highlight the current day only if it's the currently selected month
        if (
            today.getFullYear() === currentYear &&
            today.getMonth() === currentMonth &&
            today.getDate() === day
        ) {
            dayDiv.classList.add('current-day');  // Highlight current day with a filled circle
        }

        // Format the entry date as YYYY-MM-DD to match the saved entries
        const entryDateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Highlight if an entry exists
        if (entries[entryDateKey]) {
            dayDiv.style.backgroundColor = '#ff6f91';
            dayDiv.style.color = 'white';
        }

        dayDiv.addEventListener('click', () => openEntryForm(entryDateKey));
        calendar.appendChild(dayDiv);
    }
}

// Open form to create/edit an entry
function openEntryForm(dateKey) {
    const form = document.getElementById('entry-form');
    const formDate = document.getElementById('form-date');
    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const moodSelect = document.getElementById('mood');

    form.style.display = 'block';
    formDate.textContent = `Entry for ${dateKey}`;

    if (entries[dateKey]) {
        titleInput.value = entries[dateKey].title;
        contentInput.value = entries[dateKey].content;
        moodSelect.value = entries[dateKey].mood;
    } else {
        titleInput.value = '';
        contentInput.value = '';
        moodSelect.value = 'Happy';
    }

    document.getElementById('save-entry').onclick = () => saveEntry(dateKey);
}

// Save the entry and update the calendar
function saveEntry(dateKey) {
    const title = document.getElementById('journal-title').value;
    const content = document.getElementById('journal-content').value;
    const mood = document.getElementById('mood').value;

    if (title && content) {
        entries[dateKey] = { title, content, mood, date: new Date().toLocaleString() };
        localStorage.setItem('journalEntries', JSON.stringify(entries));  // Update localStorage with the new entry
        displayCalendar();  // Re-render the calendar to show the new entry
        closeForm();
    } else {
        alert('Please fill in both the title and content.');
    }
}

// Close the form
function closeForm() {
    document.getElementById('entry-form').style.display = 'none';
}

// Navigate months
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayCalendar();
    setBackgroundForMonth(currentDate.getMonth());  // Update background based on selected month
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayCalendar();
    setBackgroundForMonth(currentDate.getMonth());  // Update background based on selected month
});

// Display calendar and set background on load
window.addEventListener('load', () => {
    displayCalendar();
    setBackgroundForMonth(currentDate.getMonth());  // Set initial background based on current month
});

// Close the form when clicking "Close"
document.getElementById('close-form').addEventListener('click', closeForm);
