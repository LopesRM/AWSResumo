function showQuestion(question) {
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
      <h3>${question.text}</h3>
      <div class="options">
        ${question.options.map((opt, i) => `
          <button onclick="checkAnswer(${i})">${opt}</button>
        `).join('')}
      </div>
    `;
  }
  
  function checkAnswer(selectedIndex) {
    const isCorrect = currentQuestion.correctIndex === selectedIndex;
    
    if (isCorrect) {
      // Atualiza vida do boss
      bossHealth = Math.max(0, bossHealth - 10);
      window.updateBossHealth(bossHealth);
      
      // Próxima pergunta
      currentQuestion = getRandomQuestion();
      showQuestion(currentQuestion);
    }
  }