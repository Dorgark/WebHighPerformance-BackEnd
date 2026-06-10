# Web High Performance - BackEnd (API Reference)

Este é o repositório do back-end para o sistema Web High Performance. A API é construída com Node.js, Express, MongoDB e JWT para autenticação.

## 🔗 Informações Base para Consumo (Front-End)
- **URL Base Local:** `http://localhost:3000`
- **URL Base Produção:** `https://webhighperformance-backend.onrender.com/`
- Todas as rotas de criação, edição e exclusão (além das de usuário) requerem um Header de Autenticação:
  - `Authorization: Bearer <seu_token_jwt>`

---

## 📦 Produtos (`/api/products`)

### 1. Criar um novo Produto
- **Endpoint:** `POST /api/products/`
- **Descrição:** Cadastra um novo produto no banco de dados, fazendo o upload automático da imagem para o Cloudinary. 
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)
- **Formato da Requisição:** `multipart/form-data` (obrigatório devido ao upload de imagem). O campo da imagem deve se chamar **`image`**.

**Corpo da Requisição (Form Data):**
```text
name: "Teclado Mecânico"
price: 250.50
description: "Teclado mecânico switch blue"
type: "Periféricos"
amount: 15
image: [Arquivo da imagem] (Campo do tipo File)
```

**Respostas Possíveis:**
- `201 Created` - Produto criado com sucesso:
  ```json
  {
    "_id": "64c9f1...",
    "name": "Teclado Mecânico",
    "price": 250.5,
    "description": "Teclado mecânico switch blue",
    "type": "Periféricos",
    "amount": 15,
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/lojinha_produtos/teclado.jpg",
    "imagePublicId": "lojinha_produtos/teclado",
    "__v": 0
  }
  ```
- `400 Bad Request` - A imagem do produto é obrigatória.
- `401 Unauthorized` - Token não fornecido ou inválido.
- `500 Internal Server Error` - Erro ao criar o produto.

---

### 2. Listar todos os Produtos
- **Endpoint:** `GET /api/products/`
- **Descrição:** Retorna a lista com todos os produtos cadastrados no sistema, incluindo os links das imagens prontas para exibição. 
- **Autenticação:** Não requerida (Acesso público).

**Respostas Possíveis:**
- `200 OK` - Retorna um Array (lista) de produtos:
  ```json
  [
    {
      "_id": "64c9f1...",
      "name": "Teclado Mecânico",
      "price": 250.5,
      "description": "Teclado mecânico switch blue",
      "type": "Periféricos",
      "amount": 15,
      "imageUrl": "https://res.cloudinary.com/.../lojinha_produtos/teclado.jpg",
      "imagePublicId": "lojinha_produtos/teclado"
    },
    {
      "_id": "64c9f2...",
      "name": "Mouse Gamer",
      "price": 120.00,
      "description": "Mouse 10000 DPI",
      "type": "Periféricos",
      "amount": 8,
      "imageUrl": "https://res.cloudinary.com/.../lojinha_produtos/mouse.jpg",
      "imagePublicId": "lojinha_produtos/mouse"
    }
  ]
  ```
- `500 Internal Server Error` - Erro ao buscar os produtos.

---

### 3. Atualizar Produto
- **Endpoint:** `PUT /api/products/:id`
- **Descrição:** Atualiza as informações de um produto específico. Se uma nova imagem for enviada no campo `image`, a imagem antiga será automaticamente apagada do Cloudinary e substituída.
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)
- **Formato da Requisição:** `multipart/form-data` (se for enviar nova imagem) ou `application/json` (se for atualizar apenas os textos).

**Corpo da Requisição (Exemplo atualizando texto e imagem via Form Data):**
```text
price: 230.00
amount: 10
image: [Novo arquivo de imagem - Opcional]
```

**Respostas Possíveis:**
- `200 OK` - Produto atualizado com sucesso (retorna o objeto completo atualizado).
- `401 Unauthorized` - Token não fornecido ou inválido.
- `404 Not Found` - Produto não encontrado.
- `500 Internal Server Error` - Erro ao atualizar o produto.

---

### 4. Deletar Produto
- **Endpoint:** `DELETE /api/products/:id`
- **Descrição:** Remove um produto específico através do ID. A imagem associada também será deletada permanentemente do Cloudinary.
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Respostas Possíveis:**
- `200 OK` - Sucesso:
  ```json
  { "message": "Produto deletado" }
  ```
- `401 Unauthorized` - Token não fornecido ou inválido.
- `404 Not Found` - Produto não encontrado no banco de dados.
- `500 Internal Server Error` - Erro ao deletar produto.

---

## 🔐 Autenticação e Usuário (`/api/auth`)

### 1. Registrar um novo usuário
- **Endpoint:** `POST /api/auth/register`
- **Descrição:** Cria uma nova conta de usuário no sistema.

**Corpo da Requisição (JSON):**
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha_secreta123",
  "number": "11999999999"
}
```

**Respostas Possíveis:**
- `201 Created` - `{ "resposta": "Usuario registrado com sucesso" }`
- `400 Bad Request` - Falha na validação (`{ "error": "Formato de email inválido" }`)

---

### 2. Autenticar (Fazer Login)
- **Endpoint:** `POST /api/auth/login`
- **Descrição:** Autentica o usuário e retorna o token de acesso.

**Corpo da Requisição (JSON):**
```json
{
  "email": "usuario@email.com",
  "password": "senha_secreta123"
}
```

**Respostas Possíveis:**
- `200 OK` - `{ "token": "eyJhbGciOiJIUzI1NiIs..." }`
- `401 Unauthorized` - Credenciais incorretas.

---

### 3. Editar Usuário
- **Endpoint:** `PATCH /api/auth/edit`
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Corpo da Requisição (JSON) - Opcional:**
```json
{
  "name": "Novo Nome"
}
```

---

### 4. Deletar Usuário
- **Endpoint:** `DELETE /api/auth/delete`
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

---

## 🛠 Para Desenvolvedores (Rodando a API Localmente)

### Pré-requisitos
- Node.js instalado.
- Conta no MongoDB Atlas (ou banco local).
- Conta no Cloudinary para gerenciar as imagens.

### Instalação

```bash
git clone https://github.com/seu-usuario/WebHighPerformance-BackEnd.git
cd WebHighPerformance-BackEnd
npm install
```

Crie o arquivo `.env`:
```env
PORT=3000
MONGO_KEY=sua_string_de_conexao
JWT_SECRET=sua_chave_secreta
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

Inicie o servidor:
```bash
npm run dev
```
