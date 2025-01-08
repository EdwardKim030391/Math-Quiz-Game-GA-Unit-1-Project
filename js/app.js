const difficultyDiv = document.getElementById('difficulty');
const gameDiv = document.getElementById('game');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const messageDisplay = document.getElementById('message');
const characterImg = document.getElementById('character-img');
const hammerImg = document.getElementById('hammer-img');
const cookies = document.querySelectorAll('.cookie');

let difficulty = 'easy';
let timer;
let time = 90;
let score = 0;
let currentCookieIndex = 0;
let currentAnswer = null;
const totalCookies = cookies.length;

function initGame() {
    setTimeBasedOnDifficulty();
    difficultyDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    restartBtn.style.display = 'none';
    score = 0;
    currentCookieIndex = 0;
    updateScore();
    updateTimer();
    startTimer();
    generateQuestion();
    positionCharacter();
}

function positionCharacter() {
    characterImg.style.left = '30%';
    characterImg.style.top = '0';
    hammerImg.style.display = 'none';
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        updateTimer();
        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function setTimeBasedOnDifficulty() {
    if (difficulty === 'easy') {
        time = 90;
    } else if (difficulty === 'medium') {
        time = 120;
    } else if (difficulty === 'hard') {
        time = 150;
    }
}

function updateTimer() {
    timerDisplay.textContent = `Time: ${time}s`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function getNumberRange() {
    if (difficulty === 'easy') return [1, 10];
    if (difficulty === 'medium') return [10, 50];
    if (difficulty === 'hard') return [50, 100];
    return [1, 10];
}

function generateQuestion() {
    const [min, max] = getNumberRange();
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question;
    if (operator === '/') {
        question = `${num1 * num2} / ${num2}`;
        currentAnswer = num1;
    } else {
        question = `${num1} ${operator} ${num2}`;
        currentAnswer = eval(question);
    }

    questionDisplay.textContent = `Question: ${question}`;
}

function moveCharacterToCookie(cookie) {
    const cookiePosition = cookie.offsetLeft;
    const cookieVerticalPosition = cookie.offsetTop;

    characterImg.style.left = `${cookiePosition - 40}px`;

    setTimeout(() => {
        cookie.classList.add('eaten');
        characterImg.src = './image/happycrayon.JPG';
        setTimeout(() => {
            characterImg.src = './image/crayon.JPG';
        }, 1000);
    }, 500);
}

function showHammerEffect() {
    hammerImg.style.left = characterImg.style.left;
    hammerImg.style.top = characterImg.offsetTop - 50 + 'px';
    hammerImg.style.display = 'block';
    characterImg.src = './image/sadcrayon.JPG';
    setTimeout(() => {
        hammerImg.style.display = 'none';
        characterImg.src = './image/crayon.JPG';
    }, 1000);
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value.trim());
    if (userAnswer === currentAnswer) {
        score++;
        updateScore();

        if (currentCookieIndex < cookies.length) {
            moveCharacterToCookie(cookies[currentCookieIndex]);
            currentCookieIndex++;
        }

        if (score === totalCookies) {
            endGame(true);
        }
    } else {
        showHammerEffect();
    }

    answerInput.value = '';
    generateQuestion();
}

function endGame(win) {
    if (win) {
        messageDisplay.textContent = 'Congratulations! You ate all the cookies! 🎉';
        messageDisplay.classList.add('win');
    } else {
        messageDisplay.textContent = 'Time’s Up! 😢';
    }

    restartBtn.style.display = 'block';
}

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.dataset.difficulty;
        initGame();
    });
});

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

restartBtn.addEventListener('click', () => {
    difficultyDiv.style.display = 'block';
    gameDiv.style.display = 'none';
    restartBtn.style.display = 'none';
    messageDisplay.textContent = '';
    positionCharacter();
});
