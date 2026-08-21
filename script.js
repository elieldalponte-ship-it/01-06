document.addEventListener("DOMContentLoaded", () => {

    // Função para falar usando voz natural de alta qualidade
    function falarTexto(texto) {
        if (typeof responsiveVoice !== "undefined") {
            // Cancela leituras anteriores
            responsiveVoice.cancel();
            
            // Fala em Português do Brasil com voz natural
            responsiveVoice.speak(texto, "Brazilian Portuguese Female", {
                rate: 1.0,  // Velocidade
                pitch: 1.0  // Tom
            });
        } else {
            // Fallback para a Web Speech API caso fique sem internet
            window.speechSynthesis.cancel();
            const mensagem = new SpeechSynthesisUtterance(texto);
            mensagem.lang = "pt-BR";
            window.speechSynthesis.speak(mensagem);
        }
    }

    // 1. Virar o cartão e falar o verso
    const cartoes = document.querySelectorAll(".cartao-btn");
    cartoes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const estaVirado = btn.classList.toggle("virado");
            btn.setAttribute("aria-expanded", estaVirado);

            const frente = btn.querySelector(".cartao-frente");
            const verso = btn.querySelector(".cartao-verso");
            const textoVerso = verso.querySelector("p").innerText;

            if (estaVirado) {
                frente.setAttribute("aria-hidden", "true");
                verso.setAttribute("aria-hidden", "false");
                falarTexto(textoVerso);
            } else {
                frente.setAttribute("aria-hidden", "false");
                verso.setAttribute("aria-hidden", "true");
            }
        });
    });

    // 2. Botão "Ouvir Página"
    const btnLeitura = document.getElementById("btn-leitura");
    let lendo = false;

    btnLeitura.addEventListener("click", () => {
        if (lendo) {
            if (typeof responsiveVoice !== "undefined") responsiveVoice.cancel();
            window.speechSynthesis.cancel();
            lendo = false;
            btnLeitura.textContent = "🔊 Ouvir Página";
        } else {
            const conteudo = document.querySelector("main").innerText;
            falarTexto(conteudo);
            lendo = true;
            btnLeitura.textContent = "⏹️ Parar Leitura";
        }
    });

    // 3. Alto Contraste
    const btnContraste = document.getElementById("btn-contraste");
    btnContraste.addEventListener("click", () => {
        document.body.classList.toggle("alto-contraste");
    });

    // 4. Zoom de Fonte
    let tamanhoFonte = 100;
    document.getElementById("btn-aumentar-fonte").addEventListener("click", () => {
        if (tamanhoFonte < 140) {
            tamanhoFonte += 10;
            document.documentElement.style.fontSize = `${tamanhoFonte}%`;
        }
    });

    document.getElementById("btn-diminuir-fonte").addEventListener("click", () => {
        if (tamanhoFonte > 80) {
            tamanhoFonte -= 10;
            document.documentElement.style.fontSize = `${tamanhoFonte}%`;
        }
    });
});
