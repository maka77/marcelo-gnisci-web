import './style.css'
import './admin.css'
import { supabase } from './supabase.js'

// ─── State ───────────────────────────────────────────────
let currentUser = null
let stories = []
let editingStory = null
let selectedImage = null

// ─── DOM ─────────────────────────────────────────────────
const app = document.getElementById('admin-app')

// ─── Init ────────────────────────────────────────────────
async function init() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    currentUser = session.user
    showDashboard()
  } else {
    showLogin()
  }
}

// ─── Login ───────────────────────────────────────────────
function showLogin() {
  app.innerHTML = `
    <div class="admin-login">
      <div class="admin-login-card">
        <div class="admin-login-icon">🔒</div>
        <h2>Panel de Administración</h2>
        <p class="admin-login-subtitle">Ingresá con tu cuenta para gestionar los relatos</p>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required placeholder="tu@email.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" required placeholder="••••••••" autocomplete="current-password">
          </div>
          <div id="login-error" class="error-message" style="display: none;"></div>
          <button type="submit" class="btn-primary" id="btn-login">Ingresar</button>
        </form>
      </div>
    </div>
  `
  document.getElementById('login-form').addEventListener('submit', handleLogin)
}

async function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const errorEl = document.getElementById('login-error')
  const btn = document.getElementById('btn-login')

  btn.disabled = true
  btn.textContent = 'Ingresando...'
  errorEl.style.display = 'none'

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    errorEl.textContent = 'Email o contraseña incorrectos'
    errorEl.style.display = 'block'
    btn.disabled = false
    btn.textContent = 'Ingresar'
    return
  }

  currentUser = data.user
  showDashboard()
}

// ─── Dashboard ───────────────────────────────────────────
async function showDashboard() {
  app.innerHTML = '<div class="story-loading">Cargando relatos...</div>'

  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  stories = data || []

  app.innerHTML = `
    <div class="admin-dashboard">
      <div class="admin-header">
        <h2>Mis Relatos</h2>
        <div class="admin-actions">
          <button class="btn-primary btn-new" id="btn-new">+ Nuevo Relato</button>
          <button class="btn-secondary" id="btn-logout">Cerrar sesión</button>
        </div>
      </div>
      ${stories.length === 0
        ? '<div class="admin-empty"><p>No hay relatos aún.</p><p class="admin-empty-hint">Hacé click en "+ Nuevo Relato" para empezar</p></div>'
        : `<div class="admin-stories-list">
            ${stories.map(s => `
              <div class="admin-story-item ${s.published ? '' : 'unpublished'}">
                <div class="admin-story-info">
                  <h3>${escapeHtml(s.title)}</h3>
                  <div class="admin-story-meta">
                    <span class="story-status ${s.published ? 'published' : 'draft'}">${s.published ? '● Publicado' : '○ Borrador'}</span>
                    <span class="story-date">${new Date(s.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div class="admin-story-actions">
                  <button class="btn-icon btn-view" data-slug="${s.slug}" title="Ver">👁</button>
                  <button class="btn-icon btn-edit" data-id="${s.id}" title="Editar">✏️</button>
                  <button class="btn-icon btn-delete" data-id="${s.id}" data-title="${escapeHtml(s.title)}" title="Eliminar">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>`
      }
    </div>
  `

  // Event listeners
  document.getElementById('btn-new').addEventListener('click', () => showEditor(null))
  document.getElementById('btn-logout').addEventListener('click', handleLogout)

  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(`/story.html?slug=${btn.dataset.slug}`, '_blank')
    })
  })

  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const story = stories.find(s => s.id === btn.dataset.id)
      showEditor(story)
    })
  })

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id, btn.dataset.title))
  })
}

// ─── Editor ──────────────────────────────────────────────
function showEditor(story) {
  editingStory = story
  selectedImage = null

  const now = new Date()
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const defaultSignature = `Marcelo Gnisci, ${months[now.getMonth()]} ${now.getFullYear()}.`

  app.innerHTML = `
    <div class="admin-editor">
      <div class="admin-header">
        <h2>${story ? 'Editar Relato' : 'Nuevo Relato'}</h2>
        <button class="btn-secondary" id="btn-back">← Volver</button>
      </div>
      <div class="editor-layout">
        <div class="editor-form">
          <div class="form-group">
            <label for="story-title">Título</label>
            <input type="text" id="story-title" value="${escapeHtml(story?.title || '')}" placeholder="Título del relato" required>
          </div>

          <div class="form-group">
            <label for="story-content">Contenido del relato</label>
            <p class="form-hint">Escribí cada párrafo en una línea separada. Presioná Enter para separar párrafos.</p>
            <textarea id="story-content" rows="20" placeholder="Escribí tu relato aquí...&#10;&#10;Cada línea será un párrafo separado.&#10;&#10;Como en tus otros relatos.">${escapeHtml(story?.content || '')}</textarea>
          </div>

          <div class="form-group">
            <label for="story-excerpt">Extracto (para la página principal)</label>
            <p class="form-hint">Si lo dejás vacío, se usa la primera línea del contenido.</p>
            <input type="text" id="story-excerpt" value="${escapeHtml(story?.excerpt || '')}" placeholder="Primeras líneas del relato...">
          </div>

          <div class="form-group">
            <label for="story-signature">Firma</label>
            <input type="text" id="story-signature" value="${escapeHtml(story?.signature || defaultSignature)}" placeholder="Marcelo Gnisci, Julio 2026.">
          </div>

          <div class="form-group">
            <label>Imagen del relato</label>
            ${story?.image_url ? `
              <div class="current-image">
                <img src="${story.image_url}" alt="Imagen actual">
                <p>Imagen actual — subí una nueva para reemplazarla</p>
              </div>
            ` : ''}
            <div class="image-upload-area" id="image-upload-area">
              <input type="file" id="story-image" accept="image/*" hidden>
              <div class="upload-placeholder" id="upload-placeholder">
                <span class="upload-icon">📷</span>
                <p>Click o arrastrá una imagen aquí</p>
                <p class="form-hint">JPG, PNG o WebP</p>
              </div>
              <div id="image-preview" class="image-preview" style="display:none;"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="story-published" ${story ? (story.published ? 'checked' : '') : 'checked'}>
              <span class="checkbox-custom"></span>
              Publicar en el sitio
            </label>
          </div>

          <div class="form-actions">
            <button class="btn-primary btn-save" id="btn-save">
              ${story ? 'Guardar cambios' : 'Publicar relato'}
            </button>
            <button class="btn-secondary" id="btn-cancel">Cancelar</button>
          </div>
        </div>

        <div class="editor-preview">
          <h3 class="preview-label">Vista previa</h3>
          <div class="preview-content" id="preview-content">
            <div class="story-full preview-story">
              <div id="preview-image-container" class="story-hero-container" style="${story?.image_url ? '' : 'display:none;'}">
                ${story?.image_url ? `<img src="${story.image_url}" alt="Preview" class="story-hero-image">` : ''}
              </div>
              <h1 class="story-title-main" id="preview-title">${escapeHtml(story?.title || 'Título del relato')}</h1>
              <div class="story-content" id="preview-body">
                ${story?.content
                  ? story.content.split('\n').filter(l => l.trim()).map(l => `<p>${escapeHtml(l)}</p>`).join('') +
                    `<p class="story-signature">${escapeHtml(story.signature || defaultSignature)}</p>`
                  : '<p class="preview-placeholder">El contenido aparecerá aquí mientras escribís...</p>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Event listeners
  document.getElementById('btn-back').addEventListener('click', showDashboard)
  document.getElementById('btn-cancel').addEventListener('click', showDashboard)
  document.getElementById('btn-save').addEventListener('click', handleSave)

  // Live preview updates
  const titleInput = document.getElementById('story-title')
  const contentInput = document.getElementById('story-content')
  const signatureInput = document.getElementById('story-signature')

  titleInput.addEventListener('input', updatePreview)
  contentInput.addEventListener('input', updatePreview)
  signatureInput.addEventListener('input', updatePreview)

  // Image upload
  const uploadArea = document.getElementById('image-upload-area')
  const imageInput = document.getElementById('story-image')

  uploadArea.addEventListener('click', (e) => {
    if (e.target === imageInput) return
    imageInput.click()
  })

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault()
    uploadArea.classList.add('dragover')
  })

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover')
  })

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault()
    uploadArea.classList.remove('dragover')
    if (e.dataTransfer.files[0]) handleImageSelect(e.dataTransfer.files[0])
  })

  imageInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleImageSelect(e.target.files[0])
  })
}

function handleImageSelect(file) {
  selectedImage = file
  const reader = new FileReader()
  reader.onload = (e) => {
    // Update upload area preview
    const placeholder = document.getElementById('upload-placeholder')
    const preview = document.getElementById('image-preview')
    if (placeholder) placeholder.style.display = 'none'
    preview.innerHTML = `<img src="${e.target.result}" alt="Preview"><p class="form-hint">Imagen seleccionada ✓</p>`
    preview.style.display = 'block'

    // Update story preview
    const previewContainer = document.getElementById('preview-image-container')
    previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview" class="story-hero-image">`
    previewContainer.style.display = 'flex'
  }
  reader.readAsDataURL(file)
}

function updatePreview() {
  const title = document.getElementById('story-title').value
  const content = document.getElementById('story-content').value
  const signature = document.getElementById('story-signature').value

  // Title
  const previewTitle = document.getElementById('preview-title')
  previewTitle.textContent = title || 'Título del relato'

  // Content
  const previewBody = document.getElementById('preview-body')
  const lines = content.split('\n').filter(l => l.trim())

  if (lines.length === 0) {
    previewBody.innerHTML = '<p class="preview-placeholder">El contenido aparecerá aquí mientras escribís...</p>'
  } else {
    const html = lines.map(l => `<p>${escapeHtml(l)}</p>`).join('')
    previewBody.innerHTML = html + (signature ? `<p class="story-signature">${escapeHtml(signature)}</p>` : '')
  }
}

// ─── Save Story ──────────────────────────────────────────
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function handleSave() {
  const title = document.getElementById('story-title').value.trim()
  const content = document.getElementById('story-content').value.trim()
  const excerpt = document.getElementById('story-excerpt').value.trim()
  const signature = document.getElementById('story-signature').value.trim()
  const published = document.getElementById('story-published').checked

  if (!title) {
    showToast('El título es obligatorio', 'error')
    return
  }
  if (!content) {
    showToast('El contenido es obligatorio', 'error')
    return
  }

  const saveBtn = document.getElementById('btn-save')
  saveBtn.disabled = true
  saveBtn.textContent = 'Guardando...'

  try {
    let image_url = editingStory?.image_url || null

    // Upload image if one was selected
    if (selectedImage) {
      const ext = selectedImage.name.split('.').pop().toLowerCase()
      const fileName = `${generateSlug(title)}-${Date.now()}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('story-images')
        .upload(fileName, selectedImage, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('story-images')
        .getPublicUrl(fileName)

      image_url = publicUrl
    }

    const storyData = {
      title,
      slug: editingStory?.slug || generateSlug(title),
      content,
      excerpt: excerpt || content.split('\n').find(l => l.trim())?.substring(0, 150) || '',
      image_url,
      signature,
      published,
      updated_at: new Date().toISOString()
    }

    let result
    if (editingStory) {
      result = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', editingStory.id)
    } else {
      result = await supabase
        .from('stories')
        .insert([storyData])
    }

    if (result.error) throw result.error

    showToast(editingStory ? 'Relato actualizado ✓' : 'Relato publicado ✓', 'success')

    setTimeout(() => showDashboard(), 800)
  } catch (err) {
    console.error('Error saving story:', err)
    showToast('Error al guardar: ' + err.message, 'error')
    saveBtn.disabled = false
    saveBtn.textContent = editingStory ? 'Guardar cambios' : 'Publicar relato'
  }
}

// ─── Delete Story ────────────────────────────────────────
async function handleDelete(id, title) {
  if (!confirm(`¿Estás seguro de eliminar "${title}"?\n\nEsta acción no se puede deshacer.`)) return

  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)

  if (error) {
    showToast('Error al eliminar: ' + error.message, 'error')
    return
  }

  showToast('Relato eliminado', 'success')
  showDashboard()
}

// ─── Logout ──────────────────────────────────────────────
async function handleLogout() {
  await supabase.auth.signOut()
  currentUser = null
  showLogin()
}

// ─── Helpers ─────────────────────────────────────────────
function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove())

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible')
  })

  // Animate out
  setTimeout(() => {
    toast.classList.remove('toast-visible')
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// ─── Start ───────────────────────────────────────────────
init()
