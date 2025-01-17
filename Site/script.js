document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    submit: document.getElementById("submit-button"),
  };
  
  const handleEnterKey = (currentElement, nextElement, callback) => { // Função para mover o foco para o próximo elemento
    currentElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        
        const isUsernameFilled = elements.username.value.trim() !== ""; // Verifica se todos os campos estão preenchidos
        const isPasswordFilled = elements.password.value.trim() !== "";
  
        if (isUsernameFilled && isPasswordFilled && callback) {
          callback(); // Tenta fazer login diretamente
        } else if (nextElement) {
          nextElement.focus(); // Foco no próximo elemento
        }
      }
    });
  };
  
  // Configurar a navegação entre os campos
  handleEnterKey(elements.username, elements.password);
  handleEnterKey(elements.password, null, verificarLogin);
  
  // Definir o tema claro por padrão
  document.body.classList.add("light-theme");
  
  // Adicionar evento ao switch para mudar o tema
  const themeSwitch = document.getElementById("switch");
  themeSwitch.checked = false; // Definir o switch como desmarcado por padrão
  themeSwitch.addEventListener("change", function () {
    if (themeSwitch.checked) {
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  });  
});

const terminalButton = document.getElementById("terminal-button"); // Seleção de elementos
const loginContainer = document.querySelector(".login-container");
const taskIniciar = document.querySelector(".task-iniciar");
const submitButton = document.getElementById("submit-button");

if (submitButton) {
  submitButton.addEventListener("click", verificarLogin);
}

let terminalOpen = false;

const credenciaisCorretas = {
  usuario: "administrador",
  senha: "Qwert2025!",
};

function removerMensagem() {
  setTimeout(() => {
    const mensagem = document.getElementById("mensagem");
    if (mensagem) {
      mensagem.textContent = ""; // Limpa o texto da mensagem
    }
  }, 2000); // Aguarda 2 segundos (2000 milissegundos)
}

function verificarLogin() {
  const username = document.getElementById("username").value; // Captura dos valores dos inputs
  const password = document.getElementById("password").value;
  const mensagem = document.getElementById("mensagem"); // Elemento onde será exibida a mensagem

  if (
    username === credenciaisCorretas.usuario &&
    password === credenciaisCorretas.senha
  ) {
    // Verificação das credenciais
    mensagem.textContent = "Login realizado com sucesso!";
    mensagem.style.color = "green";
    window.location.href = "https://cpanel155.dnscpanel.com:2096/cpsess9606046744/3rdparty/roundcube/?_task=mail&_mbox=INBOX"; // Redireciona para o site desejado
  } else {
    mensagem.textContent = "Utilizador ou palavra-passe incorretos.";
    mensagem.style.color = "red";
  }

  removerMensagem();
}

function createTerminal() {
  // Função para criar o terminal
  const terminalContainer = document.createElement("div");
  terminalContainer.classList.add("terminal-container");
  document.body.appendChild(terminalContainer);

  const terminal = document.createElement("div");
  terminal.classList.add("terminal");
  terminalContainer.appendChild(terminal);

  const iframe = document.createElement("iframe");
  iframe.src = "../LoginTerminal/login.html"; // Definir a URL do terminal.html
  terminal.appendChild(iframe);

  loginContainer.classList.add("shift-left");
  taskIniciar.classList.add("shift-left");
  terminalOpen = true;
}

function removeTerminal() {
  // Função para remover o terminal
  const terminal = document.querySelector(".terminal-container");
  if (terminal) {
    document.body.removeChild(terminal);
  }
  loginContainer.classList.remove("shift-left");
  taskIniciar.classList.remove("shift-left");
  terminalOpen = false;
}

function toggleTerminal() {
  // Função para alternar o estado do terminal
  if (terminalOpen) {
    removeTerminal();
  } else {
    createTerminal();
  }
}

terminalButton.addEventListener("click", toggleTerminal); // Event listener para o botão do terminal

function updateDateTime() {
  // Função para atualizar a data e hora
  const now = new Date();
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDateTime = now.toLocaleDateString("pt-PT", options);
  document.getElementById("datetime").textContent = formattedDateTime;
}

setInterval(updateDateTime, 1000); // Atualizar data e hora a cada segundo
updateDateTime();