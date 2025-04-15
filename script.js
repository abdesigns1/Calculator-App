let currentOperand = '0';
        let previousOperand = '';
        let operation = undefined;
        let shouldResetScreen = false;

        const previousOperandText = document.getElementById('previous-operand');
        const currentOperandText = document.getElementById('current-operand');

        function updateDisplay() {
            currentOperandText.textContent = currentOperand;
            if (operation != null) {
                previousOperandText.textContent = `${previousOperand} ${operation}`;
            } else {
                previousOperandText.textContent = previousOperand;
            }
        }

        function handleNumber(number) {
            if (currentOperand === '0' || shouldResetScreen) {
                currentOperand = number;
                shouldResetScreen = false;
            } else {
                currentOperand += number;
            }
            updateDisplay();
        }

        function handleDecimal() {
            if (shouldResetScreen) {
                currentOperand = '0.';
                shouldResetScreen = false;
            } else if (!currentOperand.includes('.')) {
                currentOperand += '.';
            }
            updateDisplay();
        }

        function handleOperation(op) {
            if (currentOperand === '0' && previousOperand === '') return;
            
            if (currentOperand === '0' && operation) {
                operation = op;
                updateDisplay();
                return;
            }

            if (previousOperand !== '') {
                calculate();
            }

            operation = op;
            previousOperand = currentOperand;
            shouldResetScreen = true;
            updateDisplay();
        }

        function calculate() {
            let computation;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;

            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        currentOperand = 'Error';
                        previousOperand = '';
                        operation = undefined;
                        updateDisplay();
                        return;
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }

            // result Accuracy
            computation = computation.toString();
            if (computation.includes('.') && computation.split('.')[1].length > 8) {
                computation = parseFloat(computation).toFixed(8);
                // Remove trailing zeros
                computation = parseFloat(computation).toString();
            }

            currentOperand = computation;
            operation = undefined;
            previousOperand = '';
            shouldResetScreen = true;
        }

        function handleEquals() {
            if (operation === null || shouldResetScreen) return;
            calculate();
            updateDisplay();
        }

        function handleClear() {
            currentOperand = '0';
            previousOperand = '';
            operation = undefined;
            shouldResetScreen = false;
            updateDisplay();
        }

        function handleDelete() {
            if (currentOperand === 'Error' || shouldResetScreen) {
                currentOperand = '0';
                shouldResetScreen = false;
            } else if (currentOperand.length === 1) {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.slice(0, -1);
            }
            updateDisplay();
        }

        // Keyboard support part
        document.addEventListener('keydown', function(event) {
            if (event.key >= '0' && event.key <= '9') {
                handleNumber(event.key);
            } else if (event.key === '.') {
                handleDecimal();
            } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                handleOperation(event.key);
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                handleEquals();
            } else if (event.key === 'Escape') {
                handleClear();
            } else if (event.key === 'Backspace') {
                handleDelete();
            }
        });