package com.apiproduto.api;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ProdutoControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listaOsProdutosDeExemplo() throws Exception {
        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[0].nome").value("Teclado Mecânico"))
                .andExpect(jsonPath("$[0].preco").value(249.90));
    }

    @Test
    void cadastraAlteraBuscaEExcluiUmProduto() throws Exception {
        // CREATE
        String resposta = mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"nome": "Headset", "preco": 199.5}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.nome").value("Headset"))
                .andExpect(jsonPath("$.preco").value(199.5))
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(resposta, "$.id");

        // UPDATE
        mockMvc.perform(put("/api/produtos/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"nome": "Headset Gamer", "preco": 259.9}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.nome").value("Headset Gamer"))
                .andExpect(jsonPath("$.preco").value(259.9));

        // READ
        mockMvc.perform(get("/api/produtos/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Headset Gamer"));

        // DELETE
        mockMvc.perform(delete("/api/produtos/{id}", id))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/produtos/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void ignoraOIdEnviadoNoCadastro() throws Exception {
        String resposta = mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"id": 1, "nome": "Webcam", "preco": 150}
                        """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(resposta, "$.id");

        // O produto 1 (de exemplo) não pode ter sido sobrescrito.
        mockMvc.perform(get("/api/produtos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Teclado Mecânico"));

        mockMvc.perform(delete("/api/produtos/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void recusaProdutoInvalido() throws Exception {
        mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"nome": "  ", "preco": -5}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("Dados inválidos."))
                .andExpect(jsonPath("$.erros.nome").value("O nome é obrigatório."))
                .andExpect(jsonPath("$.erros.preco").value("O preço deve ser maior que zero."));
    }

    @Test
    void recusaJsonMalFormado() throws Exception {
        mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nome\": \"Cabo\", \"preco\": \"abc\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").exists());
    }

    @Test
    void devolve404ParaProdutoInexistente() throws Exception {
        mockMvc.perform(get("/api/produtos/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Produto com id 999999 não encontrado."));
        mockMvc.perform(put("/api/produtos/999999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"nome": "Nada", "preco": 1}
                        """))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete("/api/produtos/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void liberaCorsParaOAppWeb() throws Exception {
        mockMvc.perform(options("/api/produtos")
                .header("Origin", "http://localhost:8081")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:8081"));
    }

}
