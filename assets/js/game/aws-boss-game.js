// AWS Boss Battle Game
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const difficultyScreen = document.getElementById('difficulty-screen');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const bossHealth = document.getElementById('boss-health');
    const healthText = document.getElementById('health-text');
    const scoreElement = document.getElementById('score');
    const comboElement = document.getElementById('combo');
    const questionsCount = document.getElementById('questions');
    const bossImage = document.getElementById('boss-image');
    const playerNameInput = document.getElementById('player-name');
    
    // Variáveis do jogo
    let playerName = '';
    let difficulty = '';
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let combo = 1;
    let correctAnswersInRow = 0;
    let timeLimit = 30; // segundos por pergunta
    let timeLeft = timeLimit;
    let timerInterval;
    let gameStarted = false;
    let bossMaxHealth = 500;
    let bossCurrentHealth = bossMaxHealth;
    let questionWeights = {
        'easy': 10,
        'medium': 20,
        'hard': 30
    };
    
    // Boss phases - porcentagem de vida para mudar de fase
    const bossPhases = {
        70: {
            image: '../../assets/img/game/vampirelord.gif',
            message: 'O Boss está ficando irritado!'
        },
        40: {
            image: '../../assets/img/game/vampirelord-angry.gif',
            message: 'O Boss está furioso!'
        },
        10: {
            image: '../../assets/img/game/vampirelord-rage.gif',
            message: 'O Boss está em fúria total!'
        }
    };

    // Carregar background
    function loadBackground() {
        const bg = new Image();
        bg.src = '../../assets/img/game/castle-bg.png';
        bg.onload = () => {
            document.body.style.backgroundImage = `url('${bg.src}')`;
        };
    }

    // Inicialização do jogo
    function initGame() {
        playerName = playerNameInput.value || 'Cloud Adventurer';
        difficultyScreen.style.display = 'block';
        questionContainer.style.display = 'none';
        
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                difficulty = button.dataset.difficulty;
                startGame(difficulty);
            });
        });
    }
    
    // Começar o jogo com a dificuldade selecionada
    async function startGame(difficulty) {
        difficultyScreen.style.display = 'none';
        questionContainer.style.display = 'block';
        
        // Carregar perguntas baseado na dificuldade
        try {
            const response = await fetch(`../../assets/data/question/${difficulty}.json`);
            if (!response.ok) throw new Error('Falha ao carregar perguntas');
            
            questions = await response.json();
            questions = shuffleArray(questions).slice(0, 80); // Pegar 10 perguntas aleatórias
            
            // Atualizar contador de perguntas
            questionsCount.textContent = `Perguntas: 0/${questions.length}`;
            
            // Resetar status do jogo
            score = 0;
            combo = 1;
            correctAnswersInRow = 0;
            bossCurrentHealth = bossMaxHealth;
            updateBossHealth();
            updateScore();
            
            // Começar a primeira pergunta
            gameStarted = true;
            showQuestion();
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            feedback.textContent = 'Erro ao carregar perguntas. Por favor, recarregue a página.';
            feedback.style.color = 'red';
        }
    }
    
    // Mostrar a pergunta atual
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }
        
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        
        // Limpar opções anteriores
        optionsContainer.innerHTML = '';
        
        // Embaralhar e adicionar opções
        const shuffledOptions = shuffleArray([...question.incorrect_answers, question.correct_answer]);
        
        shuffledOptions.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option-btn';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => checkAnswer(option, question.correct_answer, question.explanation));
            optionsContainer.appendChild(optionButton);
        });
        
        // Atualizar contador de perguntas
        questionsCount.textContent = `Perguntas: ${currentQuestionIndex + 1}/${questions.length}`;
        
        // Iniciar temporizador
        startTimer();
    }
    
 // Verificar resposta
function checkAnswer(selectedAnswer, correctAnswer, explanation) {
    // Bloquear todos os botões imediatamente
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.disabled = true;
        
        // Destacar visualmente
        if (button.textContent === selectedAnswer) {
            button.classList.add(selectedAnswer === correctAnswer ? 'selected-correct' : 'selected-wrong');
        }
        if (button.textContent === correctAnswer && selectedAnswer !== correctAnswer) {
            button.classList.add('show-correct');
        }
    });

    clearInterval(timerInterval);
    
    const isCorrect = selectedAnswer === correctAnswer;
    const question = questions[currentQuestionIndex];
    const weight = questionWeights[question.difficulty] || 10;
    
    // Efeito visual de feedback
    document.body.classList.add(isCorrect ? 'correct-feedback' : 'wrong-feedback');
    setTimeout(() => {
        document.body.classList.remove('correct-feedback', 'wrong-feedback');
    }, 1000);

    // Feedback textual
    if (explanation) {
        feedback.innerHTML = isCorrect 
            ? `<span style="color:lime">✔ Correto!</span><br>${explanation}`
            : `<span style="color:red">✖ Errado! Resposta correta: ${correctAnswer}</span><br>${explanation}`;
    } else {
        feedback.innerHTML = isCorrect
            ? `<span style="color:lime">✔ Correto!</span>`
            : `<span style="color:red">✖ Errado! Resposta correta: ${correctAnswer}</span>`;
    }
    
    // Cálculo de pontos
    const timeBonus = Math.floor((timeLeft / timeLimit) * 10);
    let pointsEarned = weight + timeBonus;
    
    if (isCorrect) {
        correctAnswersInRow++;
        combo = Math.min(10, Math.floor(correctAnswersInRow / 3) + 1);
        pointsEarned *= combo;
        score += pointsEarned;
        
        // Dano ao boss
        const damage = calculateDamage(pointsEarned);
        bossCurrentHealth = Math.max(0, bossCurrentHealth - damage);
        updateBossHealth();
        checkBossPhase();
    } else {
        correctAnswersInRow = 0;
        combo = 1;
        score = Math.max(0, score - (weight / 2));
    }
    
    updateScore();
    
    // Transição para próxima pergunta
    setTimeout(() => {
        feedback.textContent = '';
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

    // Calcular dano ao boss
    function calculateDamage(points) {
        // Dano baseado nos pontos, mas ajustado para a barra de vida do boss
        const maxDamage = 15; // Máximo de dano por acerto
        const scaledDamage = (points / 100) * maxDamage * combo;
        return Math.min(maxDamage, scaledDamage);
    }
    
    // Atualizar barra de vida do boss
    function updateBossHealth() {
        const healthPercentage = (bossCurrentHealth / bossMaxHealth) * 100;
        bossHealth.style.width = `${healthPercentage}%`;
        healthText.textContent = `${Math.round(healthPercentage)}%`;
        
        // Mudar cor conforme a vida
        if (healthPercentage > 70) {
            bossHealth.style.backgroundColor = 'green';
        } else if (healthPercentage > 30) {
            bossHealth.style.backgroundColor = 'orange';
        } else {
            bossHealth.style.backgroundColor = 'red';
        }
    }
    
    // Verificar se o boss mudou de fase
    function checkBossPhase() {
        const healthPercentage = (bossCurrentHealth / bossMaxHealth) * 100;
        
        for (const [threshold, phase] of Object.entries(bossPhases)) {
            if (healthPercentage <= threshold && healthPercentage > (threshold - 15)) {
                bossImage.src = phase.image;
                feedback.textContent = phase.message;
                break;
            }
        }
    }
    
    // Atualizar pontuação na UI
    function updateScore() {
        scoreElement.textContent = `Score: ${Math.round(score)}`;
        comboElement.textContent = `Combo: x${combo}`;
    }
    
    // Iniciar temporizador
    function startTimer() {
        timeLeft = timeLimit;
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeOut();
            }
        }, 1000);
    }
    
    // Atualizar display do temporizador
    function updateTimerDisplay() {
        const timerElement = document.querySelector('.timer');
        if (!timerElement) {
            // Criar elemento do timer se não existir
            const timer = document.createElement('div');
            timer.className = 'timer';
            questionContainer.insertBefore(timer, questionText.nextSibling);
        } else {
            timerElement.textContent = `Tempo: ${timeLeft}s`;
            timerElement.style.color = timeLeft <= 5 ? 'red' : 'white';
        }
    }
    
    // Tempo esgotado
    function timeOut() {
        feedback.textContent = 'Tempo esgotado!';
        feedback.style.color = 'red';
        
        const question = questions[currentQuestionIndex];
        setTimeout(() => {
            feedback.textContent = `A resposta correta era: ${question.correct_answer}`;
            
            // Penalidade por tempo esgotado
            correctAnswersInRow = 0;
            combo = 1;
            updateScore();
            
            // Próxima pergunta após delay
            setTimeout(() => {
                feedback.textContent = '';
                currentQuestionIndex++;
                showQuestion();
            }, 2000);
        }, 1000);
    }
    
    // Finalizar jogo
    function endGame() {
        gameStarted = false;
        clearInterval(timerInterval);
        
        // Calcular pontuação final com bônus
        const timeBonus = Math.floor((timeLeft / (timeLimit * questions.length)) * 100);
        const finalScore = Math.round(score + (score * (timeBonus / 100)));
        
        // Mostrar resultados
        questionText.textContent = 'Fim do Jogo!';
        optionsContainer.innerHTML = `
            <div class="results">
                <h3>${playerName}, sua pontuação final:</h3>
                <p>Score: ${finalScore}</p>
                <p>Dificuldade: ${difficulty.toUpperCase()}</p>
                <p>Acertos consecutivos máximos: ${correctAnswersInRow}</p>
                <p>Combo máximo: x${combo}</p>
                <button id="share-btn" class="share-btn">Compartilhar</button>
                <button id="restart-btn" class="restart-btn">Jogar Novamente</button>
            </div>
        `;
        
        // Configurar botões
        document.getElementById('share-btn').addEventListener('click', shareScore);
        document.getElementById('restart-btn').addEventListener('click', () => {
            currentQuestionIndex = 0;
            initGame();
        });
        
        // Salvar pontuação no localStorage
        saveScore(playerName, finalScore, difficulty);
        
    }
    
    // Compartilhar pontuação
    function shareScore() {
        const finalScore = Math.round(score);
        const shareText = `🎮 ${playerName} derrotou o AWS Boss! 🏆\n` +
                         `Pontuação: ${finalScore} pontos\n` +
                         `Dificuldade: ${difficulty.toUpperCase()}\n` +
                         `Acertos consecutivos: ${correctAnswersInRow}\n` +
                         `Combo máximo: x${combo}\n\n` +
                         `Tente você também: ${window.location.href}`;
    
        if (navigator.share) {
            navigator.share({
                title: 'AWS Boss Battle - Minha Pontuação',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('Erro ao compartilhar:', err);
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    }
    
    function fallbackShare(text) {
        // Tenta usar a API de área de transferência
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Pontuação copiada! Cole nas suas redes sociais.');
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                showShareModal(text);
            });
        } else {
            showShareModal(text);
        }
    }
    
    function showShareModal(text) {
        // Cria um modal para exibir o texto de compartilhamento
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const content = document.createElement('div');
        content.style.background = 'rgba(0,0,0,0.9)';
        content.style.padding = '2rem';
        content.style.borderRadius = '10px';
        content.style.border = '2px solid #ae00ff';
        content.style.maxWidth = '80%';
        content.style.textAlign = 'center';
        
        const title = document.createElement('h3');
        title.textContent = 'Compartilhar Pontuação';
        title.style.color = '#ae00ff';
        title.style.marginBottom = '1rem';
        
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.width = '100%';
        textArea.style.minHeight = '150px';
        textArea.style.marginBottom = '1rem';
        textArea.style.padding = '0.5rem';
        textArea.style.background = '#111';
        textArea.style.color = 'white';
        textArea.style.border = '1px solid #ae00ff';
        textArea.readOnly = true;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fechar';
        closeBtn.style.padding = '0.5rem 1rem';
        closeBtn.style.background = '#ae00ff';
        closeBtn.style.color = 'black';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        content.appendChild(title);
        content.appendChild(textArea);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        
        document.body.appendChild(modal);
    }
    
    // Fallback para compartilhamento
    function fallbackShare(text) {
        // Copiar para área de transferência
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado para a área de transferência! Cole nas suas redes sociais.');
        }).catch(err => {
            console.log('Erro ao copiar:', err);
            prompt('Copie o texto abaixo para compartilhar:', text);
        });
    }
    
    // Salvar pontuação no localStorage
    async function saveScore(name, score, difficulty) {
        // 1. Salva no localStorage (como antes)
        const localScores = JSON.parse(localStorage.getItem('awsBossScores') || '[]');
        localScores.push({ name, score, difficulty, date: new Date().toISOString() });
        localStorage.setItem('awsBossScores', JSON.stringify(localScores));
        
        try {
            const response = await fetch('/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score, difficulty })
            });
            console.log('Score saved to server:', await response.json());
        } catch (error) {
            console.error('Error saving to server:', error);
        }
    

        // Manter apenas as 10 melhores pontuações
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 10) scores.length = 10;
        
        localStorage.setItem('awsBossScores', JSON.stringify(scores));
    }
    
    // Funções utilitárias
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    
    // Iniciar o jogo quando a página carregar
    loadBackground();
    initGame();
});

// Adicione esta função para obter a posição no ranking
async function getPlayerRank() {
    const scores = JSON.parse(localStorage.getItem('awsBossScores')) || [];
    if (scores.length === 0) return 1; // Se não há scores, é o primeiro
    
    // Ordena do maior para o menor
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    
    // Encontra a posição do jogador
    const playerIndex = sortedScores.findIndex(score => 
        score.name === playerName && score.score === Math.round(score)
    );
    
    return playerIndex !== -1 ? playerIndex + 1 : sortedScores.length + 1;
}

// Função de compartilhamento atualizada
async function shareScore() {
    const finalScore = Math.round(score);
    const rank = await getPlayerRank();
    
    const shareText = `🏆 *AWS Boss Battle* 🏆\n` +
                     `👤 Jogador: ${playerName}\n` +
                     `🎯 Pontuação: ${finalScore} pontos\n` +
                     `🥇 Posição no Ranking: ${rank}º lugar\n` +
                     `💪 Dificuldade: ${difficulty.toUpperCase()}\n\n` +
                     `🔥 Tente bater meu recorde: ${window.location.href}\n` +
                     `#AWSBossBattle #CloudGaming`;
    
    // Verifica se é mobile (com API de compartilhamento)
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Minha pontuação no AWS Boss Battle: ${finalScore}`,
                text: shareText,
                url: window.location.href
            });
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
            copyToClipboard(shareText);
        }
    } else {
        copyToClipboard(shareText);
    }
}

// Função para copiar para área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Mostra feedback visual
        const feedback = document.createElement('div');
        feedback.textContent = 'Pontuação copiada! Cole no WhatsApp, Discord, etc.';
        feedback.style.position = 'fixed';
        feedback.style.bottom = '20px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#ae00ff';
        feedback.style.color = 'black';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '1000';
        feedback.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 3000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        showShareModal(text);
    });
}

// Modal alternativo para desktop
function showShareModal(text) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const content = document.createElement('div');
    content.style.background = 'linear-gradient(135deg, #232f3e, #000)';
    content.style.padding = '2rem';
    content.style.borderRadius = '10px';
    content.style.border = '2px solid #ae00ff';
    content.style.maxWidth = '90%';
    content.style.width = '500px';
    content.style.textAlign = 'center';
    content.style.boxShadow = '0 0 20px rgba(174, 0, 255, 0.7)';
    
    const title = document.createElement('h3');
    title.textContent = 'Compartilhar Pontuação';
    title.style.color = '#ae00ff';
    title.style.marginBottom = '1.5rem';
    title.style.fontSize = '1.5rem';
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.width = '100%';
    textArea.style.minHeight = '150px';
    textArea.style.marginBottom = '1.5rem';
    textArea.style.padding = '1rem';
    textArea.style.background = '#111';
    textArea.style.color = 'white';
    textArea.style.border = '1px solid #ae00ff';
    textArea.style.borderRadius = '5px';
    textArea.readOnly = true;
    textArea.style.fontFamily = '"Jersey 15", sans-serif';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fechar';
    closeBtn.style.padding = '0.7rem 1.5rem';
    closeBtn.style.background = '#ae00ff';
    closeBtn.style.color = 'black';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontFamily = '"Jersey 15", sans-serif';
    closeBtn.style.fontSize = '1rem';
    closeBtn.style.transition = 'all 0.3s';
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    closeBtn.onmouseover = () => {
        closeBtn.style.background = '#c342ff';
        closeBtn.style.transform = 'scale(1.05)';
    };
    
    closeBtn.onmouseout = () => {
        closeBtn.style.background = '#ae00ff';
        closeBtn.style.transform = 'scale(1)';
    };
    
    content.appendChild(title);
    content.appendChild(textArea);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    
    document.body.appendChild(modal);
    
    // Seleciona o texto automaticamente
    textArea.select();
}