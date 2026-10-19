// 3nvariable — the colophon counter, the ⌘K list of pages, and the three keys.
(function () {
  // A playful estimate, not a measurement: assume idling on this page costs
  // the machine about 1.7 million flops per second. Not peer reviewed.
  var flops = document.getElementById("flops");
  if (flops) {
    var start = performance.now();
    var fmt = function (x) {
      if (x < 1e6) return (x / 1e3).toFixed(1) + " × 10³";
      if (x < 1e9) return (x / 1e6).toFixed(1) + " × 10⁶";
      return (x / 1e9).toFixed(1) + " × 10⁹";
    };
    var tick = function () {
      var burned = (performance.now() - start) / 1000 * 1.7e6;
      flops.textContent = "this page has burned ≈ " + fmt(burned) + " flops on your behalf (estimate; not peer reviewed)";
    };
    tick();
    setInterval(tick, 1000);
  }

  var X = "https://x.com/computeunits";
  var items = [
    ["3nvariable", "/", "home"],
    ["writings", "/writings/", "w"],
    ["The Memory Wall, as a Feeling", "/writings/the-memory-wall-as-a-feeling/", "note [1]"],
    ["A Taxonomy of Idle Cycles", "/writings/a-taxonomy-of-idle-cycles/", "essay [2]"],
    ["Solve for n", "/writings/solve-for-n/", "remark [3]"],
    ["projects", "/projects/", "p"],
    ["@computeunits on X", X, "x ↗"]
  ];

  var dialog = document.createElement("dialog");
  dialog.className = "cmdk";
  dialog.setAttribute("aria-label", "Go to");
  dialog.innerHTML =
    '<input type="text" placeholder="solve for…" aria-label="Filter pages" autocomplete="off" spellcheck="false">' +
    '<ul role="listbox"></ul>' +
    '<p class="hint">↑ ↓ to move · enter to open · esc to close</p>';
  document.body.appendChild(dialog);
  var input = dialog.querySelector("input");
  var list = dialog.querySelector("ul");
  var selected = 0;

  function render() {
    var q = input.value.trim().toLowerCase();
    var shown = items.filter(function (it) { return (it[0] + " " + it[2]).toLowerCase().indexOf(q) !== -1; });
    selected = Math.min(selected, Math.max(shown.length - 1, 0));
    list.innerHTML = shown.length ? "" : '<li><a>n is not defined<span>0 results</span></a></li>';
    shown.forEach(function (it, i) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = it[1];
      a.setAttribute("role", "option");
      a.setAttribute("aria-selected", i === selected ? "true" : "false");
      if (it[1] === X) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.textContent = it[0];
      var tag = document.createElement("span");
      tag.textContent = it[2];
      a.appendChild(tag);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function open() {
    if (dialog.open) return;
    input.value = "";
    selected = 0;
    render();
    dialog.showModal();
    input.focus();
  }

  input.addEventListener("input", function () { selected = 0; render(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    var links = list.querySelectorAll("a[href]");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      selected = (selected + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      render();
      list.querySelector('[aria-selected="true"]').scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && links[selected]) {
      e.preventDefault();
      links[selected].click();
      dialog.close();
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); return; }
    if (dialog.open || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key === "/") { e.preventDefault(); open(); }
    else if (e.key === "w") location.href = "/writings/";
    else if (e.key === "p") location.href = "/projects/";
    else if (e.key === "x") window.open(X, "_blank", "noopener");
  });
})();
