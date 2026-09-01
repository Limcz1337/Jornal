# 📖 Manual Operacional e Didático do WebJornal Escolar
**Projeto Integrado: Desenvolvimento de Sistemas & Enfermagem**  
*Documento Orientador para Redação, Equipe Técnica e Supervisão Pedagógica.*

---

## 📑 Sumário
1. [Visão Geral do Projeto e Arquitetura](#1-visão-geral-do-projeto-e-arquitetura)
2. [Estrutura Completa de Arquivos](#2-estrutura-completa-de-arquivos)
3. [Divisão de Papéis e Fluxo Semanal de Trabalho](#3-divisão-de-papéis-e-fluxo-semanal-de-trabalho)
4. [Passo a Passo: Usando o Painel Administrativo (`admin.html`)](#4-passo-a-passo-usando-o-painel-administrativo-adminhtml)
5. [Como Funciona a Navegação Histórica e Leitura Completa](#5-como-funciona-a-navegação-histórica-e-leitura-completa)
6. [Configuração do Google Forms de Sugestões](#6-configuração-do-google-forms-de-sugestões)
7. [Política de Backups e Recuperação de Dados](#7-política-de-backups-e-recuperação-de-dados)
8. [Resolução de Problemas Comuns (Troubleshooting)](#8-resolução-de-problemas-comuns-troubleshooting)
9. [Diretrizes de Ética, LGPD e Responsabilidade Legal](#9-diretrizes-de-ética-lgpd-e-responsabilidade-legal)

---

## 1. Visão Geral do Projeto e Arquitetura

O **Ecos Técnicos** é um jornal web construído no modelo **Data-Driven (Orientado a Dados)**. Em vez de criar e hospedar dezenas de arquivos HTML manuais a cada semana, o site utiliza templates dinâmicos que leem o arquivo central `data/edicoes.json`.

```text
                                  ┌────────────────────────┐
                                  │   Painel de Controle   │
                                  │      (admin.html)      │
                                  └───────────┬────────────┘
                                              │ Exporta
                                              ▼
                                  ┌────────────────────────┐
                                  │   data/edicoes.json    │
                                  │   (Banco de Dados)     │
                                  └───────────┬────────────┘
                                              │ Consumido por
                         ┌────────────────────┼────────────────────┐
                         ▼                    ▼                    ▼
                ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
                │   index.html    │  │  materia.html   │  │  arquivo.html   │
                │  (Capa Atual /  │  │(Leitor Universal│  │ (Catálogo Geral │
                │ Capas Antigas)  │  │   por ID/Slug)  │  │  das Edições)   │
                └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Principais Benefícios da Estrutura:
* **Escalabilidade Semanal:** Publicar uma edição não exige mexer no código HTML/CSS das páginas públicas.
* **Leitura Flexível:** Permite ler qualquer artigo na íntegra ou visualizar a capa completa de semanas anteriores.
* **Segurança e Simplicidade:** O painel `admin.html` impede erros de sintaxe no JSON (como vírgulas faltantes).

---

## 2. Estrutura Completa de Arquivos

Certifique-se de que sua pasta de trabalho contenha exatamente esta estrutura:

```text
jornal-escolar/
├── index.html              # Capa da edição vigente ou de capas históricas
├── materia.html            # Template do leitor universal de notícias
├── arquivo.html            # Repositório de edições anteriores
├── sobre.html              # Página institucional, ética e equipe
├── admin.html              # Painel visual para criar/editar edições
├── data/
│   └── edicoes.json        # Banco de dados com o histórico de edições
├── css/
│   └── main.css            # Folha de estilos unificada e responsiva
└── js/
    ├── data-service.js     # Camada de busca e cache de dados (Fetch API)
    ├── home.js             # Lógica da Capa e detecção de ?edicao=ID
    ├── materia.js          # Lógica do Leitor Universal (?id=slug)
    └── arquivo.js          # Lógica da listagem do acervo histórico
```

---

## 3. Divisão de Papéis e Fluxo Semanal de Trabalho

Para garantir uma rotina organizada e pedagógica, o trabalho é distribuído entre os cursos:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CRONOGRAMA SEMANAL                                   │
├───────────────────┬───────────────────────────────────┬────────────────────────────────┤
│      PERÍODO      │         EQUIPE ENFERMAGEM         │           EQUIPE DS            │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Segunda a Quarta  │ • Redige matéria de saúde e pauta │ • Redige matéria de tecnologia │
│                   │ • Revisa termos técnicos clínicos │ • Seleciona/otimiza imagens    │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Quinta-feira      │ • Elabora a enquete da semana     │ • Insere dados no admin.html   │
│                   │ • Checa anonimização LGPD         │ • Gera os slugs e QR Codes     │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Sexta-feira       │ • Validação final com os professores orientadores de ambas as áreas│
│                   │ • Exportação do edicoes.json e publicação no servidor / GitHub     │
└───────────────────┴────────────────────────────────────────────────────────────────────┘
```

---

## 4. Passo a Passo: Usando o Painel Administrativo (`admin.html`)

O `admin.html` elimina a necessidade de editar código manualmente. Siga os passos abaixo para publicar uma nova edição semanal:

### 4.1. Abrir o Painel
1. No VS Code, clique com o botão direito no projeto e selecione **"Open with Live Server"**.
2. No navegador, acesse: `http://127.0.0.1:5500/admin.html`.

### 4.2. Criar a Nova Edição
1. Clique no botão azul **"Nova Edição (Clonar Base)"** no topo.
2. O sistema criará uma nova edição incrementando automaticamente o número (ex: Edição #13) e colocará a edição no topo da lista.

### 4.3. Preencher os Campos do Formulário

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1. INFORMAÇÕES GERAIS                                                           │
│    • Número: 13       Ano: 2026                                                 │
│    • Data por Extenso: 07 de setembro de 2026                                   │
│    • Tema da Edição: Simulação Clínica e Saúde Digital                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 2. NOTÍCIA DE DESTAQUE (Principal)                                              │
│    • Título: [Digite o título da matéria principal]                             │
│    • Slug URL: [Gerado automaticamente ao digitar o título]                     │
│    • Autor: [Nome do Aluno / Redação]                                           │
│    • Resumo: [Texto de 2 a 3 linhas para a capa]                                │
│    • Conteúdo: [Use os botões <p>, <h2>, <strong> para estruturar o texto]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 3. MATÉRIAS ESPECÍFICAS (DS e Enfermagem)                                       │
│    • Preencha título, autor, resumo, imagem e conteúdo para cada curso          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 4. ENQUETE E QR CODE                                                            │
│    • Pergunta: [Qual tema você prefere?]                                        │
│    • Opções: [Adicione ou remova opções de voto]                                │
│    • Link: [Cole a URL do Google Forms — o QR Code atualiza na hora]            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.4. Definir como Capa Vigente
Clique no botão verde **"Definir como Capa Vigente"**. Uma estrela (★) indicará que essa edição será exibida na página principal (`index.html`).

### 4.5. Exportar e Publicar
1. Clique em **"Guardar Alterações desta Edição"** no final da página.
2. Clique no botão verde superior **"Exportar edicoes.json"**.
3. O arquivo `edicoes.json` será baixado pelo navegador.
4. Mova o arquivo baixado para a pasta **`data/`** do seu projeto (substituindo o arquivo antigo).
5. Pronto! Todas as páginas (`index.html`, `materia.html` e `arquivo.html`) estarão atualizadas.

---

## 5. Como Funciona a Navegação Histórica e Leitura Completa

O leitor tem à disposição duas formas distintas de explorar o conteúdo antigo:

```text
Ação do Leitor:
 ├── Clicar no TÍTULO de uma matéria no Arquivo ──► Abre materia.html?id=slug-da-materia
 │                                                 (Lê o artigo completo com todas as seções)
 │
 └── Clicar em "VER CAPA COMPLETA" no Arquivo ────► Abre index.html?edicao=2026-11
                                                   (Abre a capa daquela semana com banner histórico)
```

### 5.1. Leitura Completa de Notícias (`materia.html?id=slug`)
* Cada matéria cadastrada possui um **Slug Único** (ex: `hackathon-saude-digital-2026`).
* Ao acessar `materia.html?id=hackathon-saude-digital-2026`, o arquivo `js/materia.js` busca a notícia em qualquer edição do banco e renderiza:
  * Categoria colorida (Roxo para DS, Verde para Enfermagem, Laranja para Destaque).
  * Título, subtítulo, autor, data e tempo de leitura.
  * Imagem de capa em alta definição.
  * Corpo completo da notícia com parágrafos, subtítulos e citações.
  * Nota de responsabilidade acadêmica e botões para voltar à capa ou ao arquivo.

### 5.2. Capa Histórica da Semana (`index.html?edicao=ID`)
* Ao clicar em *"Ver Capa Completa"* em qualquer edição de `arquivo.html`, a capa original daquela semana é carregada com a manchete, as matérias e a enquete daquela data.
* Uma tarja amarela no topo avisa:  
  `Você está visualizando o arquivo histórico da Edição #11 (24 de agosto de 2026). [Retornar à Edição Vigente →]`

---

## 6. Configuração do Google Forms de Sugestões

O formulário de sugestões na capa está configurado via `<iframe>` do Google Forms, garantindo que todas as mensagens caiam em uma planilha do Google Sheets sem necessidade de servidores de e-mail.

### 6.1. Como Obter o Link de Incorporação:
1. Crie seu formulário no [Google Forms](https://forms.google.com).
2. Clique no botão **"Enviar"** (canto superior direito).
3. Selecione a aba com o ícone de código **`< >` (Incorporar HTML)**.
4. Copie a URL que fica dentro do atributo `src="..."`.
5. Abra o `index.html` e cole essa URL no `src` da tag `<iframe>` dentro da seção `#sugestoes-secao`.

### 6.2. Ativar Notificações por E-mail:
1. No editor do formulário do Google Forms, clique na aba **Respostas**.
2. Clique no ícone de três pontinhos (`⋮`).
3. Marque a opção: **"Receber notificações por e-mail para novas respostas"**.

---

## 7. Política de Backups e Recuperação de Dados

Para evitar perdas acidentais de edições ao longo do ano letivo:

### 7.1. Gerando um Backup de Segurança:
1. No `admin.html`, clique no botão laranja **"Baixar Backup Datado"**.
2. O sistema gerará um arquivo nomeado com a data do dia (ex: `backup-edicoes-2026-09-07.json`).
3. Guarde esse arquivo no Google Drive da turma ou em uma pasta `backups/`.

### 7.2. Restaurando um Backup:
1. Se o arquivo `edicoes.json` for corrompido ou apagado por engano, abra o `admin.html`.
2. Clique no botão cinza **"Importar JSON"**.
3. Selecione o arquivo de backup mais recente.
4. Clique em **"Exportar edicoes.json"** e salve novamente na pasta `data/`.

---

## 8. Resolução de Problemas Comuns (Troubleshooting)

| Sintoma | Causa Mais Provável | Solução Passo a Passo |
| :--- | :--- | :--- |
| **Página com aviso de erro ao carregar dados** | O arquivo `data/edicoes.json` não existe ou está com formato inválido. | Abra o `admin.html`, importe seu último backup e clique em "Exportar edicoes.json" para regravar o arquivo limpo. |
| **Ao clicar em uma matéria, aparece "Matéria não encontrada"** | O `id` (slug) no link difere do `id` cadastrado na matéria. | No `admin.html`, certifique-se de que os slugs não contenham caracteres especiais, acentos ou espaços. |
| **As imagens aparecem com ícone quebrado** | O link da imagem expirou ou requer login para visualização. | Use links diretos (terminados em `.jpg`, `.png`, `.webp`) ou hospede as fotos no repositório do projeto em `assets/img/`. |
| **A Capa não muda após publicar nova edição** | O navegador guardou o cache antigo ou a edição não foi marcada como ativa. | 1. Pressione `Ctrl + F5` para limpar o cache.<br>2. No `admin.html`, confirme se clicou em *"Definir como Capa Vigente"* antes de exportar. |

---

## 9. Diretrizes de Ética, LGPD e Responsabilidade Legal

Todo o corpo discente e docente que participa da publicação deve estar ciente das regras legais brasileiras:

1. **Marco Civil da Internet (Lei nº 12.965/2014) [2]:**
   * É expressamente vedado o anonimato e a publicação de ofensas, insinuações difamatórias, calúnias ou preconceito de qualquer natureza [2, 3].
   * Todas as matérias devem ter autores claramente identificados (alunos, professores ou comitê editorial) [2].

2. **Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018):**
   * Em relatos de casos clínicos ou simulações de prontuário, utilize exclusivamente **nomes fictícios e dados desidentificados** [4, 5].
   * Fotos de alunos ou pacientes em atividades práticas exigem autorização formal prévia [6].

3. **Dupla Validação Pedagógica:**
   * Nenhuma edição deve ser exportada sem a validação simultânea de:
     * **1 Professor de Enfermagem:** Rigor científico, protocolos de saúde e anonimização [5, 7].
     * **1 Professor de DS:** Integridade do código, formatação dos dados e acessibilidade digital [8].