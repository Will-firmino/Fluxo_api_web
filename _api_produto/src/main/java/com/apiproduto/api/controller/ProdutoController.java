package com.apiproduto.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.apiproduto.api.exception.ProdutoNaoEncontradoException;
import com.apiproduto.api.model.Produto;
import com.apiproduto.api.model.ProdutoRepository;

import jakarta.validation.Valid;

@RestController // Cada método devolve JSON (e não mais o nome de uma página HTML).
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired // Injeção de dependência -> Quase tudo pronto para salvar, excluir, alterar,
               // ler no BD.
    private ProdutoRepository repository;

    @GetMapping // READ -> lista todos os produtos.
    public List<Produto> listar() {
        return repository.findAll(Sort.by("id"));
    }

    @GetMapping("/{id}") // READ -> busca um único produto.
    public Produto buscar(@PathVariable Long id) {
        return buscarOuFalhar(id);
    }

    @PostMapping // CREATE -> cadastra um produto novo.
    @ResponseStatus(HttpStatus.CREATED)
    public Produto cadastrar(@Valid @RequestBody Produto produto) {
        produto.setId(null); // O id é sempre gerado pelo banco, nunca vem do app.
        return repository.save(produto);
    }

    @PutMapping("/{id}") // UPDATE -> altera um produto existente.
    public Produto alterar(@PathVariable Long id, @Valid @RequestBody Produto dados) {
        Produto produto = buscarOuFalhar(id);
        produto.setNome(dados.getNome());
        produto.setPreco(dados.getPreco());
        return repository.save(produto);
    }

    @DeleteMapping("/{id}") // DELETE -> remove um produto.
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        repository.delete(buscarOuFalhar(id));
    }

    private Produto buscarOuFalhar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ProdutoNaoEncontradoException(id));
    }

}
