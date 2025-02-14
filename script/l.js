window.requestAnimationFrame =
  window.__requestAnimationFrame ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (function () {
    return function (callback, element) {
      var lastTime = element.__lastTime || 0;
      var currTime = Date.now();
      var timeToCall = Math.max(1, 33 - (currTime - lastTime));
      window.setTimeout(callback, timeToCall);
      element.__lastTime = currTime + timeToCall;
    };
  })();

window.isDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
  (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
);

var loaded = false;

function init() {
  if (loaded) return;
  loaded = true;
  var mobile = window.isDevice;
  var koef = mobile ? 0.5 : 1; // Коэффициент для мобильных устройств
  var canvas = document.getElementById("heart");
  var ctx = canvas.getContext("2d");
  var width = (canvas.width = koef * innerWidth);
  var height = (canvas.height = koef * innerHeight);
  var rand = Math.random;

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);

  function drawText(ctx, text, fontSize, color, x, y, align = "center") {
    ctx.font = `${fontSize}px Comic Sans MS`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  function heartPosition(rad) {
    return [
      Math.pow(Math.sin(rad), 3),
      -(
        15 * Math.cos(rad) -
        5 * Math.cos(2 * rad) -
        2 * Math.cos(3 * rad) -
        Math.cos(4 * rad)
      ),
    ];
  }

  function scaleAndTranslate(pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  }

  window.addEventListener("resize", function () {
    width = canvas.width = koef * innerWidth;
    height = canvas.height = koef * innerHeight;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
  });

  var traceCount = mobile ? 20 : 50;
  var pointsOrigin = [];
  var dr = mobile ? 0.3 : 0.1;
  for (var i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 310, 19, 0, 200));
  }

  var heartPointsCount = pointsOrigin.length;
  var targetPoints = [];

  function pulse(kx, ky) {
    for (var i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [
        kx * pointsOrigin[i][0] + width / 2,
        ky * pointsOrigin[i][1] + height / 2.2,
      ];
    }
  }

  var e = [];
  for (var i = 0; i < heartPointsCount; i++) {
    var x = rand() * width;
    var y = rand() * height;
    e[i] = {
      vx: 0,
      vy: 0,
      R: 2,
      speed: rand() + 5,
      q: ~~(rand() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * rand() + 0.7,
      f: "rgba(248, 33, 69, 0.82)",
      trace: Array.from({ length: traceCount }, () => ({ x, y })),
    };
  }

  var config = { traceK: 0.4, timeDelta: 0.6 };
  var time = 0;

  function loop() {
    var n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
