document.addEventListener("DOMContentLoaded", () => {
    // Array com os IDs das seções
    const sections = [
        "cloud-computing",
        "what-is-aws",
        "aws-pricing",
        "aws-infrastructure-overview",
        "shared-responsibility-model",
        "reliability-high-availability",
        "data-center-to-cloud",
        "apis-and-rest",
        "static-site-s3",
        "cloud-storage-overview",
        "amazon-ebs",
        "ec2-instance-storage",
        "amazon-efs",
        "deep-dive-s3-cli",
        "amazon-s3-glacier",
        "aws-storage-gateway",
        "amazon-vpc",
        "security-groups",
        "amazon-route-53",
        "amazon-cloudfront",
        "amazon-ec2",
        "aws-lambda",
        "aws-iam",
        "aws-cloudformation",
        "aws-cloudwatch",
        "aws-organizations",
        "aws-well-architected-framework",
        "aws-cli",
        "aws-systems-manager",
        "aws-step-functions",
        "aws-cloudtrail",
        "aws-config",
        "aws-trusted-advisor",
        "aws-athena",
        "aws-tags",
        "vpc-deep-dive",
        "vpc-connectivity-options",
        "network-security-troubleshooting",
        "aws-computing-overview",
        "manage-ec2-instances",
        "elastic-beanstalk",
        "computing-overview",
        "elastic-load-balancing",
        "elb-listeners",
        "ec2-auto-scaling",
        "containers-on-aws",
        "ami-strategy",
        "ec2-launch-templates",
        "security-best-practices",
        "security-compliance-program",
        "security-resources",
        "iam-analysis",
        "admin-tools",
        "api-gateway",
        "cloudwatch-logs-events",
        "cost-management",
        "json-yaml-intro",
        "cloudformation-troubleshooting",
        "aws-caf",
        "well-architected-design"
    ];

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

    const musicBtn = document.getElementById("music-btn");
    const musicIcon = document.getElementById("music-icon");
    const backgroundMusic = document.getElementById("background-music");

    let isPlaying = true; // A música começa tocando

    // Função para tocar a música
    function playMusic() {
        backgroundMusic.play().then(() => {
            isPlaying = true; // Atualizar o estado para "tocando"
            musicIcon.src = "img/pausebtnmusic.png"; // Alterar o ícone para "pause"
        }).catch((error) => {
            console.log("Erro ao tentar reproduzir a música:", error);
        });
    }

    // Função para pausar a música
    function pauseMusic() {
        backgroundMusic.pause();
        isPlaying = false; // Atualizar o estado para "pausado"
        musicIcon.src = "img/playbtnmusic.png"; // Alterar o ícone para "play"
    }

    // Adicionar evento de clique ao botão
    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            pauseMusic(); // Pausar a música
        } else {
            playMusic(); // Tocar a música
        }
    });

    // Tocar a música automaticamente ao carregar a página
    playMusic();

    // Alterar a cor dos itens <li> para branco
    document.querySelectorAll('li').forEach((item) => {
        item.style.color = 'black'; // Isso forçaria a cor branca nos itens <li>
    });
});