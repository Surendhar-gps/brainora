/**
 * Brainora Data Layer - Clean & Concise Edition
 * Simplified text and descriptions for a clean, minimalist UI
 */

const STORAGE_KEYS = {
    USER_PROFILE: 'brainora_user_v2',
    RESOURCES: 'brainora_resources_v2',
    REVIEWS: 'brainora_reviews_v2',
    ACTIVITIES: 'brainora_activities_v2',
    THEME: 'brainora_theme'
};

// Initial User Profile
const DEFAULT_USER = {
    id: 'user_alex_morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@caltech.edu',
    campus: 'California Institute of Technology (Caltech)',
    department: 'Computer Science',
    year: '3rd Year (Junior)',
    section: 'CS-Alpha',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Junior specializing in Distributed Systems and Algorithmic Optimization.',
    creditsEarned: 340,
    creditsSpent: 180,
    creditsBalance: 340,
    resourcesShared: 14,
    resourcesAccessed: 38,
    averageRating: 4.92,
    totalRatingsReceived: 58,
    helpfulnessScore: 98.4,
    tier: 'Gold Scholar',
    badges: [
        { id: 'b1', name: 'Ambassador', icon: '🏆', color: 'gold', desc: 'Caltech representative' },
        { id: 'b2', name: 'Top 5%', icon: '🌟', color: 'purple', desc: '50+ 5-star ratings' },
        { id: 'b3', name: 'Reciprocal Master', icon: '⚡', color: 'cyan', desc: '30+ resources unlocked' }
    ]
};

// Seed Study Resources - Concise titles & descriptions
const DEFAULT_RESOURCES = [
    {
        id: 'res-101',
        title: 'MIT 6.006: Dynamic Programming & Graph Algorithms',
        format: 'PDF',
        category: 'Computer Science',
        department: 'Computer Science',
        campus: 'MIT',
        author: {
            name: 'Alex Morgan',
            email: 'alex.morgan@caltech.edu',
            department: 'Computer Science',
            year: '3rd Year',
            section: 'CS-Alpha',
            campus: 'Caltech',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: true
        },
        fileDetails: {
            name: 'MIT6006_Algorithms.pdf',
            size: '14.2 MB',
            pages: 48,
            duration: null,
            resolution: null
        },
        description: 'Complete notes on shortest paths, Bellman-Ford, Dijkstra, and dynamic programming patterns.',
        tags: ['Dynamic Programming', 'Graph Theory', 'MIT 6.006'],
        rating: 4.9,
        reviewsCount: 68,
        downloads: 842,
        views: 2410,
        creditsCost: 5,
        uploadedAt: '2026-10-18T14:22:00Z',
        isFeatured: true,
        previewType: 'pdf'
    },
    {
        id: 'res-102',
        title: 'Stanford CS229: Machine Learning & Gradient Descent',
        format: 'PNG',
        category: 'Data Science & AI',
        department: 'Computer Science',
        campus: 'Stanford University',
        author: {
            name: 'Sophia Chen',
            email: 'sophia.c@stanford.edu',
            department: 'AI & Robotics',
            year: '4th Year',
            section: 'AI-Lab',
            campus: 'Stanford',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: false
        },
        fileDetails: {
            name: 'CS229_CheatSheet.png',
            size: '8.4 MB',
            pages: null,
            duration: null,
            resolution: '3840 x 2160'
        },
        description: 'Convex optimization, cross-entropy loss, backprop graphs, and regularization cheat sheet.',
        tags: ['Machine Learning', 'Cheat Sheet', 'Optimization'],
        rating: 5.0,
        reviewsCount: 114,
        downloads: 1420,
        views: 4890,
        creditsCost: 5,
        uploadedAt: '2026-10-22T09:15:00Z',
        isFeatured: true,
        previewType: 'png'
    },
    {
        id: 'res-103',
        title: 'UC Berkeley CS61A: Tree Recursion Walkthrough',
        format: 'MP4',
        category: 'Computer Science',
        department: 'Computer Science',
        campus: 'UC Berkeley',
        author: {
            name: 'Marcus Vance',
            email: 'mvance@berkeley.edu',
            department: 'Computer Science',
            year: '2nd Year',
            section: 'Dis-1',
            campus: 'UC Berkeley',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: false
        },
        fileDetails: {
            name: 'CS61A_Recursion.mp4',
            size: '142.8 MB',
            pages: null,
            duration: '28:45',
            resolution: '1080p 60fps'
        },
        description: 'Whiteboard walkthrough of recursion trees, memoization, and exam problem solutions.',
        tags: ['Python', 'Recursion', 'UC Berkeley'],
        rating: 4.8,
        reviewsCount: 39,
        downloads: 620,
        views: 1850,
        creditsCost: 8,
        uploadedAt: '2026-10-25T11:40:00Z',
        isFeatured: true,
        previewType: 'mp4'
    },
    {
        id: 'res-104',
        title: 'CMU 15-213: Computer Systems & Architecture',
        format: 'PNG',
        category: 'Computer Science',
        department: 'Computer Science',
        campus: 'Carnegie Mellon University',
        author: {
            name: 'Alex Morgan',
            email: 'alex.morgan@caltech.edu',
            department: 'Computer Science',
            year: '3rd Year',
            section: 'CS-Alpha',
            campus: 'Caltech',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: true
        },
        fileDetails: {
            name: 'CMU_x86_Registers.png',
            size: '6.9 MB',
            pages: null,
            duration: null,
            resolution: '4096 x 2304'
        },
        description: 'x86-64 register layout, calling conventions, and stack frame diagrams.',
        tags: ['Assembly', 'Systems', 'CMU'],
        rating: 4.9,
        reviewsCount: 45,
        downloads: 512,
        views: 1620,
        creditsCost: 5,
        uploadedAt: '2026-10-12T16:00:00Z',
        isFeatured: false,
        previewType: 'png'
    },
    {
        id: 'res-105',
        title: 'Harvard CS50: Memory Management & Pointers',
        format: 'PDF',
        category: 'Computer Science',
        department: 'Computer Science',
        campus: 'Harvard University',
        author: {
            name: 'David Lin',
            email: 'david.lin@harvard.edu',
            department: 'Computer Science',
            year: '1st Year',
            section: 'TF-B',
            campus: 'Harvard',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: false
        },
        fileDetails: {
            name: 'CS50_Pointers_Guide.pdf',
            size: '9.8 MB',
            pages: 32,
            duration: null,
            resolution: null
        },
        description: 'Dynamic memory allocation (malloc/free), pointer arithmetic, and debugging.',
        tags: ['C Programming', 'Pointers', 'Memory'],
        rating: 4.9,
        reviewsCount: 92,
        downloads: 1210,
        views: 3400,
        creditsCost: 5,
        uploadedAt: '2026-10-08T08:30:00Z',
        isFeatured: false,
        previewType: 'pdf'
    },
    {
        id: 'res-106',
        title: 'Oxford Math 201: Multivariable Calculus & Stokes Theorem',
        format: 'MP4',
        category: 'Mathematics',
        department: 'Mathematics',
        campus: 'University of Oxford',
        author: {
            name: 'Emily Watson',
            email: 'emily.watson@ox.ac.uk',
            department: 'Mathematics',
            year: '3rd Year',
            section: 'Pure-Math',
            campus: 'Oxford',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: false
        },
        fileDetails: {
            name: 'Oxford_M201_Stokes.mp4',
            size: '185.0 MB',
            pages: null,
            duration: '34:10',
            resolution: '1080p'
        },
        description: 'Geometric derivations of Curl, Divergence, Green’s Theorem, and Stokes’ Theorem.',
        tags: ['Calculus', 'Vector Analysis', 'Oxford'],
        rating: 4.7,
        reviewsCount: 28,
        downloads: 410,
        views: 1190,
        creditsCost: 8,
        uploadedAt: '2026-10-15T18:10:00Z',
        isFeatured: false,
        previewType: 'mp4'
    },
    {
        id: 'res-107',
        title: 'Caltech Ph 12b: Quantum Mechanics Wave Functions',
        format: 'PDF',
        category: 'Physics',
        department: 'Physics',
        campus: 'Caltech',
        author: {
            name: 'Alex Morgan',
            email: 'alex.morgan@caltech.edu',
            department: 'Computer Science',
            year: '3rd Year',
            section: 'CS-Alpha',
            campus: 'Caltech',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: true
        },
        fileDetails: {
            name: 'Caltech_Ph12b_Quantum.pdf',
            size: '11.5 MB',
            pages: 36,
            duration: null,
            resolution: null
        },
        description: 'Schrödinger equation, Hermitian operators, and harmonic oscillator ladder algebra.',
        tags: ['Quantum Mechanics', 'Physics', 'Caltech'],
        rating: 5.0,
        reviewsCount: 41,
        downloads: 489,
        views: 1330,
        creditsCost: 5,
        uploadedAt: '2026-10-02T10:00:00Z',
        isFeatured: false,
        previewType: 'pdf'
    },
    {
        id: 'res-108',
        title: 'Georgia Tech CS 7641: Neural Networks & Backprop',
        format: 'PDF',
        category: 'Data Science & AI',
        department: 'Computer Science',
        campus: 'Georgia Tech',
        author: {
            name: 'Kevin Patel',
            email: 'kpatel@gatech.edu',
            department: 'Computer Science',
            year: '4th Year',
            section: 'ML-Grad',
            campus: 'Georgia Tech',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
            isCurrentUser: false
        },
        fileDetails: {
            name: 'Gatech_CS7641_Backprop.pdf',
            size: '8.1 MB',
            pages: 24,
            duration: null,
            resolution: null
        },
        description: 'Matrix calculus, multi-layer perceptron gradients, and backpropagation derivations.',
        tags: ['Neural Networks', 'Deep Learning', 'Georgia Tech'],
        rating: 5.0,
        reviewsCount: 53,
        downloads: 870,
        views: 2650,
        creditsCost: 5,
        uploadedAt: '2026-10-20T12:05:00Z',
        isFeatured: false,
        previewType: 'pdf'
    }
];

// Seed Reviews - Punchy & concise
const DEFAULT_REVIEWS = [
    {
        id: 'rev-01',
        resourceId: 'res-101',
        resourceTitle: 'MIT 6.006: Dynamic Programming & Graph Algorithms',
        resourceFormat: 'PDF',
        reviewer: {
            name: 'Elena Rostova',
            campus: 'UC Berkeley',
            department: 'Computer Science',
            year: '3rd Year',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        },
        rating: 5,
        date: 'Oct 28, 2026',
        comment: 'These notes saved my Algorithms midterm! The knapsack and Fibonacci state transitions are super clear.',
        helpfulCount: 24,
        isVerifiedIntercampus: true
    },
    {
        id: 'rev-02',
        resourceId: 'res-101',
        resourceTitle: 'MIT 6.006: Dynamic Programming & Graph Algorithms',
        resourceFormat: 'PDF',
        reviewer: {
            name: 'Julian Thorne',
            campus: 'Stanford University',
            department: 'Symbolic Systems',
            year: '2nd Year',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80'
        },
        rating: 5,
        date: 'Oct 25, 2026',
        comment: 'Outstanding diagrams for Dijkstra and Bellman-Ford relaxation. Shortest path logic clicked immediately.',
        helpfulCount: 19,
        isVerifiedIntercampus: true
    },
    {
        id: 'rev-03',
        resourceId: 'res-104',
        resourceTitle: 'CMU 15-213: Computer Systems & Architecture',
        resourceFormat: 'PNG',
        reviewer: {
            name: 'Devon Miller',
            campus: 'Carnegie Mellon',
            department: 'ECE',
            year: '2nd Year',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
        },
        rating: 5,
        date: 'Oct 23, 2026',
        comment: 'Clean x86-64 register layout. Having this on my desk during the lab assignment was a game changer.',
        helpfulCount: 31,
        isVerifiedIntercampus: true
    },
    {
        id: 'rev-04',
        resourceId: 'res-107',
        resourceTitle: 'Caltech Ph 12b: Quantum Mechanics Wave Functions',
        resourceFormat: 'PDF',
        reviewer: {
            name: 'Aisha Al-Mansoor',
            campus: 'Princeton University',
            department: 'Physics',
            year: '4th Year',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        rating: 5,
        date: 'Oct 20, 2026',
        comment: 'Elegant ladder operator derivation. Commutation relations are explained with great rigor.',
        helpfulCount: 15,
        isVerifiedIntercampus: true
    },
    {
        id: 'rev-05',
        resourceId: 'res-101',
        resourceTitle: 'MIT 6.006: Dynamic Programming & Graph Algorithms',
        resourceFormat: 'PDF',
        reviewer: {
            name: 'Liam Zhang',
            campus: 'Univ. of Washington',
            department: 'Computer Science',
            year: '3rd Year',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
        },
        rating: 4,
        date: 'Oct 14, 2026',
        comment: 'Great resource. Floyd-Warshall and Bellman-Ford sections are top tier.',
        helpfulCount: 8,
        isVerifiedIntercampus: true
    },
    {
        id: 'rev-06',
        resourceId: 'res-104',
        resourceTitle: 'CMU 15-213: Computer Systems & Architecture',
        resourceFormat: 'PNG',
        reviewer: {
            name: 'Samantha Reed',
            campus: 'Cornell Tech',
            department: 'Info Science',
            year: 'Graduate',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
        },
        rating: 5,
        date: 'Oct 09, 2026',
        comment: 'The stack alignment diagram clarifies the 16-byte boundary requirement on Linux x86-64.',
        helpfulCount: 12,
        isVerifiedIntercampus: true
    }
];

// Seed Activities - Short & punchy
const DEFAULT_ACTIVITIES = [
    {
        id: 'act-01',
        type: 'download',
        icon: '📥',
        color: 'cyan',
        text: 'Elena (UC Berkeley) unlocked your MIT 6.006 PDF',
        time: '18m ago',
        creditsChange: '+5 Credits'
    },
    {
        id: 'act-02',
        type: 'review',
        icon: '⭐',
        color: 'gold',
        text: 'Julian (Stanford) rated your MIT 6.006 Notes 5★',
        time: '3h ago',
        creditsChange: '+10 Credits'
    },
    {
        id: 'act-03',
        type: 'access',
        icon: '🔓',
        color: 'indigo',
        text: 'You unlocked Stanford CS229 Visual Guide',
        time: 'Yesterday',
        creditsChange: '-5 Credits'
    },
    {
        id: 'act-04',
        type: 'upload',
        icon: '📤',
        color: 'emerald',
        text: 'CMU 15-213 Cheat Sheet published',
        time: '2d ago',
        creditsChange: '+20 Credits'
    },
    {
        id: 'act-05',
        type: 'badge',
        icon: '🏆',
        color: 'purple',
        text: 'Earned "Top 5% Contributor" Badge',
        time: '3d ago',
        creditsChange: '+25 Credits'
    }
];

// Database Store
class BrainoraStore {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
            localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
        }
        if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
            localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(DEFAULT_RESOURCES));
        }
        if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
            localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
            localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
        }
    }

    getUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) || DEFAULT_USER;
        } catch (e) {
            return DEFAULT_USER;
        }
    }

    updateUser(userData) {
        const current = this.getUser();
        const updated = { ...current, ...userData };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
        return updated;
    }

    getResources() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES)) || DEFAULT_RESOURCES;
        } catch (e) {
            return DEFAULT_RESOURCES;
        }
    }

    addResource(resource) {
        const resources = this.getResources();
        resources.unshift(resource);
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));

        const user = this.getUser();
        user.resourcesShared += 1;
        user.creditsEarned += 20;
        user.creditsBalance += 20;
        this.updateUser(user);

        this.addActivity({
            type: 'upload',
            icon: '📤',
            color: 'emerald',
            text: `You shared "${resource.title}" (${resource.format})`,
            time: 'Just now',
            creditsChange: '+20 Credits'
        });

        return resource;
    }

    getReviews() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS)) || DEFAULT_REVIEWS;
        } catch (e) {
            return DEFAULT_REVIEWS;
        }
    }

    addReview(review) {
        const reviews = this.getReviews();
        reviews.unshift(review);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

        const user = this.getUser();
        user.totalRatingsReceived += 1;
        const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
        user.averageRating = Number((totalScore / reviews.length).toFixed(2));
        user.creditsEarned += 10;
        user.creditsBalance += 10;
        this.updateUser(user);

        this.addActivity({
            type: 'review',
            icon: '⭐',
            color: 'gold',
            text: `${review.reviewer.name} rated "${review.resourceTitle}" ${review.rating}★`,
            time: 'Just now',
            creditsChange: '+10 Credits'
        });

        return review;
    }

    getActivities() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || DEFAULT_ACTIVITIES;
        } catch (e) {
            return DEFAULT_ACTIVITIES;
        }
    }

    addActivity(activity) {
        const acts = this.getActivities();
        acts.unshift({
            id: 'act-' + Date.now(),
            ...activity
        });
        if (acts.length > 20) acts.pop();
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(acts));
    }

    accessResource(resourceId) {
        const resources = this.getResources();
        const res = resources.find(r => r.id === resourceId);
        if (!res) return null;

        const user = this.getUser();
        if (user.creditsBalance < (res.creditsCost || 5) && !res.author.isCurrentUser) {
            return { success: false, message: 'Need more credits. Upload notes to earn.' };
        }

        if (!res.author.isCurrentUser) {
            user.creditsSpent += (res.creditsCost || 5);
            user.creditsBalance -= (res.creditsCost || 5);
            user.resourcesAccessed += 1;
            this.updateUser(user);

            res.downloads = (res.downloads || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));

            this.addActivity({
                type: 'access',
                icon: '🔓',
                color: 'cyan',
                text: `You unlocked "${res.title}"`,
                time: 'Just now',
                creditsChange: `-${res.creditsCost || 5} Credits`
            });
        }

        return { success: true, resource: res, user };
    }
}

// Global store instance
window.BrainoraDB = new BrainoraStore();
