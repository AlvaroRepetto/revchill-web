/* =========================================================================
   RevChill - app.js
   -------------------------------------------------------------------------
   No necesitas tocar este archivo para el dia a dia.
   Contenido -> assets/js/data.js      Textos -> assets/js/i18n.js
   Sin dependencias. Sin listeners de scroll: IntersectionObserver.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.REVCHILL || {};
  var EN = window.I18N_EN || {};
  var L = D.links || {};
  var LANGS = ["es", "en"];
  var lang = "es";
  var ES = Object.assign({}, window.I18N_ES || {});  // + lo que se lee del HTML al cargar

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var t  = function (k) {
    if (lang === "en" && (k in EN)) return EN[k];
    return (k in ES) ? ES[k] : (EN[k] || "");
  };
  var pick = function (v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] || v.es || v.en || "";
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ------------------------------------------------------------------ */
  /* IDIOMA                                                              */
  /* ------------------------------------------------------------------ */
  function detect() {
    try { var s = localStorage.getItem("revchill-lang"); if (s && LANGS.indexOf(s) > -1) return s; } catch (e) {}
    try { var q = new URLSearchParams(location.search).get("lang"); if (q && LANGS.indexOf(q) > -1) return q; } catch (e) {}
    return (navigator.language || "es").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  }

  /* El HTML viene en español. Lo guardamos antes de tocar nada para poder
     volver a él, y así el idioma por defecto no depende de JavaScript. */
  function snapshotES() {
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in ES)) ES[k] = el.innerHTML;
    });
    $$("[data-ph-key]").forEach(function (el) {
      var k = el.getAttribute("data-ph-key");
      if (!(k in ES) && el.getAttribute("data-ph")) ES[k] = el.getAttribute("data-ph");
    });
  }

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    try { localStorage.setItem("revchill-lang", lang); } catch (e) {}
    $$("[data-i18n]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n")); });
    $$("[data-ph-key]").forEach(function (el) { el.setAttribute("data-ph", t(el.getAttribute("data-ph-key"))); });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });

    renderNext();
    renderAgenda();
    renderGallery();
    renderQuotes();
    renderStats();
    renderWall();
    renderChips();
  }

  /* ------------------------------------------------------------------ */
  /* ENLACES                                                             */
  /* ------------------------------------------------------------------ */
  (function wire() {
    var map = { whatsapp: L.whatsapp, linkedin: L.linkedin, instagram: L.instagram };
    $$("[data-js]").forEach(function (el) {
      var k = el.dataset.js;
      if (map[k]) { el.href = map[k]; el.target = "_blank"; el.rel = "noopener"; }
      else if (k === "mailto" && L.email) el.href = "mailto:" + L.email;
      else if (k.indexOf("sponsor-") === 0 && (L.emailSponsors || L.email)) {
        var tier = { "sponsor-local":  "Patrocinio RevChill · Partner local",
                     "sponsor-host":   "Patrocinio RevChill · Host de evento",
                     "sponsor-season": "Patrocinio RevChill · Partner de temporada" }[k]
                   || "Patrocinio RevChill";
        el.href = "mailto:" + (L.emailSponsors || L.email) + "?subject=" + encodeURIComponent(tier);
      }
      else if (k === "mailto-host" && L.email)
        el.href = "mailto:" + L.email + "?subject=" + encodeURIComponent("Quiero ser host de RevChill");
      else if (k.indexOf("wk-") === 0 && L.email) {
        var subj = { "wk-general": "RevChill Weekend Hack",
                     "wk-venue":   "RevChill Weekend Hack · Alojamiento anfitrión",
                     "wk-attend":  "RevChill Weekend Hack · Quiero venir",
                     "wk-sponsor": "RevChill Weekend Hack · Patrocinio" }[k];
        el.href = "mailto:" + L.email + "?subject=" + encodeURIComponent(subj);
      }
    });
  })();

  /* ------------------------------------------------------------------ */
  /* EVENTOS                                                             */
  /* ------------------------------------------------------------------ */
  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(s || ""));
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : new Date(s);
  }
  function split() {
    var now = new Date();
    var all = (D.events || []).map(function (e) {
      var o = {}; for (var k in e) if (Object.prototype.hasOwnProperty.call(e, k)) o[k] = e[k];
      o._d = parse(e.date); return o;
    });
    return {
      next: all.filter(function (e) { return e._d >= now; }).sort(function (a, b) { return a._d - b._d; }),
      past: all.filter(function (e) { return e._d < now; }).sort(function (a, b) { return b._d - a._d; })
    };
  }
  var loc  = function () { return lang === "es" ? "es-ES" : "en-GB"; };
  var mon  = function (d) { return d.toLocaleDateString(loc(), { month: "short" }).replace(".", ""); };
  var hour = function (d) { return d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" }); };

  function seatsOf(e) {
    var cap = +e.capacity || 0;
    var reg = (e.registered == null) ? null : +e.registered;
    if (!cap || reg == null) return null;
    var left = Math.max(cap - reg, 0);
    return { cap: cap, reg: reg, left: left,
             pct: Math.min(Math.round(reg / cap * 100), 100),
             full: e.status === "full" || left <= 0 };
  }

  /* --- franja: próximo encuentro --- */
  function renderNext() {
    var box = $("#nextUp"); if (!box) return;
    var e = split().next[0];
    if (!e) {
      box.innerHTML = '<p class="strip__empty">' + t("strip.none") + '. ' +
        '<a class="link" href="' + esc(L.whatsapp || "#") + '" target="_blank" rel="noopener">' +
        t("ag.notify") + "</a></p>";
      return;
    }
    var s = seatsOf(e);
    box.innerHTML =
      '<p class="strip__when"><span class="strip__city">' + esc(e.city) + "</span> " +
        e._d.getDate() + " " + mon(e._d) + "</p>" +
      '<p class="strip__where">' + esc(e.venue) + " · " + hour(e._d) + "h</p>" +
      (s ? '<p class="strip__seats"><span>' + s.left + " " + t("strip.left") + "</span>" +
           '<span class="strip__bar"><span data-pct="' + s.pct + '"></span></span></p>' : "") +
      (e.eventbrite
        ? '<a class="btn" href="' + esc(e.eventbrite) + '" target="_blank" rel="noopener">' + t("ag.book") + "</a>"
        : '<span class="btn" aria-disabled="true">' + t("ag.soon") + "</span>");
    requestAnimationFrame(function () {
      var b = $(".strip__bar span", box); if (b) b.style.width = b.dataset.pct + "%";
    });
  }

  /* --- agenda --- */
  var tab = "next";
  function evHTML(e, past) {
    var s = seatsOf(e), d = e._d;
    var btn = past
      ? '<span class="btn btn--sm btn--ghost" aria-disabled="true">' + t("ag.done") + "</span>"
      : !e.eventbrite
        ? '<span class="btn btn--sm btn--ghost" aria-disabled="true">' + t("ag.soon") + "</span>"
        : ((s && s.full) || e.status === "waitlist")
          ? '<a class="btn btn--sm btn--ghost" href="' + esc(e.eventbrite) + '" target="_blank" rel="noopener">' +
            (e.status === "waitlist" ? t("ag.wait") : t("ag.full")) + "</a>"
          : '<a class="btn btn--sm" href="' + esc(e.eventbrite) + '" target="_blank" rel="noopener">' + t("ag.book") + "</a>";
    var seats = s
      ? '<span class="ev__seats">' + (past ? s.reg + " " + t("ag.attendees") : s.reg + "/" + s.cap + " " + t("ag.seats")) + "</span>"
      : "";
    return '<article class="ev' + (past ? " ev--past" : "") + '">' +
      '<p class="ev__d">' + d.getDate() + '<span class="ev__m">' + mon(d) + " " + d.getFullYear() + "</span></p>" +
      '<div><h3 class="ev__city">' + esc(e.city) + '</h3>' +
      '<p class="ev__meta">' + esc(e.venue) + " · " + hour(d) + "h · " + t("ag.free") + "</p></div>" +
      '<div class="ev__side">' + seats + btn + "</div></article>";
  }
  function renderAgenda() {
    var box = $("#agendaList"); if (!box) return;
    var list = split()[tab], past = tab === "past";
    if (!list.length) {
      box.innerHTML = '<div class="agenda__empty"><p>' + t(past ? "ag.emptyPast" : "ag.emptyNext") + "</p>" +
        (past ? "" : '<a class="btn" href="' + esc(L.whatsapp || "#") + '" target="_blank" rel="noopener">' +
         t("ag.notify") + "</a>") + "</div>";
      return;
    }
    box.innerHTML = list.map(function (e) { return evHTML(e, past); }).join("");
  }
  $$(".tab").forEach(function (b) {
    b.addEventListener("click", function () {
      tab = b.dataset.tab;
      $$(".tab").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      renderAgenda();
    });
  });

  /* ------------------------------------------------------------------ */
  /* GALERÍA                                                             */
  /* ------------------------------------------------------------------ */
  function renderGallery() {
    var box = $("#mason"); if (!box) return;
    var items = D.gallery || [];
    if (!items.length) {
      box.innerHTML = ["4/5", "1/1", "3/4", "4/3", "1/1", "4/5"].map(function (a) {
        return '<figure class="ph" style="aspect-ratio:' + a + '" data-ph="' + t("gal.photo") + '"></figure>';
      }).join("");
      return;
    }
    box.innerHTML = items.map(function (it) {
      var cap = pick(it.caption);
      return it.type === "video"
        ? '<figure><video src="' + esc(it.src) + '"' + (it.poster ? ' poster="' + esc(it.poster) + '"' : "") +
          ' controls playsinline preload="metadata"></video></figure>'
        : '<figure><img src="' + esc(it.src) + '" alt="' + esc(cap) + '" loading="lazy"></figure>';
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* TESTIMONIOS                                                         */
  /* ------------------------------------------------------------------ */
  function renderQuotes() {
    var box = $("#rail"); if (!box) return;
    var all = D.quotes || [];
    var real = all.filter(function (q) { return !q.pending; });
    var sec = document.getElementById("opiniones");
    /* Si no hay ni una reseña real, la sección entera no se muestra.
       Mejor nada que tres huecos vacíos delante de un patrocinador. */
    if (sec) sec.hidden = real.length === 0;
    box.innerHTML = all.map(function (q) {
      var pend = !!q.pending;
      var name = pend ? t("q.pending") : (q.name || "");
      var ini = pend ? "?" : name.trim().split(/\s+/).slice(0, 2)
        .map(function (w) { return w[0]; }).join("").toUpperCase();
      return '<blockquote class="q' + (pend ? " q--pending" : "") + '">' +
        '<p class="q__text">' + (pend ? "" : "“") + esc(pick(q.text)) + (pend ? "" : "”") + "</p>" +
        '<footer class="q__by"><span class="q__av" aria-hidden="true">' + esc(ini) + "</span>" +
        '<span><cite class="q__name" style="font-style:normal">' + esc(name) + "</cite>" +
        '<span class="q__role">' + esc(pick(q.role)) + "</span></span></footer></blockquote>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* CIFRAS · SPONSORS · CIUDADES                                        */
  /* ------------------------------------------------------------------ */
  function renderStats() {
    var box = $("#stats"); if (!box) return;
    var keys = ["biz.s1", "biz.s2", "biz.s3", "biz.s4"];
    box.innerHTML = (D.figures || []).slice(0, 4).map(function (f, i) {
      return "<div><dt>" + (t(keys[i]) || esc(pick(f.label))) + "</dt><dd>" + esc(f.value) + "</dd></div>";
    }).join("");
  }

  function renderWall() {
    var box = $("#wall"); if (!box) return;
    var list = D.sponsors || [];
    var slots = Math.max((D.sponsorSlots || 8) - list.length, 0);
    var h = list.map(function (s) {
      var img = '<img src="' + esc(s.logo) + '" alt="' + esc(s.name) + '" loading="lazy">';
      return s.url
        ? '<a class="wall__c" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + img + "</a>"
        : '<div class="wall__c">' + img + "</div>";
    }).join("");
    for (var i = 0; i < slots; i++)
      h += '<div class="wall__c"><p class="wall__slot"><b>' + t("sp.slotT") + "</b>" + t("sp.slotD") + "</p></div>";
    box.innerHTML = h;
  }

  function renderChips() {
    var box = $("#chips"); if (!box) return;
    box.innerHTML = (D.cities || []).map(function (c) {
      return c.soon
        ? '<li class="chip chip--soon">' + esc(c.name) + "</li>"
        : '<li class="chip chip--live">' + esc(c.name) + "</li>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* NAV                                                                 */
  /* ------------------------------------------------------------------ */
  (function nav() {
    var n = $("#nav"), b = $("#burger"), links = $("#navLinks");
    if (!n) return;
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (es) { n.classList.toggle("stuck", !es[0].isIntersecting); })
      .observe(sentinel);

    if (b && links) {
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!open));
        links.classList.toggle("open", !open);
      });
      links.addEventListener("click", function (e) {
        if (e.target.closest("a")) { b.setAttribute("aria-expanded", "false"); links.classList.remove("open"); }
      });
    }
    var as = $$("#navLinks a");
    var secs = as.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    if (secs.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          as.forEach(function (a) {
            if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      secs.forEach(function (s) { io.observe(s); });
    }
  })();

  /* ------------------------------------------------------------------ */
  /* REVEAL                                                              */
  /* ------------------------------------------------------------------ */
  (function reveal() {
    var targets = $$(".sec > .wrap > *, .band__in, .cta__in, .strip__in, .rail");
    targets.forEach(function (el) { el.classList.add("rv"); });
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("on"); });
      $$(".ratio").forEach(function (r) { r.classList.add("on"); });
      return;
    }
    var io = new IntersectionObserver(function (es, ob) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("on"); ob.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    targets.forEach(function (el) { io.observe(el); });

    var r = $(".ratio");
    if (r) new IntersectionObserver(function (es, ob) {
      if (es[0].isIntersecting) { r.classList.add("on"); ob.disconnect(); }
    }, { threshold: .5 }).observe(r);
  })();

  /* ------------------------------------------------------------------ */
  /* SEO: datos estructurados                                            */
  /* ------------------------------------------------------------------ */
  (function schema() {
    var next = split().next;
    if (!next.length) return;
    var json = next.map(function (e) {
      return {
        "@context": "https://schema.org", "@type": "Event",
        name: pick(e.title) || ("RevChill " + e.city),
        startDate: e.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: e.venue,
          address: { "@type": "PostalAddress", addressLocality: e.address || e.city, addressCountry: "ES" } },
        organizer: { "@type": "Organization", name: "RevChill", url: "https://revchill.club/" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: e.eventbrite || "https://revchill.club/#agenda" }
      };
    });
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "ld-events";
    s.textContent = JSON.stringify(json);
    document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------------ */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); });
  });
  snapshotES();
  applyLang(detect());
})();
