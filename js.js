/*
TODO
(done) handle - 6 + 3 =
(done) handle 6 + - / * 3 =
(done) handle +
(done) handle =
(done) handle 3 + - 3
(done) handle * 3 - 3
(done) handle 0 3 + 2
(done) handle * - 6 + 2
(done) handle 0 , 2 + 0 , 2
(done) handle 0 , 2 + 0 3 =
(done) handle 0 , 3 0 , 2 +
(done) handle 0 , 3 0 1 + 0 , 2 0 1
(done) handle 0 , 0 1 + 0 , 0 2
(done) handle 0 , 1 + 0 3
(done) handle 2 / * - +
(done) highlight buttons when using the keyboard
(done) handle 2 ^ 3 Enter (gives 0 for some reason)
handle . 2 + 3 (partially done: works fine, but should display "0.3" when pressing ",3")
handle , 0 1 + 0 , 0 2 (partially done: works fine, but should display "0.01" when pressing ",01")
handle - 6 + 3 (partially done but should show "-6" in the ui after pressing "-6"
handle 0000 , 2 + 1
handle 2 + 3 = 0 + 1 =
handle floating point
handle (really) large numbers
make output text smaller when the result doesn't fit
show ',' instead of '.' as decimal separator in the ui
handle poor / no connection (fonts request times out / fails)
handle -2 ^ 3 (for some reason Javascript throws an exception when raising negative numbers to a power of)
handle - when using the shift button (for + for example), and releasing the shift key before the + key, + remains in the "pressed state)"
*handle 2 + 2 Enter (2, + and 2 clicked with the mouse, and Enter pressed on the keyboard (I think the elm 2 remains focused and hitting enter triggers a click on 2))
*/

(function () {
  const operators = ['/', '*', '-', '+', '**'];
  const output = document.getElementById('output');
  const keyValueMap = {
    'Enter': '=',
    '^': '**',
  };
  let inputNumber = '';
  let accumulator = '';

  (function () {
    const operatorElms = document.getElementsByClassName('operator');
    const digitElms = document.getElementsByClassName('digit');
    
    Array.prototype.forEach.call(operatorElms, operatorElm => {
      operatorElm.addEventListener('click', event => handleOperatorClick(event.target.value));
    });
  
    Array.prototype.forEach.call(digitElms, digitElm => {
      digitElm.addEventListener('click', event => handleDigitClick(event.target.value));
    });

    document.getElementsByClassName('comma')[0].addEventListener('click', event => handleCommaClick(event.target.value));
    document.getElementsByClassName('clear')[0].addEventListener('click', handleClearClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', event => toggleActive(event.key));
  })();

  function handleOperatorClick(operator) {
    inputNumber = '';

    // Ignore these chars if they are at the beginning of the acc.
    // '/' and '*' will make the eval fail and have no effect on the evaluation.
    // '0' will cause the eval to evaluate the expression to octal.
    while (isFirstCharForbidden(accumulator)) {
      accumulator = accumulator.substr(1);
    }

    // Check if the accumulator is "evaluable"
    if (!isLastCharAnOperator(accumulator)) {
      const evalAcc = eval(accumulator);
      if (evalAcc !== undefined) {
        accumulator = `${evalAcc}`;
        output.value = accumulator;
      }
    }

    if (operator !== '=') {
      // If the last char of the accumulator expression is an operator, replace it with the new one
      // (the last clicked clicked operator should be considered).
      while (isLastCharAnOperator(accumulator)) {
        accumulator = accumulator.substr(0, accumulator.length - 1);
      }
      accumulator += operator;
    }
    
    flickerOutput();
  }

  function handleDigitClick(digit) {
    accumulator += digit;
    inputNumber += digit;

    // Only parse float if starting with '0' and has no decimals.
    if (inputNumber[0] === '0' && inputNumber.indexOf('.') === -1) {
      // parse float to avoid displaying '025' when pressing 0 2 5.
      output.value = parseFloat(inputNumber);
    } else {
      output.value = inputNumber;
    }
  }

  function handleCommaClick(value) {
    if (inputNumber.indexOf(value) !== -1) {
      return;
    }

    accumulator += value;
    inputNumber += value;
    output.value = inputNumber;
  }

  function handleClearClick(event) {
    accumulator = inputNumber = '';
    output.value = '0';
    flickerOutput();
  }

  function isLastCharAnOperator(inputStr) {
    return operators.includes(inputStr[inputStr.length - 1]);
  }

  function isFirstCharForbidden(inputStr) {
    return ['/', '*', '0'].includes(inputStr[0]);
  }

  function flickerOutput() {
    output.classList.add('hidden');
    setTimeout(() => {
      output.classList.remove('hidden');
    }, 50);
  }

  function handleKeyDown(event) {
    // this has some side effects, I know, but it's a good compromise to fix the issue marked with "*" above
    event.preventDefault();

    // NOTE I know using event.key might not be the most reliable way, and using event.which is better,
    // but this should serve the purpose of this exercise.
    const key = getMappedKeyValue(event.key);

    toggleActive(key);
    if (!isNaN(key)) {
      handleDigitClick(key);
    } else if (operators.includes(key) || key === '=') {
      handleOperatorClick(key);
    } else if (key === '.') {
      handleCommaClick(key);
    } else if (key.toLowerCase() === 'c') {
      handleClearClick();
    }
  }

  function toggleActive(key) {
    const keyCopy = getMappedKeyValue(key);

    try {
      const elm = document.querySelectorAll(`button[value="${keyCopy}"]`)[0];
      elm.classList.toggle('active');
    } catch (ex) {

    }
  }

  function getMappedKeyValue(key) {
    while (keyValueMap[key]) {
      key = key.replace(key, keyValueMap[key]);
    }
    return key;
  }
})();
