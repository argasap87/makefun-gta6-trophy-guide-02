// TROPHY RADIO — GTA VI trophy guide & tracker.
// Loads app/data/trophies.json (a file under app/, never the network), keeps the
// checklist in localStorage, and renders the tracklist, the guide pane, the
// Roadmap to Platinum and the Missables view. ?demo=1 seeds 13 earned tracks
// so screenshots show progress; ?view=roadmap|missables and ?trophy=<id> open
// a view or a guide pane straight from a link.
const KEY = 'trophy-radio-earned-v1';
const SPOILER_KEY = 'trophy-radio-spoiler-v1';
const DEMO_EARNED = [2, 3, 8, 15, 16, 19, 21, 28, 33, 35, 42, 46, 52];
const ROADMAP_STAGES = [
  { title: 'Stage 1 — Play the story', text: 'Chapters 1–4, the named missions and the final mission, in story order. These 12 trophies pop from playing the story through.', ids: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 7] },
  { title: 'Stage 2 — Strangers, contacts & partners (before the finale)', text: 'Stranger strands, the five contacts’ final missions, the choice-gated trophy and the two partner trophies. Do these while the story still offers them — they are the missable-flagged set.', ids: [25, 22, 23, 24, 26, 27, 48, 33, 34] },
  { title: 'Stage 3 — Collectibles', text: 'Cards, WAiNK It locations, vehicles, areas of Leonida, garages and Scooter Bros registrations — the counted collections, folded into exploration.', ids: [30, 31, 35, 42, 54, 55] },
  { title: 'Stage 4 — Activities & skills', text: 'Stunts, races, the shooting range, fishing, arcade, bowling, meditation, hunting, challenges, robberies and the one-off stunts. Most are repeatable after the story.', ids: [15, 16, 17, 18, 19, 20, 21, 28, 29, 32, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 49, 50, 51] },
  { title: 'Stage 5 — Money, 100% & platinum', text: 'Launder $250,000 of Marked Bills, spend $100,000 in shops, then the 100% completion gold — and the platinum pops with it.', ids: [52, 53, 14, 1] },
];

const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((id) => byId.has(id)));
} catch { earned = new Set(); }
if (params.get('demo') === '1') earned = new Set(DEMO_EARNED);

let spoiler = localStorage.getItem(SPOILER_KEY) === '1';
let view = params.get('view') === 'roadmap' || params.get('view') === 'missables' ? params.get('view') : 'checklist';
let selectedId = Number(params.get('trophy') ?? '0') || null;
if (selectedId && !byId.has(selectedId)) selectedId = null;

const $ = (id) => document.getElementById(id);
const rowsEl = $('rows');
const skylineEl = $('skyline');

function save() { localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b))); }
function saveSpoiler() { localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0'); }
function isHidden(t) { return spoiler && t.kind === 'story' && !earned.has(t.id); }
function gradeDot(grade) { return `<span class="grade-dot grade-${grade}" aria-hidden="true"></span>`; }

function renderDial() {
  const n = earned.size;
  const total = trophies.length;
  $('earnedCount').textContent = n;
  $('dialFill').style.width = `${Math.round((n / total) * 100)}%`;
  $('dialPct').textContent = `${Math.round((n / total) * 100)}% — ${total - n} track${total - n === 1 ? '' : 's'} left`;
}

function renderSkyline() {
  skylineEl.replaceChildren();
  for (const t of trophies) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `sky-cell grade-${t.grade}${earned.has(t.id) ? ' earned' : ''}${selectedId === t.id ? ' selected' : ''}`;
    cell.title = isHidden(t) ? `Hidden story trophy (#${t.id})` : `${t.name} — ${t.grade}${earned.has(t.id) ? ' (earned)' : ''}`;
    cell.setAttribute('aria-label', cell.title);
    cell.addEventListener('click', () => { selectTrophy(t.id); });
    skylineEl.append(cell);
  }
}

function filteredTrophies() {
  const kind = $('kindFilter').value;
  const grade = $('gradeFilter').value;
  const state = $('earnedFilter').value;
  const q = $('search').value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'missable' ? !t.missable : kind !== 'all' && kind !== 'online' && t.kind !== kind) return false;
    if (kind === 'online') return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (state === 'earned' && !earned.has(t.id)) return false;
    if (state === 'unearned' && earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderRows() {
  const list = filteredTrophies();
  rowsEl.replaceChildren();
  for (const t of list) {
    const tr = document.createElement('tr');
    if (earned.has(t.id)) tr.classList.add('earned-row');
    if (selectedId === t.id) tr.classList.add('selected');
    const boxCell = document.createElement('td');
    boxCell.className = 'c-box';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${isHidden(t) ? `trophy ${t.id}` : t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); renderAll();
    });
    box.addEventListener('click', (e) => e.stopPropagation());
    boxCell.append(box);
    const numCell = document.createElement('td');
    numCell.className = 'c-num';
    numCell.textContent = String(t.id).padStart(2, '0');
    const nameCell = document.createElement('td');
    if (isHidden(t)) {
      nameCell.innerHTML = '<span class="t-name t-hidden">Hidden story trophy — earn it to reveal</span>';
    } else {
      const name = document.createElement('div');
      name.className = 't-name';
      name.textContent = t.name;
      const desc = document.createElement('div');
      desc.className = 't-desc';
      desc.textContent = t.description;
      nameCell.append(name, desc);
    }
    const gradeCell = document.createElement('td');
    gradeCell.innerHTML = `${gradeDot(t.grade)}<span class="grade-label">${t.grade}</span>`;
    const kindCell = document.createElement('td');
    const kind = document.createElement('span');
    kind.className = 'kind-tag';
    kind.textContent = t.kind;
    kindCell.append(kind);
    const flagCell = document.createElement('td');
    flagCell.className = 'c-flag';
    if (t.missable) {
      const badge = document.createElement('span');
      badge.className = 'flag-badge';
      badge.textContent = '!';
      badge.title = t.missableRule ?? 'Missable';
      flagCell.append(badge);
    }
    tr.append(boxCell, numCell, nameCell, gradeCell, kindCell, flagCell);
    tr.addEventListener('click', () => selectTrophy(t.id));
    rowsEl.append(tr);
  }
  const kind = $('kindFilter').value;
  $('rowCount').textContent = kind === 'online'
    ? 'No online trophies in the official list — all 55 are earned in story, activities or collectibles, offline.'
    : `Showing ${list.length} of ${trophies.length} trophies — ${earned.size} earned. Click a track to open its guide.`;
}

function renderMissables() {
  const body = $('missRows');
  body.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const tr = document.createElement('tr');
    if (earned.has(t.id)) tr.classList.add('earned-row');
    const boxCell = document.createElement('td');
    boxCell.className = 'c-box';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); renderAll();
    });
    box.addEventListener('click', (e) => e.stopPropagation());
    boxCell.append(box);
    const nameCell = document.createElement('td');
    const name = document.createElement('div');
    name.className = 't-name';
    name.textContent = isHidden(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
    nameCell.append(name);
    const gradeCell = document.createElement('td');
    gradeCell.innerHTML = `${gradeDot(t.grade)}<span class="grade-label">${t.grade}</span>`;
    const ruleCell = document.createElement('td');
    ruleCell.className = 'miss-rule';
    ruleCell.textContent = t.missableRule ?? '';
    tr.append(boxCell, nameCell, gradeCell, ruleCell);
    tr.addEventListener('click', () => selectTrophy(t.id));
    body.append(tr);
  }
  $('missCount').textContent = `(${trophies.filter((x) => x.missable).length})`;
}

function renderRoadmap() {
  const host = $('roadmapStages');
  host.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h3 = document.createElement('h3');
    const done = stage.ids.filter((id) => earned.has(id)).length;
    h3.textContent = `${stage.title} — ${done}/${stage.ids.length} earned`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const ul = document.createElement('ul');
    for (const id of stage.ids) {
      const t = byId.get(id);
      const li = document.createElement('li');
      const chip = document.createElement('span');
      chip.className = `chip ${earned.has(id) ? 'done' : 'todo'}`;
      chip.textContent = earned.has(id) ? 'EARNED' : t.grade.toUpperCase();
      const name = document.createElement('span');
      name.textContent = isHidden(t) ? ` Hidden story trophy (#${t.id})` : ` ${t.name}`;
      const desc = document.createElement('span');
      desc.textContent = isHidden(t) ? '' : ` — ${t.description}`;
      li.append(chip, name, desc);
      li.addEventListener('click', () => selectTrophy(id));
      li.style.cursor = 'pointer';
      ul.append(li);
    }
    div.append(h3, p, ul);
    host.append(div);
  }
}

function renderGuidePane() {
  const pane = $('guidePane');
  pane.replaceChildren();
  if (!selectedId || !byId.has(selectedId)) {
    const p = document.createElement('p');
    p.className = 'pane-empty';
    p.textContent = 'Click any track to open its guide here — official name, description, grade, your guide and its sources.';
    pane.append(p);
    return;
  }
  const t = byId.get(selectedId);
  const h3 = document.createElement('h3');
  h3.textContent = isHidden(t) ? 'Hidden story trophy' : t.name;
  const grade = document.createElement('p');
  grade.className = 'pane-grade';
  grade.innerHTML = `${gradeDot(t.grade)}${t.grade} · ${t.kind}${t.missable ? ' · <span class="flag-badge">!</span> missable' : ''}`;
  pane.append(h3, grade);
  if (isHidden(t)) {
    const note = document.createElement('p');
    note.className = 'pane-desc';
    note.textContent = 'Spoilers are off: this story trophy’s name, description and guide stay hidden until you earn it. Tick it off to reveal it.';
    pane.append(note);
  } else {
    const desc = document.createElement('p');
    desc.className = 'pane-desc';
    desc.textContent = `“${t.description}” — official description`;
    const guide = document.createElement('p');
    guide.className = 'pane-guide';
    guide.textContent = t.guide;
    pane.append(desc);
    if (t.count !== null && t.count !== undefined) {
      const count = document.createElement('p');
      count.className = 'pane-count';
      count.textContent = `PSN-tracked target: ${t.count.toLocaleString('en-US')}`;
      pane.append(count);
    }
    if (t.missable && t.missableRule) {
      const miss = document.createElement('p');
      miss.className = 'pane-miss';
      miss.textContent = `Missable — ${t.missableRule}`;
      pane.append(miss);
    }
    pane.append(guide);
    const sources = document.createElement('p');
    sources.className = 'pane-sources';
    sources.innerHTML = `<b>Sources:</b> `;
    sources.append(document.createTextNode(t.sources));
    pane.append(sources);
  }
  const check = document.createElement('p');
  check.className = 'pane-check';
  const label = document.createElement('label');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save(); renderAll();
  });
  label.append(box, document.createTextNode(earned.has(t.id) ? ' Earned — ticked off' : ' Mark as earned'));
  check.append(label);
  pane.append(check);
}

function renderView() {
  for (const btn of document.querySelectorAll('.view-btn')) {
    btn.classList.toggle('active', btn.dataset.view === view);
  }
  for (const section of document.querySelectorAll('main .view')) {
    section.classList.toggle('active', section.id === `view-${view}`);
  }
}

function renderAll() {
  renderDial();
  renderSkyline();
  renderRows();
  renderMissables();
  renderRoadmap();
  renderGuidePane();
  renderView();
}

function selectTrophy(id) {
  selectedId = id;
  view = 'checklist';
  renderAll();
  $('guidePane').scrollIntoView({ block: 'nearest' });
}

for (const btn of document.querySelectorAll('.view-btn')) {
  btn.addEventListener('click', () => { view = btn.dataset.view; renderAll(); });
}
$('kindFilter').addEventListener('change', renderAll);
$('gradeFilter').addEventListener('change', renderAll);
$('earnedFilter').addEventListener('change', renderAll);
$('search').addEventListener('input', renderAll);
$('spoiler').checked = spoiler;
$('spoiler').addEventListener('change', (e) => {
  spoiler = e.target.checked;
  saveSpoiler();
  renderAll();
});

$('exportBtn').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b), exported: new Date().toISOString() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'trophy-radio-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    const next = new Set(ids.filter((id) => byId.has(id)));
    if (next.size === 0 && ids.length > 0) throw new Error('no valid trophy ids');
    earned = next;
    save();
    renderAll();
  } catch {
    alert('That file is not a Trophy Radio progress export.');
  }
  e.target.value = '';
});

renderAll();
