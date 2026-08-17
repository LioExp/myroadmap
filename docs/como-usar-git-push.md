# Como usar a funcionalidade Git Push

A funcionalidade **Push para o GitHub** publica as tuas notas diretamente no teu repositório GitHub, como ficheiros Markdown, sem saíres do site.

## Requisitos

1. Uma conta no [GitHub](https://github.com)
2. Um repositório dedicado às notas (ex: `roadmap-notas`) — o site sugere o nome `roadmap-notas`
3. Um **token de acesso pessoal (PAT) fine-grained** com permissão `Contents: Read/Write` apenas nesse repositório

> **Segurança:** o site nunca guarda o teu token — fica apenas na memória da sessão e desaparece ao fechar a página. O token só é enviado diretamente para `api.github.com` (HTTPS), nunca para servidores do site. Só são aceites PAT fine-grained (começam por `github_pat_`); tokens clássicos (`ghp_`) são rejeitados porque dão acesso à conta toda.

## Passo a passo

### 1. Cria o repositório (uma única vez)

1. Vai a [github.com/new](https://github.com/new) (ou usa o link "Criar repo agora" que o site mostra)
2. Nome: `roadmap-notas` (pode ser outro, mas depois usa sempre o mesmo)
3. Cria o repositório (público ou privado — funciona com ambos)

### 2. Cria o token (uma única vez)

1. Vai a [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) (link "criar" no formulário do site)
2. **Repository access:** escolhe **Only select repositories** e seleciona o `roadmap-notas`
3. **Permissions:** procura **Contents** e define **Read and write**
4. **Expiration:** 90 dias (máximo 1 ano) — depois de expirar, basta criar outro e colá-lo de novo
5. Gera o token e copia-o (começa por `github_pat_`)

> Se criaste o token **antes** de o repositório existir, edita o token e adiciona o repositório em *Repository access* — o push devolverá erro de permissão até isso estar certo.

### 3. Liga a conta no site

1. No painel **Notas**, clica no botão **Ligar conta GitHub** (o botão escuro por baixo do "Copiar Markdown")
2. Preenche:
   - **Username GitHub** — o teu username (ex: `lioexp`)
   - **Nome do repo** — o nome que criaste (ex: `roadmap-notas`)
   - **PAT (fine-grained)** — o token que criaste
3. Clica **Verificar repo** — o site confirma que o repositório existe e que o token tem acesso
4. A partir daqui, o botão passa a dizer **Push para o GitHub**

### 4. Publica uma nota

1. Escreve a nota (todos os passos em [Como criar uma nota](como-criar-uma-nota.md))
2. Clica **Push para o GitHub**
3. Sucesso: aparece "Nota enviada para o GitHub" com um link **Ver no GitHub** para o ficheiro
4. Se voltares a publicar a mesma nota (mesmo dia ou outro), o ficheiro é **atualizado** — nunca são criados ficheiros duplicados

## Onde ficam as notas

Cada módulo corresponde a um ficheiro em `notas/<modulo>.md` no teu repositório:

```
roadmap-notas/
└── notas/
    ├── linux-fundamentos.md
    ├── redes-e-servicos.md
    └── ...
```

## Mensagens de erro comuns

| Mensagem | Causa e solução |
| --- | --- |
| "O token lê mas não escreve..." | O token está com *Repository access* errado (ex: *Public repositories (read-only)*). Edita o token e seleciona o teu repositório com *Contents: Read and write*. |
| "Token inválido ou expirado." | Token errado, expirado ou com caracteres a mais/menos ao colar. Cria um novo. |
| "Repo não encontrado..." | Nome do repositório errado ou token sem acesso a ele. Confere o nome e o *Repository access* do token. |
| "Só aceitamos PAT fine-grained..." | Colaste um token clássico (`ghp_`). Cria um fine-grained (`github_pat_`). |
| "Ainda não existe." | O repositório não existe. Usa o link "Criar repo agora" e verifica de novo. |

## FAQ

**O site consegue verificar se já tenho o repositório?**
Sim. Sem token, verifica repositórios públicos (via API pública do GitHub). Com o token, confirma também que tens acesso de escrita.

**O meu token é seguro?**
O token fica só na memória da sessão do browser (sem localStorage, sem servidor). É revogável a qualquer momento em *Settings → Developer settings → Personal access tokens*. Com scope de um único repositório, mesmo um token roubado não daria acesso à tua conta.

**Posso usar outro repositório que já tenha?**
Sim — basta indicar o nome de um repositório teu onde queiras guardar as notas.

**E se quiser apagar a configuração?**
Clica em "Trocar de conta / repo" no formulário. O token desaparece da memória imediatamente.