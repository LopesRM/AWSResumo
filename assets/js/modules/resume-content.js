// Função para renderizar o conteúdo
function renderContent(categories) {
    const contentArea = document.getElementById('content-area');
    let contentHTML = '';
    
    // Flat sections array para manter a navegação linear
    const allSections = [];
    
    categories.forEach(category => {
        category.sections.forEach(section => {
            allSections.push({
                ...section,
                categoryName: category.name
            });
        });
    });

    // Renderiza as seções
    allSections.forEach((section, index) => {
        contentHTML += `
            <section class="content-section" id="section-${index}" ${index === 0 ? '' : 'style="display:none"'}>
                <span class="category-badge">${section.categoryName}</span>
                <h2 class="section-title">${section.title}</h2>
                <div class="section-content">${section.content}</div>
                <div class="section-tooltip">
                    <img src="../../assets/img/icons/cutecloud.gif" class="tooltip-icon">
                    <span class="tooltip-text">${section.tooltip || 'Informações adicionais'}</span>
                </div>
            </section>
        `;
    });
    
    contentArea.innerHTML = contentHTML;
    return allSections; // Retorna o array plano para navegação
}

// Função para configurar a navegação
function setupNavigation(categories) {
    const navDots = document.getElementById('nav-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    
    // Cria array plano de todas as seções
    const allSections = categories.flatMap(category => category.sections);
    let currentSection = 0;
    const totalSections = allSections.length;

    // Cria os dots de navegação (agora por categoria)
    function createDots() {
        navDots.innerHTML = '';
        categories.forEach((category, index) => {
            const dot = document.createElement('button');
            dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.categoryIndex = index;
            dot.ariaLabel = `Ir para categoria ${category.name}`;
            
            // Ícone da categoria
            const img = document.createElement('img');
            img.src = `../../assets/img/icons/${category.icon}`;
            img.alt = category.name;
            
            // Tooltip com nome da categoria
            const tooltip = document.createElement('span');
            tooltip.className = 'category-tooltip';
            tooltip.textContent = category.name;
            
            dot.appendChild(img);
            dot.appendChild(tooltip);
            
            dot.addEventListener('click', () => {
                // Encontra o índice da primeira seção da categoria
                let firstSectionInCategory = 0;
                for (let i = 0; i < index; i++) {
                    firstSectionInCategory += categories[i].sections.length;
                }
                goToSection(firstSectionInCategory);
            });
            
            navDots.appendChild(dot);
        });
    }

    // Atualiza o estado dos botões e dots
    function updateButtons() {
        prevBtn.disabled = currentSection === 0;
        nextBtn.disabled = currentSection === totalSections - 1;
        
        // Atualiza dots ativos
        let accumulatedSections = 0;
        categories.forEach((category, catIndex) => {
            const dot = document.querySelector(`.nav-dot[data-category-index="${catIndex}"]`);
            const categorySectionCount = category.sections.length;
            
            if (currentSection >= accumulatedSections && 
                currentSection < accumulatedSections + categorySectionCount) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
            
            accumulatedSections += categorySectionCount;
        });
    }

    // Navega para uma seção específica (mantida igual)
    function goToSection(index) {
        if (index < 0 || index >= totalSections) return;
        
        document.getElementById(`section-${currentSection}`).style.display = 'none';
        currentSection = index;
        document.getElementById(`section-${currentSection}`).style.display = 'block';
        
        updateButtons();
        document.getElementById(`section-${currentSection}`).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Event listeners (mantidos iguais)
    prevBtn.addEventListener('click', () => goToSection(currentSection - 1));
    nextBtn.addEventListener('click', () => goToSection(currentSection + 1));
    
    // Teclado e touch events (mantidos iguais)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            goToSection(currentSection - 1);
            prevBtn.classList.add('active-press');
            setTimeout(() => prevBtn.classList.remove('active-press'), 200);
        }
        if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            goToSection(currentSection + 1);
            nextBtn.classList.add('active-press');
            setTimeout(() => nextBtn.classList.remove('active-press'), 200);
        }
    });

    // Inicializa
    createDots();
    updateButtons();
}

// Código principal modificado
document.addEventListener('DOMContentLoaded', function() {
    fetch('../../assets/data/content.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar conteúdo');
            return response.json();
        })
        .then(data => {
            console.log('Dados carregados:', data);
            renderContent(data.categories);
            setupNavigation(data.categories);
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('content-area').innerHTML = `
                <div class="error-message">
                    <p>O conteúdo não pôde ser carregado. Verifique o console.</p>
                </div>`;
        });
});