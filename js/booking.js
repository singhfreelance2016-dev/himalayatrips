/*
 * BOOKING FORM HANDLER
 * Validates form input and submits booking to Supabase via REST API.
 * Security note: This is a frontend‑only solution. In production, always
 * validate and sanitize data on a backend server. Supabase Row Level Security (RLS)
 * should be enabled to prevent unauthorized access.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = document.getElementById('btnSpinner');
    const feedback = document.getElementById('formFeedback');

    // Helper: show field error
    function showError(fieldId, message) {
        const errorSpan = document.getElementById(fieldId + 'Error');
        if (errorSpan) errorSpan.textContent = message;
        const field = document.getElementById(fieldId);
        if (field) field.style.borderColor = message ? 'var(--danger)' : '';
    }

    // Clear all errors
    function clearErrors() {
        ['fullName', 'email', 'phone', 'destination', 'travelDate'].forEach(id => showError(id, ''));
    }

    // Validation
    function validateForm() {
        let isValid = true;
        clearErrors();

        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName || fullName.length < 2) {
            showError('fullName', 'Full name is required (min 2 characters)');
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email', 'Valid email address is required');
            isValid = false;
        }

        const phone = document.getElementById('phone').value.trim();
        if (!phone || phone.length < 7) {
            showError('phone', 'Valid phone number is required');
            isValid = false;
        }

        const destination = document.getElementById('destination').value;
        if (!destination) {
            showError('destination', 'Please select a destination');
            isValid = false;
        }

        const travelDate = document.getElementById('travelDate').value;
        if (!travelDate) {
            showError('travelDate', 'Travel date is required');
            isValid = false;
        } else {
            const selected = new Date(travelDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selected < today) {
                showError('travelDate', 'Travel date cannot be in the past');
                isValid = false;
            }
        }

        return isValid;
    }

    // Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            btnSpinner.style.display = 'inline-block';
            feedback.style.display = 'none';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnSpinner.style.display = 'none';
        }
    }

    // Show feedback message
    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = 'form-feedback ' + type;
        feedback.style.display = 'block';
        // Hide after 5 seconds
        setTimeout(() => { feedback.style.display = 'none'; }, 5000);
    }

    // Submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Ensure Supabase config is available
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            showFeedback('Configuration error. Please contact support.', 'error');
            return;
        }

        setLoading(true);

        const formData = {
            full_name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            destination: document.getElementById('destination').value,
            travel_date: document.getElementById('travelDate').value,
            message: document.getElementById('message').value.trim(),
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showFeedback('Booking request sent successfully! We will contact you within 24 hours.', 'success');
                form.reset();
                clearErrors();
            } else {
                const errorText = await response.text();
                console.error('Supabase error:', errorText);
                showFeedback('Failed to submit booking. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Network error:', error);
            showFeedback('Network error. Please check your connection and try again.', 'error');
        } finally {
            setLoading(false);
        }
    });
});