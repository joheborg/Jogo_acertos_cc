const params = new URLSearchParams(window.location.search);
const nome = params.get('NOME');

if (!nome) {
    DirecionarInicio();
}

let numeroRandom = Math.floor(Math.random() * 100) + 1;
let tentativas = 0;

$(document).ready(() => {
    $('#labelInformacao').html(nome);
    PreencherTabela();
});

function PreencherTabela() {
    const tabela = $('#tabela');
    tabela.empty();

    for (let x = 1; x <= 100; x += 10) {
        const row = $('<tr>');
        for (let i = 0; i < 10; i++) {
            const cellValue = x + i;
            const cell = $('<td>').text(cellValue)
                .addClass('text-center fs-2 table-hover text-white')
                .prop('id', cellValue);
            row.append(cell);
            cell.on('click', function () {
                const valor = $(this).prop('id');
                if (parseInt(valor) === numeroRandom) {
                    $(this).addClass('bg-success');
                    tentativas++;
                    $('#labelInformacao').html(`Parabéns você acertou! Você teve ${tentativas} tentativas <button type="button" class="btn btn-success col-4 mt-2 mr-1" onclick="DirecionarResultado();">VER RESULTADOS</button><button type="button" class="btn btn-primary col-4 mt-2 mr-1" onclick="DirecionarInicio();">INICIAR NOVAMENTE</button>`);
                    EnviarTentativas();
                } else {
                    $(this).addClass('bg-danger');
                    tentativas++;
                    if (valor > numeroRandom) {
                        $('#labelInformacao').html('Tentativa acima do número');
                    } else {
                        $('#labelInformacao').html('Tentativa abaixo do número');
                    }
                }
            });
        }
        tabela.append(row);
    }
}


function ResetarTabela() {
    $('#tabela tr td').removeClass('bg-danger').removeClass('bg-success');
    numeroRandom = Math.floor(Math.random() * 100) + 1;
    tentativas = 0;
}

function EnviarTentativas() {
    const formData = { nome: nome, tentativas: tentativas };
    $.ajax({
        type: 'POST',
        url: '/jogo_acertos/Tela/PHP/inserir_resultados_binario.php',
        data: formData,
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, status, error) {
            alert('Erro ao inserir dados: ' + xhr.responseText);
        }
    });
}

function DirecionarResultado() {
    window.location.href = '/jogo_acertos/Tela/resultados.html';
}

function DirecionarInicio() {
    window.location.href = '/jogo_acertos/Tela/inicio.html';
}
