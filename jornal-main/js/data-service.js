/**
 * js/data-service.js
 * Camada de Acesso a Dados do Jornal
 */

const DataService = {
  _cache: null,

  async obterDados() {
    if (this._cache) {
      return this._cache;
    }

    try {
      // Usa caminho relativo ao local de execução
      const resposta = await fetch('./data/edicoes.json');
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status} - Falha ao carregar ./data/edicoes.json`);
      }
      this._cache = await resposta.json();
      return this._cache;
    } catch (erro) {
      console.error('[DataService] Erro ao carregar dados:', erro);
      throw erro;
    }
  },

  async obterEdicaoAtual() {
    const dados = await this.obterDados();
    const edicao = dados.edicoes.find(e => e.id === dados.edicaoAtual);
    return edicao || dados.edicoes[0];
  },

  async obterMateriaPorId(idMateria) {
    const dados = await this.obterDados();
    for (const edicao of dados.edicoes) {
      if (edicao.destaquePrincipal && edicao.destaquePrincipal.id === idMateria) {
        return { materia: edicao.destaquePrincipal, edicao };
      }
      if (edicao.materiaDS && edicao.materiaDS.id === idMateria) {
        return { materia: edicao.materiaDS, edicao };
      }
      if (edicao.materiaEnfermagem && edicao.materiaEnfermagem.id === idMateria) {
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