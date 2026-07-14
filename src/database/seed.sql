-- 1. LIMPEZA DAS TABELAS

TRUNCATE TABLE
    emprestimos,
    livros,
    clientes,
    autores
RESTART IDENTITY CASCADE;


-- 2. AUTORES

INSERT INTO autores (nome, nacionalidade)
VALUES
    ('Machado de Assis', 'Brasileira'),
    ('Clarice Lispector', 'Brasileira'),
    ('Jorge Amado', 'Brasileira'),
    ('George Orwell', 'Britânica'),
    ('Jane Austen', 'Britânica'),
    ('Gabriel García Márquez', 'Colombiana'),
    ('J. R. R. Tolkien', 'Britânica'),
    ('Agatha Christie', 'Britânica'),
    ('Franz Kafka', 'Tcheca'),
    ('Mary Shelley', 'Britânica');

-- 3. CLIENTES

INSERT INTO clientes (nome, email, telefone)
VALUES
    (
        'Ana Souza',
        'ana.souza@email.com',
        '11999990001'
    ),
    (
        'Bruno Oliveira',
        'bruno.oliveira@email.com',
        '11999990002'
    ),
    (
        'Carla Mendes',
        'carla.mendes@email.com',
        '11999990003'
    ),
    (
        'Daniel Santos',
        'daniel.santos@email.com',
        '11999990004'
    ),
    (
        'Fernanda Lima',
        'fernanda.lima@email.com',
        '11999990005'
    );

-- 4. LIVROS

INSERT INTO livros (
    titulo,
    autor_id,
    isbn,
    ano_publicacao,
    quantidade_total,
    quantidade_disponivel
)
VALUES
    (
        'Dom Casmurro',
        (SELECT id FROM autores WHERE nome = 'Machado de Assis'),
        '9780000000001',
        1899,
        3,
        3
    ),
    (
        'Memórias Póstumas de Brás Cubas',
        (SELECT id FROM autores WHERE nome = 'Machado de Assis'),
        '9780000000002',
        1881,
        2,
        2
    ),
    (
        'A Hora da Estrela',
        (SELECT id FROM autores WHERE nome = 'Clarice Lispector'),
        '9780000000003',
        1977,
        2,
        2
    ),
    (
        'Laços de Família',
        (SELECT id FROM autores WHERE nome = 'Clarice Lispector'),
        '9780000000004',
        1960,
        1,
        1
    ),
    (
        'Capitães da Areia',
        (SELECT id FROM autores WHERE nome = 'Jorge Amado'),
        '9780000000005',
        1937,
        2,
        2
    ),
    (
        'Gabriela, Cravo e Canela',
        (SELECT id FROM autores WHERE nome = 'Jorge Amado'),
        '9780000000006',
        1958,
        1,
        1
    ),
    (
        '1984',
        (SELECT id FROM autores WHERE nome = 'George Orwell'),
        '9780000000007',
        1949,
        3,
        3
    ),
    (
        'A Revolução dos Bichos',
        (SELECT id FROM autores WHERE nome = 'George Orwell'),
        '9780000000008',
        1945,
        2,
        2
    ),
    (
        'Orgulho e Preconceito',
        (SELECT id FROM autores WHERE nome = 'Jane Austen'),
        '9780000000009',
        1813,
        2,
        2
    ),
    (
        'Emma',
        (SELECT id FROM autores WHERE nome = 'Jane Austen'),
        '9780000000010',
        1815,
        1,
        1
    ),
    (
        'Cem Anos de Solidão',
        (SELECT id FROM autores WHERE nome = 'Gabriel García Márquez'),
        '9780000000011',
        1967,
        2,
        2
    ),
    (
        'O Amor nos Tempos do Cólera',
        (SELECT id FROM autores WHERE nome = 'Gabriel García Márquez'),
        '9780000000012',
        1985,
        1,
        1
    ),
    (
        'O Hobbit',
        (SELECT id FROM autores WHERE nome = 'J. R. R. Tolkien'),
        '9780000000013',
        1937,
        3,
        3
    ),
    (
        'O Senhor dos Anéis',
        (SELECT id FROM autores WHERE nome = 'J. R. R. Tolkien'),
        '9780000000014',
        1954,
        2,
        2
    ),
    (
        'Assassinato no Expresso do Oriente',
        (SELECT id FROM autores WHERE nome = 'Agatha Christie'),
        '9780000000015',
        1934,
        2,
        2
    ),
    (
        'E Não Sobrou Nenhum',
        (SELECT id FROM autores WHERE nome = 'Agatha Christie'),
        '9780000000016',
        1939,
        2,
        2
    ),
    (
        'A Metamorfose',
        (SELECT id FROM autores WHERE nome = 'Franz Kafka'),
        '9780000000017',
        1915,
        1,
        1
    ),
    (
        'O Processo',
        (SELECT id FROM autores WHERE nome = 'Franz Kafka'),
        '9780000000018',
        1925,
        1,
        1
    ),
    (
        'Frankenstein',
        (SELECT id FROM autores WHERE nome = 'Mary Shelley'),
        '9780000000019',
        1818,
        2,
        2
    ),
    (
        'O Último Homem',
        (SELECT id FROM autores WHERE nome = 'Mary Shelley'),
        '9780000000020',
        1826,
        1,
        1
);