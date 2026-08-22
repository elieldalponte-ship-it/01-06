document.addEventListener("DOMContentLoaded", () => {
    let audioAtual = null;

    // Função que cria um efeito sonoro de "clique/pop" na hora usando o próprio navegador
    function tocarEfeitoSonoro() {
        try {
            const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            const oscilador = contextoAudio.createOscillator();
            const ganho = contextoAudio.createGain();

            oscilador.type = "sine";
            oscilador.frequency.setValueAtTime(400, contextoAudio.currentTime);
            oscilador.frequency.exponentialRampToValueAtTime(800, contextoAudio.currentTime + 0.1);

            ganho.gain.setValueAtTime(0.1, contextoAudio.currentTime);
            ganho.gain.exponentialRampToValueAtTime(0.01, contextoAudio.currentTime + 0.1);

            oscilador.connect(ganho);
            ganho.connect(contextoAudio.destination);

            oscilador.start();
            oscilador.stop(contextoAudio.currentTime + 0.1);
        } catch (e) {
            console.log("Áudio não suportado ou bloqueado.");
        }
    }

    function falarTexto(texto) {
        if (audioAtual) {
            audioAtual.pause();
            audioAtual.currentTime = 0;
        }
        
        try {
            const textoCodificado = encodeURIComponent(texto);
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${textoCodificado}`;
            
            audioAtual = new Audio(url);
            audioAtual.play();
        } catch (erro) {
            console.error("Erro ao carregar a voz natural:", erro);
        }
    }

    // 1. Virar o cartão, tocar o som gerado e falar o verso
    const cartoes = document.querySelectorAll(".cartao-btn");
    cartoes.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Toca o efeitinho sonoro gerado na hora!
            tocarEfeitoSonoro();

            const estaVirado = btn.classList.toggle("virado");
            btn.setAttribute("aria-expanded", estaVirado);

            const frente = btn.querySelector(".cartao-frente");
            const verso = btn.querySelector(".cartao-verso");
            const textoVerso = verso.innerText;

            if (estaVirado) {
                frente.setAttribute("aria-hidden", "true");
                verso.setAttribute("aria-hidden", "false");
                setTimeout(() => { falarTexto(textoVerso); }, 300); 
            } else {
                frente.setAttribute("aria-hidden", "false");
                verso.setAttribute("aria-hidden", "true");
                if (audioAtual) audioAtual.pause(); 
            }
        });
    });

    // 2. Botão "Ouvir Página"
    const btnLeitura = document.getElementById("btn-leitura");
    let lendo = false;

    btnLeitura.addEventListener("click", () => {
        if (lendo) {
            if (audioAtual) audioAtual.pause();
            lendo = false;
            btnLeitura.textContent = "🔊 Ouvir Página";
        } else {
            let conteudo = document.querySelector("h2").innerText + ". ";
            conteudo += document.querySelector(".instrucao").innerText;
            
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

    // 4. Modo Dislexia
    const btnDislexia = document.getElementById("btn-dislexia");
    btnDislexia.addEventListener("click", () => {
        document.body.classList.toggle("modo-dislexia");
    });

    // 5. Zoom de Fonte
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
