# API de Leitura de Medidores

Este projeto é uma API para gerenciamento de leituras de medidores, construída utilizando o framework Express no Node.js, com MySQL para armazenar os dados. Os valores das leituras são extraídos de imagens por meio de um modelo de linguagem (LLM), proporcionando uma forma automatizada e eficiente de captura de dados.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Iniciando o Projeto](#iniciando-o-projeto)
- [Rotas da API](#rotas-da-api)

## Instalação

Clone o repositório:

   ```bash
   git clone https://github.com/mdalzotto/MedidorIA.git
   cd MedidorIA
   ```

## Configuração

Crie um arquivo **.env** na raiz do projeto para configurar as variáveis de ambiente necessárias. Use o exemplo abaixo como base:

   ```bash
    GEMINI_API_KEY="sua_key_do_Gemini"
   ```

## Iniciando o Projeto

Com o Docker Compose configurado e todas as configurações feitas, execute o seguinte comando para iniciar o projeto:

   ```bash
   docker-compose up --build
   ```

Certifique-se de que ele esteja rodando.

A API será iniciada em http://localhost:3000.


## Rotas da API

### **[POST]** **/upload**

Para fazer upload de uma leitura, envie uma requisição POST para **/upload** com o seguinte corpo:

  ```bash
  {
  "image": "data:image/jpeg;base64,...",
  "customer_code": "codigo_cliente",
  "measure_datetime": "2024-09-01T10:00:00Z",
  "measure_type": "WATER"
}
  ```

### **[**PATCH**]** **/confirm**

Responsável por confirmar ou corrigir o valor lido pelo LLM

Exemplo de uso:

  ```bash
   {
 "measure_uuid": "string",
 "confirmed_value": integer
}

  ```

### **[**GET**]** **/{customer_code}/list**

Responsável por listar as medidas realizadas por um determinado cliente:

Exemplo de uso:

  ```bash
   {
 "measure_uuid": "string",
 "confirmed_value": integer
}

  ```
