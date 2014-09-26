$(function () {
    // variables
    var $window, gardenCtx, gardenCanvas, $garden, garden;
    var $clientWidth, $clientHeight;
    var $loveHeart, $code, $content;
    var $offsetX, $offsetY;
    //judge enable
    if (!document.createElement('canvas').getContext) {
        alert('your brower is a shit.');
        return;
    }
    // setup garden
    $window = $(window);
    $code = $("#code");
    $garden = $("#garden");
    $content = $("#content");
    $loveHeart = $("#loveHeart");

    $clientWidth = $window.width();
    $clientHeight = $window.height();
    $offsetX = $loveHeart.width() / 2;
    $offsetY = $loveHeart.height() / 2 - 55;
    gardenCanvas = $garden[0];
	gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    $content.css("width", $loveHeart.width() + $code.width());
    $content.css("height", Math.max($loveHeart.height(), $code.height()));
    $content.css("margin-top", Math.max(($window.height() - $content.height()) / 2, 10));
    $content.css("margin-left", Math.max(($window.width() - $content.width()) / 2, 10));

    $window.resize(function() {
        var newWidth = $window.width();
        var newHeight = $window.height();
        if (newWidth != $clientWidth && newHeight != $clientHeight) {
            location.replace(location);
        }
    });

    function getHeartPoint(angle) {
        var t = angle / Math.PI;
        var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
        var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return [$offsetX + x, $offsetY + y];
    }

    function startHeartAnimation() {
        var interval = 200;
        var angle = 10;
        var heart = [];
        (function anim() {
            var animationTimer = setTimeout(function () {
                var bloom = getHeartPoint(angle);
                var draw = true;
                for (var i = 0; i < heart.length; i++) {
                    var p = heart[i];
                    var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
                    if (distance < Garden.options.bloomRadius.max * 1.3) {
                        draw = false;
                        break;
                    }
                }
                if (draw) {
                    heart.push(bloom);
                    garden.createRandomBloom(bloom[0], bloom[1]);
                }
                if (angle >= 30) {
                    clearTimeout(animationTimer);
                    return 0;
                } else {
                    angle += 0.2;
                }
                anim();
            }, interval);
        })();

    }

    function timeElapse(date){
        var current = new Date();
        var seconds = (Date.parse(current) - Date.parse(date) ) / 1000;
        var days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        var hours = Math.floor(seconds / 3600);
        if (hours < 10) {
            hours = "0" + hours;
        }
        seconds = seconds % 3600;
        var minutes = Math.floor(seconds / 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        seconds = seconds % 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
        $("#elapseClock").html(result);
    }

    function adjustWordsPosition() {
        var word = $('#words');
        word.css("position", "absolute");
        word.css("top", $garden.position().top + 195);
        word.css("left", $garden.position().left + 70);
    }

    function showMessages() {
        adjustWordsPosition();
        $('#messages').fadeIn(3000);
    }

    function showLove() {
        $('#loveu').fadeIn(3000);
    }

    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this),
                str = $ele.html(),
                len = str.length;
            progress = 0;
            $ele.html('');
            (function typeIn() {
                var timer = setTimeout(function() {
                    var current = str.substr(progress, 1);
                    if (current == '<') {
                        progress = str.indexOf('>', progress) + 1;
                    }  else {
                        progress++;
                    }
                    if (progress == 714) {
                        progress++;
                        showMessages();
                        setTimeout(function() {
                            typeIn();
                        }, 6000);
                    } else {

                        $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                        if (progress >= len) {
                            clearTimeout(timer);
                            showLove();
                            return;
                        }
                        typeIn();
                    }

                }, 100);
            })();
        });
        return this;
    };

    function flowerRender() {
        setTimeout(function() {
            garden.render();
            flowerRender();
        }, Garden.options.growSpeed);
    }

    function initAnim() {
        var together = new Date();
        together.setFullYear(2012,4,10);
        together.setHours(14);
        together.setMinutes(0);
        together.setSeconds(0);
        together.setMilliseconds(0);
        //codes
        $code.fadeIn(3000);
        $code.typewriter();

        setTimeout(function () {
            flowerRender();
            startHeartAnimation();
        }, 8000);

        (function meetTime() {
            setTimeout(function () {
                timeElapse(together);
                meetTime();
            }, 500);
        })();
    }

    $('.bgm').bind('canplaythrough', function(e){
        //init anim
        initAnim();
    });
});
