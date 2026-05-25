1. Registrar um novo usuário
Endpoint: POST /api/auth/register Descrição: Cria uma nova conta de usuário no sistema.

Corpo da Requisição (JSON):

json
    {
        "name": "Nome Completo",
        "email": "usuario@email.com",
        "password": "senha_secreta123",
        "number": "11999999999"
    }
Regras de Validação:

name: Não pode estar vazio.
email: Deve ser um formato de e-mail válido. Não pode já existir no sistema.
password: Deve ter no mínimo 6 caracteres.
number: Deve ser um formato de número de telefone/celular válido (padrão Brasil pt-BR).
Respostas Possíveis:

201 Created - Sucesso:
json
    { "resposta": "Usuario registrado com sucesso" }
    400 Bad Request - Falha na validação dos dados:
    {"error": "Formato de email inválido"}
    {"error": "O Email já está em uso"}
    {"error": "numero de telefone não é valido"}
    {"error": "Nome não pode ser vazio"}
    {"error": "Senha tem que ter 6 ou mais caracteres"}
    500 Internal Server Error - Erro de processamento no servidor/banco de dados.

2. Autenticar (Fazer Login)
Endpoint: POST /api/auth/login Descrição: Autentica um usuário existente e retorna um token de acesso (JWT).

Corpo da Requisição (JSON):

json
    {
        "email": "usuario@email.com",
        "password": "senha_secreta123"
    }
Respostas Possíveis:

200 OK - Sucesso:
json
    { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    400 Bad Request - Campos não enviados ou formato de e-mail inválido:
    {"error": "email ou senha inválidos"}
    401 Unauthorized - Credenciais erradas (e-mail não cadastrado ou senha incorreta):
    {"error": "email ou senha inválidos"}
    500 Internal Server Error - Erro interno ({"error": "erro no servidor"}).

1. Criar um novo Produto
Endpoint: POST /api/products/ Descrição: Cadastra um novo produto no banco de dados. Autenticação Obrigatória: Sim. É necessário enviar o token JWT no cabeçalho da requisição.

Cabeçalho da Requisição (Headers):

http
Authorization: Bearer <seu_token_jwt_aqui>
Corpo da Requisição (JSON):

json
    {
        "name": "Teclado Mecânico",
        "price": 250.50,
        "description": "Teclado mecânico switch blue",
        "type": "Periféricos",
        "amount": 15
    }
Respostas Possíveis:

201 Created - Produto criado com sucesso. Retorna o objeto do produto com o seu _id do banco:
json
    {
        "_id": "64c9f1...",
        "name": "Teclado Mecânico",
        "price": 250.5,
        "description": "Teclado mecânico switch blue",
        "type": "Periféricos",
        "amount": 15,
        "__v": 0
    }
401 Unauthorized / 403 Forbidden - Token não fornecido, inválido ou expirado (retornado pelo authMiddleware).
500 Internal Server Error - Erro ao criar o produto no servidor.

2. Listar todos os Produtos
Endpoint: GET /api/products/ Descrição: Retorna a lista com todos os produtos cadastrados no sistema. Autenticação: Não requerida (Acesso público).

Respostas Possíveis:

200 OK - Retorna um Array (lista) de produtos.
json
 Show full code block 
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
500 Internal Server Error - Erro ao buscar os produtos no banco de dados.