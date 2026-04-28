import pool from '../config/db.js';

export const createContentRecord = async (data) => {
    const query = `
        INSERT INTO content (
            title, subject, description, file_path, file_type, file_size,
            start_time, end_time, rotation_duration, uploaded_by, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        RETURNING *;
    `;

    const values = [
        data.title,
        data.subject,
        data.description || null,
        data.file_path,
        data.file_type,
        data.file_size,
        data.start_time,
        data.end_time,
        data.rotation_duration || 5,
        data.uploaded_by,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getPendingContent = async () => {
    const query = `
        SELECT c.*, u.name AS teacher_name, u.email AS teacher_email
        FROM content c
        JOIN users u ON c.uploaded_by = u.id
        WHERE c.status = 'pending'
        ORDER BY c.created_at ASC;
    `;

    const { rows } = await pool.query(query);
    return rows;
};

export const updateContentStatus = async (id, status, principalId, rejectionReason = null) => {
    const query = `
        UPDATE content
        SET status = $1, approved_by = $2, approved_at = NOW(), rejection_reason = $3
        WHERE id = $4
        RETURNING *;
    `;

    const values = [status, principalId, rejectionReason, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getLiveEligibleContent = async (teacherId, currentTime) => {
    const query = `
        SELECT id, title, subject, file_path, file_type, rotation_duration, start_time, end_time
        FROM content
        WHERE uploaded_by = $1
          AND status = 'approved'
          AND start_time <= $2
          AND end_time >= $2
        ORDER BY subject ASC, created_at ASC;
    `;

    const { rows } = await pool.query(query, [teacherId, currentTime]);
    return rows;
};