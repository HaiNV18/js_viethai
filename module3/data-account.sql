CREATE TABLE accounts (
    id         BIGSERIAL PRIMARY KEY,
    firstname  VARCHAR(100),
    lastname   VARCHAR(100),
    username   VARCHAR(50) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    address    TEXT,
    role       VARCHAR(10) NOT NULL DEFAULT 'USER'
               CHECK (role IN ('ADMIN', 'USER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cần extension để hash password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tạo ADMIN
INSERT INTO accounts (firstname, lastname, username, password, email, role)
VALUES (
    'Admin 1',
    'Account',
    'admin1',
    crypt('123456', gen_salt('bf')),
    'nvhai2306@gmail.com',
    'ADMIN'
);

INSERT INTO accounts (firstname, lastname, username, password, email, role)
VALUES (
    'Admin 2',
    'Account',
    'admin2',
    crypt('123456', gen_salt('bf')),
    'admin2@gmail.com',
    'ADMIN'
);

-- Tạo USER
INSERT INTO accounts (firstname, lastname, username, password, email, role)
VALUES (
    'User 1',
    'Account',
    'user1',
    crypt('123456', gen_salt('bf')),
    'user1@gmail.com',
    'USER'
);

INSERT INTO accounts (firstname, lastname, username, password, email, role)
VALUES (
    'User 2',
    'Account',
    'user2',
    crypt('123456', gen_salt('bf')),
    'user2@gmail.com',
    'USER'
);
