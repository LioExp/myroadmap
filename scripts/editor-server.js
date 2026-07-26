const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3333;
const MATERIAIS_DIR = path.join(__dirname, "..", "materiais");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

function listModules() {
  if (!fs.existsSync(MATERIAIS_DIR)) return [];
  return fs.readdirSync(MATERIAIS_DIR).filter((d) => {
    const p = path.join(MATERIAIS_DIR, d);
    return fs.statSync(p).isDirectory();
  });
}

function listLessons(mod) {
  const dir = path.join(MATERIAIS_DIR, mod);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      file: f,
      title: f.replace(/\.md$/, "").replace(/^\d+-/, "").replace(/-/g, " "),
    }));
}

function readLesson(mod, file) {
  const p = path.join(MATERIAIS_DIR, mod, file);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n*/);
  let frontmatter = {};
  let content = raw;
  if (fmMatch) {
    fmMatch[1].split("\n").forEach((line) => {
      const [k, ...rest] = line.split(":");
      if (k && rest.length) frontmatter[k.trim()] = rest.join(":").trim().replace(/^['"]|['"]$/g, "");
    });
    content = raw.slice(fmMatch[0].length).trim();
  }
  return { frontmatter, content, raw };
}

function saveLesson(mod, file, frontmatter, content) {
  const dir = path.join(MATERIAIS_DIR, mod);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const md = `---\n${fm}\n---\n\n${content.trim()}\n`;
  fs.writeFileSync(path.join(dir, file), md, "utf8");
}

const HTML = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Editor de Materiais</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #F3F4F6; height: 100vh; display: flex; flex-direction: column; }
header { background: #141414; border-bottom: 1px solid #1F2937; padding: 10px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
header h1 { font-size: 14px; font-weight: 800; color: #fff; }
header select, header button { background: #2a2a2a; color: #fff; border: 1px solid #374151; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
header select:hover, header button:hover { background: #333; }
header button.primary { background: #22C55E; color: #000; font-weight: 700; border: none; }
header button.primary:hover { background: #16A34A; }
header button.danger { background: #EF4444; color: #fff; font-weight: 700; border: none; }
header button.danger:hover { background: #DC2626; }
header .spacer { flex: 1; }
header .status { font-size: 11px; color: #9CA3AF; }
.main { display: flex; flex: 1; min-height: 0; }
.panel { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.panel + .panel { border-left: 1px solid #1F2937; }
.panel-header { background: #111827; padding: 8px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #9CA3AF; border-bottom: 1px solid #1F2937; flex-shrink: 0; }
#editor { flex: 1; background: #1a1a1a; color: #F3F4F6; border: none; outline: none; resize: none; padding: 20px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.7; tab-size: 2; }
#editor::placeholder { color: #4B5563; }
#preview { flex: 1; overflow-y: auto; padding: 20px; font-size: 14px; line-height: 1.7; }
#preview h1 { font-size: 22px; font-weight: 800; margin: 24px 0 12px; color: #F3F4F6; }
#preview h2 { font-size: 18px; font-weight: 800; margin: 20px 0 10px; color: #F3F4F6; }
#preview h3 { font-size: 15px; font-weight: 700; margin: 16px 0 8px; color: #D1D5DB; }
#preview p { margin: 8px 0; color: #9CA3AF; }
#preview ul, #preview ol { margin: 8px 0; padding-left: 24px; color: #9CA3AF; }
#preview li { margin: 4px 0; }
#preview code { background: #1F2937; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #C084FC; }
#preview pre { background: #111827; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0; border: 1px solid #1F2937; }
#preview pre code { background: none; padding: 0; color: #D1D5DB; }
#preview blockquote { border-left: 3px solid #9333EA; padding-left: 16px; margin: 12px 0; color: #6B7280; }
#preview table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
#preview th, #preview td { border: 1px solid #1F2937; padding: 8px 12px; text-align: left; }
#preview th { background: #111827; color: #D1D5DB; font-weight: 700; }
#preview td { color: #9CA3AF; }
#preview a { color: #A78BFA; text-decoration: none; }
#preview a:hover { text-decoration: underline; }
#preview hr { border: none; border-top: 1px solid #1F2937; margin: 20px 0; }
#preview img { max-width: 100%; border-radius: 8px; margin: 12px 0; }
#preview strong { color: #F3F4F6; }
.toolbar { display: flex; gap: 4px; padding: 6px 12px; background: #1a1a1a; border-bottom: 1px solid #1F2937; flex-wrap: wrap; flex-shrink: 0; }
.toolbar button { background: transparent; border: none; color: #9CA3AF; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.toolbar button:hover { background: #2a2a2a; color: #F3F4F6; }
.toolbar button.active { background: #9333EA; color: #fff; }
.toolbar .sep { width: 1px; background: #374151; margin: 4px 6px; }
.frontmatter-bar { display: flex; gap: 8px; padding: 6px 12px; background: #111827; border-bottom: 1px solid #1F2937; align-items: center; flex-shrink: 0; }
.frontmatter-bar label { font-size: 11px; color: #9CA3AF; font-weight: 600; }
.frontmatter-bar input { background: #1a1a1a; color: #F3F4F6; border: 1px solid #374151; border-radius: 6px; padding: 4px 8px; font-size: 12px; outline: none; }
.frontmatter-bar input:focus { border-color: #9333EA; }
</style>
</head>
<body>
<header>
  <h1>📝 Editor de Materiais</h1>
  <select id="modSelect"><option value="">— Módulo —</option></select>
  <select id="aulaSelect"><option value="">— Aula —</option></select>
  <button onclick="loadLesson()">📂 Abrir</button>
  <button class="danger" onclick="newLesson()">➕ Novo</button>
  <div class="spacer"></div>
  <span class="status" id="status">Pronto</span>
  <button class="primary" onclick="saveLesson()">💾 Salvar</button>
</header>
<div class="frontmatter-bar">
  <label>Módulo:</label><input id="fmMod" placeholder="ex: linux">
  <label>Aula:</label><input id="fmAula" type="number" placeholder="ex: 2">
  <label>Título:</label><input id="fmTitulo" placeholder="ex: Instalação e primeiros passos">
</div>
<div class="toolbar" id="toolbar">
  <button onclick="wrap('**','**')" title="Negrito"><b>B</b></button>
  <button onclick="wrap('*','*')" title="Itálico"><i>I</i></button>
  <button onclick="wrap('~~','~~')" title="Riscado"><s>S</s></button>
  <button onclick="wrap('\`','\`')" title="Código">&lt;/&gt;</button>
  <div class="sep"></div>
  <button onclick="wrapLine('# ')">H1</button>
  <button onclick="wrapLine('## ')">H2</button>
  <button onclick="wrapLine('### ')">H3</button>
  <div class="sep"></div>
  <button onclick="wrapLine('- ')">• Lista</button>
  <button onclick="wrapLine('1. ')">1. Lista</button>
  <button onclick="wrapLine('- [ ] ')">☐ Task</button>
  <div class="sep"></div>
  <button onclick="insertTable()">📊 Tabela</button>
  <button onclick="insertHr()">— HR</button>
</div>
<div class="main">
  <div class="panel">
    <div class="panel-header">Editor</div>
    <textarea id="editor" placeholder="Escreve o teu markdown aqui..."></textarea>
  </div>
  <div class="panel">
    <div class="panel-header">Preview</div>
    <div id="preview"></div>
  </div>
</div>
<script>
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const modSelect = document.getElementById('modSelect');
const aulaSelect = document.getElementById('aulaSelect');
const statusEl = document.getElementById('status');
const fmMod = document.getElementById('fmMod');
const fmAula = document.getElementById('fmAula');
const fmTitulo = document.getElementById('fmTitulo');

let currentMod = '';
let currentFile = '';

function setStatus(msg, ok) { statusEl.textContent = msg; statusEl.style.color = ok ? '#22C55E' : '#EF4444'; setTimeout(() => statusEl.style.color = '#9CA3AF', 2000); }

function wrap(before, after) {
  const start = editor.selectionStart, end = editor.selectionEnd;
  const text = editor.value;
  editor.value = text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end);
  editor.selectionStart = start + before.length;
  editor.selectionEnd = end + before.length;
  editor.focus();
  updatePreview();
}

function wrapLine(prefix) {
  const start = editor.selectionStart;
  const lineStart = editor.value.lastIndexOf('\\n', start - 1) + 1;
  editor.value = editor.value.slice(0, lineStart) + prefix + editor.value.slice(lineStart);
  editor.selectionStart = editor.selectionEnd = start + prefix.length;
  editor.focus();
  updatePreview();
}

function insertTable() {
  const tbl = '| Coluna 1 | Coluna 2 | Coluna 3 |\\n|----------|----------|----------|\\n| Dado 1   | Dado 2   | Dado 3   |\\n';
  const start = editor.selectionStart;
  editor.value = editor.value.slice(0, start) + tbl + editor.value.slice(start);
  updatePreview();
}

function insertHr() {
  wrapLine('\\n---\\n\\n');
}

function updatePreview() {
  try { preview.innerHTML = marked.parse(editor.value); } catch(e) { preview.innerHTML = '<p style=color:#EF4444>Erro ao renderizar</p>'; }
}

editor.addEventListener('input', updatePreview);

async function loadModules() {
  const r = await fetch('/api/modules');
  const mods = await r.json();
  modSelect.innerHTML = '<option value="">— Módulo —</option>' + mods.map(m => '<option value="' + m + '">' + m + '</option>').join('');
}

async function loadAulas(mod) {
  if (!mod) { aulaSelect.innerHTML = '<option value="">— Aula —</option>'; return; }
  const r = await fetch('/api/lessons?mod=' + mod);
  const aulas = await r.json();
  aulaSelect.innerHTML = '<option value="">— Aula —</option>' + aulas.map(a => '<option value="' + a.file + '">' + a.title + '</option>').join('');
}

modSelect.addEventListener('change', () => { loadAulas(modSelect.value); });

async function loadLesson() {
  const mod = modSelect.value, file = aulaSelect.value;
  if (!mod || !file) return;
  const r = await fetch('/api/lesson?mod=' + mod + '&file=' + file);
  const data = await r.json();
  if (!data) return setStatus('Erro ao carregar', false);
  currentMod = mod; currentFile = file;
  editor.value = data.content;
  fmMod.value = data.frontmatter.modulo || mod;
  fmAula.value = data.frontmatter.aula || '';
  fmTitulo.value = data.frontmatter.titulo || '';
  updatePreview();
  setStatus('📖 ' + file, true);
}

async function newLesson() {
  currentMod = ''; currentFile = '';
  editor.value = '';
  fmMod.value = fmAula.value = fmTitulo.value = '';
  updatePreview();
  setStatus('✏️ Novo material', true);
}

async function saveLesson() {
  const mod = fmMod.value.trim() || currentMod;
  const aula = fmAula.value.trim();
  const titulo = fmTitulo.value.trim();
  if (!mod || !aula) return setStatus('Preenche módulo e aula', false);

  const file = aula.padStart(2, '0') + '-' + (titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || 'aula-' + aula) + '.md';
  const body = JSON.stringify({ mod, file, content: editor.value, frontmatter: { modulo: mod, aula, titulo } });
  const r = await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  const res = await r.json();
  if (res.ok) {
    currentMod = mod; currentFile = file;
    setStatus('✅ Salvo: ' + file, true);
    loadModules(); loadAulas(mod);
  } else {
    setStatus('❌ ' + (res.error || 'Erro'), false);
  }
}

loadModules();
updatePreview();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // API routes
  if (pathname === "/api/modules" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(listModules()));
  }

  if (pathname === "/api/lessons" && req.method === "GET") {
    const mod = url.searchParams.get("mod");
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(listLessons(mod)));
  }

  if (pathname === "/api/lesson" && req.method === "GET") {
    const mod = url.searchParams.get("mod");
    const file = url.searchParams.get("file");
    const data = readLesson(mod, file);
    res.writeHead(data ? 200 : 404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(data || { error: "not found" }));
  }

  if (pathname === "/api/save" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { mod, file, content, frontmatter } = JSON.parse(body);
        if (!mod || !file || frontmatter === undefined) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ ok: false, error: "mod, file e frontmatter obrigatórios" }));
        }
        saveLesson(mod, file, frontmatter, content);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Serve editor UI
  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": MIME[".html"] });
    return res.end(HTML);
  }

  // 404
  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  📝 Editor de Materiais\n`);
  console.log(`  ${url}\n`);
  // Try to open browser
  try {
    execSync(`xdg-open ${url} || open ${url} || start ${url}`, { stdio: "ignore" });
  } catch (_) {}
});
