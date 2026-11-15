package com.apiproduto.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Libera o acesso à API a partir de outras origens (CORS).
 *
 * O app rodando no celular/emulador não precisa disso, mas o app rodando no
 * navegador (expo start --web, em http://localhost:8081) só consegue chamar a
 * API em http://localhost:8080 se ela autorizar.
 *
 * Aqui qualquer origem é aceita porque o ambiente é de desenvolvimento. Em
 * produção, troque o "*" pelos endereços reais do front-end.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }

}
