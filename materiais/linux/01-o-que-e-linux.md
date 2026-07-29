---
modulo: linux
aula: 1
titulo: O que é Linux — Distribuições, kernel e shell
---

### Bloco 1

## Teoria — O que é um Sistema Operacional e onde o Linux se encaixa

Um sistema operacional, normalmente abreviado para **SO**, é um programa especial que faz a **ponte** entre o **hardware** (*processador, memória, disco*) e os **programas**, tais como o navegador, jogos e scripts. Ele gerencia os recursos do computador: processos, memória, sistema de arquivos e dispositivos, como por exemplo os [[drivers]].

Linux, tecnicamente, é um **kernel** — ou seja, é o núcleo que fala diretamente com o hardware. O que normalmente chamamos de "Linux", ao nos referirmos a **Ubuntu**{{icon: ubuntu}}, **Arch**{{icon: arch}}, **Fedora**{{icon: fedora}}, **Debian**{{icon: debian}}, são na verdade distribuições, normalmente chamadas **distro**. O que acontece é que há uma junção do **kernel (núcleo) Linux** + **ferramentas GNU** + **gestor de pacotes** +, às vezes, um **ambiente gráfico** como **KDE**{{icon: kde}}, **Hyprland**{{icon: hyprland}}, etc. Por isso o termo mais técnico é GNU/Linux.


{{widget: linux-arch}}

{{image: https://upload.wikimedia.org/wikipedia/commons/7/74/Alternative_virtual_machine_host.svg}}

Comparando corretamente:

- **Windows** = kernel NT + tudo o resto, empacotado pela Microsoft
- **MacOS** = kernel Darwin (XNU) + tudo o resto, empacotado pela Apple
- **Linux** = kernel Linux, empacotado de formas diferentes por cada distro

A grande diferença do Linux é que ele é Open Source (código aberto), extremamente estável, seguro e personalizável — e foi criado em 1991 por Linus Torvalds, inspirado no Unix.

**Prática — Instalar o VirtualBox (no teu computador real)**

Em virtualbox.org você encontra a versão compatível com o seu sistema operacional (Linux, Windows ou macOS). Ainda em Downloads, na secção "VirtualBox [versão x]", procure o "Oracle VM VirtualBox Extension Pack" e baixe o "All supported platforms" — ele serve para adicionar funcionalidades extra ao VirtualBox. O VirtualBox será usado para gerenciar as máquinas virtuais.

{{widget: distro-selector}}

---

### Bloco 2

**Teoria — Unix → Linux, GNU/Linux e a breve história**

Tudo começa com o Unix, criado nos anos 1970 nos laboratórios da AT&T. Era poderoso, mas proprietário — pago e fechado. Foi justamente essa limitação que, anos depois, motivou uma resposta: em 1983, Richard Stallman iniciou o projeto GNU para criar um sistema operacional livre, inspirado no Unix, mas sem suas restrições. Havia, porém, uma peça faltando — o "coração" do sistema, o kernel.

Essa peça só apareceu quase uma década depois. Em 1991, Linus Torvalds, um estudante finlandês, criou um kernel como hobby e o disponibilizou na internet. E foi aí que as duas partes se encaixaram: juntaram o kernel do Linus com as ferramentas do GNU — compiladores, bibliotecas, shell — formando o GNU/Linux. Na prática, o projeto GNU já tinha quase tudo pronto, faltava só o kernel, e foi exatamente esse vazio que o Linux veio preencher. Por isso muitos puristas chamam de GNU/Linux, embora todo mundo fale apenas "Linux".

**Prática — Instalar o Git**

Git é controle de versão, usado aqui para obter os arquivos do curso — e é, ele próprio, uma ferramenta GNU/open source, o que conecta direto com o que acabei de estudar.

{{widget: distro-cmd?tool=git}}

---

### Bloco 3

**Teoria — Kernel vs Shell vs Distribuição**

|Componente|O que é|Analogia|
|---|---|---|
|Kernel (núcleo)|O "motor" do sistema. Conversa diretamente com o hardware (CPU, RAM, discos).|O gerente da fábrica.|
|Shell (interpretador)|A "casca". Programa que interpreta os comandos digitados no terminal (ex: bash, zsh). Pega o comando e pede para o kernel executar.|O telefone que você usa para falar com o gerente.|
|Distribuição (distro)|O "pacote completo". Kernel + shell + programas + gerenciador de pacotes, tudo empacotado e testado para funcionar junto.|A loja que vende o carro completo (motor, volante, bancos).|

Resumo: o kernel é o núcleo, o shell é a interface de texto, e a distribuição é o sistema pronto que você baixa e instala.

{{widget: ksd-cards}}

**Prática — Ver os 3 conceitos na tua própria VM**

Estes comandos são universais — funcionam igual em qualquer distro:

- `uname -r` → mostra o kernel
- `echo $SHELL` → mostra o shell
- `cat /etc/os-release` → mostra a distro

---

### Bloco 4

**Teoria — Principais distribuições e por que o Kali importa**

Entre as distros mais usadas, a família Debian/Ubuntu se destaca pelo foco em estabilidade e facilidade de uso, com o `apt` como comando de instalação (ex: `sudo apt install python`). Já no mundo corporativo, é comum encontrar RedHat/Fedora/CentOS rodando em servidores, usando `dnf` ou `yum` no lugar do `apt`.

No outro extremo está o Arch Linux — rolling release, sempre atualizado, mínimo e customizável, onde você constrói o sistema do zero em vez de receber algo pronto. O comando aqui é o `pacman` (ex: `sudo pacman -S python`).

E há ainda um caso à parte: o Kali Linux, que é baseado no Debian mas vem com centenas de ferramentas de segurança e pentest já pré-instaladas, como Nmap, Metasploit e Burp Suite. Diferente dos anteriores, não é uma distro para uso diário — é uma "caixa de ferramentas" voltada para profissionais de segurança.

{{widget: distro-grid}}

**Prática — Instalar o Ansible**

Vai ser usado depois para automação de configuração — por exemplo, provisionar VMs com distros diferentes de forma automática, em vez de configurar cada uma manualmente.

{{widget: distro-cmd?tool=ansible}}

---

#### Bloco 5

**Teoria — Filosofia Unix: tudo é um arquivo, programas pequenos**

A filosofia Unix se resume em duas ideias centrais. A primeira é que tudo é um arquivo: o teclado, a placa de vídeo, o pendrive, e até os processos rodando são representados como arquivos dentro do sistema, geralmente na pasta `/dev/`. Isso significa que, se você sabe mexer em arquivos, já sabe mexer no hardware.

A segunda ideia é a de programas que fazem uma coisa bem feita. Em vez de um programa gigante que tenta fazer tudo, o Linux tem milhares de programinhas pequenos — `ls`, `grep`, `cat` — cada um especializado numa única tarefa. E é juntando eles com pipe (`|`) que você monta tarefas complexas a partir de peças simples.

**Prática — Instalar o Vagrant**

Serve para automatizar a criação/gestão de VMs por cima do VirtualBox.

{{widget: distro-cmd?tool=vagrant}}

Depois de instalado (em qualquer distro): praticar comandos básicos, como `vagrant status`.

_Nota: se o Ubuntu for muito recente (26.04) e o `apt update` falhar com erro de repositório, o repo da HashiCorp pode ainda não ter suporte para essa versão — nesse caso, instalar via Homebrew é a alternativa recomendada._

---

### Bloco 6

**Teoria — Onde o Linux aparece de verdade**

O alcance do Linux no mundo real é enorme. Em servidores, cerca de 90% da internet roda sobre ele — Google, Facebook, AWS, todos dependem dessa base. Essa presença se estende aos containers: Docker e Kubernetes são, na prática, "fatias" do Linux — sem ele, o próprio Docker não existiria.

Fora dos data centers, o Linux também está no dia a dia através da IoT — Raspberry Pi, TVs, roteadores Wi-Fi, todos rodando Linux por baixo. E há ainda um domínio onde ele é praticamente incontornável: o das ferramentas de segurança. Quase tudo que se faz em hacking ou defesa é construído para Linux primeiro, o que faz dele o verdadeiro "lar" do profissional de segurança.

{{widget: linux-where}}

**Prática — Obter os arquivos do curso**

Fechando o ciclo — agora com VirtualBox, Git, Ansible e Vagrant instalados, o ambiente está pronto para usar tudo isso nos próximos tópicos do roadmap.
