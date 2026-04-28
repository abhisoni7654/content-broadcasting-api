import { getActiveBroadcastService } from '../services/contentService.js';

export const getLiveBroadcast = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const activeContent = await getActiveBroadcastService(teacherId);

        if (!activeContent) {
            return res.status(200).json({
                success: true,
                message: 'No active content available.',
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            data: activeContent,
        });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch live broadcast.',
        });
    }
};