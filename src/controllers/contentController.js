import {
    uploadContentService,
    fetchPendingContentService,
    reviewContentService
} from '../services/contentService.js';

export const uploadContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required.',
            });
        }

        const { title, subject, description, start_time, end_time, rotation_duration } = req.body;

        if (!title || !subject || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: 'Title, subject, start time, and end time are required.',
            });
        }

        const contentData = {
            title,
            subject,
            description,
            file_path: req.file.path,
            file_type: req.file.mimetype,
            file_size: req.file.size,
            start_time,
            end_time,
            rotation_duration: parseInt(rotation_duration, 10) || 5,
            uploaded_by: req.user.id,
        };

        const result = await uploadContentService(contentData);

        res.status(201).json({
            success: true,
            message: 'Content uploaded and pending approval.',
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPending = async (req, res) => {
    try {
        const data = await fetchPendingContentService();

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'Unable to fetch pending content.',
        });
    }
};

export const reviewContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required.',
            });
        }

        const result = await reviewContentService(
            id,
            status,
            req.user.id,
            rejection_reason
        );

        res.status(200).json({
            success: true,
            message: `Content ${status} successfully.`,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};