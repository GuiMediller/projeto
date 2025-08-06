const actions = {
  0: 'balerina',   // Botão A ou tecla 1
  1: 'miau',       // Botão B ou tecla 2
  2: 'milkshake',  // Botão X ou tecla 3
  3: 'pew',        // Botão Y ou tecla 4
  4: 'sahur',      // Botão LB ou tecla 5
  5: 'vaca',       // Botão RB ou tecla 6
  6: 'tralalero'   // Botão Select ou tecla 7
};

const playing = {};
const audioElements = {};
const gifContainer = document.getElementById('gif-container');

// Precarregar os sons
for (let key in actions) {
  const name = actions[key];
  const audio = new Audio(`audio/${name}.mp3`);
  audioElements[name] = audio;
}

// Função para ativar/desativar áudio e gif
function toggleAction(name) {
  if (playing[name]) {
    audioElements[name].pause();
    audioElements[name].currentTime = 0;
    gifContainer.innerHTML = '';
    playing[name] = false;
  } else {
    // Parar todos os outros
    for (let key in playing) {
      if (playing[key]) {
        audioElements[key].pause();
        audioElements[key].currentTime = 0;
        playing[key] = false;
      }
    }
    const audio = audioElements[name];
    audio.play();
    const gif = document.createElement('img');
    gif.src = `img/${name}.gif`;
    gifContainer.innerHTML = '';
    gifContainer.appendChild(gif);
    playing[name] = true;
  }
}

// Gamepad
window.addEventListener("gamepadconnected", () => {
  console.log("Controle conectado");
  const audio = new Audio('audio/conectado.mp3'); // Opcional
  audio.play();

  function updateGamepad() {
    const gp = navigator.getGamepads()[0];
    if (gp) {
      gp.buttons.forEach((btn, i) => {
        if (btn.pressed && actions[i] !== undefined) {
          toggleAction(actions[i]);
        }
      });
    }
    requestAnimationFrame(updateGamepad);
  }

  updateGamepad();
});

// Teclado
window.addEventListener('keydown', (e) => {
  const tecla = e.key;
  if (tecla >= '1' && tecla <= '7') {
    const index = parseInt(tecla) - 1;
    const name = actions[index];
    if (name) toggleAction(name);
  }
});
