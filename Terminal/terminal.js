// Função para gerar o HTML dinamicamente
function gerarHTML() {
  // Criar elementos principais
  const doctype = document.implementation.createDocumentType("html", "", "");
  document.replaceChild(doctype, document.firstChild);

  const html = document.createElement("html");
  html.lang = "pt";
  document.documentElement.replaceWith(html);

  const head = document.createElement("head");
  const body = document.createElement("body");

  html.appendChild(head);
  html.appendChild(body);

  // Meta charset
  const metaCharset = document.createElement("meta");
  metaCharset.setAttribute("charset", "UTF-8");
  head.appendChild(metaCharset);

  // Meta viewport
  const metaViewport = document.createElement("meta");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
  head.appendChild(metaViewport);

  // Title
  const title = document.createElement("title");
  title.textContent = "Terminal Hacker";
  head.appendChild(title);

  // Link CSS
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "SQLstyles.css");
  head.appendChild(link);

  // Div terminal
  const terminalDiv = document.createElement("div");
  terminalDiv.className = "terminal";
  body.appendChild(terminalDiv);

  // Terminal header
  const headerDiv = document.createElement("div");
  headerDiv.className = "terminal-header";
  headerDiv.textContent = "Janela de Comandos para Hackear";
  terminalDiv.appendChild(headerDiv);

  // Content div
  const contentDiv = document.createElement("div");
  contentDiv.id = "content";
  terminalDiv.appendChild(contentDiv);

  // Adicionar linhas ao content
  const paths = [
    {
      html: `<span class="path">C:\\Utilizadores\\Teclusitania\\Documentos</span> Diretório:`,
    },
    { html: "- - Volume na unidade C não tem etiqueta.", class: "line output" },
    {
      html: "- - Diretório de C:\\Utilizadores\\Teclusitania\\Documentos",
      class: "line output",
    },
    {
      html: `Data e Hora atuais: <span class="line output" id="current-time1"></span>`,
      class: "line output",
    },
    { html: "1 Arquivo(s) 1,234 bytes", class: "line output" },
    { html: "0 Diretório(s) 120,000,000 bytes livres", class: "line output" },
  ];

  paths.forEach(({ html, class: className }) => {
    const p = document.createElement("p");
    if (className) p.className = className;
    p.innerHTML = html;
    contentDiv.appendChild(p);
  });

  // Output div
  const outputDiv = document.createElement("div");
  outputDiv.id = "output";
  contentDiv.appendChild(outputDiv);

  // Script injection
  const script = document.createElement("script");
  script.src = "injection.js";
  body.appendChild(script);
}

// Chamar a função para gerar o HTML
gerarHTML();
