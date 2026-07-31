// =====================================================
// CampusRecover — Claim Modal (Verification Flow)
// =====================================================

function openClaimModal(foundItemId) {
  document.getElementById('claim-modal-backdrop')?.remove();

  const html = `
    <div id="claim-modal-backdrop" class="modal-backdrop">
      <div class="modal" id="claim-modal" style="max-width:480px;">

        <div class="modal-header">
          <div class="modal-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <div class="modal-title">Claim Ownership</div>
            <div class="modal-subtitle">Verify that this item belongs to you</div>
          </div>
          <button class="modal-close" id="claim-close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Step 1: Input -->
        <div class="modal-body" id="claim-step-input">
          <div style="background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:var(--border-radius);padding:var(--space-4);margin-bottom:var(--space-5);">
            <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6;">
              To verify ownership, answer the following question. Only the true owner will know this.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">What is the unique identifier of your item? <span class="required">*</span></label>
            <p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-3);">
              This could be a sticker, engraving, scratch, initials, or any distinctive mark you noted.
            </p>
            <input
              type="text"
              id="claim-answer"
              class="form-input"
              placeholder="e.g. Blue marvel sticker on back cover…"
              autocomplete="off"
            />
            <div id="claim-error" class="form-error" style="display:none;">
              <span id="claim-error-msg">Verification failed. Please check your answer.</span>
            </div>
          </div>

          <div id="claim-attempts-info" style="display:none;font-size:var(--text-xs);color:var(--warning);margin-top:var(--space-2);"></div>
        </div>

        <!-- Step 2: Success -->
        <div class="modal-body" id="claim-step-success" style="display:none;">
          <div class="verify-state">
            <div class="verify-state-icon" style="color:var(--accent);">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="verify-state-title" style="color:var(--accent);">Ownership Verified</div>
            <div class="verify-state-desc">Here are the finder's contact details. Please coordinate to collect your item.</div>
          </div>
          <div class="contact-reveal" id="contact-reveal-data"></div>
        </div>

        <!-- Step 3: Already Returned -->
        <div class="modal-body" id="claim-step-returned" style="display:none;">
          <div class="verify-state">
            <div class="verify-state-icon" style="color:var(--primary);">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="verify-state-title" style="color:var(--primary);">Item Already Returned</div>
            <div class="verify-state-desc">This item has already been returned to its owner.</div>
          </div>
        </div>

        <!-- Footer: Verify -->
        <div class="modal-footer" id="claim-footer">
          <button class="btn btn-ghost" id="claim-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="claim-submit-btn">
            <span id="claim-btn-text">Verify Ownership</span>
            <span id="claim-btn-spinner" class="spinner" style="display:none;"></span>
          </button>
        </div>

        <!-- Footer: Success -->
        <div class="modal-footer" id="claim-footer-success" style="display:none;">
          <button class="btn btn-ghost" id="claim-done-btn">Close</button>
          <a class="btn btn-accent" id="claim-contact-btn" href="tel:">Call Finder</a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  const backdrop = document.getElementById('claim-modal-backdrop');
  requestAnimationFrame(() => backdrop.classList.add('active'));

  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  const close = () => {
    backdrop.classList.remove('active');
    setTimeout(() => backdrop.remove(), 300);
  };

  document.getElementById('claim-close').addEventListener('click', close);
  document.getElementById('claim-cancel-btn').addEventListener('click', close);
  document.getElementById('claim-done-btn')?.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  const escHandler = e => {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  const submitBtn   = document.getElementById('claim-submit-btn');
  const answerInput = document.getElementById('claim-answer');

  const submit = () => {
    const answer = answerInput.value.trim();
    if (!answer) {
      answerInput.classList.add('error');
      document.getElementById('claim-error').style.display = 'flex';
      document.getElementById('claim-error-msg').textContent = 'Please enter the unique identifier.';
      return;
    }

    document.getElementById('claim-btn-text').style.display = 'none';
    document.getElementById('claim-btn-spinner').style.display = 'inline-block';
    submitBtn.disabled = true;
    answerInput.classList.remove('error');

    setTimeout(() => {
      const result = FoundItems.verifyClaim(foundItemId, answer);
      document.getElementById('claim-btn-text').style.display = 'inline';
      document.getElementById('claim-btn-spinner').style.display = 'none';
      submitBtn.disabled = false;

      if (result.success) {
        document.getElementById('claim-step-input').style.display   = 'none';
        document.getElementById('claim-step-success').style.display = 'block';
        document.getElementById('claim-footer').style.display        = 'none';
        document.getElementById('claim-footer-success').style.display = 'flex';

        document.getElementById('contact-reveal-data').innerHTML = `
          <div class="contact-reveal-row">
            <div class="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div class="contact-reveal-label">Finder's Name</div>
              <div class="contact-reveal-value">${result.finderName}</div>
            </div>
          </div>
          <div class="contact-reveal-row">
            <div class="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6.29 6.29l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <div class="contact-reveal-label">Phone Number</div>
              <div class="contact-reveal-value">${result.finderPhone}</div>
            </div>
          </div>
          <div class="contact-reveal-row">
            <div class="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div class="contact-reveal-label">Meeting Location</div>
              <div class="contact-reveal-value">${result.meetLocation}</div>
            </div>
          </div>
        `;

        document.getElementById('claim-contact-btn').href = `tel:${result.finderPhone}`;
        Toast.success('Ownership Verified', 'Contact the finder to collect your item.');

      } else if (result.reason?.includes('returned')) {
        document.getElementById('claim-step-input').style.display    = 'none';
        document.getElementById('claim-step-returned').style.display = 'block';
        document.getElementById('claim-footer').style.display         = 'none';
        document.getElementById('claim-footer-success').style.display = 'flex';

      } else {
        attempts++;
        answerInput.classList.add('error');
        document.getElementById('claim-error').style.display = 'flex';
        document.getElementById('claim-error-msg').textContent = result.reason || 'Incorrect. Please try again.';

        const attemptsEl = document.getElementById('claim-attempts-info');
        attemptsEl.style.display = 'block';
        attemptsEl.textContent = attempts >= MAX_ATTEMPTS
          ? 'Multiple failed attempts. Please contact campus security.'
          : `Attempt ${attempts} of ${MAX_ATTEMPTS}`;

        answerInput.focus();
        answerInput.select();
        Toast.error('Verification Failed', result.reason || 'The identifier does not match.');
      }
    }, 800);
  };

  submitBtn.addEventListener('click', submit);
  answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  setTimeout(() => answerInput.focus(), 300);
}

// ══════════════════════════════════════════════
// DETAIL MODAL
// ══════════════════════════════════════════════
function openDetailModal(item, type = 'lost') {
  document.getElementById('detail-modal-backdrop')?.remove();

  const isFound       = type === 'found';
  const locationLabel = isFound ? 'Found Location' : 'Last Seen Location';
  const locationValue = isFound ? (item.foundLocation || '—') : (item.location || '—');
  const reporterLabel = isFound ? 'Found By' : 'Reported By';
  const dateLabel     = isFound ? 'Found On' : 'Lost On';

  const html = `
    <div id="detail-modal-backdrop" class="modal-backdrop">
      <div class="modal" style="max-width:540px;">
        <button class="modal-close" id="detail-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        ${item.imageUrl ? `
          <img src="${item.imageUrl}" alt="${item.itemName}" style="border-radius:var(--radius-lg) var(--radius-lg) 0 0;height:240px;width:100%;object-fit:cover;" />
        ` : `
          <div style="height:160px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;border-radius:var(--radius-lg) var(--radius-lg) 0 0;flex-direction:column;gap:8px;">
            <span style="font-size:48px;opacity:0.3;">${window.CATEGORY_ICONS?.[item.category] || '—'}</span>
            <span style="color:var(--text-muted);font-size:var(--text-xs);">No image provided</span>
          </div>
        `}

        <div class="modal-body">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);margin-bottom:var(--space-5);">
            <div>
              <h3 style="font-size:var(--text-xl);font-weight:800;color:var(--text-primary);margin-bottom:var(--space-2);">${item.itemName}</h3>
              <span class="category-pill">${window.CATEGORY_ICONS?.[item.category] || '—'} ${item.category}</span>
            </div>
            <span class="badge badge-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
          </div>

          <div class="detail-grid">
            <div>
              <div class="detail-item-label">${locationLabel}</div>
              <div class="detail-item-value">${locationValue}</div>
            </div>
            <div>
              <div class="detail-item-label">${dateLabel}</div>
              <div class="detail-item-value">${window.formatDate?.(item.date) || item.date || '—'}</div>
            </div>
            <div>
              <div class="detail-item-label">${reporterLabel}</div>
              <div class="detail-item-value">${item.reporterName || '—'}</div>
            </div>
            <div>
              <div class="detail-item-label">Posted</div>
              <div class="detail-item-value">${window.timeAgo?.(item.createdAt) || '—'}</div>
            </div>
          </div>

          ${item.description ? `
            <div style="margin-bottom:var(--space-4);">
              <div class="detail-item-label" style="margin-bottom:var(--space-2);">Description</div>
              <div class="detail-desc-block">${item.description}</div>
            </div>
          ` : ''}

          ${isFound && item.status !== 'returned' ? `
            <div style="background:rgba(108,99,255,0.07);border:1px solid rgba(108,99,255,0.15);border-radius:var(--border-radius);padding:var(--space-4);">
              <p style="font-size:var(--text-xs);color:var(--text-secondary);">Finder contact information is hidden until you verify ownership.</p>
            </div>
          ` : ''}
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" id="detail-close-btn">Close</button>
          ${isFound && item.status === 'found' ? `
            <button class="btn btn-primary" id="detail-claim-btn">Claim This Item</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  const backdrop = document.getElementById('detail-modal-backdrop');
  requestAnimationFrame(() => backdrop.classList.add('active'));

  const close = () => {
    backdrop.classList.remove('active');
    setTimeout(() => backdrop.remove(), 300);
  };

  document.getElementById('detail-close').addEventListener('click', close);
  document.getElementById('detail-close-btn').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  document.getElementById('detail-claim-btn')?.addEventListener('click', () => {
    close();
    setTimeout(() => openClaimModal(item.id), 350);
  });
}

window.openClaimModal  = openClaimModal;
window.openDetailModal = openDetailModal;
