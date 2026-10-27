/* Sunrise: рассвет над Улан-Удэ на сегодня (формула NOAA), открытие по дню недели, подсветка строки утра */
(function () {
  var LAT = 51.8086, LON = 107.6072, TZ = 8;
  var t = new Date(Date.now() + TZ * 3600e3), y0 = Date.UTC(t.getUTCFullYear(), 0, 1);
  var N = Math.floor((t - y0) / 864e5) + 1, g = 2 * Math.PI / 365 * (N - 1), r = Math.PI / 180;
  var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  var d = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  var ha = Math.acos(Math.cos(90.833 * r) / (Math.cos(LAT * r) * Math.cos(d)) - Math.tan(LAT * r) * Math.tan(d)) / r;
  var rise = Math.round(720 - 4 * (LON + ha) - eq + TZ * 60), wd = t.getUTCDay(), open = (wd === 0 || wd === 6) ? 540 : 510;
  function hm(m) { return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
  var s = document.querySelector('[data-sun]');
  if (s) s.innerHTML = rise > open
    ? 'Сегодня мы открываемся раньше солнца: в <b>' + hm(open) + '</b>, а рассвет над Улан-Удэ в <b>' + hm(rise) + '</b>.'
    : 'Сегодня солнце над Улан-Удэ встаёт в <b>' + hm(rise) + '</b>, а мы открываемся в <b>' + hm(open) + '</b>.';
  var ol = document.querySelector('.utro .rows'); if (!ol) return;
  var li = [].slice.call(ol.children);
  li.forEach(function (x) {
    if (x.dataset.k === 'rise') { x.dataset.m = rise; x.querySelector('i').textContent = hm(rise); }
    if (x.dataset.k === 'open') { x.dataset.m = open; x.querySelector('i').textContent = hm(open); }
  });
  li.sort(function (a, b) { return a.dataset.m - b.dataset.m; }).forEach(function (x) { ol.appendChild(x); });
  function tick() {
    var n = new Date(Date.now() + TZ * 3600e3), m = n.getUTCHours() * 60 + n.getUTCMinutes(), cur = null;
    li.forEach(function (x) { if (m >= +x.dataset.m) cur = x; });
    li.forEach(function (x) { x.classList.toggle('cur', x === cur && m < 1200); });
  }
  tick(); setInterval(tick, 60000);
})();
