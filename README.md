<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jornal Escolar · DS & Enfermagem</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <!-- AVISO DE RESPONSABILIDADE LEGAL -->
  <aside class="tarja-responsabilidade">
    <div class="container tarja-flex">
      <div class="tarja-texto">
        <i class="fas fa-shield-alt"></i>
        <span><strong>Órgão Informativo Acadêmico:</strong> Publicação educativa. É vedado conteúdo difamatório, ofensivo ou anônimo.</span>
      </div>
      <a href="sobre.html#politica" class="tarja-link">Política Editorial & Lei 12.965/14</a>
    </div>
  </aside>

  <!-- CABEÇALHO -->
  <header class="header-principal">
    <div class="container header-grid">
      <div class="header-marca">
        <span class="subtitulo-topo">Informativo Semanal Integrado</span>
        <h1 class="titulo-jornal"><a href="index.html">ECOS TÉCNICOS</a></h1>
        <p class="cursos-badge">Desenvolvimento de Sistemas &bull; Enfermagem</p>
      </div>
      <div class="header-edicao-box" id="edicaoInfo">
        <span class="loading-text"><i class="fas fa-spinner fa-spin"></i> Carregando edição...</span>
      </div>
    </div>
    <nav class="nav-principal">
      <div class="container">
        <ul class="nav-links">
          <li><a href="index.html" class="active"><i class="fas fa-newspaper"></i> Capa da Semana</a></li>
          <li><a href="arquivo.html"><i class="fas fa-archive"></i> Edições Anteriores</a></li>
          <li><a href="#enquete-secao"><i class="fas fa-poll"></i> Enquete</a></li>
          <li><a href="#sugestoes-secao"><i class="fas fa-paper-plane"></i> Sugestões</a></li>
          <li><a href="sobre.html"><i class="fas fa-info-circle"></i> Equipe & Diretrizes</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <main class="container secao-principal">
    
    <!-- CONTAINER DINÂMICO PARA AVISO DE EDIÇÃO HISTÓRICA -->
    <div id="containerAvisoEdicaoAntiga"></div>

    <!-- 1. NOTÍCIA PRINCIPAL / MANCHETE -->
    <section class="bloco-destaque" id="blocoDestaque">
      <div class="loading-box"><i class="fas fa-spinner fa-spin"></i> Carregando manchete...</div>
    </section>

    <div class="divisor-secao">
      <h2><i class="fas fa-layer-group"></i> Matérias por Especialidade</h2>
      <div class="linha-decorativa"></div>
    </div>

    <!-- 2. GRID DS & ENFERMAGEM -->
    <section class="grid-cursos">
      <article class="card-materia card-ds" id="blocoDS"></article>
      <article class="card-materia card-enf" id="blocoEnfermagem"></article>
    </section>

    <!-- 3. ENQUETE E GOOGLE FORMS INCORPORADO -->
    <section class="grid-interativo">
      
      <!-- ENQUETE DA EDIÇÃO -->
      <div class="card-painel" id="enquete-secao">
        <div class="painel-cabecalho cabecalho-roxo">
          <h3><i class="fas fa-vote-yea"></i> Enquete da Semana</h3>
          <span class="badge-mini">Participe</span>
        </div>
        <div class="painel-corpo" id="blocoEnquete"></div>
      </div>

      <!-- SUGESTÕES & PAUTAS COM GOOGLE FORMS EMBUTIDO -->
      <div class="card-painel" id="sugestoes-secao">
        <div class="painel-cabecalho cabecalho-verde">
          <h3><i class="fas fa-comment-dots"></i> Sugestões & Pautas</h3>
          <span class="badge-mini">Google Forms</span>
        </div>
        <div class="painel-corpo" style="padding: 8px;">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSeWxQU27HGbM5r7cddYvsm-2FgpFhxILelXdVjbxHPFJOaKVw/viewform?embedded=true" 
            width="100%" 
            height="500" 
            frameborder="0" 
            marginheight="0" 
            marginwidth="0"
            style="border: none; border-radius: 6px; background: #ffffff;">
            Carregando formulário de sugestões...
          </iframe>
        </div>
      </div>

    </section>

  </main>

  <footer class="footer-principal">
    <div class="container footer-grid">
      <div class="footer-coluna">
        <h4>ECOS TÉCNICOS</h4>
        <p>Jornal pedagógico digital gerido colaborativamente pelos cursos de DS e Enfermagem.</p>
      </div>
      <div class="footer-coluna">
        <h4>Links</h4>
        <ul>
          <li><a href="index.html">Capa da Semana</a></li>
          <li><a href="arquivo.html">Edições Publicadas</a></li>
          <li><a href="sobre.html#politica">Política Editorial</a></li>
        </ul>
      </div>
      <div class="footer-coluna">
        <h4>Supervisão</h4>
        <p><i class="fas fa-chalkboard-teacher"></i> Coordenação Técnica Integrada</p>
        <p><i class="fas fa-envelope"></i> redacao.jornal@escola.edu.br</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Jornal Ecos Técnicos &bull; Todos os direitos reservados para fins didáticos.</p>
    </div>
  </footer>

  <script src="js/data-service.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
