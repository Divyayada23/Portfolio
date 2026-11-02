/* Navigation between the scenes. Plain JavaScript, no libraries.

   Routes (the part after # in the address):
     (nothing)       the forest
     #fun            the fun house: night party
     #jobs           the job board: pick a company
     #jobs/allmax    a company's cave (one per entry in js/jobs-data.js)

   Opening a scene is a chunky pixel "iris" that grows out of whatever you clicked.
   Closing is the same iris shrinking back. */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  var stage = $('.stage');
  var forest = $('#forest');
  var layers = { fun: $('#fun'), game: $('#game'), jobs: $('#jobs'), company: $('#company') };
  var JOBS = window.JOBS || [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var STEPS = 10;                 // the iris grows in 10 chunky steps, like an old game
  var FULL = '125%';              // big enough to cover the whole stage from any corner
  var ORIGIN = {                  // where the iris starts (% of the stage), unless a click says otherwise
    fun: '15.2% 82.6%',           // the purple house's front door
    jobs: '34.3% 76.3%',          // the red house's front door
    company: '50% 60%',
    game: '50% 45%'
  };

  var stack = [];                 // layers currently open, bottom to top
  var origins = {};               // where each open layer's iris started
  var triggers = {};              // what opened each layer (to give focus back on close)
  var busy = false;
  var pending = null;
  var currentSlug = null;

  /* ---------- the signpost: one arrow per company ---------- */
  var signpost = $('#signpost');
  var arrowFor = {};
  JOBS.forEach(function (job, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'arrow ' + (i % 2 === 0 ? 'to-right' : 'to-left');
    b.style.setProperty('--i', i);
    b.dataset.company = job.slug;
    var label = document.createElement('span');
    label.textContent = job.name;
    b.appendChild(label);
    signpost.appendChild(b);
    arrowFor[job.slug] = b;
  });

  /* ---------- the company boards ---------- */
  function placeholder() {
    var s = document.createElement('p');
    s.className = 'placeholder';
    s.textContent = 'Coming soon…';
    return s;
  }
  function fillText(id, text) {
    var box = $(id);
    box.textContent = '';
    if (text) { var p = document.createElement('p'); p.textContent = text; box.appendChild(p); }
    else box.appendChild(placeholder());
  }
  function fillList(id, items) {
    var box = $(id);
    box.textContent = '';
    if (!items || !items.length) { box.appendChild(placeholder()); return; }
    var ul = document.createElement('ul');
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    box.appendChild(ul);
  }
  function fillChips(id, items) {
    var box = $(id);
    box.textContent = '';
    if (!items || !items.length) { box.appendChild(placeholder()); return; }
    var wrap = document.createElement('div');
    wrap.className = 'chips';
    items.forEach(function (t) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = t; wrap.appendChild(c); });
    box.appendChild(wrap);
  }
  function addText(parent, text) {
    if (Array.isArray(text)) {
      var ul = document.createElement('ul');
      text.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
      parent.appendChild(ul);
    } else {
      var p = document.createElement('p'); p.textContent = text; parent.appendChild(p);
    }
  }
  /* ---------- demo videos: a preview the visitor can play right here ----------
     p.video      a YouTube link: shows its thumbnail, and a click swaps in the player (no tracking cookies)
     p.videoFile  { src, poster, portrait } a video file in assets/: native player with a poster picture
     A YouTube link wins if both are set. */
  function ytParse(url) {
    var m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/))([\w-]{11})/);
    if (!m) return null;
    var t = String(url).match(/[?&#]t=(\d+)/);
    return { id: m[1], start: t ? +t[1] : 0 };
  }
  function stopMedia(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('video'), function (v) { try { v.pause(); } catch (e) {} });
    Array.prototype.forEach.call(root.querySelectorAll('.video-embed'), function (box) {
      if (box._thumb && box.querySelector('iframe')) { box.textContent = ''; box.appendChild(box._thumb); }
    });
  }
  function addVideo(body, p) {
    var yt = p.video ? ytParse(p.video) : null;
    if (yt) {
      var box = document.createElement('div'); box.className = 'video-embed';
      var play = document.createElement('button'); play.type = 'button'; play.className = 'video-thumb';
      play.setAttribute('aria-label', 'Play the demo video: ' + p.name);
      var im = document.createElement('img');
      im.src = 'https://i.ytimg.com/vi/' + yt.id + '/hqdefault.jpg'; im.alt = ''; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer';
      var badge = document.createElement('span'); badge.className = 'play-badge'; badge.setAttribute('aria-hidden', 'true'); badge.textContent = '▶';
      play.appendChild(im); play.appendChild(badge);
      play.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + yt.id + '?autoplay=1&rel=0' + (yt.start ? '&start=' + yt.start : '');
        f.title = 'Demo video: ' + p.name;
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        box.textContent = ''; box.appendChild(f);
      });
      box._thumb = play; box.appendChild(play); body.appendChild(box);
      var yl = document.createElement('a');
      yl.className = 'video-link video-link-small'; yl.href = p.video; yl.target = '_blank'; yl.rel = 'noopener noreferrer';
      yl.textContent = 'Open on YouTube ↗';
      body.appendChild(yl);
    } else if (p.video) {
      var v = document.createElement('a');
      v.className = 'video-link'; v.href = p.video; v.target = '_blank'; v.rel = 'noopener noreferrer';
      v.textContent = '▶ Watch the demo on YouTube ↗';
      body.appendChild(v);
    } else if (p.videoFile && p.videoFile.src) {
      var vb = document.createElement('div'); vb.className = 'video-embed video-file' + (p.videoFile.portrait ? ' portrait' : '');
      var vid = document.createElement('video');
      vid.controls = true; vid.preload = 'metadata'; vid.playsInline = true;
      if (p.videoFile.poster) vid.poster = p.videoFile.poster;
      vid.src = p.videoFile.src; vid.setAttribute('aria-label', 'Demo video: ' + p.name);
      vb.appendChild(vid); body.appendChild(vb);
    }
  }
  function projectBody(p, id) {
      var body = document.createElement('div');
      body.className = 'project-body' + (p.videoFile && p.videoFile.portrait && !p.video ? ' has-portrait' : ''); if (id) body.id = id;
      if (p.explainer) { var ex = document.createElement('p'); ex.className = 'explainer'; ex.textContent = p.explainer; body.appendChild(ex); }
      addVideo(body, p);
      (p.sections || []).forEach(function (sec) {
        var h = document.createElement('h4'); h.textContent = sec.label; body.appendChild(h);
        addText(body, sec.text);
      });
      if (!(p.sections || []).length) { var ph = placeholder(); body.appendChild(ph); }
      if (p.tools && p.tools.length) {
        var bt = document.createElement('div'); bt.className = 'built-with';
        var bl = document.createElement('h4'); bl.textContent = 'Built with'; bt.appendChild(bl);
        var cw = document.createElement('div'); cw.className = 'chips';
        p.tools.forEach(function (t) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = t; cw.appendChild(c); });
        bt.appendChild(cw); body.appendChild(bt);
      }
      if (p.game) {
        var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'video-link play-link';
        pb.textContent = '\u25B6 ' + (p.playLabel || 'Play'); pb.addEventListener('click', function () { navigate('#fun/' + p.game, null, pb, 'game'); });
        body.appendChild(pb);
      }
      if (p.screenshots && p.screenshots.length) {
        var shots = document.createElement('div'); shots.className = 'shots' + (p.screenshots.length === 1 ? ' shots-one' : '');
        p.screenshots.forEach(function (sc) {
          var t = document.createElement('button');
          t.type = 'button'; t.className = 'shot';
          t.setAttribute('aria-label', 'Enlarge screenshot: ' + (sc.alt || p.name));
          var im = document.createElement('img'); im.src = sc.src; im.alt = sc.alt || ''; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer';
          t.appendChild(im);
          t.addEventListener('click', function () { openLightbox(sc, t); });
          shots.appendChild(t);
        });
        body.appendChild(shots);
      }
    return body;
  }

  /* one line per project; click to drop down its write-up (one open at a time) */
  function fillProjects(items, box, prefix) {
    box.textContent = '';
    if (!items || !items.length) return;
    var heads = [];
    fillProjects.heads = heads;
    items.forEach(function (p, i) {
      var id = prefix + i;
      var item = document.createElement('div');
      item.className = 'project';
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'project-head';
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
      var name = document.createElement('span'); name.className = 'project-name'; name.textContent = p.name;
      btn.appendChild(name);
      if (p.status) { var st = document.createElement('em'); st.className = 'status'; st.textContent = p.status; btn.appendChild(st); }
      var body = projectBody(p, id);
      body.hidden = true;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        heads.forEach(function (h) { h.btn.setAttribute('aria-expanded', 'false'); h.body.hidden = true; stopMedia(h.body); });
        if (!open) { btn.setAttribute('aria-expanded', 'true'); body.hidden = false; }
      });
      heads.push({ btn: btn, body: body });
      item.appendChild(btn); item.appendChild(body); box.appendChild(item);
    });
  }

  /* photos under the highlights (a tile with a caption; "coming soon" until the image exists) */
  function fillPhotos(items, hasProjects) {
    var box = $('#co-photos'), title = $('#co-photos-title');
    /* the Highlights board has no spare room, so photos go under the projects on the right when that board shows */
    var onBoard = !!(items && items.length && hasProjects);
    if (onBoard) { title.hidden = false; title.parentNode.insertBefore(box, title.nextSibling); }
    else { title.hidden = true; $('.board-highlights').appendChild(box); }
    box.classList.toggle('photos-board', onBoard);
    box.textContent = '';
    (items || []).forEach(function (ph) {
      var fig = document.createElement('figure');
      if (ph.src) {
        var t = document.createElement('button'); t.type = 'button'; t.className = 'shot';
        t.setAttribute('aria-label', 'Enlarge photo: ' + (ph.alt || ph.caption || ''));
        var im = document.createElement('img'); im.src = ph.src; im.alt = ph.alt || ''; im.loading = 'lazy';
        t.appendChild(im); t.addEventListener('click', function () { openLightbox(ph, t); });
        fig.appendChild(t);
      } else {
        var e = document.createElement('span'); e.className = 'shot shot-empty'; e.textContent = 'Photo coming soon';
        fig.appendChild(e);
      }
      if (ph.caption) { var c = document.createElement('figcaption'); c.textContent = ph.caption; fig.appendChild(c); }
      box.appendChild(fig);
    });
  }

  /* ---------- screenshot lightbox ---------- */
  var lightbox = $('#lightbox'), lightboxFrom = null;
  function openLightbox(sc, from) {
    var im = $('img', lightbox); im.referrerPolicy = 'no-referrer'; im.src = sc.src; im.alt = sc.alt || '';
    lightboxFrom = from; lightbox.hidden = false; $('.lightbox-x', lightbox).focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    if (lightboxFrom) lightboxFrom.focus({ preventScroll: true });
  }
  lightbox.addEventListener('click', closeLightbox);

  /* ---------- the disco balls: one small wooden coconut ball per fun project ---------- */
  var BALL = window.FUN_BALL || { lights: [], size: [104, 105], width: 210, pos: [] }, FUNS = window.FUN_PROJECTS || [];
  var funCard = $('#fun-card'), discoWrap = $('#disco-wrap'), funFrom = null, plights = [];
  (function buildDisco() {
    var cols = ['255,90,120', '255,200,60', '90,200,255'];
    FUNS.forEach(function (p, i) {
      var pos = BALL.pos[i] || [600 + i * 300, 350];
      var b = document.createElement('button'); b.type = 'button'; b.className = 'dball dlabel';
      b.style.left = 'calc(var(--u) * ' + pos[0] + ')'; b.style.top = 'calc(var(--u) * ' + pos[1] + ')';
      b.style.setProperty('--bob', (i * -0.7).toFixed(1) + 's');
      var nm = p.name.replace(/^\S+\s/, '');
      if (p.game) b.dataset.game = p.game;
      b.setAttribute('aria-label', nm + (p.direct ? ' (play the game)' : ' (open project)'));
      if (p.note) b.title = p.note;
      if (!p.direct) b.setAttribute('aria-expanded', 'false');
      var tag = document.createElement('span'); tag.className = 'tag'; tag.setAttribute('aria-hidden', 'true'); tag.textContent = p.name; b.appendChild(tag);
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (p.direct) { closeFunCard(); navigate('#fun/' + p.game, null, b, 'game'); }
        else showFunCard(i, b);
      });
      discoWrap.appendChild(b); plights.push(b);
    });
  })();
  function showFunCard(i, from) {
    var p = FUNS[i];
    if (!funCard.hidden && funCard.dataset.i === String(i)) { closeFunCard(); return; }
    funCard.dataset.i = i; funFrom = from;
    var t = $('#fun-card-title'); t.textContent = p.name;
    if (p.status) { var st = document.createElement('em'); st.className = 'status'; st.textContent = p.status; t.appendChild(st); }
    stopMedia(funCard);
    var cb = $('.card-body', funCard); cb.textContent = ''; cb.appendChild(projectBody(p, ''));
    funCard.hidden = false;
    plights.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-expanded', k === i ? 'true' : 'false'); });
    funCard.scrollTop = 0;
  }
  function closeFunCard() {
    if (funCard.hidden) return;
    stopMedia(funCard);
    funCard.hidden = true;
    plights.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-expanded', 'false'); });
    if (funFrom && funFrom.focus) funFrom.focus({ preventScroll: true });
  }
  $('.card-x', funCard).addEventListener('click', closeFunCard);


  /* ---------- forest bubbles: About me, Contact, Artwork credit ---------- */
  var SITE = window.SITE || {};
  function link(url, text) {
    var a = document.createElement('a');
    a.href = url; a.textContent = text; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function fillBubble(id, build) {
    var box = $('#' + id + ' .bubble-body'); box.textContent = ''; build(box);
  }
  fillBubble('contact-bubble', function (box) {
    var c = SITE.contact || {};
    var head = document.createElement('p'); head.className = 'bubble-title'; head.textContent = 'Message in a bottle'; box.appendChild(head);
    var f = document.createElement('form'); f.className = 'contact-form'; f.noValidate = true;
    f.innerHTML =
      '<label>Your email or phone<input name="contact" type="text" autocomplete="email" required maxlength="120"></label>' +
      '<label>Message<textarea name="message" rows="3" required maxlength="2000"></textarea></label>' +
      '<input class="hp" name="botcheck" type="checkbox" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button type="submit">Send</button><p class="form-status" role="status"></p>';
    box.appendChild(f);
    var status = $('.form-status', f), sendBtn = $('button', f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var contact = f.contact.value.trim(), message = f.message.value.trim();
      if (!contact || !message) { status.textContent = 'Please fill in both boxes.'; return; }
      if (f.botcheck.checked) return;
      function fail() {
        status.textContent = c.email ? 'Could not send. Please email me instead.' : 'Could not send just now. Please try again later.';
        sendBtn.disabled = false;
      }
      var gf = c.googleForm || {};
      if (gf.url && gf.contactField && gf.messageField) {   /* Google Form: the answers land in the form's responses */
        sendBtn.disabled = true; status.textContent = 'Sending\u2026';
        var body = new URLSearchParams(); body.append(gf.contactField, contact); body.append(gf.messageField, message);
        fetch(gf.url, { method: 'POST', mode: 'no-cors', body: body })
          .then(function () { f.reset(); status.textContent = 'Sent! Thank you, I will get back to you soon.'; sendBtn.disabled = false; })
          .catch(fail);
        return;
      }
      if (!c.endpoint || (/web3forms/.test(c.endpoint) && !c.accessKey)) {
        if (c.email) {   /* not connected yet: fall back to the visitor's own email app */
          location.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Hello from your portfolio') +
            '&body=' + encodeURIComponent(message + '\n\nReach me at: ' + contact);
        } else status.textContent = 'Sending is not connected yet.';
        return;
      }
      sendBtn.disabled = true; status.textContent = 'Sending\u2026';
      var payload = { subject: 'Message from your portfolio', contact: contact, message: message };
      if (/@/.test(contact)) payload.email = contact;
      if (c.accessKey) payload.access_key = c.accessKey;
      fetch(c.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.success !== false; }); })
        .then(function (ok) {
          if (!ok) { fail(); return; }
          f.reset(); status.textContent = 'Sent! Thank you, I will get back to you soon.'; sendBtn.disabled = false;
        })
        .catch(fail);
    });
    [['email', 'Email'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube']].forEach(function (k) {
      if (!c[k[0]]) return;
      var p = document.createElement('p'); p.className = 'contact-link';
      p.appendChild(link(k[0] === 'email' ? 'mailto:' + c.email : c[k[0]], k[1] + (k[0] === 'email' ? ': ' + c.email : ' \u2197')));
      box.appendChild(p);
    });
  });
  fillBubble('credit-bubble', function (box) {
    var lines = [].concat(SITE.credit || []);
    if (!lines.length) { var ph = document.createElement('p'); ph.className = 'placeholder'; ph.textContent = 'Artwork credit coming soon\u2026'; box.appendChild(ph); return; }
    lines.forEach(function (t) { var p = document.createElement('p'); p.textContent = t; box.appendChild(p); });
    if (SITE.creditLink) { var p2 = document.createElement('p'); p2.appendChild(link(SITE.creditLink, 'See more \u2197')); box.appendChild(p2); }
  });

  var bubbles = [
    { btn: $('.piece.cocori'), el: $('#cocori-bubble') },
    { btn: $('#about-btn'), el: $('#about-bubble') },
    { btn: $('#contact-btn'), el: $('#contact-bubble') },
    { btn: $('#credit-btn'), el: $('#credit-bubble') }
  ];
  function closeBubbles(except) {
    bubbles.forEach(function (b) {
      if (b === except) return;
      b.el.hidden = true; b.btn.setAttribute('aria-expanded', 'false');
    });
  }
  function anyBubble() { return bubbles.some(function (b) { return !b.el.hidden; }); }
  bubbles.forEach(function (b) {
    b.btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var show = b.el.hidden;
      closeBubbles(show ? b : null);
      b.el.hidden = !show; b.btn.setAttribute('aria-expanded', show ? 'true' : 'false');
    });
    $('.bubble-x', b.el).addEventListener('click', function () { closeBubbles(); b.btn.focus(); });
  });
  document.addEventListener('click', function (e) {
    if (!anyBubble()) return;
    if (!bubbles.some(function (b) { return b.el.contains(e.target); })) closeBubbles();
  });

  var pendingProject = null;
  /* ---------- Cocori, the chat helper ---------- */
  (function cocori() {
    var C = window.COCORI || { faq: [], chips: [] }, box = $('#cocori-bubble');
    var log = $('.chat-log', box), chips = $('.chat-chips', box), form = $('.chat-form', box), input = $('input', form);
    function say(text, who) {
      var m = document.createElement('div'); m.className = 'chat-msg ' + who;
      var t = document.createElement('p'); t.textContent = text; m.appendChild(t);
      if (who === 'bot') { var s = document.createElement('span'); s.className = 'chat-sign'; s.textContent = '\u2014 ' + (C.name || 'Cocori'); m.appendChild(s); }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
    }
    function norm(q) { return ' ' + q.toLowerCase().replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
    function companyAnswer(n) {
      var best = null;
      (window.JOBS || []).forEach(function (c) { if (n.indexOf(' ' + c.name.toLowerCase() + ' ') > -1 || n.indexOf(' ' + c.slug + ' ') > -1) best = c; });
      if (!best) return null;
      var role = [].concat(best.role || [])[0] || '';
      return best.name + ': ' + (best.about || '') + (role ? ' Her role: ' + role : '') + ' Open \u201CMy work\u201D for the full story.';
    }
    var STOP = ' the a an and or of to for in on at is are was be do does did has have had with about what which who how can you your her she his its tell me show any all by from that this ';
    var index = [];
    (window.JOBS || []).forEach(function (c) {
      (c.projects || []).forEach(function (p, i) {
        var txt = [p.name, c.name, c.industry, (c.tools || []).join(' '), (p.tools || []).join(' '), p.explainer || '']
          .concat((p.sections || []).map(function (s) { return [].concat(s.text).join(' '); })).join(' ').toLowerCase();
        index.push({ title: p.name, where: c.name, slug: c.slug, idx: i, text: txt });
      });
    });
    (window.FUN_PROJECTS || []).forEach(function (p, i) {
      var txt = [p.name, (p.tools || []).join(' ')].concat((p.sections || []).map(function (s) { return [].concat(s.text).join(' '); })).join(' ').toLowerCase();
      index.push({ title: p.name, where: 'Fun projects', fun: i, game: p.game, direct: p.direct, text: txt });
    });
    function search(n) {
      var words = n.trim().split(' ').filter(function (w) { return w.length > 2 && STOP.indexOf(' ' + w + ' ') < 0; });
      if (!words.length) return [];
      return index.map(function (it) {
        var s = 0; words.forEach(function (w) { if (it.text.indexOf(w) > -1) s += (it.title.toLowerCase().indexOf(w) > -1 ? 3 : 1); });
        return { it: it, s: s };
      }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 5).map(function (r) { return r.it; });
    }
    function openResult(it) {
      closeBubbles();
      var from = $('.piece.cocori');
      if (it.fun !== undefined) {
        if (it.direct) { navigate('#fun/' + it.game, null, from, 'game'); return; }
        navigate('#fun', null, from, 'fun'); setTimeout(function () { showFunCard(it.fun, null); }, 1200);
      } else { pendingProject = it.idx; navigate('#jobs/' + it.slug, null, from, 'company'); }
    }
    function results(list) {
      var box = document.createElement('div'); box.className = 'chat-results';
      list.forEach(function (it) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = it.title;
        var sm = document.createElement('small'); sm.textContent = it.where; b.appendChild(sm);
        b.addEventListener('click', function () { openResult(it); }); box.appendChild(b);
      });
      var last = log.lastElementChild; last.appendChild(box); log.scrollTop = log.scrollHeight;
    }
    function answer(q) {
      var n = norm(q), best = null, score = 0;
      var co = companyAnswer(n); if (co) return co;
      (C.faq || []).forEach(function (f) {
        var s = 0; f.k.forEach(function (w) { var k = ' ' + w.toLowerCase() + ' '; if (n.indexOf(w.length > 4 ? w.toLowerCase() : k) > -1) s += w.length > 4 ? 2 : 1; });
        if (s > score) { score = s; best = f; }
      });
      return best ? best.a : null;
    }
    function ask(q) {
      q = q.trim(); if (!q) return; say(q, 'me');
      setTimeout(function () {
        var a = answer(q), found = search(norm(q));
        if (a) say(a, 'bot');
        else if (found.length) say('Here are the projects that mention that. Tap one to open it.', 'bot');
        else say(C.fallback, 'bot');
        if (found.length) { if (a) { var l = document.createElement('p'); l.className = 'chat-label'; l.textContent = 'Related projects:'; log.lastElementChild.insertBefore(l, log.lastElementChild.querySelector('.chat-sign')); } results(found); }
      }, 350);
    }
    say(C.greeting || 'Hi!', 'bot');
    (C.chips || []).forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
      b.addEventListener('click', function () { ask(q); }); chips.appendChild(b);
    });
    (C.topics || []).forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = '\uD83D\uDD0E ' + q;
      b.addEventListener('click', function () { ask(q); }); chips.appendChild(b);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); input.value = ''; });
  })();

  function renderCompany(slug) {
    var job = JOBS.filter(function (j) { return j.slug === slug; })[0];
    if (!job) return;
    currentSlug = slug;
    $('#co-name').textContent = job.name;
    $('#co-industry').textContent = job.industry || 'Industry coming soon';
    var ab = $('#co-about'); ab.textContent = job.about || 'Company description coming soon\u2026';
    ab.classList.toggle('is-empty', !job.about);
    var lk = $('#co-link'); lk.textContent = '';
    if (job.link && job.link.url) {
      var a = document.createElement('a'); a.href = job.link.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = (job.link.label || 'Visit website') + ' \u2197'; lk.appendChild(a);
    }
    var has = !(job.managed === null || job.managed === undefined || job.managed === '');
    $('.managed').hidden = !has;
    $('#co-managed').textContent = has ? job.managed : '';
    var roleBox = $('#co-role'); roleBox.textContent = '';
    if (job.role && job.role.length) addText(roleBox, job.role); else roleBox.appendChild(placeholder());
    fillChips('#co-tools', job.tools);
    fillList('#co-achieve', job.achievements);
    fillPhotos(job.photos, !!(job.projects && job.projects.length));
    $('.board-projects').hidden = !(job.projects && job.projects.length);
    fillProjects(job.projects, $('#co-projects'), 'proj-');
    if (pendingProject !== null) { var hh = fillProjects.heads[pendingProject]; pendingProject = null; if (hh) hh.btn.click(); }
  }

  /* ---------- the iris ---------- */
  function circle(r, origin) { return 'circle(' + r + ' at ' + origin + ')'; }

  function iris(el, origin, opening, instant) {
    var ms = (instant || reduceMotion.matches) ? 0 : (opening ? 950 : 750);
    var frames = opening
      ? [{ clipPath: circle('0%', origin) }, { clipPath: circle(FULL, origin) }]
      : [{ clipPath: circle(FULL, origin) }, { clipPath: circle('0%', origin) }];
    var anim = el.animate(frames, { duration: ms, easing: 'steps(' + STEPS + ', end)', fill: 'forwards' });
    return anim.finished.then(function () { anim.cancel(); });
  }

  /* everything under the top layer is switched off so Tab and screen readers stay on top */
  function updateInert() {
    var top = stack[stack.length - 1];
    forest.inert = stack.length > 0;
    if (stack.length) closeBubbles();
    Object.keys(layers).forEach(function (k) { layers[k].inert = stack.length > 0 && k !== top; });
  }

  function defaultTrigger(name) {
    if (name === 'fun') return $('.house-fun');
    if (name === 'jobs') return $('.house-projects');
    if (name === 'company') return arrowFor[currentSlug] || null;
    if (name === 'game') return $('.dball[data-game="swish"]') || null;
    return null;
  }

  function openLayer(name, slug, instant, origin) {
    var el = layers[name];
    origins[name] = origin || ORIGIN[name];
    if (name === 'company') renderCompany(slug);
    if (name === 'game') { var gf = $('#game-frame'); if (!gf.getAttribute('src')) gf.src = gf.dataset.src; }
    el.hidden = false;
    stack.push(name);
    updateInert();
    return iris(el, origins[name], true, instant).then(function () {
      if (name === 'fun') el.classList.add('is-dancing');
      var back = $('.back-btn', el);
      if (back) back.focus({ preventScroll: true });
    });
  }

  function closeTop() {
    var name = stack[stack.length - 1];
    var el = layers[name];
    if (name === 'fun') closeFunCard();
    el.classList.remove('is-dancing');
    return iris(el, origins[name], false, false).then(function () {
      el.hidden = true;
      stack.pop();
      updateInert();
      var t = triggers[name] || defaultTrigger(name);
      if (t && t.focus) t.focus({ preventScroll: true });
    });
  }

  /* ---------- routes ---------- */
  function parse(hash) {
    var h = String(hash || '').replace(/^#/, '');
    if (h === 'fun') return { stack: ['fun'] };
    if (h === 'jobs') return { stack: ['jobs'] };
    if (h === 'fun/swish') return { stack: ['fun', 'game'] };
    var m = h.match(/^jobs\/([a-z0-9-]+)$/);
    if (m && arrowFor[m[1]]) return { stack: ['jobs', 'company'], slug: m[1] };
    return { stack: [] };
  }

  function isPrefix(a, b) {
    return a.every(function (n, i) { return n === b[i]; });
  }

  function apply(target, opts) {
    opts = opts || {};
    if (busy) { pending = [target, opts]; return Promise.resolve(); }
    busy = true;
    var chain = Promise.resolve();

    /* close whatever is open but not wanted, top first, one at a time */
    chain = chain.then(function closeUnwanted() {
      if (!isPrefix(stack, target.stack) || stack.length > target.stack.length) {
        return closeTop().then(closeUnwanted);
      }
    });

    /* open what is missing */
    chain = chain.then(function () {
      var seq = Promise.resolve();
      for (var i = stack.length; i < target.stack.length; i++) {
        (function (name, isLast) {
          seq = seq.then(function () {
            return openLayer(name, target.slug, opts.instant || !isLast, isLast ? opts.origin : null);
          });
        })(target.stack[i], i === target.stack.length - 1);
      }
      return seq;
    });

    /* same company layer but a different company: just swap the text */
    chain = chain.then(function () {
      if (target.slug && target.slug !== currentSlug && stack.indexOf('company') > -1) renderCompany(target.slug);
    });

    return chain.then(function () {
      busy = false;
      if (pending) { var p = pending; pending = null; apply(p[0], p[1]); }
    });
  }

  /* go somewhere new: add a history entry, then show it */
  function navigate(hash, origin, trigger, layerName) {
    if (busy) return;
    stopMedia(document);
    var target = parse(hash);
    if (layerName && trigger) triggers[layerName] = trigger;
    history.pushState({ nav: true }, '', hash);
    apply(target, { origin: origin });
  }

  /* go back one level */
  function goBack() {
    if (busy || !stack.length) return;
    if (history.state && history.state.nav) { history.back(); return; }   // popstate does the closing
    /* opened from a direct link: there is no earlier entry of ours, so step up by hand */
    var parent = stack.length > 1 ? (stack[0] === 'fun' ? '#fun' : '#jobs') : location.pathname + location.search;
    history.replaceState(null, '', parent);
    apply(parse(location.hash));
  }

  function centreOf(el) {
    var s = stage.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return (((r.left + r.width / 2 - s.left) / s.width) * 100).toFixed(1) + '% ' +
           (((r.top + r.height / 2 - s.top) / s.height) * 100).toFixed(1) + '%';
  }

  /* ---------- wiring ---------- */
  $('.house-fun').addEventListener('click', function (e) {
    e.preventDefault();
    navigate('#fun', null, e.currentTarget, 'fun');
  });
  $('.house-projects').addEventListener('click', function (e) {
    e.preventDefault();
    navigate('#jobs', null, e.currentTarget, 'jobs');
  });
  signpost.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.arrow') : null;
    if (!b) return;
    navigate('#jobs/' + b.dataset.company, centreOf(b), b, 'company');
  });

  ['#fun-back', '#jobs-back', '#company-back', '#game-back'].forEach(function (id) {
    $(id).addEventListener('click', goBack);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!funCard.hidden && stack[stack.length - 1] === 'fun') { closeFunCard(); return; }
    if (!lightbox.hidden) { closeLightbox(); return; }
    if (anyBubble()) { closeBubbles(); return; }
    goBack();
  });
  window.addEventListener('popstate', function () { apply(parse(location.hash)); });

  /* arriving on a direct link (for example /#jobs/allmax) opens it straight away */
  var first = parse(location.hash);
  if (first.stack.length) apply(first, { instant: true });
})();
