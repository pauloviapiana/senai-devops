alert('Boas vindas ao jogo do número secreto');

let numeroMaximo = 5000;
let numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
console.log(numeroSecreto);

let chute;
let tentativas = 1;
let maxTentativas = 10;

while (chute != numeroSecreto && tentativas <= maxTentativas) {
    chute = prompt(`Escolha um número entre 1 e ${numeroMaximo}`);

    // BUG 1 CORRIGIDO: usuário cancelou
    if (chute === null) {
        alert('Jogo encerrado!');
        break;
    }

    chute = Number(chute);

    // BUG 2 CORRIGIDO: número fora do intervalo ou inválido
    if (chute < 1 || chute > numeroMaximo || isNaN(chute)) {
        alert(`Digite um número válido entre 1 e ${numeroMaximo}.`);
        continue;
    }

    if (chute == numeroSecreto) {
        break;
    } else {
        if (chute > numeroSecreto) {
            alert(`O número secreto é menor que ${chute}`);
        } else {
            alert(`O número secreto é maior que ${chute}`);
        }

        tentativas++;
    }
}

if (chute == numeroSecreto) {
    let palavraTentativa = tentativas > 1 ? 'tentativas' : 'tentativa';
    alert(`Você descobriu o número secreto ${numeroSecreto} com ${tentativas} ${palavraTentativa}`);
} else if (tentativas > maxTentativas) {
    alert(`Você perdeu! O número secreto era ${numeroSecreto}.`);
}