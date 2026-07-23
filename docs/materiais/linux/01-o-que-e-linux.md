---
modulo: linux
aula: 1
titulo: "O que é Linux — Distribuições, kernel e shell"
---

## O que é um sistema operacional, e onde o Linux se encaixa

Um sistema operacional é a camada de software que gerencia o hardware e fornece uma interface para os programas executarem. O Linux é um kernel — a parte central do SO que gerencia memória, processos e dispositivos.

## Unix → Linux, GNU/Linux, breve história

- **Unix** (1970s): criado nos Bell Labs, base de tudo
- **GNU** (1983): Richard Stallman criou as ferramentas de userspace (compiladores, editores)
- **Linux** (1991): Linus Torvalds criou o kernel
- **GNU/Linux**: a combinação do kernel Linux com as ferramentas GNU = o que chamamos de "Linux"

## Kernel vs shell vs distribuição

- **Kernel**: gerencia hardware, processos, memória, rede
- **Shell**: interface de comandos (bash, zsh, fish)
- **Distribuição**: pacote completo (kernel + ferramentas + desktop + gerenciador de pacotes)

## Principais distros

| Distra | Base | Porquê importa |
|---|---|---|
| Ubuntu/Debian | Debian | Mais usada em servidores, base do Kali |
| Kali Linux | Debian | Ferramentas de segurança pré-instaladas |
| Fedora/RedHat | RedHat | Enterprise,用于 RHCSA/RHCE |
| Arch | Independente | Rolling release, personalização total |

**Kali importa** porque é a distro padrão para security testing — tem 600+ ferramentas de segurança instaladas.

## Filosofia Unix

- **Tudo é arquivo**: dispositivos, diretórios, processos — tudo aparece como ficheiro
- **Programas pequenos**: cada ferramenta faz uma coisa bem (grep, find, cat, ls)
- **Pipes**: encadear ferramentas: `cat arquivo.log | grep erro | wc -l`
- **Texto como interface universal**: programas comunicam via texto, não binários

## Onde Linux aparece de verdade

- **Servidores**: 96% dos top 1M servidores web rodam Linux
- **Containers**: Docker e Kubernetes rodam em Linux
- **IoT**: Roteadores, Smart TVs, carros, Raspberry Pi
- **Supercomputadores**: 100% dos top 500 usam Linux
- **Ferramentas de segurança**: Kali, Parrot, BlackArch
- **Android**: baseado no kernel Linux
