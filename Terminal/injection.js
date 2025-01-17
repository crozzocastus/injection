let SpaceInvadersTerminado = false;
let caminhoAtual = "C:\\Utilizadores\\Teclusitania\\Documentos";
let dentroSQLmapa = false; // Variável para controlar se está dentro do SQLmapa

function renderPrompt() {
  const contentDiv = document.getElementById("content");
  const promptElement = document.createElement("p");
  promptElement.classList.add("line");
  promptElement.innerHTML = `<span class="path">${caminhoAtual}&gt;</span> <input type="text" id="user-input" placeholder="..." style="display: inline-block; border: none; outline: none; background: transparent; color: inherit; font: inherit;"/>`;
  contentDiv.appendChild(promptElement);

  const userInput = document.getElementById("user-input");
  userInput.addEventListener("keypress", handleInput);
  userInput.focus();
}

function iniciarJogo(jogoId, jogoTitulo, jogoCaminho) {
  const jogoDiv = document.createElement("div");
  jogoDiv.className = "jogo";
  jogoDiv.id = "jogo";
  document.querySelector(".terminal").appendChild(jogoDiv);

  const gameFrame = createGameFrame(jogoCaminho, jogoTitulo);
  jogoDiv.appendChild(gameFrame);

  monitorarConclusaoJogo(gameFrame, jogoDiv);
}

function createGameFrame(src, title) {
  const gameFrame = document.createElement("iframe");
  gameFrame.id = "gameFrame";
  gameFrame.src = src;
  gameFrame.title = title;
  gameFrame.style.width = "100%";
  gameFrame.style.height = "100%";
  gameFrame.style.border = "none";
  gameFrame.style.boxShadow = "0 0 10px #222";
  gameFrame.onload = () => {
    gameFrame.contentWindow.focus();
  };
  return gameFrame;
}

function monitorarConclusaoJogo(gameFrame, jogoDiv) {
  const interval = setInterval(() => {
    if (gameFrame.contentWindow?.checkGameStatus?.()) {
      // Esconder elementos do jogo após conclusão
      jogoDiv.style.display = "none";
      clearInterval(interval);

      // Restaurar o foco no terminal, se aplicável
      const userInput = document.getElementById("user-input");
      if (userInput) {
        userInput.focus();
      }
      
      startHackProgress(lowerInput, outputDiv);

    }
  }, 500);
}

// Início dos jogos
function iniciarSpaceInvaders() {
  iniciarJogo("spaceInvaders", "Space Invaders", "../Jogos/SpaceInvaders/SpaceInvaders.html");
}

function iniciarPong() {
  iniciarJogo("pong", "Pong Maluco", "../Jogos/Pong/pong.html");
}

function formatTime(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}

function updateTimestamps() {
  const now = new Date();
  const formattedTime = formatTime(now);
  document.getElementById("current-time1").textContent = `${formattedTime}.`;
}

setInterval(updateTimestamps, 1000);
updateTimestamps(); // Chamada inicial

function handleInput(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const userInput = event.target;
    const inputValue = userInput.value.trim();
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML += `<p class="line"><span class="path">${caminhoAtual}&gt;</span> ${inputValue}</p>`;

    processInput(inputValue, outputDiv);

    userInput.parentElement.remove(); // Limpa o input atual
    renderPrompt(); // Renderiza um novo prompt
    outputDiv.scrollTop = outputDiv.scrollHeight; // Rola para o final
  }
}

function processInput(input, outputDiv) {
  const lowerInput = input.toLowerCase();

  if (!lowerInput) {
    // Não faz nada se o input for nulo ou vazio
    return;
  }

  const commandActions = {
    sqlmapa: () => executeSQLmapa(outputDiv),
    reboot: () => executeReboot(outputDiv),
    reiniciar: () => executeReboot(outputDiv),
    reload: () => executeReboot(outputDiv),
    r: () => executeReboot(outputDiv),
    sair: () => executeExit(outputDiv),
    back: () => executeExit(outputDiv),
    quit: () => executeExit(outputDiv),
    exit: () => executeExit(outputDiv),
    end: () => executeExit(outputDiv),
    ajuda: () => executeHelp(outputDiv),
    help: () => executeHelp(outputDiv),
    h: () => executeHelp(outputDiv),
    tempo: () => displayCurrentTime(outputDiv),
    time: () => displayCurrentTime(outputDiv),
    t: () => displayCurrentTime(outputDiv),
    lista: () => displayCommandList(outputDiv),
    list: () => displayCommandList(outputDiv),
    ls: () => displayCommandList(outputDiv),
    memória: () => displayMemoryUsage(outputDiv),
    memoria: () => displayMemoryUsage(outputDiv),
    memory: () => displayMemoryUsage(outputDiv),
    m: () => displayMemoryUsage(outputDiv),
  };

  if (commandActions[lowerInput]) {
    commandActions[lowerInput]();
  } else if (dentroSQLmapa) {
    handleSQLmapaCommands(lowerInput, outputDiv);
  } else {
    displayUnknownCommand(outputDiv);
  }
}

function executeSQLmapa(outputDiv) {
  handleSQLmapaCommand(outputDiv);
}

function executeReboot(outputDiv) {
  handleRebootCommand(outputDiv);
}

function executeExit(outputDiv) {
  handleExitCommand(outputDiv);
}

function executeHelp(outputDiv) {
  handleHelpCommand(outputDiv);
}

function displayCurrentTime(outputDiv) {
  outputDiv.innerHTML += `<p class="line output">${formatTime(new Date())}</p>`;
}

function displayCommandList(outputDiv) {
  outputDiv.innerHTML += `<p class="line output">  • SQLmapa -- versão: chocolate_com_pimenta_0.1 </p>`;
}

function displayMemoryUsage(outputDiv) {
  outputDiv.innerHTML += `<p class="line output">Memória livre: 120,000,000 byte(s)</p>`;
}

function displayUnknownCommand(outputDiv) {
  outputDiv.innerHTML += `<p class="line output">- digite “ajuda” para obter os comandos possíveis.</p>`;
}

function handleSQLmapaCommand(outputDiv) {
  if (!dentroSQLmapa) {
    caminhoAtual = "C:\\Utilizadores\\Teclusitania\\Documentos";
    dentroSQLmapa = true;
    outputDiv.innerHTML += `<pre class="line output ascii-art">
╔──────────────────────────────────────────────────────────────╗
│                                                              │
│ ███████╗ ██████╗ ██╗     ███╗   ███╗ █████╗ ██████╗  █████╗  │
│ ██╔════╝██╔═══██╗██║     ████╗ ████║██╔══██╗██╔══██╗██╔══██╗ │
│ ███████╗██║   ██║██║     ██╔████╔██║███████║██████╔╝███████║ │
│ ╚════██║██║▄▄ ██║██║     ██║╚██╔╝██║██╔══██║██╔═══╝ ██╔══██║ │
│ ███████║╚██████╔╝███████╗██║ ╚═╝ ██║██║  ██║██║     ██║  ██║ │
│ ╚══════╝ ╚══▀▀═╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ │
│                                                              │
╚──────────────────────────────────────────────────────────────╝
</pre>`;
  } else {
    outputDiv.innerHTML += `<p class="line output">SQLmapa a rodar...</p>`;
  }
}

function handleRebootCommand(outputDiv) {
  outputDiv.innerHTML += `<p class="line output">Reiniciando programa...</p>`;
  setTimeout(() => {
    location.reload(); // Recarrega a página
  }, 1000);
}

function handleExitCommand(outputDiv) {
  if (dentroSQLmapa) {
    caminhoAtual = "C:\\Utilizadores\\Teclusitania\\Documentos";
    dentroSQLmapa = false;
    outputDiv.innerHTML += `<p class="line output">Saindo do SQLmapa... Retornando ao diretório anterior...</p>`;
  } else {
    outputDiv.innerHTML += `<p class="line output">Já está no diretório principal!!!</p>`;
  }
}

function handleHelpCommand(outputDiv) {
  if (dentroSQLmapa) {
    outputDiv.innerHTML += `<p class="line output">Comandos disponíveis no SQLmapa:</p>
                            <p class="line output">  • Hackear nome  (inicia o processo de hacking para obter usuário)</p>
                            <p class="line output">  • Hackear senha (inicia o processo de hacking para obter senha)</p>
                            <p class="line output">  • Versão                (mostra a versão do SQLmapa)</p>
                            <p class="line output">  • Sair                  (sai do SQLmapa)</p>`;
  } else {
    outputDiv.innerHTML += `<p class="line output">Comandos disponíveis em C:\\Aplicações:</p>
                            <p class="line output">  • Tempo      (mostra data e hora)</p>
                            <p class="line output">  • Lista      (mostra todas as aplicações instaladas)</p>
                            <p class="line output">  • Memória    (mostra o espaço disponível)</p>
                            <p class="line output">  • SQLmapa    (abre a ferramenta de hacking)</p>`;
  }
}

function handleSQLmapaCommands(lowerInput, outputDiv) {
  if (lowerInput === "hackear") {
    outputDiv.innerHTML += `<p class="line output">Comando incompleto, escreva “ajuda” para ver o comando completo;</p>`;
  } else if (lowerInput === "hackear nome") {
    iniciarSpaceInvaders();
    startHackProgress(lowerInput, outputDiv);
  } else if (lowerInput === "hackear senha") {
    iniciarPong();
    startHackProgress(lowerInput, outputDiv);
  } else if (lowerInput === "versão") {
    outputDiv.innerHTML += `<p class="line output">SQLmapa versão: chocolate_com_pimenta_0.1</p>`;
  } else {
    outputDiv.innerHTML += `<p class="line output">- digite “ajuda” para obter os comandos possíveis.</p>`;
  }
}

function startHackProgress(command, outputDiv) {
  let progress = 0;
  const progressMessage = document.createElement("p");
  progressMessage.className = "line output";
  outputDiv.appendChild(progressMessage);

  const intervalId = setInterval(() => {
    progress += 1;
    progressMessage.textContent = `Hackeando... ${progress}%`;
    outputDiv.scrollTop = outputDiv.scrollHeight; // Rola para o final

    if (progress === 100) {
      clearInterval(intervalId);
      if (command === "hackear nome") {
        progressMessage.textContent = `Hack concluído com sucesso! Usuário encontrado:`;
        const resultTable = document.createElement("table");
        resultTable.innerHTML = `<tr><td>usuário = administrador</td></tr>`;
        outputDiv.appendChild(resultTable);
      } else if (command === "hackear senha") {
        progressMessage.textContent = `Hack concluíd o com sucesso! Senha encontrada:`;
        const resultTable = document.createElement("table");
        resultTable.innerHTML = `<tr><td>senha = Qwert2025!</td></tr>`;
        outputDiv.appendChild(resultTable);
      }
      outputDiv.scrollTop = outputDiv.scrollHeight; // Rola para o final
    }
  }, 50);
}
console.log("renderPronpt()");
renderPrompt(); // Inicializa o terminal
