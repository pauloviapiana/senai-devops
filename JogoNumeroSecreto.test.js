const JogoNumeroSecreto = require("./JogoNumeroSecreto");

// Utilitário para padronizar a criação do jogo mockado
const setupGame = (askMock) => {
  const printMock = jest.fn();
  // 0.1 * 5000 + 1 = 501
  const randomMock = jest.fn().mockReturnValue(0.1); 
  
  const jogo = new JogoNumeroSecreto({
    print: printMock,
    ask: askMock,
    random: randomMock
  });
  
  return { jogo, printMock, askMock, randomMock };
};

test("jogar retorna VITORIA e acerta na primeira tentativa mantendo pontuação intacta", async () => {
  const askMock = jest.fn().mockResolvedValueOnce("501");
  const { jogo, printMock } = setupGame(askMock);

  const resultado = await jogo.jogar();

  expect(resultado).toBe("VITORIA");
  expect(jogo.tentativas).toBe(1);
  expect(jogo.pontuacao).toBe(1000);
  expect(printMock).toHaveBeenCalledWith("Você descobriu o número secreto 501 com 1 tentativa");
});

test("jogar retorna DERROTA após exceder o limite máximo de tentativas", async () => {
  const askMock = jest.fn().mockResolvedValue("100"); 
  const { jogo, printMock } = setupGame(askMock);

  const resultado = await jogo.jogar();

  expect(resultado).toBe("DERROTA");
  expect(jogo.tentativas).toBe(11);
  expect(printMock).toHaveBeenCalledWith("O número secreto é maior que 100");
  expect(printMock).toHaveBeenCalledWith("Você perdeu! O número secreto era 501.");
});

test("jogar retorna CANCELADO e encerra a execução se o input for 'sair'", async () => {
  const askMock = jest.fn().mockResolvedValueOnce("sair");
  const { jogo, printMock } = setupGame(askMock);

  const resultado = await jogo.jogar();

  expect(resultado).toBe("CANCELADO");
  expect(printMock).toHaveBeenCalledWith("Jogo encerrado!");
  expect(jogo.tentativas).toBe(1);
});

test("jogar notifica erro e não consome tentativa para inputs de texto ou fora dos limites", async () => {
  const askMock = jest.fn()
    .mockResolvedValueOnce("abc")
    .mockResolvedValueOnce("0")
    .mockResolvedValueOnce("5001")
    .mockResolvedValueOnce("501"); 

  const { jogo, printMock } = setupGame(askMock);

  const resultado = await jogo.jogar();

  expect(resultado).toBe("VITORIA");
  expect(jogo.tentativas).toBe(1); 
  expect(printMock).toHaveBeenCalledWith("Digite um número válido entre 1 e 5000.");
  expect(printMock).toHaveBeenCalledTimes(5); // 1 boas vindas + 3 erros + 1 vitória
});

test("jogar calcula exatamente a perda de pontos com base na margem de erro", async () => {
  const askMock = jest.fn()
    .mockResolvedValueOnce("601")
    .mockResolvedValueOnce("501");

  const { jogo, printMock } = setupGame(askMock);

  await jogo.jogar();

  expect(jogo.pontuacao).toBe(950);
  expect(jogo.tentativas).toBe(2);
  expect(printMock).toHaveBeenCalledWith("O número secreto é menor que 601");
  expect(printMock).toHaveBeenCalledWith("Você descobriu o número secreto 501 com 2 tentativas");
});