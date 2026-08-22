# Roadmap Vivo — Roadmap Detalhado de Desenvolvimento

> Versão 2.0 | Baseado em auditoria completa do `design-page` (Next.js/React) e `docs/` (GitHub Pages vanilla) + PRD v2.0

---

## 📊 Estado Atual (Auditoria)

### O que existe hoje

| Projeto | Stack | Estado | Deploy |
|---------|-------|--------|--------|
| **design-page** | Next.js 16, React 19, TS, Tailwind 4 | **Dashboard interativo completo** — timeline, content viewer, notes panel, progress derivado de `materiais-index.json`, localStorage para notas, YouTube embed, markdown renderer custom, mobile bottom nav, dark mode | Local only (`pnpm dev`) |
| **docs/** (myroadmap) | HTML/CSS/JS vanilla | **Site estático em produção** — 17 módulos, 100+ aulas, materials index, GitHub Action para gerar índice, mesma UI/UX que design-page mas vanilla | GitHub Pages: `lioexp.github.io/myroadmap` |

### Dados (compartilhados entre os dois)
- **17 módulos** (`topics.ts` / `data.js`) — Linux → Segurança de Modelos
- **~150 aulas** com tópicos detalhados, duração, recursos, deep dive
- **Materiais de estudo** em `/materiais/` (Markdown com frontmatter `modulo`, `aula`) → GitHub Action → `materiais-index.json`
- **Progresso = material existe** (não localStorage manual) — fonte única de verdade

### Gaps identificados
| Área | design-page (Next.js) | docs/ (GitHub Pages) | Gap |
|------|----------------------|---------------------|-----|
| **Deploy** | ❌ Não deployado | ✅ Produção | Next.js não está em produção |
| **Parity** | ✅ Completo (React) | ✅ Completo (Vanilla) | Duplicação de lógica (render, state, markdown) |
| **Aulas com material** | ✅ Renderiza `conteudo` | ✅ Renderiza `conteudo` | OK |
| **Diário/Notas** | ✅ localStorage + copy MD | ✅ localStorage + copy MD | OK |
| **Mobile UX** | ✅ Bottom nav + views | ✅ Funciona (CSS) | OK |
| **Dark mode** | ✅ localStorage + class | ✅ localStorage + class | OK |
| **SEO/Performance** | ⚠️ Next.js pronto | ✅ Estático, rápido | Next.js não aproveitado |
| **Analytics** | ❌ | ❌ | Ausente em ambos |
| **Search/Filter** | ❌ | ❌ | Ausente (PRD: pós-MVP) |

---

## 🎯 Visão do Produto (do PRD)

> **O Roadmap Vivo é o percurso real que estou seguindo pra virar AI Security Engineer — cada módulo, projeto e dificuldade documentados enquanto acontecem. Quem segue não está copiando uma lista teórica: está seguindo um caminho comprovado, com a economia de tempo de já ter tudo filtrado e organizado.**

**Métrica de sucesso (PRD §13):**
> Pessoas que avançaram pelo menos 3 módulos e têm pelo menos uma entrada de diário registrada no período.

---

## 🗺️ Roadmap Estruturado por Fases

### Fase 0 — Fundação & Deploy (Semana 1-2) ✅ **PARCIALMENTE FEITO**
> Objetivo: Ter o **design-page (Next.js) em produção** substituindo/paralelo ao GitHub Pages, com paridade total e CI/CD.

| Task | Status | Esforço | Detalhes |
|------|--------|---------|----------|
| Configurar deploy do design-page na Vercel | ⏳ Pendente | 1h | Conectar repo `myroadmap` → Vercel, build `design-page/`, domínio custom ou `myroadmap.vercel.app` |
| GitHub Action: build Next.js + deploy Vercel (ou GitHub Pages via `output: 'export'`) | ⏳ Pendente | 2h | `next.config.ts` → `output: 'export'` + Action `deploy.yml` |
| Validar paridade 1:1 com docs/ (visual, dados, materiais) | ⏳ Pendente | 4h | Checklist: timeline, aulas, vídeo, resources, deep dive, notas, copy MD, mobile, dark mode |
| Unificar fonte de dados (topics) | ⏳ Pendente | 2h | Single source: `design-page/src/data/topics.ts` → script gera `docs/data.js` e `design-page/src/data/topics.ts` (ou shared package) |
| Configurar `materiais-index.json` generation no CI do design-page | ⏳ Pendente | 1h | Mesma Action do docs/ roda no design-page repo |
| **Definição de pronto**: design-page em produção, paridade visual/funcional, CI verde, materials index atualizado auto | | | |

---

### Fase 1 — MVP Validado (Semanas 3-6)
> Objetivo: **Produto usável end-to-end** — usuário entra, vê roadmap, abre módulo, estuda aula, vê material (se houver), faz anotações, copia markdown. Zero auth, zero backend.

#### 1.1 Core UX — Já implementado (validar em produção)
- [x] Timeline lateral com status visual (completed/in-progress/upcoming)
- [x] Módulo individual: vídeo principal, descrição, progresso (% aulas com material)
- [x] Lista de aulas com estados derivados do `materiais-index.json`
- [x] Aula selecionada: índice (tópicos) OU material renderizado (markdown + custom tags)
- [x] Recursos recomendados (cards por tipo: vídeo, artigo, livro, plataforma, ferramenta, cert)
- [x] Deep dive (aprofundamento)
- [x] Painel de notas: modo guiado (3 campos) + modo livre (markdown + preview + toolbar)
- [x] Copy markdown (notas + material) → clipboard
- [x] Mobile: bottom nav (timeline/conteúdo/notas), views mutuamente exclusivas
- [x] Dark mode persistido

#### 1.2 Gaps de usabilidade a corrigir (baixo esforço, alto impacto)
| Item | Esforço | Por que importa |
|------|---------|-----------------|
| **Scroll restoration** ao trocar módulo/aula | 1h | Usuário perde posição ao navegar |
| **Keyboard shortcuts** (←/→ navega aulas, N abre/fecha notas) | 2h | Power users, acessibilidade |
| **Focus management** ao abrir painel de notas (mobile) | 30min | Acessibilidade |
| **Loading skeleton** já existe — validar se aparece no tempo certo | 30min | Perceived performance |
| **Error boundary** para falha no `materiais-index.json` | 1h | Resiliência |
| **Share URL** (`?topic=1&lesson=3`) — deep link direto | 1h | Compartilhar aula específica |
| **Copy material markdown** (botão na aula com material) | 1h | Hoje só copia notas |

#### 1.3 Conteúdo — Módulo 1 (Linux) "Done" de verdade
> Critério: **Todas as 8 aulas com material publicado** no `/materiais/1/`, index gerado, visível no site.

| Aula | Título | Status material | Ação |
|------|--------|-----------------|------|
| 1 | O que é Linux — Distros, kernel e shell | ✅ Existe (`01-o-que-e-linux.md`) | Validar render |
| 2 | Instalação e primeiros passos no terminal | ❌ | Criar `.md` no Obsidian → push |
| 3 | Sistema de arquivos — hierarquia e mounts | ❌ | Criar |
| 4 | Comandos básicos — ls, cp, mv, find, grep | ❌ | Criar |
| 5 | Permissões, usuários e grupos | ❌ | Criar |
| 6 | Processos, serviços e systemd | ❌ | Criar |
| 7 | Shell scripting — variáveis, loops e automação | ❌ | Criar |
| 8 | Redes no Linux — ip, ss, curl, netcat | ❌ | Criar |

**Meta Fase 1:** Módulo 1 100% com material + design-page em produção + 3+ usuários testando (feedback qualitativo).

---

### Fase 2 — Engajamento & Prova Social (Semanas 7-12)
> Objetivo: **Transformar visitantes em seguidores** — diário público, progresso visível, CTA comunidade.

#### 2.1 Diário Público (Public Log) — *O diferencial do PRD*
| Task | Esforço | Detalhes |
|------|---------|----------|
| Página `/diario` (ou `/log`) — lista cronológica de entradas | 4h | Cada entrada = material de uma aula + campos `learned`, `difficulty`, `nextStep` + data |
| Entrada individual `/diario/:modulo/:aula` | 3h | Render markdown completo, link volta pro módulo |
| Feed RSS do diário | 2h | Para leitores assinarem |
| JSON feed (`/diario.json`) | 1h | Para futuras integrações |
| **Design**: estilo "devlog" — data, módulo/aula, tags, tempo gasto, link pro material | | |

> **Regra de negócio (PRD §9):** Diário não é feature separada — **o material da aula JÁ É o diário**. Quando Lio escreve o material no Obsidian, já preenche os 3 campos. O site só expõe.

#### 2.2 Progresso Visual & Confiança
| Task | Esforço | Detalhes |
|------|---------|----------|
| Badge "Estou no Módulo X — Aula Y" no header (mobile/desktop) | 2h | Mostra onde Lio está AGORA |
| Timeline visual no home: módulos concluídos (verde), atual (roxo pulsante), futuros (cinza) | 3h | Já existe no LearningPlan — promover para home/public |
| Contador público: "X pessoas acompanhando" (privacy-first, sem tracking pessoal) | 4h | LocalStorage anon ID + beacon `/ping` → contador agregado |
| Depoimentos/citações de quem segue (manual, curado) | 1h | Social proof |

#### 2.3 CTA Comunidade (Discord)
| Task | Esforço |
|------|---------|
| Botão fixo "Entrar no Discord" no header/footer | 30min |
| Modal de boas-vindas na 1ª visita (dismissable) | 1h |
| Link no rodapé de cada módulo/aula | 15min |

---

### Fase 3 — Qualidade de Conteúdo & Automação (Semanas 13-20)
> Objetivo: **Reduzir atrito de produção** do Lio + **qualidade consistente** do material.

#### 3.1 Pipeline Obsidian → Site (Já desenhado no PRD §11, automatizar)
```
Caderno (papel) → Obsidian (.md + frontmatter) → IA organiza (formatação, tags, frontmatter) → 
push GitHub (/materiais/) → GitHub Action lê frontmatter → gera materiais-index.json → site consome
```

| Task | Esforço | Status |
|------|---------|--------|
| Script/Action: parse frontmatter `modulo`, `aula`, `titulo` → validação | 4h | ⏳ |
| Action: render markdown → HTML sanitizado (opcional, hoje faz client-side) | 3h | ⏳ |
| Action: validação — aula referenciada existe em `topics.ts`? | 2h | ⏳ |
| Action: falha visível no PR (check) se frontmatter inválido | 1h | ⏳ |
| Template Obsidian (`.md` com frontmatter + estrutura padrão) | 1h | ⏳ |
| Prompt IA padronizado (Lio cola notas brutas → IA devolve .md pronto) | 2h | ⏳ |

#### 3.2 Qualidade de Material
| Task | Esforço |
|------|---------|
| Checklist de "material pronto": frontmatter OK, tópicos da aula cobertos, código testado, links válidos | 1h (doc) |
| Validação automática de links quebrados no CI (lychee ou similar) | 2h |
| Screenshots/diagramas: pasta `/assets/` por módulo, referenciados no markdown | 1h |
| Padrão de "Entregável" por aula (script, config, relatório, código) — documentado no template | 1h |

#### 3.3 Módulos 2-3 com material (paralelo à automação)
| Módulo | Aulas | Meta |
|--------|-------|------|
| 2. Networking | 6 | 3 aulas com material até fim Fase 3 |
| 3. Python p/ Segurança | 10 | 4 aulas com material até fim Fase 3 |

---

### Fase 4 — Recursos Avançados de Estudo (Semanas 21-28)
> Objetivo: **Aumentar retenção e conclusão** — features que ajudam a *estudar melhor*, não só *ver conteúdo*.

| Feature | Esforço | Prioridade | Racional (PRD) |
|---------|---------|------------|----------------|
| **Modo Foco / Pomodoro** integrado na aula | 8h | Alta | Reduz ansiedade, foco no "agora" |
| **Checklist de entregável** por aula (marcar itens) | 6h | Alta | Progresso granular, dopamine |
| **Spaced Repetition** — revisão agendada de aulas concluídas | 12h | Média | Retenção de longo prazo |
| **Exportar roadmap pessoal** (PDF/Markdown/Notion) | 6h | Média | Portabilidade, ownership |
| **Busca global** (módulos, aulas, tópicos, materiais) | 8h | Média | PRD: pós-MVP, mas alto valor |
| **Filtros** (status, tem material, tem vídeo, grátis/pago) | 4h | Baixa | Descoberta |
| **Modo offline** (Service Worker + IndexedDB) | 16h | Baixa | Resiliência, mobile |

> **Nota:** Fase 4 só inicia se métrica Fase 1/2 validada (≥ pessoas avançando 3+ módulos).

---

### Fase 5 — Camada Paga (Trimestral) — *Gatilho: validação Fase 1-2*
> Conforme PRD §11: **Pagamento por temporada/trimestre** (não assinatura recorrente inicial).

| Componente | Descrição | Esforço (setup) |
|------------|-----------|-----------------|
| **Vídeos didáticos por módulo** (editados, ilustrados) | 1 vídeo ~15-20min por módulo, estilo "aula direta" (não vlog) | 40h/módulo |
| **Feedback direto do Lio** nos projetos entregues | Vagas limitadas (5-10/trimestre), async (Loom/escrito) | 10h/trimestre |
| **Checkpoint validado** — "Está pronto pra próxima fase?" | Call 30min ou revisão escrita | 5h/trimestre |
| **Acesso antecipado ao Spine Project** do trimestre | Projeto integrador do período | Incluso acima |
| **Comunidade fechada** (Discord privado, menor, sinal/ruído alto) | Canal separado, moderação leve | 2h setup |

**Stack sugerida:** Lemon Squeezy / Stripe + GitHub Teams (private repo/discord role) ou Patreon + Discord bot.

**Gatilhos de lançamento (PRD §11.5):**
1. Audiência mínima engajada no roadmap grátis (retorno semanal, progresso marcado, comentários)
2. Pelo menos 1 sinal direto de demanda ("eu pagaria por isso") — não induzido
3. Pelo menos 1 trimestre de Spine Project documentado como prova de conceito

---

### Fase 6 — Plataforma (Fase 3+ do PRD) — *Apenas com demanda explícita de terceiros*
> Reposicionamento: de "Roadmap do Lio" → "Ferramenta que o Lio criou para publicar roadmaps".

| Item | Gatilho |
|------|---------|
| Multi-roadmap (outros curadores) | Pedido real de 3+ curadores |
| Dashboard do curador (criar/editar módulos, ver progresso seguidores) | Demanda comprovada |
| Sync bidirecional GitHub ↔ App | Necessidade real |
| Marketplace de roadmaps | Escala |

**Decisão:** Não construir nada disso antes do gatilho. YAGNI.

---

## 📋 Checklist de Definição de Pronto por Fase

### Fase 0 — Deploy & Paridade
- [ ] design-page deployado (Vercel/GH Pages)
- [ ] CI/CD: push main → build → deploy + materials index update
- [ ] Paridade visual/funcional com docs/ validada (checklist 20 itens)
- [ ] Fonte única de dados (topics) — script de sync ou shared package
- [ ] Analytics básico (Plausible/Umami) — privacy-first

### Fase 1 — MVP Validado
- [ ] Módulo 1 (Linux) 100% com material publicado
- [ ] Gaps usabilidade corrigidos (scroll, shortcuts, deep link, copy material)
- [ ] 3+ usuários testaram e deram feedback qualitativo positivo
- [ ] Zero bugs críticos em produção

### Fase 2 — Engajamento
- [ ] Diário público (`/diario`) no ar com RSS
- [ ] Badge "Estou no Módulo X" visível
- [ ] Contador agregado de seguidores
- [ ] CTA Discord proeminente
- [ ] ≥ 50 pessoas acompanhando (métrica proxy: localStorage anon ID único semanal)

### Fase 3 — Automação & Qualidade
- [ ] Pipeline Obsidian → Site 100% automatizado (push → index atualizado)
- [ ] Validação CI: frontmatter, links, topics sync
- [ ] Template Obsidian + prompt IA documentados
- [ ] Módulos 2-3 com ≥ 50% aulas com material

### Fase 4 — Recursos Avançados (condicional)
- [ ] Pomodoro + Checklist entregáveis em produção
- [ ] Busca global funcional
- [ ] Export pessoal (PDF/MD)

### Fase 5 — Camada Paga (condicional)
- [ ] Gatilhos 1-3 atingidos
- [ ] Primeiro trimestre pago lançado (5-10 vagas)
- [ ] Feedback de pagadores ≥ 4.5/5

---

## 🛠️ Tech Debt & Melhorias Técnicas (Contínuo)

| Área | Item | Esforço | Prioridade |
|------|------|---------|------------|
| **Arquitetura** | Unificar `topics.ts` (design-page) ↔ `data.js` (docs) → single source (pacote `roadmap-data` ou script `sync-data.js`) | 4h | Alta |
| **Performance** | Next.js: `output: 'export'` + ISR para páginas estáticas; remover JS desnecessário do client | 4h | Média |
| **Performance** | Lazy load YouTube iframe (só carrega ao clicar/ver) | 2h | Alta |
| **Acessibilidade** | Auditoria WCAG 2.1 AA (focus, aria, contrast, landmarks) | 8h | Média |
| **Testes** | Vitest + React Testing Library: hooks (useApp), utils (markdown, progress), components críticos | 16h | Média |
| **Types** | Strict TS: remover `any`, tipar `materialsIndex`, `localStorage` helpers | 4h | Baixa |
| **DX** | Storybook para componentes UI (Skeleton, ResourceCard, NotesPanel) | 8h | Baixa |
| **Observabilidade** | Sentry (erros) + Web Vitals (performance) | 2h | Média |

---

## 📅 Cronograma Visual (Sugestão)

```
Semana:    1-2    3-4    5-6    7-8    9-10   11-12  13-14  15-16  17-18  19-20  21-24  25-28
────────────────────────────────────────────────────────────────────────────────────────────
Fase 0     ████   ░░░░
Fase 1           ████   ████   ░░░░
Fase 2                     ████   ████   ████   ████
Fase 3                                     ████   ████   ████   ████
Fase 4                                                       ████   ████   ████   ████
Fase 5                                                                   ░░░░ (gatilho)
Fase 6                                                                           ░░░░ (gatilho)
```

---

## 🎯 Próximos Passos Imediatos (Esta Semana)

1. **Deploy design-page na Vercel** (30 min)
   - `cd design-page && pnpm build && vercel --prod`
   - Configurar `next.config.ts`: `output: 'export'` se for GitHub Pages, ou deixar padrão para Vercel

2. **GitHub Action para materials-index.json no design-page** (1h)
   - Copiar `.github/workflows/generate-index.yml` do root → adaptar para `design-page/`

3. **Script de sync de dados** (2h)
   - `scripts/sync-topics.ts` lê `design-page/src/data/topics.ts` → gera `docs/data.js` + `design-page/src/data/topics.ts` (ou pacote compartilhado)

4. **Validar Módulo 1 no design-page produção** (2h)
   - Checklist: vídeo carrega, aulas listam, material aula 1 renderiza, notas funcionam, copy MD funciona, mobile OK, dark mode OK

5. **Compartilhar link com 3 pessoas de confiança** para feedback qualitativo

---

## 📌 Princípios de Decisão (North Star)

> **Isso reduz a ansiedade de quem está aprendendo, ou aumenta? Se aumenta, não faz.** (PRD §2)

| Dúvida | Decisão |
|--------|---------|
| Adicionar gamificação (streaks, badges, XP)? | **Não** — aumenta ansiedade, não é prova real |
| Login obrigatório? | **Não** — zero fricção, localStorage basta |
| Comparação social (ranking, % conclusão outros)? | **Não** — isolamento é feature, não bug |
| Notificações push/email? | **Não** — o roadmap é pull, não push |
| IA Tutor no MVP? | **Não** — custo alto, valor incerto; deixar pra Fase 5+ |
| Múltiplos roadmaps (React, Data Science)? | **Não** — foco total no AI Security até validar modelo |

---

## 📊 Métricas de Acompanhamento

| Métrica | Frequência | Ferramenta | Alvo Fase 1 | Alvo Fase 2 |
|---------|------------|------------|-------------|-------------|
| Visitantes únicos/semana | Semanal | Plausible/Umami | 50 | 200 |
| Sessões > 5min | Semanal | Plausible | 20% | 30% |
| Módulos avançados (≥3) | Semanal | LocalStorage anon | 5 pessoas | 20 pessoas |
| Entradas diário/public log | Semanal | GitHub (commits materiais) | 8 aulas | 30 aulas |
| CTA Discord clicks | Semanal | Plausible event | 10 | 50 |
| Feedback qualitativo (form) | Contínuo | Typeform/Google Forms | 3 | 15 |

---

*Documento vivo — atualizar a cada fase concluída. Próxima revisão: pós-Fase 0 deploy.*