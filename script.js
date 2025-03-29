document.addEventListener("DOMContentLoaded", () => {
    // Array com os IDs das seções
    const sections = ["intro", "ec2", "s3", "rds", "lambda", "cloudfront"];

    // Variável para rastrear a seção atual
    let currentIndex = 0; // Começa na primeira seção (índice 0)

    // Função para exibir a seção atual e ocultar as outras
    function showSection(index) {
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
});