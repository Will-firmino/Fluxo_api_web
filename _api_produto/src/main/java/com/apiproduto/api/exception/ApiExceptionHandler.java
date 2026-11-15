package com.apiproduto.api.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // Transforma as exceções da API em respostas JSON com o status HTTP correto.
public class ApiExceptionHandler {

    @ExceptionHandler(ProdutoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse produtoNaoEncontrado(ProdutoNaoEncontradoException ex) {
        return new ErroResponse(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // Falha do @Valid.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse dadosInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(erro -> erros.putIfAbsent(erro.getField(), erro.getDefaultMessage()));
        return new ErroResponse("Dados inválidos.", erros);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class) // JSON ausente ou mal formado.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse corpoInvalido(HttpMessageNotReadableException ex) {
        return new ErroResponse("O corpo da requisição está ausente ou não é um JSON válido.");
    }

}
