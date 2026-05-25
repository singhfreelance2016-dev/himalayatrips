/*
 * ADMIN DASHBOARD
 * Password‑protected (default: admin123). Fetches bookings from Supabase
 * and displays them in a responsive table with analytics.
 * Frontend‑only authentication – for production, use a proper backend.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const dashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    const ADMIN_PASSWORD = 'admin123'; // Change this in production

    // Check if already logged in (session storage)
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    // Login handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            loginError.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        loginOverlay.style.display = 'flex';
        dashboard.style.display = 'none';
        document.getElementById('adminPassword').value = '';
        loginError.textContent = '';
    });

    function showDashboard() {
        loginOverlay.style.display = 'none';
        dashboard.style.display = 'block';
        fetchBookings();
    }

    // ---------- FETCH BOOKINGS FROM SUPABASE ----------
    async function fetchBookings() {
        const tableBody = document.getElementById('tableBody');
        const tableLoading = document.getElementById('tableLoading');
        const tableEmpty = document.getElementById('tableEmpty');

        if (typeof SUPABASE_URL === 'undefined') {
            tableLoading.textContent = 'Supabase configuration missing.';
            return;
        }

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const bookings = await response.json();
            tableLoading.style.display = 'none';

            if (!bookings.length) {
                tableEmpty.style.display = 'block';
                updateAnalytics([]);
                return;
            }

            tableEmpty.style.display = 'none';
            renderTable(bookings);
            updateAnalytics(bookings);

        } catch (error) {
            console.error('Fetch error:', error);
            tableLoading.textContent = 'Error loading bookings. Please check Supabase configuration.';
        }
    }

    // Render bookings in table
    function renderTable(bookings) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(booking.full_name)}</td>
                <td>${escapeHtml(booking.email)}</td>
                <td>${escapeHtml(booking.phone)}</td>
                <td>${escapeHtml(booking.destination)}</td>
                <td>${escapeHtml(booking.travel_date)}</td>
                <td>${escapeHtml(booking.message || '—')}</td>
                <td>${new Date(booking.created_at).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update analytics cards
    function updateAnalytics(bookings) {
        document.getElementById('totalBookings').textContent = bookings.length;

        const destinations = new Set(bookings.map(b => b.destination));
        document.getElementById('uniqueDestinations').textContent = destinations.size;

        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(b => b.created_at && b.created_at.startsWith(today));
        document.getElementById('todayBookings').textContent = todayBookings.length;

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekBookings = bookings.filter(b => new Date(b.created_at) >= weekAgo);
        document.getElementById('weekBookings').textContent = weekBookings.length;
    }

    // Simple XSS prevention
    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});