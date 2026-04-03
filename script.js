const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const accElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

let timer;
let timeLimit = 60;
let timeLeft = timeLimit;
let isTyping = false;
let totalTypedChars = 0;
let correctTypedChars = 0;

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;
    correctTypedChars = 0;
    totalTypedChars = arrayValue.length;

    if (!isTyping) {
        startTimer();
        isTyping = true;
    }

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctTypedChars++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    if(totalTypedChars > 0) {
        const acc = Math.round((correctTypedChars / totalTypedChars) * 100);
        accElement.innerText = `${acc}%`;
    }

    if (correct) renderNewQuote();
});

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
        .catch(err => "Learning to write programs stretches your mind, and helps you think better, creates a way of thinking about things that I think is helpful in all domains.");
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
}

function startTimer() {
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            finishTest();
        }
    }, 1000);
}

function finishTest() {
    clearInterval(timer);
    quoteInputElement.disabled = true;
    const timeSpent = timeLimit - timeLeft;
    const wpm = Math.round(((totalTypedChars / 5) / timeSpent) * 60);
    wpmElement.innerText = wpm > 0 ? wpm : 0;
}

function resetTest() {
    clearInterval(timer);
    timeLeft = timeLimit;
    isTyping = false;
    totalTypedChars = 0;
    correctTypedChars = 0;
    quoteInputElement.disabled = false;
    timerElement.innerText = timeLimit;
    wpmElement.innerText = '0';
    accElement.innerText = '100%';
    renderNewQuote();
}

restartBtn.addEventListener('click', resetTest);
renderNewQuote();
