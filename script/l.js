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
  var koef = mobile ? 0.5 : 1;
  var canvas = document.getElementById("heart");
  var ctx = canvas.getContext("2d");
  var width = (canvas.width = koef * innerWidth);
  var height = (canvas.height = koef * innerHeight);
  var rand = Math.random;

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);


  function drawFirstText(ctx, canvas) {
    ctx.font = "60px Comic Sans MS"; // Устанавливаем шрифт и размер
    ctx.fillStyle = "#f82145"; // Устанавливаем цвет текста
    ctx.textAlign = "center"; // Выравнивание по центру
    ctx.fillText("С днем Святого Валентина, солнце", canvas.width / 2, canvas.height / 2.2 - 500); // Рисуем текст
  }

  function drawSecondText(ctx, canvas) {
    ctx.font = "60px comic sans ms";
    ctx.fillStyle = "#f82145";
    ctx.textAlign = "center";
    ctx.fillText("Я люблю тебя💗", width / 2, height / 2.2 + 650);
  }
  function drawThText(ctx, canvas) {
    ctx.font = "30px Comic Sans MS"; 
    ctx.fillStyle = "#f82145"; 
    ctx.textAlign = "left"; 
    ctx.fillText("Однажды ты украл мое сердечко...", 90, canvas.height / 2 - 400); 
    ctx.fillText("С тех пор я влюбляюсь в тебя каждый день", 90, canvas.height / 2 - 350); 
}
function drawFText(ctx, canvas) {
  ctx.font = "30px Comic Sans MS"; 
  ctx.fillStyle = "#f82145"; 
  ctx.textAlign = "right"; 
  const text1 = "Хочу вязать тебе носочки";
  const text2 = "в старости";
  const padding = 90; // например, 20 пикселей

  // Вычисляем координаты X для правого выравнивания с отступом
  const x1 = canvas.width - padding; // X для первого текста
  const x2 = canvas.width - padding; // X для второго текста

  // Вычисляем Y-координаты
  const y1 = canvas.height / 2 - 250;
  const y2 = canvas.height / 2 - 200;

  // Рисуем текст
  ctx.fillText(text1, x1, y1); 
  ctx.fillText(text2, x2, y2); 
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
  for (var i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 310, 19, 0, 200));
  for (var i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 250, 15, 0, 200));
  for (var i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 190, 11, 0, 200));
  for (var i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 130, 7, 0, 200));

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
    time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;

    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, width, height);

    for (var i = e.length; i--;) {
        var u = e[i];
        var q = targetPoints[u.q];
        var dx = u.trace[0].x - q[0];
        var dy = u.trace[0].y - q[1];
        var length = Math.sqrt(dx * dx + dy * dy);

        if (length < 10) {
            if (rand() > 0.95) {
                u.q = ~~(rand() * heartPointsCount);
            } else {
                if (rand() > 0.99) u.D *= -1;
                u.q = (u.q + u.D) % heartPointsCount;
                if (u.q < 0) u.q += heartPointsCount;
            }
        }

        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;

        // Ограничение по границам канваса
        u.trace[0].x = Math.max(0, Math.min(u.trace[0].x, width));
        u.trace[0].y = Math.max(0, Math.min(u.trace[0].y, height));

        u.vx *= u.force;
        u.vy *= u.force;

        for (var k = 0; k < u.trace.length - 1; k++) {
            var T = u.trace[k];
            var N = u.trace[k + 1];
            N.x -= config.traceK * (N.x - T.x);
            N.y -= config.traceK * (N.y - T.y);
        }

        ctx.fillStyle = u.f;
        u.trace.forEach((t) => ctx.fillRect(t.x, t.y, 1, 1));
    }

    drawFirstText(ctx, canvas);
    drawSecondText(ctx, canvas);
    drawThText(ctx, canvas);
    drawFText(ctx, canvas);
    window.requestAnimationFrame(loop, canvas);
  }

  loop();
}
document.addEventListener("DOMContentLoaded", function () {
  init();

});

