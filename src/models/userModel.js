import pool from '../config/db.js';

export const getUserByEmail = async (email) => {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1;',
        [email]
    );
    return rows[0] || null;
};

export const createUser = async (name, email, passwordHash, role) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at;
    `;

    const { rows } = await pool.query(query, [
        name,
        email,
        passwordHash,
        role,
    ]);

    return rows[0];
};