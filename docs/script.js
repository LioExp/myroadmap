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
    aiPrompt: "Quero aprender Linux para segurança ofensiva. Explica-me os 10 comandos mais importantes que um pentester deve saber no terminal, com exemplos práticos de cada um. Depois, sugere-me uma rotina de 7 dias para ganhar fluência em terminal Linux."
  },

  "Networking basics": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Sou iniciante em redes e quero entrar para segurança ofensiva. Explica-me como funciona uma comunicação TCP desde o clique no navegador até o site aparecer. Usa uma analogia simples e depois o modelo técnico."
  },

  "OSI model": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica o modelo OSI como se eu tivesse 12 anos. Depois, para cada camada, dá um exemplo de ataque de segurança que explora essa camada e uma ferramenta que podemos usar para o prevenir ou detetar."
  },

  "Protocolos & portas": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Ensina-me as 20 portas de rede mais importantes que um pentester deve saber de cor. Para cada porta: número, serviço, e o que um atacante pode fazer se a encontrar aberta. Cria uma tabela."
  },

  "Virtualização & VMs": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero montar um laboratório de hacking ético em casa. Dá-me o passo a passo completo: que software instalar, que máquinas vulneráveis baixar, como configurar as redes entre VMs. Assume que tenho 16GB de RAM."
  },

  "CIA triad & conceitos": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica a CIA Triad (Confidencialidade, Integridade, Disponibilidade) usando 3 cenários reais de cibersegurança. Depois, para cada pilar, diz que tipo de ataque o viola e que controlo o protege."
  },

  "Threats & attack vectors": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero aprender threat modeling para iniciantes. Explica o que é um threat actor, quais os tipos principais, e como usar o modelo STRIDE para classificar ameaças. Dá exemplos práticos de cada letra do STRIDE."
  },

  "Blue / Red / Purple teams": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica a diferença entre Red Team, Blue Team e Purple Team em segurança. Se eu sou um iniciante que gosta de quebrar coisas e perceber como funcionam, qual destes perfis se adequa mais? Dá-me um plano de 3 meses para começar."
  },

  "Cryptography basics": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica criptografia para um pentester iniciante. Preciso saber: o que é hash, encriptação simétrica e assimétrica, e como o TLS funciona. Usa exemplos práticos que um atacante exploraria."
  },

  "Nmap & Wireshark": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Dá-me um guia prático de nmap para iniciantes em segurança ofensiva. Quero saber: os 10 comandos mais importantes, o que cada flag faz, e como interpretar os resultados. Inclui exemplos de output."
  },

  "Burp Suite basics": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Sou iniciante em segurança web. Explica-me como usar o Burp Suite para interceptar e modificar pedidos HTTP. Dá-me um exemplo prático de como testar SQL Injection usando o Burp Repeater."
  },

  "Metasploit intro": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica o que é o Metasploit para um iniciante em pentesting. Dá-me o passo a passo de como usar msfconsole para explorar uma máquina vulnerável (Metasploitable 2), desde o scan até à shell."
  },

  "SIEM & logs": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica o que é um SIEM e como funciona para um iniciante em segurança. Quero montar um laboratório SIEM em casa — que ferramentas open source recomendas e como configurar para detetar ataques básicos?"
  },

  "TryHackMe / HackTheBox": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Sou iniciante em segurança ofensiva. Devo começar com TryHackMe ou HackTheBox? Dá-me um plano de 30 dias para passar de zero a conseguir resolver uma máquina fácil no HackTheBox."
  },

  "CTF challenges": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Nunca participei num CTF. Explica o que é, como funcionam as categorias de desafios (web, pwn, rev, crypto, forensics), e dá-me dicas para começar. Qual o melhor CTF para um iniciante completo?"
  },

  "OWASP Top 10": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Explica as 10 categorias do OWASP Top 10 para um iniciante. Para cada uma: o que é, como testar, e como prevenir. Dá exemplos de payloads para pelo menos 3 categorias (SQLi, XSS, SSRF)."
  },

  "Pen testing basics": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero aprender pentest do zero. Explica as 5 fases de um teste de penetração com exemplos práticos de cada uma. Que certificação recomendas para começar: eJPT ou OSCP? Qual a diferença de custo e dificuldade?"
  },

  "Python para automação": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero aprender Python focado em segurança ofensiva. Dá-me os 10 módulos Python mais importantes para pentest, com exemplos de código para cada um. Começa com sockets e requests."
  },

  "Bash scripting": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero aprender Bash scripting para segurança ofensiva. Dá-me 10 exemplos de scripts úteis para um pentester: desde enumeração automática até parsing de logs. Explica os conceitos-chave: pipes, redirecionamento, grep/awk/sed."
  },

  "Rust (em progresso)": {
    phase: "Fase 1 · Purple Team",
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
    aiPrompt: "Quero aprender Rust para segurança. Explica ownership e borrowing como se eu fosse um programador Python. Dá-me exemplos de porquê Rust é útil para ferramentas de segurança e um exemplo de um scanner de portas."
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

  modalBody.innerHTML = `
    <div class="modal-phase">${data.phase}</div>
    <div class="modal-title">${nodeLabel}</div>

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

// ── Clique nos nodes ──
document.querySelectorAll('.node-box:not(.locked-col .node-box)').forEach(el => {
  el.addEventListener('click', function () {
    const label = this.textContent.trim();
    if (NODE_DATA[label]) {
      openModal(label);
    }
  });
});

// ── Progresso da coluna 1 ──
const nodes1 = document.querySelectorAll('[data-col="1"]');
let done = 0, total = nodes1.length;

nodes1.forEach(n => {
  if (n.classList.contains('done')) done++;
  n.addEventListener('click', function (e) {
    if (this.classList.contains('current')) return;
    const wasDone = this.classList.contains('done');
    this.classList.toggle('done');
    done += wasDone ? -1 : 1;
    updateProgress();
  });
});

function updateProgress() {
  const pct = Math.round((done / total) * 100);
  document.getElementById('prog1').style.width = pct + '%';
  document.getElementById('lbl1').innerHTML = `<span>${done} / ${total}</span><span>${pct}%</span>`;
}

updateProgress();
