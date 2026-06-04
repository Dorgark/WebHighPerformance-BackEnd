# Web High Performance - BackEnd

Este é o repositório do back-end para o sistema Web High Performance. A API é construída com Node.js, Express, MongoDB e JWT para autenticação.

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

**Regras de Validação:**
- **name**: Não pode estar vazio.
- **email**: Deve ser um formato de e-mail válido. Não pode já existir no sistema.
- **password**: Deve ter no mínimo 6 caracteres.
- **number**: Deve ser um formato de número de telefone/celular válido (padrão Brasil pt-BR).

**Respostas Possíveis:**
- `201 Created` - Sucesso:
  ```json
  { "resposta": "Usuario registrado com sucesso" }
  ```
- `400 Bad Request` - Falha na validação dos dados:
  ```json
  { "error": "Formato de email inválido" }
  ```
  *(e outras mensagens específicas de validação, ex: email em uso, número inválido, etc)*
- `500 Internal Server Error` - Erro de processamento no servidor/banco de dados.

---

### 2. Autenticar (Fazer Login)
- **Endpoint:** `POST /api/auth/login`
- **Descrição:** Autentica um usuário existente e retorna um token de acesso (JWT).

**Corpo da Requisição (JSON):**
```json
{
  "email": "usuario@email.com",
  "password": "senha_secreta123"
}
```

**Respostas Possíveis:**
- `200 OK` - Sucesso:
  ```json
  { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
  ```
- `400 Bad Request` - Campos não enviados ou formato de e-mail inválido.
- `401 Unauthorized` - Credenciais erradas (e-mail não cadastrado ou senha incorreta).
- `500 Internal Server Error` - Erro interno.

---

### 3. Editar Usuário
- **Endpoint:** `PATCH /api/auth/edit`
- **Descrição:** Atualiza as informações do usuário autenticado. 
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Corpo da Requisição (JSON) - Todos os campos são opcionais:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "password": "novasenha123",
  "number": "11888888888"
}
```

**Respostas Possíveis:**
- `200 OK` - Usuário atualizado com sucesso (retorna os dados atualizados).
- `400 Bad Request` - Erro de validação em algum campo.
- `401 Unauthorized` - Nome não pode ser vazio ou Token inválido.
- `500 Internal Server Error` - Erro interno.

---

### 4. Deletar Usuário
- **Endpoint:** `DELETE /api/auth/delete`
- **Descrição:** Remove a conta do usuário autenticado.
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Respostas Possíveis:**
- `200 OK` - Retorna os dados do usuário deletado.
- `401 Unauthorized` - Token não fornecido, inválido ou expirado.
- `500 Internal Server Error` - Erro interno.

---

## 📦 Produtos (`/api/products`)

### 1. Criar um novo Produto
- **Endpoint:** `POST /api/products/`
- **Descrição:** Cadastra um novo produto no banco de dados. 
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Corpo da Requisição (JSON):**
```json
{
  "name": "Teclado Mecânico",
  "price": 250.50,
  "description": "Teclado mecânico switch blue",
  "type": "Periféricos",
  "amount": 15
}
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
    "__v": 0
  }
  ```
- `401 Unauthorized` / `403 Forbidden` - Token não fornecido, inválido ou expirado.
- `500 Internal Server Error` - Erro ao criar o produto.

---

### 2. Listar todos os Produtos
- **Endpoint:** `GET /api/products/`
- **Descrição:** Retorna a lista com todos os produtos cadastrados no sistema. 
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
      "amount": 15
    },
    {
      "_id": "64c9f2...",
      "name": "Mouse Gamer",
      "price": 120.00,
      "description": "Mouse 10000 DPI",
      "type": "Periféricos",
      "amount": 8
    }
  ]
  ```
- `500 Internal Server Error` - Erro ao buscar os produtos no banco de dados.

---

### 3. Atualizar Produto
- **Endpoint:** `PUT /api/products/:id`
- **Descrição:** Atualiza as informações de um produto específico através do ID.
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Corpo da Requisição (JSON) - Enviar apenas os campos que deseja alterar:**
```json
{
  "price": 230.00,
  "amount": 10
}
```

**Respostas Possíveis:**
- `200 OK` - Produto atualizado com sucesso. Retorna o produto com os dados atualizados.
- `401 Unauthorized` - Token não fornecido, inválido ou expirado.
- `500 Internal Server Error` - Erro ao atualizar o produto.

---

### 4. Deletar Produto
- **Endpoint:** `DELETE /api/products/delete/:id`
- **Descrição:** Remove um produto específico através do ID.
- **Autenticação Obrigatória:** Sim (`Authorization: Bearer <token>`)

**Respostas Possíveis:**
- `200 OK` - Sucesso:
  ```json
  { "message": "Produto deletado" }
  ```
- `401 Unauthorized` - Token não fornecido, inválido ou expirado.
- `500 Internal Server Error` - Erro ao deletar produto.
