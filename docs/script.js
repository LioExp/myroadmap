function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.hasAttribute('data-theme');

  if (isLight) {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }

  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
  if (sun && moon) {
    sun.style.display = isLight ? '' : 'none';
    moon.style.display = isLight ? 'none' : '';
  }
}

const nodes1 = document.querySelectorAll('[data-col="1"]');
let done = 0, total = nodes1.length;

nodes1.forEach(n => {
  if (n.classList.contains('done')) done++;
  n.addEventListener('click', () => {
    if (n.classList.contains('current')) return;
    const wasDone = n.classList.contains('done');
    n.classList.toggle('done');
    done += wasDone ? -1 : 1;
    updateProgress();
  });
});

function updateProgress() {
  const pct = Math.round((done / total) * 100);
  document.getElementById('prog1').style.width = pct + '%';
  document.getElementById('lbl1').innerHTML = `<span>${done} / ${total}</span><span>${pct}%</span>`;
}

updateProgress();
