/* =========================================================
   Pra Yasmin — interações
   Os textos ficam todos no objeto CONTENT, fácil de editar.
   ========================================================= */

const CONTENT = {
  moods: {
    feliz: "Aí sim KKKK. Gosto de saber que teu dia tá sendo bom.",
    cansada: "Então tenta descansar um pouco, viu? Não precisa resolver tudo hoje.",
    saudade: "Também bate por aqui. Queria estar perto agora.",
    ansiosa: "Vai com calma. Uma coisa de cada vez, tá? Não precisa pensar em tudo ao mesmo tempo.",
    sei: "Justo KKKK. Às vezes nem a gente sabe explicar direito."
  },
  quiz: [
    {
      q: "O que eu mais gosto quando a gente conversa?",
      options: ["Quando você começa a contar uma fofoca", "Quando a gente fala besteira", "Quando você fala de algo que gosta"],
      reply: "Difícil escolher uma só. Gosto das nossas conversas, até quando o assunto é completamente aleatório."
    },
    {
      q: "Quando aparece uma mensagem sua, eu…",
      options: ["Vou responder na hora", "Abro e fico pensando no que falar", "Já quero saber o que aconteceu"],
      reply: "Depende do que eu tô fazendo, mas pode ter certeza que eu gosto de ver teu nome aparecendo."
    },
    {
      q: "Qual desses planos eu toparia com você?",
      options: ["Ficar conversando por horas", "Sair sem nem ter um roteiro", "Não fazer absolutamente nada"],
      reply: "Qualquer um desses. O legal é ter sua companhia, não precisa inventar muita coisa."
    }
  ],
  letters: [
    { icon: "✉️", label: "uma coisa", text: "Eu presto atenção em várias coisinhas que você fala. Talvez eu não comente na hora, mas eu lembro." },
    { icon: "🌙", label: "mais uma", text: "Gosto quando a gente consegue conversar de verdade, sem precisar ficar pensando muito no que dizer." },
    { icon: "☁️", label: "pra um dia difícil", text: "Se o dia não estiver legal, não precisa fingir que tá tudo bem comigo. Pode falar do seu jeito." },
    { icon: "💙", label: "a última", text: "E sim, eu escolhi azul por sua causa. Não tinha como deixar essa passar KKKK." }
  ],
  final: [
    "Yasmin,",
    "eu não sou muito bom em falar essas coisas, então resolvi fazer isso aqui em vez de tentar explicar tudo por mensagem.",
    "Gosto de ter você por perto, das nossas conversas, das besteiras e até dos momentos mais aleatórios. Você é importante pra mim, de verdade. E eu queria fazer alguma coisa que mostrasse isso, mesmo que fosse desse jeito meio diferente.",
    "Enfim, era isso. Eu amo você."
  ],
  sign: "— feito por mim, pra você."
};

/* ---------- Utilidades ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const STEPS = ["step-envelope", "step-mood", "step-quiz", "step-letters", "step-stars", "step-hold", "step-final"];
let current = 0;

function goTo(index) {
  $$(".step").forEach((el) => el.classList.remove("active"));
  current = index;
  setTimeout(() => $("#" + STEPS[index]).classList.add("active"), 150);
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const pct = Math.round((current / (STEPS.length - 1)) * 100);
  $("#progressFill").style.width = pct + "%";
  $("#progressLabel").textContent = pct === 100 ? "tudo concluído" : pct + "% concluído";
}

function reveal(el, html) {
  el.hidden = false;
  el.innerHTML = html;
  el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
}

/* Corações que sobem a partir de um ponto */
function hearts(x, y, n = 14) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > .3 ? "♥" : "✦";
    h.style.left = x + "px"; h.style.top = y + "px";
    h.style.fontSize = 12 + Math.random() * 18 + "px";
    h.style.setProperty("--x", (Math.random() - .5) * 240 + "px");
    h.style.setProperty("--r", (Math.random() - .5) * 90 + "deg");
    h.style.animationDelay = Math.random() * .3 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 3000);
  }
}
const centerOf = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

/* ---------- Céu estrelado ---------- */
(function buildSky() {
  const sky = $("#sky");
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("span");
    const size = Math.random() * 2 + .5;
    s.className = "star";
    Object.assign(s.style, { width: size + "px", height: size + "px", left: Math.random() * 100 + "%", top: Math.random() * 100 + "%" });
    s.style.setProperty("--d", 2 + Math.random() * 4 + "s");
    s.style.animationDelay = Math.random() * 4 + "s";
    sky.appendChild(s);
  }
  // Estrela cadente ocasional
  setInterval(() => {
    const s = document.createElement("span");
    s.className = "shooting";
    s.style.left = 50 + Math.random() * 50 + "%";
    s.style.top = Math.random() * 40 + "%";
    sky.appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }, 7000);
})();

/* ---------- 0. Envelope ---------- */
$("#envelope").addEventListener("click", function () {
  if (this.classList.contains("open")) return;
  this.classList.add("open");
  const [x, y] = centerOf(this);
  setTimeout(() => hearts(x, y, 10), 700);
  setTimeout(() => goTo(1), 2000);
});

/* ---------- 1. Humor ---------- */
$$("[data-mood]").forEach((chip) => {
  chip.addEventListener("click", () => {
    $$("[data-mood]").forEach((c) => c.classList.remove("selected"));
    chip.classList.add("selected");
    reveal($("#moodReply"), CONTENT.moods[chip.dataset.mood]);
    $("#moodNext").hidden = false;
  });
});
$("#moodNext").addEventListener("click", () => { renderQuiz(); goTo(2); });

/* ---------- 2. Quiz ---------- */
let qIndex = 0;
function renderQuiz() {
  const item = CONTENT.quiz[qIndex];
  $("#quizQuestion").textContent = item.q;
  $("#quizReply").hidden = true;
  $("#quizNext").hidden = true;
  $("#quizCounter").textContent = `${qIndex + 1} de ${CONTENT.quiz.length}`;
  const box = $("#quizOptions");
  box.innerHTML = "";
  item.options.forEach((text) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = text;
    b.addEventListener("click", () => {
      box.querySelectorAll(".option").forEach((o) => (o.disabled = true));
      b.classList.add("selected");
      reveal($("#quizReply"), item.reply);
      const btn = $("#quizNext");
      btn.textContent = qIndex === CONTENT.quiz.length - 1 ? "continuar" : "próxima";
      btn.hidden = false;
    });
    box.appendChild(b);
  });
}
$("#quizNext").addEventListener("click", () => {
  qIndex++;
  if (qIndex < CONTENT.quiz.length) {
    $("#step-quiz").classList.remove("active");
    setTimeout(() => { renderQuiz(); $("#step-quiz").classList.add("active"); }, 400);
  } else {
    renderLetters(); goTo(3);
  }
});

/* ---------- 3. Cartinhas (a última só abre depois das outras) ---------- */
let opened = 0;
function renderLetters() {
  opened = 0;
  const wrap = $("#letters");
  wrap.innerHTML = "";
  $("#lettersNext").hidden = true;
  CONTENT.letters.forEach((l, i) => {
    const last = i === CONTENT.letters.length - 1;
    const el = document.createElement("button");
    el.className = "letter" + (last ? " locked" : "");
    el.innerHTML = `
      <div class="letter__inner">
        <div class="letter__face letter__front"><span class="icon">${l.icon}</span><small>${l.label}</small></div>
        <div class="letter__face letter__back">${l.text}</div>
      </div>`;
    el.addEventListener("click", () => {
      if (el.classList.contains("open")) return;
      if (el.classList.contains("locked")) {
        el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
        return;
      }
      el.classList.add("open");
      opened++;
      if (opened === CONTENT.letters.length - 1) wrap.lastChild.classList.remove("locked");
      if (opened === CONTENT.letters.length) {
        const [x, y] = centerOf(el); hearts(x, y);
        setTimeout(() => ($("#lettersNext").hidden = false), 900);
      }
    });
    wrap.appendChild(el);
  });
}
$("#lettersNext").addEventListener("click", () => { goTo(4); setTimeout(startStars, 900); });

/* ---------- 4. Pegar estrelas ---------- */
const GOAL = 7;
let caught = 0, starTimer = null;
function startStars() {
  caught = 0;
  const field = $("#starField");
  field.querySelectorAll(".falling, .constellation").forEach((e) => e.remove());
  $("#starCount").textContent = `0 / ${GOAL}`;
  $("#starsNext").hidden = true;
  clearInterval(starTimer);
  starTimer = setInterval(() => spawnStar(field), 650);
}
function spawnStar(field) {
  // Queda controlada por JavaScript (funciona mesmo com "reduzir movimento" ativado)
  const s = document.createElement("span");
  s.className = "falling";
  s.textContent = "✦";
  s.style.left = 5 + Math.random() * 85 + "%";
  field.appendChild(s);
  const duration = 3000 + Math.random() * 2000;
  const end = field.clientHeight + 40;
  let t0 = null;
  function frame(t) {
    if (!s.isConnected || s.classList.contains("caught")) return;
    if (!t0) t0 = t;
    const p = (t - t0) / duration;
    if (p >= 1) { s.remove(); return; }
    s.style.transform = `translateY(${p * end}px) rotate(${p * 200}deg)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  s.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (s.classList.contains("caught") || caught >= GOAL) return;
    s.classList.add("caught");
    caught++;
    $("#starCount").textContent = `${caught} / ${GOAL}`;
    setTimeout(() => s.remove(), 400);
    if (caught >= GOAL) finishStars(field);
  });
}
function finishStars(field) {
  clearInterval(starTimer);
  field.querySelectorAll(".falling").forEach((e) => e.remove());
  // As estrelas formam uma constelação em forma de coração
  const pts = [[200, 110], [150, 70], [100, 95], [105, 150], [200, 240], [295, 150], [300, 95], [250, 70]];
  const d = "M" + pts.map((p) => p.join(",")).join(" L") + " Z";
  field.insertAdjacentHTML("beforeend", `
    <svg class="constellation" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet">
      <path d="${d}" />
      ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" />`).join("")}
      <text x="200" y="290" text-anchor="middle">Yasmin</text>
    </svg>`);
  setTimeout(() => ($("#starsNext").hidden = false), 3000);
}
$("#starsNext").addEventListener("click", () => goTo(5));

/* ---------- 5. Segurar o coração (3 segundos) ---------- */
(function holdHeart() {
  const btn = $("#holdHeart"), ring = $("#holdRing"), hint = $("#holdHint");
  const TOTAL = 289, DURATION = 3000;
  let start = null, raf = null, done = false;

  function tick(t) {
    if (!start) start = t;
    const p = Math.min((t - start) / DURATION, 1);
    ring.style.strokeDashoffset = TOTAL * (1 - p);
    if (p < 1) raf = requestAnimationFrame(tick);
    else complete();
  }
  function press(e) {
    if (done) return;
    e.preventDefault();
    btn.classList.add("pressing");
    hint.textContent = "boa, continua…";
    start = null; raf = requestAnimationFrame(tick);
  }
  function release() {
    if (done) return;
    cancelAnimationFrame(raf);
    btn.classList.remove("pressing");
    ring.style.strokeDashoffset = TOTAL;
    hint.textContent = "soltou KKKK, tenta de novo";
  }
  function complete() {
    done = true;
    btn.classList.remove("pressing");
    hint.textContent = "aí sim, conseguiu";
    const [x, y] = centerOf(btn); hearts(x, y, 24);
    setTimeout(() => { goTo(6); setTimeout(typeFinal, 900); }, 1400);
  }
  btn.addEventListener("pointerdown", press);
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, release));
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
  // Permite reiniciar a etapa
  window.resetHold = () => { done = false; ring.style.strokeDashoffset = TOTAL; hint.textContent = "segura aqui"; };
})();

/* ---------- 6. Carta final digitada ---------- */
let typing = null;
function typeFinal() {
  const box = $("#finalLetter");
  box.innerHTML = "";
  clearTimeout(typing);
  let p = 0, c = 0, para = null;
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  function step() {
    if (p >= CONTENT.final.length) {
      cursor.remove();
      box.insertAdjacentHTML("beforeend", `<span class="sign">${CONTENT.sign}</span>`);
      return;
    }
    if (c === 0) { para = document.createElement("p"); para.style.marginBottom = "12px"; box.appendChild(para); }
    para.textContent = CONTENT.final[p].slice(0, ++c);
    para.appendChild(cursor);
    if (c >= CONTENT.final[p].length) { p++; c = 0; typing = setTimeout(step, 500); }
    else typing = setTimeout(step, 28);
  }
  step();
}
$("#burst").addEventListener("click", (e) => hearts(e.clientX, e.clientY, 20));
$("#restart").addEventListener("click", () => {
  clearTimeout(typing);
  qIndex = 0;
  $("#envelope").classList.remove("open");
  $$("[data-mood]").forEach((c) => c.classList.remove("selected"));
  $("#moodReply").hidden = true; $("#moodNext").hidden = true;
  window.resetHold();
  goTo(0);
});

updateProgress();
