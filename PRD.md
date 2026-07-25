# PRD — Roadmap Vivo

**Versão:** 2.0 (reposicionado)
**Data:** Julho 2026

---

## 1. Pitch

> O roadmap que eu sigo de verdade pra virar AI Security Engineer — já testado, já filtrado, documentado em tempo real. Você segue o mesmo caminho sem perder uma hora sequer procurando o que estudar.

Este não é um produto de curadoria teórica. É o caminho real de uma pessoa (Lio), aberto pra quem quiser seguir junto. A autenticidade e a prova pública são a vantagem competitiva — não podem ser copiadas.

---

## 2. Problema

### Problema principal

Existem roadmaps de aprendizagem por toda a internet, mas quase nenhum é seguido por quem o criou. São listas teóricas, feitas por curadoria de conteúdo alheio — não por experiência real. Resultado: a pessoa some no meio do caminho, porque não tem prova de que aquele caminho leva a algum lugar, nem alguém pra mostrar que é possível.

### A raiz do problema é emocional, não informacional

O aluno médio sabe que precisa aprender, sabe onde encontrar conteúdo, sabe o que estudar — mas não faz. Porque aprender sozinho ativa falhas comuns do processo de decisão humano:

| Padrão | Como se manifesta |
|---|---|
| Paralisia por excesso de escolha | "Qual curso escolher?" |
| Viés do custo afundado | "Já investi 10h nesse curso ruim, não posso largar" |
| Falta de feedback | "Estou aprendendo certo?" |
| Isolamento | "Estou fazendo isso sozinho" |
| Falta de prova de evolução | "Sei coisas, mas não consigo demonstrar como cheguei aqui" |

O Roadmap Vivo resolve isso reduzindo a escolha a zero (o caminho já está definido), mostrando prova real de progresso (o diário), e eliminando o isolamento (comunidade do canal).

Princípio orientador de qualquer decisão de produto:
> **Isso reduz a ansiedade de quem está aprendendo, ou aumenta?** Se aumenta, não faz.

---

## 3. Visão do Produto

> O Roadmap Vivo é o percurso real que estou seguindo pra virar AI Security Engineer — cada módulo, projeto e dificuldade documentados enquanto acontecem. Quem segue não está copiando uma lista teórica: está seguindo um caminho comprovado, com a economia de tempo de já ter tudo filtrado e organizado.

---

## 4. Objetivo do Produto

Ser o lugar onde alguém entra, vê exatamente o que precisa estudar hoje, e confia que aquele caminho é real — porque pode ver a prova (o diário) de que está funcionando.

---

## 5. Público-alvo e Personas

### Ativas no MVP

**Aprendiz (Lucas, 20 anos)** — quer se tornar desenvolvedor/especialista em segurança, não sabe a ordem certa de estudo, precisa de um caminho claro e de prova de que funciona.

**Comunidade** — quer aprender junto, ver que não está sozinho. Servida pelo Discord do canal LioExp, não por uma feature construída dentro do produto.

### Fase futura (não no MVP)

**Curador** — pessoas que querem criar os próprios roadmaps usando a mesma estrutura (ex: "Roadmap React", "Roadmap Data Science"). Só entra em cena se o produto validar e existir demanda explícita por isso. Construir para essa persona agora seria resolver um problema de escala antes de provar que o modelo de uma pessoa só já gera valor.

---

## 6. Escopo — o que fica de fora do MVP (e por quê)

Cada um desses resolve um problema de **escala** (muitos usuários, múltiplos donos de roadmap, comparação social). O produto ainda está na fase de provar que uma pessoa seguindo um caminho real já gera valor suficiente. Construir para escala antes disso é esforço gasto em algo que pode nem ser necessário.

| Feature cortada | Por que fica de fora agora | Gatilho para entrar depois |
|---|---|---|
| Login / GitHub OAuth | Só necessário quando é preciso identificar a pessoa entre sessões, ou cobrar por algo | Quando lançar a camada paga (item 12) |
| Perfil público de terceiros | Pressupõe que já existem outras pessoas com progresso pra mostrar | Quando já houver usuários engajados de fato |
| Sync bidirecional com repositório do usuário | Feature de plataforma madura, cara tecnicamente (permissões, conflitos, múltiplos formatos) | Só se a persona "Curador" for ativada |
| Gamificação / estatísticas de comunidade | Só gera valor com massa crítica de usuários pra comparar | Quando houver base de usuários relevante |
| Escassez artificial ("seu progresso será perdido!") | Gatilho manipulativo, não combina com o tom autêntico do produto | Nunca — decisão de princípio, não de fase |

---

## 7. Experiência do usuário — o que entra e por quê

### Antes do primeiro clique
Zero fricção: a pessoa entra e já vê o roadmap, sem cadastro. A promessa do pitch ("sem perder tempo procurando") não pode ser quebrada por uma barreira de entrada.

### Durante o estudo
Cada módulo mostra: objetivo, recursos, tempo estimado, projetos práticos. Dificuldade é normalizada em texto simples ("este módulo é desafiador, é normal levar mais de uma tentativa") — sem gamificação, só linguagem honesta.

### O diário — o diferencial real
Escrever ativamente sobre o que se aprendeu retém mais do que só consumir conteúdo passivamente (efeito de geração). O diário cumpre duas funções ao mesmo tempo: força quem segue o roadmap a processar o que estudou, e serve como prova pública de que o caminho é real — a peça central da autenticidade do produto.

### Comunidade
Só um link/CTA pro Discord do canal LioExp. Não é construída como feature dentro do produto no MVP.

---

## 8. Telas do MVP

1. **Home** — visão geral do roadmap, estrutura de cards por fase (já existe em lioexp.github.io/myroadmap/, aproveitar).
2. **Módulo individual** — objetivo, recursos, tempo estimado, lista de aulas daquele módulo.
3. **Aula individual** *(novo — granularidade real do produto)* — dois estados possíveis:
   - **Sem material:** mostra só o índice/esqueleto do que precisa ser estudado (tópicos, sem conteúdo desenvolvido)
   - **Com material:** o índice vira o conteúdo real, estudado e organizado pelo Lio
4. **CTA Discord** — ponto de entrada simples pra comunidade do canal.

Progresso e diário deixam de ser telas/features separadas — ver seção 9 (Material de estudo = progresso, fonte única de verdade).

---

## 9. Decisões técnicas

### Fluxo de estudo real (caderno → Obsidian → IA → GitHub → site)

O fluxo de produção do conteúdo:

```
Caderno (papel) → Obsidian (.md) → IA organiza (frontmatter + formatação) →
push no GitHub (/materiais/) → GitHub Action lê frontmatter e gera índice JSON →
site busca o índice → exibe na aula certa
```

Cada arquivo processado leva um frontmatter identificando exatamente onde encaixar:

```markdown
---
modulo: linux
aula: 3
---
```

A GitHub Action roda a cada push, varre `/materiais/`, e gera um único `materiais-index.json` (módulo, aula, título, conteúdo/link). **O site busca só esse arquivo, nunca a API do GitHub diretamente** — evita o limite de 60 requisições/hora sem autenticação (problema real, já sentido durante auditoria do repositório).

### Progresso = material (fonte única de verdade)

Não existe mais "marcar como concluído" manual nem `localStorage` de progresso. Uma aula está **concluída quando, e somente quando, existe material dela no índice**. Isso substitui a ideia antiga de progresso local (que nunca funcionou de verdade — bug identificado na auditoria original) por algo que reflete estudo real, não um clique que pode ser esquecido.

Estados visuais por aula, derivados direto do índice:
- **Sem material (índice só):** cor neutra, ícone de rascunho/esqueleto, label "a estudar"
- **Com material:** cor de "concluído" (verde, já usado no site), ícone de documento/check, label "material disponível"

### Diário — reconsiderado

O antigo "diário público separado" (seção de reflexão, lido via API do GitHub) fica absorvido pelo próprio material de estudo: cada aula, ao ganhar material, já carrega o que foi aprendido, dificuldade e próximo passo — não precisa de uma segunda feature paralela fazendo a mesma coisa.

### Stack simplificada

| Camada | Escolha | Motivo |
|---|---|---|
| Frontend | HTML/CSS/JS puro (já em produção em myroadmap.github.io) | Já funciona, não precisa trocar |
| Backend | Nenhum | Sem servidor pra manter |
| Índice de conteúdo | `materiais-index.json`, gerado por GitHub Action | Uma única leitura no site, sem rate limit |
| Auth | Nenhum | Sem necessidade real ainda |
| Deploy | GitHub Pages | Já em uso |
| Comunidade | Discord do canal (link externo) | Já existe, não duplicar |

---

## 10. Ordem de implementação

1. Auditar o que já existe em myroadmap.github.io (aproveitar ao máximo)
2. Estruturar o conteúdo do roadmap em JSON estático (módulos, aulas, recursos, tempo)
3. Tela de módulo individual + tela de aula individual (estado "só índice")
4. Definir convenção de frontmatter (`modulo`, `aula`) e pasta `/materiais/`
5. GitHub Action que gera `materiais-index.json` a partir do frontmatter
6. Site busca o índice e alterna aula entre "só índice" e "material disponível"
7. Estados visuais derivados do índice (progresso = material, sem localStorage manual)
8. CTA para o Discord

Os passos 1–3 já entregam um produto testável sozinho — validar a interface antes de investir na automação (Action + índice), que é a parte mais cara tecnicamente.

---

## 11. Modelo de monetização

### O que é sempre grátis
Todo o MVP: roadmap completo, telas de módulo, progresso local, diário público inteiro, CTA da comunidade. Nada disso é trancado — é o que sustenta o próprio pitch do produto e alimenta o canal LioExp.

### O que pode virar núcleo pago (fase futura, após validação)

- **Vídeos didáticos aprofundados por módulo**, com edição e ilustração — ativo escalável: produzido uma vez, serve a todos que passarem por aquele módulo. Importante: este conteúdo é diferente dos vídeos do canal LioExp (que documentam o *experimento*, formato Ruyter/PHTE); o vídeo pago ensina o *assunto em si*, de forma direta.
- **Feedback direto do Lio** nos projetos entregues em cada módulo — ativo não-escalável, por isso naturalmente limitado a poucas vagas por vez.
- **Checkpoint validado** — "está pronto pra próxima fase?" avaliado pelo Lio, não autoavaliação.
- **Acesso antecipado ao spine project do trimestre**, antes de virar conteúdo público no canal.
- **Comunidade fechada**, menor, separada do Discord geral.

### Modelo recomendado: pagamento por temporada/trimestre

Alinhado ao próprio ciclo de estudo do Lio (cada trimestre já mapeia pra um papel progressivamente mais sênior). A pessoa paga um valor único para acompanhar aquele trimestre específico: vídeos + feedback + checkpoint + acesso antecipado ao spine project daquele período. Vagas limitadas por trimestre (ex: 5–10), o que limita a carga de trabalho naturalmente.

Vantagens: encaixa no que o Lio já faz de qualquer forma, mais fácil de vender (compromisso com prazo definido), mais barato de testar.

Considerar como complemento futuro: assinatura recorrente (Modelo B) para quem já passou por uma temporada e quer continuidade — só depois de validar o modelo de temporada.

### Gatilho para lançar a camada paga

Não lançar por suposição. Lançar quando existir, ao mesmo tempo:
- Uma audiência mínima já engajada de fato com o roadmap gratuito (retorno semanal, progresso marcado, comentários)
- Pelo menos um sinal direto de demanda ("eu pagaria por isso"), vindo da própria audiência — não induzido
- Pelo menos um trimestre de spine project já documentado como prova de conceito

---

## 12. Visão futura (fase 3+, sem desenvolvimento agora)

Se o modelo validar — pessoas seguindo, pagando, voltando — o "motor" por trás do produto (estrutura de módulos + diário público + progresso local) pode virar uma ferramenta à parte, usada por outros curadores para publicar os próprios roadmaps. Isso é um reposicionamento inteiro do produto (de "o roadmap do Lio" para "a ferramenta que o Lio criou"), não uma feature incremental. Só entra em consideração com demanda explícita de terceiros.

---

## 13. Métrica de sucesso

Não é número de cadastros (nem existe cadastro no MVP). A métrica que importa:

> Pessoas que avançaram pelo menos 3 módulos e têm pelo menos uma entrada de diário registrada no período.

Isso mede se o produto está de fato sendo seguido, não apenas visitado.
