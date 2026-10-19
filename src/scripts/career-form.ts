import { MAX_RESUME_BYTES, MAX_RESUME_MB } from '@data/form-limits';

interface TrackingWindow extends Window {
  __wplAttribution?: () => Record<string, string>;
  __wplTrackFormSuccess?: (payload: Record<string, unknown>, eventId?: string) => void;
  turnstile?: { reset: () => void };
}
const tracking = window as TrackingWindow;
const form = document.querySelector<HTMLFormElement>('#career-form');

if (form) {
  const status = document.querySelector<HTMLElement>('#career-form-status')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const phone = form.querySelector<HTMLInputElement>('[name="phone"]')!;
  const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const position = form.querySelector<HTMLSelectElement>('[name="career_position"]')!;
  let sending = false;
  let accepted = false;

  const showStatus = (text: string, error = false) => {
    status.textContent = text;
    status.style.color = error ? '#ffb4ab' : 'var(--color-green-bright)';
    status.focus();
  };
  const clearContactError = () => phone.setCustomValidity('');
  phone.addEventListener('input', clearContactError);
  email.addEventListener('input', clearContactError);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || accepted) return;
    if (!phone.value.trim() && !email.value.trim()) {
      phone.setCustomValidity('Please provide a phone number or email address.');
      phone.reportValidity();
      return;
    }
    clearContactError();
    if (!form.reportValidity()) return;

    const widget = form.querySelector('.cf-turnstile');
    const token = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value || '';
    if (widget && !token) {
      showStatus('Please complete the verification challenge before sending.', true);
      return;
    }

    const file = form.querySelector<HTMLInputElement>('[name="resume"]')?.files?.[0];
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    const extension = file?.name.split('.').pop()?.toLowerCase() || '';
    if (file && (!mimeTypes[extension] || !file.size || file.size > MAX_RESUME_BYTES)) {
      showStatus(`Please choose a nonempty PDF, DOC or DOCX file of ${MAX_RESUME_MB} MB or less, or apply without a résumé.`, true);
      return;
    }

    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your application…';
    status.style.color = 'var(--color-text-muted)';
    const values = new FormData(form);
    const value = (name: string) => String(values.get(name) || '').trim();
    const payload: Record<string, unknown> = {
      service: 'Career Inquiry',
      firstName: value('first_name'),
      lastName: value('last_name'),
      phone: value('phone'),
      email: value('email'),
      careerPosition: position.selectedOptions[0]?.textContent?.trim() || '',
      contactPreference: value('contact_preference'),
      careerAvailability: value('career_availability'),
      message: value('message'),
      howHeard: value('how_heard'),
      referredBy: value('referred_by'),
      attribution: tracking.__wplAttribution?.() || {},
      turnstileToken: token,
    };

    try {
      if (file) {
        payload.resume = {
          name: file.name,
          type: file.type || mimeTypes[extension],
          data: await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(',')[1]);
            reader.onerror = () => reject(new Error('The résumé could not be read. Try another file or apply without it.'));
            reader.readAsDataURL(file);
          }),
        };
      }
      const response = await fetch('/api/contact/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(typeof result.message === 'string' ? result.message : 'We could not confirm your submission. Please call the office before trying again.');
      }
      accepted = true;
      // Analytics must never turn an accepted application into a reported failure.
      try { tracking.__wplTrackFormSuccess?.({ service: 'Career Inquiry' }); } catch { /* Delivery succeeded. */ }
      form.reset();
      button.textContent = 'Application received';
      showStatus('Your application has been received. We’ll review your information and contact you if there is a suitable next step.');
    } catch (error) {
      showStatus(error instanceof Error && error.name !== 'TypeError' && error.name !== 'SyntaxError'
        ? error.message
        : 'We could not confirm your submission. Please call the office before trying again.', true);
      button.textContent = 'Send My Application';
    } finally {
      sending = false;
      button.disabled = accepted;
      if (widget) tracking.turnstile?.reset();
    }
  });
}
