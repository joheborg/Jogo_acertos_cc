const params = new URLSearchParams(window.location.search);
const nome = params.get('NOME');

$(document).ready(() => {
    BuscarTopTentativas();
    BuscarTopTentativasBinarios();
});

function BuscarTopTentativas() {
    fetch('/jogo_acertos/Tela/PHP/select_resultados.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            PreencherTabela(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            MostrarErro('Ocorreu um erro ao buscar os dados.');
        });
}

function BuscarTopTentativasBinarios() {
    fetch('/jogo_acertos/Tela/PHP/select_resultados_binario.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            PreencherTabelaBinaria(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            MostrarErro('Ocorreu um erro ao buscar os dados.');
        });
}

function PreencherTabela(data) {
    const tabela = $('#tabela');
    tabela.empty();
    data.sort((a, b) => a.ranking - b.ranking);
    data.forEach(item => {
        $('<tr>').append(
            $('<td>').text(item.ranking),
            $('<td>').text(item.tentativas),
            $('<td>').text(item.nome),
            $('<td>').text(new Date(item.dt_registro).toLocaleDateString('pt-BR'))
        ).appendTo(tabela);
    });
}


function PreencherTabelaBinaria(data) {
    const tabela = $('#tabela_binaria');
    tabela.empty();
    data.sort((a, b) => a.ranking - b.ranking);
    data.forEach(item => {
        $('<tr>').append(
            $('<td>').text(item.ranking),
            $('<td>').text(item.tentativas),
            $('<td>').text(item.nome),
            $('<td>').text(new Date(item.dt_registro).toLocaleDateString('pt-BR'))
        ).appendTo(tabela);
    });
}


function MostrarErro(mensagem) {
    alert(mensagem);
}

function DirecionarInicio() {
    window.location.href = '/jogo_acertos/Tela/inicio.html';
}
