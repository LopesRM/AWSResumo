<link rel="icon" href="img/favicon.ico" type="image/x-ico">

.gif-intro {
    max-width: 80px; /* Reduz o tamanho do vídeo */
    height: auto; /* Mantém a proporção */
    border-radius: 10px; /* Opcional: bordas arredondadas */
}

.hidden {
    display: none; /* Oculta as seções que não estão sendo exibidas */
}

.shown {
    display: block; /* Exibe as seções que estão sendo exibidas */
}

.service {
    text-align: center;
    padding: 20px;
    margin: 20px auto;
    max-width: 800px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.service h2 {
    font-size: 2rem;
    color: #800080;
}

.service p {
    font-size: 1.2rem;
    color: #333;
    line-height: 1.6;
}

// Seleciona o título animado
const tituloAnimado = document.getElementById('titulo-animado');

// Inicializa o contador de cliques
let clickCount = 0;

// Adiciona um evento de clique ao título
tituloAnimado.addEventListener('click', () => {
    clickCount++; // Incrementa o contador

    // Verifica se o contador atingiu 7 cliques
    if (clickCount === 7) {
        // Redireciona para o link do YouTube
        window.location.href = 'https://www.youtube.com/watch?v=6RiIww6jVXw';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script carregado corretamente!");
    
    // Array com os IDs das seções
    const sections = ["intro", "ec2", "s3", "rds", "lambda", "cloudfront"];

    // Variável para rastrear a seção atual
    let currentIndex = 0; // Começa na primeira seção (índice 0)

    // Função para exibir a seção atual e ocultar as outras
    function showSection(index) {
        console.log(`Exibindo seção: ${sections[index]}`); // Log para depuração
        sections.forEach((sectionId, i) => {
            const section = document.getElementById(sectionId);
            if (section) {
                if (i === index) {
                    // Exibe a seção correspondente ao índice atual
                    section.classList.remove("hidden");
                    section.classList.add("shown");
                } else {
                    // Oculta as outras seções
                    section.classList.remove("shown");
                    section.classList.add("hidden");
                }
            } else {
                console.error(`Seção com ID "${sectionId}" não encontrada.`);
            }
        });
    }

    // Função para navegar para a próxima seção
    function nextSection() {
        if (currentIndex < sections.length - 1) {
            currentIndex++;
            showSection(currentIndex);
        }
    }

    // Função para navegar para a seção anterior
    function prevSection() {
        if (currentIndex > 0) {
            currentIndex--;
            showSection(currentIndex);
        }
    }

    // Adiciona eventos aos botões
    document.getElementById("next-btn").addEventListener("click", nextSection);
    document.getElementById("prev-btn").addEventListener("click", prevSection);

    // Exibe a primeira seção ao carregar a página
    showSection(currentIndex);

    // Simula um clique no botão "next-btn"
    document.getElementById("next-btn").click();

    // Acessa a lista de classes do elemento com ID "s3"
    document.getElementById("s3").classList;
});