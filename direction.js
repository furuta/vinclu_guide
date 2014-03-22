// forked from Rei.Matsushita's "うぃんくるはっかそん 途中" http://jsdo.it/Rei.Matsushita/gUQF
$(function(){
    function getParam() {
        var url   = location.href;
        var parameters    = url.split("?");
        var params   = parameters[1].split("&");
        var paramsArray = [];
        for ( i = 0; i < params.length; i++ ) {
            neet = params[i].split("=");
            paramsArray.push(neet[0]);
            paramsArray[neet[0]] = neet[1];
        }
        return paramsArray;
    }

    // 目的地情報。暫定でハードコーディング　とりあえず東京タワー
    var targetPos = {
        lat:35.65861,
        lng:139.745447
    };
    // 改善。GETパラメータで設定
    var param = getParam();
    if (param.lat) {
        targetPos.lat = param.lat;
    };
    if (param.lng) {
        targetPos.lng = param.lng;
    };
console.log(targetPos);
    var targetLatLng = new google.maps.LatLng(targetPos.lat, targetPos.lng);

    // ウィンクルガイドコンストラクタ
    function VincluGuide(lat, lng){
        this.iniLat = lat;          // 初期位置（緯度）
        this.iniLng = lng;          // 初期位置（経度）
        this.currentLat = lat;      // 現在位置（緯度）
        this.currentLng = lng;      // 現在位置（経度）
        this.stepList = [];         // 目的地までのステップ情報
        this.targetLatLng;          // 次の目的地までの座標インスタンス
        this.targetStepIdx = 0;     // 次の目的地までのステップインデックス
    }

    // ウィンクルガイドインスタンス
    var vincluGuide;


    // 地図情報
    var map, marker;

    // 位置情報取得失敗時のメソッド
    function setError(e){
        alert("SOMETHING ERROR:"+e.PositionError);
    }

    // 初期処理
    function setInitialPos(position){

        var coords = position.coords;

        // ウィンクルガイドインスタンス作成
        vincluGuide = new VincluGuide(coords.latitude, coords.longitude);
console.dir(vincluGuide);
        // 対象までのルートを取得して目的地までのステップを保持
        var currentLatLng = new google.maps.LatLng(vincluGuide.iniLat, vincluGuide.iniLng);

         // 地図作成
        var mapdiv = document.getElementById('map_canvas'),
            myOptions = {
            zoom: 18,
            center: currentLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true
        };

        map = new google.maps.Map(mapdiv, myOptions);
        // マーカーの表示
        marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: "うぃんくるがいど"
        });

        new google.maps.DirectionsService().route({
                origin: targetLatLng,
                destination: currentLatLng,
                provideRouteAlternatives:true,
                travelMode: google.maps.DirectionsTravelMode.WALKING
            }, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    var route = result.routes[0];
                    var leg = route.legs[0];
                    vincluGuide.stepList = leg.steps;
                    var location = leg.steps[0].end_location;
                    vincluGuide.targetLatLng = new google.maps.LatLng(location.A, location.k);
                }
console.dir(vincluGuide);

        });

    }

    // 位置更新メソッド
    function updatePos(position){

        console.dir(vincluGuide);

        // 現在地の情報を取得
        var coords = position.coords;
        vincluGuide.currentLat = coords.latitude;
        vincluGuide.currentLng = coords.longitude;

        // 現在地と目的のステップまでの距離を算出し、○以内なら次のステップへ
        var currentLatLng = new google.maps.LatLng(vincluGuide.currentLat, vincluGuide.currentLng);
        // マーカーのポジションを変更
        marker.position = currentLatLng;
        // マーカーをセット
        marker.setMap(map);

        //var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, vincluGuide.targetLatLng);

        // メートル単位でdistanceを取得
        // 次のステップ

        // 鳥光らせる
        console.log(vincluGuide.stepList);
       startLocation = vincluGuide.stepList[0];
       //endLocation = {coords:{latitude:json.routes[0].legs[0].end_location.lat,longitude:json.routes[0].legs[0].end_location.lng}};
       steps = vincluGuide.stepList;
       var geo = new VincluGeo();
        // 現在地
        var positionNow = {coords:{latitude:VincluGuide.currentLat,longitude:VincluGuide.currentLng}};
        var currentPosition = startLocation;
        // var distance = Math.sqrt(Math.pow(positionNow.coords.latitude - currentPosition..latitude)+Math.pow(positionNow.coords.longitude - currentPosition.coords.longitude));
        var distance = 10000;
        var nearLineIndex = 0;
        for (var i = 0; i < vincluGuide.stepList.length; i++) {
           var dis = getDistance(currentPosition.start_location.lat,currentPosition.start_location.lng,steps[i].start_location.lat,steps[i].start_location.lng,positionNow.coords.latitude,positionNow.coords.longitude);
           if (distance > dis) {
              nearLineIndex = i;
           };
           currentPosition = steps[i];
        };
        if (vincluGuide.stepList.length>0) {
            var position1 = {coords:{latitude:vincluGuide.stepList[nearLineIndex].start_location.A,longitude:vincluGuide.stepList[nearLineIndex].start_location.k}};
            var position2 = {coords:{latitude:vincluGuide.stepList[nearLineIndex].end_location.A,longitude:vincluGuide.stepList[nearLineIndex].end_location.k}};
            dirNo = geo.dir(position1,position2);
            $("#geo").html(dirNo);
        };
    }
    var startLocation;
    var endLocation;
    var steps;
    var compass;
    var led;
    var dirNo;
    var startFlag = false;

    function compass(e) {
        var heading = e.webkitCompassHeading;
        var comp = $("#comp");
        var seido = $("#seido");
        if (heading < 0) heading += 360;
        heading += window.orientation;
        comp.html(heading);
        seido.html(e.webkitCompassAccuracy);
        compass = heading;
        if (startFlag) {
          if (Math.abs(compass-dirNo)<10) {
             // 誤差5度未満なら鳥光る
             $("#tori").html("on");
             if (led) {
                led.on();
             };
          }else{
             $("#tori").html("off");
             if (led) {
                led.off();
             };
          };
        };
    }
    window.addEventListener('load', function() {
        window.addEventListener('deviceorientation', compass, false);
    }, false);

    // 線分と点の距離を返す
    function getDistance (ax, ay, bx, by, px, py) {
        var dx, dy, r2;
        var t, cx, cy;
        dx = bx - ax;
        dy = by - ay;
        if (dx == 0 && dy == 0)
        return Math.sqrt((px - ax) * (px - ax) + (py - ay) * (py - ay));
        r2 = dx * dx + dy * dy;
        t = (dx * (px - ax) + dy * (py - ay)) / r2;
        if (t < 0)
        return Math.sqrt((px - ax) * (px - ax) + (py - ay) * (py - ay));
        if (t > 1)
        return Math.sqrt((px - bx) * (px - bx) + (py - by) * (py - by));
        cx = (1 - t) * ax + t * bx;
        cy = (1 - t) * ay + t * by;
        return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
    }


    $(window).on("load", function(){

        // 初期位置を取得
        navigator.geolocation.getCurrentPosition(setInitialPos, setError);

        // 監視開始
        navigator.geolocation.watchPosition(updatePos, setError);

        $("#startBtn").on('click',function () {
          led = new VincluLed(100,10);
          led.on();
          //1秒後に停止
          setTimeout(function(){
             led.off();
             startFlag = true;
          },1000);
       })
    });
});