import './style.css'
import { supabase } from './supabase.js'

// ─── Load Stories from Supabase ──────────────────────────
async function loadStories() {
  const container = document.getElementById('stories-list')
  if (!container) return

  try {
    const { data: stories, error } = await supabase
      .from('stories')
      .select('title, slug, excerpt')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!stories || stories.length === 0) {
      container.innerHTML = '<p class="empty-text">Próximamente, nuevos relatos.</p>'
      return
    }

    container.innerHTML = stories.map(story => `
      <article class="story-preview">
        <h3 class="story-title">${story.title}</h3>
        <p class="story-excerpt">${story.excerpt || ''}...</p>
        <a href="/story.html?slug=${story.slug}" class="read-more-btn">Leer relato</a>
      </article>
    `).join('')

  } catch (err) {
    console.error('Error loading stories:', err)
    container.innerHTML = '<p class="empty-text">Error al cargar los relatos. Intentá de nuevo más tarde.</p>'
  }
}

loadStories()

// ─── Visitor Counter Logic ───────────────────────────────
const counterDisplay = document.getElementById('visit-count')

if (counterDisplay) {
    // Namespace based on domain, key is 'visits'
    const NAMESPACE = 'marcelognisci-web'
    const KEY = 'visits'

    // Try to get count from API
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(res => res.json())
        .then(data => {
            // Start at 77
            const count = data.value + 77
            counterDisplay.innerText = count.toString().padStart(5, '0')
        })
        .catch(err => {
            console.warn('Counter API failed, using local fallback', err)
            // Fallback: Simulate a count based on local storage or random start
            let count = localStorage.getItem('local_visit_count') || 77
            count = parseInt(count) + 1
            localStorage.setItem('local_visit_count', count)
            counterDisplay.innerText = count.toString().padStart(5, '0')
        })
}
