---
modulo: linux
aula: 1
titulo: O que é Linux — Distribuições, kernel e shell
---

{{widget: linux-arch}}

### Unix → Linux, GNU/Linux e a breve história

Tudo começa com o Unix, criado nos anos 1970 nos laboratórios da AT&T. Era poderoso, mas proprietário — pago e fechado. Em 1983, Richard Stallman iniciou o projeto GNU para criar um sistema operacional livre. Havia, porém, uma peça faltando — o kernel.

Em 1991, Linus Torvalds criou o kernel Linux como hobby e disponibilizou na internet. Juntaram o kernel do Linus com as ferramentas do GNU — compiladores, bibliotecas, shell — formando o GNU/Linux.

Comparando corretamente:

- **Windows** = kernel NT + tudo empacotado pela Microsoft
- **MacOS** = kernel Darwin (XNU) + tudo empacotado pela Apple
- **Linux** = kernel Linux, empacotado de formas diferentes por cada distro

A grande diferença do Linux é que ele é Open Source, extremamente estável, seguro e personalizável.

### Prática — Instalar o Git

`[COMANDO CONDICIONAL conforme distro escolhida abaixo]`

{{widget: distro-selector}}

- **Ubuntu/Debian:** `sudo apt install git`
- **Fedora:** `sudo dnf install git`
- **Arch:** `sudo pacman -S git`

---

### Teoria — Kernel vs Shell vs Distribuição

| Componente | O que é | Analogia |
|---|---|---|
| Kernel | O "motor" do sistema. Conversa diretamente com o hardware. | O gerente da fábrica |
| Shell | A "casca". Interpreta comandos do terminal (bash, zsh). | O telefone para falar com o gerente |
| Distribuição | O pacote completo. Kernel + shell + programas + gestor. | A loja que vende o carro completo |

{{widget: ksd-cards}}

### Prática — Ver os 3 conceitos na tua VM

- `uname -r` → mostra o kernel
- `echo $SHELL` → mostra o shell
- `cat /etc/os-release` → mostra a distro

---

### Teoria — Principais distribuições e por que o Kali importa

{{widget: distro-grid}}

### Prática — Instalar o Ansible

`[COMANDO CONDICIONAL conforme distro escolhida]`

- **Ubuntu/Debian:** `sudo apt install ansible`
- **Fedora:** `sudo dnf install ansible`
- **Arch:** `sudo pacman -S ansible`

---

### Teoria — Filosofia Unix: tudo é um arquivo, programas pequenos

**Tudo é um arquivo:** o teclado, a placa de vídeo, o pendrive, e até os processos rodando são representados como arquivos dentro do sistema, geralmente na pasta `/dev/`.

**Programas que fazem uma coisa bem feita:** em vez de um programa gigante, o Linux tem milhares de programinhas pequenos — `ls`, `grep`, `cat` — cada um especializado numa única tarefa. Com pipe (`|`) montas tarefas complexas a partir de peças simples.

### Prática — Instalar o Vagrant

**Ubuntu/Debian:**

```
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install vagrant
```

**Fedora:**

```
wget -O- https://rpm.releases.hashicorp.com/fedora/hashicorp.repo | sudo tee /etc/yum.repos.d/hashicorp.repo
sudo dnf -y install vagrant
```

**Arch:**

```
yay -S vagrant
```

---

### Teoria — Onde o Linux aparece de verdade

{{widget: linux-where}}

### Prática — Instalar o VirtualBox

Em [virtualbox.org](https://www.virtualbox.org/) encontra a versão compatível com o teu sistema operacional. Na secção "VirtualBox Extension Pack", baixa o "All supported platforms" para funcionalidades extra. O VirtualBox será usado para gerenciar as máquinas virtuais ao longo do roadmap.
