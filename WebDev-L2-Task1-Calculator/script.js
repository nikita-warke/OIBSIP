const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const percentButton = document.querySelector('[data-action="percent"]');
const equalsButton = document.querySelector('[data-action="equals"]');
let expression = "";
let justCalculated = false;
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
    const value = button.dataset.number;
    if (justCalculated) {
            expression = "";
            previousDisplay.textContent = "";
            justCalculated = false;
        }
        addNumber(value);
        updateDisplay();
    });
});
function addNumber(value) {
    if (value === ".") {
        const parts = expression.split(/[+\-*/]/);
        const currentNumber = parts[parts.length - 1];
        if (currentNumber.includes(".")) {
            return;
        }
        if (currentNumber === "") {
            expression += "0";
        }
    }
    if (value === "0") {
        const parts = expression.split(/[+\-*/]/);
        const currentNumber = parts[parts.length - 1];
        if (currentNumber === "0") {
            return;
        }
    }
    expression += value;
}
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const operator = button.dataset.operator;
        addOperator(operator);
        updateDisplay();
    });
});
function addOperator(operator) {
    if (expression === "") {
        return;
    }
    const lastCharacter = expression[expression.length - 1];
    if (isOperator(lastCharacter)) {
        expression = expression.slice(0, -1) + operator;
        return;
    }
    expression += operator;
    justCalculated = false;
}
function isOperator(character) {
    return (
        character === "+" ||
        character === "-" ||
        character === "*" ||
        character === "/"
    );
}
function updateDisplay() {
    if (expression === "") {
        currentDisplay.textContent = "0";
        return;
    }
    currentDisplay.textContent = formatExpression(expression);
}
function formatExpression(value) {
return value
        .replaceAll("*", " × ")
        .replaceAll("/", " ÷ ")
        .replaceAll("+", " + ")
        .replaceAll("-", " − ");
}
equalsButton.addEventListener("click", calculate);
function calculate() {
    if (expression === "") {
        return;
    }
    let lastCharacter = expression[expression.length - 1];
    if (isOperator(lastCharacter)) {
        expression = expression.slice(0, -1);
    }
    try {
        const result = evaluateExpression(expression);
        previousDisplay.textContent =
            formatExpression(expression) + " =";
        currentDisplay.textContent = formatNumber(result);
        expression = String(result);
        justCalculated = true;
    } catch (error) {
        currentDisplay.textContent = "Error";
        previousDisplay.textContent = error.message;
        expression = "";
        justCalculated = true;
    }
}
function evaluateExpression(input) {
    const numbers = [];
    const operators = [];
    let currentNumber = "";
    for (let i = 0; i < input.length; i++) {
        const character = input[i];
        if (
            (character >= "0" && character <= "9") ||
            character === "."
        ) {
            currentNumber += character;
        } else if (isOperator(character)) {
            if (currentNumber === "") {
                throw new Error("Invalid expression");
            }
            numbers.push(parseFloat(currentNumber));
            operators.push(character);
            currentNumber = "";
        }
    }
    if (currentNumber !== "") {
        numbers.push(parseFloat(currentNumber));
    }
    if (numbers.length === 0) {
        throw new Error("Invalid expression");
    }
    let newNumbers = [numbers[0]];
    let newOperators = [];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const nextNumber = numbers[i + 1];
        if (operator === "*" || operator === "/") {
            const previousNumber =
                newNumbers[newNumbers.length - 1];
            let result;
            if (operator === "*") {
                result = previousNumber * nextNumber;
            } else {
                if (nextNumber === 0) {
                    throw new Error("Cannot divide by zero");
                }
                result = previousNumber / nextNumber;
            }
            newNumbers[newNumbers.length - 1] = result;
        } else {
            newOperators.push(operator);
            newNumbers.push(nextNumber);
        }
    }
    let result = newNumbers[0];
    for (let i = 0; i < newOperators.length; i++) {
        const operator = newOperators[i];
        const nextNumber = newNumbers[i + 1];
        if (operator === "+") {
            result = result + nextNumber;
        } else if (operator === "-") {
            result = result - nextNumber;
        }
    }
    return result;
}
function formatNumber(number) {
    if (!Number.isFinite(number)) {
        throw new Error("Invalid result");
    }
    const rounded = Number(number.toFixed(10));
    return rounded.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}
clearButton.addEventListener("click", () => {
    expression = "";
    previousDisplay.textContent = "";
    currentDisplay.textContent = "0";
    justCalculated = false;
});
backspaceButton.addEventListener("click", () => {
    if (justCalculated) {
        expression = "";
        previousDisplay.textContent = "";
        currentDisplay.textContent = "0";
        justCalculated = false;
        return;
    }
    expression = expression.slice(0, -1);
    updateDisplay();
});
percentButton.addEventListener("click", () => {
    if (expression === "") {
        return;
    }
    const match = expression.match(/(\d*\.?\d+)$/);
    if (!match) {
        return;
    }
    const number = parseFloat(match[0]);
    const percentage = number / 100;
    expression =
        expression.slice(0, -match[0].length) +
        percentage;
    updateDisplay();
});
document.addEventListener("keydown", event => {
    const key = event.key;
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        if (justCalculated) {
            expression = "";
            previousDisplay.textContent = "";
            justCalculated = false;
        }
        addNumber(key);
        updateDisplay();
        return;
    }
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        addOperator(key);
        updateDisplay();
        return;
    }
    if (key === "Enter" || key === "=") {
        calculate();
        return;
    }
    if (key === "Backspace") {
        backspaceButton.click();
        return;
    }
    if (key === "Escape") {
        clearButton.click();
        return;
    }
    if (key === "%") {
        percentButton.click();
    }
});