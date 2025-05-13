// Theme toggle functionality
const themeButtons = document.querySelectorAll('.theme button');
const root = document.documentElement;

// Get saved theme from localStorage or default to light theme
let isDarkTheme = localStorage.getItem('theme') === 'dark';

// Apply initial theme
setTheme(isDarkTheme);

// Update active state of theme buttons
function updateButtonStates(isDark) {
    themeButtons.forEach(button => {
        const isActive = (button.getAttribute('type') === 'dark') === isDark;
        button.classList.toggle('active', isActive);
    });
}

// Set theme colors
function setTheme(isDark) {
    if (isDark) {
        root.style.setProperty('--primary', '#3C38A6');
        root.style.setProperty('--secundary', '#251D59');
        root.style.setProperty('--tertiary', '#5274D9');
        root.style.setProperty('--quaternary', '#30BFA5');
        root.style.setProperty('--gray', '#404040');
        root.style.setProperty('--darkgray', '#1E1E1E');
        root.style.setProperty('--background', '#171616');
        root.style.setProperty('--white', '#D9D9D9');
    } else {
        root.style.setProperty('--primary', '#3C38A6');
        root.style.setProperty('--secundary', '#251D59');
        root.style.setProperty('--tertiary', '#5274D9');
        root.style.setProperty('--quaternary', '#30BFA5');
        root.style.setProperty('--gray', '#F5F5F5');
        root.style.setProperty('--darkgray', '#e9ecef');
        root.style.setProperty('--background', '#f8f9fa');
        root.style.setProperty('--white', '#1E1E1E');
    }
    updateButtonStates(isDark);
}

// Theme toggle handler
function changeTheme() {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    setTheme(isDarkTheme);
}

// Add click event listeners to theme buttons
themeButtons.forEach(button => {
    button.addEventListener('click', changeTheme);
});

// Set initial button states
updateButtonStates(isDarkTheme);