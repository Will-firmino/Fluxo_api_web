import Constants from "expo-constants";
import { Platform } from "react-native";

// Porta em que a API Spring Boot (_api_produto) fica escutando.
const API_PORT = 8080;

// Tempo máximo de espera por uma resposta antes de desistir.
const TIMEOUT_MS = 10000;

/*
 * Descobre o endereço da máquina onde a API está rodando.
 *
 * "localhost" dentro do celular é o próprio celular, e não o computador. Por
 * isso aproveitamos o endereço que o Expo já usa para falar com o computador
 * (ex.: "192.168.0.10:8081") e trocamos só a porta.
 */
function getApiHost() {
  if (Platform.OS === "web") {
    return window.location.hostname || "localhost";
  }

  const devServerHost = Constants.expoConfig?.hostUri?.split(":")[0];
  const isLoopback =
    !devServerHost ||
    devServerHost === "localhost" ||
    devServerHost === "127.0.0.1";

  if (isLoopback) {
    // No emulador Android, 10.0.2.2 é o apelido do computador hospedeiro.
    return Platform.OS === "android" ? "10.0.2.2" : "localhost";
  }

  return devServerHost;
}

/*
 * Para apontar para outro endereço (API em outra máquina, expo com --tunnel...),
 * crie um arquivo .env na raiz do app com:
 *
 *   EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
 */
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? `http://${getApiHost()}:${API_PORT}`
).replace(/\/$/, "");

function createApiError(message, status, fieldErrors) {
  const error = new Error(message);
  error.status = status; // código HTTP (undefined quando nem houve resposta)
  error.fieldErrors = fieldErrors ?? {}; // ex.: { nome: "O nome é obrigatório." }
  return error;
}

async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw createApiError(
      `Não foi possível conectar à API em ${API_URL}. Verifique se ela está rodando e se o aparelho está na mesma rede do computador.`
    );
  } finally {
    clearTimeout(timer);
  }

  // 204 (No Content) é a resposta do DELETE: não tem corpo para ler.
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw createApiError(
      data?.mensagem ?? `A API respondeu com o erro ${response.status}.`,
      response.status,
      data?.erros
    );
  }

  return data;
}

// Cada função abaixo corresponde a um endpoint do ProdutoController da API.

export function getProducts() {
  return request("/api/produtos");
}

export function createProduct(product) {
  return request("/api/produtos", { method: "POST", body: product });
}

export function updateProduct(id, product) {
  return request(`/api/produtos/${id}`, { method: "PUT", body: product });
}

export function deleteProduct(id) {
  return request(`/api/produtos/${id}`, { method: "DELETE" });
}
