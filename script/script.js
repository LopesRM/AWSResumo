document.addEventListener("DOMContentLoaded", () => {
    // Array com os IDs das seções (mantido igual ao seu original)
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

    // Mapeamento de categorias para índices de seções
    const categoryMap = {
        'fundamentos': 0,       // cloud-computing
        'conceitos': 6,         // apis-and-rest
        'armazenamento': 12,    // cloud-storage-overview
        'computacao': 26,       // aws-computing-overview
        'seguranca': 38,        // security-best-practices
        'monitoramento': 52,    // aws-cloudwatch
        'frameworks': 60,       // aws-organizations
        'ferramentas': 67,      // aws-cloudformation
        'rede': 72              // amazon-route-53
    };

    // Variável para rastrear a seção atual
    let currentIndex = 0;

    // Função para exibir a seção atual e ocultar as outras
    function showSection(index) {
        sections.forEach((sectionId, i) => {
            const section = document.getElementById(sectionId);
            if (section) {
                if (i === index) {
                    section.classList.remove("hidden");
                    section.classList.add("shown");
                } else {
                    section.classList.remove("shown");
                    section.classList.add("hidden");
                }
            }
        });
        
        // Atualiza os dots e a nuvem de navegação
        updateActiveDot();
        updateNavigationCloud();
    }

    // Funções de navegação
    function nextSection() {
        if (currentIndex < sections.length - 1) {
            currentIndex++;
            showSection(currentIndex);
        }
    }

    function prevSection() {
        if (currentIndex > 0) {
            currentIndex--;
            showSection(currentIndex);
        }
    }

    // Função para navegar diretamente para uma categoria
    function goToCategory(category) {
        const targetIndex = categoryMap[category];
        if (targetIndex !== undefined) {
            currentIndex = targetIndex;
            showSection(currentIndex);
        }
    }

    // Atualiza o dot ativo com base na seção atual
    function updateActiveDot() {
        const dots = document.querySelectorAll('.dot');
        const cloudIcons = document.querySelectorAll('.cloud-icon');
        
        // Encontra a categoria atual
        let currentCategory = null;
        for (const [category, index] of Object.entries(categoryMap)) {
            if (currentIndex >= index) {
                currentCategory = category;
            }
        }
        
        // Atualiza todos os dots
        dots.forEach(dot => {
            const dotCategory = dot.getAttribute('data-category');
            dot.classList.remove('active', 'visited');
            
            if (dotCategory === currentCategory) {
                dot.classList.add('active');
                dot.querySelector('.cloud-icon').style.display = 'block';
            } else if (categoryMap[dotCategory] < currentIndex) {
                dot.classList.add('visited');
            }
        });
    }
    function updateNavigationCloud() {
        const navItems = document.querySelectorAll('#navigation-cloud div');
        let currentCategory = null;
        
        // Remove a classe ativa de todos os itens primeiro
        navItems.forEach(navItem => {
            navItem.classList.remove('nav-cloud-active');
            navItem.style.fontWeight = "normal";
            navItem.style.color = "blue";
        });
        
        // Determina a categoria atual
        for (const [category, index] of Object.entries(categoryMap)) {
            if (currentIndex >= index) {
                currentCategory = category;
            }
        }
        
        // Atualiza o item ativo
        navItems.forEach(navItem => {
            if (navItem.textContent === currentCategory) {
                navItem.classList.add('nav-cloud-active');
                navItem.style.fontWeight = "bold";
            }
        });
    }

    // Configura eventos para os dots
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const category = dot.getAttribute('data-category');
            goToCategory(category);
        });
    });

    // Configura eventos para os botões de navegação
    document.getElementById("next-btn")?.addEventListener("click", nextSection);
    document.getElementById("prev-btn")?.addEventListener("click", prevSection);

    // Configura eventos para a nuvem de navegação
    document.querySelectorAll('#navigation-cloud div').forEach(navItem => {
        navItem.addEventListener('click', () => {
            goToCategory(navItem.textContent);
        });
    });

    // Configuração do player de música (mantido igual)
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = document.getElementById("music-icon");
    const backgroundMusic = document.getElementById("background-music");
    let isPlaying = true;

    function playMusic() {
        backgroundMusic.play().then(() => {
            isPlaying = true;
            musicIcon.src = "img/pausebtnmusic.png";
        }).catch((error) => {
            console.log("Erro ao tentar reproduzir a música:", error);
        });
    }

    function pauseMusic() {
        backgroundMusic.pause();
        isPlaying = false;
        musicIcon.src = "img/playbtnmusic.png";
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }

    // Inicialização
    showSection(currentIndex);
    playMusic();

    // Garante que os itens de lista tenham cor preta
    document.querySelectorAll('li').forEach((item) => {
        item.style.color = 'black';
    });
});