'use strict';

(() => {
  const form = document.querySelector('#cleaning-form');
  const fields = document.querySelector('#enquiry-fields');
  const result = document.querySelector('#brief-result');
  const status = document.querySelector('#enquiry-status');
  const unavailable = document.querySelector('#form-unavailable');
  const submitButton = document.querySelector('#send-enquiry');
  const submitLabel = document.querySelector('#send-enquiry-label');
  const verificationButton = document.querySelector('#verify-enquiry');
  const space = document.querySelector('#space');
  const frequency = document.querySelector('#frequency');
  const size = document.querySelector('#size');
  const contactName = document.querySelector('#contact-name');
  const contactEmail = document.querySelector('#contact-email');
  const briefText = document.querySelector('#brief-text');
  const copyStatus = document.querySelector('#copy-status');
  const spaceLabels = { home: 'Home', stays: 'Guest accommodation', offices: 'Office / workplace' };
  const endpoint = String(window.A_SQUARED_FORM_ENDPOINT || '').trim();
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  let sending = false;

  // Fail closed until a real endpoint is supplied; never POST contact data to Vercel.
  if (configured) {
    form.action = endpoint;
    fields.disabled = false;
    fields.removeAttribute('aria-describedby');
    unavailable.hidden = true;
  }

  function adjustSpace() {
    size.placeholder = { home: 'e.g. 2 bedrooms, 1 bathroom', stays: 'e.g. 1 apartment, 2 bedrooms', offices: 'e.g. 10 desks, 2 meeting rooms' }[space.value];
    if (space.value === 'stays') frequency.value = 'Between guest stays';
    else if (frequency.value === 'Between guest stays') frequency.value = 'One-off clean';
  }

  function showStatus(message, state = 'info') {
    status.textContent = message;
    status.dataset.state = state;
  }

  space.addEventListener('change', adjustSpace);
  contactName.addEventListener('input', () => contactName.setCustomValidity(''));
  document.querySelectorAll('.plan-service').forEach(link => {
    link.addEventListener('click', () => {
      if (sending) return;
      space.value = link.dataset.service;
      adjustSpace();
      result.hidden = true;
      form.hidden = false;
      copyStatus.textContent = '';
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    if (!configured) {
      showStatus('Online enquiries are being set up. Please use the email link below.', 'error');
      return;
    }

    contactName.value = contactName.value.trim();
    contactEmail.value = contactEmail.value.trim();
    contactName.setCustomValidity(contactName.value ? '' : 'Please enter your name.');
    if (!form.reportValidity()) return;

    // Capture the fields before disabling them, and keep a consistent receipt.
    const data = new FormData(form);
    data.set('space', spaceLabels[space.value]);
    for (const key of ['name', 'email', 'phone', 'size', 'priorities']) {
      data.set(key, String(data.get(key) || '').trim());
    }
    const brief = [
      'YOUR A SQUARED CLEANING ENQUIRY', '',
      `Space: ${data.get('space')}`,
      `Frequency: ${data.get('frequency')}`,
      `Property size: ${data.get('size') || 'To be discussed'}`,
      `Priorities: ${data.get('priorities') || 'To be discussed'}`, '',
      'CONTACT DETAILS',
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') || 'Not provided'}`, '',
      'This is an enquiry, not a confirmed booking. Scope, price, service area and availability still need to be agreed.'
    ].join('\n');

    sending = true;
    fields.disabled = true;
    submitButton.disabled = true;
    verificationButton.hidden = true;
    form.setAttribute('aria-busy', 'true');
    submitLabel.textContent = 'Sending your enquiry…';
    showStatus('Sending securely. Please keep this page open.');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        signal: controller.signal
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const errors = Array.isArray(payload?.errors)
          ? payload.errors.map(error => typeof error.message === 'string' ? error.message : '').filter(Boolean).join(' ')
          : (typeof payload?.error === 'string' ? payload.error : '');
        const needsVerification = /captcha|verification|challenge/i.test(errors);
        if (needsVerification) {
          showStatus('Please complete the security check to send your enquiry.', 'error');
          verificationButton.hidden = false;
        } else {
          showStatus(errors ? `Your enquiry was not accepted. ${errors}` : 'Your enquiry was not accepted. Please try again or email us below.', 'error');
        }
        status.focus({ preventScroll: true });
        return;
      }
      if (payload?.ok !== true) throw new Error('Submission not confirmed');

      // Show success only after Formspree confirms acceptance, never on a timer.
      briefText.textContent = brief;
      form.reset();
      form.hidden = true;
      result.hidden = false;
      copyStatus.textContent = '';
      showStatus('');
      adjustSpace();
      document.querySelector('#brief-title').focus({ preventScroll: true });
    } catch {
      showStatus('We could not confirm whether your enquiry was sent. Your details are still here. Please email us below to check before trying again.', 'error');
      status.focus({ preventScroll: true });
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      fields.disabled = false;
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
      submitLabel.textContent = 'Send my enquiry';
    }
  });

  verificationButton.addEventListener('click', () => {
    if (!configured || sending || !form.reportValidity()) return;
    // Formspree's hosted flow handles a CAPTCHA if the account requires one.
    HTMLFormElement.prototype.submit.call(form);
  });

  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    briefText.textContent = '';
    copyStatus.textContent = '';
    verificationButton.hidden = true;
    space.focus({ preventScroll: true });
  });

  document.querySelector('#copy-brief').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(briefText.textContent);
      copyStatus.textContent = 'Copied. You can keep this as a record of your enquiry.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(briefText);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Use your device’s copy command to copy the selected enquiry.';
    }
  });
})();
