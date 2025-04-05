// Atualiza o ano automaticamente
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar ano do copyright
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Função para copiar chave PIX
    window.copyPixKey = function() {
        const pixKey = "https://app.picpay.com/user/rafhaellopes"; // Mantenha sua chave PIX aqui
        
        navigator.clipboard.writeText(pixKey)
            .then(() => {
                // Melhor feedback visual que um alert
                const pixButton = document.querySelector('.pix-button');
                if (pixButton) {
                    const originalText = pixButton.textContent;
                    pixButton.textContent = "Copiado!";
                    setTimeout(() => {
                        pixButton.textContent = originalText;
                    }, 2000);
                }
            })
            .catch(err => {
                console.error("Erro ao copiar chave PIX:", err);
                alert("Não foi possível copiar. Tente manualmente: " + pixKey);
            });
    };
});