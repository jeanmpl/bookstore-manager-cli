CREATE TYPE status_emprestimo AS ENUM ('ativo', 'devolvido');

CREATE TABLE autores (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(80),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE livros (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor_id INTEGER NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao SMALLINT,
    quantidade_total INTEGER NOT NULL DEFAULT 1,
    quantidade_disponivel INTEGER NOT NULL DEFAULT 1,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_livros_autores
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_livros_ano_publicacao
        CHECK (ano_publicacao IS NULL OR ano_publicacao BETWEEN 1000 AND 2100),

    CONSTRAINT ck_livros_quantidade_total
        CHECK (quantidade_total > 0),

    CONSTRAINT ck_livros_quantidade_disponivel
        CHECK (
            quantidade_disponivel >= 0
            AND quantidade_disponivel <= quantidade_total
        )
);

CREATE TABLE emprestimos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    livro_id INTEGER NOT NULL,
    data_emprestimo TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_prevista_devolucao DATE NOT NULL DEFAULT (CURRENT_DATE + 30),
    data_devolucao TIMESTAMPTZ,
    status status_emprestimo NOT NULL DEFAULT 'ativo',

    CONSTRAINT fk_emprestimos_clientes
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_emprestimos_livros
        FOREIGN KEY (livro_id)
        REFERENCES livros(id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_emprestimos_prazo_padrao
        CHECK (data_prevista_devolucao = data_emprestimo::DATE + 30),

    CONSTRAINT ck_emprestimos_status_devolucao
        CHECK (
            (status = 'ativo' AND data_devolucao IS NULL)
            OR
            (status = 'devolvido' AND data_devolucao IS NOT NULL)
        )
);

CREATE INDEX idx_livros_autor_id ON livros(autor_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos(cliente_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);