# 🛠️ Manual Técnico de Engenharia e Desenvolvimento
**Projeto:** WebJornal Acadêmico *Ecos Técnicos* (DS & Enfermagem)  
**Stack:** Vanilla JavaScript (ES6+), HTML5 Semântico, CSS3 Moderno (Custom Properties + Grid/Flexbox), JSON Datastore.  
**Padrão Arquitetural:** *Decoupled Static Jamstack (Data-Driven Client-Side Rendering)*.

---

## 📑 Sumário Técnico
1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Diagrama de Fluxo de Dados e Ciclo de Vida](#2-diagrama-de-fluxo-de-dados-e-ciclo-de-vida)
3. [Especificação Formal do Esquema de Dados (JSON Schema)](#3-especificação-formal-do-esquema-de-dados-json-schema)
4. [Engenharia do Data Layer (`js/data-service.js`)](#4-engenharia-do-data-layer-jsdata-servicejs)
5. [Controladores e Roteamento Baseado em Query Params](#5-controladores-e-roteamento-baseado-em-query-params)
6. [Engenharia do Painel Administrativo (`admin.html`)](#6-engenharia-do-painel-administrativo-adminhtml)
7. [Design System e Arquitetura CSS (`css/main.css`)](#7-design-system-e-arquitetura-css-cssmaincss)
8. [Segurança, Sanitização e Boas Práticas (XSS & CORS)](#8-segurança-sanitização-e-boas-práticas-xss--cors)
9. [Guia de Deploy, CI/CD e Pipeline GitHub Pages](#9-guia-de-deploy-cicd-e-pipeline-github-pages)

---

## 1. Visão Geral da Arquitetura

O projeto foi projetado como uma **Single-Directory Static Web Application (SPA-like Decoupled)**. Toda a persistência de estado e conteúdo reside em um documento JSON estático (`data/edicoes.json`), consumido assincronamente no *runtime* do navegador por meio da Fetch API.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              CLIENT-SIDE                               │
 │                                                                        │
 │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌─────────┐ │
 │   │  index.html  │   │ materia.html │   │ arquivo.html │   │ sobre...│ │
 │   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └─────────┘ │
 │          │                  │                  │                       │
 │   ┌──────▼───────┐   ┌──────▼───────┐   ┌──────▼───────┐               │
 │   │   home.js    │   │  materia.js  │   │  arquivo.js  │ (Controllers) │
 │   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘               │
 │          │                  │                  │                       │
 │          └──────────────────┼──────────────────┘                       │
 │                             ▼                                          │
 │                   ┌───────────────────┐                                │
 │                   │  data-service.js  │ (DAO / Cache Layer)            │
 │                   └─────────┬─────────┘                                │
 └─────────────────────────────┼──────────────────────────────────────────┘
                               │ Fetch Assíncrono (GET)
                               ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      STATIC FILE STORAGE / CDN                         │
 │                                                                        │
 │                       ┌───────────────────┐                            │
 │                       │ data/edicoes.json │ (Single Source of Truth)   │
 │                       └───────────────────┘                            │
 └────────────────────────────────────────────────────────────────────────┘
```

### Decisões Arquiteturais:
* **Zero Backend Overhead:** Não requer runtime Node.js, PHP ou Python no servidor. Pode ser hospedado em qualquer CDN/Object Storage (GitHub Pages, Vercel, Netlify, AWS S3).
* **Separação de Preocupações (SoC):** Camada de dados (`data/`), camada de acesso (`DataService`), camada de apresentação/estilo (`css/`) e controladores de visão (`js/`).
* **Zero Dependências Externas (Build-less):** Sem Webpack, Vite ou Babel. O código utiliza JavaScript ES6+ nativo compatível com todos os navegadores modernos.

---

## 2. Diagrama de Fluxo de Dados e Ciclo de Vida

### Ciclo de Requisição e Renderização da Capa (`index.html` + `home.js`):

```text
[Browser Navigation] ──► Carrega index.html (DOM Ready)
                               │
                               ▼
                    [home.js: DOMContentLoaded]
                               │
                               ▼
                    [Extrair ?edicao= da URL]
                               │
                               ▼
                   [Chamar DataService.obterDados()]
                               │
                ┌──────────────┴──────────────┐
                │ Cache existe em memória?   │
                └──────────────┬──────────────┘
                       SIM ◄───┴───► NÃO
                        │              │
                        │              ▼
                        │     [fetch('./data/edicoes.json')]
                        │              │
                        │     [Armazenar em _cache]
                        │              │
                        ▼ ◄────────────┘
            [Localizar Edição Alvo]
            (Por parâmetro URL ou edicaoAtual)
                               │
                               ▼
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
[renderizarDestaque]   [renderizarCursos]    [renderizarEnquete]
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                 [DOM Atualizado / Paint]
```

---

## 3. Especificação Formal do Esquema de Dados (JSON Schema)

Abaixo está a interface de tipagem em **TypeScript** que define o contrato de dados rigoroso esperado pelo `DataService`:

```typescript
export interface WebJornalDatabase {
  edicaoAtual: string; // Ex: "2026-12" (Chave estrangeira para edicoes[n].id)
  edicoes: Edicao[];
}

export interface Edicao {
  id: string;          // Formato: "YYYY-NN" (ex: "2026-12")
  numero: number;      // Inteiro sequencial
  ano: number;         // Inteiro (ex: 2026)
  data: string;        // String legível (ex: "31 de agosto de 2026")
  tema: string;        // Título/Tema central da edição
  destaquePrincipal: Materia;
  materiaDS: Materia;
  materiaEnfermagem: Materia;
  enquete: Enquete;
}

export interface Materia {
  id: string;          // Slug único (ex: "hackathon-saude-2026")
  categoria: string;   // "Integração DS + Enfermagem" | "Desenvolvimento de Sistemas" | "Enfermagem"
  titulo: string;
  resumo: string;
  imagem: string;      // URL absoluta ou caminho relativo ('assets/img/...')
  autor: string;
  tempoLeitura: string;// Ex: "4 min"
  conteudo: string;    // Markup HTML sanitizado (<p>, <h2>, <strong>, etc.)
}

export interface Enquete {
  pergunta: string;
  opcoes: string[];    // Array de strings com as opções de voto
  linkVotacao: string; // URL do formulário (Google Forms, MS Forms)
  qrCodeImg: string;   // URL da API de geração de QR Code
}
```

---

## 4. Engenharia do Data Layer (`js/data-service.js`)

O `DataService` implementa o padrão de projeto **Singleton / Data Access Object (DAO)** com controle de cache em memória:

```javascript
/**
 * js/data-service.js
 * Data Access Object (DAO) com suporte a memoization
 */
const DataService = {
  _cache: null,

  /**
   * Realiza a requisição do arquivo JSON caso não esteja em cache.
   * @returns {Promise<WebJornalDatabase>}
   */
  async obterDados() {
    if (this._cache) {
      return this._cache;
    }

    try {
      // Uso de caminho relativo estrito './data/edicoes.json' para evitar quebras em subdiretórios
      const resposta = await fetch('./data/edicoes.json', {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-cache' // Garante dados frescos em ambiente de desenvolvimento
      });

      if (!resposta.ok) {
        throw new Error(`[HTTP ${resposta.status}] Falha ao requisitar data/edicoes.json`);
      }

      this._cache = await resposta.json();
      return this._cache;
    } catch (erro) {
      console.error('[DataService.obterDados] Erro crítico:', erro);
      throw erro;
    }
  },

  /**
   * Retorna a edição ativa configurada em 'edicaoAtual'
   */
  async obterEdicaoAtual() {
    const dados = await this.obterDados();
    return dados.edicoes.find(e => e.id === dados.edicaoAtual) || dados.edicoes[0];
  },

  /**
   * Busca binária/linear de matéria por Slug em todas as edições históricas
   * Complexidade: O(E), onde E é o número total de matérias cadastradas.
   */
  async obterMateriaPorId(idMateria) {
    const dados = await this.obterDados();
    for (const edicao of dados.edicoes) {
      if (edicao.destaquePrincipal?.id === idMateria) {
        return { materia: edicao.destaquePrincipal, edicao };
      }
      if (edicao.materiaDS?.id === idMateria) {
        return { materia: edicao.materiaDS, edicao };
      }
      if (edicao.materiaEnfermagem?.id === idMateria) {
        return { materia: edicao.materiaEnfermagem, edicao };
      }
    }
    return null;
  },

  async obterTodasEdicoes() {
    const dados = await this.obterDados();
    return dados.edicoes;
  }
};
```

---

## 5. Controladores e Roteamento Baseado em Query Params

A aplicação não utiliza rotas com hash (`#`) para carregar páginas inteiras, mas sim **Query Parameters padrão (`URLSearchParams`)**, permitindo indexação limpa (SEO) e compartilhamento direto de links.

### 5.1. Roteamento da Capa e Capas Históricas (`js/home.js`)
* **Endpoint:** `index.html` (Renderiza `edicaoAtual`).
* **Endpoint Histórico:** `index.html?edicao={YYYY-NN}` (Renderiza a edição do ID passado).

```javascript
// Trecho de decisão de rota em js/home.js:
const urlParams = new URLSearchParams(window.location.search);
const idEdicaoSolicitada = urlParams.get('edicao');

let edicao;
if (idEdicaoSolicitada) {
  edicao = dados.edicoes.find(e => e.id === idEdicaoSolicitada);
}

if (!edicao) {
  edicao = dados.edicoes.find(e => e.id === dados.edicaoAtual) || dados.edicoes[0];
}
```

### 5.2. Roteamento do Leitor Universal (`js/materia.js`)
* **Endpoint:** `materia.html?id={slug-da-materia}`.
* O script intercepta o parâmetro `id`, faz a busca transversal nas edições e altera dinamicamente o `<title>` do documento para otimização de acessibilidade e histórico do navegador.

---

## 6. Engenharia do Painel Administrativo (`admin.html`)

O `admin.html` foi construído como um **módulo monolítico autônomo (Single-File CMS)**, contendo lógica completa para manipulação de arquivos, strings e estado.

```text
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                       admin.html (Arquitetura)                          │
 ├─────────────────────────────────────────────────────────────────────────┤
 │  [Estado em Memória]                                                    │
 │  let bancoDados = { edicaoAtual: "2026-12", edicoes: [...] }            │
 │  let indiceEdicaoSelecionada = 0;                                       │
 ├─────────────────────────────────────────────────────────────────────────┤
 │  [Core Engines]                                                         │
 │                                                                         │
 │  1. File Engine:                                                        │
 │     • Import: FileReader API ──► JSON.parse ──► State Mutation          │
 │     • Export: State ──► JSON.stringify ──► Blob (MIME application/json) │
 │               ──► URL.createObjectURL ──► <a download> click trigger   │
 │                                                                         │
 │  2. Sanitization Engine (Slugify):                                      │
 │     • String Normalization (NFD) ──► Regex Strip Accents ([\\u0300...]) │
 │     • Alphanumeric Filter ──► Hyphen Replacement                        │
 │                                                                         │
 │  3. Markup Injection Engine:                                            │
 │     • Textarea selectionStart / selectionEnd cursor wrapping            │
 └─────────────────────────────────────────────────────────────────────────┘
```

### Algoritmo de Geração de Slugs (`gerarSlug`):
Elimina diacríticos da língua portuguesa e formata para o padrão RFC 3986:

```javascript
function gerarSlug(idOrigem, idDestino) {
  const texto = document.getElementById(idOrigem).value;
  const ano = document.getElementById('ed_ano').value || '2026';
  
  const slug = texto
    .normalize("NFD")                         // Decompõe caracteres acentuados (ex: 'ã' -> 'a' + '~')
    .replace(/[\u0300-\u036f]/g, "")         // Remove os caracteres diacríticos
    .toLowerCase()                           // Converte para minúsculas
    .replace(/[^a-z0-9\s-]/g, '')            // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-')                    // Converte espaços em hifens
    .replace(/-+/g, '-');                    // Remove hifens duplicados

  document.getElementById(idDestino).value = slug ? `${slug}-${ano}` : '';
}
```

---

## 7. Design System e Arquitetura CSS (`css/main.css`)

O CSS foi estruturado utilizando **Design Tokens nativos (CSS Custom Properties)** para facilitar a manutenção da identidade visual de ambos os cursos:

```css
:root {
  /* Tokens de Domínio */
  --cor-ds: #4338ca;            /* Índigo 700 - Área de Tecnologia */
  --cor-ds-suave: #e0e7ff;      /* Índigo 100 */
  --cor-enf: #059669;           /* Esmeralda 600 - Área de Saúde */
  --cor-enf-suave: #d1fae5;     /* Esmeralda 100 */
  --cor-destaque: #c2410c;      /* Laranja 700 - Manchetes */
  --cor-destaque-suave: #ffedd5;/* Laranja 100 */
  
  /* Tokens Estruturais */
  --fundo-pagina: #f8fafc;
  --fundo-card: #ffffff;
  --texto-principal: #0f172a;
  --borda: #e2e8f0;
  
  /* Tipografia */
  --fonte-principal: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --fonte-titulo: Georgia, Cambria, serif;
}
```

### Breakpoints Responsivos:
* **Desktop Wide:** Max container `1140px` com `grid-template-columns: 1fr 1fr`.
* **Tablet / Mobile (`@media (max-width: 900px)`):** Colapso automático de todas as matrizes bidimensionais para colunas unitárias (`grid-template-columns: 1fr`).

---

## 8. Segurança, Sanitização e Boas Práticas (XSS & CORS)

### 8.1. Prevenção de Cross-Site Scripting (XSS)
O campo `conteudo` de cada matéria permite injeção de HTML no DOM (`element.innerHTML = materia.conteudo`).
* **Ambiente Controlado:** O arquivo `edicoes.json` é estático e auditado no repositório Git. Não há envio aberto de usuários não autenticados direto para a página.
* **Validação no `admin.html`:** O painel encapsula o conteúdo em tags estruturadas (`<p>`, `<h2>`, `<strong>`).

### 8.2. Isolamento de Origem e CORS
Quando servido localmente via `file:///`, navegadores baseados em Chromium bloqueiam requisições assíncronas (`fetch()`).  
**Requisito de Runtime Local:** Utilização obrigatória de um servidor HTTP local:
```bash
# Opção 1: VS Code Live Server Extension (Porta 5500)
# Opção 2: Python HTTP Server (Nativo)
python3 -m http.server 8000

# Opção 3: Node.js http-server
npx http-server .
```

---

## 9. Guia de Deploy, CI/CD e Pipeline GitHub Pages

### 9.1. Estrutura de Branches Recomendada
* **`main`:** Código estável em produção (ligado ao deploy do GitHub Pages).
* **`redacao` ou `draft`:** Branch onde os alunos e professores comitam as novas edições antes do merge.

### 9.2. Pipeline de Integração Contínua (GitHub Actions)
Crie o arquivo `.github/workflows/valida-json.yml` para validar automaticamente a sintaxe do JSON a cada *Pull Request* ou *Push*:

```yaml
name: Validação de Integridade do WebJornal

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate-json:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout do Repositório
        uses: actions/checkout@v4

      - name: Validar Sintaxe de data/edicoes.json
        run: |
          python3 -c "import json; json.load(open('data/edicoes.json'))"
          echo "✓ data/edicoes.json é um JSON válido!"

      - name: Verificar Integridade das Chaves Principais
        run: |
          node -e "
            const db = require('./data/edicoes.json');
            if (!db.edicaoAtual) throw new Error('Campo edicaoAtual ausente!');
            if (!Array.isArray(db.edicoes) || db.edicoes.length === 0) throw new Error('Array edicoes vazio ou inválido!');
            const ativa = db.edicoes.find(e => e.id === db.edicaoAtual);
            if (!ativa) throw new Error('A edicaoAtual [' + db.edicaoAtual + '] não existe no array de edições!');
            console.log('✓ Integridade do banco de dados validada com sucesso!');
          "
```

### 9.3. Configuração do GitHub Pages
1. Acesse o repositório no GitHub: **Settings > Pages**.
2. Em **Build and deployment > Source**, selecione: `Deploy from a branch`.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Clique em **Save**. O jornal estará online sob o domínio `https://seu-usuario.github.io/jornal-escolar/`.