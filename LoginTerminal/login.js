document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");
  const submitBtn = document.getElementById("submit-btn");

  let username = "";
  let password = "";

  const label = document.querySelector('label[for="password"]');
      const input = document.querySelector('#password');

      // Função para verificar o conteúdo do input
      const toggleLabel = () => {
        if (input.value.trim() === "") {
          label.style.display = "none"; // Esconde o label
        } else {
          label.style.display = "inline"; // Torna o label visível
        }
      };

      // Adiciona o evento de input ao campo
      input.addEventListener("input", toggleLabel);

      // Executa a verificação inicial
      toggleLabel();

  // Foco inicial no campo de usuário
  usernameField.focus();

  // Evento de alteração no campo de usuário
  usernameField.addEventListener("change", () => {
    username = usernameField.value.trim();
    if (username) {
      passwordField.style.display = "block";
    }
  });

  // Evento de alteração no campo de senha
  passwordField.addEventListener("change", () => {
    password = passwordField.value.trim();
    if (password) {
      submitBtn.style.display = "block";
    }
  });

  // Evento de clique no botão de login
  submitBtn.addEventListener("click", () => {
    attemptLogin();
  });

  // Evento de tecla pressionada nos campos de entrada
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === usernameField) {
        // Move para o campo de senha se Enter for pressionado no campo de usuário
        if (usernameField.value.trim()) {
          passwordField.style.display = "block";
          passwordField.focus();
        }
      } else if (document.activeElement === passwordField) {
        // Tenta fazer login se Enter for pressionado no campo de senha
        if (passwordField.value.trim()) {
          attemptLogin();
        }
      }
    }
  });

  // Função para realizar o login
  function attemptLogin() {
    username = usernameField.value.trim();
    password = passwordField.value.trim();
    if (username === "admin" && password === "jogo2025") {
      window.location.href = "../Terminal/terminal.html";
    } else {
      alert("Usuário ou senha incorretos. Tente novamente.");
      usernameField.value = "";
      passwordField.value = "";
      passwordField.style.display = "none";
      submitBtn.style.display = "none";
      usernameField.focus();
    }
  }
});

// Código para a simulação do boot permanece inalterado
document.addEventListener("DOMContentLoaded", function () {
  const bootLines = [
    "[    0.000000] Initializing cgroup subsys cpuset",
    "[    0.000000] Initializing cgroup subsys cpu",
    "[    0.000000] Initializing cgroup subsys cpuacct",
    "[    0.000000] Linux version 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020",
    "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.4.0-42-generic root=UUID=12345678-1234-1234-1234-123456789abc",
    "[    0.000000] KERNEL supported cpus:",
    "[    0.000000]   Intel GenuineIntel",
    "[    0.000000]   AMD AuthenticAMD",
    "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
    "[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'",
    "[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'",
    "[    0.000000] xstate_offset[2]:  576, xstate_sizes[2]:  256",
    "[    0.000000] x86/fpu: Enabled xstate features 0x7, context size is 832 bytes, using 'compacted' format.",
    "[    0.000000] BIOS-provided physical RAM map:",
    "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable",
    "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bfffffff] usable",
    "[    0.000000] BIOS-e820: [mem 0x00000000c0000000-0x00000000cfffffff] reserved",
    "[    0.000000] BIOS-e820: [mem 0x00000000d0000000-0x00000000dfffffff] reserved",
    "[    0.000000] BIOS-e820: [mem 0x00000000e0000000-0x00000000efffffff] reserved",
    "[    0.000000] BIOS-e820: [mem 0x00000000f0000000-0x00000000ffffffff] reserved",
    "[    0.000000] NX (Execute Disable) protection: active",
    "[    0.000000] SMBIOS 2.8 present.",
    "[    0.000000] DMI: System manufacturer System Product Name/System Version, BIOS 0802 04/01/2020",
    "[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved",
    "[    0.000000] e820: remove [mem 0x000a0000-0x000fffff] usable",
    "[    0.000000] AGP: No AGP bridge found",
    "[    0.000000] last_pfn = 0xc0000 max_arch_pfn = 0x400000000",
    "[    0.000000] [SECURITY] Initializing security subsystems",
    "[    0.000000] [SECURITY] Loading firewall rules",
    "[    0.000000] [SECURITY] Enabling intrusion detection system",
    "[    0.000000] [SECURITY] Starting antivirus services",
    "[    0.000000] [SECURITY] Applying security patches",
    "[    0.000000] [SECURITY] System security status: SECURE",
  ];


  const bootScreen = document.getElementById("boot-screen");

  bootLines.forEach((line) => {
    const div = document.createElement("div");
    div.className = "boot-line";
    div.textContent = line;
    bootScreen.appendChild(div);
  });

  let lines = document.querySelectorAll(".boot-line");
  let delay = 0;
  lines.forEach((line, index) => {
    setTimeout(() => {
      if (index > 0) {
        lines[index - 1].classList.remove("current-line");
      }
      line.style.display = "block";
      line.classList.add("current-line");
      line.scrollIntoView({ behavior: "smooth", block: "end" });
      if (index === lines.length - 1) {
        setTimeout(() => {
          document.getElementById("boot-screen").style.opacity = "0";
          setTimeout(() => {
            document.getElementById("boot-screen").style.display = "none";
            let loginForm = document.getElementById("login-form");
            loginForm.style.visibility = "visible";   
            loginForm.style.opacity = "1";
          }, 1000);
        }, 1000);
      }
    }, delay);
    delay += 100;
  });
});