import './style.css'
// Minimal logic for the site
console.log('Marcelo Gnisci Portfolio Loaded');

// Visitor Counter Logic
const counterDisplay = document.getElementById('visit-count');

if (counterDisplay) {
    // Namespace based on domain, key is 'visits'
    const NAMESPACE = 'marcelognisci-web';
    const KEY = 'visits';

    // Try to get count from API
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(res => res.json())
        .then(data => {
            // Start at 77
            const count = data.value + 77;
            counterDisplay.innerText = count.toString().padStart(5, '0');
        })
        .catch(err => {
            console.warn('Counter API failed, using local fallback', err);
            // Fallback: Simulate a count based on local storage or random start
            let count = localStorage.getItem('local_visit_count') || 77;
            count = parseInt(count) + 1;
            localStorage.setItem('local_visit_count', count);
            counterDisplay.innerText = count.toString().padStart(5, '0');
        });
}
