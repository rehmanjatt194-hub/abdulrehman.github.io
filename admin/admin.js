/* =============================================
   ULTRA-ADVANCED ADMIN PANEL — JavaScript
   ============================================= */

const API_URL = 'http://localhost:5001/api/v1';
let currentEditingId = null;
let quillEditor = null;

/* ── UTILS ──────────────────────────────────── */
function getToken() { return localStorage.getItem('adminToken'); }

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '🔔'}</span><span class="toast-text">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

function animateCount(el, target) {
  let start = 0;
  const duration = 900;
  const step = (timestamp) => {
    if (!step.startTime) step.startTime = timestamp;
    const progress = Math.min((timestamp - step.startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function closeMsgModal() {
  document.getElementById('msgModal').classList.remove('open');
}

function openMsgModal(name, text) {
  document.getElementById('msgModalName').textContent = name;
  document.getElementById('msgModalText').textContent = text;
  document.getElementById('msgModal').classList.add('open');
}

/* ── CLOCK ──────────────────────────────────── */
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `🕐 ${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ── SIDEBAR TOGGLE ─────────────────────────── */
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggle.textContent = sidebar.classList.contains('collapsed') ? '⇥' : '⇤';
  });
}

/* ── AUTH CHECK ─────────────────────────────── */
function checkAuth() {
  if (!getToken()) { window.location.href = 'login.html'; return false; }
  const username = localStorage.getItem('adminUser') || 'Admin';
  const nameEl   = document.getElementById('userNameDisplay');
  const avatarEl = document.getElementById('userAvatar');
  if (nameEl) nameEl.textContent = username;
  if (avatarEl) avatarEl.textContent = username.charAt(0).toUpperCase();
  return true;
}

/* ── NAVIGATION ─────────────────────────────── */
function initNav() {
  const links = document.querySelectorAll('.sidebar-nav .nav-link[data-section]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navigateTo(section);
    });
  });

  document.getElementById('nav-logout')?.addEventListener('click', (e) => {
    e.preventDefault(); logout();
  });

  // Close modals
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('crudModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('msgModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeMsgModal();
  });
}

function navigateTo(section) {
  const dashboardSection = document.getElementById('dashboardSection');
  const dynamicContent   = document.getElementById('dynamicContent');
  const titleEl          = document.getElementById('sectionTitle');
  const subtitleEl       = document.getElementById('sectionSubtitle');
  const subtitles = {
    dashboard: "Welcome back! Here's what's happening.",
    projects:  'Manage your case studies and projects.',
    blogs:     'Create and manage blog posts & articles.',
    faqs:      'Manage frequently asked questions.',
    reviews:   'Client testimonials and reviews.',
    messages:  'Incoming project inquiries from visitors.'
  };
  const names = {
    dashboard: 'Dashboard Overview', projects: 'Projects',
    blogs: 'Blogs & Cases', faqs: 'FAQs',
    reviews: 'Reviews', messages: 'Messages'
  };

  titleEl.textContent    = names[section]     || section;
  subtitleEl.textContent = subtitles[section] || '';

  if (section === 'dashboard') {
    dashboardSection.style.display = 'block';
    dynamicContent.innerHTML = '';
    fetchStats();
  } else {
    dashboardSection.style.display = 'none';
    dynamicContent.innerHTML = '';
    renderModule(section);
  }
}

/* ── STATS ──────────────────────────────────── */
async function fetchStats() {
  try {
    const headers = { 'Authorization': `Bearer ${getToken()}` };
    const [projRes, contentRes, messRes] = await Promise.all([
      fetch(`${API_URL}/projects`),
      fetch(`${API_URL}/content`),
      fetch(`${API_URL}/messages`, { headers })
    ]);

    const projects  = await projRes.json();
    const content   = await contentRes.json();
    const messages  = await messRes.json();

    const blogs    = Array.isArray(content) ? content.filter(c => c.category === 'Blog').length : 0;
    const reviews  = Array.isArray(content) ? content.filter(c => c.category === 'Review').length : 0;
    const faqs     = Array.isArray(content) ? content.filter(c => c.category === 'FAQ').length : 0;
    const newMsgs  = Array.isArray(messages) ? messages.filter(m => m.status === 'New').length : 0;

    animateCount(document.getElementById('countProjects'), Array.isArray(projects) ? projects.length : 0);
    animateCount(document.getElementById('countBlogs'),    blogs);
    animateCount(document.getElementById('countReviews'),  reviews);
    animateCount(document.getElementById('countFaqs'),     faqs);
    animateCount(document.getElementById('countMessages'), newMsgs);

    // Update badge
    const badge = document.getElementById('msgBadge');
    if (badge) {
      if (newMsgs > 0) { badge.textContent = newMsgs; badge.style.display = 'inline-flex'; }
      else { badge.style.display = 'none'; }
    }

  } catch (err) {
    console.error('Stats error:', err);
  }
}

/* ── RENDER MODULE ──────────────────────────── */
async function renderModule(module) {
  const div = document.getElementById('dynamicContent');
  div.innerHTML = `<div class="card" style="animation-delay:0s">
    <div style="display:flex;align-items:center;gap:0.75rem;color:var(--text-muted)">
      <span style="font-size:1.2rem">⏳</span> Loading ${module}…
    </div>
  </div>`;

  const token = getToken();

  try {
    if (module === 'messages') {
      await renderMessages(div, token);
    } else {
      await renderCRUD(div, module, token);
    }
  } catch (err) {
    div.innerHTML = `<div class="card"><div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <p>${err.message}</p>
    </div></div>`;
    showToast(err.message, 'error');
  }
}

/* ── MESSAGES TABLE ─────────────────────────── */
async function renderMessages(div, token) {
  const res  = await fetch(`${API_URL}/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();

  if (!Array.isArray(data)) throw new Error(data.message || 'Failed to load messages.');

  const msgs = [...data].reverse();

  div.innerHTML = `
  <div class="card" style="animation-delay:0s">
    <div class="card-header">
      <h3 class="card-title">📩 Project Inquiries</h3>
      <span class="badge badge-blue">${msgs.length} total</span>
    </div>
    <div class="table-controls">
      <div class="search-input-wrap">
        <span>🔍</span>
        <input type="text" id="msgSearch" placeholder="Search by name or email…">
      </div>
    </div>
    <div class="table-wrapper">
      <table class="admin-table" id="msgTable">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Contact</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="msgTableBody"></tbody>
      </table>
    </div>
  </div>`;

  function renderRows(list) {
    const tbody = document.getElementById('msgTableBody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div><p>No messages yet</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(m => {
      const statusClass = m.status === 'New' ? 'badge-blue' : m.status === 'Read' ? 'badge-green' : 'badge-slate';
      return `<tr>
        <td>
          <strong>${escHtml(m.name)}</strong>
          <div class="text-muted text-small">${escHtml(m.title || '')}</div>
        </td>
        <td>
          <div>${escHtml(m.email)}</div>
          <div class="text-muted text-small">${escHtml(m.phone || 'N/A')}</div>
        </td>
        <td><span style="color:var(--primary-light); font-weight:600">$${escHtml(String(m.budget || 'N/A'))}</span></td>
        <td><span class="badge ${statusClass}">${escHtml(m.status)}</span></td>
        <td style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="openMsgModal('${escHtml(m.name)}', '${encodeURIComponent(m.message || '')}')">👁 Read</button>
          <button class="btn btn-ghost btn-sm" onclick="toggleMsgStatus('${m._id}','${m.status}')">🔄 Status</button>
        </td>
      </tr>`;
    }).join('');
  }

  renderRows(msgs);

  document.getElementById('msgSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderRows(msgs.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)));
  });
}

/* ── CRUD TABLE ─────────────────────────────── */
async function renderCRUD(div, module, token) {
  let endpoint = `${API_URL}/content`;
  if (module === 'blogs')    endpoint += '?category=Blog';
  if (module === 'faqs')     endpoint += '?category=FAQ';
  if (module === 'reviews')  endpoint += '?category=Review';
  if (module === 'projects') endpoint  = `${API_URL}/projects`;

  const res   = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
  const items = await res.json();

  if (!Array.isArray(items)) throw new Error(items.message || `Failed to load ${module}.`);

  const colHeaders = {
    projects: ['Title', 'Technologies', 'Actions'],
    blogs:    ['Title', 'Category', 'Actions'],
    faqs:     ['Question', 'Answer Preview', 'Actions'],
    reviews:  ['Reviewer', 'Role', 'Actions']
  };
  const cols = colHeaders[module] || ['Title', 'Info', 'Actions'];

  div.innerHTML = `
  <div class="card" style="animation-delay:0s">
    <div class="card-header">
      <h3 class="card-title">${getModuleIcon(module)} Manage ${capitalize(module)}</h3>
      <div style="display:flex;gap:0.5rem;align-items:center;">
        <span class="badge badge-violet">${items.length} items</span>
        <button class="btn btn-primary btn-sm" id="btnAddNew">+ Add New</button>
      </div>
    </div>
    <div class="table-controls">
      <div class="search-input-wrap">
        <span>🔍</span>
        <input type="text" id="crudSearch" placeholder="Search ${module}…">
      </div>
    </div>
    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr>
        </thead>
        <tbody id="crudTableBody"></tbody>
      </table>
    </div>
  </div>`;

  document.getElementById('btnAddNew').onclick = () => openModal(module, null);

  function renderRows(list) {
    const tbody = document.getElementById('crudTableBody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="3"><div class="empty-state"><div class="empty-icon">📂</div><p>No ${module} found. Add one!</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(item => {
      let col2 = '';
      if (module === 'projects') col2 = `<span class="badge badge-violet" style="font-size:0.68rem">${(item.techStack||[]).join(', ').slice(0,40) || 'N/A'}</span>`;
      if (module === 'blogs')    col2 = `<span class="badge badge-cyan">${item.category || 'Blog'}</span>`;
      if (module === 'faqs')     col2 = `<span class="text-muted text-small text-ellipsis" style="display:inline-block">${stripHtml(item.content||'').slice(0,60)}…</span>`;
      if (module === 'reviews')  col2 = `<span class="text-muted text-small">${item.subtitle || 'Client'}</span>`;
      return `<tr>
        <td><strong class="text-ellipsis" style="display:block;max-width:280px">${escHtml(item.title)}</strong></td>
        <td>${col2}</td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="editItem('${module}','${item._id}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteItem('${module}','${item._id}')">🗑 Delete</button>
        </td>
      </tr>`;
    }).join('');
  }

  renderRows(items);

  document.getElementById('crudSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderRows(items.filter(i => (i.title||'').toLowerCase().includes(q)));
  });
}

/* ── MODAL ──────────────────────────────────── */
function openModal(module, item = null) {
  currentEditingId = item ? item._id : null;
  quillEditor = null;

  document.getElementById('modalTitle').textContent = (item ? '✏️ Edit' : '➕ Add') + ' ' + capitalize(module.slice(0,-1));

  const isContent = module === 'blogs' || module === 'faqs' || module === 'reviews';

  let html = `<form class="modal-form" id="crudForm">`;

  // Title / Question / Name
  const titleLabel = module === 'reviews' ? 'Reviewer Name' : module === 'faqs' ? 'Question' : 'Title';
  html += `<div class="form-group">
    <label>${titleLabel}</label>
    <input type="text" id="f_title" value="${escAttr(item?.title || '')}" placeholder="Enter ${titleLabel.toLowerCase()}…" required>
  </div>`;

  if (module === 'reviews') {
    html += `<div class="form-group">
      <label>Role / Company</label>
      <input type="text" id="f_subtitle" value="${escAttr(item?.subtitle || '')}" placeholder="e.g. CEO at TechCorp">
    </div>`;
  }

  if (isContent) {
    const contentLabel = module === 'faqs' ? 'Answer' : module === 'reviews' ? 'Testimonial' : 'Content';
    html += `<div class="form-group">
      <label>${contentLabel}</label>
      <div id="quillEditor" style="background:#0b0f1a; border-radius: 0.5rem; overflow:hidden;"></div>
    </div>`;
  }

  if (module === 'blogs') {
    html += `<div class="form-group">
      <label>Category</label>
      <select id="f_category">
        <option value="Blog" ${item?.category === 'Blog' ? 'selected' : ''}>Blog</option>
        <option value="Case Study" ${item?.category === 'Case Study' ? 'selected' : ''}>Case Study</option>
      </select>
    </div>`;
  }

  if (module === 'projects') {
    html += `
    <div class="form-group">
      <label>Brief Description</label>
      <textarea id="f_description" rows="2" placeholder="Short summary…">${escHtml(item?.description || '')}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Situation</label>
        <textarea id="f_situation" rows="2" placeholder="Context…">${escHtml(item?.situation || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Task</label>
        <textarea id="f_task" rows="2" placeholder="What needed to be done…">${escHtml(item?.task || '')}</textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Action</label>
        <textarea id="f_action" rows="2" placeholder="What you did…">${escHtml(item?.action || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Result</label>
        <textarea id="f_result" rows="2" placeholder="Outcome…">${escHtml(item?.result || '')}</textarea>
      </div>
    </div>
    <div class="form-group">
      <label>Technologies (comma separated)</label>
      <input type="text" id="f_techs" value="${escAttr((item?.techStack||[]).join(', '))}" placeholder="Ahrefs, SEMrush, GA4…">
    </div>`;
  }

  html += `
  <div class="form-row">
    <div class="form-group">
      <label>Cover Image ${item ? '(leave blank to keep)' : ''}</label>
      <input type="file" id="f_image" accept="image/*">
    </div>
    <div class="form-group">
      <label>Image Alt Text</label>
      <input type="text" id="f_alt" value="${escAttr(item?.imageAlt || '')}" placeholder="SEO keywords…">
    </div>
  </div>
  <div class="modal-actions">
    <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
    <button type="submit" class="btn btn-primary" id="modalSubmitBtn">${item ? 'Update' : 'Save'} ${capitalize(module.slice(0,-1))}</button>
  </div>
  </form>`;

  document.getElementById('modalBody').innerHTML = html;

  // Init Quill
  if (isContent) {
    quillEditor = new Quill('#quillEditor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1,2,3,false] }],
          ['bold','italic','underline'],
          ['link','blockquote','code-block'],
          [{ list:'ordered' }, { list:'bullet' }],
          ['clean']
        ]
      }
    });
    if (item?.content) quillEditor.root.innerHTML = item.content;
  }

  document.getElementById('crudForm').onsubmit = (e) => saveItem(e, module, currentEditingId);
  document.getElementById('crudModal').classList.add('open');
}

function closeModal() {
  document.getElementById('crudModal').classList.remove('open');
  quillEditor = null;
}

/* ── SAVE ───────────────────────────────────── */
async function saveItem(e, module, id = null) {
  e.preventDefault();
  const token = getToken();
  const btn   = document.getElementById('modalSubmitBtn');
  btn.disabled = true; btn.textContent = 'Saving…';

  const formData = new FormData();
  formData.append('title', document.getElementById('f_title').value);

  if (module === 'blogs' || module === 'faqs' || module === 'reviews') {
    const cat = module === 'faqs' ? 'FAQ' : module === 'reviews' ? 'Review' : (document.getElementById('f_category')?.value || 'Blog');
    formData.append('category', cat);
    formData.append('content', quillEditor ? quillEditor.root.innerHTML : '');
    if (module === 'reviews') formData.append('subtitle', document.getElementById('f_subtitle')?.value || '');
  } else {
    ['description','situation','task','action','result'].forEach(f => {
      formData.append(f, document.getElementById(`f_${f}`)?.value || '');
    });
    formData.append('techStack', document.getElementById('f_techs')?.value || '');
  }

  const img = document.getElementById('f_image')?.files[0];
  if (img) formData.append('coverImage', img);
  formData.append('imageAlt', document.getElementById('f_alt')?.value || '');

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? (module === 'projects' ? `${API_URL}/projects/${id}` : `${API_URL}/content/${id}`)
      : (module === 'projects' ? `${API_URL}/projects`       : `${API_URL}/content`);

    const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });

    if (res.ok) {
      showToast(`${capitalize(module.slice(0,-1))} ${id ? 'updated' : 'created'} successfully!`, 'success');
      closeModal();
      renderModule(module);
    } else {
      const data = await res.json();
      showToast(data.message || 'Failed to save', 'error');
      btn.disabled = false; btn.textContent = id ? 'Update' : 'Save';
    }
  } catch (err) {
    showToast('Server error: ' + err.message, 'error');
    btn.disabled = false; btn.textContent = id ? 'Update' : 'Save';
  }
}

/* ── EDIT ───────────────────────────────────── */
async function editItem(module, id) {
  const token    = getToken();
  const endpoint = module === 'projects' ? `${API_URL}/projects` : `${API_URL}/content`;
  try {
    const res   = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
    const items = await res.json();
    const item  = items.find(i => i._id === id);
    if (item) openModal(module, item);
    else showToast('Item not found', 'error');
  } catch (err) {
    showToast('Error loading item: ' + err.message, 'error');
  }
}

/* ── DELETE ─────────────────────────────────── */
async function deleteItem(module, id) {
  if (!confirm(`Delete this ${module.slice(0,-1)}? This cannot be undone.`)) return;
  const token    = getToken();
  const endpoint = module === 'projects' ? 'projects' : 'content';
  try {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      showToast(`${capitalize(module.slice(0,-1))} deleted.`, 'info');
      renderModule(module);
    } else {
      const err = await res.json();
      showToast(err.message || 'Delete failed', 'error');
    }
  } catch (err) {
    showToast('Server error: ' + err.message, 'error');
  }
}

/* ── TOGGLE MESSAGE STATUS ──────────────────── */
async function toggleMsgStatus(id, currentStatus) {
  const token = getToken();
  const next = currentStatus === 'New' ? 'Read' : currentStatus === 'Read' ? 'Replied' : 'New';
  try {
    const res = await fetch(`${API_URL}/messages/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next })
    });
    if (res.ok) {
      showToast(`Marked as ${next}`, 'success');
      renderModule('messages');
    } else {
      const data = await res.json();
      showToast(data.message || 'Failed', 'error');
    }
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

/* ── LOGOUT ─────────────────────────────────── */
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = 'login.html';
}

/* ── HELPERS ────────────────────────────────── */
function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) { return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function stripHtml(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
function getModuleIcon(m) {
  return { projects:'📁', blogs:'✍️', faqs:'❓', reviews:'⭐', messages:'📩' }[m] || '📂';
}

// Expose for inline onclick
window.openMsgModal = (name, encodedText) => {
  document.getElementById('msgModalName').textContent = name;
  document.getElementById('msgModalText').textContent = decodeURIComponent(encodedText);
  document.getElementById('msgModal').classList.add('open');
};
window.closeMsgModal = closeMsgModal;
window.editItem      = editItem;
window.deleteItem    = deleteItem;
window.toggleMsgStatus = toggleMsgStatus;

/* ── BADGE (defined in global) ──────────────── */
const badgeCyan = 'badge-cyan';
// alias for CSS
function badge_cyan() {} // no-op, just to reference for completeness

/* ── INIT ───────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('dashboard-body')) return;

  if (!checkAuth()) return;

  startClock();
  initSidebar();
  initNav();
  fetchStats();
});
