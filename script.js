// Atividade Prática 02 - Programação Web I
// Integrantes: Maikon Liniker Araújo de Souza, Yan Nícolas de Souza

// ===== Seleção dos elementos =====
const form = document.querySelector('#form-gasto');
const campoDescricao = document.querySelector('#descricao');
const campoValor = document.querySelector('#valor');
const campoCategoria = document.querySelector('#categoria');
const mensagemErro = document.querySelector('#mensagem-erro');
const lista = document.querySelector('#lista-gastos');
const painelTotal = document.querySelector('#painel-total');
const totalTela = document.querySelector('#total');
const contadorTela = document.querySelector('#contador');
const filtro = document.querySelector('#filtro');
const botaoTema = document.querySelector('#botao-tema');


// ===== Funções auxiliares =====

// Recebe um número e devolve o texto em reais (ex.: R$ 1.234,50)
function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Recebe o total e devolve o nome da classe de cor do painel
function classificarTotal(total) {
  if (total <= 500) {
    return 'faixa-verde';
  } else if (total <= 1000) {
    return 'faixa-amarela';
  } else {
    return 'faixa-vermelha';
  }
}

// Recebe a quantidade de gastos e devolve o texto do contador
function textoContador(quantidade) {
  if (quantidade === 1) {
    return '1 gasto registrado';
  }
  return quantidade + ' gastos registrados';
}


// ===== Validação =====

function limparErros() {
  mensagemErro.textContent = '';
  campoDescricao.classList.remove('invalido');
  campoValor.classList.remove('invalido');
}

// Devolve true se os dados estão corretos e false se tem erro
function validarCampos(descricao, valorTexto) {
  limparErros();

  if (descricao === '') {
    campoDescricao.classList.add('invalido');
    mensagemErro.textContent = 'Informe a descrição do gasto.';
    campoDescricao.focus();
    return false;
  }

  if (valorTexto === '') {
    campoValor.classList.add('invalido');
    mensagemErro.textContent = 'Informe o valor do gasto.';
    campoValor.focus();
    return false;
  }

  const valor = Number(valorTexto);

  if (isNaN(valor) || valor <= 0) {
    campoValor.classList.add('invalido');
    mensagemErro.textContent = 'O valor deve ser maior que zero.';
    campoValor.focus();
    return false;
  }

  return true;
}


// ===== Criação do item da lista =====

function criarItem(descricao, valor, categoria) {
  const li = document.createElement('li');
  li.classList.add('gasto');
  li.setAttribute('data-valor', valor);
  li.setAttribute('data-categoria', categoria);

  const nome = document.createElement('span');
  nome.classList.add('gasto-descricao');
  nome.textContent = descricao;

  const cat = document.createElement('span');
  cat.classList.add('gasto-categoria');
  cat.textContent = categoria;

  const preco = document.createElement('span');
  preco.classList.add('gasto-valor');
  preco.textContent = formatarValor(valor);

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.classList.add('btn-remover');
  botao.textContent = 'Remover';

  li.appendChild(nome);
  li.appendChild(cat);
  li.appendChild(preco);
  li.appendChild(botao);

  return li;
}


// ===== Atualização da tela =====

// Soma o data-valor de todos os itens (inclusive os ocultos pelo filtro)
function atualizarTotal() {
  const itens = lista.querySelectorAll('li');
  let total = 0;

  for (let i = 0; i < itens.length; i++) {
    total = total + Number(itens[i].getAttribute('data-valor'));
  }

  total = Math.round(total * 100) / 100;

  totalTela.textContent = formatarValor(total);
  painelTotal.classList.remove('faixa-verde', 'faixa-amarela', 'faixa-vermelha');
  painelTotal.classList.add(classificarTotal(total));
}

function atualizarContador() {
  const quantidade = lista.querySelectorAll('li').length;
  contadorTela.textContent = textoContador(quantidade);
}

// Mostra ou oculta os itens conforme a categoria escolhida no filtro
function aplicarFiltro() {
  const escolhida = filtro.value;
  const itens = lista.querySelectorAll('li');

  for (let i = 0; i < itens.length; i++) {
    const categoriaItem = itens[i].getAttribute('data-categoria');

    if (escolhida === 'todas' || categoriaItem === escolhida) {
      itens[i].classList.remove('oculto');
    } else {
      itens[i].classList.add('oculto');
    }
  }
}

function atualizarTudo() {
  atualizarTotal();
  atualizarContador();
}


// ===== Eventos =====

// Envio do formulário
form.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const descricao = campoDescricao.value.trim();
  const valorTexto = campoValor.value.trim();
  const categoria = campoCategoria.value;

  if (!validarCampos(descricao, valorTexto)) {
    return;
  }

  const valor = Number(valorTexto);
  lista.appendChild(criarItem(descricao, valor, categoria));

  // limpa os campos e a mensagem
  campoDescricao.value = '';
  campoValor.value = '';
  campoCategoria.value = 'Alimentação';
  limparErros();
  campoDescricao.focus();

  aplicarFiltro(); // o item novo também obedece o filtro ativo
  atualizarTudo();
});

// Remoção com um único listener na lista (delegação de eventos)
lista.addEventListener('click', function (evento) {
  const alvo = evento.target;

  if (alvo.classList.contains('btn-remover')) {
    alvo.parentElement.remove();
    atualizarTudo();
  }
});

// Filtro por categoria
filtro.addEventListener('change', aplicarFiltro);

// Modo escuro
botaoTema.addEventListener('click', function () {
  document.body.classList.toggle('escuro');

  if (document.body.classList.contains('escuro')) {
    botaoTema.textContent = 'Modo claro';
    botaoTema.setAttribute('aria-pressed', 'true');
  } else {
    botaoTema.textContent = 'Modo escuro';
    botaoTema.setAttribute('aria-pressed', 'false');
  }
});

// Estado inicial da tela
atualizarTudo();
