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
        "aws-s3-detailed",
        "amazon-ebs",
        "ec2-instance-storage",
        "amazon-efs",
        "deep-dive-s3-cli",
        "amazon-s3-glacier",
        "aws-storage-gateway",
        "static-site-s3",
        "aws-rds-detailed",
        "aws-dynamodb-detailed",
        "aws-elasticache-detailed",
        "aws-redshift-detailed",
        "aws-glue-detailed",
    
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
        "aws-lambda-explanation",
        
        // Segurança e Conformidade
        "security-best-practices",
        "security-compliance-program",
        "security-resources",
        "iam-analysis",
        "aws-iam",
        "aws-secrets-manager-explanation",
        "aws-secrets-manager-detailed",
        "aws-shield-detailed",
        "aws-waf-detailed",
        "aws-fargate-detailed",
        "aws-guardduty-detailed",
        "aws-macie-detailed",
        "aws-kms-detailed",
        "aws-ssm-detailed",
       
    
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
        "cloud-computing": 0,
        "apis-and-rest": 6,
        "cloud-storage-overview": 12,
        "aws-computing-overview": 20,
        "security-best-practices": 30,
        "aws-cloudwatch": 35,
        "aws-organizations": 42,
        "aws-cloudformation": 49,
        "amazon-route-53": 54,
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
document.addEventListener('DOMContentLoaded', function() {
    const dots = document.querySelectorAll('.category-path .dot');
    const cloudIcons = document.querySelectorAll('.cloud-icon');
    const sections = document.querySelectorAll('section');
    
    // Mapeamento de categorias para a primeira seção
    const categoryMap = {
        'fundamentos': 'cloud-computing',
        'conceitos': 'apis-and-rest',
        'armazenamento': 'cloud-storage-overview',
        // Adicione as outras categorias...
    };
    
    // Clica em uma bolinha
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const sectionId = categoryMap[category];
            
            // Atualiza nuvens e bolinhas ativas
            cloudIcons.forEach(icon => icon.style.display = 'none');
            this.querySelector('.cloud-icon').style.display = 'block';
            
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Mostra a seção correspondente
            sections.forEach(section => {
                section.classList.remove('active');
                if(section.id === sectionId) {
                    section.classList.add('active');
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });
    
    // Atualiza bolinha ativa ao rolar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const activeSection = entry.target;
                const activeCategory = Object.keys(categoryMap).find(
                    key => categoryMap[key] === activeSection.id
                );
                
                if(activeCategory) {
                    dots.forEach(dot => {
                        dot.classList.remove('active');
                        dot.querySelector('.cloud-icon').style.display = 'none';
                    });
                    
                    const activeDot = document.querySelector(`.dot[data-category="${activeCategory}"]`);
                    if(activeDot) {
                        activeDot.classList.add('active');
                        activeDot.querySelector('.cloud-icon').style.display = 'block';
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
});
