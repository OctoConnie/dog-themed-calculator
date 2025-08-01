/**
 * Dog-Themed Calculator JavaScript
 * Provides calculator functionality with playful dog-themed interactions
 */

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

// DOM elements
const display = document.getElementById('display');
const dogMessages = document.getElementById('dogMessages');
const calculator = document.querySelector('.calculator');

// Dog messages for different interactions
const dogResponses = {
    welcome: [
        "Woof! Ready to fetch some calculations! 🎾",
        "Let's dig into some math! 🦴",
        "Time to be a good calculating dog! 🐕",
        "Paws and think... what shall we calculate? 🐾"
    ],
    calculating: [
        "Crunching numbers like a good boy! 🦴",
        "Fetching your result... 🎾",
        "Sniffing out the answer! 👃",
        "Wagging through the math! 🐕"
    ],
    success: [
        "Good boy! That's the right answer! 🏆",
        "Woof! Mathematical genius at work! 🎓",
        "Pawsitively correct! 🐾",
        "Tail-wagging good calculation! 🐕"
    ],
    error: [
        "Ruff! Something went wrong! 🐕",
        "Oops! Even good dogs make mistakes! 😅",
        "Bark! Let's try that again! 🦴",
        "Don't worry, we'll fetch the right answer next time! 🎾"
    ],
    clear: [
        "All clean! Ready for new adventures! 🛁",
        "Fresh start, like a new day at the park! 🌞",
        "Cleared! Time for more fun calculations! 🎾",
        "Reset and ready to play! 🐕"
    ],
    pawMessage: [
        "You found the secret paw button! 🐾",
        "Paw-some discovery! Have a treat! 🦴",
        "Secret dog mode activated! Woof! 🐕",
        "You're pawsitively amazing! 🏆",
        "Bonus points for curiosity! 🎾"
    ]
};

/**
 * Updates the display with the current input
 */
function updateDisplay() {
    display.textContent = currentInput;
    
    // Add visual feedback for long numbers
    if (currentInput.length > 10) {
        display.style.fontSize = '1.5em';
    } else if (currentInput.length > 8) {
        display.style.fontSize = '1.8em';
    } else {
        display.style.fontSize = '2em';
    }
}

/**
 * Shows a random dog message from the specified category
 * @param {string} category - The category of messages to choose from
 */
function showDogMessage(category) {
    const messages = dogResponses[category];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    dogMessages.innerHTML = `<p>${randomMessage}</p>`;
    
    // Add visual effect
    dogMessages.style.transform = 'scale(1.05)';
    setTimeout(() => {
        dogMessages.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Appends a character to the current display
 * @param {string} value - The value to append
 */
function appendToDisplay(value) {
    // Reset display if needed
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (currentInput.includes('.')) return; // Don't allow multiple decimals
        if (currentInput === '0') {
            currentInput = '0.';
        } else {
            currentInput += '.';
        }
    }
    // Handle operators
    else if (['+', '-', '*', '/'].includes(value)) {
        if (operator !== null && !shouldResetDisplay) {
            calculate();
        }
        operator = value;
        previousInput = currentInput;
        shouldResetDisplay = true;
        showDogMessage('calculating');
    }
    // Handle numbers
    else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

/**
 * Performs the calculation
 */
function calculate() {
    if (operator === null || previousInput === null) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    showDogMessage('error');
                    currentInput = 'Error: Cannot divide by zero!';
                    display.classList.add('error');
                    updateDisplay();
                    setTimeout(() => {
                        clearDisplay();
                        display.classList.remove('error');
                    }, 2000);
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Format result to avoid floating point precision issues
        if (result % 1 === 0) {
            currentInput = result.toString();
        } else {
            currentInput = parseFloat(result.toPrecision(12)).toString();
        }
        
        // Add success animation
        calculator.classList.add('success');
        setTimeout(() => {
            calculator.classList.remove('success');
        }, 600);
        
        showDogMessage('success');
        
    } catch (error) {
        currentInput = 'Error';
        display.classList.add('error');
        showDogMessage('error');
        setTimeout(() => {
            clearDisplay();
            display.classList.remove('error');
        }, 2000);
    }
    
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Clears the calculator display and resets state
 */
function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    display.classList.remove('error');
    updateDisplay();
    showDogMessage('clear');
}

/**
 * Deletes the last entered character
 */
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Shows a special paw message when the paw button is clicked
 */
function showPawMessage() {
    showDogMessage('pawMessage');
    
    // Add special paw effect
    const pawBtn = document.querySelector('.btn.paw');
    pawBtn.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
        pawBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 500);
}

/**
 * Handles keyboard input for calculator operations
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboard(event) {
    const key = event.key;
    
    // Numbers and decimal
    if (/[0-9.]/.test(key)) {
        appendToDisplay(key);
    }
    // Operations
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Escape or Delete
    else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
    // Backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    showDogMessage('welcome');
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboard);
    
    // Add transition effects to CSS
    dogMessages.style.transition = 'transform 0.2s ease';
});

// Export functions for testing (if in a module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appendToDisplay,
        calculate,
        clearDisplay,
        deleteLast,
        showPawMessage,
        updateDisplay
    };
}