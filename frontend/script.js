// Simple quiz data (3 example questions about HTML/CSS/JS)
const quizData = [
  {
    question: 'Which HTML element is used to include JavaScript code in a page?',
    choices: ['<script>', '<js>', '<javascript>', '<code>'],
    answer: 0
  },
  {
    question: 'Which CSS property controls the space between letters?',
    choices: ['letter-spacing', 'word-spacing', 'line-height', 'text-indent'],
    answer: 0
  },
  {
    question: 'Which method adds an element at the end of an array in JavaScript?',
    choices: ['push()', 'pop()', 'shift()', 'splice()'],
    answer: 0
  }
];

// State
let current = 0;
let selected = null;
let score = 0;

// Elements
const totalEl = document.getElementById('total');
const currentEl = document.getElementById('current');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const resultSection = document.getElementById('result');
const quizSection = document.getElementById('quiz');
const scoreText = document.getElementById('scoreText');
const tryAgain = document.getElementById('tryAgain');

function init(){
  totalEl.textContent = quizData.length;
  applySavedTheme();
  renderQuestion();
  nextBtn.addEventListener('click', onNext);
  restartBtn.addEventListener('click', restart);
  tryAgain.addEventListener('click', restart);
  document.getElementById('themeToggle').addEventListener('change', onThemeToggle);
}

function renderQuestion(){
  const q = quizData[current];
  currentEl.textContent = current + 1;
  questionEl.innerHTML = q.question;
  choicesEl.innerHTML = '';
  selected = null;
  nextBtn.disabled = true;

  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.innerHTML = `<span class="choice-label">${c}</span>`;
    btn.addEventListener('click', () => onSelect(i, btn));
    choicesEl.appendChild(btn);
  });
}

function onSelect(index, btn){
  // clear previous selection
  Array.from(choicesEl.children).forEach(ch => ch.classList.remove('selected'));
  btn.classList.add('selected');
  selected = index;
  nextBtn.disabled = false;
}

function onNext(){
  if (selected === null) return;
  const q = quizData[current];
  const choiceNodes = Array.from(choicesEl.children);

  // mark correct / wrong
  if (selected === q.answer){
    choiceNodes[selected].classList.add('correct');
    score++;
  } else {
    choiceNodes[selected].classList.add('wrong');
    choiceNodes[q.answer].classList.add('correct');
  }

  // disable choices after answering
  choiceNodes.forEach(n => n.onclick = null);
  nextBtn.disabled = true;

  // move to next after short delay
  setTimeout(() => {
    current++;
    if (current >= quizData.length) {
      showResult();
    } else {
      renderQuestion();
    }
  }, 900);
}

function showResult(){
  quizSection.hidden = true;
  resultSection.hidden = false;
  scoreText.textContent = `${score} / ${quizData.length} correct`;
  restartBtn.hidden = false;
}

function restart(){
  current = 0; selected = null; score = 0;
  quizSection.hidden = false;
  resultSection.hidden = true;
  restartBtn.hidden = true;
  renderQuestion();
}

/* Theme handling: toggle, persist in localStorage and set data-theme on documentElement */
function onThemeToggle(e){
  const dark = e.target.checked;
  setTheme(dark ? 'dark' : 'light');
}

function setTheme(name){
  if (name === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').checked = true;
    localStorage.setItem('preferred-theme','dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeToggle').checked = false;
    localStorage.setItem('preferred-theme','light');
  }
}

function applySavedTheme(){
  const saved = localStorage.getItem('preferred-theme');
  if (saved) {
    setTheme(saved);
    return;
  }
  // fallback to system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', init);
