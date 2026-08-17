# Como criar um material

Este guia ensina a criar o **conteúdo de uma aula** (o *material*). A sintaxe
completa está em **`docs/sintaxe-markdown.md`** — este guia foca-se no
processo: onde ficam os ficheiros, frontmatter, estrutura e publicação.

---

## 1. O que é um material

Um material é um ficheiro **Markdown** com o conteúdo de uma aula. Quando existe:

- A aula fica **marcada como concluída** (check verde) no roadmap
- O **conteúdo é renderizado** no site com formatação própria

## 2. Onde ficam os ficheiros

```
materiais/<modulo>/<NN>-<titulo>.md
```

Exemplo real: `materiais/linux/01-o-que-e-linux.md`

| Parte | Regra | Exemplo |
| --- | --- | --- |
| `<modulo>` | = o `slug` do tópico no roadmap | `linux` |
| `<NN>` | número da aula com 2 dígitos — tem de bater com o `id` da aula em `roadmap-data.json` | `01` |
| `<titulo>` | curto, com hífens em vez de espaços | `o-que-e-linux` |

> O site faz o match por `modulo:aula` (ex: `linux:1`). Se o número do ficheiro não bater com o `id` da aula, a aula não mostra o material.

## 3. Frontmatter (obrigatório)

```markdown
---
modulo: linux
aula: 1
titulo: O que é Linux — Distribuições, kernel e shell
---

aqui começa o conteúdo...
```

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `modulo` | sim | o slug do tópico (igual ao nome da pasta) |
| `aula` | sim | o número da aula (igual ao `id` no roadmap) |
| `titulo` | sim | título da aula (usado no índice e no site) |

O frontmatter é removido do conteúdo renderizado.

---

## 4. Sintaxe — consulta o guia dedicado

Toda a sintaxe que o site entende está documentada em **`docs/sintaxe-markdown.md`**:

- Markdown normal (GFM) e renderizações automáticas (botão copiar, tabelas, divisores)
- Extensões inline: `{{icon:}}`, `**Teoria — X**`/`**Prática — X**`, `==texto==`, `[[termo]]`, domínios soltos
- Tags de bloco: `{{image:}}`, `{{video:}}`, `{{youtube:}}`, `{{alert:}}`, `{{divider:}}`, `{{widget:}}`
- Code-fences: `pergunta` (Duolingo), `terminal`, `exercicio`, `audio`, `imagem`, `animacao`
- Widgets interativos e regras gerais (blocos malformados, sanitização)

> Nada do que aparece no site está hardcoded nos componentes — tudo é definido no material, pela sintaxe.
## 5. Estrutura recomendada do ficheiro

Segue o padrão do exemplo: **blocos** numerados separados por `---`, cada um com Teoria e Prática. Exemplo completo:

````markdown
---
modulo: linux
aula: 1
titulo: O que é Linux — Distribuições, kernel e shell
---

### Bloco 1

**Teoria — O que é um Sistema Operacional**

Texto com **negrito**, `código`, listas e tabelas.

{{widget: linux-arch}}

```pergunta
pergunta: Tecnicamente, o que é o Linux?
resposta: kernel
dica: É o núcleo que fala com o hardware.
```

---

### Bloco 2

**Prática — Instalar o Git**

{{widget: distro-cmd?tool=git}}

```animacao
titulo: Arrancar uma VM
passo: Abre o VirtualBox e clica em Nova
passo: Escolhe a ISO da distro
passo: Arranca a máquina
```

---

*As perguntas de todos os blocos aparecem automaticamente no fim da aula, na secção "Responde às perguntas abaixo:".*
````

## 6. Como a aula passa a aparecer no site

O site lê `frontend/public/materiais-index.json`, regenerado automaticamente ao guardar pelo editor do site (`POST /api/save`).

**Via A — editor do site (mais fácil):** terminal de prática numa aula → `edit` + Enter → escreve/edita → guarda (cria/atualiza o ficheiro e regenera o índice).

**Via B — manual (git):**
1. Cria o ficheiro `materiais/<modulo>/<NN>-<titulo>.md` com frontmatter + conteúdo
2. Regenera o índice: `npx tsx -e 'import { writeIndex } from "./frontend/lib/materiais"; writeIndex()'` (na raiz do repo)
3. Commit e push

> O material "aparece" porque a aula passa a ter `conteudo` no índice — é isso que marca a aula como concluída e renderiza o conteúdo.

## 7. Regras e validações

| Regra | Detalhe |
| --- | --- |
| Nome do módulo | só letras minúsculas, números e hífen (`[a-z0-9-]`) |
| Número da aula | só dígitos (usa 2 dígitos no nome do ficheiro) |
| Um ficheiro por aula | o sistema encontra o ficheiro pelo prefixo `NN-` |
| Pasta do módulo | tem de existir em `materiais/` |
| Segurança | todo o HTML renderizado passa por uma allowlist (tags/atributos aprovados); `<script>`, `onclick`, `javascript:` etc. são removidos |

## 8. Erros comuns

| Sintoma | Causa |
| --- | --- |
| A aula não mostra o material | número da aula diferente do `id` no roadmap, ou índice desatualizado (regenera ao guardar pelo editor) |
| Aula fica sempre "em branco" | frontmatter em falta ou `aula`/`modulo` errados |
| Check verde nunca aparece | material não existe no `materiais-index.json` (falta `conteudo`) |
| Bloco aparece como código | fence malformado: falta `resposta`, `passo` ou `url`, ou faltou fechar ``` |
| Erro 400/404 no editor | módulo ou aula com caracteres inválidos |
