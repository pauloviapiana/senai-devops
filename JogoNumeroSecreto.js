class JogoNumeroSecreto {
  constructor(deps = {}) {
    // Agora as dependências esperam funções de terminal (I/O assíncrono)
    this.print = deps.print || console.log;
    this.ask = deps.ask; // A função de input será injetada e deve retornar uma Promise
    this.random = deps.random || Math.random;

    this.numeroMaximo = 5000;
    this.maxTentativas = 10;
    this.tentativas = 1;
    this.pontuacao = 1000;
    
    this.numeroSecreto = parseInt(this.random() * this.numeroMaximo + 1);
  }

  // O método agora é async para esperar a resposta do usuário no terminal
  async jogar() {
    this.print('Boas vindas ao jogo do número secreto! (Digite "sair" a qualquer momento para cancelar)');
    let chute;

    while (this.tentativas <= this.maxTentativas) {
      // await pausa a execução até o usuário dar 'Enter' no terminal
      chute = await this.ask(`Escolha um número entre 1 e ${this.numeroMaximo}: `);

      if (chute === null || (typeof chute === 'string' && chute.toLowerCase() === 'sair')) {
        this.print('Jogo encerrado!');
        return 'CANCELADO';
      }

      chute = Number(chute);

      if (chute < 1 || chute > this.numeroMaximo || isNaN(chute)) {
        this.print(`Digite um número válido entre 1 e ${this.numeroMaximo}.`);
        continue;
      }

      if (chute === this.numeroSecreto) {
        break;
      } else {
        if (chute > this.numeroSecreto) {
          this.print(`O número secreto é menor que ${chute}`);
        } else {
          this.print(`O número secreto é maior que ${chute}`);
        }
        
        let pontosPerdidos = Math.abs(chute - this.numeroSecreto) / 2;
        this.pontuacao = this.pontuacao - pontosPerdidos;
        this.tentativas++;
      }
    }

    if (chute === this.numeroSecreto) {
      let palavraTentativa = this.tentativas > 1 ? 'tentativas' : 'tentativa';
      this.print(`Você descobriu o número secreto ${this.numeroSecreto} com ${this.tentativas} ${palavraTentativa}`);
      return 'VITORIA';
    } else if (this.tentativas > this.maxTentativas) {
      this.print(`Você perdeu! O número secreto era ${this.numeroSecreto}.`);
      return 'DERROTA';
    }
  }
}

module.exports = JogoNumeroSecreto;