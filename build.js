/*
 * Copyright 2025 Sumit Yadav
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import yaml from 'js-yaml';
import * as sass from 'sass';

class JekyllLikeBuilder {
  constructor() {
    this.config = this.loadConfig();
    this.data = this.loadData();
    this.layouts = {};
    this.includes = {};
    this.posts = [];
    this.pages = [];
  }

  // Load editable JSON content from /data
  loadData() {
    const read = (name, fallback) => {
      try { return JSON.parse(fs.readFileSync(path.join('data', name), 'utf-8')); }
      catch (e) { return fallback; }
    };
    return {
      profile: read('profile.json', {}),
      links: read('links.json', []),
      timeline: read('timeline.json', []),
      site: read('site.json', {}),
      publications: read('publications.json', []),
      experience: read('experience.json', []),
      projects: read('projects.json', []),
      honors: read('honors.json', []),
      documents: read('documents.json', { links: [], notes: [] })
    };
  }

  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  socialIcon(name) {
    const I = {
      github: '<svg viewBox="0 0 24 24"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0024 12.29C24 5.78 18.63.5 12 .5z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
      x: '<svg viewBox="0 0 24 24"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z"/></svg>',
      youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
      email: '<svg viewBox="0 0 24 24"><path d="M1.5 4.5h21A1.5 1.5 0 0124 6v12a1.5 1.5 0 01-1.5 1.5h-21A1.5 1.5 0 010 18V6a1.5 1.5 0 011.5-1.5zm.9 1.8L12 12.6l9.6-6.3H2.4zM22.2 8.04l-9.66 6.34a1.2 1.2 0 01-1.08 0L1.8 8.04V18h20.4z"/></svg>',
      scholar: '<svg viewBox="0 0 512 512"><path d="M256 411.12L0 202.67 256 0l256 202.67zM256 512c-70.69 0-128-57.31-128-128 0-23.39 6.28-45.32 17.24-64.2L256 384l110.76-64.2C377.72 338.68 384 360.61 384 384c0 70.69-57.31 128-128 128z"/></svg>',
      huggingface: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8.5 9a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm7 0a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM12 18c-2.3 0-4.3-1.4-5-3.5h10c-.7 2.1-2.7 3.5-5 3.5z"/></svg>'
    };
    return I[name] || '';
  }

  renderSocial() {
    return (this.data.links || []).map(l => {
      if (l.icon === 'cv') return `<a class="cv-pill" href="${this.esc(l.url)}">${this.esc(l.label)}</a>`;
      const svg = this.socialIcon(l.icon);
      return `<a href="${this.esc(l.url)}" title="${this.esc(l.label)}" aria-label="${this.esc(l.label)}">${svg || this.esc(l.label)}</a>`;
    }).join('\n');
  }

  renderTimeline() {
    const items = this.data.timeline || [];
    if (!items.length || (this.data.site.sections || {}).timeline === false) return '';
    const rail = items.map(t =>
      `<div class="tl-item"><div class="tl-year">${this.esc(t.year)}</div><div class="tl-label">${this.esc(t.label)}</div></div>`
    ).join('');
    return `<div class="timeline"><div class="timeline-rail">${rail}</div></div>`;
  }

  renderPublications() {
    const pubs = this.data.publications || [];
    if (!pubs.length) return '';
    const topics = [];
    pubs.forEach(p => (p.topics || []).forEach(t => { if (!topics.includes(t)) topics.push(t); }));
    const chips = ['All', ...topics].map((t, i) =>
      `<button class="chip${i === 0 ? ' active' : ''}" data-filter="${i === 0 ? '*' : this.esc(t)}">${this.esc(t)}</button>`
    ).join('');
    const labels = { paper: 'paper', arxiv: 'arXiv', doi: 'DOI', code: 'code', blog: 'blog', bibtex: 'BibTeX', model: 'model', demo: 'demo', data: 'data' };
    const cards = pubs.map(p => {
      const links = Object.entries(p.links || {}).map(([k, v]) =>
        `<a href="${this.esc(v)}">${this.esc(labels[k] || k)}</a>`).join('');
      const dt = (p.topics || []).map(t => this.esc(t)).join('|');
      return `<div class="pub-card" data-topics="${dt}">
        <p class="pub-title">${this.esc(p.title)}</p>
        ${p.authors ? `<p class="pub-authors">${this.esc(p.authors)}</p>` : ''}
        ${p.venue ? `<p class="pub-venue">${this.esc(p.venue)}</p>` : ''}
        ${p.note ? `<p class="pub-note">${this.esc(p.note)}</p>` : ''}
        ${links ? `<p class="pub-links">${links}</p>` : ''}
      </div>`;
    }).join('\n');
    return `<section class="section" id="publications">
      <h2>Publications</h2>
      <p class="section-sub">See my <a href="${this.esc((this.config.author || {}).google_scholar || '#')}">Google Scholar</a> for the full list.</p>
      <div class="chips" data-target="#pub-list"><span class="chips-label">Topic</span>${chips}</div>
      <div class="pub-list" id="pub-list">${cards}</div>
    </section>`;
  }

  blogRow(p) {
    const date = this.formatDate(p.date, '%Y-%m-%d');
    const cat = p.category || '';
    return `<div class="blog-row" data-cat="${this.esc(cat)}">
      <span class="blog-date">${date}</span>
      <a class="blog-title" href="${this.esc(p.url)}">${this.esc(p.title)}</a>
      ${cat ? `<span class="blog-cat">${this.esc(cat)}</span>` : ''}
    </div>`;
  }

  renderBlogPreview() {
    const n = this.data.site.blogPreviewCount || 8;
    const rows = this.posts.slice(0, n).map(p => this.blogRow(p)).join('');
    return `<section class="section" id="writing">
      <h2>Writing</h2>
      <p class="section-sub">Notes and essays on AI, math, and a few things in between.</p>
      <div class="blog-list">${rows}</div>
      <p class="blog-more"><a href="/blog/">All ${this.posts.length} posts →</a></p>
    </section>`;
  }

  renderExperience() {
    const xs = this.data.experience || [];
    if (!xs.length) return '';
    const li = xs.map(x => `<li>
      <span class="it-head">${this.esc(x.role)}</span>, ${x.url ? `<a href="${this.esc(x.url)}">${this.esc(x.org)}</a>` : this.esc(x.org)}
      <span class="it-meta">· ${this.esc(x.period)}</span>
      ${x.note ? `<div class="it-note">${this.esc(x.note)}</div>` : ''}
    </li>`).join('');
    return `<section class="section"><h2>Experience</h2><ul class="itemlist">${li}</ul></section>`;
  }

  renderProjects() {
    const xs = this.data.projects || [];
    if (!xs.length) return '';
    const li = xs.map(x => `<li>
      <span class="it-head"><a href="${this.esc(x.url)}">${this.esc(x.name)}</a></span> — ${this.esc(x.note)}${x.extra ? ` (${x.extra})` : ''}
    </li>`).join('');
    return `<section class="section"><h2>Projects</h2><ul class="itemlist">${li}</ul></section>`;
  }

  renderHonors() {
    const xs = this.data.honors || [];
    if (!xs.length) return '';
    const li = xs.map(x => `<li>
      <span class="it-head">${this.esc(x.title)}</span> <span class="it-meta">(${this.esc(x.year)})</span>
      ${x.note ? `<div class="it-note">${this.esc(x.note)}</div>` : ''}
    </li>`).join('');
    return `<section class="section"><h2>Honors &amp; Awards</h2><ul class="itemlist">${li}</ul></section>`;
  }

  renderDocuments() {
    const d = this.data.documents || {};
    const chip = (x) => `<a href="${this.esc(x.url)}">${this.esc(x.label)}${x.kind ? ` <span>· ${this.esc(x.kind)}</span>` : ''}</a>`;
    const links = (d.links || []).map(chip).join('');
    const notes = (d.notes || []).map(chip).join('');
    if (!links && !notes) return '';
    return `<section class="section"><h2>Documents &amp; Links</h2>
      ${links ? `<div class="files">${links}</div>` : ''}
      ${notes ? `<h3>Notes &amp; Lab Reports</h3><div class="files">${notes}</div>` : ''}
    </section>`;
  }

  filterScript() {
    return `<script>
    document.querySelectorAll('.chips').forEach(function(group){
      var sel = group.getAttribute('data-target');
      var list = sel ? document.querySelector(sel) : group.nextElementSibling;
      if(!list) return;
      group.querySelectorAll('.chip').forEach(function(chip){
        chip.addEventListener('click', function(){
          group.querySelectorAll('.chip').forEach(function(c){c.classList.remove('active');});
          chip.classList.add('active');
          var f = chip.getAttribute('data-filter');
          Array.prototype.forEach.call(list.children, function(item){
            var key = item.getAttribute('data-topics') || item.getAttribute('data-cat') || '';
            var show = (f==='*') || key.split('|').indexOf(f) !== -1 || key === f;
            item.style.display = show ? '' : 'none';
          });
        });
      });
    });
    </script>`;
  }

  generateHome() {
    const p = this.data.profile || {};
    const s = this.data.site.sections || {};
    let c = `<header class="intro">
      ${p.photo ? `<img class="intro-photo" src="${this.esc(p.photo)}" alt="${this.esc(p.name)}">` : ''}
      <div class="intro-body">
        <h1>${this.esc(p.name)}</h1>
        ${p.aka ? `<p class="aka">aka ${this.esc(p.aka)}</p>` : ''}
        ${p.role ? `<p class="role">${this.esc(p.role)}</p>` : ''}
        ${p.affiliation ? `<p class="affil">${this.esc(p.affiliation)}</p>` : ''}
        ${p.bioSummary ? `<p class="bio">${p.bioSummary}</p>` : ''}
        <div class="social">${this.renderSocial()}</div>
      </div>
    </header>`;
    c += this.renderTimeline();
    if (s.publications !== false) c += this.renderPublications();
    if (s.blog !== false) c += this.renderBlogPreview();
    if (s.experience !== false) c += this.renderExperience();
    if (s.projects !== false) c += this.renderProjects();
    if (s.honors !== false) c += this.renderHonors();
    if (s.documents !== false) c += this.renderDocuments();
    c += this.filterScript();
    const html = this.applyLayout(c, 'default', { title: p.role || p.name, url: '/', description: this.data.site.tagline || '' });
    fs.writeFileSync('docs/index.html', html);
    console.log('  ✅ Generated / (home)');
  }

  generateBlogIndex() {
    const cats = this.data.site.blogCategories || [];
    const chips = ['All', ...cats.map(c => c.name)].map((name, i) =>
      `<button class="chip${i === 0 ? ' active' : ''}" data-filter="${i === 0 ? '*' : this.esc(name)}">${this.esc(name)}</button>`
    ).join('');
    const rows = this.posts.map(p => this.blogRow(p)).join('');
    const c = `<section class="section" style="border-top:0">
      <h2>Blog</h2>
      <p class="section-sub">${this.posts.length} posts.</p>
      <div class="chips" data-target="#blog-all"><span class="chips-label">Category</span>${chips}</div>
      <div class="blog-list" id="blog-all">${rows}</div>
    </section>${this.filterScript()}`;
    const html = this.applyLayout(c, 'default', { title: 'Blog', url: '/blog/', description: 'Writing by Sumit Yadav' });
    fs.mkdirSync('docs/blog', { recursive: true });
    fs.writeFileSync('docs/blog/index.html', html);
    console.log('  ✅ Generated /blog/');
  }

  copyStaticAssets() {
    const items = ['files', 'photo', 'photography', 'drum', 'posts',
      'cv.pdf', 'resume.pdf', 'TPUs-2.pdf', 'rockerritesh.png', 'profile.jpg',
      'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png',
      'android-chrome-192x192.png', 'android-chrome-512x512.png', 'mstile-150x150.png',
      'site.webmanifest', 'browserconfig.xml'];
    const copyR = (src, dest) => {
      const st = fs.statSync(src);
      if (st.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(f => copyR(path.join(src, f), path.join(dest, f)));
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
    };
    items.forEach(it => {
      if (fs.existsSync(it)) {
        try { copyR(it, path.join('docs', it)); }
        catch (e) { console.error('  ❌ copy failed:', it, e.message); }
      }
    });
    // Disable GitHub's own Jekyll processing of the prebuilt /docs output
    fs.writeFileSync('docs/.nojekyll', '');
    console.log('  ✅ Copied static assets');
  }



  loadConfig() {
    try {
      const configPath = '_config.yml';
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = yaml.load(configContent);
        config.time = new Date().toISOString();
        return config;
      }
    } catch (error) {
      console.log('Could not load _config.yml, using defaults');
    }

    return {
      title: 'Tatva',
      description: 'A blog',
      baseurl: '',
      author: { name: 'Sumit Yadav' },
      time: new Date().toISOString()
    };
  }

  // Format a date using strftime-style format strings
  formatDate(date, format) {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const pad = (n) => n.toString().padStart(2, '0');

    return format
      .replace(/%B/g, months[dateObj.getMonth()])
      .replace(/%b/g, monthsShort[dateObj.getMonth()])
      .replace(/%Y/g, dateObj.getFullYear().toString())
      .replace(/%m/g, pad(dateObj.getMonth() + 1))
      .replace(/%d/g, pad(dateObj.getDate()))
      .replace(/%e/g, dateObj.getDate().toString())
      .replace(/%H/g, pad(dateObj.getHours()))
      .replace(/%M/g, pad(dateObj.getMinutes()))
      .replace(/%S/g, pad(dateObj.getSeconds()));
  }

  // Parse frontmatter from markdown content
  parseFrontmatter(content) {
    const lines = content.split('\n');
    let frontmatter = {};
    let contentStart = 0;
    
    if (lines[0] === '---') {
      const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
      if (frontmatterEnd > 0) {
        const frontmatterLines = lines.slice(1, frontmatterEnd);
        contentStart = frontmatterEnd + 1;
        
        try {
          frontmatter = yaml.load(frontmatterLines.join('\n')) || {};
        } catch (error) {
          console.log('Error parsing frontmatter:', error.message);
        }
      }
    }
    
    const markdownContent = lines.slice(contentStart).join('\n');
    return { frontmatter, content: markdownContent };
  }

  // Load layouts
  loadLayouts() {
    const layoutsDir = '_layouts';
    if (fs.existsSync(layoutsDir)) {
      const layoutFiles = fs.readdirSync(layoutsDir).filter(file => file.endsWith('.html'));
      for (const file of layoutFiles) {
        const layoutName = file.replace('.html', '');
        const layoutContent = fs.readFileSync(path.join(layoutsDir, file), 'utf-8');
        const { frontmatter, content } = this.parseFrontmatter(layoutContent);
        this.layouts[layoutName] = { frontmatter, content };
      }
    }
  }

  // Load includes
  loadIncludes() {
    const includesDir = '_includes';
    if (fs.existsSync(includesDir)) {
      const includeFiles = fs.readdirSync(includesDir).filter(file => file.endsWith('.html'));
      for (const file of includeFiles) {
        const includeName = file.replace('.html', '');
        const includeContent = fs.readFileSync(path.join(includesDir, file), 'utf-8');
        this.includes[includeName] = includeContent;
      }
    }
  }

  // Simple template processing (Jekyll Liquid-like)
  processTemplate(template, data) {
    // Ensure template is a string
    if (typeof template !== 'string') {
      console.log('⚠️  Template is not a string:', typeof template, template);
      return '';
    }
    
    let processed = template;

    // First, process includes: {% include header.html %}
    processed = processed.replace(/\{\%\s*include\s+(\w+\.html)\s*\%\}/g, (match, includeName) => {
      const includeKey = includeName.replace('.html', '');
      return this.includes[includeKey] || '';
    });
    
    // Process relative_url filter for literal strings: {{ '/assets/css/style.css' | relative_url }}
    processed = processed.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (match, url) => {
      return this.config.baseurl + url;
    });

    // Process special 'now' date: {{ 'now' | date: '%Y' }}
    processed = processed.replace(/\{\{\s*'now'\s*\|\s*date:\s*['"]([^'"]+)['"]\s*\}\}/g, (match, format) => {
      const now = new Date();
      if (format === '%Y') {
        return now.getFullYear().toString();
      }
      return now.toLocaleDateString();
    });
    // Then handle loops BEFORE processing variables inside them
    // Process loops with else: {% for post in site.posts %}...{% else %}...{% endfor %}
    processed = processed.replace(/\{\%\s*for\s+(\w+)\s+in\s+([^%]+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endfor\s*\%\}/gs, (match, itemVar, arrayVar, loopContent, elseContent) => {
      const parts = arrayVar.trim().split('.');
      let array = data;
      
      for (const part of parts) {
        if (array && array[part] !== undefined) {
          array = array[part];
        } else {
          return this.processTemplate(elseContent, data);
        }
      }
      
      if (!Array.isArray(array) || array.length === 0) {
        return this.processTemplate(elseContent, data);
      }
      
      return array.map(item => {
        const itemData = { ...data, [itemVar]: item };
        return this.processTemplate(loopContent, itemData);
      }).join('');
    });
    
    // Process simple loops: {% for post in site.posts %}
    processed = processed.replace(/\{\%\s*for\s+(\w+)\s+in\s+([^%]+)\s*\%\}(.*?)\{\%\s*endfor\s*\%\}/gs, (match, itemVar, arrayVar, loopContent) => {
      const parts = arrayVar.trim().split('.');
      let array = data;
      
      for (const part of parts) {
        if (array && array[part] !== undefined) {
          array = array[part];
        } else {
          return '';
        }
      }
      
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        const itemData = { ...data, [itemVar]: item };

        return this.processTemplate(loopContent, itemData);
      }).join('');
    });
    
    // Process conditionals with comparisons and else: {% if site.posts.size > 0 %}...{% else %}...{% endif %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*>\s*(\d+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, variable, number, ifContent, elseContent) => {
      const parts = variable.trim().replace('.size', '.length').split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = 0;
          break;
        }
      }
      
      return (value > parseInt(number)) ? this.processTemplate(ifContent, data) : this.processTemplate(elseContent, data);
    });
    
    // Process conditionals with comparisons: {% if site.posts.size > 0 %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*>\s*(\d+)\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, variable, number, content) => {
      const parts = variable.trim().replace('.size', '.length').split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = 0;
          break;
        }
      }
      
      return (value > parseInt(number)) ? this.processTemplate(content, data) : '';
    });
    
    // Process conditionals with else: {% if page.title %}...{% else %}...{% endif %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, condition, ifContent, elseContent) => {
      const parts = condition.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      return value ? this.processTemplate(ifContent, data) : this.processTemplate(elseContent, data);
    });
    
    // Process simple conditionals: {% if page.title %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, condition, content) => {
      const parts = condition.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      return value ? this.processTemplate(content, data) : '';
    });
    
    // Now process variables with complex filters
    // Process slugify with replace chain: {{ page.title | slugify | replace: '-', '' }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*slugify\s*\|\s*replace:\s*'([^']*)'\s*,\s*'([^']*)'\s*\}\}/g, (match, variable, find, replacement) => {
      const parts = variable.trim().split('.');
      let value = data;
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      if (!value) return '';
      const slugified = value.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return slugified.split(find).join(replacement);
    });

    // Process slugify filter: {{ page.title | slugify }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*slugify\s*\}\}/g, (match, variable) => {
      const parts = variable.trim().split('.');
      let value = data;
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      if (!value) return '';
      return value.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });

    // Process complex variables with filters: {{ page.description | default: site.description }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*default:\s*([^}]+?)\s*\}\}/g, (match, variable, defaultVar) => {
      const parts = variable.trim().split('.');
      let value = data;

      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }

      if (value) {
        return value;
      }

      // Check if default is a string literal (quoted)
      const stringMatch = defaultVar.trim().match(/^["'](.*)["']$/);
      if (stringMatch) {
        return stringMatch[1];
      }

      // Try to resolve as a data path
      const defaultParts = defaultVar.trim().split('.');
      let defaultValue = data;
      for (const part of defaultParts) {
        if (defaultValue && defaultValue[part] !== undefined) {
          defaultValue = defaultValue[part];
        } else {
          return '';
        }
      }

      return defaultValue || '';
    });
    
    // Process filters: {{ post.url | relative_url }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*relative_url\s*\}\}/g, (match, variable) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      return this.config.baseurl + value;
    });
    
    // Process escape filter: {{ post.title | escape }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*escape\s*\}\}/g, (match, variable) => {
      const parts = variable.trim().split('.');
      let value = data;

      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }

      return value ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
    });

    // Process escape and slice filter: {{ post.title | escape | slice: 0 }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*escape\s*\|\s*slice:\s*(\d+)\s*\}\}/g, (match, variable, index) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      const escapedValue = value ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
      return escapedValue.charAt(parseInt(index)) || '';
    });
    
    // Process strip_html and truncatewords: {{ post.excerpt | strip_html | truncatewords: 30 }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*strip_html\s*\|\s*truncatewords:\s*(\d+)\s*\}\}/g, (match, variable, wordCount) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      if (value) {
        const stripped = value.replace(/<[^>]*>/g, '');
        const words = stripped.split(/\s+/).slice(0, parseInt(wordCount));
        return words.join(' ') + (words.length >= parseInt(wordCount) ? '...' : '');
      }
      
      return '';
    });
    
    // Process date filters: {{ page.date | date_to_xmlschema }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*date_to_xmlschema\s*\}\}/g, (match, dateVar) => {
      const parts = dateVar.trim().split('.');
      let date = data;
      
      for (const part of parts) {
        if (date && date[part] !== undefined) {
          date = date[part];
        } else {
          return match;
        }
      }
      
      if (date) {
        const dateObj = new Date(date);
        return dateObj.toISOString();
      }
      
      return match;
    });
    
    // Process date filters: {{ page.date | date: "%B %d, %Y" }}
    processed = processed.replace(/\{\{\s*([^|}]+)\|\s*date:\s*"([^"]+)"\s*\}\}/g, (match, dateVar, format) => {
      const parts = dateVar.trim().split('.');
      let date = data;

      for (const part of parts) {
        if (date && date[part] !== undefined) {
          date = date[part];
        } else {
          return match;
        }
      }

      if (date) {
        return this.formatDate(date, format);
      }

      return match;
    });
    // Finally, process simple variables: {{ site.title }}, {{ page.title }}
    processed = processed.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, variable) => {
      // Skip if this looks like a complex template that wasn't processed
      if (variable.includes('|') || variable.includes('%')) {
        return match;
      }

      const parts = variable.trim().split('.');
      let value = data;

      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return ''; // Return empty instead of keeping the template
        }
      }

      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }

      return value !== undefined && value !== null ? String(value) : '';
    });
    
    return processed;
  }

  // Process Mermaid code blocks with placeholder system
  processMermaidBlocks(content) {
    const mermaidBlocks = [];
    let index = 0;
    
    // First pass: extract mermaid blocks and replace with placeholders
    const contentWithPlaceholders = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, mermaidCode) => {
      const cleanCode = mermaidCode.trim();
      mermaidBlocks[index] = cleanCode;
      const placeholder = `MERMAID_PLACEHOLDER_${index}`;
      index++;
      return placeholder;
    });
    
    // Store the blocks for later restoration
    this.mermaidBlocks = mermaidBlocks;
    return contentWithPlaceholders;
  }
  
  // Restore Mermaid blocks after markdown processing
  restoreMermaidBlocks(htmlContent) {
    if (!this.mermaidBlocks) return htmlContent;
    
    let restoredContent = htmlContent;
    this.mermaidBlocks.forEach((block, index) => {
      const placeholder = `MERMAID_PLACEHOLDER_${index}`;
      const mermaidDiv = `<div class="mermaid">${block}</div>`;
      restoredContent = restoredContent.replace(new RegExp(placeholder, 'g'), mermaidDiv);
    });
    
    return restoredContent;
  }

  // Protect LaTeX math ($$...$$ and $...$) from the markdown parser so
  // underscores/asterisks inside formulas aren't mangled; MathJax renders later.
  protectMath(content) {
    const blocks = [];
    let s = content;
    // display math $$...$$ (can span lines)
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m) => {
      blocks.push(m); return `@@MATHJAX${blocks.length - 1}@@`;
    });
    // inline math $...$ — no newline, non-space just inside the delimiters
    s = s.replace(/\$(?!\s)([^\n$]*?)(?<!\s)\$/g, (m) => {
      blocks.push(m); return `@@MATHJAX${blocks.length - 1}@@`;
    });
    this.mathBlocks = blocks;
    return s;
  }

  restoreMath(html) {
    if (!this.mathBlocks) return html;
    let out = html;
    this.mathBlocks.forEach((block, i) => {
      out = out.replace(new RegExp(`@@MATHJAX${i}@@`, 'g'), () => block);
    });
    return out;
  }

  // Apply layout to content
  applyLayout(content, layoutName, pageData) {
    if (!layoutName || !this.layouts[layoutName]) {
      return content;
    }
    
    const layout = this.layouts[layoutName];
    const data = {
      site: {
        ...this.config,
        posts: this.posts,
        pages: this.pages
      },
      page: pageData,
      content: content
    };
    
    let processed = this.processTemplate(layout.content, data);
    
    // If layout has a parent layout, apply it recursively
    if (layout.frontmatter.layout) {
      processed = this.applyLayout(processed, layout.frontmatter.layout, pageData);
    }
    
    return processed;
  }

  // Extract first image from markdown content
  extractFirstImage(content) {
    // First, look for HTML img tags: <img src="..." alt="...">
    const htmlImageRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i;
    const htmlMatch = content.match(htmlImageRegex);
    
    if (htmlMatch && htmlMatch[1]) {
      const imagePath = htmlMatch[1].trim();
      return imagePath;
    }
    
    // If no HTML img found, look for markdown image syntax: ![alt](image.jpg)
    const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/;
    const markdownMatch = content.match(markdownImageRegex);
    
    if (markdownMatch && markdownMatch[1]) {
      const imagePath = markdownMatch[1].trim();
      return imagePath;
    }
    
    return null;
  }

  // Process post thumbnails for home page
  processPostThumbnails(html) {
    let postIndex = 0;
    
    // Find each post-image div and populate with correct data
    return html.replace(/<div class="post-image">\s*<div class="post-image-overlay">\s*\w\s*<\/div>\s*<\/div>/g, (match) => {
      const post = this.posts[postIndex];
      postIndex++;
      
      if (!post) {
        return match; // Return original if no post found
      }
      
      // Generate the thumbnail HTML
      if (post.featuredImage) {
        // Handle relative image paths
        let imageUrl = post.featuredImage;
        if (!imageUrl.startsWith('http')) {
          imageUrl = post.url + imageUrl;
        }
        
        return `<div class="post-image" style="background-image: url('${imageUrl}');">
                    <div class="post-image-overlay">
                      ${post.title.charAt(0)}
                    </div>
                </div>`;
      } else {
        return `<div class="post-image default-bg" style="background: ${post.defaultImageBg};">
                    ${post.defaultImageIcon}
                </div>`;
      }
    });
  }

  // Generate default image identifier based on post title
  generateDefaultImage(title) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
    ];
    
    // Use title length to pick a consistent color for each post
    const colorIndex = title.length % colors.length;
    return {
      background: colors[colorIndex],
      icon: title.charAt(0).toUpperCase()
    };
  }

  // Process posts
  async loadPosts() {
    if (!fs.existsSync('_posts')) {
      console.log('No _posts directory found');
      return;
    }

    const files = fs.readdirSync('_posts').filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join('_posts', file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n(.*?)\n---\n(.*)/s);
      if (!frontmatterMatch) {
        console.log(`⚠️  No frontmatter in ${file}`);
        continue;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]) || {};
      const body = frontmatterMatch[2];

      // Generate URL from filename: 2024-01-21-life.md -> /posts/2024/01/21/life/
      const dateMatch = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
      if (!dateMatch) {
        console.log(`⚠️  Invalid post filename format: ${file}`);
        continue;
      }

      const [, year, month, day, slug] = dateMatch;
      const url = `/posts/${year}/${month}/${day}/${slug}/`;

      // Protect math, then Mermaid, before converting markdown to HTML
      const mathProtected = this.protectMath(body);
      const processedBody = this.processMermaidBlocks(mathProtected);
      const htmlContent = marked(processedBody);
      // Restore Mermaid and math after markdown processing
      const finalContent = this.restoreMath(this.restoreMermaidBlocks(htmlContent));

      // Extract first image from post content
      const firstImage = this.extractFirstImage(body);
      const defaultImage = this.generateDefaultImage(frontmatter.title || slug);
      
      // Ensure tags and categories are arrays
      const ensureArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return [value];
        return [];
      };

      const post = {
        ...frontmatter,
        content: finalContent,
        excerpt: frontmatter.excerpt || body.substring(0, 300) + '...',
        url,
        date: frontmatter.date || `${year}-${month}-${day}`,
        slug,
        file: filePath,
        featuredImage: firstImage,
        defaultImageBg: defaultImage.background,
        defaultImageIcon: defaultImage.icon,
        tags: ensureArray(frontmatter.tags),
        categories: ensureArray(frontmatter.categories),
        readingTime: this.calculateReadingTime(finalContent),
        wordCount: finalContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
      };

      this.posts.push(post);
    }

    // Sort posts by date (newest first)
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(`✅ Loaded ${this.posts.length} posts`);
  }

  // Process pages
  processPages() {
    this.pages = [];
    
    // Process markdown files in root (exclude README.md and files starting with _)
    const markdownFiles = fs.readdirSync('.')
      .filter(file => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md');
    
    for (const file of markdownFiles) {
      const rawContent = fs.readFileSync(file, 'utf-8');
      const { frontmatter, content } = this.parseFrontmatter(rawContent);
      
      const title = frontmatter.title || file.replace('.md', '');
      // Protect math, then Mermaid, before converting markdown to HTML
      const processedContent = this.processMermaidBlocks(this.protectMath(content));
      const htmlContent = marked(processedContent);
      // Restore Mermaid blocks and math after markdown processing
      const finalContent = this.restoreMath(this.restoreMermaidBlocks(htmlContent));
      const url = frontmatter.permalink || `/${file.replace('.md', '')}/`;
      
      const page = {
        title,
        content: finalContent,
        url,
        filename: file,
        frontmatter
      };
      
      this.pages.push(page);
    }
  }

  // Copy post assets (images, etc.)
  copyPostAssets() {
    if (!fs.existsSync('_posts')) return;
    
    // Get all non-markdown files from _posts directory
    const assetFiles = fs.readdirSync('_posts').filter(file => !file.endsWith('.md'));
    
    for (const assetFile of assetFiles) {
      const sourcePath = path.join('_posts', assetFile);
      
      // For each post that might reference this asset, copy it to the post directory
      for (const post of this.posts) {
        // Read the original markdown file to check for asset references
        const markdownContent = fs.readFileSync(post.file, 'utf-8');
        
        // Check if the post markdown content references this asset
        if (markdownContent.includes(assetFile)) {
          const postDir = path.join('docs', post.url.replace(/\/$/, ''));
          const destPath = path.join(postDir, assetFile);
          
          try {
            // Ensure directory exists
            fs.mkdirSync(postDir, { recursive: true });
            // Copy the asset file
            fs.copyFileSync(sourcePath, destPath);
            console.log(`  ✅ Copied ${assetFile} to ${post.url}`);
          } catch (error) {
            console.error(`❌ Error copying ${assetFile} to ${post.url}:`, error.message);
          }
        }
      }
    }
  }

  // Compile SCSS
  compileScss() {
    const scssPath = '_sass/main.scss';
    const outputPath = 'docs/assets/css/style.css';
    
    if (fs.existsSync(scssPath)) {
      try {
        const result = sass.compile(scssPath);
        
        // Ensure output directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, result.css);
        console.log('✅ Compiled SCSS to CSS');
      } catch (error) {
        console.error('❌ SCSS compilation error:', error.message);
      }
    }
  }

  // Copy CNAME file from root to docs
  copyCNAME() {
    const sourcePath = 'CNAME';
    const destPath = 'docs/CNAME';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied CNAME to docs directory');
      } catch (error) {
        console.error('❌ Error copying CNAME:', error.message);
      }
    } else {
      console.log('⚠️  CNAME file not found in root directory');
    }
  }

  // Generate sitemap.xml file dynamically
  generateSitemap() {
    const destPath = 'docs/sitemap.xml';
    
    // Get the site URL from config
    let siteUrl = this.config.url || 'https://your-domain.com';
    let baseUrl = this.config.baseurl || '';
    
    // If baseurl is a full URL, ignore it and just use the main url
    if (baseUrl.startsWith('http')) {
      baseUrl = '';
    }
    
    // Ensure siteUrl doesn't end with slash
    siteUrl = siteUrl.replace(/\/$/, '');
    if (baseUrl && !baseUrl.startsWith('/')) {
      baseUrl = '/' + baseUrl;
    }
    
    const fullBaseUrl = `${siteUrl}${baseUrl}`;
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add homepage
    sitemapContent += `
  <url>
    <loc>${fullBaseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add pages (excluding homepage which is already added)
    for (const page of this.pages) {
      if (page.url === '/') continue; // Skip homepage as it's already added
      
      const pageUrl = page.url.replace(/\/$/, '');
      const lastmod = page.frontmatter.date || new Date().toISOString().split('T')[0];
      
      sitemapContent += `
  <url>
    <loc>${fullBaseUrl}${pageUrl}/</loc>
    <lastmod>${lastmod}T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
    
    // Add posts
    for (const post of this.posts) {
      const postDate = new Date(post.date);
      const lastmod = postDate.toISOString();
      
      sitemapContent += `
  <url>
    <loc>${fullBaseUrl}${post.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    
    // Add study material pages
    if (fs.existsSync('study')) {
      const studyDirs = fs.readdirSync('study', { withFileTypes: true })
        .filter(d => d.isDirectory());
      for (const dir of studyDirs) {
        sitemapContent += `
  <url>
    <loc>${fullBaseUrl}/study/${dir.name}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    sitemapContent += `
</urlset>
`;

    try {
      fs.writeFileSync(destPath, sitemapContent);
      console.log(`✅ Generated sitemap.xml with ${this.posts.length} posts and ${this.pages.length} pages`);
    } catch (error) {
      console.error('❌ Error generating sitemap.xml:', error.message);
    }
  }

  // Copy favicon.ico file from root to docs
  copyFavicon() {
    const sourcePath = 'favicon.ico';
    const destPath = 'docs/favicon.ico';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied favicon.ico to docs directory');
      } catch (error) {
        console.error('❌ Error copying favicon.ico:', error.message);
      }
    } else {
      console.log('⚠️  favicon.ico file not found in root directory');
    }
  }

  // Copy googleb55b08cea6f7992e.html file from root to docs
  copyGoogleHtml() {
    const sourcePath = 'googleb55b08cea6f7992e.html';
    const destPath = 'docs/googleb55b08cea6f7992e.html';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied googleb55b08cea6f7992e.html to docs directory');
      } catch (error) {
        console.error('❌ Error copying googleb55b08cea6f7992e.html:', error.message);
      }
    } else { 
      console.log('⚠️  googleb55b08cea6f7992e.html file not found in root directory');
    }
  }

  // Copy study materials to docs
  copyStudyMaterials() {
    const srcDir = 'study';
    const destDir = 'docs/study';
    if (!fs.existsSync(srcDir)) return;

    const copyRecursive = (src, dest) => {
      fs.mkdirSync(dest, { recursive: true });
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    try {
      copyRecursive(srcDir, destDir);
      console.log('✅ Copied study materials to docs/study/');
    } catch (error) {
      console.error('❌ Error copying study materials:', error.message);
    }
  }

  // Generate robots.txt file
  generateRobotsTxt() {
    const destPath = 'docs/robots.txt';
    
    // Get the site URL from config, handling cases where baseurl might be redundant
    let siteUrl = this.config.url || 'https://your-domain.com';
    let baseUrl = this.config.baseurl || '';
    
    // If baseurl is a full URL, ignore it and just use the main url
    if (baseUrl.startsWith('http')) {
      baseUrl = '';
    }
    
    // Ensure siteUrl doesn't end with slash and baseUrl doesn't start with slash (unless empty)
    siteUrl = siteUrl.replace(/\/$/, '');
    if (baseUrl && !baseUrl.startsWith('/')) {
      baseUrl = '/' + baseUrl;
    }
    
    const fullSitemapUrl = `${siteUrl}${baseUrl}/sitemap.xml`;
    
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${fullSitemapUrl}
`;
    
    try {
      fs.writeFileSync(destPath, robotsContent);
      console.log('✅ Generated robots.txt');
    } catch (error) {
      console.error('❌ Error generating robots.txt:', error.message);
    }
  }

  // Generate a custom 404 page that invites visitors to browse the blog
  generate404() {
    const destPath = 'docs/404.html';
    const siteTitle = (this.config && this.config.title) || 'Tatva';
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found · ${siteTitle}</title>
<link rel="shortcut icon" href="/favicon.ico">
<style>
  :root{--bg:#fff;--fg:#1f2328;--muted:#6a6f76;--accent:#5b4b9e;--rule:#e8e6ec;--card:#faf9fb}
  @media (prefers-color-scheme:dark){:root{--bg:#14151a;--fg:#e6e7ea;--muted:#a3a8b2;--accent:#a48fff;--rule:#2a2d36;--card:#1b1d24}}
  body{margin:0;background:var(--bg);color:var(--fg);min-height:100vh;display:flex;
    align-items:center;justify-content:center;text-align:center;padding:24px;
    font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  .box{max-width:460px}
  h1{font-size:3.4rem;margin:0;letter-spacing:-.02em}
  .lead{font-size:1.05rem;margin:.4rem 0 .2rem}
  p{color:var(--muted)}
  a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
  .cta{display:inline-block;margin-top:1rem;border:1px solid var(--rule);background:var(--card);
    border-radius:8px;padding:.7rem 1.1rem;color:var(--fg)}
  .cta:hover{border-color:var(--accent);color:var(--accent);text-decoration:none}
  .small{margin-top:1.1rem;font-size:.9rem}
</style>
</head>
<body>
  <div class="box">
    <h1>404</h1>
    <p class="lead">This page wandered off.</p>
    <p>The link may be broken or the page moved. Let's get you back to something real.</p>
    <a class="cta" href="/">← Back home</a>
    <p class="small">
      <a href="/#publications">publications</a> ·
      <a href="/blog/">blog</a>
    </p>
  </div>
</body>
</html>
`;
    try {
      fs.writeFileSync(destPath, html);
      console.log('✅ Generated 404.html');
    } catch (error) {
      console.error('❌ Error generating 404.html:', error.message);
    }
  }

  // Generate llms.txt file
  generateLlmsTxt() {
    const destPath = 'docs/llms.txt';
    
    // Get site info from config
    const siteName = this.config.title || 'Personal Website';
    const description = this.config.description || 'A personal blog and website';
    const authorName = this.config.author?.name || 'Site Owner';
    const authorEmail = this.config.author?.email || '';
    
    const llmsContent = `# ${siteName}

This site is open to AI crawling and indexing.

## About
${description}

## Author
${authorName}

## Content Policy
This is a personal blog containing thoughts, ideas, and experiences. 
Content is available for AI training and reference with attribution.

## Contact
${authorEmail ? `Email: ${authorEmail}` : 'Contact information available on the about page.'}

## Technical
- Built with a custom Jekyll-like static site generator
- Posts available in structured format
- Sitemap available at /sitemap.xml

User-agent: *
Allow: /
`;
    
    try {
      fs.writeFileSync(destPath, llmsContent);
      console.log('✅ Generated llms.txt');
    } catch (error) {
      console.error('❌ Error generating llms.txt:', error.message);
    }
  }

  // Calculate reading time
  calculateReadingTime(content) {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  }

  // Generate search index
  generateSearchIndex() {
    const destPath = 'docs/search-index.json';

    const searchIndex = this.posts.map(post => ({
      id: post.url,
      title: post.title,
      excerpt: (post.excerpt || '').substring(0, 300).replace(/<[^>]*>/g, ''),
      content: (post.content || '').replace(/<[^>]*>/g, '').substring(0, 5000),
      date: post.date,
      tags: post.tags || [],
      categories: post.categories || []
    }));

    try {
      fs.writeFileSync(destPath, JSON.stringify(searchIndex, null, 2));
      console.log(`✅ Generated search index with ${searchIndex.length} posts`);
    } catch (error) {
      console.error('❌ Error generating search index:', error.message);
    }
  }

  // Find related posts based on tags, categories, and date
  findRelatedPosts(post, limit = 3) {
    const scoredPosts = this.posts
      .filter(p => p.url !== post.url)
      .map(p => {
        let score = 0;

        // Tag overlap (most important)
        const commonTags = (post.tags || []).filter(tag =>
          (p.tags || []).includes(tag)
        );
        score += commonTags.length * 10;

        // Category overlap
        const commonCategories = (post.categories || []).filter(cat =>
          (p.categories || []).includes(cat)
        );
        score += commonCategories.length * 5;

        // Date proximity (recent posts get slight boost)
        const daysDiff = Math.abs(
          (new Date(post.date) - new Date(p.date)) / (1000 * 60 * 60 * 24)
        );
        score += Math.max(0, 5 - daysDiff / 60); // Decay over 300 days

        return { post: p, score };
      })
      .filter(item => item.score > 0) // Only include if some relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);

    return scoredPosts;
  }

  // Generate tag and category pages
  generateTagPages() {
    const tagMap = new Map();
    const categoryMap = new Map();

    // Collect all tags and categories
    this.posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push(post);
      });

      (post.categories || []).forEach(category => {
        if (!categoryMap.has(category)) categoryMap.set(category, []);
        categoryMap.get(category).push(post);
      });
    });

    // Generate tag pages
    tagMap.forEach((posts, tag) => {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const outputPath = path.join('docs', 'tags', tagSlug, 'index.html');

      const content = this.renderTagPage(tag, posts);
      const pageData = {
        title: `Posts tagged "${tag}"`,
        url: `/tags/${tagSlug}/`,
        tag: tag,
        posts: posts
      };

      const html = this.applyLayout(content, 'default', pageData);

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
    });

    // Generate category pages
    categoryMap.forEach((posts, category) => {
      const catSlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const outputPath = path.join('docs', 'categories', catSlug, 'index.html');

      const content = this.renderCategoryPage(category, posts);
      const pageData = {
        title: `${category} Posts`,
        url: `/categories/${catSlug}/`,
        category: category,
        posts: posts
      };

      const html = this.applyLayout(content, 'default', pageData);

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
    });

    if (tagMap.size > 0 || categoryMap.size > 0) {
      console.log(`✅ Generated ${tagMap.size} tag pages and ${categoryMap.size} category pages`);
    }
  }

  renderTagPage(tag, posts) {
    let html = `<div class="taxonomy-page">
      <header class="taxonomy-header">
        <h1 class="taxonomy-title">Posts tagged "${tag}"</h1>
        <p class="taxonomy-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</p>
      </header>
      <div class="post-list-simple">`;

    posts.forEach(post => {
      const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      html += `
        <article class="post-list-item">
          <h2 class="post-list-title"><a href="${post.url}">${post.title}</a></h2>
          <div class="post-list-meta">
            <time datetime="${post.date}">${date}</time>
            ${post.readingTime ? `<span class="separator">•</span><span>${post.readingTime} min read</span>` : ''}
          </div>
          ${post.excerpt ? `<p class="post-list-excerpt">${post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200)}</p>` : ''}
        </article>`;
    });

    html += `</div></div>`;
    return html;
  }

  renderCategoryPage(category, posts) {
    let html = `<div class="taxonomy-page">
      <header class="taxonomy-header">
        <h1 class="taxonomy-title">${category}</h1>
        <p class="taxonomy-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</p>
      </header>
      <div class="post-list-simple">`;

    posts.forEach(post => {
      const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      html += `
        <article class="post-list-item">
          <h2 class="post-list-title"><a href="${post.url}">${post.title}</a></h2>
          <div class="post-list-meta">
            <time datetime="${post.date}">${date}</time>
            ${post.readingTime ? `<span class="separator">•</span><span>${post.readingTime} min read</span>` : ''}
          </div>
          ${post.excerpt ? `<p class="post-list-excerpt">${post.excerpt.replace(/<[^>]*>/g, '').substring(0, 200)}</p>` : ''}
        </article>`;
    });

    html += `</div></div>`;
    return html;
  }

  // Copy JavaScript assets
  copyJavaScriptAssets() {
    const jsAssets = [
      { src: 'assets/js/search.js', dest: 'docs/assets/js/search.js' },
      { src: 'assets/js/toc.js', dest: 'docs/assets/js/toc.js' }
    ];

    let copiedCount = 0;

    for (const { src, dest } of jsAssets) {
      if (fs.existsSync(src)) {
        try {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(src, dest);
          copiedCount++;
        } catch (error) {
          console.error(`❌ Error copying ${src}:`, error.message);
        }
      }
    }

    if (copiedCount > 0) {
      console.log(`✅ Copied ${copiedCount} JavaScript asset(s)`);
    }
  }

  // Build the site
  async build() {
    console.log('🔨 Building Jekyll-like site...');
    
    // Create docs directory
    if (fs.existsSync('docs')) {
      fs.rmSync('docs', { recursive: true });
    }
    fs.mkdirSync('docs', { recursive: true });
    
    // Load templates
    this.loadLayouts();
    this.loadIncludes();
    
    // Process content
    await this.loadPosts();
    this.processPages();
    
    // Copy post assets
    this.copyPostAssets();
    
    // Compile SCSS
    this.compileScss();

    // Copy JavaScript assets
    this.copyJavaScriptAssets();

    // Generate search index
    this.generateSearchIndex();

    // Generate tag and category pages
    this.generateTagPages();

    // Copy CNAME file
    this.copyCNAME();
    
    // Generate sitemap.xml file
    this.generateSitemap();
    
    // Copy favicon.ico file
    this.copyFavicon();

    // Copy googleb55b08cea6f7992e.html file
    this.copyGoogleHtml();
    
    // Generate robots.txt and llms.txt files
    this.generateRobotsTxt();
    this.generateLlmsTxt();

    // Generate custom 404 page
    this.generate404();

    // Copy study materials
    this.copyStudyMaterials();

    // Copy portfolio static assets (PDFs, photo, drum, files, favicons, posts/syllabus)
    this.copyStaticAssets();

    // Generate individual post pages
    for (const post of this.posts) {
      const layoutName = post.layout || 'post';
      const layout = this.layouts[layoutName];

      if (!layout) {
        console.log(`⚠️  Layout '${layoutName}' not found for post: ${post.title}`);
        continue;
      }

      // Add related posts to page data
      const relatedPosts = this.findRelatedPosts(post);
      const pageData = {
        ...post,
        relatedPosts
      };

      const html = this.applyLayout(post.content, layoutName, pageData);
      
      // Create directory structure for the post
      const postDir = path.join('docs', post.url.replace(/\/$/, ''));
      fs.mkdirSync(postDir, { recursive: true });
      
      // Write the post HTML
      fs.writeFileSync(path.join(postDir, 'index.html'), html);
      console.log(`  ✅ Generated ${post.url}`);
    }
    
    // Generate pages
    for (const page of this.pages) {
      const pageData = {
        ...page.frontmatter,
        title: page.title,
        url: page.url
      };
      
      const layoutName = page.frontmatter.layout || 'default';
      const layout = this.layouts[layoutName];
      
      if (!layout) {
        console.log(`⚠️  Layout '${layoutName}' not found for page: ${page.title}`);
        continue;
      }

      const layoutPageData = {
        ...page.frontmatter,
        title: page.title,
        url: page.url,
        layout: layoutName
      };
      
      let html = this.applyLayout(page.content, layoutName, layoutPageData);
      
      // Special handling for home page to process post thumbnails
      if (page.url === '/' && layoutName === 'home') {
        html = this.processPostThumbnails(html);
      }
      
      let outputPath;
      if (page.url === '/') {
        outputPath = 'docs/index.html';
      } else {
        outputPath = path.join('docs', page.url.slice(1), 'index.html');
      }
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
      
      console.log(`  ✅ Generated ${page.url}`);
    }
    
    // Generate JSON-driven homepage and blog index
    this.generateHome();
    this.generateBlogIndex();

    console.log(`✅ Site built successfully! Generated ${this.posts.length} posts and ${this.pages.length} pages.`);
  }
}

// Build the site
const builder = new JekyllLikeBuilder();
builder.build();