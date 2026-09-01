/**
 * js/materia.js - Controlador do Leitor de Notícias
 */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idMateria = urlParams.get('id');
  const container = document.getElementById('artigoConteudo');

  if (!idMateria) {
    container.innerHTML = `
      <div class="mensagem-centro">
        <h2>Nenhuma matéria selecionada</h2>
        <p>Retorne à capa para selecionar um artigo.</p>
        <a href="index.html" class="btn-acao btn-sucesso">Ir para a Capa</a>
      </div>
    `;
    return;
  }

  try {
    const resultado = await DataService.obterMateriaPorId(idMateria);

    if (!resultado) {
      container.innerHTML = `
        <div class="mensagem-centro">
          <h2>Matéria não encontrada</h2>
          <p>O identificador <code>${idMateria}</code> não foi localizado no arquivo.</p>
          <a href="index.html" class="btn-acao btn-destaque">Voltar à Capa</a>
        </div>
      `;
      return;
    }

    const { materia, edicao } = resultado;
    document.title = `${materia.titulo} · Ecos Técnicos`;

    let classeTag = 'tag-destaque';
    if (materia.categoria.includes('DS') || materia.categoria.includes('Sistemas')) classeTag = 'tag-ds';
    if (materia.categoria.includes('Enfermagem')) classeTag = 'tag-enf';

    container.innerHTML = `
      <div class="materia-cabecalho">
        <span class="tag-cat ${classeTag}">${materia.categoria}</span>
        <h1 class="materia-titulo">${materia.titulo}</h1>
        <p class="lead">${materia.resumo}</p>
        <div class="destaque-meta">
          <span><i class="far fa-user"></i> Por <strong>${materia.autor}</strong></span> &bull; 
          <span><i class="far fa-calendar"></i> Edição #${edicao.numero} (${edicao.data})</span> &bull;
          <span><i class="far fa-clock"></i> Leitura: ${materia.tempoLeitura || '3 min'}</span>
        </div>
      </div>

      <img src="${materia.imagem}" alt="${materia.titulo}" class="materia-banner-img">

      <div class="materia-texto">
        ${materia.conteudo}
      </div>

      <div class="box-aviso-legal">
        <p><i class="fas fa-balance-scale"></i> <strong>Aviso Acadêmico:</strong> Publicação supervisionada. Correções e direitos de resposta devem ser enviados à redação escolar.</p>
      </div>

      <div class="botoes-navegacao-materia">
        <a href="index.html" class="btn-acao btn-sucesso"><i class="fas fa-arrow-left"></i> Voltar à Capa</a>
        <a href="arquivo.html" class="btn-acao btn-destaque"><i class="fas fa-archive"></i> Ver Mais Edições</a>
      </div>
    `;

  } catch (erro) {
    console.error('[materia.js] Erro:', erro);
    container.innerHTML = `<div class="feedback-erro"><p>Erro ao processar matéria.</p></div>`;
  }
});