document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 
  /* MENÚ MÓVIL */
  const nav = $('#nav'), menuBtn = $('#menu-toggle');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
 
  /* BUSCADOR */
  const searchBar = $('#search-bar'), searchBtn = $('#search-toggle'), searchInput = $('#search-input');
  const cards = document.querySelectorAll('.company-card'), noResults = $('#no-results');
  searchBtn.addEventListener('click', () => {
    const show = searchBar.hidden;
    searchBar.hidden = !show;
    searchBtn.setAttribute('aria-expanded', show);
    if (show) searchInput.focus(); else { searchInput.value = ''; filter(); }
  });
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function filter() {
    const q = norm(searchInput.value.trim());
    let n = 0;
    cards.forEach((c) => {
      const ok = norm(c.textContent).includes(q);
      c.hidden = !ok;
      if (ok) n++;
    });
    noResults.hidden = n > 0;
  }
  searchInput.addEventListener('input', () => {
    filter();
    if (searchInput.value.trim()) location.hash = '#empresas';
  });
 
  /* MENÚ ACTIVO AL HACER SCROLL */
  const links = document.querySelectorAll('.nav-link');
  const sections = [...links].map((l) => document.querySelector(l.getAttribute('href')));
  const setActive = () => {
    const y = window.scrollY + 120;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 5) idx = sections.length - 1;
    links.forEach((l, i) => l.classList.toggle('active', i === idx));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
 
  /* UTILIDADES DE FORMULARIO */
  const setError = (input, errEl, msg) => {
    errEl.textContent = msg;
    if (input) input.classList.toggle('invalid', !!msg);
    return !msg;
  };
  const feedback = (el, type, msg) => {
    el.className = 'form-feedback ' + type;
    el.textContent = msg;
  };
 
  /* FORMULARIO DE CONTACTO */
  const cForm = $('#contact-form'), cFb = $('#contact-feedback');
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('#nombre'), m = $('#email'), t = $('#mensaje');
    const r = [
      setError(n, $('#c-name-error'), n.value.trim().length < 3 ? 'Escribe tu nombre (mínimo 3 letras).' : ''),
      setError(m, $('#c-email-error'), emailOk(m.value.trim()) ? '' : 'Escribe un correo válido.'),
      setError(t, $('#c-msg-error'), t.value.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : '')
    ];
    if (r.includes(false)) return feedback(cFb, 'error', 'Revisa los campos marcados.');
    feedback(cFb, 'success', '¡Gracias, ' + n.value.trim() + '! Recibimos tu mensaje.');
    cForm.reset();
  });
 
  /* FORMULARIO DE RESEÑAS */
  const rForm = $('#review-form'), rFb = $('#form-feedback'), ratingInput = $('#rating-value');
  rForm.querySelectorAll('input[name="star"]').forEach((s) =>
    s.addEventListener('change', () => { ratingInput.value = s.value; setError(null, $('#rating-error'), ''); })
  );
 
  rForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#author-name'), mail = $('#author-email'), com = $('#author-comment');
    const rating = parseInt(ratingInput.value, 10);
    const r = [
      setError(name, $('#name-error'), name.value.trim().length < 3 ? 'Escribe tu nombre completo.' : ''),
      setError(mail, $('#email-error'), emailOk(mail.value.trim()) ? '' : 'Escribe un correo válido.'),
      setError(null, $('#rating-error'), rating >= 1 ? '' : 'Elige una calificación.'),
      setError(com, $('#comment-error'), com.value.trim().length < 10 ? 'El comentario debe tener al menos 10 caracteres.' : '')
    ];
    if (r.includes(false)) return feedback(rFb, 'error', 'Revisa los campos marcados.');
 
    const card = document.createElement('div');
    card.className = 'user-review';
    const head = document.createElement('div');
    head.className = 'review-user-header';
    const strong = document.createElement('strong');
    strong.textContent = name.value.trim();
    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    stars.setAttribute('aria-label', rating + ' estrellas');
    head.append(strong, stars);
    const p1 = document.createElement('p');
    p1.textContent = '"' + com.value.trim() + '"';
    const p2 = document.createElement('p');
    p2.textContent = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    card.append(head, p1, p2);
    $('#review-cards').prepend(card);
 
    feedback(rFb, 'success', '¡Gracias por tu reseña!');
    rForm.reset();
    ratingInput.value = '0';
  });
});