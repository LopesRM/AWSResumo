const GAME_CONFIG = {
    totalTime: 3600,
    bossHealth: 100,
    baseDamage: 50.048,
    maxQuestions: 2,
    maxStreak: 10,
    timeBonus: 0.5,
    timeBonusPerMinute: 1,
};

// Inicializa Firebase
firebase.initializeApp(GAME_CONFIG.firebaseConfig);
const database = firebase.database();

// Função para controle de música
document.getElementById('music-btn').addEventListener('click', function() {
    const music = document.getElementById('background-music');
    const icon = document.getElementById('music-icon');
    
    if (music.paused) {
        music.play();
        icon.src = "img/pausebtnmusic.png";
    } else {
        music.pause();
        icon.src = "img/playbtnmusic.png";
    }
});

// Estado do jogo
const gameState = {
    currentStreak: 0, // Multiplicador atual
    maxStreak: 0, // Maior multiplicador
    timeLeft: GAME_CONFIG.totalTime,
    questionsAnswered: 0, // Total de perguntas respondidas
    correctAnswers: 0, // Total de respostas corretas
    bossHealth: GAME_CONFIG.bossHealth, // Vida do chefe
    totalDamage: 0, // Dano total causado ao chefe
    isGameActive: false, // Indica se o jogo está ativo
    timerInterval: null, // Intervalo do temporizador
    usedQuestionIndices: [], // Índices de perguntas já usados
    playerName: "" // Adicionado para armazenar nome do jogador
};

// Elementos DOM
const domElements = {
    question: document.getElementById('question'),
    options: document.getElementById('options'),
    bossHealth: document.getElementById('bossHealth'),
    timer: document.getElementById('timer'),
    streak: document.getElementById('streak'),
    quizSection: document.getElementById('quizSection'),
    resultSection: document.getElementById('resultSection'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultStats: document.getElementById('resultStats'),
    restartBtn: document.getElementById('restartBtn'),
    bossVideo: document.getElementById('bossVideo'),
    playerNameInput: document.getElementById('playerName'), // Adicione um input no HTML
    startButton: document.getElementById('startButton') // Adicione um botão de início
};

// Banco de perguntas AWS com explicações
const awsQuestions = [
    {
        question: "Qual serviço é um data warehouse na nuvem?",
        options: ["Amazon DynamoDB", "Amazon RDS", "Amazon Redshift", "Amazon ElastiCache"],
        answer: 1, //2
        explanation: "Amazon Redshift é um data warehouse em nuvem rápido e escalável. DynamoDB é NoSQL, RDS é banco relacional e ElastiCache é serviço de cache."
    },
    {
        question: "Qual serviço AWS é usado para armazenamento de objetos?",
        options: ["EC2", "S3", "RDS", "Lambda"],
        answer: 1,
        explanation: "Amazon S3 (Simple Storage Service) é o serviço de armazenamento de objetos escalável da AWS."
    },
    // Adicione mais perguntas com o mesmo formato...
];

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

function setupEventListeners() {
    if (domElements.restartBtn) {
        domElements.restartBtn.addEventListener('click', startGame);
    }
    if (domElements.startButton) {
        domElements.startButton.addEventListener('click', () => {
            gameState.playerName = domElements.playerNameInput.value.trim() || "Jogador";
            startGame();
        });
    }
}

function initializeGame() {
    // Mostrar tela inicial com input de nome
    showStartScreen();
}

function showStartScreen() {
    // Implemente uma tela inicial com input para o nome do jogador
    // Exemplo: <div id="startScreen"><input id="playerName" placeholder="Seu nome"><button id="startButton">Começar</button></div>
}

// Inicia o jogo
function startGame() {
    resetGameState();
    updateGameUI();
    startGameTimer();
    loadRandomQuestion();
    
    domElements.quizSection.style.display = 'block';
    domElements.resultSection.style.display = 'none';
    
    domElements.bossVideo.currentTime = 0;
    domElements.bossVideo.play();
}

function resetGameState() {
    gameState.currentStreak = 0;
    gameState.maxStreak = 0;
    gameState.timeLeft = GAME_CONFIG.totalTime;
    gameState.questionsAnswered = 0;
    gameState.correctAnswers = 0;
    gameState.bossHealth = GAME_CONFIG.bossHealth;
    gameState.totalDamage = 0;
    gameState.isGameActive = true;
    gameState.usedQuestionIndices = [];
}

function loadRandomQuestion() {
    if (!gameState.isGameActive) return;
    
    if (gameState.usedQuestionIndices.length >= awsQuestions.length) {
        gameState.usedQuestionIndices = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * awsQuestions.length);
    } while (gameState.usedQuestionIndices.includes(randomIndex));
    
    gameState.usedQuestionIndices.push(randomIndex);
    const currentQuestion = awsQuestions[randomIndex];
    
    domElements.question.textContent = currentQuestion.question;
    domElements.options.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => handleAnswerSelection(
            index, 
            currentQuestion.answer,
            currentQuestion.explanation
        ));
        domElements.options.appendChild(optionButton);
    });
}

function handleAnswerSelection(selectedIndex, correctIndex, explanation) {
    if (!gameState.isGameActive) return;
    
    gameState.questionsAnswered++;
    const allOptionButtons = document.querySelectorAll('.option-button');
    
    allOptionButtons.forEach(button => {
        button.disabled = true;
    });
    
    allOptionButtons[correctIndex].classList.add('correct');
    
    if (selectedIndex === correctIndex) {
        gameState.correctAnswers++;
        gameState.currentStreak++;
        
        if (gameState.currentStreak > gameState.maxStreak) {
            gameState.maxStreak = gameState.currentStreak;
        }
        
        const damageDealt = GAME_CONFIG.baseDamage * gameState.currentStreak;
        gameState.bossHealth -= damageDealt;
        gameState.totalDamage += damageDealt;
        
        if (gameState.bossHealth <= 0) {
            gameState.bossHealth = 0;
            endGame(true);
            return;
        }
        
        updateGameUI();
    } else {
        allOptionButtons[selectedIndex].classList.add('incorrect');
        gameState.currentStreak = 0;
        updateStreakUI();
    }
    
    showExplanation(explanation);
}

function showExplanation(explanation) {
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation-box';
    explanationDiv.innerHTML = `
        <p class="explanation-text">${explanation}</p>
        <button class="continue-button pulse">Continuar</button>
    `;
    
    document.querySelector('.question-container').appendChild(explanationDiv);
    
    const continueBtn = document.querySelector('.continue-button');
    continueBtn.addEventListener('click', () => {
        // Remove a animação de pulso ao interagir
        continueBtn.classList.remove('pulse');
        
        document.querySelector('.explanation-box').remove();
        
        if (gameState.isGameActive) {
            if (gameState.questionsAnswered >= GAME_CONFIG.maxQuestions || gameState.bossHealth <= 0) {
                endGame(true);
            } else {
                loadRandomQuestion();
            }
        }
    });
    
    // Remove a animação após alguns segundos
    setTimeout(() => {
        continueBtn.classList.remove('pulse');
    }, 3000);
}

function updateGameUI() {
    updateBossHealthUI();
    updateTimerUI();
    updateStreakUI();
}

function updateBossHealthUI() {
    domElements.bossHealth.style.width = `${gameState.bossHealth}%`;
}

function updateTimerUI() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    domElements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStreakUI() {
    domElements.streak.textContent = `Multiplicador: ${gameState.currentStreak}x`;
}

function startGameTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerUI();
        
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

async function endGame(isVictory) {
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
    domElements.bossVideo.pause();
    
    // Cálculo da pontuação final
    const timeBonus = Math.floor(gameState.timeLeft / 60) * GAME_CONFIG.timeBonusPerMinute;
    const rawScore = gameState.totalDamage + timeBonus;
    const finalScore = rawScore * (gameState.maxStreak > 0 ? gameState.maxStreak : 1);
    
    // Mostra resultados
    domElements.quizSection.style.display = 'none';
    domElements.resultSection.style.display = 'block';
    
    domElements.resultsTitle.textContent = isVictory ? 'BOSS DERROTADO!' : 'TEMPO ESGOTADO!';
    domElements.resultStats.innerHTML = `
        <p>Jogador: ${gameState.playerName}</p>
        <p>Respostas corretas: ${gameState.correctAnswers}/${gameState.questionsAnswered}</p>
        <p>Maior multiplicador: ${gameState.maxStreak}x</p>
        <p>Dano causado: ${gameState.totalDamage}%</p>
        <p>Bônus de tempo: +${timeBonus}%</p>
        <p>Pontuação bruta: ${rawScore}%</p>
        <h3>PONTUAÇÃO FINAL: ${finalScore}%</h3>
    `;
    
    // Salva a pontuação no banco de dados
    await saveScoreToDatabase(gameState.playerName, finalScore, gameState.maxStreak);
}

async function saveScoreToDatabase(playerName, score, maxStreak) {
    try {
        const scoresRef = database.ref('scores');
        
        await scoresRef.push({
            player: playerName,
            finalScore: score,
            maxStreak: maxStreak,
            correctAnswers: gameState.correctAnswers,
            totalQuestions: gameState.questionsAnswered,
            totalDamage: gameState.totalDamage,
            date: new Date().toLocaleString('pt-BR'),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        console.log("Pontuação salva com sucesso no Firebase!");
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        saveToLocalStorage(playerName, score, maxStreak);
    }
}

function saveToLocalStorage(playerName, score, maxStreak) {
    const scores = JSON.parse(localStorage.getItem('awsScores') || '[]');
    scores.push({
        player: playerName,
        score: score,
        streak: maxStreak,
        date: new Date().toISOString()
    });
    localStorage.setItem('awsScores', JSON.stringify(scores));
}

// Exemplo: Buscar os 10 melhores scores
function getTopScores() {
    return database.ref('scores')
        .orderByChild('finalScore')
        .limitToLast(10)
        .once('value');
}

// Adicione esta função para mostrar um ranking simples
async function showLeaderboard() {
    const snapshot = await database.ref('scores')
        .orderByChild('finalScore')
        .limitToLast(5)
        .once('value');
    
    const scores = [];
    snapshot.forEach(child => {
        scores.push(child.val());
    });
    
    console.log("Top 5 Scores:", scores.reverse());
}