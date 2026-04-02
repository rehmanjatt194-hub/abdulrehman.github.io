let quill;
const API_URL = 'http://localhost:5001/api/v1';
let currentEditingId = null;

function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `stat-card animate-reveal-up ${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '2rem';
    toast.style.right = '2rem';
    toast.style.zIndex = '1000';
    toast.style.padding = '1rem 2rem';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    toast.innerHTML = `<strong>${type === 'success' ? '✓' : '✗'}</strong> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    /**
     * Handle Login
     */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');

            try {
                const res = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', data.username);
                    window.location.href = 'index.html';
                } else {
                    messageDiv.innerHTML = `<span class="error">${data.message}</span>`;
                }
            } catch (err) {
                messageDiv.innerHTML = `<span class="error">Server Error: ${err.message}</span>`;
            }
        });
    }

    /**
     * Check Auth on Dashboard
     */
    if (document.body.classList.contains('dashboard')) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        document.getElementById('userInfo').innerText = localStorage.getItem('adminUser');
        fetchDashboardStats();

        // Event Listeners for Navigation
        document.getElementById('nav-dashboard').addEventListener('click', (e) => { e.preventDefault(); showSection('dashboard'); });
        document.getElementById('nav-projects').addEventListener('click', (e) => { e.preventDefault(); showSection('projects'); });
        document.getElementById('nav-blogs').addEventListener('click', (e) => { e.preventDefault(); showSection('blogs'); });
        document.getElementById('nav-faqs').addEventListener('click', (e) => { e.preventDefault(); showSection('faqs'); });
        document.getElementById('nav-reviews').addEventListener('click', (e) => { e.preventDefault(); showSection('reviews'); });
        document.getElementById('nav-messages').addEventListener('click', (e) => { e.preventDefault(); showSection('messages'); });
        document.getElementById('nav-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });
    }
});

/**
 * Fetch Stats
 */
async function fetchDashboardStats() {
    try {
        const [proj, cont, mess] = await Promise.all([
            fetch(`${API_URL}/projects`).then(r => r.json()),
            fetch(`${API_URL}/content`).then(r => r.json()),
            fetch(`${API_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            }).then(r => r.json())
        ]);

        document.getElementById('countProjects').innerText = proj.length;
        document.getElementById('countBlogs').innerText = cont.length;
        document.getElementById('countMessages').innerText = Array.isArray(mess) ? mess.length : 0;
    } catch (err) {
        console.error('Stats fetch error:', err);
    }
}

/**
 * Navigation
 */
function showSection(section) {
    const title = document.getElementById('sectionTitle');
    const dashboardSection = document.getElementById('dashboardSection');
    const dynamicContent = document.getElementById('dynamicContent');
    
    // Reset nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    if (section === 'dashboard') {
        title.innerText = 'Dashboard Overview';
        dashboardSection.style.display = 'block';
        dynamicContent.innerHTML = '';
        fetchDashboardStats();
    } else {
        dashboardSection.style.display = 'none';
        title.innerText = section.charAt(0).toUpperCase() + section.slice(1);
        renderModule(section);
    }
}

/**
 * Render Modules (WIP - Expandable)
 */
/**
 * Render Modules (Functional)
 */
async function renderModule(module) {
    const div = document.getElementById('dynamicContent');
    div.innerHTML = `<div class="card">Loading ${module}...</div>`;
    
    const token = localStorage.getItem('adminToken');
    
    try {
        if (module === 'messages') {
            const res = await fetch(`${API_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const messages = await res.json();
            
            let html = `<div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h3>Recent Project Inquiries</h3>
                </div>
                <table style="width:100%; border-collapse:collapse; font-size: 0.9rem;">
                    <thead><tr style="text-align:left; color:var(--text-muted); border-bottom:1px solid var(--border);">
                        <th style="padding:1rem;">Name</th>
                        <th style="padding:1rem;">Contact</th>
                        <th style="padding:1rem;">Details</th>
                        <th style="padding:1rem;">Status</th>
                        <th style="padding:1rem;">Actions</th>
                    </tr></thead><tbody>`;
            
            if (!Array.isArray(messages)) {
                throw new Error(messages.message || "Failed to load messages. Please login again.");
            }

            messages.reverse().forEach(m => {
                const statusColor = m.status === 'New' ? '#3b82f6' : (m.status === 'Read' ? '#10b981' : '#64748b');
                
                html += `<tr style="border-bottom:1px solid var(--border); ${m.status === 'New' ? 'background:rgba(59, 130, 246, 0.05);' : ''}">
                    <td style="padding:1rem;"><strong>${m.name}</strong><br><small>${m.title || ''}</small></td>
                    <td style="padding:1rem;">${m.email}<br><small>${m.phone || 'N/A'}</small></td>
                    <td style="padding:1rem;">Budget: <span style="color:var(--primary);">$${m.budget || 'N/A'}</span><br>URL: <a href="${m.url}" target="_blank" style="color:var(--text-muted);">${m.url || 'N/A'}</a></td>
                    <td style="padding:1rem;">
                        <span style="background:${statusColor}; color:white; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold;">${m.status}</span>
                    </td>
                    <td style="padding:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <button class="btn-view-msg" data-name="${m.name}" data-msg="${encodeURIComponent(m.message)}" style="background:var(--primary); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Read</button>
                        <button class="btn-toggle-msg" data-id="${m._id}" data-status="${m.status}" style="background:none; border:1px solid var(--border); color:var(--text-muted); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Change Status</button>
                    </td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
            div.innerHTML = html;

            // Bind Event Listeners
            div.querySelectorAll('.btn-view-msg').forEach(btn => {
                btn.onclick = () => window.openMessageModal(btn.dataset.name, decodeURIComponent(btn.dataset.msg));
            });
            div.querySelectorAll('.btn-toggle-msg').forEach(btn => {
                btn.onclick = () => toggleMessageStatus(btn.dataset.id, btn.dataset.status);
            });

        } else {
            let endpoint = `${API_URL}/content`;
            if (module === 'blogs') endpoint += '?category=Blog';
            if (module === 'faqs') endpoint += '?category=FAQ';
            if (module === 'reviews') endpoint += '?category=Review';
            if (module === 'projects') endpoint = `${API_URL}/projects`;

            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const items = await res.json();
            
            let html = `<div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h3>Manage ${module.charAt(0).toUpperCase() + module.slice(1)}</h3>
                    <button class="btn-primary btn-add" data-module="${module}" style="width:auto; padding:0.5rem 1rem;">+ Add New</button>
                </div>
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr style="text-align:left; color:var(--text-muted); border-bottom:1px solid var(--border);">
                        <th style="padding:1rem;">Title / Name</th>
                        <th style="padding:1rem;">${module === 'blogs' ? 'Category' : (module === 'faqs' ? 'Question' : (module === 'reviews' ? 'Role' : 'Technologies'))}</th>
                        <th style="padding:1rem;">Actions</th>
                    </tr></thead><tbody>`;
            
                if (!Array.isArray(items)) {
                    throw new Error(items.message || `Failed to load ${module}. Please login again.`);
                }

                items.forEach(item => {
                    let subtext = 'N/A';
                    if (module === 'blogs') subtext = item.category;
                    if (module === 'faqs') subtext = 'FAQ Item';
                    if (module === 'reviews') subtext = item.subtitle || 'Client';
                    if (module === 'projects') subtext = item.techStack ? item.techStack.join(', ') : 'N/A';

                    html += `<tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:1rem;">${item.title}</td>
                        <td style="padding:1rem;">${subtext}</td>
                        <td style="padding:1rem; display:flex; gap:0.5rem;">
                            <button class="btn-edit" data-module="${module}" data-id="${item._id}" style="background:var(--primary); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Edit</button>
                            <button class="btn-delete" data-module="${module}" data-id="${item._id}" style="background:none; border:1px solid #f87171; color:#f87171; padding:4px 8px; border-radius:4px; cursor:pointer;">Delete</button>
                        </td>
                    </tr>`;
                });
                html += `</tbody></table></div>
                <div id="formContainer"></div>`;
                div.innerHTML = html;

                div.querySelectorAll('.btn-add').forEach(btn => btn.onclick = () => openForm(module));
                div.querySelectorAll('.btn-edit').forEach(btn => btn.onclick = () => editItem(module, btn.dataset.id));
                div.querySelectorAll('.btn-delete').forEach(btn => btn.onclick = () => deleteItem(btn.dataset.module, btn.dataset.id));
            }
        } catch (err) {
            showToast(err.message, 'error');
    }
}

async function editItem(module, id) {
    const token = localStorage.getItem('adminToken');
    const endpoint = module === 'projects' ? `${API_URL}/projects` : `${API_URL}/content`;
    
    try {
        const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
        const items = await res.json();
        const item = items.find(i => i._id === id);
        if (item) openForm(module, item);
    } catch (err) {
        showToast("Error loading item: " + err.message, 'error');
    }
}

/**
 * Open CRUD Form
 */
function openForm(module, item = null) {
    currentEditingId = item ? item._id : null;
    const container = document.getElementById('formContainer');
    container.innerHTML = `
        <div class="card" style="margin-top:2rem; animate-reveal-up;">
            <h3>${item ? 'Edit' : 'Add New'} ${module.slice(0,-1)}</h3>
            <form id="crudForm" style="margin-top:1.5rem;">
                <div class="form-group">
                    <label>${module === 'reviews' ? 'Reviewer Name' : (module === 'faqs' ? 'Question' : 'Title')}</label>
                    <input type="text" id="f_title" value="${item ? item.title : ''}" required>
                </div>
                ${(module === 'blogs' || module === 'faqs' || module === 'reviews') ? `
                    ${module === 'reviews' ? `
                    <div class="form-group">
                        <label>Reviewer Role / Company</label>
                        <input type="text" id="f_subtitle" value="${item ? (item.subtitle || '') : ''}" placeholder="e.g. CEO at TechCorp">
                    </div>
                    ` : ''}
                    <div class="form-group">
                        <label>${module === 'faqs' ? 'Answer' : (module === 'reviews' ? 'Testimonial Content' : 'Content')}</label>
                        <div id="f_content_editor" style="height: 250px; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;"></div>
                        <textarea id="f_content" style="display:none;"></textarea>
                    </div>
                    ${module === 'blogs' ? `
                    <div class="form-group">
                        <label>Category</label>
                        <select id="f_category" style="width:100%; padding:0.75rem; background:#0f172a80; border:1px solid var(--border); border-radius:0.75rem; color:white;">
                            <option value="Blog" ${item && item.category === 'Blog' ? 'selected' : ''}>Blog</option>
                            <option value="Case Study" ${item && item.category === 'Case Study' ? 'selected' : ''}>Case Study</option>
                        </select>
                    </div>
                    ` : ''}
                ` : `
                <div class="form-group">
                    <label>Description (Brief Summary)</label>
                    <textarea id="f_description" rows="2" style="width:100%; padding:1rem; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;">${item ? item.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Situation (The Context)</label>
                    <textarea id="f_situation" rows="2" style="width:100%; padding:1rem; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;">${item ? (item.situation || '') : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Task (What needed to be done)</label>
                    <textarea id="f_task" rows="2" style="width:100%; padding:1rem; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;">${item ? (item.task || '') : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Action (What you did)</label>
                    <textarea id="f_action" rows="2" style="width:100%; padding:1rem; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;">${item ? (item.action || '') : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Result (The outcome)</label>
                    <textarea id="f_result" rows="2" style="width:100%; padding:1rem; background:#0f172a80; border:1px solid var(--border); border-radius:1rem; color:white;">${item ? (item.result || '') : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Technologies (Comma separated)</label>
                    <input type="text" id="f_techs" value="${item ? (item.techStack ? item.techStack.join(', ') : '') : ''}" placeholder="Ahrefs, SEMrush">
                </div>
                `}
                <div class="form-group">
                    <label>Cover Image ${item ? '(Leave blank to keep current)' : ''}</label>
                    <input type="file" id="f_image">
                </div>
                <div class="form-group">
                    <label>Image Alt Text</label>
                    <input type="text" id="f_alt" value="${item ? (item.imageAlt || '') : ''}" placeholder="SEO Keywords">
                </div>
                <div style="display:flex; gap:1rem;">
                    <button type="submit" class="btn-primary">${item ? 'Update' : 'Save'} ${module.slice(0,-1)}</button>
                    <button type="button" id="btn-cancel-form" class="btn-primary" style="background:#475569;">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('btn-cancel-form').onclick = () => { document.getElementById('formContainer').innerHTML = ''; };
    
    // Initialize Quill and Set Content if Editing
    if (module === 'blogs' || module === 'faqs' || module === 'reviews') {
        quill = new Quill('#f_content_editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    ['link', 'blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });
        if (item) quill.root.innerHTML = item.content;
    }

    document.getElementById('crudForm').onsubmit = (e) => saveItem(e, module, currentEditingId);
}

/**
 * Save Item (Create/Update)
 */
async function saveItem(e, module, id = null) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    
    formData.append('title', document.getElementById('f_title').value);
    
    if (module === 'blogs' || module === 'faqs' || module === 'reviews') {
        let cat = 'Blog';
        if (module === 'faqs') cat = 'FAQ';
        if (module === 'reviews') cat = 'Review';
        if (module === 'blogs') cat = document.getElementById('f_category').value;
        
        formData.append('category', cat);
        formData.append('content', quill.root.innerHTML);
        if (module === 'reviews') formData.append('subtitle', document.getElementById('f_subtitle').value);
    } else {
        formData.append('description', document.getElementById('f_description').value);
        formData.append('situation', document.getElementById('f_situation').value);
        formData.append('task', document.getElementById('f_task').value);
        formData.append('action', document.getElementById('f_action').value);
        formData.append('result', document.getElementById('f_result').value);
        formData.append('techStack', document.getElementById('f_techs').value);
    }

    const imageFile = document.getElementById('f_image').files[0];
    if (imageFile) formData.append('coverImage', imageFile);
    formData.append('imageAlt', document.getElementById('f_alt').value);

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id 
            ? (module === 'projects' ? `${API_URL}/projects/${id}` : `${API_URL}/content/${id}`)
            : (module === 'projects' ? `${API_URL}/projects` : `${API_URL}/content`);

        const res = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            showToast(`${module.slice(0, -1)} ${id ? 'updated' : 'saved'} successfully!`);
            document.getElementById('formContainer').innerHTML = '';
            renderModule(module);
        } else {
            const data = await res.json();
            showToast(data.message, 'error');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

/**
 * Delete Item
 */
async function deleteItem(module, id) {
    if (!confirm('Are you sure you want to delete this?')) return;
    const token = localStorage.getItem('adminToken');
    
    try {
        const endpoint = (module === 'projects') ? 'projects' : 'content';
        const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            renderModule(module);
        } else {
            const err = await res.json();
            alert(`Error: ${err.message}`);
        }
    } catch (err) {
        alert(`Server Error: ${err.message}`);
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

/**
 * Toggle Message Status
 */
async function toggleMessageStatus(id, currentStatus) {
    const token = localStorage.getItem('adminToken');
    // Cycle: New -> Read -> Replied -> New
    let nextStatus = 'New';
    if (currentStatus === 'New') nextStatus = 'Read';
    else if (currentStatus === 'Read') nextStatus = 'Replied';

    try {
        const res = await fetch(`${API_URL}/messages/${id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: nextStatus })
        });

        if (res.ok) {
            showToast(`Message marked as ${nextStatus}`);
            renderModule('messages');
        } else {
            const err = await res.json();
            showToast(`Error: ${err.message}`, 'error');
        }
    } catch (err) {
        showToast(`Server Error: ${err.message}`, 'error');
    }
}

/**
 * Custom Modal for Reading Full Messages
 */
window.openMessageModal = function(name, messageText) {
    console.log("Opening modal for:", name);
    let modal = document.getElementById('messageReaderModal');
    if (!modal) {
        console.log("Creating new modal DOM element");
        modal = document.createElement('div');
        modal.id = 'messageReaderModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modal.style.transition = 'all 0.3s ease';

        modal.innerHTML = `
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:1rem; max-width:600px; w-full; padding:2rem; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); transform:scale(0.95); transition:all 0.3s ease;" id="msgModalContent">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:1rem; margin-bottom:1rem;">
                    <h3 style="margin:0; font-size:1.25rem;">Message from <span id="msgModalName" style="color:var(--primary);"></span></h3>
                    <button onclick="closeMessageModal()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.5rem; line-height:1;">&times;</button>
                </div>
                <div id="msgModalText" style="color:var(--text-color); font-size:1rem; line-height:1.6; max-height:60vh; overflow-y:auto; padding-right:0.5rem; white-space:pre-wrap;"></div>
                <div style="margin-top:2rem; text-align:right;">
                    <button onclick="closeMessageModal()" class="btn-primary" style="padding:0.5rem 1.5rem;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('msgModalName').innerText = name;
    document.getElementById('msgModalText').innerText = messageText;

    // Show modal
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    document.getElementById('msgModalContent').style.transform = 'scale(1)';
}

window.closeMessageModal = function() {
    const modal = document.getElementById('messageReaderModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        document.getElementById('msgModalContent').style.transform = 'scale(0.95)';
    }
};
