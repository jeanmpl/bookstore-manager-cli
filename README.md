# BookStore Manager CLI

Aplicação de gerenciamento de livraria executada por linha de comando, desenvolvida com Node.js, TypeScript e PostgreSQL.

O sistema permite administrar autores, livros, clientes e empréstimos, além de disponibilizar relatórios relacionados ao acervo e às operações realizadas pela livraria.

---

## Descrição do projeto

O **Bookstore Manager CLI** é uma aplicação de terminal criada para centralizar o gerenciamento de uma livraria.

Por meio de menus interativos, o usuário pode cadastrar, consultar, atualizar e remover autores, livros e clientes. Também é possível registrar empréstimos, realizar devoluções e visualizar relatórios com informações consolidadas do sistema.

Os dados são armazenados em um banco de dados PostgreSQL, garantindo persistência das informações e aplicação de regras de integridade, como relacionamentos, valores únicos e restrições de exclusão.

---

## Objetivo

O objetivo do projeto é aplicar, de forma prática, conceitos relacionados a:

- desenvolvimento de aplicações com Node.js e TypeScript;
- interação com o usuário por meio de uma interface de linha de comando;
- arquitetura em camadas;
- programação orientada a objetos;
- separação de responsabilidades;
- integração com banco de dados PostgreSQL;
- operações de cadastro, consulta, atualização e exclusão;
- transações de banco de dados;
- validação de regras de negócio;
- tratamento centralizado de erros;
- criação de consultas e relatórios SQL.

---

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript;
- **TypeScript** — linguagem utilizada no desenvolvimento da aplicação;
- **PostgreSQL** — sistema gerenciador de banco de dados;
- **pg** — biblioteca para comunicação entre Node.js e PostgreSQL;
- **dotenv** — carregamento de variáveis de ambiente;
- **tsx** — execução do projeto TypeScript durante o desenvolvimento;
- **readline/promises** — leitura assíncrona das entradas no terminal;
- **Git** — controle de versão;
- **GitHub** — hospedagem do repositório.

---

## Requisitos para execução

Antes de executar a aplicação, é necessário possuir os seguintes programas instalados:

- Node.js 18 ou superior;
- npm;
- PostgreSQL;
- Git;
- um terminal, como PowerShell, Prompt de Comando ou terminal integrado do VS Code.

Para verificar as versões instaladas:

```bash
node --version
npm --version
git --version
psql --version
```

---

## Configuração do banco de dados

### 1. Criar o banco de dados

Acesse o PostgreSQL pelo pgAdmin ou pelo terminal e crie um banco de dados para o projeto:

```sql
CREATE DATABASE bookstore_manager;
```

### 2. Executar o arquivo de estrutura

Após criar o banco, execute o arquivo responsável pela criação das tabelas.

Exemplo pelo terminal:

```bash
psql -U postgres -d bookstore_manager -f src/database/schema.sql
```

Também é possível abrir o arquivo `schema.sql` no Query Tool do pgAdmin e executar seu conteúdo.

O banco de dados possui as principais tabelas:

- `autores`;
- `livros`;
- `clientes`;
- `emprestimos`.

### 3. Popular o banco de dados

Para inserir dados de exemplo, execute o arquivo de seed:

```bash
psql -U postgres -d bookstore_manager -f src/database/seed.sql
```

O seed contém autores, livros e clientes que podem ser utilizados para testar as funcionalidades da aplicação.

### 4. Configurar as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=bookstore_manager
```

Os nomes das variáveis devem ser os mesmos utilizados no arquivo responsável pela conexão com o banco de dados.

---

## Instalação

### 1. Clonar o repositório

````bash
git clone https://github.com/jeanmpl/bookstore-manager-cli

### 2. Entrar na pasta do projeto

```bash
cd bookstore-manager-cli
````

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o banco de dados

Crie o banco, execute o `schema.sql`, execute opcionalmente o `seed.sql` e configure o arquivo `.env`.

---

## Execução

### Ambiente de desenvolvimento

Para executar a aplicação diretamente com TypeScript:

```bash
npm run dev
```

### Verificação de tipos

Para verificar possíveis erros de tipagem:

```bash
npm run typecheck
```

### Compilação

Para compilar o código TypeScript:

```bash
npm run build
```

Os arquivos JavaScript compilados serão gerados na pasta `dist`.

### Execução da versão compilada

```bash
npm start
```

---

## Arquitetura do projeto

O projeto utiliza uma arquitetura em camadas, separando as diferentes responsabilidades da aplicação.

O fluxo principal de uma operação é:

```text
Usuário
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

A resposta percorre o caminho inverso:

```text
PostgreSQL
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
Usuário
```

### Controllers

Os controllers controlam a interação com o usuário.

Responsabilidades:

- exibir menus;
- solicitar dados;
- chamar os métodos dos services;
- apresentar os resultados;
- capturar e apresentar mensagens de erro.

Exemplos:

- `AutorController`;
- `LivroController`;
- `ClienteController`;
- `EmprestimoController`;
- `RelatorioController`.

### Services

Os services concentram as regras de negócio.

Responsabilidades:

- validar os dados recebidos;
- impedir operações inválidas;
- verificar a existência de registros;
- lançar erros de negócio;
- coordenar chamadas aos repositories.

Exemplos de regras:

- impedir empréstimo de livro sem exemplares disponíveis;
- impedir devolução de empréstimo já finalizado;
- impedir cadastro com valores obrigatórios vazios;
- verificar se autor, livro ou cliente existe antes de uma operação.

### Repositories

Os repositories realizam a comunicação com o PostgreSQL.

Responsabilidades:

- executar comandos SQL;
- inserir registros;
- consultar registros;
- atualizar registros;
- remover registros;
- converter linhas retornadas pelo banco em objetos da aplicação.

### Models e DTOs

A camada de models contém as interfaces que representam as entidades e os dados utilizados nas operações da aplicação.

Exemplos:

- `Autor`;
- `Livro`;
- `Cliente`;
- `Emprestimo`;
- DTOs de criação e atualização;
- interfaces utilizadas nos relatórios.

DTO significa **Data Transfer Object** e representa os dados transferidos entre as camadas da aplicação.

### Configuração do banco

A configuração do banco de dados cria o pool de conexões utilizado pelos repositories.

O pool permite reutilizar conexões com o PostgreSQL, evitando a criação de uma nova conexão para cada consulta.

### Tratamento de erros

A aplicação possui tratamento centralizado de erros por meio de classes e funções como:

- `AppError`;
- `getFriendlyErrorMessage`.

Erros técnicos do PostgreSQL são convertidos em mensagens mais compreensíveis.

Exemplos:

| Código  | Situação                          | Mensagem apresentada                                                       |
| ------- | --------------------------------- | -------------------------------------------------------------------------- |
| `23505` | Valor duplicado                   | Já existe um registro com um valor que deve ser único.                     |
| `23503` | Violação de chave estrangeira     | O registro não pode ser removido porque está relacionado a outro cadastro. |
| `23514` | Violação de uma restrição `CHECK` | Os dados informados violam uma regra de validação do banco de dados.       |
| `22P02` | Formato inválido                  | Um dos valores informados possui formato inválido.                         |

---

### Validação de inputs

A aplicação possui validação de inputs centralizada por meio de funções como:

- `requireText`;
- `requirePositiveInteger`;
- `validateEmail`;
- `validateYear`;

## Funcionalidades implementadas

### Gerenciamento de autores

- cadastrar autor;
- listar autores;
- buscar autor por ID;
- atualizar autor;
- remover autor;
- informar nacionalidade opcional;
- impedir exclusão de autor relacionado a livros.

### Gerenciamento de livros

- cadastrar livro;
- listar livros;
- buscar livro por ID;
- atualizar livro;
- remover livro;
- relacionar livro a um autor;
- registrar ISBN;
- impedir ISBN duplicado;
- registrar ano de publicação;
- controlar quantidade total;
- controlar quantidade disponível;
- impedir exclusão de livro relacionado a empréstimos.

### Gerenciamento de clientes

- cadastrar cliente;
- listar clientes;
- buscar cliente por ID;
- atualizar cliente;
- remover cliente;
- validar e-mail;
- impedir e-mails duplicados;
- impedir exclusão de cliente relacionado a empréstimos.

### Gerenciamento de empréstimos

- registrar empréstimo;
- relacionar cliente e livro;
- registrar data do empréstimo;
- calcular prazo de devolução de 30 dias;
- verificar disponibilidade do livro;
- diminuir a quantidade disponível após o empréstimo;
- registrar devolução;
- atualizar o status do empréstimo;
- registrar a data efetiva da devolução;
- aumentar a quantidade disponível após a devolução;
- listar empréstimos;
- impedir devolução duplicada.

As operações de empréstimo e devolução utilizam transações no PostgreSQL.

Com isso, todas as alterações relacionadas são confirmadas em conjunto por meio de `COMMIT` ou desfeitas por meio de `ROLLBACK` caso ocorra algum erro.

### Relatórios

A aplicação disponibiliza relatórios para consulta das informações armazenadas.

Entre os relatórios implementados estão:

- livros disponíveis;
- quantidade total de livros por autor e quantidade disponível de cada livro;
- empréstimos ativos;
- empréstimos realizados por cliente;
- empréstimos realizados por livro.

O relatório de livros por autor utiliza `LEFT JOIN`, permitindo que autores sem livros cadastrados também sejam apresentados.

---

## Estrutura de pastas

```text
bookstore-manager-cli/
├── src/
│   ├── controllers/
│   │   ├── AutorController.ts
│   │   ├── ClienteController.ts
│   │   ├── EmprestimoController.ts
│   │   ├── LivroController.ts
│   │   └── RelatorioController.ts
|   |
│   ├── database/
│   │   ├── database.ts
│   │   ├── schema.sql
|   |   └── seed.sql
│   │
|   ├── menus/
|   |   └── MainMenu.ts
|   |
│   ├── models/
│   │   ├── Autor.ts
│   │   ├── Cliente.ts
│   │   ├── Emprestimo.ts
│   │   └── Livro.ts
│   │
│   ├── repositories/
│   │   ├── AutorRepository.ts
│   │   ├── ClienteRepository.ts
│   │   ├── EmprestimoRepository.ts
│   │   ├── LivroRepository.ts
│   │   └── RelatorioRepository.ts
│   │
│   ├── services/
│   │   ├── AutorService.ts
│   │   ├── ClienteService.ts
│   │   ├── EmprestimoService.ts
│   │   ├── LivroService.ts
│   │   └── RelatorioService.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
|   |   ├── ConsoleInput.ts
|   |   └── validators.ts
│   │
│   └── main.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

---

## Principais arquivos

### `src/main.ts`

Ponto de entrada da aplicação.

Esse arquivo instancia repositories, services, controllers, entrada de dados e menu principal.

Exemplo do fluxo de injeção de dependências:

```ts
const autorRepository = new AutorRepository();
const autorService = new AutorService(autorRepository);
const autorController = new AutorController(autorService, input);
```

### `src/MainMenu.ts`

Apresenta o menu principal e direciona o usuário para os módulos de autores, livros, clientes, empréstimos e relatórios.

### `src/config/database.ts`

Configura a conexão com o PostgreSQL e exporta o pool utilizado nos repositories.

### `database/schema.sql`

Contém os comandos utilizados para criar:

- tabelas;
- chaves primárias;
- chaves estrangeiras;
- restrições;
- relacionamentos;
- validações do banco.

### `database/seed.sql`

Insere dados iniciais para demonstração e testes.

### `src/errors/AppError.ts`

Centraliza os erros da aplicação e converte erros técnicos em mensagens adequadas ao usuário.

### `src/utils/validators.ts`

Centraliza as funções utilizadas para validar os dados informados pelo usuário antes que eles sejam enviados para as demais camadas da aplicação.

---

## Exemplos de utilização

### Menu principal

Ao iniciar a aplicação, o sistema apresenta um menu semelhante ao seguinte:

```text
================================
      BOOKSTORE MANAGER CLI
================================

1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar sessão

Escolha uma opção:
```

### Cadastro de autor

```text
Nome do autor: Machado de Assis
Nacionalidade: Brasileira

Autor cadastrado com sucesso. ID: 1, Nome: Machado de Assis
```

### Cadastro de livro

```text
Título: Dom Casmurro
ID do autor: 1
ISBN: 9788535910663
Ano de publicação: 1899
Quantidade total: 5

Livro cadastrado com sucesso com ID 1.
```

No momento do cadastro, a quantidade disponível é iniciada com o mesmo valor da quantidade total.

### Cadastro de cliente

```text
Nome: Maria Silva
E-mail: maria@email.com
Telefone: 11999999999

Cliente cadastrado com ID 1.
```

### Registro de empréstimo

```text
ID do cliente: 1
ID do livro: 1

Empréstimo registrado com sucesso! ID: 2
Data prevista para devolução: Tue Aug 18 2026 00:00:00 GMT-0300 (Horário Padrão de Brasília) (prazo padrão de 30 dias)
```

Ao registrar o empréstimo, a aplicação:

1. verifica se o cliente existe;
2. verifica se o livro existe;
3. verifica se existe exemplar disponível;
4. cria o empréstimo;
5. diminui a quantidade disponível do livro;
6. confirma a transação.

### Devolução de livro

```text
ID do empréstimo: 2

Livro devolvido com sucesso.
```

Ao realizar a devolução, a aplicação:

1. localiza o empréstimo ativo;
2. altera o status para `devolvido`;
3. registra a data de devolução;
4. aumenta a quantidade disponível do livro;
5. confirma a transação.

### Atualização de cadastro

Durante uma atualização, o valor atual é apresentado entre colchetes:

```text
Nome [Machado de Assis]:
Nacionalidade [Brasileira]:
```

Quando o usuário pressiona `ENTER` sem informar um novo valor, o dado atual é mantido.

### Tentativa de exclusão inválida

Caso o usuário tente excluir um livro relacionado a um empréstimo:

```text
Erro: O registro não pode ser removido porque está relacionado a outro cadastro.
```

Essa regra é garantida pelas restrições do banco de dados e pelo tratamento de erros da aplicação.

### Relatório de livros por autor

```text
┌─────────┬─────────────────────┬────────────────────────────┬────────────────────────────┬───────────────────────┐
│ (index) │ autor               │ quantidade_total_de_livros │ livro                      │ quantidade_por_livro  │
├─────────┼─────────────────────┼────────────────────────────┼────────────────────────────┼───────────────────────┤
│ 0       │ Machado de Assis    │ 4                          │ Dom Casmurro               │ 2                     │
│ 1       │ Machado de Assis    │ 4                          │ Quincas Borba              │ 2                     │
│ 2       │ Clarice Lispector   │ 0                          │ Nenhum livro cadastrado    │ 0                     │
└─────────┴─────────────────────┴────────────────────────────┴────────────────────────────┴───────────────────────┘
```

A coluna `(index)` é criada automaticamente pelo `console.table` e não representa o ID do registro no banco de dados.

---

## Relacionamentos do banco de dados

Os principais relacionamentos são:

```text
autores 1 ───── N livros
clientes 1 ──── N emprestimos
livros 1 ────── N emprestimos
```

Isso significa que:

- um autor pode possuir vários livros;
- cada livro pertence a um autor;
- um cliente pode realizar vários empréstimos;
- um livro pode aparecer em diferentes empréstimos ao longo do tempo;
- cada empréstimo pertence a um cliente e a um livro.

As chaves estrangeiras utilizam restrições para impedir a remoção de registros que ainda estejam relacionados a outros cadastros.

---

## Regras de negócio

Entre as principais regras implementadas estão:

- um livro deve estar relacionado a um autor existente;
- um empréstimo deve estar relacionado a um cliente e a um livro existentes;
- não é possível emprestar um livro sem unidades disponíveis;
- a quantidade disponível não pode ser negativa;
- a quantidade disponível não pode ser maior que a quantidade total;
- o prazo padrão de empréstimo é de 30 dias;
- uma devolução só pode ser realizada para um empréstimo ativo;
- e-mails de clientes não podem ser duplicados;
- ISBNs cadastrados não podem ser duplicados;
- registros relacionados não podem ser removidos;
- operações compostas utilizam transações para manter a consistência dos dados.

---

## Integrantes da equipe

Projeto desenvolvido por:

- **Jean Matheo Piccini Lago**

---

## Repositório

O código-fonte está disponível no GitHub:

```text
https://github.com/jeanmpl/bookstore-manager-cli
```

---

## Licença

Este projeto foi desenvolvido para fins educacionais.
