// FETCH OBJECT FROM JSON FILE
let abstractQuiz;
let devQuiz;

fetch('./quiz.json').then(response => {
  return response.json();
}).then(data => {
  abstractQuiz = data.quizzes[0];
  devQuiz = data.quizzes[1];
}).catch(err => {
  console.log('Error fetching data');
});


// Query Selectors
const quiz1Button = document.getElementById('abstract-quiz');
const quiz2Button = document.getElementById('dev-quiz');
const headerContainer = document.querySelector('.header-container');
const buttonContainer = document.querySelector('.button-container');
const scoreElement = document.querySelector('.score');
const scoreNumber = document.getElementById('score-number');
const allContainer = document.querySelector('.container');

// Event Listeners
quiz1Button.addEventListener('click', () => changeQuizStatus('abstract', 1));
quiz2Button.addEventListener('click', () => changeQuizStatus('dev', 1));
buttonContainer.addEventListener('click', (e) => answerSelected(e));

// Quiz Controller
const quizStatus = {
  quizType: null,
  questionNumber: 0,
  score: 0
}


// Functions
const changeQuizStatus = (quizType, questionNumber) => {
  quizStatus.quizType = quizType;
  quizStatus.questionNumber = questionNumber;
  renderQuiz();
}

const renderQuiz = () => {
  let quiz;
  let questionNumber = quizStatus.questionNumber;
  if (quizStatus.quizType === 'abstract') {
    quiz = abstractQuiz;
  } else {
    quiz = devQuiz;
  }

  const quizQuestions = quiz.questions[questionNumber - 1];

  // Render the question header
  const header = `<h1 class="question">${quizQuestions.question}</h1>`;
  headerContainer.innerHTML = header;

  // Render the answer buttons
  buttonContainer.innerHTML = '';
  quizQuestions.answers.forEach((answer) => {
    const button = document.createElement('div');
    button.classList.add('button', 'answer-button');
    button.setAttribute('data-value', answer.value.toString());
    button.textContent = answer.content;
    buttonContainer.appendChild(button);
  });

  // Render the score
  scoreNumber.innerText = quizStatus.score;
  scoreElement.style.visibility = 'visible';
}

const answerSelected = (e) => {
  if (e.target.classList.contains('answer-button')) {
    if(e.target.dataset.value === 'true') {
      e.target.classList.add('correct', 'flashit');
      disablePointerEvents(buttonContainer.childNodes);
      quizStatus.score++;
    }

    if(e.target.dataset.value === 'false') {
      e.target.classList.add('wrong', 'flashit');
      disablePointerEvents(buttonContainer.childNodes);
    }

    quizStatus.questionNumber++;

    if (quizStatus.questionNumber < 4) {
      setTimeout(renderQuiz, 2000);
    } else {
      setTimeout(renderFinalScore, 2000);
    }
  }
}

const disablePointerEvents = (elements) => {
  elements.forEach((element) => {
    element.style.pointerEvents = 'none';
  });
}

const renderFinalScore = () => {
  // Pass or Fail Text Header Element
  const passOrFail = document.createElement('h1');
  let score = quizStatus.score / 3 * 100;

  let passOrFailText;
  if (score > 50) {
    passOrFailText = 'pass'
    passOrFail.style.color = 'green';
  } else {
    passOrFailText = 'fail'
    passOrFail.style.color = 'red';
  }
  passOrFail.innerText = passOrFailText;

  // Hide Score
  scoreElement.style.visibility = 'hidden';

  // Score Display Header Element
  const scoreDisplay = document.createElement('h1');
  scoreDisplay.innerText = score.toFixed(0) + '%';
  scoreDisplay.className = 'first';

  // Play Again Button
  const playAgain = document.createElement('div');
  playAgain.innerText = 'Play Again';
  playAgain.className = 'button play-button';
  playAgain.setAttribute('onclick', 'window.location.reload()');

  headerContainer.innerHTML = '';
  headerContainer.appendChild(scoreDisplay);
  headerContainer.appendChild(passOrFail);
  buttonContainer.innerHTML = '';
  buttonContainer.appendChild(playAgain);
}

