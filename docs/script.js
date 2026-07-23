// ═══════════════════════════════════════════════
// Roadmap Vivo — v3.0 Refactor
// ═══════════════════════════════════════════════

// ── State ──
let selectedModule = null; // expanded module id
let selectedLesson = null; // expanded lesson id inside drawer
let searchQuery = '';
let activeTrimester = null;
let materialsIndex = [];

// ── Helpers ──
function isDark() { return document.documentElement.classList.contains('dark'); }
function getVideoId(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return m ? m[1] : '';
}
function abbreviate(s, n) { return s.length <= n ? s : s.slice(0, n) + '…'; }

// ── Materials ──
async function loadMaterialsIndex() {
  try {
    const res = await fetch('materiais-index.json');
    if (res.ok) materialsIndex = await res.json();
  } catch (e) { /* ignore */ }
}
function hasMaterial(slug, lessonId) {
  return materialsIndex.some(m => m.modulo === slug && m.aula === lessonId && m.conteudo);
}
function getMaterial(slug, lessonId) {
  return materialsIndex.find(m => m.modulo === slug && m.aula === lessonId);
}
function lessonStatus(slug, lessonId) {
  return hasMaterial(slug, lessonId) ? 'completed' : 'pending';
}
function topicProgress(topic) {
  const done = topic.lessons.filter(l => lessonStatus(topic.slug, l.id) === 'completed').length;
  return { done, total: topic.lessons.length, pct: Math.round((done / topic.lessons.length) * 100) };
}

// ── Progress persistence ──
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('roadmap-progress') || '{}'); } catch { return {}; }
}
function saveProgress(id, done) {
  const p = loadProgress();
  p[id] = done;
  localStorage.setItem('roadmap-progress', JSON.stringify(p));
}

// ── Diary ──
function loadDiary() {
  try { return JSON.parse(localStorage.getItem('roadmap-diary') || '[]'); } catch { return []; }
}
function saveDiary(entries) {
  localStorage.setItem('roadmap-diary', JSON.stringify(entries));
}
function addDiaryEntry(moduleId, learned, difficulty, nextStep) {
  const entries = loadDiary();
  const topic = topics.find(t => t.id === moduleId);
  entries.unshift({
    id: Date.now(),
    moduleId,
    module: topic ? topic.title : '',
    phase: topic ? topic.module : '',
    date: new Date().toLocaleDateString('pt-PT'),
    learned, difficulty, nextStep
  });
  saveDiary(entries);
}
function generateMarkdown(entry) {
  return `## ${entry.module} — ${entry.date}\n\n### O que aprendi\n${entry.learned}\n\n### Dificuldades\n${entry.difficulty}\n\n### Próximo passo\n${entry.nextStep}\n\n---\n> Gerado pelo Roadmap Vivo`;
}

// ── Markdown renderer ──
function renderMarkdown(md) {
  let html = md
    .replace(/^---[\s\S]*?---\n*/m, '')
    .replace(/\{\{youtube:?\s*([^}]+)\}\}/g, (_, id) => {
      const vid = id.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || id.trim();
      return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen loading="lazy"></iframe></div>`;
    })
    .replace(/\{\{video:\s*([^}]+)\}\}/g, (_, url) => {
      const vid = url.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] || '';
      if (vid) return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${vid}" allowfullscreen loading="lazy"></iframe></div>`;
      return `<div class="md-video"><video src="${url.trim()}" controls></video></div>`;
    })
    .replace(/\{\{image:\s*([^}]+)\}\}/g, '<div class="md-image"><img src="$1" alt=""></div>')
    .replace(/\{\{alert:\s*([^}]+)\}\}/g, '<div class="md-alert">$1</div>')
    .replace(/\{\{divider\}\}/g, '<hr class="md-divider">')
    .replace(/\{\{fontes:\s*([\s\S]*?)\}\}/g, (_, block) => {
      const urls = block.split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
      const favs = urls.map(u => { try { return `<img src="https://www.google.com/s2/favicons?domain=${new URL(u).hostname}&sz=32" class="fonte-favicon" />`; } catch { return ''; } }).join('');
      const links = urls.map(u => { try { return `<li><a href="${u}" target="_blank">${new URL(u).hostname}</a></li>`; } catch { return ''; } }).join('');
      return `<details class="fontes-bloco"><summary><span class="fontes-favicons">${favs}</span>Fontes (${urls.length})</summary><ul>${links}</ul></details>`;
    })
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\| (.+)$/gm, (m, row) => {
      const cells = row.split(' | ');
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, m => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[hult])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .trim();
  return html;
}

// ── Search ──
function filterTopics(query) {
  if (!query) return topics;
  const q = query.toLowerCase();
  return topics.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.module.toLowerCase().includes(q) ||
    t.lessons.some(l => l.title.toLowerCase().includes(q)) ||
    t.resources.some(r => r.title.toLowerCase().includes(q))
  );
}

// ── Trimesters ──
const trimesters = [
  { id: 'T1', label: 'T1 · Base', modules: [1, 2, 3] },
  { id: 'T2', label: 'T2 · SOC Analyst', modules: [4, 5, 6] },
  { id: 'T3', label: 'T3 · Pentester', modules: [7, 8, 9] },
  { id: 'T4', label: 'T4 · Sec Engineer', modules: [10] },
  { id: 'T5', label: 'T5 · ML Fundamentals', modules: [11, 12, 13] },
  { id: 'T6', label: 'T6 · ML Avançado', modules: [14, 15, 16] },
  { id: 'T7', label: 'T7 · AI Security', modules: [17, 18, 19] },
  { id: 'T8', label: 'T8 · Destino', modules: [20] },
];

function getPhaseClass(module) {
  if (module.id <= 10) return 'fase1';
  if (module.id <= 16) return 'fase2';
  return 'fase3';
}

// ── Render ──
function render() {
  const filtered = filterTopics(searchQuery);
  const dark = isDark();

  // Trimester bar
  let trimesterHTML = trimesters.map(t =>
    `<button class="trimester-pill ${activeTrimester === t.id ? 'active' : ''}" onclick="selectTrimester('${t.id}')">${t.label}</button>`
  ).join('');

  // Modules list
  let modulesHTML = '';
  filtered.forEach(t => {
    const tp = topicProgress(t);
    const isActive = selectedModule === t.id;
    const phase = getPhaseClass(t);

    modulesHTML += `
      <div class="module-card ${isActive ? 'active' : ''}" onclick="toggleModule(${t.id})">
        <div class="module-header">
          <span class="module-num">${t.module}</span>
          <span class="module-badge ${phase}">${t.module}</span>
        </div>
        <div class="module-title">${t.title}</div>
        <div class="module-desc">${t.desc}</div>
        <div class="module-footer">
          <div class="module-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ~${t.estimatedHours}h</div>
          <div class="module-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> ${t.lessons.length} aulas</div>
          <div class="module-progress"><div class="module-progress-fill" style="width:${tp.pct}%"></div></div>
          ${tp.done > 0 ? `<span class="module-meta" style="color:var(--green)">${tp.done}/${tp.total}</span>` : ''}
          ${isActive ? '<div class="module-pulse"></div>' : ''}
        </div>
      </div>`;

    // Drawer content
    if (isActive) {
      let lessonsHTML = '';
      t.lessons.forEach((l, i) => {
        const status = lessonStatus(t.slug, l.id);
        const isDone = status === 'completed';
        const isSel = selectedLesson === l.id;
        lessonsHTML += `
          <div class="lesson-item ${isSel ? 'active' : ''} ${isDone ? 'completed' : ''}" onclick="toggleLesson(${l.id})">
            <span class="lesson-check ${isDone ? 'completed' : isSel ? 'active' : 'pending'}">
              ${isDone ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
            </span>
            <div class="lesson-text ${isDone ? 'completed' : ''}">${i + 1}. ${l.title}</div>
            <div class="lesson-duration"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${l.duration}</div>
          </div>`;

        // Lesson expanded content
        if (isSel) {
          const mat = getMaterial(t.slug, l.id);
          lessonsHTML += `
            <div class="lesson-content open">
              <div class="lesson-breadcrumb">${t.module} › ${t.title} › ${abbreviate(l.title, 30)}</div>
              <div class="lesson-content-title">${l.title}</div>
              ${l.topics && l.topics.length ? `
              <div class="lesson-topics">
                <div class="lesson-topics-title">Índice da Aula</div>
                <ul class="lesson-topics-list">
                  ${l.topics.map((tp, i) => `<li class="lesson-topic-item"><span class="lesson-topic-num">${i + 1}</span> ${tp}</li>`).join('')}
                </ul>
              </div>` : ''}
              ${mat && mat.conteudo ? `<div class="lesson-material" id="lessonMaterial"></div>` : `
              <div class="lesson-placeholder">
                <img src="mascote.png" alt="Mascote">
                <h3>Vazio por enquanto</h3>
              </div>`}
            </div>`;
        }
      });

      // Resources
      let resourcesHTML = '';
      t.resources.forEach(r => {
        const tag = r.url ? 'a' : 'div';
        const href = r.url ? ` href="${r.url}" target="_blank" rel="noopener"` : '';
        const cls = r.type || 'platform';
        resourcesHTML += `
          <${tag} class="resource-card"${href}>
            <div class="resource-icon ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/></svg></div>
            <div class="resource-info">
              <p class="resource-title">${r.title}</p>
              ${r.author ? `<p class="resource-author">${r.author}</p>` : ''}
              <div class="resource-tags">
                <span class="resource-tag ${cls}">${cls}</span>
                ${r.free !== undefined ? `<span class="resource-free ${r.free ? 'yes' : 'no'}">${r.free ? 'Grátis' : 'Pago'}</span>` : ''}
              </div>
            </div>
          </${tag}>`;
      });

      modulesHTML += `
        <div class="drawer open">
          <div class="drawer-header">
            <button class="drawer-back" onclick="toggleModule(null)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="m15 18-6-6 6-6"/></svg></button>
            <span class="drawer-title">${t.title}</span>
          </div>
          <p class="drawer-desc">${t.longDesc}</p>
          <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/${getVideoId(t.mainVideo.url)}" allowfullscreen loading="lazy"></iframe>
          </div>
          <p class="video-embed-title">${t.mainVideo.title}</p>
          ${t.mainVideo.description ? `<details class="video-desc-details"><summary>Descrição</summary><p class="video-desc-text">${t.mainVideo.description}</p></details>` : ''}
          <div style="margin-top:20px">
            <div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Aulas</div>
            <div class="lesson-list">${lessonsHTML}</div>
          </div>
          <div style="margin-top:20px">
            <div class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/></svg> Recursos</div>
            <div class="resources-grid">${resourcesHTML}</div>
          </div>
          <div class="tip-box-wrapper">
            <img src="mascote-tip.png" alt="" class="tip-mascote">
            <div class="tip-box">
              <p>Termina as matérias antes de avançar para o aprofundamento. A base sólida acelera tudo que vem a seguir.</p>
            </div>
          </div>
        </div>`;
    }
  });

  // Diary sidebar
  const diaryEntries = loadDiary();
  let diaryHTML = '';
  if (diaryEntries.length === 0) {
    diaryHTML = `
      <div class="diary-empty">
        <img src="mascote.png" alt="Mascote">
        <p>Sem entradas no diário ainda.</p>
        <button class="diary-btn" onclick="showDiaryForm()">+ Nova entrada</button>
      </div>`;
  } else {
    diaryHTML = diaryEntries.slice(0, 20).map(e => {
      const phaseColor = e.moduleId <= 10 ? 'var(--p-solid)' : e.moduleId <= 16 ? 'var(--t-solid)' : 'var(--c-solid)';
      return `
        <div class="diary-entry" style="border-left-color:${phaseColor}" onclick="showDiaryDetail(${e.id})">
          <div class="diary-entry-date">${e.date} · ${e.phase}</div>
          <div class="diary-entry-title">${e.module}</div>
          <div class="diary-entry-preview">${e.learned || e.difficulty || e.nextStep || 'Sem conteúdo'}</div>
        </div>`;
    }).join('');
  }

  // Render app
  document.getElementById('app').innerHTML = `
    <div class="navbar">
      <div class="nav-left">
        <img src="logo.png" alt="MyRoadmap" class="nav-logo-img logo-light">
        <img src="logo-dark.png" alt="MyRoadmap" class="nav-logo-img logo-dark">
        <span class="nav-logo-text">Roadmap Vivo</span>
        <div class="nav-divider"></div>
        <div class="nav-pill"><span>AI Security</span></div>
      </div>
      <div class="nav-right">
        <a href="https://github.com/LioExp/myroadmap" target="_blank" rel="noopener noreferrer" title="GitHub" class="nav-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.304 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 2.212 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
        <a href="https://lioexp.github.io/mypage" target="_blank" rel="noopener noreferrer" title="Portfólio" class="nav-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></a>
        <div class="nav-divider"></div>
        <button class="nav-btn" onclick="toggleTheme()" title="Trocar tema"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">${dark ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'}</svg></button>
      </div>
    </div>
    <div class="search-bar">
      <input type="text" class="search-input" placeholder="Buscar módulo, recurso ou entrada de diário…" value="${searchQuery}" oninput="onSearch(this.value)">
    </div>
    <div class="trimester-bar">
      <button class="trimester-pill ${!activeTrimester ? 'active' : ''}" onclick="selectTrimester(null)">Todos</button>
      ${trimesterHTML}
    </div>
    <div class="content">
      <div class="modules-list" id="modulesList">
        ${modulesHTML.length ? modulesHTML : '<div class="empty-state"><img src="mascote.png" alt="Mascote" class="empty-mascote"><h2 class="empty-title">Nenhum módulo encontrado</h2><p class="empty-desc">Tenta outro termo de busca.</p></div>'}
      </div>
      <div class="diary-panel">
        <div class="diary-header">
          <div class="diary-title">Diário</div>
          <div class="diary-subtitle">Registra o que aprendeste</div>
        </div>
        <div class="diary-entries">
          ${diaryHTML}
        </div>
        <div style="padding:12px">
          <button class="diary-btn" onclick="showDiaryForm()">+ Nova entrada</button>
        </div>
      </div>
    </div>`;

  // Load material for selected lesson
  if (selectedModule && selectedLesson) {
    const topic = topics.find(t => t.id === selectedModule);
    if (topic) {
      const mat = getMaterial(topic.slug, selectedLesson);
      if (mat && mat.conteudo) {
        const el = document.getElementById('lessonMaterial');
        if (el) el.innerHTML = renderMarkdown(mat.conteudo);
      }
    }
  }
}

// ── Actions ──
function toggleModule(id) {
  selectedModule = selectedModule === id ? null : id;
  selectedLesson = null;
  render();
}
function toggleLesson(id) {
  selectedLesson = selectedLesson === id ? null : id;
  render();
}
function selectTrimester(id) {
  activeTrimester = activeTrimester === id ? null : id;
  if (activeTrimester) {
    const tri = trimesters.find(t => t.id === activeTrimester);
    if (tri) {
      const first = topics.find(t => tri.modules.includes(t.id));
      if (first) selectedModule = first.id;
    }
  }
  render();
}
function onSearch(val) {
  searchQuery = val;
  render();
}
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark() ? 'dark' : 'light');
  render();
}

// ── Diary actions ──
function showDiaryForm() {
  const diaryPanel = document.querySelector('.diary-entries');
  if (!diaryPanel) return;
  diaryPanel.innerHTML = `
    <div class="diary-form">
      <div class="diary-form-title">Nova entrada</div>
      <div class="diary-form-field">
        <label>Módulo</label>
        <select id="diaryModule" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:var(--radius);font-family:var(--font-body);font-size:13px;background:var(--surface);color:var(--ink)">
          ${topics.map(t => `<option value="${t.id}">${t.module} — ${t.title}</option>`).join('')}
        </select>
      </div>
      <div class="diary-form-field">
        <label>O que aprendi</label>
        <textarea id="diaryLearned" placeholder="Escreve como se explicasses a um amigo…"></textarea>
      </div>
      <div class="diary-form-field">
        <label>Dificuldades</label>
        <textarea id="diaryDifficulty" placeholder="O que te custou mais…"></textarea>
      </div>
      <div class="diary-form-field">
        <label>Próximo passo</label>
        <textarea id="diaryNext" placeholder="Uma ação concreta…"></textarea>
      </div>
      <div class="diary-form-actions">
        <button class="cancel" onclick="render()">Cancelar</button>
        <button class="save" onclick="submitDiary()">Salvar</button>
      </div>
    </div>`;
}
function submitDiary() {
  const moduleId = parseInt(document.getElementById('diaryModule').value);
  const learned = document.getElementById('diaryLearned').value;
  const difficulty = document.getElementById('diaryDifficulty').value;
  const nextStep = document.getElementById('diaryNext').value;
  addDiaryEntry(moduleId, learned, difficulty, nextStep);
  render();
}
function showDiaryDetail(id) {
  const entries = loadDiary();
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  const diaryPanel = document.querySelector('.diary-entries');
  diaryPanel.innerHTML = `
    <div class="diary-form">
      <button class="diary-btn" onclick="render()" style="margin-bottom:12px">← Voltar</button>
      <div class="diary-form-title">${entry.module}</div>
      <div class="diary-entry-date" style="margin-bottom:12px">${entry.date} · ${entry.phase}</div>
      <div class="diary-form-field"><label>O que aprendi</label><div style="font-size:13px;color:var(--ink);padding:8px;background:var(--surface);border-radius:var(--radius);white-space:pre-wrap">${entry.learned || '—'}</div></div>
      <div class="diary-form-field"><label>Dificuldades</label><div style="font-size:13px;color:var(--ink);padding:8px;background:var(--surface);border-radius:var(--radius);white-space:pre-wrap">${entry.difficulty || '—'}</div></div>
      <div class="diary-form-field"><label>Próximo passo</label><div style="font-size:13px;color:var(--ink);padding:8px;background:var(--surface);border-radius:var(--radius);white-space:pre-wrap">${entry.nextStep || '—'}</div></div>
      <button class="diary-btn" style="margin-top:12px;color:var(--c-solid);border-color:var(--c-solid)" onclick="deleteDiaryEntry(${id})">Apagar entrada</button>
    </div>`;
}
function deleteDiaryEntry(id) {
  const entries = loadDiary().filter(e => e.id !== id);
  saveDiary(entries);
  render();
}

// ── Init ──
if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
loadMaterialsIndex().then(() => render());
