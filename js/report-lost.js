// =====================================================
// CampusRecover — Report Lost Item
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireAuth();
  if (!user) return;

  Theme.init();
  Sidebar.init();
  updateUserUI(user);
  setActiveNav('report-lost');

  const form     = document.getElementById('report-lost-form');
  const catSel   = document.getElementById('category');
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

  // Set default date to today
  const dateInput = document.getElementById('lost-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.max = today;
    dateInput.value = today;
  }

  // Image upload
  initImageUpload('item-image', 'image-preview', 'upload-area');

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      const imageInput  = document.getElementById('item-image');
      const imageData   = imageInput?._previewData || '';

      const itemData = {
        reporterUid:  user.uid,
        reporterName: user.name,
        itemName:     document.getElementById('item-name').value.trim(),
        category:     document.getElementById('category').value,
        description:  document.getElementById('description').value.trim(),
        location:     document.getElementById('location').value.trim(),
        date:         document.getElementById('lost-date').value,
        imageUrl:     imageData
      };

      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      try {
        LostItems.add(itemData);
        Toast.success('Report Submitted!', 'Your lost item report has been posted. We hope you get it back soon! 🤞');
        setTimeout(() => { window.location.href = 'lost-items.html'; }, 1500);
      } catch (err) {
        Toast.error('Submission Failed', 'Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '📝 Submit Report';
      }
    });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm({ title:'Log Out', message:'Log out of CampusRecover?', icon:'👋', confirmText:'Log Out', dangerConfirm:false })
      .then(ok => { if (ok) Auth.logout(); });
  });

  Loader.hide();
});

function validateForm() {
  let isValid = true;
  const required = ['item-name', 'category', 'description', 'location'];

  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const errId = `${id}-error`;
    const errEl  = document.getElementById(errId);

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

  if (!isValid) {
    Toast.warning('Incomplete Form', 'Please fill in all required fields.');
    // Scroll to first error
    const firstError = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return isValid;
}
