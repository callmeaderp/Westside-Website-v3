import { company } from '@data/company';
import { MAX_RESUME_BYTES, MAX_RESUME_FILES, MAX_RESUME_MB } from '@data/form-limits';

interface TrackingWindow extends Window {
  __wplAttribution?: () => Record<string, string>;
  __wplTrackFormSuccess?: (payload: Record<string, unknown>, eventId?: string) => void;
  turnstile?: { reset: () => void };
}
interface ResumeUpload { name: string; type: string; data: string }

const tracking = window as TrackingWindow;
const form = document.querySelector<HTMLFormElement>('#career-form');
const unconfirmed = `We couldn’t confirm that your application went through. Please try again, or call us at ${company.phone}.`;

const DOCUMENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const PHOTO_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'bmp', 'tif', 'tiff']);
// Photos of paper résumés are re-encoded as JPEG: a phone photo is often larger than the
// 2 MB attachment cap, HEIC does not open on the office's Windows PCs, and re-encoding
// drops the photo's location metadata. The first step that fits its share of the cap wins.
const PHOTO_STEPS = [
  { edge: 2400, quality: 0.85 },
  { edge: 2000, quality: 0.8 },
  { edge: 1600, quality: 0.75 },
  { edge: 1280, quality: 0.7 },
];

class ResumeProblem extends Error {}

const extensionOf = (name: string) => (name.includes('.') ? name.split('.').pop()?.toLowerCase() || '' : '');
const isPhoto = (file: File) => file.type.startsWith('image/') || PHOTO_EXTENSIONS.has(extensionOf(file.name));

function base64Of(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new ResumeProblem('A résumé file could not be read. Try another file or apply without it.'));
    reader.readAsDataURL(blob);
  });
}

async function photoAsJpeg(file: File, budget: number): Promise<Blob | null> {
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = source;
    try { await image.decode(); } catch {
      throw new ResumeProblem(`We couldn’t open the photo “${file.name}”. Please try a JPG or PNG photo, or apply without it.`);
    }
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) throw new ResumeProblem(`We couldn’t open the photo “${file.name}”. Please try a JPG or PNG photo, or apply without it.`);
    for (const step of PHOTO_STEPS) {
      const scale = Math.min(1, step.edge / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new ResumeProblem('Your browser could not prepare the photo. Please try a PDF, or apply without it.');
      context.fillStyle = '#ffffff'; // transparent PNG areas become white, not black
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', step.quality));
      if (!blob) throw new ResumeProblem('Your browser could not prepare the photo. Please try a PDF, or apply without it.');
      if (blob.size <= budget) return blob;
    }
    return null;
  } finally {
    URL.revokeObjectURL(source);
  }
}

/** Validates the chosen files and returns them ready to send, or throws a ResumeProblem the applicant can act on. */
async function prepareResumes(files: File[], tooLarge: string): Promise<ResumeUpload[]> {
  if (files.length > MAX_RESUME_FILES) throw new ResumeProblem(`Please choose up to ${MAX_RESUME_FILES} files.`);
  for (const file of files) {
    if (!file.size) throw new ResumeProblem(`“${file.name}” appears to be empty. Please choose a different file, or apply without it.`);
    if (!DOCUMENT_TYPES[extensionOf(file.name)] && !isPhoto(file)) {
      throw new ResumeProblem(`“${file.name}” isn’t a PDF, Word file or photo. Please choose a different file, or apply without it.`);
    }
  }
  const documents = files.filter((file) => DOCUMENT_TYPES[extensionOf(file.name)]);
  const photos = files.filter((file) => !DOCUMENT_TYPES[extensionOf(file.name)]);
  const documentBytes = documents.reduce((sum, file) => sum + file.size, 0);
  if (documentBytes > MAX_RESUME_BYTES) throw new ResumeProblem(tooLarge);
  const photoBudget = photos.length ? Math.floor((MAX_RESUME_BYTES - documentBytes) / photos.length) : 0;

  const uploads: ResumeUpload[] = [];
  for (const [index, file] of files.entries()) {
    const extension = extensionOf(file.name);
    if (DOCUMENT_TYPES[extension]) {
      uploads.push({ name: file.name, type: DOCUMENT_TYPES[extension], data: await base64Of(file) });
      continue;
    }
    const jpeg = await photoAsJpeg(file, photoBudget);
    if (!jpeg) throw new ResumeProblem(tooLarge);
    const stem = file.name.replace(/\.[^.]*$/, '').trim() || `resume-photo-${index + 1}`;
    uploads.push({ name: `${stem}.jpg`, type: 'image/jpeg', data: await base64Of(jpeg) });
  }
  return uploads;
}

if (form) {
  const status = document.querySelector<HTMLElement>('#career-form-status')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const phone = form.querySelector<HTMLInputElement>('[name="phone"]')!;
  const email = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const position = form.querySelector<HTMLSelectElement>('[name="career_position"]')!;
  const resumeInput = form.querySelector<HTMLInputElement>('[name="resume"]');
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

    const files = Array.from(resumeInput?.files || []);
    const tooLarge = `Your files add up to more than ${MAX_RESUME_MB} MB. Please choose a smaller file or fewer files, or apply without them.`
      + (email.value.trim() ? ' You can also send a file later by replying to our confirmation email.' : '');

    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = files.some(isPhoto) ? 'Preparing your photos…' : 'Sending your application…';
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
      if (files.length) {
        try {
          payload.resumes = await prepareResumes(files, tooLarge);
        } catch (error) {
          // Browser image errors (DOMException) are not written for applicants; keep ours.
          throw error instanceof ResumeProblem ? error : new ResumeProblem('We couldn’t prepare your files. Please try a PDF, or apply without them.');
        }
        status.textContent = 'Sending your application…';
      }
      const response = await fetch('/api/contact/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(typeof result.message === 'string' ? result.message : unconfirmed);
      }
      accepted = true;
      // Analytics must never turn an accepted application into a reported failure.
      try { tracking.__wplTrackFormSuccess?.({ service: 'Career Inquiry' }); } catch { /* Delivery succeeded. */ }
      form.reset();
      button.textContent = 'Application received';
      showStatus('Thanks! Your application is in. We’ll look it over and get in touch if it’s a good fit.');
    } catch (error) {
      showStatus(error instanceof Error && error.name !== 'TypeError' && error.name !== 'SyntaxError'
        ? error.message
        : unconfirmed, true);
      button.textContent = 'Send My Application';
    } finally {
      sending = false;
      button.disabled = accepted;
      if (widget) tracking.turnstile?.reset();
    }
  });
}
