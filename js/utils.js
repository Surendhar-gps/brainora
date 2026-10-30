/**
 * Brainora Utilities
 * Helper functions for UI rendering, toast alerts, star ratings, and file handlers.
 */

const Utils = {
    /**
     * Show a modern floating toast notification
     */
    toast(message, type = 'info', title = null) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: '✅',
            error: '⚠️',
            info: '💡',
            credit: '⚡',
            network: '🌐'
        };

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type} animate-slide-in`;
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || '🔔'}</div>
            <div class="toast-body">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
            }
        }, 4200);
    },

    /**
     * Generate HTML for star rating (e.g. 4.8 out of 5)
     */
    renderStars(rating, totalReviews = null) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.4;
        let starsHtml = '<span class="star-group">';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<span class="star star-filled">★</span>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHtml += '<span class="star star-half">★</span>';
            } else {
                starsHtml += '<span class="star star-empty">★</span>';
            }
        }
        starsHtml += '</span>';

        if (totalReviews !== null) {
            starsHtml += `<span class="rating-number">${Number(rating).toFixed(1)}</span> <span class="rating-count">(${totalReviews})</span>`;
        }

        return starsHtml;
    },

    /**
     * Return formatted format badge HTML (PDF, PNG, MP4)
     */
    renderFormatBadge(format) {
        const fmt = (format || 'PDF').toUpperCase();
        const config = {
            PDF: {
                icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
                label: 'PDF Notes',
                className: 'badge-format-pdf'
            },
            PNG: {
                icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
                label: 'PNG Diagram',
                className: 'badge-format-png'
            },
            MP4: {
                icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
                label: 'MP4 Tutorial',
                className: 'badge-format-mp4'
            }
        };

        const item = config[fmt] || config.PDF;
        return `<span class="format-badge ${item.className}">${item.icon} <span>${item.label}</span></span>`;
    },

    /**
     * Format byte sizes
     */
    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    /**
     * Format dates into human-readable format
     */
    formatRelativeDate(dateStr) {
        if (!dateStr) return 'Recently';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        const now = new Date();
        const diffMs = now - d;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    /**
     * Creates an actual downloadable file blob for realistic testing
     */
    triggerDownload(resource) {
        let content = '';
        let mimeType = 'text/plain';
        let extension = 'txt';

        const format = (resource.format || 'PDF').toUpperCase();

        if (format === 'PDF') {
            mimeType = 'application/pdf';
            extension = 'pdf';
            // Simple PDF-compatible text representation or markdown summary
            content = `%PDF-1.4\n% BRAINORA INTERCAMPUS STUDY RESOURCE\nTitle: ${resource.title}\nContributor: ${resource.author.name} (${resource.campus})\nDepartment: ${resource.department}\nRating: ${resource.rating}/5.0\n\n=== STUDY NOTES SUMMARY ===\n${resource.description}\n\nKey Concepts Covered:\n- ${resource.tags.join('\n- ')}\n\n(Downloaded from Brainora Intercampus Network)`;
        } else if (format === 'PNG') {
            mimeType = 'text/plain';
            extension = 'png.info.txt';
            content = `BRAINORA HIGH RESOLUTION CHEAT SHEET METADATA\nTitle: ${resource.title}\nAuthor: ${resource.author.name}\nResolution: ${resource.fileDetails?.resolution || '4K'}\nNotes: ${resource.description}`;
        } else if (format === 'MP4') {
            mimeType = 'text/plain';
            extension = 'mp4.transcript.txt';
            content = `BRAINORA INTERCAMPUS VIDEO TUTORIAL TRANSCRIPT & SLIDES\nLecture: ${resource.title}\nPresenter: ${resource.author.name} (${resource.campus})\nDuration: ${resource.fileDetails?.duration || '25 mins'}\n\nLecture Overview:\n${resource.description}`;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resource.fileDetails?.name || `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.Utils = Utils;
