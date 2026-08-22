# Sintaxe do site — referência completa

Este documento descreve **toda a sintaxe** que o site interpreta nos materiais
(`materiais/<modulo>/<NN>-<titulo>.md`). Se uma funcionalidade não está aqui,
não existe — e nada do que aparece no site vem de fora do material (não há
conteúdo hardcoded nos componentes).

## 1. Estrutura do ficheiro

O `modulo` é sempre o **número** do módulo no roadmap (`1`, `2`, `3`, …), nunca
o nome — o nome vem do roadmap. O mesmo para a pasta: `materiais/1/…`.

```markdown
---
modulo: 1
aula: 1
titulo: O que é Linux — Distribuições, kernel e shell
---

Conteúdo da aula...
```

O frontmatter (`modulo`, `aula`, `titulo`) é obrigatório e é removido do
conteúdo renderizado.

## 2. Markdown normal (GFM)

Tudo o que o GitHub Markdown suporta: `#`/`##`…, **negrito**, _itálico_,
`código`, listas, citações, tabelas e code blocks com linguagem.

Renderização especial automática:

- `código inline` ganha um botão 📋 de copiar
- tabelas ganham scroll horizontal no mobile
- `---` em linha própria vira um divisor estilizado

## 3. Extensões inline (dentro do texto)

| Sintaxe | O que faz |
| --- | --- |
| `{{icon: nome}}` | ícone inline — precisa de `frontend/public/icons/<nome>.svg` (ex: `{{icon: ubuntu}}`) |
| `**Teoria — X**` em linha inteira | vira `## X` |
| `**Prática — X**` em linha inteira | vira `## Prática — X` |
| `==texto==` | realce amarelo (`<mark>`) |
| `[[termo]]` | link para a sub-aula do termo (`#sub-termo`) |
| `exemplo.org` (domínio solto) | vira link `https://exemplo.org` que abre noutro separador |

## 4. Tags de bloco `{{...}}`

| Sintaxe | O que faz |
| --- | --- |
| `{{image: URL}}` | imagem centralizada com sombra |
| `{{video: URL}}` | URL do YouTube → player incorporado; outro URL (`.mp4`, `.webm`) → `<video>` nativo |
| `{{youtube: ID_ou_URL}}` | iframe do YouTube garantido |
| `{{alert: texto}}` | caixa de alerta amarela |
| `{{divider}}` | divisor horizontal |
| `{{widget: nome}}` | widget interativo (ver §7) |

**Lado a lado:** uma `{{image:}}` seguida imediatamente de um `{{widget:}}`
é renderizada em duas colunas.

## 5. Code-fences especiais

Blocos em cercos de código (```) com linguagem especial e conteúdo
`chave: valor` — uma chave por linha.

### `pergunta` — pergunta interativa (dinâmica Duolingo)

A resposta é dividida em **palavras**, baralhadas num banco de tiles; o aluno
toca nas palavras para montar a resposta (tocar num tile preenchido devolve-o
ao banco; há botão *Limpar*). A comparação ignora maiúsculas e espaços.

````markdown
```pergunta
pergunta: Tecnicamente, o que é o Linux?
resposta: kernel
dica: É o núcleo que fala com o hardware.
limite: 32
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `pergunta` | sim | o enunciado |
| `resposta` | sim | a resposta esperada (dividida em palavras-tile) |
| `dica` | não | texto do botão 💡 |
| `limite` | não | (ignorado — mantido por compatibilidade) |

> **Todas as `pergunta`, `terminal` e `exercicio` aparecem sempre na última
> secção da aula** (a secção de Prática, com contador `X/N concluídos`) — mesmo
> que o bloco seja escrito a meio da aula.

### `terminal` — pergunta estilo terminal

O aluno digita o comando numa caixa escura com prompt `$` (Enter ou ✓
verifica). A comparação ignora maiúsculas e espaços.

````markdown
```terminal
pergunta: Qual comando mostra o kernel que está a correr?
resposta: uname -r
dica: Começa por uname e usa a flag -r.
limite: 32
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `pergunta` | sim | o enunciado |
| `resposta` | sim | o comando esperado |
| `dica` | não | texto do botão 💡 |
| `limite` | não | máximo de caracteres (padrão: 64) |

### `exercicio` — exercício de código

O aluno completa o código num editor com números de linha. A checagem compara
com o `esperado:` **sem executar nada** (ignora espaços, indentações e
maiúsculas). O `esperado:` nunca é mostrado.

````markdown
```exercicio
titulo: Imprime "tudo é um arquivo" três vezes
instrucoes:
1. Cria um loop que imprima 'tudo é um arquivo' enquanto n for menor que 3.
2. Dentro do loop, incrementa n em 1.
arquivo: script.py
dica: Usa while n < 3: e incrementa com n += 1.
inicio:
n = 0


esperado:
n = 0
while n < 3:
    print("tudo é um arquivo")
    n += 1
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | sim | enunciado principal |
| `instrucoes` | não | passos numerados — cada linha sem `chave:` a seguir a `instrucoes:` vira um passo |
| `arquivo` | não | nome do ficheiro no editor (padrão: `script.py`) |
| `dica` | não | texto do botão 💡 |
| `inicio:` | sim | código inicial já preenchido no editor |
| `esperado:` | sim | solução correta (comparada sem espaços/maiúsculas) |

> `inicio:` e `esperado:` ficam **sozinhos na linha**; tudo o que vem depois
> é considerado código bruto (espaços preservados).

### `audio` — player de áudio

````markdown
```audio
url: https://exemplo.org/narracao.mp3
titulo: Explicação em áudio
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `url` | sim | URL do ficheiro de áudio |
| `titulo` | não | título acima do player |

### `imagem` — figura com moldura

````markdown
```imagem
url: https://exemplo.org/diagrama.png
titulo: Pipeline do LLM
legenda: Fonte: material próprio
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `url` | sim | URL da imagem |
| `titulo` | não | título acima da imagem |
| `legenda` | não | legenda abaixo da imagem |

### `animacao` — passos que se revelam em sequência

Cada `passo:` é um card que aparece um a um (com atraso) quando o aluno chega
ao bloco:

````markdown
```animacao
titulo: Como uma variável é criada
passo: Escreves alvo = "192.168.1.10"
passo: O Python reserva espaço na memória
passo: O rótulo alvo passa a apontar para esse espaço
```
````

| Chave | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | não | título da animação |
| `passo` | sim | repete a chave para cada passo |

## 6. Regras gerais

- Bloco **malformado** (ex: `pergunta`/`terminal` sem `resposta`, `exercicio`
  sem `titulo`/`inicio:`/`esperado:`, `animacao` sem `passo`, `audio` sem
  `url`) é **ignorado** e aparece como código normal — revisa a formatação
- Um cerco sem fechar ``` também fica como código
- Os blocos podem misturar-se entre si e com as tags `{{...}}`, em qualquer
  ordem
- `pergunta`, `terminal` e `exercicio` vão sempre para a última secção (Prática);
  `audio`, `imagem` e `animacao` aparecem no sítio exato onde são escritos
- Nenhuma solução (`resposta`, `esperado:`) aparece no HTML renderizado
  (também no pré-visualização estática)
- Todo o HTML é sanitizado por allowlist: `<script>`, `onclick`,
  `javascript:` etc. são removidos

## 7. Widgets interativos

| nome | O que faz |
| --- | --- |
| `linux-arch` | diagrama em cascata Programas → Distro → Kernel → Hardware |
| `distro-selector` | abas Ubuntu/Fedora/Arch; guarda a escolha em `localStorage["distro"]` |
| `distro-cmd` | comando de instalação por distro; usa a escolha do seletor |
| `ksd-cards` | cards expansíveis Kernel/Shell/Distro com analogias |
| `distro-grid` | grelha de distros com badge e comando |
| `linux-where` | onde o Linux roda (servidores, containers, IoT, segurança) |

`distro-cmd` aceita um parâmetro: `{{widget: distro-cmd?tool=git}}` —
ferramentas suportadas: `git`, `ansible`, `vagrant`.

## 8. Exemplo completo de aula

````markdown
---
modulo: 1
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

```exercicio
titulo: Imprime "tudo é um arquivo" três vezes
instrucoes:
1. Cria um loop.
2. Incrementa.
inicio:
n = 0

esperado:
n = 0
while n < 3:
    print("tudo é um arquivo")
    n += 1
```

*As perguntas aparecem automaticamente no fim, na secção "Responde às
perguntas abaixo:".*
````