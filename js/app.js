/**
 * Brainora - Core Application Controller
 * Manages view routing, interactive dropzone uploads, resource discovery,
 * ratings & reviews, student profile, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Active Resource for Modal
    let activePreviewResource = null;
    let selectedUploadFile = null;

    // View Titles Configuration
    const VIEW_TITLES = {
        dashboard: {
            title: 'Dashboard',
            subtitle: 'Overview & quick stats'
        },
        uploads: {
            title: 'Upload Material',
            subtitle: 'Share notes & earn credits'
        },
        resources: {
            title: 'Resources',
            subtitle: 'Browse materials across campuses'
        },
        reviews: {
            title: 'Ratings & Reviews',
            subtitle: 'Feedback on your shared materials'
        },
        profile: {
            title: 'Profile',
            subtitle: 'Your credentials and shared materials'
        }
    };

    /* ==========================================================================
       1. ROUTING & VIEW SWITCHING
       ========================================================================== */
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.view-section');
    const pageTitleEl = document.getElementById('current-page-title');
    const pageSubtitleEl = document.getElementById('current-page-subtitle');
    const mobileSidebar = document.getElementById('app-sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

    function switchView(targetViewId) {
        // Validate target
        const sectionExists = document.getElementById(`section-${targetViewId}`);
        if (!sectionExists) targetViewId = 'dashboard';

        // Update nav links active state
        navLinks.forEach(link => {
            if (link.dataset.target === targetViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Hide all sections, display target
        sections.forEach(sec => {
            sec.classList.remove('active-view');
        });
        const targetSection = document.getElementById(`section-${targetViewId}`);
        if (targetSection) {
            targetSection.classList.add('active-view');
        }

        // Update Header Titles
        const meta = VIEW_TITLES[targetViewId] || VIEW_TITLES.dashboard;
        if (pageTitleEl) pageTitleEl.textContent = meta.title;
        if (pageSubtitleEl) pageSubtitleEl.textContent = meta.subtitle;

        // Close mobile drawer if open
        if (mobileSidebar) mobileSidebar.classList.remove('open');

        // Refresh section content
        if (targetViewId === 'dashboard') renderDashboard();
        if (targetViewId === 'uploads') populateUploadsFormWithUserData();
        if (targetViewId === 'resources') renderResources();
        if (targetViewId === 'reviews') renderReviews();
        if (targetViewId === 'profile') renderProfile();

        // Update window hash
        window.location.hash = targetViewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Nav link click events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            switchView(target);
        });
    });

    // Mobile Menu Controls
    if (mobileMenuBtn && mobileSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileSidebar.classList.add('open');
        });
    }
    if (sidebarCloseBtn && mobileSidebar) {
        sidebarCloseBtn.addEventListener('click', () => {
            mobileSidebar.classList.remove('open');
        });
    }

    // Quick upload buttons
    const headerQuickUploadBtn = document.getElementById('header-quick-upload-btn');
    if (headerQuickUploadBtn) {
        headerQuickUploadBtn.addEventListener('click', () => switchView('uploads'));
    }
    const dashViewAllBtn = document.getElementById('dash-view-all-resources');
    if (dashViewAllBtn) {
        dashViewAllBtn.addEventListener('click', () => switchView('resources'));
    }
    const profileUploadBtn = document.getElementById('profile-upload-btn');
    if (profileUploadBtn) {
        profileUploadBtn.addEventListener('click', () => switchView('uploads'));
    }
    const sidebarUserCard = document.getElementById('sidebar-user-card');
    if (sidebarUserCard) {
        sidebarUserCard.addEventListener('click', () => switchView('profile'));
    }

    /* ==========================================================================
       2. THEME TOGGLER (DARK / LIGHT)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const themeIconLight = document.getElementById('theme-icon-light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);

        if (theme === 'light') {
            if (themeIconDark) themeIconDark.style.display = 'none';
            if (themeIconLight) themeIconLight.style.display = 'block';
        } else {
            if (themeIconDark) themeIconDark.style.display = 'block';
            if (themeIconLight) themeIconLight.style.display = 'none';
        }
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            Utils.toast(`Switched to ${nextTheme} mode`, 'info');
        });
    }

    /* ==========================================================================
       3. GLOBAL HEADER SEARCH
       ========================================================================== */
    const globalSearchInput = document.getElementById('global-search-input');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = globalSearchInput.value.trim();
                if (val) {
                    switchView('resources');
                    const resSearch = document.getElementById('resource-search-input');
                    if (resSearch) {
                        resSearch.value = val;
                        renderResources();
                    }
                }
            }
        });
    }

    /* ==========================================================================
       4. DASHBOARD SECTION RENDERING
       ========================================================================== */
    function renderDashboard() {
        const user = BrainoraDB.getUser();
        const resources = BrainoraDB.getResources();
        const activities = BrainoraDB.getActivities();

        // Update Header & Mini Cards
        updateGlobalUserWidgets(user);

        // Hero Greeting
        const dashGreeting = document.getElementById('dash-greeting');
        if (dashGreeting) {
            dashGreeting.textContent = `Welcome, ${user.name}`;
        }
        const dashHeroCampus = document.getElementById('dash-hero-campus');
        if (dashHeroCampus) dashHeroCampus.textContent = user.campus.split('(')[0].trim();
        const dashHeroTier = document.getElementById('dash-hero-tier');
        if (dashHeroTier) dashHeroTier.textContent = user.tier || 'Gold Scholar';

        // Summary Cards
        const statCreditsEarned = document.getElementById('stat-credits-earned');
        if (statCreditsEarned) statCreditsEarned.textContent = user.creditsEarned;
        const statCreditsBalance = document.getElementById('stat-credits-balance');
        if (statCreditsBalance) statCreditsBalance.textContent = `${user.creditsBalance} ⚡`;

        const statResourcesShared = document.getElementById('stat-resources-shared');
        if (statResourcesShared) statResourcesShared.textContent = user.resourcesShared;

        const statResourcesAccessed = document.getElementById('stat-resources-accessed');
        if (statResourcesAccessed) statResourcesAccessed.textContent = user.resourcesAccessed;

        const statAvgRating = document.getElementById('stat-avg-rating');
        if (statAvgRating) statAvgRating.textContent = Number(user.averageRating).toFixed(2);

        // Recommended Resources (pick 3 non-user resources or top rated)
        const recContainer = document.getElementById('dashboard-recommended-list');
        if (recContainer) {
            const recommended = resources.filter(r => !r.author.isCurrentUser).slice(0, 3);
            if (recommended.length === 0) {
                recContainer.innerHTML = '<div style="color: var(--text-muted); padding: 1rem;">No recommendations currently.</div>';
            } else {
                recContainer.innerHTML = recommended.map(r => `
                    <div class="rec-card" data-id="${r.id}">
                        <div class="rec-main-info">
                            <div class="rec-format-row">
                                ${Utils.renderFormatBadge(r.format)}
                                <span class="rec-campus-badge">${r.campus}</span>
                            </div>
                            <div class="rec-title" title="${r.title}">${r.title}</div>
                            <div class="rec-author-row">
                                <span>By ${r.author.name}</span>
                                <span>•</span>
                                <span>${Utils.renderStars(r.rating, r.reviewsCount)}</span>
                            </div>
                        </div>
                        <button class="rec-action-btn btn-quick-preview" data-id="${r.id}">
                            <span>Preview</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                `).join('');

                // Attach click listeners to recommendations
                recContainer.querySelectorAll('.btn-quick-preview').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const rId = btn.dataset.id;
                        openResourcePreview(rId);
                    });
                });
                recContainer.querySelectorAll('.rec-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const rId = card.dataset.id;
                        openResourcePreview(rId);
                    });
                });
            }
        }

        // Recent Activity Feed
        const actContainer = document.getElementById('dashboard-activity-feed');
        if (actContainer) {
            const displayActs = activities.slice(0, 5);
            actContainer.innerHTML = displayActs.map(act => `
                <div class="activity-item">
                    <div class="activity-icon-bubble">${act.icon}</div>
                    <div class="activity-details">
                        <div class="activity-text">${act.text}</div>
                        <div class="activity-meta">
                            <span>${act.time}</span>
                            <span class="activity-credit-badge ${act.creditsChange.startsWith('+') ? 'credit-plus' : 'credit-minus'}">
                                ${act.creditsChange}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    function updateGlobalUserWidgets(user) {
        // Header
        const headerCredits = document.getElementById('header-credits-count');
        if (headerCredits) headerCredits.textContent = `${user.creditsBalance} Credits`;

        // Sidebar
        const sideAvatar = document.getElementById('sidebar-user-avatar');
        if (sideAvatar) sideAvatar.src = user.avatar;
        const sideName = document.getElementById('sidebar-user-name');
        if (sideName) sideName.textContent = user.name;
        const sideDept = document.getElementById('sidebar-user-dept');
        if (sideDept) sideDept.textContent = `${user.campus.split(' ')[0]} • ${user.department.split(' ')[0]}`;
        const sideCredits = document.getElementById('sidebar-user-credits');
        if (sideCredits) sideCredits.textContent = user.creditsBalance;

        // Resource & Review count badges in sidebar
        const resources = BrainoraDB.getResources();
        const reviews = BrainoraDB.getReviews();
        const sideResCount = document.getElementById('sidebar-resource-count');
        if (sideResCount) sideResCount.textContent = resources.length;
        const sideRevCount = document.getElementById('sidebar-review-count');
        if (sideRevCount) sideRevCount.textContent = reviews.length;
    }

    /* ==========================================================================
       5. UPLOADS SECTION (PNG, PDF, MP4 SUPPORT & VALIDATION)
       ========================================================================== */
    const formatOptionCards = document.querySelectorAll('.format-option-card');
    const uploadFormatInput = document.getElementById('upload-format-input');
    const fileInput = document.getElementById('file-input');
    const dropzone = document.getElementById('upload-dropzone');
    const dropzoneAcceptedHint = document.getElementById('dropzone-accepted-hint');
    const dropzoneBrowseTrigger = document.getElementById('dropzone-browse-trigger');
    const filePreviewStrip = document.getElementById('file-preview-strip');
    const previewPillType = document.getElementById('preview-pill-type');
    const previewFileName = document.getElementById('preview-file-name');
    const previewFileSize = document.getElementById('preview-file-size');
    const fileRemoveBtn = document.getElementById('file-remove-btn');
    const uploadForm = document.getElementById('upload-form');

    // Format selection triggers
    const FORMAT_CONFIG = {
        PDF: { accept: '.pdf,application/pdf', hint: 'Accepts PDF documents (Lecture notes, cheat sheets) up to 50MB' },
        PNG: { accept: '.png,image/png', hint: 'Accepts PNG high-res graphics & scanned diagram boards up to 25MB' },
        MP4: { accept: '.mp4,video/mp4', hint: 'Accepts MP4 video explanations (1080p, H.264) up to 200MB' }
    };

    formatOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            const format = card.dataset.format;
            formatOptionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (uploadFormatInput) uploadFormatInput.value = format;

            const cfg = FORMAT_CONFIG[format] || FORMAT_CONFIG.PDF;
            if (fileInput) fileInput.setAttribute('accept', cfg.accept);
            if (dropzoneAcceptedHint) dropzoneAcceptedHint.textContent = cfg.hint;

            // Clear previously chosen file if wrong format
            if (selectedUploadFile) {
                const ext = selectedUploadFile.name.split('.').pop().toLowerCase();
                if ((format === 'PDF' && ext !== 'pdf') ||
                    (format === 'PNG' && ext !== 'png') ||
                    (format === 'MP4' && ext !== 'mp4')) {
                    clearSelectedFile();
                }
            }
        });
    });

    // Browse file trigger
    if (dropzoneBrowseTrigger && fileInput) {
        dropzoneBrowseTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
    }

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files.length > 0) {
                handleFileUpload(fileInput.files[0]);
            }
        });
    }

    function handleFileUpload(file) {
        const selectedFormat = uploadFormatInput.value;
        const ext = file.name.split('.').pop().toLowerCase();

        // Validate format compatibility
        if (selectedFormat === 'PDF' && ext !== 'pdf') {
            Utils.toast('Please select a PDF file or switch format tab to ' + ext.toUpperCase(), 'error', 'Format Mismatch');
            return;
        }
        if (selectedFormat === 'PNG' && ext !== 'png') {
            Utils.toast('Please select a PNG image file or switch format tab to ' + ext.toUpperCase(), 'error', 'Format Mismatch');
            return;
        }
        if (selectedFormat === 'MP4' && ext !== 'mp4') {
            Utils.toast('Please select an MP4 video file or switch format tab to ' + ext.toUpperCase(), 'error', 'Format Mismatch');
            return;
        }

        // File size limit checks
        const sizeMB = file.size / (1024 * 1024);
        if (selectedFormat === 'PNG' && sizeMB > 25) {
            Utils.toast('PNG diagrams must be under 25MB.', 'error', 'File Too Large');
            return;
        }
        if (selectedFormat === 'PDF' && sizeMB > 50) {
            Utils.toast('PDF documents must be under 50MB.', 'error', 'File Too Large');
            return;
        }
        if (selectedFormat === 'MP4' && sizeMB > 200) {
            Utils.toast('MP4 videos must be under 200MB.', 'error', 'File Too Large');
            return;
        }

        selectedUploadFile = file;

        // Display preview strip
        if (filePreviewStrip) filePreviewStrip.classList.add('active');
        if (previewPillType) previewPillType.textContent = selectedFormat;
        if (previewFileName) previewFileName.textContent = file.name;
        if (previewFileSize) previewFileSize.textContent = Utils.formatFileSize(file.size);

        Utils.toast(`Loaded "${file.name}" ready for upload`, 'success');
    }

    function clearSelectedFile() {
        selectedUploadFile = null;
        if (fileInput) fileInput.value = '';
        if (filePreviewStrip) filePreviewStrip.classList.remove('active');
    }

    if (fileRemoveBtn) {
        fileRemoveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearSelectedFile();
        });
    }

    function populateUploadsFormWithUserData() {
        const user = BrainoraDB.getUser();
        const studentNameInput = document.getElementById('student-name');
        const studentEmailInput = document.getElementById('student-email');
        const studentSectionInput = document.getElementById('student-section');

        if (studentNameInput && !studentNameInput.value) studentNameInput.value = user.name;
        if (studentEmailInput && !studentEmailInput.value) studentEmailInput.value = user.email;
        if (studentSectionInput && !studentSectionInput.value) studentSectionInput.value = user.section;
    }

    // Submit Upload Form
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate that file is attached
            if (!selectedUploadFile) {
                // If user didn't pick local file, synthesize a file name for realistic demonstration
                const fmt = uploadFormatInput.value;
                const titleSlug = (document.getElementById('resource-title')?.value || 'Study_Material').replace(/[^a-z0-9]/gi, '_');
                selectedUploadFile = {
                    name: `${titleSlug}_Approved.${fmt.toLowerCase()}`,
                    size: fmt === 'MP4' ? 124000000 : (fmt === 'PDF' ? 14200000 : 8500000)
                };
            }

            const format = uploadFormatInput.value;
            const name = document.getElementById('student-name').value.trim();
            const email = document.getElementById('student-email').value.trim();
            const department = document.getElementById('student-department').value;
            const year = document.getElementById('student-year').value;
            const section = document.getElementById('student-section').value.trim();

            const title = document.getElementById('resource-title').value.trim();
            const category = document.getElementById('resource-category').value;
            const description = document.getElementById('resource-description').value.trim();
            const tagsInput = document.getElementById('resource-tags').value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [category, format];

            const user = BrainoraDB.getUser();

            // Build new resource record
            const newResource = {
                id: 'res-' + Date.now(),
                title: title,
                format: format,
                category: category,
                department: department,
                campus: user.campus,
                author: {
                    name: name || user.name,
                    email: email || user.email,
                    department: department,
                    year: year,
                    section: section,
                    campus: user.campus,
                    avatar: user.avatar,
                    isCurrentUser: true
                },
                fileDetails: {
                    name: selectedUploadFile.name,
                    size: Utils.formatFileSize(selectedUploadFile.size || 10485760),
                    pages: format === 'PDF' ? 32 : null,
                    duration: format === 'MP4' ? '18:40' : null,
                    resolution: format === 'PNG' ? '3840 x 2160' : null
                },
                description: description,
                tags: tags,
                rating: 5.0,
                reviewsCount: 1,
                downloads: 0,
                views: 1,
                creditsCost: 5,
                uploadedAt: new Date().toISOString(),
                isFeatured: true,
                previewType: format.toLowerCase()
            };

            // Add to database
            BrainoraDB.addResource(newResource);

            // Toast reward notification
            Utils.toast(`"${title}" published! +20 Credits awarded to your account!`, 'credit', 'Upload Verified 🎉');

            // Reset form
            uploadForm.reset();
            clearSelectedFile();
            populateUploadsFormWithUserData();

            // Redirect smoothly to Resources tab to show the new card
            setTimeout(() => {
                switchView('resources');
            }, 800);
        });
    }

    /* ==========================================================================
       6. RESOURCES SECTION (SEARCH, FILTERS, CARDS, PREVIEW)
       ========================================================================== */
    let currentFormatFilter = 'all';
    let currentDeptFilter = 'all';
    let currentSortFilter = 'popular';

    const resSearchInput = document.getElementById('resource-search-input');
    const resDeptFilterSelect = document.getElementById('resource-dept-filter');
    const resSortFilterSelect = document.getElementById('resource-sort-filter');
    const fmtTabButtons = document.querySelectorAll('.format-pill-tabs .fmt-tab-btn');
    const resourcesGrid = document.getElementById('resources-grid-container');

    // Format Tab Filter Buttons
    fmtTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.dataset.format) return;
            fmtTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFormatFilter = btn.dataset.format;
            renderResources();
        });
    });

    if (resSearchInput) {
        resSearchInput.addEventListener('input', () => renderResources());
    }
    if (resDeptFilterSelect) {
        resDeptFilterSelect.addEventListener('change', (e) => {
            currentDeptFilter = e.target.value;
            renderResources();
        });
    }
    if (resSortFilterSelect) {
        resSortFilterSelect.addEventListener('change', (e) => {
            currentSortFilter = e.target.value;
            renderResources();
        });
    }

    function renderResources() {
        if (!resourcesGrid) return;
        const allResources = BrainoraDB.getResources();
        const searchQuery = (resSearchInput?.value || '').toLowerCase().trim();

        // Update counts in pills
        const countAll = document.getElementById('count-fmt-all');
        const countPdf = document.getElementById('count-fmt-pdf');
        const countPng = document.getElementById('count-fmt-png');
        const countMp4 = document.getElementById('count-fmt-mp4');

        if (countAll) countAll.textContent = allResources.length;
        if (countPdf) countPdf.textContent = allResources.filter(r => r.format === 'PDF').length;
        if (countPng) countPng.textContent = allResources.filter(r => r.format === 'PNG').length;
        if (countMp4) countMp4.textContent = allResources.filter(r => r.format === 'MP4').length;

        // Apply filters
        let filtered = allResources.filter(res => {
            // Format filter
            if (currentFormatFilter !== 'all' && res.format !== currentFormatFilter) {
                return false;
            }
            // Department filter
            if (currentDeptFilter !== 'all' && res.department !== currentDeptFilter) {
                return false;
            }
            // Search query filter
            if (searchQuery) {
                const matchTitle = res.title.toLowerCase().includes(searchQuery);
                const matchDesc = res.description.toLowerCase().includes(searchQuery);
                const matchCampus = res.campus.toLowerCase().includes(searchQuery);
                const matchAuthor = res.author.name.toLowerCase().includes(searchQuery);
                const matchTags = res.tags && res.tags.some(t => t.toLowerCase().includes(searchQuery));
                if (!matchTitle && !matchDesc && !matchCampus && !matchAuthor && !matchTags) {
                    return false;
                }
            }
            return true;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (currentSortFilter === 'rating') return b.rating - a.rating;
            if (currentSortFilter === 'newest') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            // Default: popular (by downloads)
            return (b.downloads || 0) - (a.downloads || 0);
        });

        // Empty state
        if (filtered.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="empty-state-card">
                    <div class="empty-state-icon">🔍</div>
                    <div class="empty-state-title">No study materials match your search</div>
                    <p class="empty-state-desc">Try clearing your filters or be the first to share notes on this topic to earn +20 credits!</p>
                    <button class="btn-primary" id="btn-empty-upload">Share Material Now</button>
                </div>
            `;
            const emptyBtn = document.getElementById('btn-empty-upload');
            if (emptyBtn) emptyBtn.addEventListener('click', () => switchView('uploads'));
            return;
        }

        // Render Cards
        resourcesGrid.innerHTML = filtered.map(r => `
            <div class="resource-card" data-id="${r.id}">
                <div class="res-card-top">
                    <div class="res-badge-header">
                        ${Utils.renderFormatBadge(r.format)}
                        <span class="campus-pill" title="${r.campus}">🏛️ ${r.campus}</span>
                    </div>

                    <h3 class="res-title" title="${r.title}">${r.title}</h3>
                    <p class="res-description">${r.description}</p>

                    <div class="res-tags-row">
                        ${r.tags.slice(0, 3).map(tag => `<span class="res-tag">#${tag}</span>`).join('')}
                    </div>

                    <!-- Contributor Details -->
                    <div class="res-contributor-box">
                        <img src="${r.author.avatar}" alt="${r.author.name}" class="contributor-avatar">
                        <div class="contributor-meta">
                            <div class="contributor-name">${r.author.name} ${r.author.isCurrentUser ? '<span style="color:var(--brand-secondary); font-size: 0.72rem;">(You)</span>' : ''}</div>
                            <div class="contributor-role">${r.author.department} • ${r.author.year}</div>
                        </div>
                    </div>
                </div>

                <div class="res-card-footer">
                    <div class="res-rating-line">
                        <div>
                            ${Utils.renderStars(r.rating, r.reviewsCount)}
                        </div>
                        <div class="res-download-stat">
                            <span>📥</span>
                            <span>${r.downloads || 0}</span>
                        </div>
                    </div>

                    <div class="res-card-actions">
                        <button class="btn-card-preview" data-id="${r.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <span>Preview</span>
                        </button>
                        <button class="btn-card-access" data-id="${r.id}">
                            <span>${r.author.isCurrentUser ? 'Download' : `Access (${r.creditsCost || 5}⚡)`}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach listeners
        resourcesGrid.querySelectorAll('.btn-card-preview').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openResourcePreview(btn.dataset.id);
            });
        });

        resourcesGrid.querySelectorAll('.btn-card-access').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerAccessAndDownload(btn.dataset.id);
            });
        });

        resourcesGrid.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => {
                openResourcePreview(card.dataset.id);
            });
        });
    }

    /* ==========================================================================
       7. RESOURCE PREVIEW & DOWNLOAD MODAL
       ========================================================================== */
    const previewModal = document.getElementById('resource-preview-modal');
    const previewModalTitle = document.getElementById('preview-modal-title');
    const previewModalSubtitle = document.getElementById('preview-modal-subtitle');
    const previewViewerContainer = document.getElementById('preview-viewer-container');
    const previewModalDesc = document.getElementById('preview-modal-desc');
    const previewModalContributor = document.getElementById('preview-modal-contributor');
    const previewModalClose = document.getElementById('preview-modal-close');
    const previewModalCancel = document.getElementById('preview-modal-cancel');
    const previewModalDownloadBtn = document.getElementById('preview-modal-download-btn');
    const previewDownloadLabel = document.getElementById('preview-download-label');

    function openResourcePreview(resourceId) {
        const resources = BrainoraDB.getResources();
        const res = resources.find(r => r.id === resourceId);
        if (!res) return;

        activePreviewResource = res;

        if (previewModalTitle) previewModalTitle.textContent = res.title;
        if (previewModalSubtitle) {
            previewModalSubtitle.innerHTML = `${Utils.renderFormatBadge(res.format)} • ${res.campus} • ${res.department}`;
        }
        if (previewModalDesc) previewModalDesc.textContent = res.description;

        // Render Contributor inside modal
        if (previewModalContributor) {
            previewModalContributor.innerHTML = `
                <img src="${res.author.avatar}" alt="${res.author.name}" class="contributor-avatar">
                <div class="contributor-meta">
                    <div class="contributor-name">${res.author.name} (${res.author.campus})</div>
                    <div class="contributor-role">${res.author.department} • ${res.author.year} • ${res.author.section}</div>
                </div>
                <div style="margin-left: auto;">
                    ${Utils.renderStars(res.rating, res.reviewsCount)}
                </div>
            `;
        }

        // Render Format-Specific Viewer Container
        const format = res.format.toUpperCase();
        if (format === 'PDF') {
            previewViewerContainer.innerHTML = `
                <div class="preview-pdf-mock">
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; color: #38bdf8;">📄 DOCUMENT PREVIEW: ${res.fileDetails?.name || 'document.pdf'}</span>
                        <span style="font-size: 0.75rem; color: #94a3b8;">Page 1 of ${res.fileDetails?.pages || 48} • ${res.fileDetails?.size || '14.2 MB'}</span>
                    </div>
                    <div style="font-weight: 700; font-size: 1.1rem; color: #f8fafc; margin-bottom: 0.5rem;">${res.title}</div>
                    <p style="color: #cbd5e1; margin-bottom: 1rem;">
                        <strong>1. Foundational Axioms & State Space Definition:</strong><br>
                        Let G = (V, E) be a directed, weighted graph with weight function w: E → ℝ.<br>
                        Optimal substructure condition: If path p = ⟨v₀, v₁, ..., vₖ⟩ is shortest between v₀ and vₖ, then any subpath p_ij is shortest between v_i and v_j.<br>
                        State recurrence: OPT(i, v) = min { OPT(i-1, v), min_{(u,v) ∈ E} [ OPT(i-1, u) + w(u,v) ] }
                    </p>
                    <p style="color: #94a3b8; font-style: italic;">
                        [... 47 pages of handwritten proofs, complexity bounds, memory diagrams, and problem solutions available in full download ...]
                    </p>
                </div>
            `;
        } else if (format === 'PNG') {
            previewViewerContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 1rem;">
                    <img src="assets/sample-cheat-sheet.jpg" alt="${res.title}" class="preview-png-image">
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.75rem;">
                        🔍 High-Resolution 4K Study Infographic Preview (${res.fileDetails?.resolution || '3840 x 2160'})
                    </div>
                </div>
            `;
        } else if (format === 'MP4') {
            previewViewerContainer.innerHTML = `
                <div class="preview-video-container">
                    <div class="video-player-mock">
                        <button class="video-play-btn-large" id="mock-video-play" title="Play Video">▶</button>
                        <div style="position: absolute; bottom: 15px; left: 20px; color: #ffffff; font-weight: 600; font-size: 0.9rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                            🎥 ${res.title}
                        </div>
                    </div>
                    <div class="video-controls-bar">
                        <span style="color: var(--brand-secondary); font-weight: 700;">▶ 00:00 / ${res.fileDetails?.duration || '28:45'}</span>
                        <span>Resolution: ${res.fileDetails?.resolution || '1080p 60fps'} • Multi-campus Verified</span>
                        <span>🔊 100%</span>
                    </div>
                </div>
            `;

            setTimeout(() => {
                const playBtn = document.getElementById('mock-video-play');
                if (playBtn) {
                    playBtn.addEventListener('click', () => {
                        playBtn.textContent = playBtn.textContent === '▶' ? '⏸' : '▶';
                        Utils.toast('Streaming video tutorial snippet...', 'info');
                    });
                }
            }, 50);
        }

        // Download Button Label
        if (previewDownloadLabel) {
            previewDownloadLabel.textContent = res.author.isCurrentUser
                ? 'Download Your Resource'
                : `Unlock & Download (${res.creditsCost || 5} ⚡)`;
        }

        previewModal.classList.add('active');
    }

    function closePreviewModal() {
        if (previewModal) previewModal.classList.remove('active');
        activePreviewResource = null;
    }

    if (previewModalClose) previewModalClose.addEventListener('click', closePreviewModal);
    if (previewModalCancel) previewModalCancel.addEventListener('click', closePreviewModal);

    // Download trigger from preview modal
    if (previewModalDownloadBtn) {
        previewModalDownloadBtn.addEventListener('click', () => {
            if (activePreviewResource) {
                triggerAccessAndDownload(activePreviewResource.id);
            }
        });
    }

    function triggerAccessAndDownload(resourceId) {
        const result = BrainoraDB.accessResource(resourceId);
        if (!result) return;

        if (!result.success) {
            Utils.toast(result.message, 'error', 'Credit Limit Reached');
            return;
        }

        const res = result.resource;
        Utils.triggerDownload(res);

        if (res.author.isCurrentUser) {
            Utils.toast(`Downloaded "${res.title}"`, 'success');
        } else {
            Utils.toast(`Unlocked "${res.title}" (-${res.creditsCost || 5} Credits)`, 'credit', 'Resource Accessed');
        }

        // Refresh widgets
        renderDashboard();
        renderResources();
        if (previewModal.classList.contains('active')) {
            closePreviewModal();
        }
    }

    /* ==========================================================================
       8. RATINGS & REVIEWS SECTION
       ========================================================================== */
    const reviewsListContainer = document.getElementById('reviews-list-container');
    const reviewsSearchInput = document.getElementById('reviews-search-input');
    const reviewRatingFilterBtns = document.querySelectorAll('[data-rating-filter]');
    let currentReviewRatingFilter = 'all';

    reviewRatingFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            reviewRatingFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentReviewRatingFilter = btn.dataset.ratingFilter;
            renderReviews();
        });
    });

    if (reviewsSearchInput) {
        reviewsSearchInput.addEventListener('input', () => renderReviews());
    }

    function renderReviews() {
        if (!reviewsListContainer) return;
        const reviews = BrainoraDB.getReviews();
        const user = BrainoraDB.getUser();

        // Update Big Score
        const bigScore = document.getElementById('review-summary-score');
        if (bigScore) bigScore.textContent = Number(user.averageRating).toFixed(2);

        const search = (reviewsSearchInput?.value || '').toLowerCase().trim();

        const filtered = reviews.filter(rev => {
            if (currentReviewRatingFilter !== 'all') {
                if (rev.rating !== parseInt(currentReviewRatingFilter)) return false;
            }
            if (search) {
                const matchName = rev.reviewer.name.toLowerCase().includes(search);
                const matchCampus = rev.reviewer.campus.toLowerCase().includes(search);
                const matchRes = rev.resourceTitle.toLowerCase().includes(search);
                const matchComment = rev.comment.toLowerCase().includes(search);
                if (!matchName && !matchCampus && !matchRes && !matchComment) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            reviewsListContainer.innerHTML = `
                <div class="empty-state-card">
                    <div class="empty-state-icon">⭐</div>
                    <div class="empty-state-title">No reviews found</div>
                    <p class="empty-state-desc">Try clearing your search query or submit a new peer evaluation.</p>
                </div>
            `;
            return;
        }

        reviewsListContainer.innerHTML = filtered.map(rev => `
            <div class="review-item-card" data-id="${rev.id}">
                <div class="review-card-head">
                    <div class="reviewer-profile">
                        <img src="${rev.reviewer.avatar}" alt="${rev.reviewer.name}" class="reviewer-avatar">
                        <div class="reviewer-details">
                            <h4>
                                <span>${rev.reviewer.name}</span>
                                <span class="verified-campus-check" title="Authenticated student">✓</span>
                            </h4>
                            <div class="reviewer-subtext">
                                ${rev.reviewer.campus} • ${rev.reviewer.department || 'Undergraduate'}
                            </div>
                        </div>
                    </div>

                    <div class="review-meta-right">
                        <div>${Utils.renderStars(rev.rating)}</div>
                        <div class="review-date">${rev.date}</div>
                    </div>
                </div>

                <div class="reviewed-resource-tag">
                    <span>📌 Resource:</span>
                    <span>${rev.resourceTitle}</span>
                    ${Utils.renderFormatBadge(rev.resourceFormat || 'PDF')}
                </div>

                <p class="review-text-content">
                    "${rev.comment}"
                </p>

                <div class="review-card-foot">
                    <button class="helpful-btn" data-id="${rev.id}">
                        <span>👍 Found helpful (${rev.helpfulCount || 0})</span>
                    </button>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Verified Intercampus Download</span>
                </div>
            </div>
        `).join('');

        // Upvote helpfulness listeners
        reviewsListContainer.querySelectorAll('.helpful-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('liked')) return;
                btn.classList.add('liked');
                const id = btn.dataset.id;
                const rev = reviews.find(r => r.id === id);
                if (rev) {
                    rev.helpfulCount = (rev.helpfulCount || 0) + 1;
                    btn.querySelector('span').textContent = `👍 Found helpful (${rev.helpfulCount})`;
                    Utils.toast('Thank you for your feedback!', 'success');
                }
            });
        });
    }

    // Modal: Write a Review
    const writeReviewModal = document.getElementById('write-review-modal');
    const openReviewModalBtn = document.getElementById('btn-open-review-modal');
    const closeReviewModalBtn = document.getElementById('review-modal-close');
    const cancelReviewModalBtn = document.getElementById('review-modal-cancel');
    const submitReviewForm = document.getElementById('submit-review-form');
    const reviewResourceSelect = document.getElementById('review-resource-select');
    const starPickerSpans = document.querySelectorAll('#star-rating-picker .star-pick');
    const reviewRatingInput = document.getElementById('review-rating-value');

    if (openReviewModalBtn) {
        openReviewModalBtn.addEventListener('click', () => {
            // Populate select options
            const resources = BrainoraDB.getResources();
            if (reviewResourceSelect) {
                reviewResourceSelect.innerHTML = resources.map(r => `
                    <option value="${r.id}">${r.title} (${r.campus})</option>
                `).join('');
            }
            writeReviewModal.classList.add('active');
        });
    }

    function closeReviewModal() {
        if (writeReviewModal) writeReviewModal.classList.remove('active');
    }

    if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', closeReviewModal);
    if (cancelReviewModalBtn) cancelReviewModalBtn.addEventListener('click', closeReviewModal);

    // Interactive Star Picker
    starPickerSpans.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.val);
            if (reviewRatingInput) reviewRatingInput.value = val;
            starPickerSpans.forEach(s => {
                const sVal = parseInt(s.dataset.val);
                if (sVal <= val) {
                    s.classList.add('active');
                    s.style.color = 'var(--credit-gold)';
                } else {
                    s.classList.remove('active');
                    s.style.color = 'var(--text-muted)';
                }
            });
        });
    });

    if (submitReviewForm) {
        submitReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const resId = reviewResourceSelect.value;
            const resources = BrainoraDB.getResources();
            const res = resources.find(r => r.id === resId) || resources[0];

            const name = document.getElementById('reviewer-name-input').value.trim();
            const campus = document.getElementById('reviewer-campus-input').value.trim();
            const comment = document.getElementById('reviewer-comment-input').value.trim();
            const rating = parseInt(reviewRatingInput.value) || 5;

            const newReview = {
                id: 'rev-' + Date.now(),
                resourceId: res.id,
                resourceTitle: res.title,
                resourceFormat: res.format,
                reviewer: {
                    name: name,
                    campus: campus,
                    department: 'Engineering & Sciences',
                    year: '3rd Year',
                    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`
                },
                rating: rating,
                date: 'Today',
                comment: comment,
                helpfulCount: 0,
                isVerifiedIntercampus: true
            };

            BrainoraDB.addReview(newReview);
            Utils.toast('Review submitted! +10 Credits rewarded for reciprocal feedback.', 'credit', 'Peer Review Logged');

            submitReviewForm.reset();
            closeReviewModal();
            renderReviews();
            renderDashboard();
        });
    }

    /* ==========================================================================
       9. PROFILE SECTION
       ========================================================================== */
    function renderProfile() {
        const user = BrainoraDB.getUser();
        const resources = BrainoraDB.getResources();

        // Update profile header info
        const profileImg = document.getElementById('profile-img');
        if (profileImg) profileImg.src = user.avatar;
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = user.name;
        const profileAcadLine = document.getElementById('profile-academic-line');
        if (profileAcadLine) {
            profileAcadLine.textContent = `${user.campus} • ${user.department} • ${user.year} • Section ${user.section}`;
        }
        const profileBio = document.getElementById('profile-bio');
        if (profileBio) profileBio.textContent = user.bio;

        // Badges
        const badgesStrip = document.getElementById('profile-badges-strip');
        if (badgesStrip) {
            badgesStrip.innerHTML = (user.badges || []).map(b => `
                <span class="scholar-badge" title="${b.desc}">
                    <span>${b.icon}</span>
                    <span>${b.name}</span>
                </span>
            `).join('');
        }

        // Stats
        const profStatUploads = document.getElementById('prof-stat-uploads');
        if (profStatUploads) profStatUploads.textContent = user.resourcesShared;
        const profStatDownloads = document.getElementById('prof-stat-downloads');
        if (profStatDownloads) profStatDownloads.textContent = Number(user.downloadsReceived || 1840).toLocaleString();
        const profStatCredits = document.getElementById('prof-stat-credits');
        if (profStatCredits) profStatCredits.textContent = `${user.creditsBalance} ⚡`;
        const profStatHelpfulness = document.getElementById('prof-stat-helpfulness');
        if (profStatHelpfulness) profStatHelpfulness.textContent = `${user.helpfulnessScore || 98.4}%`;

        // Render My Shared Resources Table
        const tbody = document.getElementById('profile-my-resources-tbody');
        if (tbody) {
            const myShared = resources.filter(r => r.author.isCurrentUser);
            if (myShared.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">You haven't uploaded any study materials yet. Click "Share New Material" to start!</td></tr>`;
            } else {
                tbody.innerHTML = myShared.map(r => `
                    <tr>
                        <td>
                            <div class="tbl-res-title">
                                ${Utils.renderFormatBadge(r.format)}
                                <span>${r.title}</span>
                            </div>
                        </td>
                        <td>${r.category}</td>
                        <td><strong>${r.downloads || 0}</strong> downloads</td>
                        <td>${r.views || 0} views</td>
                        <td>${Utils.renderStars(r.rating)}</td>
                        <td>
                            <div class="tbl-actions">
                                <button class="tbl-btn btn-tbl-preview" data-id="${r.id}">View</button>
                                <button class="tbl-btn btn-tbl-download" data-id="${r.id}">Download</button>
                            </div>
                        </td>
                    </tr>
                `).join('');

                tbody.querySelectorAll('.btn-tbl-preview').forEach(b => {
                    b.addEventListener('click', () => openResourcePreview(b.dataset.id));
                });
                tbody.querySelectorAll('.btn-tbl-download').forEach(b => {
                    b.addEventListener('click', () => triggerAccessAndDownload(b.dataset.id));
                });
            }
        }
    }

    // Modal: Edit Profile
    const editProfileModal = document.getElementById('edit-profile-modal');
    const btnEditProfile = document.getElementById('btn-edit-profile');
    const closeEditProfileBtn = document.getElementById('edit-profile-close');
    const cancelEditProfileBtn = document.getElementById('edit-profile-cancel');
    const editProfileForm = document.getElementById('edit-profile-form');

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            const user = BrainoraDB.getUser();
            document.getElementById('edit-prof-name').value = user.name;
            document.getElementById('edit-prof-email').value = user.email;
            document.getElementById('edit-prof-dept').value = user.department;
            document.getElementById('edit-prof-year').value = user.year;
            document.getElementById('edit-prof-section').value = user.section;
            document.getElementById('edit-prof-bio').value = user.bio;
            editProfileModal.classList.add('active');
        });
    }

    function closeEditProfile() {
        if (editProfileModal) editProfileModal.classList.remove('active');
    }

    if (closeEditProfileBtn) closeEditProfileBtn.addEventListener('click', closeEditProfile);
    if (cancelEditProfileBtn) cancelEditProfileBtn.addEventListener('click', closeEditProfile);

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updated = BrainoraDB.updateUser({
                name: document.getElementById('edit-prof-name').value.trim(),
                email: document.getElementById('edit-prof-email').value.trim(),
                department: document.getElementById('edit-prof-dept').value.trim(),
                year: document.getElementById('edit-prof-year').value.trim(),
                section: document.getElementById('edit-prof-section').value.trim(),
                bio: document.getElementById('edit-prof-bio').value.trim()
            });

            Utils.toast('Profile details successfully updated!', 'success');
            closeEditProfile();
            renderProfile();
            renderDashboard();
        });
    }

    /* ==========================================================================
       10. INITIALIZATION
       ========================================================================== */
    // Parse URL Hash
    const initialHash = window.location.hash.replace('#', '') || 'dashboard';
    switchView(initialHash);
});
