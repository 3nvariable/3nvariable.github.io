// 3nvariable — the colophon counter.
// A playful estimate, not a measurement: assume idling on this page costs
// the machine about 1.7 million flops per second. Not peer reviewed.
(function () {
  var el = document.getElementById("flops");
  if (!el) return;

  var start = performance.now();

  function fmt(x) {
    if (x < 1e6) return (x / 1e3).toFixed(1) + " × 10³";
    if (x < 1e9) return (x / 1e6).toFixed(1) + " × 10⁶";
    return (x / 1e9).toFixed(1) + " × 10⁹";
  }

  function tick() {
    var seconds = (performance.now() - start) / 1000;
    var burned = seconds * 1.7e6;
    el.textContent =
      "this page has burned ≈ " + fmt(burned) +
      " flops on your behalf (estimate; not peer reviewed)";
  }

  tick();
  setInterval(tick, 1000);
})();
