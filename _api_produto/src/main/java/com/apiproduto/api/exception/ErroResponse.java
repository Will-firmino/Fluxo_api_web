package com.apiproduto.api.exception;

import java.util.Map;

/**
 * Corpo JSON devolvido ao app sempre que uma requisição falha.
 *
 * @param mensagem resumo do problema
 * @param erros    mensagens por campo (nome, preco) quando a validação falha
 */
public record ErroResponse(String mensagem, Map<String, String> erros) {

    public ErroResponse(String mensagem) {
        this(mensagem, Map.of());
    }

}
