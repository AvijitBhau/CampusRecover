// =====================================================
// CampusRecover — Report Found Item
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('report-found');

  const form      = document.getElementById('report-found-form');
  const catSel    = document.getElementById('category');
  const submitBtn = document.getElementById('submit-btn');

  // Populate categories
  if (catSel) {
    CATEGORIES.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = `${CATEGORY_ICONS[cat]} ${cat}`;
      catSel.appendChild(opt);
    });
  }

  // Default date
  const dateInput = document.getElementById('found-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.max   = today;
    dateInput.value = today;
  }

  // Pre-fill finder info from profile
  const finderPhoneInput = document.getElementById('finder-phone');
  const meetLocInput     = document.getElementById('meet-location');
  if (finderPhoneInput && user.phone) finderPhoneInput.value = user.phone;
  if (meetLocInput) meetLocInput.placeholder = `e.g. ${user.department} Reception`;

  // Image upload (required)
  initImageUpload('item-image', 'image-preview', 'upload-area');

  // UID example chips
  document.querySelectorAll('.uid-example').forEach(chip => {
    chip.addEventListener('click', () => {
      const uidInput = document.getElementById('unique-identifier');
      if (uidInput) {
        uidInput.value = chip.textContent.trim();
        uidInput.focus();
        uidInput.classList.remove('error');
        document.getElementById('uid-error')?.style && (document.getElementById('uid-error').style.display = 'none');
      }
    });
  });

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      const imageInput = document.getElementById('item-image');
      const imageData  = imageInput?._previewData || '';

      const itemData = {
        reporterUid:         user.uid,
        reporterName:        user.name,
        finderPhone:         document.getElementById('finder-phone').value.trim(),
        finderMeetLocation:  document.getElementById('meet-location').value.trim(),
        itemName:            document.getElementById('item-name').value.trim(),
        category:            document.getElementById('category').value,
        description:         document.getElementById('description').value.trim(),
        foundLocation:       document.getElementById('found-location').value.trim(),
        date:                document.getElementById('found-date').value,
        uniqueIdentifier:    document.getElementById('unique-identifier').value.trim(),
        imageUrl:            imageData
      };

      await new Promise(r => setTimeout(r, 800));

      try {
        FoundItems.add(itemData);
        Toast.success('Found Item Reported!', 'Thank you for being honest! The owner will be notified. 🙏');
        setTimeout(() => { window.location.href = 'found-items.html'; }, 1500);
      } catch (err) {
        Toast.error('Submission Failed', 'Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '📝 Submit Report';
      }
    });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({ title:'Log Out', message:'Log out?', icon:'👋', confirmText:'Log Out', dangerConfirm:false })
      .then(ok => { if (ok) Auth.logout(); });
  });

  Loader.hide();
});

function validateForm() {
  let isValid = true;
  // Required fields for found report
  const required = ['item-name', 'category', 'found-location', 'unique-identifier', 'finder-phone', 'meet-location'];

  required.forEach(id => {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(`${id}-error`);
    if (!el) return;

    if (!el.value.trim()) {
      el.classList.add('error');
      if (errEl) errEl.style.display = 'flex';
      isValid = false;
    } else {
      el.classList.remove('error');
      if (errEl) errEl.style.display = 'none';
    }

    el.addEventListener('input', () => {
      if (el.value.trim()) {
        el.classList.remove('error');
        if (errEl) errEl.style.display = 'none';
      }
    }, { once: true });
  });

  // Image check (required for found reports)
  const imageInput = document.getElementById('item-image');
  if (!imageInput?._previewData) {
    const areaEl = document.getElementById('upload-area');
    areaEl?.classList.add('drag-over');
    setTimeout(() => areaEl?.classList.remove('drag-over'), 1500);
    Toast.warning('Image Required', 'Please upload a photo of the found item.');
    isValid = false;
  }

  if (!isValid && required.some(id => !document.getElementById(id)?.value?.trim())) {
    Toast.warning('Incomplete Form', 'Please fill in all required fields.');
    const firstError = document.querySelector('.form-input.error, .form-select.error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return isValid;
}
