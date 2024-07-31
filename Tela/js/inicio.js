function IniciarJogo() {
    let nome = $('#Nome').val();
    if (nome == '') {
        alert('Preencha o nome para iniciar o jogo.');
        return;
    }
    window.location.href = '/jogo_acertos/Tela/principal.html?NOME=' + nome;

}
function IniciarJogoBinario() {
    let nome = $('#Nome').val();
    if (nome == '') {
        alert('Preencha o nome para iniciar o jogo.');
        return;
    }
    window.location.href = '/jogo_acertos/Tela/principal_binario.html?NOME=' + nome;

}
function DirecionarResultado() {
    window.location.href = '/jogo_acertos/Tela/resultados.html';
}