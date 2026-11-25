// Meridian profile art for github.com/OmarRez2
// Rebuild: node scripts/generate-meridian-profile.mjs [contrib.json]
// Every asset is a self-contained SVG (no external fonts, scripts or requests) in a dark and a light variant.
// Animations are CSS/SMIL only, slow and purposeful, and stop under prefers-reduced-motion.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const OUT = new URL('../assets/meridian/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const IMG = (n) => readFileSync(new URL(`../assets/${n}`, import.meta.url)).toString('base64');

const THEMES = {
  dark: { bg: '#050b18', bg2: '#0b1730', ink: '#eef2f8', muted: '#93a1ba', faint: '#1c2b47', brass: '#d4ae66', glacier: '#8fd6ea', star: '#cfe6f5', card: '#0a1326' },
  light: { bg: '#f7f4ec', bg2: '#ebe4d3', ink: '#111a2c', muted: '#556079', faint: '#d8cfbb', brass: '#94692a', glacier: '#1f7591', star: '#3d5a75', card: '#fffdf8' },
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const STILL = '@media (prefers-reduced-motion: reduce){*{animation:none!important}}';

function svg(w, h, title, body, css = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><style>.serif{font-family:${SERIF}}.sans{font-family:${SANS}}${css}${STILL}</style>${body}</svg>`;
}
const save = (name, t, data) => writeFileSync(new URL(`${name}-${t}.svg`, OUT), data);

// deterministic pseudo-random so rebuilds are stable
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

for (const [t, c] of Object.entries(THEMES)) {
  seed = 7;
  const grad = `<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.bg}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>`;

  // 1 ─ Hero: name plate beside a slowly turning celestial instrument
  {
    const W = 1200, H = 420, cx = 905, cy = 215;
    const stars = Array.from({ length: 70 }, () => {
      const x = rnd() * W, y = rnd() * H, r = rnd() * 1.3 + 0.3, d = (rnd() * 6).toFixed(1);
      return `<circle class="tw" style="animation-delay:-${d}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" fill="${c.star}" opacity=".55"/>`;
    }).join('');
    const ticks = Array.from({ length: 72 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2, r1 = 168, r2 = i % 6 === 0 ? 180 : 174;
      return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * r2).toFixed(1)}" y2="${(Math.sin(a) * r2).toFixed(1)}"/>`;
    }).join('');
    // constellation: a small supply-chain graph drawn as stars
    const pts = [[-96, -60], [-40, -98], [24, -70], [70, -18], [36, 40], [-30, 62], [-88, 20]];
    const cons = `<polyline points="${pts.map((p) => p.join(',')).join(' ')} ${pts[0].join(',')}" fill="none" stroke="${c.glacier}" stroke-opacity=".45" stroke-width="1"/>` +
      pts.map(([x, y], i) => `<circle class="tw" style="animation-delay:-${i * 0.7}s" cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3.2 : 2.2}" fill="${i % 3 === 0 ? c.brass : c.glacier}"/>`).join('');
    const orbit = (rx, ry, dur, col, rev) => `<ellipse rx="${rx}" ry="${ry}" fill="none" stroke="${c.faint}"/><circle r="3.4" fill="${col}"><animateMotion dur="${dur}s" repeatCount="indefinite" ${rev ? 'keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''} path="M${rx},0 A${rx},${ry} 0 1,1 ${-rx},0 A${rx},${ry} 0 1,1 ${rx},0"/></circle>`;
    const body = `<defs>${grad}<radialGradient id="glow"><stop offset="0" stop-color="${c.glacier}" stop-opacity=".18"/><stop offset="1" stop-color="${c.glacier}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>${stars}
<circle cx="${cx}" cy="${cy}" r="210" fill="url(#glow)"/>
<g transform="translate(${cx} ${cy})">
  <g class="spin" stroke="${c.brass}" stroke-opacity=".7" stroke-width="1.1">${ticks}</g>
  <circle r="182" fill="none" stroke="${c.brass}" stroke-opacity=".55"/>
  <circle r="140" fill="none" stroke="${c.faint}"/>
  <g class="spin-r"><line x1="-182" x2="182" stroke="${c.faint}"/><line y1="-182" y2="182" stroke="${c.faint}"/></g>
  ${orbit(150, 58, 18, c.brass)}${orbit(118, 118, 26, c.glacier, true)}
  ${cons}
  <line class="sweep" x1="0" y1="0" x2="0" y2="-182" stroke="${c.brass}" stroke-width="1.6" stroke-linecap="round"/>
  <circle r="4" fill="${c.brass}"/>
</g>
<text x="64" y="92" class="sans" font-size="15" letter-spacing="4" fill="${c.brass}">DATA ANALYST · BI DEVELOPER · CAIRO</text>
<text x="60" y="196" class="serif" font-size="92" fill="${c.ink}">Omar <tspan font-style="italic" fill="${c.brass}">Rezk</tspan></text>
<text x="64" y="250" class="sans" font-size="23" fill="${c.ink}">I turn raw operational data into models,</text>
<text x="64" y="282" class="sans" font-size="23" fill="${c.ink}">dashboards and decision tools people can trust.</text>
<text x="64" y="340" class="sans" font-size="16" fill="${c.muted}">Power BI · SQL Server · Python · TypeScript</text>
<rect x="64" y="358" width="0" height="2" fill="${c.glacier}"><animate attributeName="width" from="0" to="330" dur="2.4s" fill="freeze"/></rect>`;
    save('hero', t, svg(W, H, 'Omar Rezk: Data Analyst and BI Developer. I turn raw operational data into models, dashboards and decision tools people can trust.', body,
      `.spin{animation:spin 120s linear infinite}.spin-r{animation:spin 90s linear infinite reverse}.sweep{animation:spin 14s linear infinite}.tw{animation:tw 6s ease-in-out infinite}@keyframes spin{to{transform:rotate(360deg)}}@keyframes tw{50%{opacity:.12}}`));
  }

  // 2 ─ Pipeline: how I work, from source to decision
  {
    const W = 1200, H = 270;
    const st = [['Sources', 'CSV · OLTP · Excel'], ['Clean & stage', 'SQL · Python'], ['Model', 'Star schema · DAX'], ['Validate', 'Benchmarks · tests'], ['Decide', 'Power BI · web apps']];
    const xs = st.map((_, i) => 110 + i * 245);
    const path = `M${xs[0]},120 ` + xs.slice(1).map((x, i) => `C${xs[i] + 120},${i % 2 ? 70 : 170} ${x - 120},${i % 2 ? 170 : 70} ${x},120`).join(' ');
    const packets = [0, 1.6, 3.2, 4.8].map((b, i) => `<circle r="${i % 2 ? 3 : 4}" fill="${i % 2 ? c.glacier : c.brass}"><animateMotion dur="6.4s" begin="-${b}s" repeatCount="indefinite" path="${path}"/></circle>`).join('');
    const nodes = st.map(([a, b], i) => `<g transform="translate(${xs[i]} 120)"><circle r="30" fill="${c.card}" stroke="${i === 3 ? c.glacier : c.brass}" stroke-width="1.4"/><circle class="pulse" style="animation-delay:-${i * 0.8}s" r="30" fill="none" stroke="${i === 3 ? c.glacier : c.brass}"/><text y="7" text-anchor="middle" class="serif" font-size="21" fill="${c.ink}">${String(i + 1).padStart(2, '0')}</text><text y="70" text-anchor="middle" class="sans" font-size="18" font-weight="600" fill="${c.ink}">${esc(a)}</text><text y="94" text-anchor="middle" class="sans" font-size="14" fill="${c.muted}">${esc(b)}</text></g>`).join('');
    const body = `<defs>${grad}</defs><rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>
<text x="40" y="44" class="sans" font-size="14" letter-spacing="4" fill="${c.brass}">HOW I WORK</text>
<text x="1160" y="44" text-anchor="end" class="sans" font-size="14" fill="${c.muted}">Every number traceable from source to decision</text>
<path d="${path}" fill="none" stroke="${c.faint}" stroke-width="2"/><path class="flow" d="${path}" fill="none" stroke="${c.glacier}" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 14"/>${packets}${nodes}`;
    save('pipeline', t, svg(W, H, 'How I work: sources, clean and stage, model, validate, decide. Every number traceable from source to decision.', body,
      `.flow{animation:flow 3s linear infinite}.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 3.2s ease-out infinite}@keyframes flow{to{stroke-dashoffset:-40}}@keyframes pulse{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.5);opacity:0}}`));
  }

  // 3 ─ Flagship: Meridian
  {
    const W = 1200, H = 560;
    const shot = (n, x, y, w, h, id) => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></clipPath><rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" rx="11" fill="none" stroke="${c.brass}" stroke-opacity=".55"/><image href="data:image/webp;base64,${IMG(`meridian/${n}.webp`)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
    const facts = [
      ['41 months', 'of company records, reconciled to SQL benchmarks'],
      ['Analytics Lab', 'statements labelled finding, calculation, hypothesis'],
      ['Decision Simulator', 'exact profit bridge, break-even, sensitivity, A/B'],
      ['EN / AR', 'RTL, light and dark, keyboard and axe-checked'],
    ];
    const body = `<defs>${grad}</defs><rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>
${shot('meridian-home', 40, 70, 560, 315, 's1')}
<g class="float">${shot('meridian-sim', 330, 300, 380, 214, 's2')}</g>
<text x="40" y="46" class="sans" font-size="14" letter-spacing="4" fill="${c.brass}">FLAGSHIP · DEPI GRADUATION PROJECT · TEAM LEAD</text>
<text x="760" y="128" class="serif" font-size="58" fill="${c.ink}">Meridian</text>
<text x="762" y="162" class="sans" font-size="17" fill="${c.muted}">WWI Supply Chain Intelligence</text>
${facts.map(([a, b], i) => `<g transform="translate(762 ${212 + i * 62})"><circle cx="5" cy="-6" r="4" fill="${i % 2 ? c.glacier : c.brass}"/><text x="22" class="sans" font-size="19" font-weight="600" fill="${c.ink}">${a}</text><text x="22" y="24" class="sans" font-size="15" fill="${c.muted}">${esc(b)}</text></g>`).join('')}
<text x="762" y="490" class="sans" font-size="15" fill="${c.glacier}">TypeScript · Three.js · D3 · Python · SQL · Power BI</text>
<rect class="beam" x="760" y="508" width="120" height="2" fill="${c.brass}"/>`;
    save('meridian', t, svg(W, H, 'Meridian, WWI Supply Chain Intelligence: a bilingual analytics experience with an Analytics Lab and a Decision Simulator, built on 41 months of reconciled records.', body,
      `.float{animation:float 7s ease-in-out infinite}.beam{animation:beam 6s ease-in-out infinite alternate}@keyframes float{50%{transform:translateY(-6px)}}@keyframes beam{to{transform:translateX(280px)}}`));
  }

  // 4 ─ Case study cards (real dashboard screenshots)
  for (const [id, title, label, stack, scale] of [
    ['finsight', 'FinSight', 'FINANCE · CUSTOMERS · DATA QUALITY', 'Power BI (PBIP) · Python · SQLite', 'Three-page report + audited notebook'],
    ['sales', 'Sales Intelligence Hub', 'SALES · PROFITABILITY', 'Power BI · SQL Server · Python', 'Four-page executive BI experience'],
    ['uber', 'Uber Trips Analytics', 'MOBILITY · OPERATIONS', 'Power BI · SQL Server · DAX', '103,728 trip records · five pages'],
    ['bank-loan', 'Bank Loan Portfolio', 'LENDING · LOAN QUALITY', 'Power BI · SQL Server · T-SQL', '38,576 loan records · three pages'],
  ]) {
    const W = 720, H = 470;
    const body = `<defs><clipPath id="sc"><rect x="22" y="62" width="676" height="290" rx="10"/></clipPath></defs><rect x="1" y="1" width="718" height="468" rx="20" fill="${c.card}" stroke="${c.faint}"/>
<text x="26" y="40" class="sans" font-size="14" letter-spacing="3" fill="${c.brass}">${label}</text><circle class="tw" cx="690" cy="35" r="4" fill="${c.glacier}"/>
<rect x="22" y="62" width="676" height="290" rx="10" fill="${c.bg}"/><image href="data:image/webp;base64,${IMG(`projects/${id}.webp`)}" x="22" y="62" width="676" height="290" preserveAspectRatio="xMidYMid meet" clip-path="url(#sc)"/>
<text x="26" y="398" class="serif" font-size="32" fill="${c.ink}">${esc(title)}</text>
<text x="26" y="428" class="sans" font-size="16" fill="${c.muted}">${esc(stack)}</text>
<text x="26" y="452" class="sans" font-size="14" fill="${c.glacier}">${esc(scale)}</text>`;
    save(`case-${id}`, t, svg(W, H, `${title}: ${scale}. ${stack}.`, body, `.tw{animation:tw 4s ease-in-out infinite}@keyframes tw{50%{opacity:.2}}`));
  }

  // 5 ─ Evidence-based skills: level + where it is demonstrated
  {
    const rows = [
      ['Power BI · DAX · Power Query', 3, 'Five BI case studies (PBIX and PBIP); 13-table semantic model in the team project'],
      ['SQL Server · T-SQL', 3, 'KPI and analysis queries in five projects; data models; source reconciliation'],
      ['Excel', 3, 'Cleaning, validation and reporting workbooks in three projects'],
      ['Python · pandas', 2, 'Analysis notebooks; audited cleaning pipeline; dataset build script'],
      ['Data modelling & quality', 2, 'Star schemas; benchmark reconciliation; validation rules'],
      ['TypeScript · web data apps', 1, 'Meridian and portfolio site, built with AI pair-programming'],
      ['Testing & delivery', 1, 'Data tests, Playwright, axe-core and GitHub Actions in Meridian'],
      ['dbt · cloud warehouse · orchestration', 0, 'Next on the roadmap: not yet demonstrated'],
    ];
    const W = 1200, H = 96 + rows.length * 50;
    const lvl = ['Learning next', 'Working', 'Proficient', 'Strong'];
    const body = `<defs>${grad}</defs><rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>
<text x="40" y="46" class="sans" font-size="14" letter-spacing="4" fill="${c.brass}">SKILLS, WITH THE EVIDENCE</text>
<text x="1160" y="46" text-anchor="end" class="sans" font-size="14" fill="${c.muted}">Level is what my repositories show, not a self-rating</text>
${rows.map(([n, l, e], i) => {
      const y = 92 + i * 50;
      const segs = [0, 1, 2].map((k) => `<rect class="${k < l ? 'seg' : ''}" style="animation-delay:-${(i * 0.6 + k * 0.2).toFixed(1)}s" x="${372 + k * 34}" y="${y - 12}" width="28" height="8" rx="2" fill="${k < l ? (l === 3 ? c.brass : c.glacier) : 'none'}" stroke="${k < l ? 'none' : c.muted}" stroke-opacity=".6" stroke-dasharray="${k < l ? '' : '3 2'}"/>`).join('');
      return `<g><text x="40" y="${y}" class="sans" font-size="18" font-weight="600" fill="${c.ink}">${esc(n)}</text>${segs}<text x="482" y="${y - 3}" class="sans" font-size="13" fill="${l ? c.muted : c.brass}">${lvl[l]}</text><text x="600" y="${y}" class="sans" font-size="15" fill="${c.muted}">${esc(e)}</text><line x1="40" x2="1160" y1="${y + 18}" y2="${y + 18}" stroke="${c.faint}"/></g>`;
    }).join('')}`;
    save('skills', t, svg(W, H, 'Skills with evidence. Strong: Power BI, DAX and Power Query; SQL Server and T-SQL; Excel. Proficient: Python and pandas; data modelling and quality. Working: TypeScript web data apps; testing and delivery. Learning next: dbt, cloud warehouse, orchestration.', body,
      `.seg{animation:glint 5s ease-in-out infinite}@keyframes glint{50%{opacity:.55}}`));
  }

  // 6 ─ Contribution skyline (snapshot of the real calendar)
  {
    const src = process.argv[2];
    if (src && existsSync(src)) {
      const cal = JSON.parse(readFileSync(src, 'utf8')).data.viewer.contributionsCollection.contributionCalendar;
      const weeks = cal.weeks.map((w) => w.contributionDays.reduce((a, d) => a + d.contributionCount, 0));
      const end = cal.weeks.at(-1).contributionDays.at(-1).date;
      const W = 1200, H = 300, max = Math.max(...weeks, 1);
      const bw = 14, ox = 60, oy = 262;
      const iso = weeks.map((v, i) => {
        const h = v ? 12 + (v / max) * 100 : 2, x = ox + i * 20, y = oy - i * 0.9;
        const top = v ? (v / max > 0.5 ? c.brass : c.glacier) : c.faint;
        return `<g class="${v ? 'bar' : ''}" style="animation-delay:${(i * 0.025).toFixed(3)}s"><path d="M${x},${y} l${bw},-5 v${-h} l${-bw},5 z" fill="${top}" opacity="${v ? 0.55 : 0.6}"/><path d="M${x},${y} l-8,-4 v${-h} l8,4 z" fill="${top}" opacity="${v ? 0.35 : 0.4}"/><path class="cap" d="M${x},${y - h} l${bw},-5 l-8,-4 l${-bw},5 z" fill="${top}"/></g>`;
      }).join('');
      const body = `<defs>${grad}</defs><rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>
<text x="40" y="46" class="sans" font-size="14" letter-spacing="4" fill="${c.brass}">CONTRIBUTIONS · LAST 12 MONTHS</text>
<text x="1160" y="46" text-anchor="end" class="sans" font-size="14" fill="${c.muted}">${cal.totalContributions} public contributions · snapshot ${end}</text>${iso}
<text x="60" y="284" class="sans" font-size="13" fill="${c.muted}">one column per week</text>`;
      save('activity', t, svg(W, H, `Contribution skyline: ${cal.totalContributions} public contributions in the 12 months to ${end}, one column per week.`, body,
        `.bar .cap{animation:glow 4s ease-in-out infinite}@keyframes glow{50%{opacity:.6}}`));
    }
  }

  // 7 ─ Divider and footer
  save('divider', t, svg(1200, 26, 'Divider', `<line x1="0" x2="1200" y1="13" y2="13" stroke="${c.faint}"/><circle cx="600" cy="13" r="4" fill="${c.brass}"/><rect class="beam" x="0" y="12" width="160" height="2" fill="${c.glacier}" opacity=".7"/>`,
    `.beam{animation:beam 9s ease-in-out infinite alternate}@keyframes beam{to{transform:translateX(1040px)}}`));
  save('footer', t, svg(1200, 150, 'Good questions deserve clear answers.', `<defs>${grad}</defs><rect width="1200" height="150" rx="22" fill="url(#sky)"/><text x="600" y="72" text-anchor="middle" class="serif" font-size="34" fill="${c.ink}">Good questions deserve <tspan font-style="italic" fill="${c.brass}">clear answers.</tspan></text><text x="600" y="108" text-anchor="middle" class="sans" font-size="16" fill="${c.muted}">Open to Data Analyst and BI Developer conversations.</text>`));
}
console.log('Meridian profile assets written to assets/meridian/');
