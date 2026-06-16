// ── Tema ──
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.hasAttribute('data-theme');
  if (isLight) html.removeAttribute('data-theme');
  else html.setAttribute('data-theme', 'light');
  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
  if (sun && moon) {
    sun.style.display = isLight ? '' : 'none';
    moon.style.display = isLight ? 'none' : '';
  }
}

// ── Dados ──
const STORAGE_KEY = 'mr_roadmap';
const COLORS = ['purple', 'teal', 'coral'];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phases));
}

let phases = loadData();

// ── Helpers ──
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function colorClass(c) {
  return c === 'teal' ? 'ph2' : c === 'coral' ? 'ph3' : 'ph1';
}

// ── Render ──
function render() {
  const container = document.getElementById('roadmap');

  if (!phases.length) {
    container.innerHTML = `
      <div class="roadmap-empty">
        <div class="roadmap-empty-title">O teu roadmap está vazio</div>
        <p class="roadmap-empty-text">Adiciona a primeira fase para começar a construir o teu percurso.</p>
        <button class="add-phase-btn" onclick="addPhase()">+ Adicionar fase</button>
      </div>
    `;
    return;
  }

  let html = '<div class="roadmap-cols">';

  phases.forEach((phase, idx) => {
    const cls = colorClass(phase.color);
    const total = phase.nodes.length;
    const done = phase.nodes.filter(n => n.done).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    html += `<div class="roadmap-col" data-phase="${phase.id}">`;

    // Header
    html += `<div class="col-header">
      <div class="col-title ${cls}" onclick="editTitle('${phase.id}')" id="title-${phase.id}">${esc(phase.title)}</div>
      <div class="color-select">
        ${COLORS.map(c => `<div class="color-dot ${c} ${c === phase.color ? 'active' : ''}" onclick="setColor('${phase.id}','${c}')"></div>`).join('')}
      </div>
      <button class="phase-remove" onclick="removePhase('${phase.id}')" title="Remover fase">remover</button>
    </div>`;

    // Progress
    html += `<div class="col-progress">
      <div class="col-progress-bar"><div class="col-progress-fill" style="width:${pct}%;background:var(--${phase.color})"></div></div>
      <div class="col-progress-label"><span>${done} / ${total}</span><span>${pct}%</span></div>
    </div>`;

    // Nodes without section grouping (simpler UX)
    const currentId = phase.nodes.findIndex(n => n.current);
    phase.nodes.forEach((node, ni) => {
      if (ni > 0) html += '<div class="vconn"></div>';
      const stateClass = node.done ? ' done' : node.current ? ' current' : '';
      html += `<div class="phase-node">
        <div class="phase-node-box${stateClass}" data-phase="${phase.id}" data-node="${node.id}" onclick="openNode('${phase.id}','${node.id}')">
          <span class="node-dot"></span>
          <span class="node-label">${esc(node.label)}</span>
          <button class="node-remove" onclick="event.stopPropagation();removeNode('${phase.id}','${node.id}')">×</button>
        </div>
      </div>`;
    });

    // Add node button
    html += `<div style="margin-top:8px"><button class="add-btn" onclick="addNode('${phase.id}')">+ Adicionar item</button></div>`;

    html += '</div>';
  });

  html += '</div>';

  // Add phase button
  html += `<div class="add-phase-wrap"><button class="add-phase-btn" onclick="addPhase()">+ Adicionar fase</button></div>`;

  container.innerHTML = html;
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── CRUD Fases ──
function addPhase() {
  const count = phases.length;
  const colors = ['purple', 'teal', 'coral'];
  phases.push({
    id: uid(),
    title: `Fase ${count + 1}`,
    color: colors[count % 3],
    nodes: []
  });
  saveData();
  render();
}

function removePhase(id) {
  if (!confirm('Remover esta fase e todos os seus itens?')) return;
  phases = phases.filter(p => p.id !== id);
  saveData();
  render();
}

function editTitle(id) {
  const phase = phases.find(p => p.id === id);
  if (!phase) return;
  const el = document.getElementById('title-' + id);
  const current = phase.title;

  const input = document.createElement('input');
  input.className = 'col-title-input ' + colorClass(phase.color);
  input.value = current;
  input.setAttribute('aria-label', 'Título da fase');

  el.replaceWith(input);
  input.focus();
  input.select();

  function save() {
    const val = input.value.trim() || current;
    phase.title = val;
    saveData();
    render();
  }

  input.addEventListener('blur', save);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { input.blur(); }
    if (e.key === 'Escape') { input.value = current; input.blur(); }
  });
}

function setColor(id, color) {
  const phase = phases.find(p => p.id === id);
  if (!phase) return;
  phase.color = color;
  saveData();
  render();
}

// ── CRUD Nodes ──
function addNode(phaseId) {
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) return;
  phase.nodes.push({
    id: uid(),
    label: 'Novo item',
    done: false,
    current: false,
    intro: '',
    desc: '',
    learn: [],
    vision: '',
    free: [],
    paid: [],
    whyRecommended: '',
    projects: [],
    aiPrompt: ''
  });
  saveData();
  render();

  // Open the last node for editing
  const last = phase.nodes[phase.nodes.length - 1];
  openNode(phaseId, last.id);
}

function removeNode(phaseId, nodeId) {
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) return;
  phase.nodes = phase.nodes.filter(n => n.id !== nodeId);
  saveData();
  render();
}

function openNode(phaseId, nodeId) {
  openEditModal(phaseId, nodeId);
}

// ── Modal de Edição ──
let editPhaseId = null;
let editNodeId = null;

function openEditModal(phaseId, nodeId) {
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) return;
  const node = phase.nodes.find(n => n.id === nodeId);
  if (!node) return;

  editPhaseId = phaseId;
  editNodeId = nodeId;

  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-phase" style="color:var(--${phase.color})">${esc(phase.title)}</div>

    <div class="modal-form-group">
      <label class="modal-form-label">Nome do item</label>
      <input class="modal-form-input" id="ef-label" value="${esc(node.label)}" placeholder="ex: Linux & terminal"/>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Introdução</label>
      <textarea class="modal-form-textarea" id="ef-intro" rows="3" placeholder="Breve introdução ao tema...">${esc(node.intro)}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Descrição</label>
      <textarea class="modal-form-textarea" id="ef-desc" rows="4" placeholder="Descrição detalhada do que se estuda...">${esc(node.desc)}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">O que vais aprender (um por linha)</label>
      <textarea class="modal-form-textarea" id="ef-learn" rows="4" placeholder="Item 1&#10;Item 2&#10;Item 3">${esc(node.learn.join('\n'))}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Visão depois de completar</label>
      <textarea class="modal-form-textarea" id="ef-vision" rows="3" placeholder="O que saberás fazer depois...">${esc(node.vision)}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Recursos gratuitos (URL por linha: Nome | URL)</label>
      <textarea class="modal-form-textarea" id="ef-free" rows="3" placeholder="Nome do recurso | https://...">${esc(node.free.map(r => r.name + ' | ' + r.url).join('\n'))}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Recursos pagos (URL por linha: Nome | URL)</label>
      <textarea class="modal-form-textarea" id="ef-paid" rows="3" placeholder="Nome do recurso | https://...">${esc(node.paid.map(r => r.name + ' | ' + r.url).join('\n'))}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Porquê estes recursos?</label>
      <textarea class="modal-form-textarea" id="ef-why" rows="3" placeholder="Explicação da escolha...">${esc(node.whyRecommended)}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Ideias de Projectos (um por linha)</label>
      <textarea class="modal-form-textarea" id="ef-projects" rows="3" placeholder="Projecto 1&#10;Projecto 2&#10;Projecto 3">${esc(node.projects.join('\n'))}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Prompt para IA</label>
      <textarea class="modal-form-textarea" id="ef-prompt" rows="4" placeholder="Prompt para copiar e colar no ChatGPT/Claude...">${esc(node.aiPrompt)}</textarea>
    </div>

    <div class="modal-form-group">
      <label class="modal-form-label">Estado</label>
      <div style="display:flex;gap:12px;align-items:center">
        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);cursor:pointer">
          <input type="checkbox" id="ef-done" ${node.done ? 'checked' : ''}/> Concluído
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);cursor:pointer">
          <input type="checkbox" id="ef-current" ${node.current ? 'checked' : ''}/> Em progresso
        </label>
      </div>
    </div>

    <div class="modal-form-actions">
      <button class="modal-btn modal-btn-danger" onclick="deleteNodeFromModal()">Remover item</button>
      <button class="modal-btn modal-btn-secondary" onclick="closeModal()">Cancelar</button>
      <button class="modal-btn modal-btn-primary" onclick="saveEditModal()">Guardar</button>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function saveEditModal() {
  const phase = phases.find(p => p.id === editPhaseId);
  if (!phase) return;
  const node = phase.nodes.find(n => n.id === editNodeId);
  if (!node) return;

  function g(id) { return document.getElementById(id); }

  node.label = g('ef-label').value.trim() || 'Sem nome';
  node.intro = g('ef-intro').value.trim();
  node.desc = g('ef-desc').value.trim();
  node.vision = g('ef-vision').value.trim();
  node.whyRecommended = g('ef-why').value.trim();
  node.aiPrompt = g('ef-prompt').value.trim();
  node.done = g('ef-done').checked;
  node.current = g('ef-current').checked;

  node.learn = g('ef-learn').value.split('\n').map(s => s.trim()).filter(Boolean);
  node.projects = g('ef-projects').value.split('\n').map(s => s.trim()).filter(Boolean);

  node.free = g('ef-free').value.split('\n').map(s => {
    const parts = s.split('|').map(x => x.trim());
    return parts.length >= 2 ? { name: parts[0], url: parts[1] } : null;
  }).filter(Boolean);

  node.paid = g('ef-paid').value.split('\n').map(s => {
    const parts = s.split('|').map(x => x.trim());
    return parts.length >= 2 ? { name: parts[0], url: parts[1] } : null;
  }).filter(Boolean);

  // If current is set, remove current from others in same phase
  if (node.current) {
    phase.nodes.forEach(n => { if (n.id !== node.id) n.current = false; });
  }

  saveData();
  closeModal();
  render();
}

function deleteNodeFromModal() {
  if (!confirm('Remover este item?')) return;
  const phase = phases.find(p => p.id === editPhaseId);
  if (!phase) return;
  phase.nodes = phase.nodes.filter(n => n.id !== editNodeId);
  saveData();
  closeModal();
  render();
}

// ── Modal base ──
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  editPhaseId = null;
  editNodeId = null;
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// ── Init ──
document.addEventListener('DOMContentLoaded', render);
