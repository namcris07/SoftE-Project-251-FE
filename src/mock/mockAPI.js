// Mock API service - NO BACKEND NEEDED
// All data is stored in memory and resets on page refresh

// Mock data storage
const MOCK_STORAGE = {
    sessions: [
        {
            id: '1',
            tutorId: '2',
            studentId: '1',
            subject: 'Giải tích 1',
            date: '2025-10-28',
            time: '14:00',
            duration: 90,
            location: 'H1-101',
            type: 'in-person',
            status: 'scheduled',
            notes: 'Ôn tập giữa kỳ',
            createdAt: '2025-10-27',
        },
        {
            id: '2',
            tutorId: '2',
            studentId: '1',
            subject: 'Đại số tuyến tính',
            date: '2025-10-25',
            time: '10:00',
            duration: 120,
            location: 'Online',
            type: 'online',
            status: 'completed',
            notes: 'Ma trận và định thức',
            createdAt: '2025-10-20',
            rating: 5,
            feedback: 'Rất tốt, giảng rất chi tiết!',
        },
        {
            id: '3',
            tutorId: '2',
            studentId: '1',
            subject: 'Xác suất thống kê',
            date: '2025-11-01',
            time: '16:00',
            duration: 90,
            location: 'H1-201',
            type: 'in-person',
            status: 'pending',
            notes: 'Biến ngẫu nhiên',
            createdAt: '2025-10-27',
        },
        // More sessions for tutor view
        {
            id: '4',
            tutorId: '2',
            studentId: '1',
            subject: 'Giải tích 1',
            date: '2025-10-28',
            time: '08:00',
            duration: 120,
            location: 'H1-101',
            type: 'in-person',
            status: 'scheduled',
            notes: 'Chuỗi số và chuỗi hàm',
            createdAt: '2025-10-26',
        },
        {
            id: '5',
            tutorId: '2',
            studentId: '3',
            subject: 'Đại số tuyến tính',
            date: '2025-10-29',
            time: '10:00',
            duration: 90,
            location: 'Online',
            type: 'online',
            status: 'scheduled',
            notes: 'Không gian vector',
            createdAt: '2025-10-27',
        },
        {
            id: '6',
            tutorId: '2',
            studentId: '4',
            subject: 'Giải tích 2',
            date: '2025-10-29',
            time: '14:00',
            duration: 120,
            location: 'H1-201',
            type: 'in-person',
            status: 'scheduled',
            notes: 'Tích phân kép',
            createdAt: '2025-10-27',
        },
        {
            id: '7',
            tutorId: '2',
            studentId: '1',
            subject: 'Xác suất thống kê',
            date: '2025-10-30',
            time: '16:00',
            duration: 90,
            location: 'H1-101',
            type: 'in-person',
            status: 'scheduled',
            notes: 'Phân phối xác suất',
            createdAt: '2025-10-28',
        },
        {
            id: '8',
            tutorId: '2',
            studentId: '3',
            subject: 'Giải tích 1',
            date: '2025-10-31',
            time: '08:00',
            duration: 120,
            location: 'H1-101',
            type: 'in-person',
            status: 'scheduled',
            notes: 'Giới hạn và liên tục',
            createdAt: '2025-10-28',
        },
        {
            id: '9',
            tutorId: '2',
            studentId: '4',
            subject: 'Đại số tuyến tính',
            date: '2025-10-24',
            time: '14:00',
            duration: 90,
            location: 'H1-201',
            type: 'in-person',
            status: 'completed',
            notes: 'Hệ phương trình tuyến tính',
            createdAt: '2025-10-23',
            rating: 4,
            feedback: 'Bài giảng rất hay, cần thêm bài tập',
        },
        {
            id: '10',
            tutorId: '2',
            studentId: '1',
            subject: 'Giải tích 2',
            date: '2025-10-23',
            time: '10:00',
            duration: 120,
            location: 'Online',
            type: 'online',
            status: 'completed',
            notes: 'Chuỗi Taylor',
            createdAt: '2025-10-22',
            rating: 5,
            feedback: 'Xuất sắc!',
        },
    ],
    profiles: {
        '1': {
            id: '1',
            name: 'Nguyễn Văn Minh',
            email: 'student@hcmut.edu.vn',
            role: 'student',
            faculty: 'KHTN',
            major: 'Toán - Tin học',
            mssv: '2112001',
            phone: '0901234567',
            address: 'KTX Khu A, ĐHQG TP.HCM',
            bio: 'Sinh viên năm 3 chuyên ngành Toán - Tin học',
            gpa: 3.45,
            trainingPoints: 85,
            scholarshipEligible: true,
        },
        '2': {
            id: '2',
            name: 'TS. Nguyễn Văn An',
            email: 'tutor@hcmut.edu.vn',
            role: 'tutor',
            faculty: 'KHTN',
            major: 'Toán học',
            phone: '0987654321',
            bio: 'Giảng viên khoa KHTN, chuyên ngành Giải tích',
            subjects: ['Giải tích 1', 'Giải tích 2', 'Đại số tuyến tính', 'Xác suất thống kê'],
            rating: 4.8,
            totalSessions: 156,
            yearsExperience: 8,
        },
        '3': {
            id: '3',
            name: 'Admin HCMUT',
            email: 'admin@hcmut.edu.vn',
            role: 'admin',
            faculty: 'Phòng Đào tạo',
        },
    },
    reports: {}, // Record<string, any>
    notifications: [], // any[]
    // Khung giờ rảnh của tutor (Available time slots)
    availableSlots: [
        // Tutor ID 2 - TS. Nguyễn Văn An
        { id: '1', tutorId: '2', dayOfWeek: 'monday', startTime: '08:00', endTime: '10:00', isAvailable: true, location: 'H1-101' },
        { id: '2', tutorId: '2', dayOfWeek: 'monday', startTime: '14:00', endTime: '16:00', isAvailable: true, location: 'H1-101' },
        { id: '3', tutorId: '2', dayOfWeek: 'tuesday', startTime: '10:00', endTime: '12:00', isAvailable: true, location: 'Online' },
        { id: '4', tutorId: '2', dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00', isAvailable: true, location: 'H1-201' },
        { id: '5', tutorId: '2', dayOfWeek: 'thursday', startTime: '08:00', endTime: '10:00', isAvailable: true, location: 'H1-101' },
        { id: '6', tutorId: '2', dayOfWeek: 'thursday', startTime: '16:00', endTime: '18:00', isAvailable: true, location: 'Online' },
        { id: '7', tutorId: '2', dayOfWeek: 'friday', startTime: '09:00', endTime: '11:00', isAvailable: true, location: 'H1-101' },
    ], // as any[]
    // Yêu cầu đăng ký từ sinh viên (Registration requests)
    registrationRequests: [
        {
            id: '1',
            studentId: '1',
            tutorId: '2',
            studentName: 'Nguyễn Văn Minh',
            subject: 'Giải tích 2',
            preferredDate: '2025-10-30',
            preferredTime: '14:00-16:00',
            status: 'pending',
            requestDate: '2025-10-27',
            notes: 'Muốn học về chuỗi số và tích phân',
            mssv: '2112001',
        },
        {
            id: '2',
            studentId: '3',
            tutorId: '2',
            studentName: 'Trần Thị Bảo',
            subject: 'Xác suất thống kê',
            preferredDate: '2025-10-29',
            preferredTime: '10:00-12:00',
            status: 'pending',
            requestDate: '2025-10-26',
            notes: 'Cần hỗ trợ về biến ngẫu nhiên và phân phối xác suất',
            mssv: '2112045',
        },
        {
            id: '3',
            studentId: '4',
            tutorId: '2',
            studentName: 'Lê Văn Tâm',
            subject: 'Đại số tuyến tính',
            preferredDate: '2025-10-31',
            preferredTime: '08:00-10:00',
            status: 'pending',
            requestDate: '2025-10-27',
            notes: 'Ôn tập cho kỳ thi giữa kỳ',
            mssv: '2112089',
        },
    ], // as any[]
};

// Helper to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Session API
export const sessionAPI = {
    getUserSessions: async (userId, role) => {
        await delay();
        if (role === 'student') {
            return MOCK_STORAGE.sessions.filter(s => s.studentId === userId);
        } else if (role === 'tutor') {
            return MOCK_STORAGE.sessions.filter(s => s.tutorId === userId);
        }
        return MOCK_STORAGE.sessions;
    },

    getSession: async (sessionId) => {
        await delay();
        return MOCK_STORAGE.sessions.find(s => s.id === sessionId);
    },

    createSession: async (sessionData) => {
        await delay();
        const newSession = {
            id: String(MOCK_STORAGE.sessions.length + 1),
            ...sessionData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        MOCK_STORAGE.sessions.push(newSession);
        return newSession;
    },

    updateSession: async (sessionId, updates) => {
        await delay();
        const index = MOCK_STORAGE.sessions.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            MOCK_STORAGE.sessions[index] = { ...MOCK_STORAGE.sessions[index], ...updates };
            return MOCK_STORAGE.sessions[index];
        }
        throw new Error('Session not found');
    },

    cancelSession: async (sessionId) => {
        await delay();
        const index = MOCK_STORAGE.sessions.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            MOCK_STORAGE.sessions[index].status = 'cancelled';
            return MOCK_STORAGE.sessions[index];
        }
        throw new Error('Session not found');
    },

    rescheduleSession: async (sessionId, newDate, newTime) => {
        await delay();
        const index = MOCK_STORAGE.sessions.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            if (newDate) MOCK_STORAGE.sessions[index].date = newDate;
            if (newTime) MOCK_STORAGE.sessions[index].time = newTime;
            MOCK_STORAGE.sessions[index].status = 'rescheduled';
            return MOCK_STORAGE.sessions[index];
        }
        throw new Error('Session not found');
    },

    addReport: async (sessionId, reportData) => {
        await delay();
        MOCK_STORAGE.reports[sessionId] = {
            ...reportData,
            sessionId,
            createdAt: new Date().toISOString(),
        };

        // Update session status to completed
        const index = MOCK_STORAGE.sessions.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            MOCK_STORAGE.sessions[index].status = 'completed';
        }

        return MOCK_STORAGE.reports[sessionId];
    },

    getReport: async (sessionId) => {
        await delay();
        return MOCK_STORAGE.reports[sessionId];
    },
};

// User/Profile API
export const userAPI = {
    getProfile: async (userId) => {
        await delay();
        const profile = MOCK_STORAGE.profiles[userId];
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    },

    updateProfile: async (userId, updates) => {
        await delay();
        if (MOCK_STORAGE.profiles[userId]) {
            MOCK_STORAGE.profiles[userId] = { ...MOCK_STORAGE.profiles[userId], ...updates };
            return MOCK_STORAGE.profiles[userId];
        }
        throw new Error('Profile not found');
    },

    getAllUsers: async () => {
        await delay();
        return Object.values(MOCK_STORAGE.profiles);
    },

    getTutors: async () => {
        await delay();
        return Object.values(MOCK_STORAGE.profiles).filter((p) => p.role === 'tutor');
    },

    getStudents: async () => {
        await delay();
        return Object.values(MOCK_STORAGE.profiles).filter((p) => p.role === 'student');
    },
};

// Notification API
export const notificationAPI = {
    getUserNotifications: async (userId) => {
        await delay();
        return MOCK_STORAGE.notifications.filter((n) => n.userId === userId);
    },

    createNotification: async (notificationData) => {
        await delay();
        const newNotification = {
            id: String(MOCK_STORAGE.notifications.length + 1),
            ...notificationData,
            createdAt: new Date().toISOString(),
            read: false,
        };
        MOCK_STORAGE.notifications.push(newNotification);
        return newNotification;
    },

    markAsRead: async (notificationId) => {
        await delay();
        const notification = MOCK_STORAGE.notifications.find((n) => n.id === notificationId);
        if (notification) {
            notification.read = true;
            return notification;
        }
        throw new Error('Notification not found');
    },
};

// Auth API (for consistency, though login is handled in LoginScreen)
export const authAPI = {
    signin: async (email, password) => {
        await delay();
        // This should match the MOCK_USERS in LoginScreen
        const users = [
            {
                id: '1',
                email: 'student@hcmut.edu.vn',
                password: 'password123',
                name: 'Nguyễn Văn Minh',
                role: 'student',
                faculty: 'KHTN',
                major: 'Toán - Tin học',
                mssv: '2112001',
            },
            {
                id: '2',
                email: 'tutor@hcmut.edu.vn',
                password: 'password123',
                name: 'TS. Nguyễn Văn An',
                role: 'tutor',
                faculty: 'KHTN',
                major: 'Toán học',
            },
            {
                id: '3',
                email: 'admin@hcmut.edu.vn',
                password: 'password123',
                name: 'Admin HCMUT',
                role: 'admin',
                faculty: 'Phòng Đào tạo',
            },
        ];

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return user;
    },

    signup: async (userData) => {
        await delay();
        const newUser = {
            id: String(Object.keys(MOCK_STORAGE.profiles).length + 1),
            ...userData,
        };
        MOCK_STORAGE.profiles[newUser.id] = newUser;
        return newUser;
    },
};

// Tutor Schedule API - Quản lý lịch rảnh và yêu cầu đăng ký
export const tutorScheduleAPI = {
    // Lấy khung giờ rảnh của tutor
    getAvailableSlots: async (tutorId) => {
        await delay();
        return MOCK_STORAGE.availableSlots.filter(slot => slot.tutorId === tutorId);
    },

    // Cập nhật khung giờ rảnh
    updateAvailableSlots: async (tutorId, slots) => {
        await delay();
        // Remove old slots for this tutor
        MOCK_STORAGE.availableSlots = MOCK_STORAGE.availableSlots.filter(
            slot => slot.tutorId !== tutorId
        );
        // Add new slots
        const newSlots = slots.map((slot, index) => ({
            id: String(Date.now() + index),
            tutorId,
            ...slot,
        }));
        MOCK_STORAGE.availableSlots.push(...newSlots);
        return newSlots;
    },

    // Thêm một khung giờ rảnh mới
    addAvailableSlot: async (tutorId, slotData) => {
        await delay();
        const newSlot = {
            id: String(MOCK_STORAGE.availableSlots.length + 1),
            tutorId,
            ...slotData,
            isAvailable: true,
        };
        MOCK_STORAGE.availableSlots.push(newSlot);
        return newSlot;
    },

    // Xóa khung giờ rảnh
    removeAvailableSlot: async (slotId) => {
        await delay();
        const index = MOCK_STORAGE.availableSlots.findIndex(slot => slot.id === slotId);
        if (index !== -1) {
            MOCK_STORAGE.availableSlots.splice(index, 1);
            return true;
        }
        throw new Error('Slot not found');
    },

    // Lấy yêu cầu đăng ký cho tutor
    getRegistrationRequests: async (tutorId) => {
        await delay();
        return MOCK_STORAGE.registrationRequests.filter(req => req.tutorId === tutorId);
    },

    // Chấp nhận yêu cầu đăng ký
    approveRequest: async (requestId) => {
        await delay();
        const request = MOCK_STORAGE.registrationRequests.find(req => req.id === requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        // Update request status
        request.status = 'approved';

        // Create a new session
        const newSession = {
            id: String(MOCK_STORAGE.sessions.length + 1),
            tutorId: request.tutorId,
            studentId: request.studentId,
            subject: request.subject,
            date: request.preferredDate,
            time: request.preferredTime.split('-')[0], // Get start time
            duration: 120,
            location: 'TBA',
            type: 'in-person',
            status: 'scheduled',
            notes: request.notes,
            createdAt: new Date().toISOString(),
        };
        MOCK_STORAGE.sessions.push(newSession);

        return { request, session: newSession };
    },

    // Từ chối yêu cầu đăng ký
    rejectRequest: async (requestId, reason) => {
        await delay();
        const request = MOCK_STORAGE.registrationRequests.find(req => req.id === requestId);
        if (!request) {
            throw new Error('Request not found');
        }

        request.status = 'rejected';
        if (reason) {
            request.rejectionReason = reason;
        }

        return request;
    },

    // Tạo yêu cầu đăng ký mới (từ phía sinh viên)
    createRegistrationRequest: async (requestData) => {
        await delay();
        const newRequest = {
            id: String(MOCK_STORAGE.registrationRequests.length + 1),
            ...requestData,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
        };
        MOCK_STORAGE.registrationRequests.push(newRequest);
        return newRequest;
    },
};

// Export all APIs
export default {
    sessionAPI,
    userAPI,
    notificationAPI,
    authAPI,
    tutorScheduleAPI,
};