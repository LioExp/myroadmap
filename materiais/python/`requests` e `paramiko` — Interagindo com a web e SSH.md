---
tags: [linux-roadmap, python, security, http, ssh, requests, paramiko]
tipo: aula
status: consolidado
---

# `requests` e `paramiko` — Interagindo com a Web e SSH

## 1. Requisições HTTP com `requests`

Uma requisição HTTP é composta por: **verbo/método** (GET, POST, PUT, DELETE, e também HEAD e OPTIONS, menos comuns mas relevantes em reconhecimento), **URL**, **headers**, **body** (opcional) e **versão do protocolo**.

```python
import requests
r = requests.get("https://httpbin.org/get", timeout=(3, 10))
```

Principais atributos do objeto `Response`:

| Atributo | Uso |
|---|---|
| `r.status_code` | Código numérico de status |
| `r.text` | Corpo decodificado como texto |
| `r.json()` | Corpo decodificado como JSON (lança exceção se falhar) |
| `r.content` | Corpo em bytes brutos (binário) |
| `r.headers` | Dicionário de headers (case-insensitive) |
| `r.cookies` | Cookies definidos pelo servidor |
| `r.history` | Trilha de redirecionamentos seguidos |

`r.raise_for_status()` levanta `HTTPError` automaticamente se o status indicar erro (4xx/5xx).

Exceções principais (herdam de `requests.exceptions.RequestException`): `ConnectionError`, `HTTPError`, `Timeout`, `TooManyRedirects`.

**Boas práticas de segurança:**
- Sempre definir `timeout` explicitamente — o `requests` não tem timeout padrão, e sua ausência pode travar o script indefinidamente esperando um host sem resposta.
- Manter `verify=True` (padrão) em conexões HTTPS. Desativar (`verify=False`) remove a validação de certificado TLS e expõe a ataques man-in-the-middle; usar apenas em ambiente de laboratório controlado.
- Headers de resposta como `Server` e `X-Powered-By` frequentemente revelam a stack tecnológica do alvo, o que é relevante tanto para reconhecimento ofensivo quanto para hardening defensivo (evitar vazamento desnecessário de informação).

## 2. Autenticação e sessões

HTTP é um protocolo **stateless** — cada requisição é independente. Duas abordagens resolvem a necessidade de manter estado de autenticação:

**Session cookies:** o servidor mantém um registro de sessão e retorna um Session ID armazenado como cookie no cliente. Revogação é imediata (basta apagar o registro no servidor), mas escala mal em sistemas distribuídos de alto tráfego.

**JWT (JSON Web Token):** o servidor assina um token contendo claims (dados do usuário) e não mantém estado algum. O cliente envia o token no header `Authorization: Bearer <token>` a cada requisição. Escala melhor (ideal para microsserviços e SSO), mas a revogação antes da expiração é estruturalmente difícil, exigindo estratégias adicionais (tokens de curta duração + refresh, ou blacklist server-side).

```python
# Sessão com cookies persistentes
session = requests.Session()
session.post(url_login, data=credenciais)
session.get(url_protegida)

# Autenticação via JWT
token = requests.post(url_login, json=credenciais).json().get("token")
requests.get(url_protegida, headers={"Authorization": f"Bearer {token}"})
```

**Consideração de segurança:** o local de armazenamento do JWT no cliente é crítico. Tokens em `localStorage` são acessíveis via JavaScript, tornando-os vulneráveis a roubo via XSS. Cookies com flags `HttpOnly`, `Secure` e `SameSite=Strict` mitigam esse risco por não serem acessíveis a scripts do lado do cliente.

## 3. Paramiko — automação SSH

`paramiko` é uma implementação pura em Python do protocolo SSHv2, usada tanto para acesso direto de baixo nível quanto como base de bibliotecas de alto nível (como Fabric, recomendado para casos de uso comuns).

```python
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname="172.16.10.12", username="admin", password="cisco",
                look_for_keys=False, allow_agent=False)
```

**Ponto crítico de segurança — política de host key:** a host key é a identidade criptográfica do servidor SSH; sua verificação (comparando com `known_hosts`) protege contra ataques man-in-the-middle. `AutoAddPolicy()` aceita e salva silenciosamente qualquer chave nova, desabilitando essa proteção — aceitável em ambiente de laboratório isolado, mas inadequado para produção ou redes não confiáveis, onde `load_system_host_keys()` ou `RejectPolicy()` são preferíveis.

Autenticação por chave privada é preferível a senha sempre que viável, por não ser suscetível a força bruta prática:

```python
key = paramiko.RSAKey.from_private_key_file("/caminho/chave_privada")
client.connect(hostname="...", username="admin", pkey=key)
```

Tratamento de exceções (`paramiko.AuthenticationException`, falhas de conexão) em blocos `try/except` é essencial para automação resiliente, especialmente em loops que percorrem múltiplos hosts.

## 4. Execução remota de comandos

Existem dois modelos distintos de execução:

**`invoke_shell()`** — abre uma sessão de terminal interativa persistente. Requer `send()` para enviar o comando, uma pausa arbitrária (`time.sleep()`) para aguardar processamento, e `recv()` para ler o buffer. Adequado para dispositivos que operam por sessão contínua (equipamentos de rede como Cisco IOS).

**`exec_command()`** — executa um comando único e encerra, sem necessidade de temporização manual:

```python
stdin, stdout, stderr = client.exec_command("uptime")
saida = stdout.read().decode("utf-8", errors="replace")
erro = stderr.read().decode("utf-8", errors="replace")
codigo_saida = stdout.channel.recv_exit_status()
```

Vantagens sobre `invoke_shell()`: separação nativa entre `stdout` e `stderr`, e acesso ao código de saída (`recv_exit_status()`), permitindo verificação programática de sucesso/falha sem parsing de texto.

**Consideração de segurança — command injection:** ao montar comandos dinamicamente com dados externos (ex: `f"cat /var/log/{entrada}"`), a ausência de validação/sanitização permite que a entrada contenha comandos adicionais interpretados pelo shell remoto, resultando em execução arbitrária. Deve-se evitar concatenação direta de dados não confiáveis na string do comando.

Nota adicional: usar `decode("utf-8", errors="replace")` em vez de `decode("ascii")` evita falhas quando o output remoto contém caracteres fora do conjunto ASCII.

## 5. Tarefa — Mini Toolkit de Recon (HTTP + SSH)

Como exercício de consolidação, propõe-se a construção de uma ferramenta de reconhecimento que combine os dois módulos da aula em um projeto coeso e apresentável:

- **Módulo HTTP:** auditoria de security headers do alvo (`Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options`, entre outros), reportando headers ausentes e seu impacto.
- **Módulo SSH:** banner grabbing pré-autenticação via `paramiko.Transport`, capturando versão do SSH e algoritmos oferecidos pelo servidor sem necessidade de autenticação — técnica de reconhecimento passivo não coberta nos blocos anteriores.
- **Saída estruturada em JSON**, permitindo integração futura com outras ferramentas.
- **Interface de linha de comando** via `argparse`, recebendo alvo(s) por parâmetro ou arquivo.

Ambientes de teste sugeridos: `httpbin.org` para o módulo HTTP; container Debian local (com `openssh-server` ativo) para o módulo SSH.

## Divergências Arch Linux

Não há divergência conceitual — `requests` e `paramiko` são bibliotecas Python puras, com comportamento idêntico em qualquer distribuição. A única diferença está na instalação:

```bash
# Via pacman (recomendado para o sistema base)
sudo pacman -S python-requests python-paramiko

# Ou em ambiente virtual isolado (recomendado para scripts avulsos)
python -m venv venv && source venv/bin/activate
pip install requests paramiko
```

Arch adota gerenciamento de ambiente externo (PEP 668), o que restringe `pip install` direto no sistema — usar pacman ou venv evita conflitos.
