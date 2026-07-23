// ── State ──
let selectedTopicId = null;
let selectedLessonId = null;
let notesOpen = true;
let copied = false;
let mobileView = 'content';

// ── SVG Icons (Lucide, mesmos do React) ──
const icons = {
  sun: `<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  bookOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  messageSquare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  checkBold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  // Professional replacements for emojis
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  python: `<img src="python-logo.png" alt="Python" style="width:100%;height:100%;object-fit:contain;">`,
  checkSquare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
};

// ── Helpers ──
function getSelectedTopic() { return topics.find(t => t.id === selectedTopicId) || null; }
function abbreviate(str, maxLen) { return str.length <= maxLen ? str : str.slice(0, maxLen) + "..."; }
function isDark() { return document.documentElement.classList.contains('dark'); }

function buildMarkdown(topic, fields) {
  const date = new Date().toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const lines = [`## ${topic.module} — ${topic.title}`, `**Data:** ${date}`, ``];
  if (fields.learned.trim()) lines.push(`### O que aprendi`, fields.learned.trim(), ``);
  if (fields.difficulty.trim()) lines.push(`### Dificuldades`, fields.difficulty.trim(), ``);
  if (fields.nextStep.trim()) lines.push(`### Proximo passo`, fields.nextStep.trim(), ``);
  lines.push(`---`, `> Gerado pelo Roadmap Vivo`);
  return lines.join("\n");
}

function loadNotes(id) {
  try { return JSON.parse(localStorage.getItem(`roadmap-notes-v2-${id}`)) || { learned: "", difficulty: "", nextStep: "" }; }
  catch { return { learned: "", difficulty: "", nextStep: "" }; }
}
function saveNotes(id, fields) { localStorage.setItem(`roadmap-notes-v2-${id}`, JSON.stringify(fields)); }

// ── Resource icon helpers ──
const ri = {
  video:    { icon: "video",    label: "Vídeo",     cls: "video" },
  article:  { icon: "file",     label: "Artigo",    cls: "article" },
  book:     { icon: "bookOpen", label: "Livro",     cls: "book" },
  platform: { icon: "globe",    label: "Plataforma",cls: "platform" },
  tool:     { icon: "wrench",   label: "Ferramenta",cls: "tool" },
  cert:     { icon: "checkCircle", label: "Certificação", cls: "platform" },
};

// ── Render ──
function render() {
  const topic = getSelectedTopic();
  const dark = isDark();

  // Timeline
  let timelineHTML = '';
  topics.forEach((t, i) => {
    const sel = t.id === selectedTopicId;
    const dotHTML = t.status === "completed"
      ? `<div class="topic-dot-num ${sel ? 'selected' : 'ring'}">${i + 1}</div>`
      : `<div class="topic-dot-small ${t.status} ${sel ? 'selected' : 'ring'}"></div>`;
    const statusIcon = t.status === "completed" ? icons.checkBold
      : t.status === "in-progress" ? `<span style="color:${dark ? '#C084FC' : '#9333EA'};font-size:10px">${icons.play}</span>`
      : `<span style="color:${dark ? '#6B7280' : '#9CA3AF'}">${icons.lock}</span>`;

    timelineHTML += `
      <div class="topic-item">
        <div class="topic-dot">${dotHTML}</div>
        <button class="topic-card ${t.status} ${sel ? 'selected' : ''}" onclick="selectTopic(${t.id})">
          <div class="topic-header">
            <span class="topic-module">${t.module}</span>
            <span class="topic-badge ${t.status}">${t.status === 'completed' ? 'Concluído' : t.status === 'in-progress' ? 'Em progresso' : 'A seguir'}</span>
          </div>
          <h3 class="topic-title ${t.status}"><span class="topic-emoji">${icons[t.emoji]}</span> ${t.title}</h3>
          <p class="topic-desc ${t.status === 'in-progress' ? 'in-progress' : ''}">${t.desc}</p>
          <div class="topic-footer">
            <div class="topic-icon ${t.status}">${statusIcon}</div>
            <span class="topic-hours ${t.status}">~${t.estimatedHours}h</span>
            ${sel ? '<span class="topic-open">← Aberto</span>' : ''}
          </div>
        </button>
      </div>`;
  });

  // Main content area
  let mainHTML = '';
  if (topic) {
    const notes = loadNotes(topic.id);
    const isEmpty = !notes.learned.trim() && !notes.difficulty.trim() && !notes.nextStep.trim();
    const completedLessons = topic.lessons.filter(l => l.completed).length;
    const progressPct = Math.round((completedLessons / topic.lessons.length) * 100);
    const selectedLesson = selectedLessonId ? topic.lessons.find(l => l.id === selectedLessonId) : null;

    const sc = {
      completed:   { label: "Concluído", bg: dark ? "rgba(20,83,45,0.3)" : "#DCFCE7", fg: dark ? "#4ADE80" : "#15803D" },
      "in-progress": { label: "Em progresso", bg: dark ? "rgba(88,28,135,0.3)" : "#F3E8FF", fg: dark ? "#C084FC" : "#7E22CE" },
      upcoming:    { label: "A seguir", bg: dark ? "#111827" : "#F3F4F6", fg: dark ? "#6B7280" : "#6B7280" },
    }[topic.status];

    let breadcrumbHTML = `<span class="breadcrumb-module">${topic.module}</span> <span class="breadcrumb-chevron">${icons.chevronRight}</span> `;
    breadcrumbHTML += selectedLesson
      ? `<span class="breadcrumb-lesson">${abbreviate(selectedLesson.title, 25)}</span>`
      : `<span class="breadcrumb-status" style="background:${sc.bg};color:${sc.fg}">${sc.label}</span>`;

    let lessonsHTML = '';
    topic.lessons.forEach((lesson, i) => {
      const ls = selectedLessonId === lesson.id;
      const checkIcon = lesson.completed ? `<span class="lesson-check completed">${icons.checkCircle}</span>`
        : `<span class="lesson-check ${ls ? 'selected' : 'pending'}">${icons.circle}</span>`;
      const textStyle = lesson.completed ? "completed" : ls ? "selected" : "";
      lessonsHTML += `
        <div class="lesson-item ${ls ? 'selected' : lesson.completed ? 'completed' : ''}" onclick="selectLesson(${lesson.id})">
          ${checkIcon}
          <div class="lesson-text ${textStyle}">${i + 1}. ${lesson.title}</div>
          <div class="lesson-duration"><span>${icons.clock}</span> ${lesson.duration}</div>
          ${!lesson.completed ? `<span class="lesson-play ${ls ? 'selected' : ''}">${icons.play}</span>` : ''}
        </div>`;
    });

    let resourcesHTML = '';
    topic.resources.forEach(r => {
      const m = ri[r.type];
      resourcesHTML += `
        <div class="resource-card">
          <div class="resource-icon ${m.cls}">${icons[m.icon]}</div>
          <div class="resource-info">
            <p class="resource-title">${r.title}</p>
            ${r.author ? `<p class="resource-author">${r.author}</p>` : ''}
            <div class="resource-tags">
              <span class="resource-tag ${m.cls}">${m.label}</span>
              ${r.free !== undefined ? `<span class="resource-free ${r.free ? 'yes' : 'no'}">${r.free ? 'Grátis' : 'Pago'}</span>` : ''}
            </div>
          </div>
          <span class="resource-link">${icons.externalLink}</span>
        </div>`;
    });

    let deepDiveHTML = '';
    topic.deepDive.forEach(r => {
      const m = ri[r.type];
      deepDiveHTML += `
        <div class="resource-card">
          <div class="resource-icon ${m.cls}">${icons[m.icon]}</div>
          <div class="resource-info">
            <p class="resource-title">${r.title}</p>
            <div class="resource-tags">
              <span class="resource-tag ${m.cls}">${m.label}</span>
              ${r.free !== undefined ? `<span class="resource-free ${r.free ? 'yes' : 'no'}">${r.free ? 'Grátis' : 'Pago'}</span>` : ''}
            </div>
          </div>
          <span class="resource-link">${icons.externalLink}</span>
        </div>`;
    });

    const copyBtnClass = isEmpty ? "copy-btn empty" : copied ? "copy-btn copied" : "copy-btn ready";
    const copyBtnIcon = copied ? icons.check : icons.copy;
    const copyBtnText = copied ? "Copiado!" : "Copiar Markdown";

    mainHTML = `
      <div class="main">
        <div class="content-area ${mobileView === 'content' ? 'mobile-show' : 'mobile-hide'}">
          <div class="content-header">
            <div class="breadcrumb">${breadcrumbHTML}</div>
            <h1 class="content-title"><span class="topic-emoji-lg">${icons[topic.emoji]}</span> ${topic.title}</h1>
            <p class="content-desc">${topic.longDesc}</p>
            <div class="meta-row">
              <div class="meta-item"><span>${icons.clock}</span> ~${topic.estimatedHours}h estimadas</div>
              <div class="meta-item"><span>${icons.bookOpen}</span> ${topic.lessons.length} aulas</div>
              ${completedLessons > 0 ? `<div class="meta-item green"><span>${icons.checkCircle}</span> ${completedLessons}/${topic.lessons.length} concluídas</div>` : ''}
            </div>
            ${progressPct > 0 ? `<div class="progress-row"><div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div><span class="progress-text">${progressPct}%</span></div>` : ''}
          </div>
          <div class="mb-20">
            <h2 class="section-title"><span>${icons.play}</span> Vídeo Principal</h2>
            <div class="video-card">
              <div class="video-thumb">
                <span class="video-emoji">${icons[topic.emoji]}</span>
                <div class="video-play"><span>${icons.play}</span></div>
              </div>
              <div class="video-info">
                <div>
                  <p class="video-title">${topic.mainVideo.title}</p>
                  <p class="video-channel">${topic.mainVideo.channel}</p>
                </div>
                <div class="video-duration"><span>${icons.clock}</span> ${topic.mainVideo.duration}</div>
              </div>
            </div>
          </div>
          <div class="mb-20">
            <h2 class="section-title"><span>${icons.bookOpen}</span> Aulas do Módulo</h2>
            <div class="lesson-list">${lessonsHTML}</div>
          </div>
          <div class="mb-20">
            <h2 class="section-title"><span>${icons.wrench}</span> Recursos Recomendados</h2>
            <div class="resources-grid">${resourcesHTML}</div>
          </div>
          <div>
            <h2 class="section-title orange"><span>${icons.flame}</span> Para Aprofundar</h2>
            <div class="deep-dive-list">${deepDiveHTML}</div>
            <div class="tip-box-wrapper">
              <img src="mascote-tip.png" alt="" class="tip-mascote">
              <div class="tip-box">
                <p>Termina as matérias antes de avançar para o aprofundamento. A base sólida acelera tudo que vem a seguir.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="notes-panel ${notesOpen ? 'open' : 'closed'} ${mobileView === 'notes' ? 'mobile-show' : 'mobile-hide'}">
          <button class="notes-toggle" onclick="toggleNotes()" title="${notesOpen ? 'Fechar notas' : 'Abrir notas'}">
            ${notesOpen ? icons.chevronRight : icons.chevronLeft}
          </button>
          ${!notesOpen ? `
          <div class="notes-closed">
            <div class="notes-closed-icon file">${icons.fileText}</div>
            <div class="notes-closed-icon chat">${icons.messageSquare}</div>
          </div>` : `
          <div class="notes-open">
            <div class="notes-header">
              <div class="notes-header-row">
                <span class="notes-header-icon">${icons.fileText}</span>
                <span class="notes-header-label">Notas</span>
              </div>
              <p class="notes-subtitle">Preenche depois de estudar. Salvo automaticamente por módulo.</p>
            </div>
            <div class="notes-fields">
              <div class="note-field">
                <div class="note-label-row"><span class="note-emoji">${icons.checkSquare}</span><span class="note-label">O que aprendi</span></div>
                <p class="note-hint">Escreve como se explicasses a um amigo. 2-3 frases é o suficiente.</p>
                <textarea class="note-textarea" rows="3" placeholder="Ex: Aprendi como as permissões funcionam no Linux..." oninput="updateNote('learned', this.value)">${notes.learned}</textarea>
              </div>
              <div class="note-field">
                <div class="note-label-row"><span class="note-emoji">${icons.alertTriangle}</span><span class="note-label">Dificuldades</span></div>
                <p class="note-hint">Sem julgamento — identificar o obstáculo é o primeiro passo.</p>
                <textarea class="note-textarea" rows="3" placeholder="Ex: Ainda não ficou claro como o sudo funciona..." oninput="updateNote('difficulty', this.value)">${notes.difficulty}</textarea>
              </div>
              <div class="note-field">
                <div class="note-label-row"><span class="note-emoji">${icons.arrowRight}</span><span class="note-label">Próximo passo</span></div>
                <p class="note-hint">Uma ação concreta. Quanto mais específica, melhor.</p>
                <textarea class="note-textarea" rows="3" placeholder="Ex: Fazer o desafio Bandit do OverTheWire..." oninput="updateNote('nextStep', this.value)">${notes.nextStep}</textarea>
              </div>
            </div>
            <img src="mascote-notes.png" alt="" class="notes-mascote">
            <div class="notes-footer">
              <button class="${copyBtnClass}" onclick="copyMarkdown()" ${isEmpty ? 'disabled' : ''}>
                <span>${copyBtnIcon}</span> ${copyBtnText}
              </button>
              <p class="copy-hint">Cola no teu editor → git push</p>
            </div>
          </div>`}
        </div>
      </div>`;
  } else {
    mainHTML = `
      <div class="main">
        <div class="content-area empty-state ${mobileView === 'content' ? 'mobile-show' : 'mobile-hide'}">
          <img src="mascote.png" alt="Mascote" class="empty-mascote">
          <h2 class="empty-title">Escolhe um módulo</h2>
          <p class="empty-desc">Clica num dos módulos ao lado para veres o conteúdo, aulas e recursos.</p>
        </div>
      </div>`;
  }

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
        <a href="https://github.com/LioExp/myroadmap" target="_blank" rel="noopener noreferrer" title="GitHub" class="nav-btn">${icons.github}</a>
        <a href="https://lioexp.github.io/mypage" target="_blank" rel="noopener noreferrer" title="Portfólio" class="nav-btn">${icons.globe}</a>
        <div class="nav-divider"></div>
        <button class="nav-btn" onclick="toggleTheme()" title="Trocar tema" id="theme-btn">${dark ? icons.moon : icons.sun}</button>
      </div>
    </div>
    <div class="content">
      <div class="timeline ${mobileView === 'timeline' ? 'mobile-show' : 'mobile-hide'}">
        <h2 class="timeline-title">Meu Roadmap <span class="timeline-title-icon">${icons.compass}</span></h2>
        <div class="timeline-list">
          <div class="timeline-line"></div>
          ${timelineHTML}
        </div>
      </div>
      ${mainHTML}
    </div>
    <div class="mobile-nav">
      <button class="mobile-nav-btn ${mobileView === 'timeline' ? 'active' : ''}" onclick="switchMobileView('timeline')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <span>Roadmap</span>
      </button>
      <button class="mobile-nav-btn ${mobileView === 'content' ? 'active' : ''}" onclick="switchMobileView('content')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <span>Conteúdo</span>
      </button>
      <button class="mobile-nav-btn ${mobileView === 'notes' ? 'active' : ''}" onclick="switchMobileView('notes')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
        <span>Notas</span>
      </button>
    </div>`;
}

// ── Actions ──
function selectTopic(id) { selectedTopicId = selectedTopicId === id ? null : id; selectedLessonId = null; render(); }
function selectLesson(id) { window.location.href = `lesson.html?topic=${selectedTopicId}&lesson=${id}`; }
function toggleNotes() { notesOpen = !notesOpen; render(); }
function switchMobileView(view) { mobileView = view; render(); }
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark() ? 'dark' : 'light');
  render();
}
function updateNote(key, val) {
  const topic = getSelectedTopic();
  const notes = loadNotes(topic.id);
  notes[key] = val;
  saveNotes(topic.id, notes);
}
function copyMarkdown() {
  const topic = getSelectedTopic();
  const notes = loadNotes(topic.id);
  navigator.clipboard.writeText(buildMarkdown(topic, notes)).then(() => {
    copied = true; render();
    setTimeout(() => { copied = false; render(); }, 2500);
  });
}

// ── Init ──
if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
const urlParams = new URLSearchParams(window.location.search);
const returnTopic = parseInt(urlParams.get('topic'));
if (returnTopic) selectedTopicId = returnTopic;
render();
