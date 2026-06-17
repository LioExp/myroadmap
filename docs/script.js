function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.hasAttribute('data-theme');
  if (isLight) { html.removeAttribute('data-theme'); }
  else { html.setAttribute('data-theme', 'light'); }
  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
  if (sun && moon) {
    sun.style.display = isLight ? '' : 'none';
    moon.style.display = isLight ? 'none' : '';
  }
}

// ── Dados detalhados de cada nó ──
const NODE_DATA = {
  "Linux & terminal": {
    phase: "Fase 1 · Purple Team",
    duration: "4-8 semanas",
    prereqs: [],
    duration: "4-8 semanas",
    prereqs: [],
    intro: "O Linux é o sistema operativo padrão da segurança ofensiva e defensiva. Dominar o terminal não é opcional — é pré-requisito. A maioria das ferramentas de segurança (nmap, metasploit, burp suite) corre em Linux ou foi desenhada para ele.",
    desc: "Aprender Linux é aprender a comunicar com o computador sem intermediários gráficos. Vais lidar com filesystem hierarchy, permissões (chmod/chown), processos (ps/kill/top), redirecionamento de I/O, pipes, variáveis de ambiente e o poder dos ficheiros de config (.bashrc, .vimrc).",
    learn: [
      "Navegar e manipular ficheiros pelo terminal sem medo",
      "Perceber permissões, owners, groups e sticky bits",
      "Gerir processos, daemons e systemd",
      "Usar grep, awk, sed para filtrar e transformar texto",
      "Automatizar tarefas com crontab e scripts bash",
      "Configurar redes no Linux (ip, nmcli, netstat)"
    ],
    vision: "Vais conseguir montar o teu próprio laboratório de hacking em Kali Linux ou ParrotOS, configurar servidores, analisar logs, correr ferramentas de segurança e entender o que cada comando faz — sem depender de GUI.",
    free: [
      { name: "Linux Journey", url: "https://linuxjourney.com/" },
      { name: "Explainshell", url: "https://explainshell.com/" },
      { name: "OverTheWire Bandit", url: "https://overthewire.org/wargames/bandit/" },
      { name: "Terminal de código aberto", url: "https://www.youtube.com/watch?v=ZtqBQ68ZzL4" },
    ],
    paid: [
      { name: "Linux Basics for Hackers (No Starch)", url: "https://nostarch.com/linuxbasicsforhackers" },
      { name: "Cursos Linux da Udemy (bom para PT-BR)", url: "https://www.udemy.com/topic/linux/" },
    ],
    whyRecommended: "Os recursos gratuitos (Linux Journey + OverTheWire) são suficientes para 90% do que precisas. O livro 'Linux Basics for Hackers' é recomendado porque aborda especificamente o que um pentester precisa, não Linux genérico de servidor.",
    projects: [
      "Montar um servidor web Apache/Nginx em Linux do zero",
      "Criar um script bash que monitoriza logs e envia alerta por email",
      "Configurar um laboratório de redes com VirtualBox + Kali + Metasploitable",
      "Resolver todos os níveis do OverTheWire Bandit até ao 20"
    ],
    aiPrompt: "Quero aprender Linux para segurança ofensiva. Explica-me os 10 comandos mais importantes que um pentester deve saber no terminal, com exemplos práticos de cada um. Depois, sugere-me uma rotina de 7 dias para ganhar fluência em terminal Linux.",
    keyKnowledge: [
      "Filesystem hierarchy (/, /home, /var, /etc, /tmp)",
      "Permissões: chmod, chown, chgrp, sticky bit, SUID",
      "Gestão de processos: ps, kill, top, htop, systemd",
      "Redirecionamento: pipes |, >, >>, <, 2>&1",
      "grep, awk, sed para processamento de texto",
      "SSH: chaves, config, tunneling",
      "Crontab e automação de tarefas",
      "Variáveis de ambiente e .bashrc"
    ],
  },

  "Networking basics": {
    phase: "Fase 1 · Purple Team",
    duration: "4-6 semanas",
    prereqs: [],
    duration: "4-6 semanas",
    prereqs: [],
    intro: "Redes são a fundação de tudo em segurança. Um ataque é, no fundo, uma conversa maliciosa entre dois pontos na rede. Se não percebes como essa conversa funciona, não vais conseguir defendê-la nem atacá-la.",
    desc: "Vais aprender os conceitos essenciais: endereços IP (IPv4 e IPv6), subnets e máscaras, portas (TCP/UDP), NAT, DHCP, DNS, gateways e roteamento. Tudo o que acontece quando um pacote viaja de um computador para outro na internet.",
    learn: [
      "Diferenciar TCP de UDP e saber quando cada um é usado",
      "Calcular subnets de cabeça com notação CIDR",
      "Perceber o papel do DNS na resolução de nomes",
      "Entender como o NAT permite vários dispositivos partilharem um IP",
      "Identificar portas comuns (22, 80, 443, 445, 3389, etc.)",
      "Usar traceroute para mapear o caminho dos pacotes"
    ],
    vision: "Vais olhar para um pacote capturado no Wireshark e entender cada campo: IP de origem/destino, porta, flag TCP, payload. Vais saber diagnosticar problemas de rede de forma estruturada.",
    free: [
      { name: "Computer Networking (Kurose) — curso gratuito", url: "https://www.youtube.com/playlist?list=PLByK_3hwZYXGqK67q4pM4Gq5FpYBmdCIf" },
      { name: "Subnetting Practice", url: "https://subnettingpractice.com/" },
      { name: "Professor Kurose — Networking (YT)", url: "https://www.youtube.com/user/jimkurose" },
    ],
    paid: [
      { name: "CompTIA Network+ (certificação)", url: "https://www.comptia.org/certifications/network" },
      { name: "Cisco Networking Academy — CCNA", url: "https://www.netacad.com/" },
    ],
    whyRecommended: "O curso do Kurose no YouTube cobre 80% do que precisas de graça. A certificação Network+ é a recomendação paga porque estrutura o conhecimento de forma reconhecida pela indústria. O CCNA é mais avançado e opcional.",
    projects: [
      "Desenhar a topologia de rede da tua casa com IPs, subnets e dispositivos",
      "Configurar um servidor DHCP e DNS em Linux (dnsmasq)",
      "Capturar tráfego com tcpdump e identificar os 3 principais protocolos",
      "Criar duas VMs em redes diferentes e configurar o roteamento entre elas"
    ],
    aiPrompt: "Sou iniciante em redes e quero entrar para segurança ofensiva. Explica-me como funciona uma comunicação TCP desde o clique no navegador até o site aparecer. Usa uma analogia simples e depois o modelo técnico.",
    keyKnowledge: [
      "Modelo TCP/IP vs OSI",
      "Endereçamento IPv4 e IPv6, subnets e CIDR",
      "Portas TCP/UDP e serviços comuns",
      "DNS: resolução, registos A, CNAME, MX",
      "NAT, DHCP, gateways e routing",
      "traceroute, ping, ip a, netstat, ss",
      "HTTP/HTTPS: métodos, headers, status codes"
    ],
  },

  "OSI model": {
    phase: "Fase 1 · Purple Team",
    duration: "1-2 semanas",
    prereqs: ["Networking basics"],
    duration: "1-2 semanas",
    prereqs: ["Networking basics"],
    intro: "O modelo OSI é o mapa conceptual que descreve como os dados viajam entre dispositivos. Cada camada tem uma responsabilidade específica. Saber em que camada cada ataque e cada defesa opera é o que separa um profissional de um entusiasta.",
    desc: "Vais estudar as 7 camadas: Física, Ligação de Dados, Rede, Transporte, Sessão, Apresentação e Aplicação. Cada camada adiciona um header ao pacote (encapsulamento). Cada ataque explora vulnerabilidades numa camada específica.",
    learn: [
      "Memorizar as 7 camadas e os seus protocolos principais",
      "Entender o encapsulamento: como os dados ganham headers em cada camada",
      "Relacionar ferramentas de segurança a cada camada (nmap = camada 3/4, burp = camada 7)",
      "Perceber a diferença entre o modelo OSI e o modelo TCP/IP (mais usado na prática)",
      "Identificar em que camada ocorrem ataques: MAC spoofing (camada 2), IP spoofing (camada 3), DDoS (camada 3/4/7)"
    ],
    vision: "Quando ouvires falar de um ataque vais imediatamente saber em que camada ele ocorre e que ferramentas podes usar para o detetar ou mitigar. Vais pensar em rede de forma estruturada.",
    free: [
      { name: "OSI Model Explained (Cloudflare)", url: "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" },
      { name: "Professor Messer — Network+ (OSI gratuito)", url: "https://www.professormesser.com/network-plus/n10-008/understanding-the-osi-model/" },
    ],
    paid: [
      { name: "CompTIA Network+ (examina o modelo OSI)", url: "https://www.comptia.org/certifications/network" },
      { name: "Udemy — Networking Concepts (PT-BR)", url: "https://www.udemy.com/course/fundamentos-de-redes-de-computadores/" },
    ],
    whyRecommended: "Os recursos gratuitos do Cloudflare e Professor Messer são claros e directos. O curso da Udemy em PT-BR é ótimo se preferires aprender em português. A Network+ dá uma base certificada.",
    projects: [
      "Desenhar um diagrama mostrando como um email viaja pelas 7 camadas",
      "Explicar o modelo OSI a um colega sem usar jargão técnico — se conseguires, dominas",
      "Usar o Wireshark para identificar headers de cada camada num pacote HTTP"
    ],
    aiPrompt: "Explica o modelo OSI como se eu tivesse 12 anos. Depois, para cada camada, dá um exemplo de ataque de segurança que explora essa camada e uma ferramenta que podemos usar para o prevenir ou detetar.",
    keyKnowledge: [
      "7 camadas e responsabilidades de cada uma",
      "Encapsulamento e desencapsulamento de dados",
      "Protocolos por camada: Ethernet, IP, TCP, HTTP",
      "Diferenças entre OSI e TCP/IP (na prática)",
      "Ataques por camada: ARP spoofing (L2), SYN flood (L4), XSS (L7)",
      "PDU por camada: frame, packet, segment, datagram"
    ],
  },

  "Protocolos & portas": {
    phase: "Fase 1 · Purple Team",
    duration: "2-3 semanas",
    prereqs: ["Networking basics"],
    duration: "2-3 semanas",
    prereqs: ["Networking basics"],
    intro: "Cada serviço na rede escuta numa porta. Saber quais portas correspondem a que serviços é como conhecer o mapa da cidade: sabes onde estão os bancos, as lojas e as casas. Um atacante usa esse mapa para encontrar entradas.",
    desc: "Vais aprender os protocolos mais comuns: HTTP/HTTPS (80/443), SSH (22), FTP (21), DNS (53), SMTP (25), SMB (445), RDP (3389), MySQL (3306). E porque é que saber disto é essencial para enumeração e exploração.",
    learn: [
      "Memorizar as 20 portas mais comuns e os seus serviços",
      "Entender a diferença entre portas bem conhecidas (0-1023), registadas (1024-49151) e dinâmicas",
      "Usar nmap para descobrir portas abertas num alvo",
      "Identificar serviços pelo banner (banner grabbing com netcat)",
      "Perceber porque portas abertas são superfícies de ataque"
    ],
    vision: "Vais fazer um scan a qualquer IP e saber instantaneamente que serviços estão a correr, que vulnerabilidades são prováveis e qual o próximo passo. Vais pensar como um atacante ao ver uma porta 445 aberta.",
    free: [
      { name: "Port Reference (IANA)", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" },
      { name: "Nmap — porta a porta", url: "https://nmap.org/book/port-scanning.html" },
      { name: "Lista de portas comuns (Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers" },
    ],
    paid: [
      { name: "Nmap Network Scanning (livro oficial)", url: "https://nmap.org/book/" },
    ],
    whyRecommended: "A documentação gratuita do nmap é a melhor fonte. O livro oficial do Nmap é recomendado porque vai muito além do básico e ensina a interpretar resultados de scanning como um profissional.",
    projects: [
      "Fazer scan à tua rede doméstica com nmap e identificar todos os serviços",
      "Criar uma tabela com as 30 portas mais comuns, serviço, e vulnerabilidade típica (ex: 445 → SMB → EternalBlue)",
      "Usar netcat para fazer banner grab a um servidor web na porta 80"
    ],
    aiPrompt: "Ensina-me as 20 portas de rede mais importantes que um pentester deve saber de cor. Para cada porta: número, serviço, e o que um atacante pode fazer se a encontrar aberta. Cria uma tabela.",
    keyKnowledge: [
      "20 portas mais comuns: 22, 80, 443, 445, 3389, 3306, 5432...",
      "TCP vs UDP: quando cada um é usado",
      "Port scanning com nmap: SYN, connect, UDP, FIN",
      "Banner grabbing com netcat e telnet",
      "Identificação de serviços por porta",
      "Port ranges: well-known, registered, dynamic"
    ],
  },

  "Virtualização & VMs": {
    phase: "Fase 1 · Purple Team",
    duration: "1-2 semanas",
    prereqs: ["Linux básico"],
    duration: "1-2 semanas",
    prereqs: ["Linux básico"],
    intro: "Segurança prática requer laboratório. Não podes testar ferramentas ofensivas no teu sistema principal. Virtualização permite criar ambientes isolados (VMs) para montar alvos, testar exploits e praticar sem riscos.",
    desc: "Vais aprender a usar VirtualBox, VMware e Proxmox. Criar máquinas vulneráveis (Metasploitable, DVWA, VulnHub), configurar redes internas entre VMs, tirar snapshots para restaurar estados e gerir recursos.",
    learn: [
      "Instalar e configurar VirtualBox ou VMware Workstation",
      "Criar uma VM com Kali Linux e outra com Metasploitable 2",
      "Configurar rede NAT vs Bridge vs Host-Only",
      "Usar snapshots para salvar estados antes de um exploit",
      "Montar laboratórios completos com múltiplas VMs"
    ],
    vision: "Vais ter o teu próprio laboratório de segurança em casa. Consegues montar um ataque de múltiplas VMs, restaurar o estado depois de danificar o alvo, e praticar qualquer técnica sem medo de estragar nada.",
    free: [
      { name: "VirtualBox (open source)", url: "https://www.virtualbox.org/" },
      { name: "VulnHub — máquinas vulneráveis", url: "https://www.vulnhub.com/" },
      { name: "Metasploitable 2", url: "https://docs.rapid7.com/metasploit/metasploitable-2-installation/" },
    ],
    paid: [
      { name: "VMware Workstation Pro", url: "https://www.vmware.com/products/workstation-pro.html" },
      { name: "HackTheBox VIP", url: "https://www.hackthebox.com/pricing" },
    ],
    whyRecommended: "VirtualBox gratuito cobre tudo o que precisas. HackTheBox VIP vale o investimento quando já tiveres confiança — dá acesso a máquinas ativas e laboratórios estruturados com guias.",
    projects: [
      "Montar laboratório: Kali + Metasploitable + Windows vulnerável",
      "Configurar uma rede Host-Only e fazer um scan completo da rede interna",
      "Criar um snapshot, correr um exploit que danifica o sistema, e restaurar o snapshot"
    ],
    aiPrompt: "Quero montar um laboratório de hacking ético em casa. Dá-me o passo a passo completo: que software instalar, que máquinas vulneráveis baixar, como configurar as redes entre VMs. Assume que tenho 16GB de RAM.",
    keyKnowledge: [
      "VirtualBox vs VMware vs Proxmox",
      "Criação e configuração de VMs",
      "Redes: NAT, Bridge, Host-Only, Internal",
      "Snapshots e restauro de estados",
      "Metasploitable, DVWA, VulnHub",
      "Kali Linux como VM de ataque"
    ],
  },

  "CIA triad & conceitos": {
    phase: "Fase 1 · Purple Team",
    duration: "1-2 semanas",
    prereqs: [],
    duration: "1-2 semanas",
    prereqs: [],
    intro: "A CIA Triad (Confidencialidade, Integridade, Disponibilidade) é o modelo fundamental da segurança da informação. Toda e qualquer controlo de segurança existe para proteger um destes três pilares. Sem isto, não fazes segurança — fazes apenas barulho.",
    desc: "Vais explorar cada pilar: Confidencialidade (só quem deve vê), Integridade (dados não foram alterados), Disponibilidade (sistema está acessível quando necessário). Vais também aprender conceitos derivados: autenticação, autorização, não-repúdio, e o modelo AAA.",
    learn: [
      "Explicar a CIA Triad com exemplos reais",
      "Identificar que pilares estão a ser atacados em cada tipo de ataque",
      "Perceber o modelo AAA (Autenticação, Autorização, Auditoria)",
      "Entender non-repudiation e como a criptografia garante integridade",
      "Aplicar a CIA Triad a cenários de segurança"
    ],
    vision: "Vais olhar para qualquer medida de segurança e saber imediatamente qual pilar da CIA ela protege. Vais pensar em segurança de forma estratégica, não apenas como uma lista de ferramentas.",
    free: [
      { name: "CIA Triad (Infosec)", url: "https://resources.infosecinstitute.com/cia-triad/" },
      { name: "CIA Triad Explained (Youtube)", url: "https://www.youtube.com/watch?v=QzqF-e5DhQc" },
    ],
    paid: [
      { name: "CompTIA Security+ (cobre CIA triad)", url: "https://www.comptia.org/certifications/security" },
    ],
    whyRecommended: "O conteúdo gratuito cobre o conceito. A Security+ é a recomendação paga porque estrutura toda a base de segurança de forma coerente e é reconhecida globalmente como entrada na área.",
    projects: [
      "Analisar um ataque real (ex: ransomware) e mapear quais pilares da CIA foram violados",
      "Desenhar um sistema de backup que garanta os 3 pilares",
      "Criar uma apresentação de 5 slides a explicar a CIA Triad para não-técnicos"
    ],
    aiPrompt: "Explica a CIA Triad (Confidencialidade, Integridade, Disponibilidade) usando 3 cenários reais de cibersegurança. Depois, para cada pilar, diz que tipo de ataque o viola e que controlo o protege.",
    keyKnowledge: [
      "Confidencialidade: encriptação, controlo de acesso",
      "Integridade: hashing, checksums, assinaturas digitais",
      "Disponibilidade: redundância, backups, DDoS protection",
      "Modelo AAA: Autenticação, Autorização, Auditoria",
      "Não-repúdio: logs, certificados digitais",
      "Ransomware e como viola a CIA Triad"
    ],
  },

  "Threats & attack vectors": {
    phase: "Fase 1 · Purple Team",
    duration: "2-3 semanas",
    prereqs: ["CIA triad & conceitos"],
    duration: "2-3 semanas",
    prereqs: ["CIA triad & conceitos"],
    intro: "Um threat actor pode ser um hacker solitário, um grupo organizado, um estado-nação ou até um insider. Cada um tem motivações diferentes. Compreender quem pode atacar-te e como é o primeiro passo para te defenderes.",
    desc: "Vais aprender a classificar ameaças: script kiddies, hacktivistas, criminosos organizados, APTs (Advanced Persistent Threats), insiders. Vais também mapear attack vectors comuns: phishing, engenharia social, exploits de dia zero, ataques de força bruta, DDoS, supply chain.",
    learn: [
      "Diferenciar tipos de threat actors e as suas motivações",
      "Identificar os principais attack vectors usados hoje",
      "Entender o conceito de superfície de ataque",
      "Usar o modelo STRIDE para classificar ameaças",
      "Criar um threat model básico para uma aplicação"
    ],
    vision: "Vais conseguir fazer threat modeling básico: identificar o que é importante, quem pode atacar, por onde podem entrar, e o que fazer para proteger. Vais pensar como um gestor de risco, não apenas como um operador de ferramentas.",
    free: [
      { name: "OWASP Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" },
      { name: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
    ],
    paid: [
      { name: "Threat Modeling: Designing for Security (Adam Shostack)", url: "https://www.amazon.com/Threat-Modeling-Designing-Adam-Shostack/dp/1118809998" },
    ],
    whyRecommended: "O MITRE ATT&CK é a base gratuita mais completa para entender tácticas e técnicas de ataque. O livro do Shostack é a referência definitiva em threat modeling, escrito por um dos criadores do STRIDE.",
    projects: [
      "Mapear um ataque real (ex: SolarWinds) no framework MITRE ATT&CK",
      "Criar um threat model para uma aplicação web simples (ex: blog)",
      "Listar 5 attack vectors diferentes para um servidor web e como mitigar cada um"
    ],
    aiPrompt: "Quero aprender threat modeling para iniciantes. Explica o que é um threat actor, quais os tipos principais, e como usar o modelo STRIDE para classificar ameaças. Dá exemplos práticos de cada letra do STRIDE.",
    keyKnowledge: [
      "Tipos de threat actors: script kiddie, APT, insider",
      "Attack vectors: phishing, engenharia social, exploits, DDoS",
      "Superfície de ataque e redução de superfície",
      "Framework MITRE ATT&CK: tácticas e técnicas",
      "Modelo STRIDE: Spoofing, Tampering, Repudiation, etc.",
      "Cadeia de ataque: recon, weaponize, deliver, exploit"
    ],
  },

  "Blue / Red / Purple teams": {
    phase: "Fase 1 · Purple Team",
    duration: "1-2 semanas",
    prereqs: [],
    duration: "1-2 semanas",
    prereqs: [],
    intro: "No mundo da segurança, há três equipas com missões diferentes: Red Team ataca, Blue Team defende, Purple Team integra os dois. Saber qual o teu perfil ajuda a focar os estudos e a escolher certificações e carreira.",
    desc: "Vais perceber o ciclo completo: Red Team simula ataques reais para testar defesas. Blue Team monitoriza, deteta e responde a incidentes. Purple Team garante que a comunicação entre os dois acontece e que as lições aprendidas viram melhorias.",
    learn: [
      "Diferenciar Red, Blue e Purple Team",
      "Saber as ferramentas típicas de cada equipa",
      "Entender o ciclo de um exercício Purple Team",
      "Identificar qual o teu perfil (ou se és híbrido)",
      "Conhecer certificações para cada via (OSCP para Red, CISSP para Blue)"
    ],
    vision: "Vais saber exatamente onde te encaixas no ecossistema de segurança. Podes traçar um plano de carreira claro: se gostas de atacar, vais para Red Team; se gostas de defender, vais para Blue Team; se gostas de conectar os dois, és Purple.",
    free: [
      { name: "Red Team vs Blue Team (Cloudflare)", url: "https://www.cloudflare.com/learning/security/red-team-vs-blue-team/" },
      { name: "O que é Purple Team (Infosec)", url: "https://resources.infosecinstitute.com/topic/purple-team/" },
    ],
    paid: [
      { name: "Certificação OSCP (Offensive Security)", url: "https://www.offensive-security.com/pwk-oscp/" },
      { name: "Certificação CISSP (ISC²)", url: "https://www.isc2.org/Certifications/CISSP" },
    ],
    whyRecommended: "O conteúdo gratuito dá a visão geral. OSCP é a certificação Red Team mais respeitada do mercado — se queres atacar, é o caminho. CISSP é a certificação Blue Team/gestão. Escolhe conforme o teu perfil.",
    projects: [
      "Simular um ataque (Red) e documentar as deteções (Blue) num relatório Purple",
      "Criar um playbook de resposta a incidentes para um cenário de ransomware",
      "Participar num CTF e analisar a tua performance como Red e Blue"
    ],
    aiPrompt: "Explica a diferença entre Red Team, Blue Team e Purple Team em segurança. Se eu sou um iniciante que gosta de quebrar coisas e perceber como funcionam, qual destes perfis se adequa mais? Dá-me um plano de 3 meses para começar.",
    keyKnowledge: [
      "Missão de cada equipa: atacar, defender, integrar",
      "Ferramentas típicas de Red Team (Cobalt Strike, Metasploit)",
      "Ferramentas típicas de Blue Team (SIEM, EDR, SOAR)",
      "Ciclo de um exercício Purple Team",
      "Certificações: OSCP (Red), CISSP (Blue), CREST (Purple)",
      "Perfil híbrido: purple como ponte entre equipas"
    ],
  },

  "Cryptography basics": {
    phase: "Fase 1 · Purple Team",
    duration: "3-4 semanas",
    prereqs: [],
    duration: "3-4 semanas",
    prereqs: [],
    intro: "Criptografia é a arte de esconder informação. É a base da confidencialidade e integridade na segurança digital. Desde a sessão HTTPS do teu banco até ao hash da tua password, tudo depende de algoritmos criptográficos.",
    desc: "Vais aprender: hash (MD5, SHA-256), cifras simétricas (AES), cifras assimétricas (RSA, ECC), assinaturas digitais, certificados TLS, PKI (Public Key Infrastructure). Não precisas de ser matemático, mas precisas de perceber o que cada um faz e onde se aplica.",
    learn: [
      "Diferenciar hash de encriptação (um é via única, outro é via dupla)",
      "Saber quando usar AES vs RSA vs SHA",
      "Entender como funciona o TLS/HTTPS",
      "Perceber o que é um certificado digital e como é emitido",
      "Identificar ataques básicos: hash collision, rainbow tables, MITM"
    ],
    vision: "Vais conseguir ler a documentação de qualquer ferramenta de segurança e entender que tipo de criptografia usa e porquê. Vais saber quando deves usar hash, quando deves usar encriptação, e como escolher o algoritmo certo.",
    free: [
      { name: "CryptoHack (aprende praticando)", url: "https://cryptohack.org/" },
      { name: "Crypto 101 (livro gratuito)", url: "https://www.crypto101.io/" },
    ],
    paid: [
      { name: "Coursera — Cryptography I (Dan Boneh, Stanford)", url: "https://www.coursera.org/learn/crypto" },
    ],
    whyRecommended: "CryptoHack é o melhor recurso gratuito porque aprendes a fazer ataques criptográficos reais num ambiente controlado. O curso do Dan Boneh (Stanford) é a referência académica — é puxado mas é o melhor conteúdo do mundo sobre criptografia.",
    projects: [
      "Resolver os primeiros 10 desafios do CryptoHack",
      "Criar um script que faz hash de passwords e as compara com rainbow tables",
      "Explicar como o TLS protege uma conexão HTTPS num diagrama de 3 passos"
    ],
    aiPrompt: "Explica criptografia para um pentester iniciante. Preciso saber: o que é hash, encriptação simétrica e assimétrica, e como o TLS funciona. Usa exemplos práticos que um atacante exploraria.",
    keyKnowledge: [
      "Hash: MD5, SHA-1, SHA-256, SHA-3",
      "Cifras simétricas: AES, ChaCha20",
      "Cifras assimétricas: RSA, ECC",
      "TLS/HTTPS: handshake, certificados, CA",
      "PKI: Certificate Authority, chain of trust",
      "Ataques: hash collision, rainbow tables, MITM"
    ],
  },

  "Nmap & Wireshark": {
    phase: "Fase 1 · Purple Team",
    duration: "4-6 semanas",
    prereqs: ["Networking basics", "Virtualização & VMs"],
    duration: "4-6 semanas",
    prereqs: ["Networking basics", "Virtualização & VMs"],
    intro: "Nmap é o canivete suíço de scanning de redes. Wireshark é o microscópio de pacotes. Juntos, são as duas ferramentas mais importantes para um profissional de segurança. Uma serve para descobrir, a outra para analisar.",
    desc: "Nmap: vais aprender tipos de scan (SYN, connect, UDP, FIN), deteção de versões (service versioning), NSE scripts para vulnerabilidades, output parsing. Wireshark: captura de pacotes, filtros de display e captura, following streams, estatísticas, deteção de anomalias.",
    learn: [
      "Correr nmap em diferentes modos e interpretar os resultados",
      "Usar NSE scripts para automatizar enumeração de vulnerabilidades",
      "Filtrar tráfego no Wireshark como um profissional",
      "Fazer follow de streams TCP e reconstruir conversas",
      "Detetar tráfego malicioso básico no Wireshark"
    ],
    vision: "Vais conseguir mapear qualquer rede em minutos com nmap e analisar qualquer captura de pacotes no Wireshark. Vais ser a pessoa que sabe o que está a acontecer na rede quando algo estranho aparece.",
    free: [
      { name: "Nmap Documentation Oficial", url: "https://nmap.org/docs.html" },
      { name: "Wireshark Tutorial (PacketSafari)", url: "https://www.youtube.com/watch?v=8A2Hct3iL2o" },
      { name: "TryHackMe — Nmap Room (grátis)", url: "https://tryhackme.com/room/furthernmap" },
    ],
    paid: [
      { name: "Nmap Network Scanning (livro oficial)", url: "https://nmap.org/book/" },
      { name: "SANS SEC504 (cobre nmap em profundidade)", url: "https://www.sans.org/cyber-security-courses/hacker-techniques-incident-handling/" },
    ],
    whyRecommended: "A documentação oficial do nmap e o TryHackMe gratuito são o melhor ponto de partida. O livro oficial do nmap é a bíblia quando quiseres dominar a ferramenta a sério. O SANS SEC504 é o curso presencial mais respeitado.",
    projects: [
      "Fazer scan completo à rede local com nmap e identificar todos os dispositivos",
      "Capturar tráfego de um nmap scan no Wireshark e identificar cada tipo de pacote",
      "Usar NSE scripts para detetar uma vulnerabilidade conhecida (ex: EternalBlue)"
    ],
    aiPrompt: "Dá-me um guia prático de nmap para iniciantes em segurança ofensiva. Quero saber: os 10 comandos mais importantes, o que cada flag faz, e como interpretar os resultados. Inclui exemplos de output.",
    keyKnowledge: [
      "Nmap: tipos de scan (SYN, connect, UDP, FIN, NULL)",
      "Nmap: deteção de versões (-sV), OS detection (-O)",
      "NSE scripts: categorias e uso prático",
      "Wireshark: captura e filtros de display",
      "Wireshark: follow TCP stream, estatísticas",
      "Deteção de anomalias: ARP spoofing, scan detection"
    ],
  },

  "Burp Suite basics": {
    phase: "Fase 1 · Purple Team",
    duration: "4-6 semanas",
    prereqs: ["Networking basics", "Protocolos & portas"],
    duration: "4-6 semanas",
    prereqs: ["Networking basics", "Protocolos & portas"],
    intro: "Burp Suite é o proxy de interceção padrão para testar segurança web. Permite ver, modificar e repetir pedidos HTTP/HTTPS entre o teu navegador e o servidor. É a ferramenta #1 para OWASP Top 10.",
    desc: "Vais aprender a configurar o proxy, interceptar pedidos, usar o Repeater para modificar e reenviar pedidos, o Intruder para ataques de força bruta e fuzzing, e o Decoder para manipular dados. A versão Community é gratuita e já cobre muito.",
    learn: [
      "Configurar o Burp como proxy interceptador",
      "Instalar e configurar o certificado CA para HTTPS",
      "Usar o Repeater para modificar pedidos manualmente",
      "Usar o Intruder para ataques de dicionário e fuzzing",
      "Analisar o histórico e identificar parâmetros vulneráveis"
    ],
    vision: "Vais conseguir testar qualquer aplicação web como um profissional: interceptar pedidos, modificar parâmetros, testar SQLi, XSS e outros ataques diretamente no Burp, com controle total sobre cada pedido.",
    free: [
      { name: "Burp Suite Community (grátis)", url: "https://portswigger.net/burp/communitydownload" },
      { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
    ],
    paid: [
      { name: "Burp Suite Professional", url: "https://portswigger.net/burp/pro" },
      { name: "Certificação Burp Suite (PortSwigger)", url: "https://portswigger.net/burp/certification" },
    ],
    whyRecommended: "O Web Security Academy da PortSwigger é GRÁTIS e é o melhor recurso do mundo para aprender segurança web. O Burp Pro é recomendado para profissionais porque o Intruder é muito mais rápido e tem funcionalidades avançadas.",
    projects: [
      "Completar o laboratório de SQLi no Web Security Academy",
      "Interceptar um login e modificar a resposta para simular bypass de autenticação",
      "Usar o Intruder para fazer fuzzing de parâmetros numa aplicação web vulnerável"
    ],
    aiPrompt: "Sou iniciante em segurança web. Explica-me como usar o Burp Suite para interceptar e modificar pedidos HTTP. Dá-me um exemplo prático de como testar SQL Injection usando o Burp Repeater.",
    keyKnowledge: [
      "Proxy de interceção: configurar navegador e certificado CA",
      "Repeater: modificar e reenviar pedidos HTTP",
      "Intruder: ataques de dicionário, fuzzing, brute force",
      "Decoder: encoding/decoding de dados",
      "Target scope e filtros de tráfego",
      "Extensões: BApp Store, autorizações, CSRF"
    ],
  },

  "Metasploit intro": {
    phase: "Fase 1 · Purple Team",
    duration: "3-4 semanas",
    prereqs: ["Nmap & Wireshark", "Virtualização & VMs"],
    duration: "3-4 semanas",
    prereqs: ["Nmap & Wireshark", "Virtualização & VMs"],
    intro: "Metasploit é o framework de exploração mais usado no mundo. Não é uma ferramenta mágica — é uma biblioteca de exploits, payloads e auxiliares que automatiza a fase de exploração de um ataque. Saber usá-lo é essencial, saber depender dele não é.",
    desc: "Vais aprender a estrutura do Metasploit: exploits, payloads (reverse shell, bind shell, meterpreter), auxiliares (scanners, fuzzers), encoders e post-exploitation modules. Vais também perceber a diferença entre usar um exploit automático vs manual.",
    learn: [
      "Navegar no msfconsole: search, use, show options, set, exploit",
      "Configurar um payload reverse_tcp e receber a shell",
      "Usar meterpreter para pós-exploração básica",
      "Correr um exploit conhecido (ex: MS17-010 EternalBlue)",
      "Importar resultados do nmap para o Metasploit"
    ],
    vision: "Vais conseguir explorar vulnerabilidades conhecidas de forma estruturada. Mais importante, vais entender o que o Metasploit faz por baixo dos panos — preparando-te para criar os teus próprios exploits no futuro.",
    free: [
      { name: "Metasploit Unleashed (guia gratuito)", url: "https://www.offensive-security.com/metasploit-unleashed/" },
      { name: "Metasploit Documentation", url: "https://docs.metasploit.com/" },
    ],
    paid: [
      { name: "OSCP (Offensive Security) — usa Metasploit", url: "https://www.offensive-security.com/pwk-oscp/" },
    ],
    whyRecommended: "O Metasploit Unleashed é o guia gratuito mais completo. A OSCP é a certificação recomendada porque te obriga a usar Metasploit mas também a fazer exploração manual — equilíbrio perfeito.",
    projects: [
      "Explorar o Metasploitable 2 com Metasploit e ganhar acesso",
      "Usar o nmap + Metasploit para automatizar descoberta e exploração",
      "Configurar um payload reverse_https para bypass de firewall básico"
    ],
    aiPrompt: "Explica o que é o Metasploit para um iniciante em pentesting. Dá-me o passo a passo de como usar msfconsole para explorar uma máquina vulnerável (Metasploitable 2), desde o scan até à shell.",
    keyKnowledge: [
      "msfconsole: search, use, set, exploit",
      "Payloads: reverse shell, bind shell, meterpreter",
      "Exploitation de vulnerabilidades conhecidas (ex: MS17-010)",
      "Post-exploitation: hashdump, keylogging, persistence",
      "Auxiliares: scanners, fuzzers, enumeradores",
      "Encoders e evasão de AV básica"
    ],
  },

  "SIEM & logs": {
    phase: "Fase 1 · Purple Team",
    duration: "3-4 semanas",
    prereqs: ["Linux básico"],
    duration: "3-4 semanas",
    prereqs: ["Linux básico"],
    intro: "Logs são o registo de tudo o que acontece num sistema. SIEM (Security Information and Event Management) é a ferramenta que centraliza, correlaciona e analisa esses logs. Um atacante deixa rasto — o SIEM é como encontras esse rasto.",
    desc: "Vais aprender o que são logs (syslog, event logs do Windows, logs de firewall), como são formatados e onde são guardados. Depois vais perceber como um SIEM funciona: collection, normalização, correlação, alerting. Ferramentas: Splunk (gratuito), Wazuh (open source), ELK Stack.",
    learn: [
      "Ler e interpretar logs de sistema e aplicações",
      "Configurar um SIEM básico (Wazuh ou ELK)",
      "Criar regras de correlação simples",
      "Detetar atividades suspeitas em logs",
      "Responder a alertas com base em evidências"
    ],
    vision: "Vais ser capaz de montar um SOC básico em casa: centralizar logs de várias máquinas, criar alertas para atividades suspeitas, e investigar incidentes usando os logs como evidência forense.",
    free: [
      { name: "Wazuh (open source SIEM)", url: "https://wazuh.com/" },
      { name: "Splunk Free", url: "https://www.splunk.com/en_us/download/splunk-enterprise.html" },
      { name: "TryHackMe — Introduction to SIEM", url: "https://tryhackme.com/room/introductiontosiem" },
    ],
    paid: [
      { name: "Splunk Core Certified User", url: "https://www.splunk.com/en_us/training/certification.html" },
      { name: "SANS SEC555 (SIEM com Splunk)", url: "https://www.sans.org/cyber-security-courses/siem-with-splunk/" },
    ],
    whyRecommended: "O Wazuh gratuito cobre tudo o que precisas para aprender. O Splunk Free também é ótimo. O curso SANS SEC555 é o padrão ouro para profissionais de SIEM — caro mas abre portas na indústria.",
    projects: [
      "Instalar o Wazuh e centralizar logs de 2 VMs diferentes",
      "Criar uma regra que alerta quando há 5 tentativas de SSH falhadas num minuto",
      "Analisar um log de ataque real (ex: Apache access log) e identificar o atacante"
    ],
    aiPrompt: "Explica o que é um SIEM e como funciona para um iniciante em segurança. Quero montar um laboratório SIEM em casa — que ferramentas open source recomendas e como configurar para detetar ataques básicos?",
    keyKnowledge: [
      "Logs: syslog, Windows Event Log, firewall logs",
      "Formato e normalização de logs",
      "SIEM: collection, parsing, correlação, alerting",
      "Wazuh (open source) e ELK Stack",
      "Criação de regras de correlação",
      "Resposta a incidentes baseada em logs"
    ],
  },

  "TryHackMe / HackTheBox": {
    phase: "Fase 1 · Purple Team",
    duration: "contínuo",
    prereqs: ["Linux básico", "Networking basics"],
    duration: "contínuo",
    prereqs: ["Linux básico", "Networking basics"],
    intro: "Teoria sem prática não vale nada. TryHackMe e HackTheBox são plataformas que te colocam em cenários reais de segurança, desde salas guiadas para iniciantes até máquinas CTF avançadas. É aqui que ganhas experiência real.",
    desc: "TryHackMe tem salas estruturadas com guias passo a passo — ideal para iniciantes. HackTheBox tem máquinas sem guia — és tu contra a máquina. Ambas têm laboratórios com exploits reais, escalação de privilégios, e cenários do mundo real.",
    learn: [
      "Navegar no TryHackMe e completar salas do caminho 'Junior Pentester'",
      "Resolver máquinas fáceis no HackTheBox sem guia",
      "Documentar os passos de cada máquina (write-ups)",
      "Praticar enumeração: nmap → gobuster → exploit → privilege escalation",
      "Participar em CTFs para testar habilidades sob pressão"
    ],
    vision: "Vais ter um portefólio de máquinas resolvidas, um método de trabalho estruturado para atacar qualquer alvo, e confiança para enfrentar desafios reais de segurança. Os teus write-ups viram o teu cartão de visita.",
    free: [
      { name: "TryHackMe (contas gratuitas, salas ilimitadas)", url: "https://tryhackme.com/" },
      { name: "HackTheBox (máquinas gratuitas, com limite diário)", url: "https://www.hackthebox.com/" },
    ],
    paid: [
      { name: "TryHackMe VIP (salas ilimitadas, laboratórios)", url: "https://tryhackme.com/plans" },
      { name: "HackTheBox VIP (acesso ilimitado + máquinas retiradas)", url: "https://www.hackthebox.com/pricing" },
    ],
    whyRecommended: "Começa com TryHackMe gratuito. Quando já estiveres confortável, o VIP do TryHackMe é barato e vale muito. O HackTheBox VIP vale quando quiseres desafios mais duros e acesso a máquinas retiradas com write-ups da comunidade.",
    projects: [
      "Completar o caminho 'Jr. Pentester' no TryHackMe (grátis)",
      "Resolver 5 máquinas fáceis do HackTheBox e escrever write-up de cada uma",
      "Participar num CTF mensal (ex: HackTheBox CTF ou TryHackMe CTF)"
    ],
    aiPrompt: "Sou iniciante em segurança ofensiva. Devo começar com TryHackMe ou HackTheBox? Dá-me um plano de 30 dias para passar de zero a conseguir resolver uma máquina fácil no HackTheBox.",
    keyKnowledge: [
      "Navegação no THM: salas, caminhos, badges",
      "Jr. Pentester Path e salas recomendadas",
      "HackTheBox: máquinas fáceis, write-ups, pontos",
      "Metodologia: recon, enum, exploit, privesc, report",
      "Documentação de write-ups técnicos",
      "Participação em CTFs"
    ],
  },

  "CTF challenges": {
    phase: "Fase 1 · Purple Team",
    duration: "contínuo",
    prereqs: ["Linux básico", "Networking basics"],
    duration: "contínuo",
    prereqs: ["Linux básico", "Networking basics"],
    intro: "CTF (Capture The Flag) são competições de segurança onde resolves desafios para encontrar 'flags' escondidas. É a forma mais divertida e eficaz de aprender — cada desafio é uma mini-lição de segurança aplicada.",
    desc: "Vais encontrar vários tipos de desafios: web exploitation, reversing, pwn (binary exploitation), cryptography, forensics, OSINT. Cada CTF tem um servidor com flags escondidas que deves encontrar usando técnicas específicas.",
    learn: [
      "Diferenciar as categorias de desafios CTF",
      "Resolver desafios web (SQLi, XSS, LFI, SSRF)",
      "Fazer análise forense básica (imagens de disco, pcap)",
      "Descompilar binários simples (reversing)",
      "Trabalhar em equipa e dividir tarefas"
    ],
    vision: "Vais ganhar a mentalidade de resolver problemas sob pressão. Cada CTF melhora a tua capacidade de pesquisar, aprender rápido e aplicar técnicas conhecidas a cenários novos — exatamente o que um profissional de segurança faz todos os dias.",
    free: [
      { name: "CTFtime (calendário de CTFs)", url: "https://ctftime.org/" },
      { name: "PicoCTF (CTF educativo gratuito)", url: "https://picoctf.com/" },
      { name: "OverTheWire (wargames)", url: "https://overthewire.org/wargames/" },
    ],
    paid: [
      { name: "HTB CTF (competições pagas com prémios)", url: "https://www.hackthebox.com/ctf" },
    ],
    whyRecommended: "PicoCTF é o melhor ponto de partida gratuito — foi desenhado por Carnegie Mellon para ensinar segurança. CTFtime para acompanhar competições ao vivo. Os CTFs pagos são para quando já tiveres experiência.",
    projects: [
      "Completar o PicoCTF (mais de 200 desafios gratuitos)",
      "Participar num CTF ao vivo no CTFtime como principiante",
      "Criar um write-up detalhado de 3 desafios resolvidos"
    ],
    aiPrompt: "Nunca participei num CTF. Explica o que é, como funcionam as categorias de desafios (web, pwn, rev, crypto, forensics), e dá-me dicas para começar. Qual o melhor CTF para um iniciante completo?",
    keyKnowledge: [
      "Categorias: web, pwn, reversing, crypto, forensics, OSINT",
      "Plataformas: PicoCTF, CTFtime, OverTheWire",
      "Ferramentas: Burp, Ghidra, John, hashcat, Wireshark",
      "Estratégia: research, tentativa, erro, colaboração",
      "Escrita de write-ups claros e detalhados",
      "Trabalho em equipa: divisão de tarefas, comunicação"
    ],
  },

  "OWASP Top 10": {
    phase: "Fase 1 · Purple Team",
    duration: "4-6 semanas",
    prereqs: ["Burp Suite basics", "Networking basics"],
    duration: "4-6 semanas",
    prereqs: ["Burp Suite basics", "Networking basics"],
    intro: "OWASP Top 10 é a lista das 10 vulnerabilidades mais críticas em aplicações web, atualizada a cada poucos anos. Se és novo em segurança web, este é o teu ponto de partida. Se és experiente, é a tua lista de verificação.",
    desc: "Vais estudar cada vulnerabilidade: Broken Access Control, Cryptographic Failures, Injection (SQLi, NoSQLi, OS command), Insecure Design, Security Misconfiguration, Vulnerable Components, Auth Failures, SSRF, Logging Failures, CSRF. Cada uma com exemplos práticos.",
    learn: [
      "Explicar as 10 categorias com exemplos reais",
      "Identificar cada vulnerabilidade numa aplicação web",
      "Saber como testar cada uma com ferramentas adequadas",
      "Entender como prevenir cada vulnerabilidade no código",
      "Usar o OWASP Testing Guide como referência"
    ],
    vision: "Vais testar qualquer aplicação web com uma checklist mental organizada. Vais saber onde olhar primeiro, que payloads testar, e como reportar cada vulnerabilidade encontrada.",
    free: [
      { name: "OWASP Top 10 Oficial", url: "https://owasp.org/www-project-top-ten/" },
      { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
      { name: "OWASP Juice Shop (app vulnerável)", url: "https://owasp.org/www-project-juice-shop/" },
    ],
    paid: [
      { name: "Burp Suite Certified Practitioner", url: "https://portswigger.net/web-security/certification" },
    ],
    whyRecommended: "O PortSwigger Academy gratuito é de longe o melhor recurso — tem laboratórios práticos para cada vulnerabilidade. O Juice Shop dá-te uma app real para treinar. A certificação da PortSwigger é a recomendação paga se quiseres validar o conhecimento.",
    projects: [
      "Completar os laboratórios de SQLi e XSS no PortSwigger Academy",
      "Explorar o OWASP Juice Shop e encontrar pelo menos 5 vulnerabilidades",
      "Criar um cheatsheet pessoal com payloads para cada categoria OWASP"
    ],
    aiPrompt: "Explica as 10 categorias do OWASP Top 10 para um iniciante. Para cada uma: o que é, como testar, e como prevenir. Dá exemplos de payloads para pelo menos 3 categorias (SQLi, XSS, SSRF).",
    keyKnowledge: [
      "Broken Access Control",
      "Cryptographic Failures",
      "Injection (SQLi, NoSQLi, OS command)",
      "Insecure Design",
      "Security Misconfiguration",
      "SSRF, CSRF, Logging Failures"
    ],
  },

  "Pen testing basics": {
    phase: "Fase 1 · Purple Team",
    duration: "6-8 semanas",
    prereqs: ["OWASP Top 10", "Metasploit intro"],
    duration: "6-8 semanas",
    prereqs: ["OWASP Top 10", "Metasploit intro"],
    intro: "Penetration testing (pentest) é o processo autorizado de atacar um sistema para encontrar vulnerabilidades antes dos atacantes reais. É uma profissão regulada, com metodologias definidas e entregas profissionais.",
    desc: "Vais aprender as fases de um pentest: Reconhecimento, Scanning & Enumeração, Exploração, Pós-Exploração e Reporting. Vais também perceber a diferença entre pentest de caixa preta, cinzenta e branca, e os limites legais e éticos.",
    learn: [
      "Executar as 5 fases de um pentest na ordem correta",
      "Escrever um relatório profissional de vulnerabilidades",
      "Diferenciar caixa preta, cinzenta e branca",
      "Usar uma metodologia padrão (PTES ou OWASP Testing Guide)",
      "Entender o enquadramento legal de um pentest"
    ],
    vision: "Vais conseguir conduzir um pentest completo do início ao fim, documentar as tuas descobertas e apresentar um relatório profissional. Vais pensar como um auditor de segurança, não apenas como um hacker.",
    free: [
      { name: "OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/" },
      { name: "PTES (Penetration Testing Execution Standard)", url: "http://www.pentest-standard.org/" },
    ],
    paid: [
      { name: "OSCP (Offensive Security)", url: "https://www.offensive-security.com/pwk-oscp/" },
      { name: "eJPT (INE)", url: "https://ine.com/learning/certifications/ejpt" },
    ],
    whyRecommended: "O OWASP Testing Guide é o padrão gratuito para testes web. PTES é o padrão para infraestrutura. A eJPT é a certificação de entrada recomendada (mais acessível que OSCP). A OSCP é o padrão ouro quando estiveres pronto.",
    projects: [
      "Conduzir um pentest completo ao Metasploitable 2 e escrever relatório",
      "Mapear cada passo dum pentest real a uma fase da metodologia PTES",
      "Criar um template de relatório de pentest profissional"
    ],
    aiPrompt: "Quero aprender pentest do zero. Explica as 5 fases de um teste de penetração com exemplos práticos de cada uma. Que certificação recomendas para começar: eJPT ou OSCP? Qual a diferença de custo e dificuldade?",
    keyKnowledge: [
      "Fases: Recon, Scanning, Exploitation, Post-exploitation, Reporting",
      "Tipos de pentest: caixa preta, cinzenta, branca",
      "Metodologias: PTES, OWASP Testing Guide",
      "Report: descobertas, impacto, recomendação, CVSS",
      "Limites legais e éticos: autorização por escrito",
      "Ferramentas essenciais: nmap, Burp, Metasploit, hydra"
    ],
  },

  "Python para automação": {
    phase: "Fase 1 · Purple Team",
    duration: "8-12 semanas",
    prereqs: [],
    duration: "8-12 semanas",
    prereqs: [],
    intro: "Python é a linguagem mais usada em segurança ofensiva e defensiva. Da automação de scans ao desenvolvimento de exploits, passando por análise de dados e machine learning — Python está em todo o lado.",
    desc: "Vais aprender Python focado em segurança: sockets para conexões de rede, requests para interações HTTP, subprocess para correr comandos, scapy para manipular pacotes, e pycryptodome para criptografia. Vais criar as tuas próprias ferramentas.",
    learn: [
      "Usar a biblioteca requests para automatizar pedidos web",
      "Criar um scanner de portas em Python com sockets",
      "Analisar logs com expressões regulares",
      "Usar scapy para criar e enviar pacotes personalizados",
      "Automatizar tarefas de enumeração e recon"
    ],
    vision: "Vais deixar de depender de ferramentas prontas para tudo. Consegues criar o teu próprio scanner, o teu próprio exploit, o teu próprio parser de logs. Isso é o que separa um operador de ferramentas de um profissional de segurança.",
    free: [
      { name: "Python for Everybody (curso gratuito)", url: "https://www.py4e.com/" },
      { name: "Black Hat Python (conteúdo gratuito online)", url: "https://www.youtube.com/playlist?list=PLLy_2iUCG87D1Jj3pt3nV_yhAwq6rkZ3e" },
    ],
    paid: [
      { name: "Black Hat Python (livro)", url: "https://nostarch.com/blackhatpython" },
      { name: "Udemy — Python para Pentest (PT-BR)", url: "https://www.udemy.com/course/python-para-pentest/" },
    ],
    whyRecommended: "Python for Everybody dá-te a base de programação. O livro Black Hat Python é a referência para aplicar Python em segurança — cada capítulo é uma ferramenta de segurança diferente.",
    projects: [
      "Criar um scanner de portas multi-thread em Python",
      "Automatizar um nmap scan e parsear o output para JSON",
      "Criar um script que testa SQL Injection num formulário web automaticamente"
    ],
    aiPrompt: "Quero aprender Python focado em segurança ofensiva. Dá-me os 10 módulos Python mais importantes para pentest, com exemplos de código para cada um. Começa com sockets e requests.",
    keyKnowledge: [
      "Sockets para conexões de rede",
      "Requests para interações HTTP",
      "Scapy para manipulação de pacotes",
      "Subprocess para execução de comandos",
      "Expressões regulares para parsing de logs",
      "PyCrypto para operações criptográficas"
    ],
  },

  "Bash scripting": {
    phase: "Fase 1 · Purple Team",
    duration: "2-4 semanas",
    prereqs: ["Linux básico"],
    duration: "2-4 semanas",
    prereqs: ["Linux básico"],
    intro: "Bash é a linguagem nativa do terminal Linux. Saber Bash é saber dar ordens ao sistema sem intermediários. Para um profissional de segurança, Bash é tão importante quanto respirar — é como falas com a máquina.",
    desc: "Vais aprender variáveis, loops, condicionais, funções, redirecionamento, pipes, substituição de comandos, e ferramentas de texto como grep, awk, sed, cut e sort. Tudo o que precisas para automatizar tarefas repetitivas.",
    learn: [
      "Escrever scripts com variáveis, loops e condicionais",
      "Usar grep, awk e sed para processar texto como um profissional",
      "Automatizar tarefas de enumeração com scripts",
      "Criar um script de backup e monitorização",
      "Processar logs e extrair informações específicas"
    ],
    vision: "Vais automatizar qualquer tarefa repetitiva em segundos. Um trabalho que levaria 30 minutos a fazer manualmente, resolves com um script de 5 linhas. Vais ser mais rápido e mais eficiente que 90% dos profissionais.",
    free: [
      { name: "Bash Guide (Greg's Wiki)", url: "https://mywiki.woodward.com/BashGuide" },
      { name: "ExplainShell", url: "https://explainshell.com/" },
      { name: "ShellCheck (linter online)", url: "https://www.shellcheck.net/" },
    ],
    paid: [
      { name: "Udemy — Bash Scripting (PT-BR)", url: "https://www.udemy.com/course/shell-script-do-zero/" },
    ],
    whyRecommended: "O Greg's Wiki e ExplainShell são gratuitos e excelentes. O curso da Udemy em PT-BR é barato e bom para quem prefere aprender em português com exercícios práticos.",
    projects: [
      "Criar um script de enumeração automática (nmap + gobuster + enum4linux)",
      "Script que monitoriza /var/log/auth.log e alerta se houver >3 SSH falhadas",
      "Parser de log Apache que extrai IPs, User-Agents e pedidos suspeitos"
    ],
    aiPrompt: "Quero aprender Bash scripting para segurança ofensiva. Dá-me 10 exemplos de scripts úteis para um pentester: desde enumeração automática até parsing de logs. Explica os conceitos-chave: pipes, redirecionamento, grep/awk/sed.",
    keyKnowledge: [
      "Variáveis, loops (for, while) e condicionais (if, case)",
      "Funções e scripts reutilizáveis",
      "grep, awk, sed: filtra, extrai, transforma",
      "Redirecionamento e pipes: stdout, stderr, /dev/null",
      "Agendamento com cron e systemd timers",
      "Parse de logs e ficheiros de configuração"
    ],
  },

  "Rust (em progresso)": {
    phase: "Fase 1 · Purple Team",
    duration: "12+ semanas",
    prereqs: ["Linux básico"],
    duration: "12+ semanas",
    prereqs: ["Linux básico"],
    intro: "Rust é uma linguagem de sistemas moderna, segura e rápida. Está a ganhar tração em segurança porque permite escrever ferramentas tão rápidas como C mas sem os bugs de memória que causam a maioria das vulnerabilidades.",
    desc: "Vais aprender os fundamentos de Rust: ownership, borrowing, lifetimes, traits, error handling. Rust é diferente de qualquer linguagem que já viste — a curva de aprendizagem é ingreme mas o resultado são ferramentas extremamente performantes e seguras.",
    learn: [
      "Entender ownership e borrowing (o coração do Rust)",
      "Escrever ferramentas de rede em Rust (tokio, async)",
      "Criar exploits mais rápidos e estáveis",
      "Usar Rust para reversing e engenharia inversa",
      "Compilar para binários pequenos e sem runtime"
    ],
    vision: "Vais conseguir criar ferramentas de segurança extremamente rápidas e confiáveis. Rust está a substituir C/C++ em ferramentas como ripgrep, fd, bat — e também em ferramentas de segurança. Saber Rust é um diferencial enorme no mercado.",
    free: [
      { name: "Rust Book (gratuito e oficial)", url: "https://doc.rust-lang.org/book/" },
      { name: "Rustlings (exercícios interativos)", url: "https://github.com/rust-lang/rustlings" },
      { name: "Rust by Example", url: "https://doc.rust-lang.org/stable/rust-by-example/" },
    ],
    paid: [
      { name: "Zero to Production in Rust (livro pago)", url: "https://www.zero2prod.com/" },
    ],
    whyRecommended: "O Rust Book gratuito é a melhor documentação de qualquer linguagem que já vi. Rustlings dá-te prática imediata. O livro Zero to Production é recomendado quando quiseres construir aplicações Rust completas.",
    projects: [
      "Criar um scanner de portas em Rust (comparar performance com Python)",
      "Reimplementar uma ferramenta de linha de comando em Rust (ex: grep ou cat)",
      "Criar um servidor TCP simples em Rust que responde a conexões"
    ],
    aiPrompt: "Quero aprender Rust para segurança. Explica ownership e borrowing como se eu fosse um programador Python. Dá-me exemplos de porquê Rust é útil para ferramentas de segurança e um exemplo de um scanner de portas.",
    keyKnowledge: [
      "Ownership, borrowing e lifetimes",
      "Structs, enums e pattern matching",
      "Error handling: Result, Option, unwrap, ? operator",
      "Concorrência com Tokio (async/await)",
      "Ferramentas de rede em Rust",
      "Compilação cross-platform e binários minimalistas"
    ],
  },

  // ── Fase 2 · AI / ML ──

  "Python para AI": {
    phase: "Fase 2 · AI / ML",
    duration: "4-8 semanas",
    prereqs: ["Python básico"],
    duration: "4-8 semanas",
    prereqs: ["Python básico"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "NumPy: arrays, operações vetoriais, broadcasting",
      "Pandas: DataFrames, séries, limpeza de dados",
      "Matplotlib/Seaborn: visualização de dados",
      "Scikit-learn: modelos básicos de ML",
      "PyTorch: tensores, autograd, nn.Module",
      "Jupyter Notebooks para experimentação"
    ],
  },

  "Matemática & stats": {
    phase: "Fase 2 · AI / ML",
    duration: "6-8 semanas",
    prereqs: [],
    duration: "6-8 semanas",
    prereqs: [],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Álgebra linear: vetores, matrizes, multiplicação, SVD",
      "Cálculo: derivadas, gradiente, chain rule",
      "Probabilidade: distribuições, Bayes, entropia",
      "Estatística: média, variância, desvio padrão, correlação",
      "Otimização: gradiente descendente, loss functions",
      "Matrizes em Python com NumPy"
    ],
  },

  "ML supervised / unsup.": {
    phase: "Fase 2 · AI / ML",
    duration: "6-8 semanas",
    prereqs: ["Python para AI", "Matemática & stats"],
    duration: "6-8 semanas",
    prereqs: ["Python para AI", "Matemática & stats"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Regressão linear e logística",
      "Decision Trees e Random Forests",
      "SVM (Support Vector Machines)",
      "K-Means e clustering hierárquico",
      "PCA para redução de dimensionalidade",
      "Avaliação: acurácia, precisão, recall, F1"
    ],
  },

  "Neural networks": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["ML supervised / unsup.", "Matemática & stats"],
    duration: "4-6 semanas",
    prereqs: ["ML supervised / unsup.", "Matemática & stats"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Perceptron e MLP (Multi-Layer Perceptron)",
      "Funções de ativação: ReLU, sigmoid, tanh, softmax",
      "Backpropagation e gradiente descendente",
      "Batch normalization, dropout, regularização",
      "CNN para imagens, RNN para sequências",
      "PyTorch: nn.Module, DataLoader, treino"
    ],
  },

  "Deep learning": {
    phase: "Fase 2 · AI / ML",
    duration: "6-8 semanas",
    prereqs: ["Neural networks"],
    duration: "6-8 semanas",
    prereqs: ["Neural networks"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "CNN: convolução, pooling, feature maps",
      "RNN/LSTM/GRU para séries temporais",
      "Transformers: attention, self-attention, multi-head",
      "Transfer learning e fine-tuning",
      "GANs: gerador, discriminador, treino adversarial",
      "Treino em GPU: CUDA, mixed precision, distributed"
    ],
  },

  "Como LLMs funcionam": {
    phase: "Fase 2 · AI / ML",
    duration: "2-4 semanas",
    prereqs: ["Neural networks"],
    duration: "2-4 semanas",
    prereqs: ["Neural networks"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Arquitetura Transformer: encoder, decoder, attention",
      "Tokenização: BPE, WordPiece, SentencePiece",
      "Pré-treino vs fine-tuning",
      "Context window, positional encoding",
      "Temperature, top-k, top-p sampling",
      "Limitações: alucinação, viés, contexto finito"
    ],
  },

  "APIs: OpenAI, Claude": {
    phase: "Fase 2 · AI / ML",
    duration: "1-2 semanas",
    prereqs: ["Python para AI"],
    duration: "1-2 semanas",
    prereqs: ["Python para AI"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "API OpenAI: chat completions, embeddings, streaming",
      "API Claude: messages API, system prompts",
      "Parâmetros: temperature, max_tokens, stop sequences",
      "Autenticação: API keys, rate limits, billing",
      "Function calling e tool use",
      "Construção de prompts estruturados"
    ],
  },

  "Prompt engineering": {
    phase: "Fase 2 · AI / ML",
    duration: "2-4 semanas",
    prereqs: ["Como LLMs funcionam"],
    duration: "2-4 semanas",
    prereqs: ["Como LLMs funcionam"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Estrutura de prompt: system, user, assistant, context",
      "Técnicas: zero-shot, few-shot, chain-of-thought",
      "Role prompting e persona",
      "Output formatting: JSON, markdown, XML",
      "Iteração e refinamento de prompts",
      "Guardar e versionar prompts"
    ],
  },

  "Fine-tuning basics": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["Deep learning", "APIs: OpenAI, Claude"],
    duration: "4-6 semanas",
    prereqs: ["Deep learning", "APIs: OpenAI, Claude"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Supervised fine-tuning (SFT) com dataset rotulado",
      "Parameter-efficient: LoRA, QLoRA, adapters",
      "Preparação de dataset: formato, qualidade, balanced",
      "Hiperparâmetros: learning rate, batch size, epochs",
      "Avaliação pós fine-tuning: loss, accuracy, human eval",
      "Overfitting e regularização em fine-tuning"
    ],
  },

  "Hugging Face": {
    phase: "Fase 2 · AI / ML",
    duration: "2-3 semanas",
    prereqs: ["Python para AI", "APIs: OpenAI, Claude"],
    duration: "2-3 semanas",
    prereqs: ["Python para AI", "APIs: OpenAI, Claude"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Hugging Face Hub: modelos, datasets, spaces",
      "Transformers library: pipeline, AutoModel, Trainer",
      "Datasets library: carregar, processar, split",
      "Fine-tuning com Hugging Face Trainer",
      "Push de modelos para o Hub",
      "Spaces para deploy de demos"
    ],
  },

  "Embeddings": {
    phase: "Fase 2 · AI / ML",
    duration: "2-3 semanas",
    prereqs: ["Como LLMs funcionam", "Python para AI"],
    duration: "2-3 semanas",
    prereqs: ["Como LLMs funcionam", "Python para AI"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "O que são embeddings: representação vetorial de texto",
      "Modelos de embedding: text-embedding-ada-002, sentence-transformers",
      "Similaridade: cosseno, euclidiana, dot product",
      "Visualização de embeddings com t-SNE ou PCA",
      "Aplicações: search semântico, clustering, classificação",
      "Limitações: viés, dimensionalidade, contexto"
    ],
  },

  "Vector databases": {
    phase: "Fase 2 · AI / ML",
    duration: "2-3 semanas",
    prereqs: ["Embeddings"],
    duration: "2-3 semanas",
    prereqs: ["Embeddings"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Conceito: índices de similaridade vetorial",
      "Produtos: Pinecone, Weaviate, Qdrant, Chroma",
      "Índices: HNSW, IVF, brute force",
      "CRUD de vetores com metadados",
      "Hybrid search: vetorial + filtros por metadados",
      "Escalabilidade: sharding, replicação, performance"
    ],
  },

  "RAG implementation": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["Embeddings", "Vector databases", "APIs: OpenAI, Claude"],
    duration: "4-6 semanas",
    prereqs: ["Embeddings", "Vector databases", "APIs: OpenAI, Claude"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Pipeline RAG: ingest, chunk, embed, store, retrieve, generate",
      "Chunking estratégias: tamanho, overlap, splitting",
      "Retrieval: similarity search, MMR, HyDE",
      "Context augmentation no prompt",
      "Avaliação: faithfulness, relevance, recall",
      "Frameworks: LangChain, LlamaIndex, Haystack"
    ],
  },

  "AI agents & tools": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["RAG implementation", "APIs: OpenAI, Claude"],
    duration: "4-6 semanas",
    prereqs: ["RAG implementation", "APIs: OpenAI, Claude"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Conceito: agent = LLM + tools + memory + planning",
      "Tool use: function calling, APIs, search, code execution",
      "Memória: curto prazo (contexto), longo prazo (vector store)",
      "Planning: ReAct, chain-of-thought, subgoals",
      "Multi-agent: coordenação, debate, hierarquia",
      "Frameworks: LangChain Agent, AutoGPT, CrewAI"
    ],
  },

  "LangChain / LlamaIndex": {
    phase: "Fase 2 · AI / ML",
    duration: "3-4 semanas",
    prereqs: ["RAG implementation", "AI agents & tools"],
    duration: "3-4 semanas",
    prereqs: ["RAG implementation", "AI agents & tools"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "LangChain: chains, agents, retrievers, memory",
      "LlamaIndex: índices, queries, engines",
      "Prompt templates e output parsers",
      "Integração com modelos e vector stores",
      "Observabilidade: LangSmith, tracing",
      "Deploy de aplicações RAG e agentes"
    ],
  },

  "Docker & containers": {
    phase: "Fase 2 · AI / ML",
    duration: "2-4 semanas",
    prereqs: ["Linux básico"],
    duration: "2-4 semanas",
    prereqs: ["Linux básico"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Imagens vs containers: build, run, pull, push",
      "Dockerfile: FROM, RUN, COPY, CMD, ENTRYPOINT",
      "Volumes e bind mounts para persistência",
      "Redes: bridge, host, overlay, docker-compose",
      "docker-compose para multi-serviços",
      "Multi-stage builds e .dockerignore"
    ],
  },

  "Cloud basics (AWS/GCP)": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["Docker & containers"],
    duration: "4-6 semanas",
    prereqs: ["Docker & containers"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "AWS EC2: instâncias, AMIs, security groups, key pairs",
      "AWS S3: buckets, objetos, políticas, versioning",
      "AWS IAM: users, roles, policies, least privilege",
      "GCP Compute Engine e Cloud Storage equivalentes",
      "Serverless: AWS Lambda, GCP Cloud Functions",
      "VPC, subnets, load balancers"
    ],
  },

  "MLOps intro": {
    phase: "Fase 2 · AI / ML",
    duration: "4-6 semanas",
    prereqs: ["Docker & containers", "Cloud basics (AWS/GCP)"],
    duration: "4-6 semanas",
    prereqs: ["Docker & containers", "Cloud basics (AWS/GCP)"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Pipeline ML: data, train, evaluate, deploy, monitor",
      "Experiment tracking: MLflow, W&B",
      "Model registry e versionamento",
      "Deploy: REST API, batch inference, edge",
      "Monitorização: data drift, model drift, performance",
      "CI/CD para ML: GitHub Actions, Kubeflow"
    ],
  },

  // ── Fase 3 · AI Security ──

  "AI security fundamentals": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["ML básico", "CIA triad & conceitos"],
    duration: "3-4 semanas",
    prereqs: ["ML básico", "CIA triad & conceitos"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Ameaças específicas de AI vs segurança tradicional",
      "Ciclo de vida de um modelo: ataque em cada fase",
      "OWASP Top 10 for LLM Applications",
      "MITRE ATLAS: framework de ataques a AI",
      "AI Bill of Materials (AI BOM)",
      "Governança e compliance em AI"
    ],
  },

  "Threat modeling para AI": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["AI security fundamentals", "Threats & attack vectors"],
    duration: "3-4 semanas",
    prereqs: ["AI security fundamentals", "Threats & attack vectors"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Asset identification: dados, modelo, pipeline, inferência",
      "Attack surface: dataset, treino, deploy, API",
      "STRIDE aplicado a AI",
      "Ferramentas: Threat Dragon, OWASP AI Exchange",
      "Mitigações por fase do ciclo ML",
      "Modelo de ameaças adaptado a sistemas de ML"
    ],
  },

  "AI risk management": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["AI security fundamentals"],
    duration: "2-3 semanas",
    prereqs: ["AI security fundamentals"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Riscos: viés, alucinação, segurança, privacidade, compliance",
      "NIST AI Risk Management Framework",
      "EU AI Act: categorias de risco, obrigações",
      "AI audits: fairness, accountability, transparency",
      "Risk assessment matrix para AI",
      "Documentação de riscos e planos de mitigação"
    ],
  },

  "CIA triad em AI": {
    phase: "Fase 3 · AI Security",
    duration: "1-2 semanas",
    prereqs: ["AI security fundamentals", "CIA triad & conceitos"],
    duration: "1-2 semanas",
    prereqs: ["AI security fundamentals", "CIA triad & conceitos"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Confidencialidade: model inversion, membership inference",
      "Integridade: data poisoning, model tampering",
      "Disponibilidade: DDoS, compute theft",
      "Privacidade diferencial em treino",
      "Watermarking de modelos para integridade",
      "Auditoria contínua de outputs"
    ],
  },

  "Prompt injection": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["Prompt engineering", "Como LLMs funcionam"],
    duration: "3-4 semanas",
    prereqs: ["Prompt engineering", "Como LLMs funcionam"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Direct vs indirect prompt injection",
      "Técnicas: role reversal, DAN, payload splitting",
      "Context leakage: exfiltração de system prompt",
      "Defesas: input sanitization, output validation, delimiters",
      "Ferramentas: LangKit, Rebuff, Guardrails",
      "Testes adversariais automatizados"
    ],
  },

  "Jailbreak techniques": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["Prompt injection"],
    duration: "2-3 semanas",
    prereqs: ["Prompt injection"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Técnicas comuns: DAN, roleplay, encoding, hypnosis",
      "Bypass de content filters: base64, leetspeak, tradução",
      "Jailbreak via few-shot poisoning",
      "Ferramentas: GPTFuzzer, EasyJailbreak",
      "Mitigações: treino adversarial, RLHF",
      "Disclosure responsável de jailbreaks"
    ],
  },

  "Adversarial examples": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["Deep learning", "Neural networks"],
    duration: "3-4 semanas",
    prereqs: ["Deep learning", "Neural networks"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Ataques white-box: FGSM, PGD, C&W",
      "Ataques black-box: transferabilidade, query-based",
      "Defesas: adversarial training, input transformation",
      "Ferramentas: CleverHans, Foolbox, ART",
      "Avaliação de robustez: certificada vs empírica",
      "Exemplos visuais (imagens) e textuais"
    ],
  },

  "Data poisoning": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["ML supervised / unsup."],
    duration: "2-3 semanas",
    prereqs: ["ML supervised / unsup."],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Tipos: label flipping, backdoor triggers, clean-label",
      "Ataques: BadNets, Poison Frogs",
      "Backdoor: trigger invisível, ativação específica",
      "Defesas: data sanitization, outlier detection",
      "Ferramentas: TrojAI, BackdoorBench",
      "Deteção: activation clustering, spectral signature"
    ],
  },

  "Model extraction": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["APIs: OpenAI, Claude", "ML básico"],
    duration: "2-3 semanas",
    prereqs: ["APIs: OpenAI, Claude", "ML básico"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Objetivo: roubar o modelo via queries à API",
      "Técnicas: equilateral, Jacobian, transfer learning",
      "Métricas: fidelidade, acurácia, dataset size",
      "Defesas: rate limiting, watermarking, query detection",
      "Ferramentas: Knockoff Nets, Copycat CNN",
      "Custo vs benefício da extração"
    ],
  },

  "Model inversion": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["Model extraction", "Deep learning"],
    duration: "2-3 semanas",
    prereqs: ["Model extraction", "Deep learning"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Objetivo: reconstruir dados de treino",
      "Ataques: GAN-based inversion, gradient matching",
      "Implicações de privacidade",
      "Defesas: differential privacy, gradient clipping",
      "Métrica: reconstrução vs dados originais",
      "Ferramentas: MI-Attack, GradInversion"
    ],
  },

  "Robust model design": {
    phase: "Fase 3 · AI Security",
    duration: "4-6 semanas",
    prereqs: ["Adversarial examples", "Deep learning"],
    duration: "4-6 semanas",
    prereqs: ["Adversarial examples", "Deep learning"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Adversarial training: PGD, TRADES, ensemble",
      "Certified robustness: Lipschitz, randomized smoothing",
      "Architecture choices para robustez",
      "Data augmentation: CutMix, MixUp, AutoAugment",
      "Regularização: weight decay, dropout",
      "Benchmarks: RobustBench"
    ],
  },

  "Adversarial training": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["Robust model design", "Adversarial examples"],
    duration: "3-4 semanas",
    prereqs: ["Robust model design", "Adversarial examples"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "PGD adversarial training padrão",
      "TRADES: trade-off entre robustez e acurácia",
      "Ensemble adversarial training",
      "Free adversarial training",
      "Limitações: custo computacional",
      "Overfitting a ataques conhecidos"
    ],
  },

  "Guardrails & sandboxing": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["Prompt injection", "AI agents & tools"],
    duration: "3-4 semanas",
    prereqs: ["Prompt injection", "AI agents & tools"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Input validation e output validation",
      "Sandboxing de LLMs e agentes",
      "Content filters: toxicidade, PII, código",
      "Ferramentas: Guardrails AI, NVIDIA NeMo, LangKit",
      "Policy enforcement configurável",
      "Auditoria e logging de violações"
    ],
  },

  "API protection & auth": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["APIs: OpenAI, Claude"],
    duration: "2-3 semanas",
    prereqs: ["APIs: OpenAI, Claude"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Autenticação: API keys, OAuth2, JWT",
      "Rate limiting por user, IP, endpoint",
      "Input validation: schema, tamanho, sanitização",
      "Logging e monitorização",
      "CORS, CSRF, proteção de endpoints",
      "API gateways: Kong, AWS API Gateway"
    ],
  },

  "Continuous monitoring": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["Guardrails & sandboxing"],
    duration: "2-3 semanas",
    prereqs: ["Guardrails & sandboxing"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Monitorização de inputs: toxicidade, jailbreak, PII",
      "Monitorização de outputs: alucinação, viés",
      "Data drift e concept drift",
      "Alerting e dashboards",
      "Ferramentas: WhyLabs, Arize, Evidently",
      "Runbooks de resposta a incidentes"
    ],
  },

  "Black / white / grey box": {
    phase: "Fase 3 · AI Security",
    duration: "2-3 semanas",
    prereqs: ["Pen testing basics"],
    duration: "2-3 semanas",
    prereqs: ["Pen testing basics"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Black-box: acesso só à API",
      "White-box: acesso total a pesos e gradientes",
      "Grey-box: conhecimento parcial",
      "Transferabilidade entre modelos",
      "Query budgets e restrições",
      "Escolha conforme contexto real"
    ],
  },

  "LLM security testing": {
    phase: "Fase 3 · AI Security",
    duration: "4-6 semanas",
    prereqs: ["Prompt injection", "Guardrails & sandboxing"],
    duration: "4-6 semanas",
    prereqs: ["Prompt injection", "Guardrails & sandboxing"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Metodologia: recon, prompt injection, jailbreak, exfiltração",
      "Ferramentas: Garak, PyRIT, Giskard",
      "Testes automatizados de segurança de LLMs",
      "OWASP LLM Testing Guide",
      "Report de vulnerabilidades",
      "Red teaming operacional vs automatizado"
    ],
  },

  "Agentic AI security": {
    phase: "Fase 3 · AI Security",
    duration: "4-6 semanas",
    prereqs: ["AI agents & tools", "LLM security testing"],
    duration: "4-6 semanas",
    prereqs: ["AI agents & tools", "LLM security testing"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Riscos: tool abuse, privilege escalation",
      "Attack surface: memória, ferramentas, planner",
      "Prompt injection em agentes",
      "Defesas: sandboxing, approval gates",
      "Monitorização de ações de agentes",
      "Frameworks: Guardrails Agent, CrewAI security"
    ],
  },

  "RAG security": {
    phase: "Fase 3 · AI Security",
    duration: "3-4 semanas",
    prereqs: ["RAG implementation", "LLM security testing"],
    duration: "3-4 semanas",
    prereqs: ["RAG implementation", "LLM security testing"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Riscos: data poisoning no vector store",
      "Prompt injection via documentos recuperados",
      "Privacidade: dados sensíveis no retriever",
      "Defesas: sanitização, filtros de contexto",
      "Avaliação: relevância vs segurança",
      "Auditoria do pipeline RAG"
    ],
  },

  "Red team simulations": {
    phase: "Fase 3 · AI Security",
    duration: "6-8 semanas",
    prereqs: ["LLM security testing", "Agentic AI security", "Pen testing basics"],
    duration: "6-8 semanas",
    prereqs: ["LLM security testing", "Agentic AI security", "Pen testing basics"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Planeamento: scope, regras, objetivos",
      "Execução: recon, ataque, pivot, exfiltração",
      "Ferramentas: Cobalt Strike, Mythic, Sliver",
      "Reporting: descobertas, impacto, defesas",
      "Purple team: validação de deteções",
      "Lições aprendidas e melhoria contínua"
    ],
  },

  "Responsible disclosure": {
    phase: "Fase 3 · AI Security",
    duration: "1-2 semanas",
    prereqs: [],
    duration: "1-2 semanas",
    prereqs: [],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "Processo: descoberta, relato, confirmação, correção, publicação",
      "Tipos: full disclosure, responsible, coordinated",
      "Bug bounty: HackerOne, Bugcrowd",
      "VDP: Vulnerability Disclosure Policy",
      "Legal: safe harbor, limites de teste",
      "Comunicação: relatório claro"
    ],
  },

  "Industry standards": {
    phase: "Fase 3 · AI Security",
    duration: "1-2 semanas",
    prereqs: [],
    duration: "1-2 semanas",
    prereqs: [],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "ISO 27001: ISMS",
      "SOC 2: trust services criteria",
      "NIST Cybersecurity Framework",
      "PCI DSS",
      "GDPR: proteção de dados",
      "OWASP ASVS"
    ],
  },

  "Certifications (CEH, OSCP)": {
    phase: "Fase 3 · AI Security",
    duration: "3-6 meses",
    prereqs: ["Pen testing basics"],
    duration: "3-6 meses",
    prereqs: ["Pen testing basics"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "CEH: Ethical Hacker, teoria",
      "OSCP: Offensive Security, prática 24h+exame",
      "eJPT: INE, entrada, prática guiada",
      "CISSP: gestão, amplo espectro",
      "Escolha conforme perfil",
      "Preparação: laboratórios, simulados"
    ],
  },

  "Portfolio & publicação": {
    phase: "Fase 3 · AI Security",
    duration: "contínuo",
    prereqs: ["Projetos concluídos"],
    duration: "contínuo",
    prereqs: ["Projetos concluídos"],
    intro: "",
    desc: "",
    learn: [],
    vision: "",
    free: [],
    paid: [],
    whyRecommended: "",
    projects: [],
    aiPrompt: "",
    keyKnowledge: [
      "GitHub: repositórios, README, commits",
      "Blog técnico: artigos, write-ups",
      "LinkedIn: perfil, publicações",
      "Portfolio: projetos destacados",
      "Storytelling: resultados, aprendizados",
      "Consistência: publicar regularmente"
    ],
  }
};

// ── Modal ──
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(nodeLabel) {
  const data = NODE_DATA[nodeLabel];
  if (!data) return;

  const freeHtml = (data.free || []).map(r =>
    `<a href="${r.url}" target="_blank" rel="noopener" class="modal-resource">${r.name} <span class="modal-resource-tag tag-free">grátis</span></a>`
  ).join('');

  const paidHtml = (data.paid || []).map(r =>
    `<a href="${r.url}" target="_blank" rel="noopener" class="modal-resource">${r.name} <span class="modal-resource-tag tag-paid">pago</span></a>`
  ).join('');

  const learnHtml = (data.learn || []).map(l => `<li>${l}</li>`).join('');

  const projectsHtml = (data.projects || []).map(p => `<li>${p}</li>`).join('');

  const keyHtml = (data.keyKnowledge || []).map(k => `<li>${k}</li>`).join('');

  modalBody.innerHTML = `
    <div class="modal-phase">${data.phase}</div>
    <div class="modal-title">${nodeLabel}</div>

    <div class="modal-meta">
      ${data.duration ? `<span class="modal-badge modal-duration">${data.duration}</span>` : ''}
      ${data.prereqs && data.prereqs.length
        ? `<span class="modal-badge-label">pré-requisitos:</span> ${data.prereqs.map(p => `<span class="modal-badge prereq">${p}</span>`).join('')}`
        : data.prereqs !== undefined ? `<span class="modal-badge-label">pré-requisitos:</span> <span class="modal-badge prereq-none">nenhum</span>` : ''}
    </div>

    <div class="modal-section">
      <div class="modal-h">Introdução</div>
      <p class="modal-p">${data.intro}</p>
    </div>

    <div class="modal-section">
      <div class="modal-h">Descrição</div>
      <p class="modal-p">${data.desc}</p>
    </div>

    <div class="modal-section">
      <div class="modal-h">O que vais aprender</div>
      <ul class="modal-ul">${learnHtml}</ul>
    </div>

    ${keyHtml ? `<div class="modal-section">
      <div class="modal-h">Conhecimentos-chave</div>
      <ul class="modal-ul">${keyHtml}</ul>
    </div>` : ''}

    <div class="modal-section">
      <div class="modal-h">Visão depois de completar</div>
      <p class="modal-p">${data.vision}</p>
    </div>

    <div class="modal-section">
      <div class="modal-h">Recursos gratuitos</div>
      ${freeHtml || '<p class="modal-p" style="color:var(--text3)">Nenhum recurso gratuito listado.</p>'}
    </div>

    <div class="modal-section">
      <div class="modal-h">Recursos pagos (recomendados)</div>
      ${paidHtml || '<p class="modal-p" style="color:var(--text3)">Nenhum recurso pago listado.</p>'}
    </div>

    <div class="modal-section">
      <div class="modal-h">Porquê estes recursos?</div>
      <p class="modal-p">${data.whyRecommended}</p>
    </div>

    <div class="modal-section">
      <div class="modal-h">Ideias de Projectos</div>
      <ul class="modal-ul">${projectsHtml}</ul>
    </div>

    <div class="modal-section">
      <div class="modal-h">Prompt para IA</div>
      <div class="modal-prompt-box" id="promptText">${data.aiPrompt}</div>
      <button class="modal-prompt-copy" id="copyPrompt">Copiar prompt</button>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('copyPrompt').addEventListener('click', function () {
    const text = document.getElementById('promptText').textContent;
    navigator.clipboard.writeText(text).then(() => {
      this.textContent = 'Copiado';
      this.classList.add('copied');
      setTimeout(() => {
        this.textContent = 'Copiar prompt';
        this.classList.remove('copied');
      }, 2000);
    });
  });
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// ── Clique nos nodes (inclui early-access) ──
document.querySelectorAll('.node-box:not(.locked-col .node-box), .locked-col .node-box[data-early]').forEach(el => {
  el.addEventListener('click', function (e) {
    const label = this.textContent.trim();
    if (NODE_DATA[label]) openModal(label);
  });
});

// ── Progresso global e por coluna ──
function updateGlobalProgress() {
  const all = document.querySelectorAll('.node-box:not(.locked-col .node-box), .locked-col .node-box[data-early]');
  const done = document.querySelectorAll('.node-box.done:not(.locked-col .node-box), .locked-col .node-box.done[data-early]');
  const total = all.length;
  const n = done.length;
  const pct = total ? Math.round((n / total) * 100) : 0;
  document.getElementById('gpFill').style.width = pct + '%';
  document.getElementById('gpPct').textContent = pct + '%';
  document.getElementById('gpSub').textContent = n + ' / ' + total + ' concluídos';
}

document.querySelectorAll('.node-box:not(.locked-col .node-box), .locked-col .node-box[data-early]').forEach(el => {
  el.addEventListener('click', function () {
    if (this.classList.contains('current')) return;
    const wasDone = this.classList.contains('done');
    this.classList.toggle('done');
    updateGlobalProgress();
  });
});

updateGlobalProgress();

// ── Prática por secção ──
const PRACTICE_TOOLS = {
  tryhackme: {
    name: 'TryHackMe',
    url: 'https://tryhackme.com',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 0 0-4.107 4.5 4.525 4.525 0 0 0 4.52 4.52h6.761a.625.625 0 1 0 0-1.25H4.761a3.273 3.273 0 0 1-3.27-3.27A3.273 3.273 0 0 1 6.59 7.08a.625.625 0 0 0 .7-1.035 4.488 4.488 0 0 0-1.68-.69 5.223 5.223 0 0 1 5.096-4.104 5.221 5.221 0 0 1 5.174 4.57 4.489 4.489 0 0 0-.488.305.625.625 0 1 0 .731 1.013 3.245 3.245 0 0 1 1.912-.616 3.278 3.278 0 0 1 3.203 2.61.625.625 0 0 0 1.225-.251 4.533 4.533 0 0 0-4.428-3.61 4.54 4.54 0 0 0-.958.105C16.556 2.328 13.9 0 10.705 0Z"/></svg>',
    reason: 'Laboratórios guiados para Linux, redes e fundamentos de segurança.'
  },
  portswigger: {
    name: 'PortSwigger Academy',
    url: 'https://portswigger.net/web-security',
    svg: '<svg viewBox="0 0 640 640" fill="currentColor"><path d="M338 0H640V640H338V602.5L559 383H338V209.5H176.5L338 46.5V0Z"/><path d="M0 0H309V39L93.5 244.5H309V418.5H485L309 593V640H0V0Z" opacity="0.55"/></svg>',
    reason: 'Pratica Burp Suite, análise de tráfego e exploração web.'
  },
  hackthebox: {
    name: 'HackTheBox',
    url: 'https://www.hackthebox.com',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m22.5106 6.4566.0008-.0123a.888.888 0 0 0-.2717-.6384c-.0084-.0084-.018-.0155-.0267-.0235-.0186-.0166-.0371-.0333-.0572-.0484-.0193-.0147-.04-.0276-.0607-.0406-.0096-.006-.0182-.0131-.0281-.0188L12.4576.1266a.891.891 0 0 0-.9223.0043L1.933 5.6744c-.0107.0062-.0203.014-.0307.0205-.0073.0047-.015.008-.0223.0128-.007.0047-.013.0106-.02.0155a.8769.8769 0 0 0-.147.1333l-.0026.003a.8872.8872 0 0 0-.2218.5847l.0009.014c-.0002.0088-.0015.0176-.0015.0264v11.0708c0 .3277.1802.6288.469.7836l9.5986 5.5417c.0076.0044.0158.0075.0236.0117a.8754.8754 0 0 0 .166.0687c.0134.004.0266.0083.0401.0117a.8793.8793 0 0 0 .072.0142c.0117.0019.0232.0045.0349.006a.835.835 0 0 0 .2157 0c.0117-.0015.0232-.0041.0348-.006a.9.9 0 0 0 .072-.0142c.0135-.0034.0267-.0077.04-.0117a.895.895 0 0 0 .0646-.0217.9134.9134 0 0 0 .1015-.047c.0078-.0042.016-.0072.0236-.0117l9.5986-5.5417a.8888.8888 0 0 0 .469-.7836V6.4779c0-.0071-.0012-.0142-.0014-.0213z"/></svg>',
    reason: 'Põe à prova as tuas skills ofensivas em máquinas reais e CTFs.'
  },
  picoctf: {
    name: 'PicoCTF',
    url: 'https://picoctf.com',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L3 7v5c0 4.5 3 9 9 11 6-2 9-6.5 9-11V7l-9-5Z"/><path d="M9 12h6M12 9v6"/></svg>',
    reason: 'Desafia o pensamento computacional com CTFs que combinam lógica e ML.'
  },
  juiceshop: {
    name: 'OWASP Juice Shop',
    url: 'https://owasp.org/www-project-juice-shop/',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 14c0 4 2.5 7 6 8.5 3.5-1.5 6-4.5 6-8.5V8L12 4 6 8v6Z"/><path d="M8 10v3l4 2 4-2v-3"/><path d="M10 5V3M14 5V3M9 2h6"/></svg>',
    reason: 'Ambiente web realista para praticar AI security, prompt injection e LLM testing.'
  }
};

document.querySelectorAll('[data-practice]').forEach(el => {
  const key = el.getAttribute('data-practice');
  const tool = PRACTICE_TOOLS[key];
  if (!tool) return;

  const id = 'pc_' + key + '_' + el.textContent.trim().replace(/\s+/g, '_');
  if (localStorage.getItem('mr_dismiss_' + id)) return;

  const div = document.createElement('div');
  div.className = 'practice-card';
  div.id = id;
  div.innerHTML = `
    <div class="practice-card-inner">
      ${tool.svg}
      <div class="practice-card-body">
        <div class="practice-card-name">${tool.name}</div>
        <div class="practice-card-reason">${tool.reason}</div>
      </div>
    </div>
    <a href="${tool.url}" target="_blank" rel="noopener" class="practice-card-link">Abrir →</a>
    <button class="practice-card-dismiss" title="Dispensar">&times;</button>
  `;

  el.after(div);

  div.querySelector('.practice-card-dismiss').addEventListener('click', function () {
    div.style.display = 'none';
    localStorage.setItem('mr_dismiss_' + id, '1');
  });
});
