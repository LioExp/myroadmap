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

  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
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
}

document.addEventListener('DOMContentLoaded', render);
