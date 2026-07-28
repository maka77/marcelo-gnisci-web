import './style.css'
import { supabase } from './supabase.js'

async function loadStory() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug')
  const container = document.getElementById('story-container')

  if (!slug) {
    showNotFound(container)
    return
  }

  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !story) {
    showNotFound(container)
    return
  }

  document.title = `${story.title} | Marcelo Gnisci`

  // Convert newline-separated content to HTML paragraphs
  const contentHtml = story.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p>${line}</p>`)
    .join('\n')

  container.innerHTML = `
    ${story.image_url ? `
    <div class="story-hero-container">
      <img src="${story.image_url}" alt="${story.title}" class="story-hero-image" />
    </div>` : ''}
    <h1 class="story-title-main">${story.title}</h1>
    <div class="story-content">
      ${contentHtml}
      ${story.signature ? `<p class="story-signature">${story.signature}</p>` : ''}
    </div>
    <div class="story-footer">
      <a href="/" class="back-link">← Volver al inicio</a>
    </div>
  `
}

function showNotFound(container) {
  document.title = 'Relato no encontrado | Marcelo Gnisci'
  container.innerHTML = `
    <div class="story-not-found">
      <h1 class="story-title-main">Relato no encontrado</h1>
      <p>El relato que buscás no existe o fue eliminado.</p>
      <div class="story-footer">
        <a href="/" class="back-link">← Volver al inicio</a>
      </div>
    </div>
  `
}

loadStory()
