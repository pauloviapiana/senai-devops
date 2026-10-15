const STATUS_JOGO = require('./statusJogo');

const CONFIG_PADRAO = Object.freeze({
  numeroMaximo: 5000,
  maxTentativas: 10,
  pontuacaoInicial: 1000
});

class JogoNumeroSecreto {
  constructor({
    random = Math.random,
    numeroMaximo = CONFIG_PADRAO.numeroMaximo,
    maxTentativas = CONFIG_PADRAO.maxTentativas,
    pontuacaoInicial = CONFIG_PADRAO.pontuacaoInicial
  } = {}) {
    this.numeroMaximo = numeroMaximo;
    this.maxTentativas = maxTentativas;
    this.tentativas = 1;
    this.pontuacao = pontuacaoInicial;
    this.status = STATUS_JOGO.EM_ANDAMENTO;

    this.numeroSecreto = Math.floor(random() * numeroMaximo) + 1;
  }

  get emAndamento() {
    return this.status === STATUS_JOGO.EM_ANDAMENTO;
  }

  chutar(valor) {
    if (!this.emAndamento) {
      return { valido: false, mensagem: 'O jogo já foi encerrado.' };
    }

    const chute = Number(valor);

    if (valor === null || valor === '' || !Number.isFinite(chute) || chute < 1 || chute > this.numeroMaximo) {
      return { valido: false, mensagem: `Digite um número válido entre 1 e ${this.numeroMaximo}.` };
    }

    if (chute === this.numeroSecreto) {
      this.status = STATUS_JOGO.VITORIA;
      const palavraTentativa = this.tentativas > 1 ? 'tentativas' : 'tentativa';
      return {
        valido: true,
        mensagem: `Você descobriu o número secreto ${this.numeroSecreto} com ${this.tentativas} ${palavraTentativa}`
      };
    }

    const dica = chute > this.numeroSecreto
      ? `O número secreto é menor que ${chute}`
      : `O número secreto é maior que ${chute}`;

    this.pontuacao -= Math.abs(chute - this.numeroSecreto) / 2;
    this.tentativas++;

    if (this.tentativas > this.maxTentativas) {
      this.status = STATUS_JOGO.DERROTA;
      return { valido: true, dica, mensagem: `Você perdeu! O número secreto era ${this.numeroSecreto}.` };
    }

    return { valido: true, mensagem: dica };
  }

  cancelar() {
    if (this.emAndamento) {
      this.status = STATUS_JOGO.CANCELADO;
    }
    return this.status;
  }

  estado() {
    return {
      status: this.status,
      tentativas: this.tentativas,
      tentativasRestantes: Math.max(this.maxTentativas - this.tentativas + 1, 0),
      maxTentativas: this.maxTentativas,
      numeroMaximo: this.numeroMaximo,
      pontuacao: this.pontuacao,
      ...(!this.emAndamento && { numeroSecreto: this.numeroSecreto })
    };
  }
}

module.exports = JogoNumeroSecreto;
