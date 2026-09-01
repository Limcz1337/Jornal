/**
 * js/arquivo.js - Renderizador do Repositório Histórico
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('containerArquivo');

  try {
    const dados = await DataService.obterDados();
    const edicoes = dados.edicoes;

    if (!edicoes || edicoes.length === 0) {
      container.innerHTML = `<p>Nenhuma edição encontrada no histórico.</p>`;
      return;
    }

    container.innerHTML = edicoes.map(ed => {
      const isAtual = ed.id === dados.edicaoAtual;
      const badgeAtual = isAtual 
        ? `<span class="tag-cat tag-destaque" style="float: right;">Capa Vigente</span>` 
        : '';

      return `
        <article class="card-edicao-antiga">
          ${badgeAtual}
          <span class="tag-cat tag-ds">Edição #${ed.numero} &bull; ${ed.ano}</span>
          <span class="data-antiga"><i class="far fa-calendar-alt"></i> ${ed.data}</span>
          <h3 style="margin: 12px 0 8px 0; font-family: var(--fonte-titulo);">${ed.tema || ed.destaquePrincipal.titulo}</h3>
          
          <ul class="lista-materias-antigas">
            <li><strong>Destaque:</strong> <a href="materia.html?id=${ed.destaquePrincipal.id}">${ed.destaquePrincipal.titulo}</a></li>
            <li><strong>DS:</strong> <a href="materia.html?id=${ed.materiaDS.id}">${ed.materiaDS.titulo}</a></li>
            <li><strong>Enfermagem:</strong> <a href="materia.html?id=${ed.materiaEnfermagem.id}">${ed.materiaEnfermagem.titulo}</a></li>
          </ul>

          <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--borda); padding-top: 12px;">
            <a href="index.html?edicao=${ed.id}" class="link-ler-mais" style="color: var(--cor-ds);">
              <i class="fas fa-newspaper"></i> Ver Capa Completa
            </a>
            <a href="materia.html?id=${ed.destaquePrincipal.id}" class="link-ler-mais" style="color: var(--texto-secundario);">
              Ler Destaque &rarr;
            </a>
          </div>
        </article>
      `;
    }).join('');

  } catch (erro) {
    console.error('[arquivo.js] Erro ao listar arquivo:', erro);
    container.innerHTML = `<div class="feedback-erro"><p>Falha ao carregar o acervo de edições.</p></div>`;
  }
});