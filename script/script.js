document.addEventListener("DOMContentLoaded", () => {
    // Array com os IDs das seções
    const sections = [
        // Fundamentos da Nuvem e AWS
        "cloud-computing",
        "what-is-aws",
        "aws-pricing",
        "aws-infrastructure-overview",
        "shared-responsibility-model",
        "data-center-to-cloud",
    
        // Conceitos Essenciais e Fundamentos de Rede
        "apis-and-rest",
        "amazon-vpc",
        "vpc-deep-dive",
        "vpc-connectivity-options",
        "network-security-troubleshooting",
        "security-groups",
    
        // Armazenamento na AWS
        "cloud-storage-overview",
        "amazon-ebs",
        "ec2-instance-storage",
        "amazon-efs",
        "deep-dive-s3-cli",
        "amazon-s3-glacier",
        "aws-storage-gateway",
        "static-site-s3",
    
        // Computação e Gerenciamento de Instâncias
        "aws-computing-overview",
        "computing-overview",
        "amazon-ec2",
        "manage-ec2-instances",
        "ami-strategy",
        "ec2-launch-templates",
        "ec2-auto-scaling",
        "elastic-load-balancing",
        "elb-listeners",
        "elastic-beanstalk",
        "containers-on-aws",
    
        // Segurança e Conformidade
        "security-best-practices",
        "security-compliance-program",
        "security-resources",
        "iam-analysis",
        "aws-iam",
    
        // Monitoramento, Automação e Gestão
        "aws-cloudwatch",
        "cloudwatch-logs-events",
        "aws-config",
        "aws-cloudtrail",
        "aws-systems-manager",
        "aws-step-functions",
        "aws-cli",
        "admin-tools",
    
        // Frameworks de Gestão e Planejamento
        "aws-organizations",
        "aws-tags",
        "aws-trusted-advisor",
        "cost-management",
        "aws-well-architected-framework",
        "aws-caf",
        "well-architected-design",
    
        // Ferramentas e Desenvolvimento Avançado
        "aws-cloudformation",
        "cloudformation-troubleshooting",
        "json-yaml-intro",
        "aws-athena",
        "api-gateway",
    
        // Rede e Entrega de Conteúdo
        "amazon-route-53",
        "amazon-cloudfront",
        "reliability-high-availability",
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
            updateNavigationCloud();
        }
    }

    // Função para navegar para a seção anterior
    function prevSection() {
        if (currentIndex > 0) {
            currentIndex--;
            showSection(currentIndex);
            updateNavigationCloud();
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

    // Mapeamento das categorias para os índices das seções
    const sectionCategories = {
        "Fundamentos da Nuvem e AWS": 0,
        "Conceitos Essenciais e Fundamentos de Rede": 6,
        "Armazenamento na AWS": 12,
        "Computação e Gerenciamento de Instâncias": 20,
        "Segurança e Conformidade": 30,
        "Monitoramento, Automação e Gestão": 35,
        "Frameworks de Gestão e Planejamento": 42,
        "Ferramentas e Desenvolvimento Avançado": 49,
        "Rede e Entrega de Conteúdo": 54,
    };

    // Criação da nuvem de navegação
    const navigationCloud = document.createElement("div");
    navigationCloud.id = "navigation-cloud";
    navigationCloud.style.display = "flex";
    navigationCloud.style.justifyContent = "center";
    navigationCloud.style.marginBottom = "20px";

    Object.keys(sectionCategories).forEach((category) => {
        const navItem = document.createElement("div");
        navItem.textContent = category;
        navItem.style.margin = "0 10px";
        navItem.style.cursor = "pointer";
        navItem.style.color = "blue";
        navItem.style.textDecoration = "underline";

        // Adiciona evento de clique para navegar diretamente à seção
        navItem.addEventListener("click", () => {
            currentIndex = sectionCategories[category];
            showSection(currentIndex);
            updateNavigationCloud();
        });

        navigationCloud.appendChild(navItem);
    });

    // Insere a nuvem de navegação e a imagem da nuvem
    const navigationContainer = document.getElementById("navigation-container");

    if (navigationContainer) {
        // Adiciona a imagem da nuvem
        const cloudImage = document.createElement("img");
        cloudImage.src = "img/cutecloud.gif";
        cloudImage.alt = "Cute Cloud";

        // Adiciona a nuvem de navegação
        navigationContainer.appendChild(cloudImage);
        navigationContainer.appendChild(navigationCloud);
    } else {
        console.error("O contêiner de navegação (navigation-container) não foi encontrado no HTML.");
    }

    // Função para atualizar a aparência da nuvem de navegação
    function updateNavigationCloud() {
        const currentCategory = Object.keys(sectionCategories).find(
            (category) =>
                sectionCategories[category] <= currentIndex &&
                currentIndex < sectionCategories[category] + 6
        );

        Array.from(navigationCloud.children).forEach((navItem) => {
            if (navItem.textContent === currentCategory) {
                navItem.style.fontWeight = "bold";
                navItem.style.color = "red";
            } else {
                navItem.style.fontWeight = "normal";
                navItem.style.color = "blue";
            }
        });
    }

    // Atualiza a nuvem de navegação ao carregar a página
    updateNavigationCloud();
});