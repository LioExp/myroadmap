# Como criar uma nota (material) e fazê-la aparecer no site

Este guia explica como criar o **conteúdo de uma aula** — o que o site chama de *material* — para que apareça no LessonView quando abres a aula.

## 1. O que é um material

Um material é um ficheiro **Markdown** com o conteúdo de uma aula. Quando um material existe para uma aula:

- A aula fica **marcada como concluída** (check verde) na lista de aulas do módulo e no roadmap
- O **conteúdo é renderizado** no site com formatação própria (títulos, tabelas, vídeos, widgets interativos…)

## 2. Onde ficam os ficheiros

```
materiais/<modulo>/<NN>-<titulo>.md
```

Exemplo real:

```
materiais/linux/01-o-que-e-linux.md
```

| Parte | Regra | Exemplo |
| --- | --- | --- |
| `<modulo>` | = o `slug` do tópico no roadmap | `linux` |
| `<NN>` | número da aula com 2 dígitos — **tem de bater com o `id` da aula** em `roadmap-data.json` | `01` |
| `<titulo>` | curto, com hífens em vez de espaços | `o-que-e-linux` |

> O site faz o match por `modulo:aula` (ex: `linux:1`). Se o número do ficheiro não bater com o `id` da aula no roadmap, a aula não mostra o material.

## 3. Frontmatter obrigatório

O ficheiro começa com o frontmatter (entre `---`):

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

## 4. Estrutura do corpo

Segue o padrão do ficheiro exemplo: **blocos** numerados separados por `---`, cada um com secções **Teoria** e **Prática**.

```markdown
### Bloco 1

## Teoria — Título da secção

Texto com **negrito**, listas, tabelas...

{{widget: linux-arch}}

---

### Bloco 2

**Teoria — Outro tema**

{{widget: distro-cmd?tool=git}}

---
```

## 5. A "DSL" do site

Além do Markdown normal (títulos, listas, tabelas, código, blockquote), o site suporta tags próprias:

### Ícones inline
```markdown
Ubuntu{{icon: ubuntu}}, Arch{{icon: arch}}, Fedora{{icon: fedora}}, Debian{{icon: debian}}, KDE{{icon: kde}}, Hyprland{{icon: hyprland}}
```

### Imagens e vídeos
```markdown
{{image: https://exemplo.org/imagem.png}}
{{video: https://www.youtube.com/watch?v=...}}   <!-- YouTube ou ficheiro .mp4 -->
```

### Widgets interativos (só aparecem no site)
```markdown
{{widget: linux-arch}}          <!-- árvore do sistema (kernel, shell, apps) -->
{{widget: distro-selector}}     <!-- escolher distro -->
{{widget: distro-cmd?tool=git}} <!-- comando de instalação por distro (git, ansible, vagrant...) -->
{{widget: ksd-cards}}           <!-- cartões kernel/shell/distro -->
{{widget: distro-grid}}         <!-- grelha de distros -->
{{widget: linux-where}}         <!-- onde o Linux aparece -->
```

### Sub-aulas (glossário)
```markdown
Para saber mais, vê [[drivers]].
```
`[[termo]]` cria um link que abre a sub-aula com esse termo (definido no roadmap).

## 6. Como a aula passa a aparecer no site

O site lê `frontend/public/materiais-index.json`. Esse índice é **regenerado automaticamente** sempre que guardas uma aula pelo editor do site (`POST /api/save`). Há duas vias para criar um material:

### Via A — editor do site (mais fácil)

1. Abre o terminal de prática numa aula (`Terminal` → escreve `edit` e Enter)
2. Escreve/edita o conteúdo no editor
3. Guarda — o site cria/atualiza o ficheiro `materiais/...` e regenera o índice automaticamente

### Via B — manual (git)

1. Cria o ficheiro `materiais/<modulo>/<NN>-<titulo>.md` com frontmatter + conteúdo
2. Regenera o índice `frontend/public/materiais-index.json` (ou edita-o à mão adicionando a entrada `{ modulo, aula, titulo, conteudo }`)
3. Commit e push — o site passa a mostrar o material

> O material "aparece" porque a aula passa a ter `conteudo` no índice — é isso que marca a aula como concluída e renderiza o conteúdo.

## 7. Regras e validações

| Regra | Detalhe |
| --- | --- |
| Nome do módulo | só letras minúsculas, números e hífen (`[a-z0-9-]`) |
| Número da aula | só dígitos (usa 2 dígitos no nome do ficheiro) |
| Um ficheiro por aula | o sistema encontra o ficheiro pelo prefixo `NN-` |
| Pasta do módulo | tem de existir em `materiais/` |

## 8. Erros comuns

| Sintoma | Causa |
| --- | --- |
| A aula não mostra o material | Número da aula diferente do `id` no roadmap, ou índice desatualizado (regenera ao guardar pelo editor) |
| Aula fica sempre "em branco" | Frontmatter em falta ou `aula`/`modulo` errados |
| Check verde nunca aparece | O material não existe no `materiais-index.json` (falta `conteudo`) |
| Erro 400/404 no editor | Módulo ou aula com caracteres inválidos (regras acima) |
