class JogoNumeroSecreto {
  constructor(deps = {}) {
    this.print = deps.print || console.log;
    this.ask = deps.ask; // Usado apenas no modo terminal (jogar); deve retornar uma Promise
    this.random = deps.random || Math.random;

    this.numeroMaximo = 5000;
    this.maxTentativas = 10;
    this.tentativas = 1;
    this.pontuacao = 1000;
    this.status = 'EM_ANDAMENTO';

    this.numeroSecreto = parseInt(this.random() * this.numeroMaximo + 1);
  }

  // Processa um único palpite. Usado tanto pela API quanto pelo modo terminal.
  chutar(valor) {
    if (this.status !== 'EM_ANDAMENTO') {
      return { valido: false, mensagem: 'O jogo já foi encerrado.' };
    }

    const chute = Number(valor);

    if (valor === null || valor === '' || isNaN(chute) || chute < 1 || chute > this.numeroMaximo) {
      return { valido: false, mensagem: `Digite um número válido entre 1 e ${this.numeroMaximo}.` };
    }

    if (chute === this.numeroSecreto) {
      this.status = 'VITORIA';
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
      this.status = 'DERROTA';
      return { valido: true, dica, mensagem: `Você perdeu! O número secreto era ${this.numeroSecreto}.` };
    }

    return { valido: true, mensagem: dica };
  }

  cancelar() {
    if (this.status === 'EM_ANDAMENTO') {
      this.status = 'CANCELADO';
    }
    return this.status;
  }

  estado() {
    const encerrado = this.status !== 'EM_ANDAMENTO';
    return {
      status: this.status,
      tentativas: this.tentativas,
      tentativasRestantes: Math.max(this.maxTentativas - this.tentativas + 1, 0),
      maxTentativas: this.maxTentativas,
      numeroMaximo: this.numeroMaximo,
      pontuacao: this.pontuacao,
      ...(encerrado && { numeroSecreto: this.numeroSecreto })
    };
  }

  async jogar() {
    this.print('Boas vindas ao jogo do número secreto! (Digite "sair" a qualquer momento para cancelar)');

    while (this.status === 'EM_ANDAMENTO') {
      const chute = await this.ask(`Escolha um número entre 1 e ${this.numeroMaximo}: `);

      if (chute === null || (typeof chute === 'string' && chute.toLowerCase() === 'sair')) {
        this.cancelar();
        this.print('Jogo encerrado!');
        break;
      }

      const resultado = this.chutar(chute);
      if (resultado.dica) {
        this.print(resultado.dica);
      }
      this.print(resultado.mensagem);
    }

    return this.status;
  }
}

module.exports = JogoNumeroSecreto;
