/**
 * KaberiForms
 * Lightweight validation for any <form data-kaberi-form> on the page.
 * Required fields are marked with `required`; email/phone get light pattern checks.
 * On successful validation, the form hides and a success panel (sibling with
 * class .form-success) is revealed with a small drawn-checkmark animation.
 */
(function () {
  const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, msg) {
    const errEl = field.querySelector('.err');
    if (errEl) errEl.textContent = msg || '';
    field.classList.toggle('invalid', Boolean(msg));
  }

  function validateField(field) {
    const input = field.querySelector('input, select, textarea');
    if (!input) return true;
    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) {
      setError(field, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && value && !EMAIL_RE.test(value)) {
      setError(field, 'Enter a valid email address.');
      return false;
    }
    if (input.dataset.type === 'phone' && value && !PHONE_RE.test(value.replace(/\D/g, '').slice(-10))) {
      setError(field, 'Enter a valid 10-digit mobile number.');
      return false;
    }
    setError(field, '');
    return true;
  }

  function handleSubmit(e) {
    const form = e.target;
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.field').forEach((field) => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const successPanel = form.parentElement.querySelector('.form-success');
    form.style.display = 'none';
    if (successPanel) successPanel.classList.add('is-visible');
    form.reset();
  }

  function init() {
    document.querySelectorAll('[data-kaberi-form]').forEach((form) => {
      form.addEventListener('submit', handleSubmit);
      form.querySelectorAll('.field input, .field select, .field textarea').forEach((input) => {
        input.addEventListener('blur', () => validateField(input.closest('.field')));
      });
    });
  }

  window.KaberiForms = { init };
})();
