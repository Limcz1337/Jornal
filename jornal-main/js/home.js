/**
 * js/home.js - Controlador da Capa Principal e Capas Históricas
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const dados = await DataService.obterDados();
    
    // 1. Verifica se uma edição específica foi solicitada pela URL (ex: index.html?edicao=2026-11)
    const urlParams = new URLSearchParams(window.location.search);
    const idEdicaoSolicitada = urlParams.get('edicao');

    let edicao;
    if (idEdicaoSolicitada) {
      edicao = dados.edicoes.find(e => e.id === idEdicaoSolicitada);
    }

    // Se não informou na URL ou não encontrou, carrega a edição definida como atual
    if (!edicao) {
      edicao = dados.edicoes.find(e => e.id === dados.edicaoAtual) || dados.edicoes[0];
    }

    // 2. Se for a visualização de uma edição passada, exibe a tarja de aviso histórico
    const containerAviso = document.getElementById('containerAvisoEdicaoAntiga');
    if (containerAviso && edicao.id !== dados.edicaoAtual) {
      containerAviso.innerHTML = `
        <div class="tarja-responsabilidade" style="background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; border-radius: var(--raio); margin-bottom: 24px; padding: 12px 16px;">
          <div class="tarja-flex">
            <span><i class="fas fa-history"></i> Você está visualizando o arquivo histórico da <strong>Edição #${edicao.numero} (${edicao.data})</strong>.</span>
            <a href="index.html" class="tarja-link" style="color: #92400e; font-weight: bold;">Retornar à Edição Vigente &rarr;</a>
          </div>
        </div>
      `;
    }

    // 3. Atualizar Cabeçalho
    const elInfo = document.getElementById('edicaoInfo');
    if (elInfo) {
      elInfo.innerHTML = `
        <span class="badge-edicao">Edição #${edicao.numero} &bull; ${edicao.ano}</span>
        <span class="data-edicao"><i class="far fa-calendar-alt"></i> ${edicao.data}</span>
      `;
    }

    // 4. Manchete de Destaque
    const elDestaque = document.getElementById('blocoDestaque');
    const dest = edicao.destaquePrincipal;
    if (elDestaque && dest) {
      elDestaque.innerHTML = `
        <div class="destaque-card">
          <a href="materia.html?id=${dest.id}" class="destaque-imagem-link">
            <img src="${dest.imagem}" alt="${dest.titulo}" class="destaque-img">
          </a>
          <div class="destaque-conteudo">
            <span class="tag-cat tag-destaque">${dest.categoria}</span>
            <h2 class="destaque-titulo">
              <a href="materia.html?id=${dest.id}">${dest.titulo}</a>
            </h2>
            <p class="destaque-resumo">${dest.resumo}</p>
            <div class="destaque-meta">
              <span><i class="far fa-user"></i> ${dest.autor}</span> &bull; 
              <span><i class="far fa-clock"></i> ${dest.tempoLeitura}</span>
            </div>
            <a href="materia.html?id=${dest.id}" class="btn-acao btn-destaque">
              Ler Matéria Completa <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
    }

    // 5. Matéria de Desenvolvimento de Sistemas
    const elDS = document.getElementById('blocoDS');
    const ds = edicao.materiaDS;
    if (elDS && ds) {
      elDS.innerHTML = `
        <span class="tag-cat tag-ds">${ds.categoria}</span>
        <div class="materia-img-box">
          <img src="${ds.imagem}" alt="${ds.titulo}">
        </div>
        <h3 class="materia-card-titulo">
          <a href="materia.html?id=${ds.id}">${ds.titulo}</a>
        </h3>
        <p class="materia-card-resumo">${ds.resumo}</p>
        <div class="materia-card-meta">
          <span><i class="far fa-user"></i> ${ds.autor}</span>
          <span><i class="far fa-clock"></i> ${ds.tempoLeitura}</span>
        </div>
        <a href="materia.html?id=${ds.id}" class="link-ler-mais">
          Acessar notícia de DS <i class="fas fa-arrow-right"></i>
        </a>
      `;
    }

    // 6. Matéria de Enfermagem
    const elEnf = document.getElementById('blocoEnfermagem');
    const enf = edicao.materiaEnfermagem;
    if (elEnf && enf) {
      elEnf.innerHTML = `
        <span class="tag-cat tag-enf">${enf.categoria}</span>
        <div class="materia-img-box">
          <img src="${enf.imagem}" alt="${enf.titulo}">
        </div>
        <h3 class="materia-card-titulo">
          <a href="materia.html?id=${enf.id}">${enf.titulo}</a>
        </h3>
        <p class="materia-card-resumo">${enf.resumo}</p>
        <div class="materia-card-meta">
          <span><i class="far fa-user"></i> ${enf.autor}</span>
          <span><i class="far fa-clock"></i> ${enf.tempoLeitura}</span>
        </div>
        <a href="materia.html?id=${enf.id}" class="link-ler-mais">
          Acessar notícia de Enfermagem <i class="fas fa-arrow-right"></i>
        </a>
      `;
    }

    // 7. Enquete daquela Edição Específica
    const elEnq = document.getElementById('blocoEnquete');
    const enq = edicao.enquete;
    if (elEnq && enq) {
      const opcoesHTML = (enq.opcoes || []).map(op => `
        <li><i class="far fa-check-circle" style="color: var(--cor-ds);"></i> ${op}</li>
      `).join('');

      elEnq.innerHTML = `
        <p class="enquete-pergunta">${enq.pergunta}</p>
        <ul class="enquete-opcoes">${opcoesHTML}</ul>
        <div class="qr-box">
          <img src="${enq.qrCodeImg}" alt="QR Code da Enquete" class="qr-img">
          <div class="qr-info">
            <p>Aponte a câmera do celular para responder ao formulário oficial.</p>
            <a href="${enq.linkVotacao}" target="_blank" rel="noopener noreferrer" class="btn-qr-link">
              Ou clique aqui para votar via navegador &rarr;
            </a>
          </div>
        </div>
      `;
    }

  } catch (erro) {
    console.error('[home.js] Erro ao carregar dados da capa:', erro);
    const dest = document.getElementById('blocoDestaque');
    if (dest) {
      dest.innerHTML = `
        <div class="feedback-erro">
          <h3><i class="fas fa-exclamation-triangle"></i> Falha ao carregar edição</h3>
          <p>Verifique a integridade do arquivo <code>data/edicoes.json</code>.</p>
        </div>
      `;
    }
  }
});