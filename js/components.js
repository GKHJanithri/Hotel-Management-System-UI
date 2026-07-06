async function loadComponent(selector, filePath) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
}

function setPageTitle() {
  const title = document.body.dataset.title;
  const sub   = document.body.dataset.sub;
  const el    = document.getElementById('page-title');
  const elSub = document.getElementById('page-sub');
  if (title && el) el.textContent = title;
  if (sub && elSub) elSub.textContent = sub;
}

async function loadAllComponents() {
  await loadComponent('#sidebar-placeholder', 'components/sidebar.html');
  await loadComponent('#topbar-placeholder',  'components/topbar.html');
  await loadComponent('#footer-placeholder',  'components/footer.html');
  setActiveNav();
  setPageTitle();
}

document.addEventListener('DOMContentLoaded', loadAllComponents);