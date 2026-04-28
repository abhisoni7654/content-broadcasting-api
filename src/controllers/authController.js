import { registerUser, loginUser } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('All required fields must be provided.');
    }

    if (!['teacher', 'principal'].includes(role)) {
        res.status(400);
        throw new Error('Role must be either teacher or principal.');
    }

    const user = await registerUser(name, email, password, role);

    res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: user,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required.');
    }

    const result = await loginUser(email, password);

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
    });
});