let gamepadIndex = null;
let controleConectado = false;
const estadoBotoes = {};
const efeitos = {
  0: "balerina",    // Botão A
  1: "miau",        // Botão B
  2: "milkshake",   // Botão X
  3: "pew",         // Botão Y
  4: "sahur",       // L1 / LB
  5: "vaca",        // R1 / RB
  8: "tralalero"    // Select / Back
};

// Guardar áudios e estado para parar se necessário
const efeitosAtivos = {};

window.addEventListener("gamepadconnected", (e) => {
  if (controleConectado) return;

  gamepadIndex = e.gamepad.index;
  controleConectado = true;

  document.getElementById("mensagem").textContent = "controle conectado";

  const somConexao = new Audio("audio/conectado.mp3");
  somConexao.play().catch(err => console.warn("Erro ao tocar som de conexão:", err));

  updateLoop();
});

function updateLoop() {
  const gamepad = navigator.getGamepads()[gamepadIndex];

  if (gamepad) {
    for (const botao in efeitos) {
      const index = parseInt(botao);
      const nome = efeitos[botao];
      const button = gamepad.buttons[index];

      if (!estadoBotoes[index]) estadoBotoes[index] = false;

      // Quando botão é pressionado
      if (button.pressed && !estadoBotoes[index]) {
        // Se já está ativo, cancela
        if (efeitosAtivos[nome]) {
          cancelarEfeito(nome);
        } else {
          reproduzirEfeito(nome);
        }
      }

      estadoBotoes[index] = button.pressed;
    }
  }

  requestAnimationFrame(updateLoop);
}

function reproduzirEfeito(nome) {
  const audio = new Audio(`audio/${nome}.mp3`);
  const gif = document.getElementById(`gif-${nome}`);

  if (!gif) return;

  // Garante que o gif está visível
  gif.style.display = "block";
  audio.play().catch(err => console.warn(`Erro ao tocar ${nome}.mp3:`, err));

  // Guardar referência para poder cancelar depois
  efeitosAtivos[nome] = { audio, gif };

  audio.addEventListener("ended", () => {
    gif.style.display = "none";
    delete efeitosAtivos[nome];
  });
}

function cancelarEfeito(nome) {
  const efeito = efeitosAtivos[nome];
  if (!efeito) return;

  efeito.audio.pause();
  efeito.audio.currentTime = 0;
  efeito.gif.style.display = "none";

  delete efeitosAtivos[nome];
}
