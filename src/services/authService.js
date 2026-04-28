import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/userModel.js';

export const registerUser = async (name, email, password, role) => {
    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    return await createUser(name, email, passwordHash, role);
};

export const loginUser = async (email, password) => {
    // Fetch user
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials.');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials.');
    }

    // Generate token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        user: { id: user.id, name: user.name, role: user.role },
        token,
    };
};