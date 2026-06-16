const DATA = [
  {
    id: 1,
    title: "Fundações",
    nodes: [
      { id: "f1", label: "Redes & TCP/IP", desc: "Compreender os fundamentos de redes, modelo OSI, protocolo TCP/IP, DNS, HTTP/HTTPS. Base essencial para segurança.", links: ["https://developer.mozilla.org/pt-BR/docs/Web/HTTP", "https://www.cloudflare.com/learning/dns/what-is-dns/"] },
      { id: "f2", label: "Linux & Terminal", desc: "Navegação no terminal, permissoes, processos, grep, awk, sed. O ambiente padrão de segurança.", links: ["https://linuxcommand.org/", "https://explainshell.com/"] },
      { id: "f3", label: "Shell Scripting", desc: "Automação de tarefas com bash. Scripts para scanning, parsing, monitoramento.", links: ["https://www.shellscript.sh/", "https://devhints.io/bash"] },
      { id: "f4", label: "Python para Sec", desc: "Python aplicado a segurança: requests, sockets, scraping, automação de exploits e ferramentas.", links: ["https://docs.python.org/3/howto/sockets.html", "https://realpython.com/python-requests/"] },
    ]
  },
  {
    id: 2,
    title: "Security Core",
    nodes: [
      { id: "s1", label: "OWASP Top 10", desc: "As 10 vulnerabilidades mais críticas em web apps: SQLi, XSS, CSRF, SSRF, RCE, etc.", links: ["https://owasp.org/www-project-top-ten/", "https://portswigger.net/web-security"] },
      { id: "s2", label: "Criptografia 101", desc: "Hash, cifras simétricas/assimétricas, TLS, PKI. O que proteger e como.", links: ["https://cryptohack.org/", "https://letsencrypt.org/pt-br/how-it-works/"] },
      { id: "s3", label: "Autenticação & Autorização", desc: "OAuth2, JWT, SAML, sessões, MFA. Como validar identidade e controlar acesso.", links: ["https://jwt.io/introduction", "https://oauth.net/2/"] },
      { id: "s4", label: "Network Security", desc: "Firewalls, IDS/IPS, VPNs, segmentação de rede, monitoramento de tráfego.", links: ["https://www.cisco.com/c/en/us/products/security/what-is-network-security.html"] },
      { id: "s5", label: "Secure SDLC", desc: "DevSecOps, SAST/DAST, threat modeling, security review no ciclo de desenvolvimento.", links: ["https://owasp.org/www-project-secure-sdlc/"] },
    ]
  },
  {
    id: 3,
    title: "AI & ML",
    nodes: [
      { id: "a1", label: "Fundamentos ML", desc: "Tipos de aprendizado, features, overfitting, métricas. Base para entender riscos em IA.", links: ["https://scikit-learn.org/stable/tutorial/index.html", "https://developers.google.com/machine-learning/crash-course"] },
      { id: "a2", label: "LLMs & Transformers", desc: "Arquitetura transformer, atenção, GPT, embeddings. Como modelos de linguagem funcionam.", links: ["https://huggingface.co/learn/nlp-course", "https://jalammar.github.io/illustrated-transformer/"] },
      { id: "a3", label: "Python ML Stack", desc: "PyTorch, scikit-learn, pandas, numpy. O ecossistema prático de ML.", links: ["https://pytorch.org/tutorials/", "https://pandas.pydata.org/docs/"] },
      { id: "a4", label: "RAG & Agents", desc: "Retrieval-Augmented Generation, cadeias de reasoning, ferramentas para agentes de IA.", links: ["https://python.langchain.com/docs/tutorials/rag/"] },
    ]
  },
  {
    id: 4,
    title: "AI Security",
    nodes: [
      { id: "as1", label: "Prompt Injection", desc: "Técnicas de injeção em LLMs, jailbreaks, defesas com sanitizacão e guardrails.", links: ["https://owasp.org/www-project-top-10-for-llm-applications/", "https://github.com/agencyenterprise/Prompt-Injection-Defender"] },
      { id: "as2", label: "Model Poisoning & Supply Chain", desc: "Envenenamento de dados de treino, backdoors em modelos, riscos de supply chain ML.", links: ["https://atlas.mitre.org/"] },
      { id: "as3", label: "Model Inversion & Extraction", desc: "Ataques que extraem dados de treino ou roubam modelos via queries de API.", links: ["https://arxiv.org/abs/1602.05629"] },
      { id: "as4", label: "Red Teaming LLMs", desc: "Testes de penetração específicos para LLMs: probing, bias, toxicidade, evasão de filtros.", links: ["https://github.com/leondz/garak", "https://llm-attacks.org/"] },
      { id: "as5", label: "AI Governance & Compliance", desc: "Regulamentação (EU AI Act), fairness, transparência, logging e auditoria de sistemas de IA.", links: ["https://artificialintelligenceact.eu/"] },
    ]
  },
  {
    id: 5,
    title: "Build & Publish",
    nodes: [
      { id: "b1", label: "Secure AI Pipeline", desc: "Proteger todo o pipeline de IA: dados, treino, deployment, inferência. MLSecOps.", links: ["https://mlops.org/"] },
      { id: "b2", label: "Ferramentas de AI Security", desc: "Garak, Vigil, LLM Guard, Guardrails AI, PurpleLlama. Stack prática de defesa.", links: ["https://github.com/NVIDIA/NeMo-Guardrails", "https://github.com/ML-Group/gard"] },
      { id: "b3", label: "CTF & Labs", desc: "Desafios práticos de AI security em CTFs, laboratórios gratuitos e simulações.", links: ["https://capturetheflag.withgoogle.com/", "https://huggingface.co/spaces/leonardos/garak-arena"] },
      { id: "b4", label: "Portfolio & Blog", desc: "Documentar projetos, escrever write-ups, publicar ferramentas. Construir presença na área.", links: ["https://dev.to/", "https://medium.com/"] },
    ]
  }
];

let completed = new Set(loadCompleted());

function loadCompleted() {
  try {
    return JSON.parse(localStorage.getItem('asec_roadmap')) || [];
  } catch {
    return [];
  }
}

function saveCompleted() {
  localStorage.setItem('asec_roadmap', JSON.stringify([...completed]));
}

function updateProgress() {
  let total = 0;
  DATA.forEach(p => total += p.nodes.length);
  const pct = Math.round((completed.size / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = pct + '%';
}

function showPanel(data, phaseTitle) {
  const panel = document.getElementById('panel');
  let linksHtml = '';

  if (data.links && data.links.length) {
    linksHtml = '<div class="panel-sub">Recursos</div><div class="panel-links">';
    data.links.forEach(l => {
      const display = l.replace(/^https?:\/\//, '').replace(/\/$/, '');
      linksHtml += `<a href="${l}" target="_blank" rel="noopener" class="panel-link">${display}</a>`;
    });
    linksHtml += '</div>';
  }

  panel.innerHTML = `
    <div class="panel-card">
      <div class="panel-sub" style="margin-bottom:.25rem">${phaseTitle}</div>
      <div class="panel-title">${data.label}</div>
      <div class="panel-desc">${data.desc}</div>
      ${linksHtml}
    </div>
  `;
}

function handleNodeClick(id) {
  let nodeData = null;
  let phaseTitle = '';

  DATA.forEach(p => {
    p.nodes.forEach(n => {
      if (n.id === id) {
        nodeData = n;
        phaseTitle = p.title;
      }
    });
  });

  if (!nodeData) return;

  if (completed.has(id)) {
    completed.delete(id);
  } else {
    completed.add(id);
  }

  saveCompleted();

  document.querySelectorAll('.node').forEach(el => {
    const nid = el.dataset.id;
    const isDone = completed.has(nid);
    el.classList.toggle('completed', isDone);
    const check = el.querySelector('.node-check');
    if (check) check.textContent = isDone ? '✓' : '';
  });

  document.querySelectorAll('.phase').forEach((el, i) => {
    const phase = DATA[i];
    const allDone = phase.nodes.every(n => completed.has(n.id));
    const num = el.querySelector('.phase-number');
    if (num) {
      num.classList.toggle('done', allDone);
      num.textContent = allDone ? '✓' : i + 1;
    }
  });

  updateProgress();
  showPanel(nodeData, phaseTitle);
}

function togglePhase(header) {
  const body = header.nextElementSibling;
  const toggle = header.querySelector('.phase-toggle');
  body.classList.toggle('open');
  toggle.classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.hasAttribute('data-theme');

  if (isLight) {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }

  const sun = document.querySelector('#themeBtn .sun');
  const moon = document.querySelector('#themeBtn .moon');
  if (sun && moon) {
    sun.style.display = isLight ? '' : 'none';
    moon.style.display = isLight ? 'none' : '';
  }
}

function render() {
  const container = document.getElementById('roadmap');
  container.innerHTML = '';

  DATA.forEach((phase, i) => {
    const allDone = phase.nodes.every(n => completed.has(n.id));
    const open = completed.size === 0 ? i === 0 : true;

    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase';
    phaseEl.innerHTML = `
      <div class="phase-header">
        <div class="phase-number ${allDone ? 'done' : ''}">${allDone ? '✓' : i + 1}</div>
        <div class="phase-title">${phase.title}</div>
        <div class="phase-toggle ${open ? 'open' : ''}">▾</div>
      </div>
      <div class="phase-body ${open ? 'open' : ''}">
        <div class="phase-nodes"></div>
      </div>
    `;

    const header = phaseEl.querySelector('.phase-header');
    header.addEventListener('click', function () {
      togglePhase(this);
    });

    const grid = phaseEl.querySelector('.phase-nodes');

    phase.nodes.forEach(node => {
      const isDone = completed.has(node.id);
      const div = document.createElement('div');
      div.className = 'node' + (isDone ? ' completed' : '');
      div.dataset.id = node.id;
      div.innerHTML = `
        <div class="node-check">${isDone ? '✓' : ''}</div>
        <div class="node-label">${node.label}</div>
      `;
      div.addEventListener('click', function () {
        handleNodeClick(this.dataset.id);
      });
      grid.appendChild(div);
    });

    container.appendChild(phaseEl);
  });

  updateProgress();
}

document.addEventListener('DOMContentLoaded', function () {
  render();

  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});
