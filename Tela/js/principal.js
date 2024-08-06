const params = new URLSearchParams(window.location.search);
const nome = params.get('NOME');

if (!nome) {
    DirecionarInicio();
}


$(document).ready(() => {
    $('#labelInformacao').html(nome);
    PreencherTabela();
    InserirNomeGerarNumero(nome);
});

function PreencherTabela() {
    const tabela = $('#tabela');
    tabela.empty();

    for (let x = 1; x <= 100; x += 10) {
        const row = $('<tr>');
        for (let i = 0; i < 10; i++) {
            const cellValue = x + i;
            const cell = $('<td>')
                .text(cellValue)
                .addClass('text-center fs-4 pe-auto table-hover text-white')
                .css('cursor', 'pointer')
                .prop('id', cellValue);
            row.append(cell);
            cell.on('click', function () {
                const valor = $(this)
                    .prop('id');
                verificarNumero(valor, this);
            });
        }
        tabela.append(row);
    }
}

function ResetarTabela() {
    $('#tabela tr td').removeClass('bg-danger').removeClass('bg-success');
}

function InserirNomeGerarNumero(nome_jogador) {
    const formData = { nome: nome_jogador, tipo: "NORMAL" };
    $.ajax({
        type: 'POST',
        url: '/jogo_acertos/Tela/PHP/inserir_resultado_nome.php',
        data: formData,
        success: function (response) {
            localStorage.setItem('ID', response.resultado_id);
        },
        error: function (xhr, status, error) {
            alert('Erro: ' + xhr.responseText);
        }
    });
}

function verificarNumero(numero_click, campo) {
    let vid = localStorage.getItem("ID");
    if (!vid) {
        DirecionarInicio();
    }
    const formData = {
        numero_binario: 0,
        numero: numero_click,
        id: vid
    };
    $.ajax({
        type: 'POST',
        url: '/jogo_acertos/Tela/PHP/verificar_numero.php',
        data: formData
    }).done(function (response) {
        if (response.resultado && response.resultado > 0) {
            localStorage.removeItem("ID");
            $(campo).addClass('bg-success');
            $('#labelInformacao').html(`Parabéns você acertou! <button type="button" class="btn btn-success col-4 mt-2 mr-1" onclick="DirecionarResultado();">RESULTADOS</button><button type="button" class="btn btn-primary col-4 mt-2 mr-1" onclick="DirecionarInicio();">INICIAR</button>`);
        } else {
            $(campo).addClass('bg-danger');
        }
    }).fail(function (xhr, status, error) {
        alert('Erro: ' + xhr.responseText);
    });
}

function DirecionarResultado() {
    window.location.href = '/jogo_acertos/Tela/resultados.html';
}

function DirecionarInicio() {
    window.location.href = '/jogo_acertos/Tela/inicio.html';
}
