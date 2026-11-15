
# 📦 API de Produtos - Sistema de Gestão de Produtos

Este projeto é uma **API REST** para a gestão de produtos, desenvolvida com **Java** utilizando **Spring Boot**. Ela oferece o CRUD completo (cadastrar, listar, alterar e excluir) de produtos com nome e preço, trocando dados em **JSON**. A API é consumida pelo aplicativo **React Native** `my-app`. O sistema utiliza **H2** como banco de dados de teste em memória e **Lombok** para minimizar o código boilerplate.

## 🎯 Funcionalidades

  * **Listagem de Produtos:** Devolve todos os produtos cadastrados.
  * **Cadastro de Produtos:** Adiciona novos produtos com nome e preço.
  * **Alteração de Produtos:** Atualiza o nome e o preço de um produto existente.
  * **Exclusão de Produtos:** Remove um produto pelo id.
  * **Validação dos Dados:** Nome obrigatório e preço maior que zero, com mensagens de erro em JSON.
  * **Banco de Dados em Memória:** Utiliza o H2 para uma configuração simples e rápida, já com produtos de exemplo.
  * **CORS liberado:** Permite que o app rodando no navegador (`expo start --web`) acesse a API.

## 🚀 Tecnologias Utilizadas

As principais tecnologias utilizadas no desenvolvimento deste projeto incluem:

  * **Java 17**: Linguagem principal do projeto.
  * **Spring Boot 4**: Framework robusto para o desenvolvimento do backend.
  * **Spring Web MVC**: Componente para construção da API REST.
  * **Spring Data JPA**: Simplifica o acesso a dados e a persistência no banco de dados.
  * **Bean Validation**: Validação dos dados recebidos nas requisições.
  * **H2 Database**: Banco de dados relacional em memória.
  * **Lombok**: Biblioteca que reduz a necessidade de código repetitivo (getters, setters, construtores).
  * **Maven**: Ferramenta para gerenciamento de dependências e automação de builds.

## 📦 Instalação e Configuração

### 1\. Pré-requisitos

Certifique-se de ter instalado em seu ambiente de desenvolvimento:

  * **Java Development Kit (JDK) 17** ou versão superior.
  * **Maven 3.9.10** ou versão superior (ou utilize o Maven Wrapper incluído no projeto).
  * **Git** para clonar o repositório.

### 2\. Clonando o Repositório

Clone o projeto para sua máquina local usando o comando:

```bash
git clone https://github.com/Will-firmino/_api_produto
cd _api_produto
```


### 3\. Rodando o Projeto

Navegue até o diretório raiz do projeto e execute os seguintes comandos para construir e iniciar a aplicação:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

*(No Windows, use `mvnw.cmd` em vez de `./mvnw`)*

A API estará disponível em `http://localhost:8080/api/produtos`.

### 4\. Rodando os Testes

```bash
./mvnw test
```

## 🔌 Endpoints da API

Todos os endpoints ficam em `/api/produtos` e trabalham com JSON.

| Método   | URL                  | O que faz                    | Resposta de sucesso          |
| -------- | -------------------- | ---------------------------- | ---------------------------- |
| `GET`    | `/api/produtos`      | Lista todos os produtos      | `200` + lista de produtos    |
| `GET`    | `/api/produtos/{id}` | Busca um produto pelo id     | `200` + produto              |
| `POST`   | `/api/produtos`      | Cadastra um produto          | `201` + produto criado       |
| `PUT`    | `/api/produtos/{id}` | Altera um produto            | `200` + produto alterado     |
| `DELETE` | `/api/produtos/{id}` | Exclui um produto            | `204` (sem corpo)            |

### Formato do produto

Corpo enviado no `POST` e no `PUT` (o `id` é gerado pelo banco):

```json
{
  "nome": "Teclado Mecânico",
  "preco": 249.9
}
```

Resposta:

```json
{
  "id": 1,
  "nome": "Teclado Mecânico",
  "preco": 249.9
}
```

### Erros

Quando algo dá errado, a API responde com o status HTTP correspondente e um JSON com a mensagem:

  * **`400 Bad Request`** — dados inválidos. O campo `erros` aponta o problema de cada campo:

    ```json
    {
      "mensagem": "Dados inválidos.",
      "erros": {
        "nome": "O nome é obrigatório.",
        "preco": "O preço deve ser maior que zero."
      }
    }
    ```

  * **`404 Not Found`** — o produto informado não existe:

    ```json
    {
      "mensagem": "Produto com id 99 não encontrado.",
      "erros": {}
    }
    ```

### Exemplos com curl

```bash
# Listar
curl http://localhost:8080/api/produtos

# Cadastrar
curl -X POST http://localhost:8080/api/produtos -H "Content-Type: application/json" -d '{"nome": "Headset", "preco": 199.9}'

# Alterar
curl -X PUT http://localhost:8080/api/produtos/1 -H "Content-Type: application/json" -d '{"nome": "Teclado Gamer", "preco": 299.9}'

# Excluir
curl -X DELETE http://localhost:8080/api/produtos/1
```

## 📱 Conexão com o app (my-app)

O aplicativo React Native `my-app` consome esta API. Para os dois funcionarem juntos:

1. Suba esta API (`./mvnw spring-boot:run`) — ela escuta na porta `8080`.
2. Suba o app (`npx expo start` dentro de `my-app`).

O app descobre sozinho o endereço do computador onde a API está rodando. Ao testar em um **celular físico**, o celular e o computador precisam estar na **mesma rede Wi-Fi** (e o firewall do computador deve permitir conexões na porta `8080`). Para apontar o app para outro endereço, crie um arquivo `.env` na raiz do `my-app` com `EXPO_PUBLIC_API_URL=http://SEU_IP:8080`.

## 🗃️ Banco de Dados H2

Este projeto utiliza o banco de dados H2 como banco de **teste**: ele é incorporado e executado em memória. As configurações estão definidas em `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:h2:mem:produtodb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.defer-datasource-initialization=true
spring.h2.console.enabled=true
```

A cada inicialização, a tabela é criada a partir da entidade `Produto` e o arquivo `src/main/resources/data.sql` insere três produtos de exemplo.

Para inspecionar o banco pelo navegador, acesse o console do H2 em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:produtodb`, usuário `sa`, senha em branco).

**Nota:** O banco de dados H2 em memória é volátil, o que significa que todos os dados são perdidos quando a aplicação é reiniciada (restando apenas os produtos de exemplo).

## 🤝 Contribuições

Contribuições são sempre bem-vindas\! 

## 📄 Licença

Este projeto está licenciado sob a [MIT License](https://www.google.com/search?q=LICENSE).
