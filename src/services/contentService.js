import {
    createContentRecord,
    getPendingContent,
    updateContentStatus,
    getLiveEligibleContent
} from '../models/contentModel.js';

export const uploadContentService = async (data) => {
    // Validate time range
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);

    if (start >= end) {
        throw new Error('Start time must be before end time.');
    }

    if (start < new Date()) {
        throw new Error('Start time cannot be in the past.');
    }

    return await createContentRecord(data);
};

export const fetchPendingContentService = async () => {
    return await getPendingContent();
};

export const reviewContentService = async (id, status, principalId, reason) => {
    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
        throw new Error("Invalid status.");
    }

    // Require reason for rejection
    if (status === 'rejected' && !reason) {
        throw new Error('Rejection reason is required.');
    }

    const content = await updateContentStatus(id, status, principalId, reason);

    if (!content) {
        throw new Error('Content not found.');
    }

    return content;
};

export const getActiveBroadcastService = async (teacherId) => {
    const now = new Date();

    // Fetch eligible content
    const items = await getLiveEligibleContent(teacherId, now);
    if (!items?.length) return null;
    if (items.length === 1) return items[0];

    // Convert duration to ms
    const list = items.map(item => ({
        ...item,
        durationMs: item.rotation_duration * 60 * 1000
    }));

    const totalMs = list.reduce((sum, i) => sum + i.durationMs, 0);

    // Calculate position in rotation cycle
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const offset = (now.getTime() - startOfDay) % totalMs;

    let elapsed = 0;
    for (const item of list) {
        elapsed += item.durationMs;
        if (offset < elapsed) {
            delete item.durationMs;
            return item;
        }
    }

    return null;
};