document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const feedback = document.getElementById('formFeedback');
    feedback.style.display = 'none';

    const formData = {
      full_name: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      destination: document.getElementById('destination').value,
      travel_date: document.getElementById('travelDate').value,
      message: document.getElementById('message').value.trim()
    };

    try {
      const response = await fetch(SUPABASE_URL + '/rest/v1/bookings', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        feedback.textContent = '✅ Booking sent! We will contact you within 24 hours.';
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        form.reset();
      } else {
        const err = await response.text();
        feedback.textContent = 'Error: ' + err;
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
    } catch (error) {
      feedback.textContent = 'Network error: ' + error.message;
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
    }
  });
});
