// forked from t_furu's "VincluGeo 位置情報系" http://jsdo.it/t_furu/8Gss
/** vinclu向け 位置情報系のラッパー
*
* 位置情報取得
* 二点間の距離
* 指定地点の方向 (平面 地図上
*
*
**/
var VincluGeo = function(){

    //位置情報 監視中かの確認
    this.geoWatchID = undefined;

    //初期化
    this.init = function(){

    };

    /** 位置情報の監視を開始
    *
    *    callback 位置情報更新時に呼ばれるfunction を指定する
    *
    **/
    this. watchPosition = function( callback ){
        if(typeof this.geoWatchID != "undefined"){
            console.log( "位置情報の監視中" );
            return;
        }

        this.geoWatchID = navigator.geolocation.watchPosition(
            function(position){
                callback(position.coords.latitude,position.coords.longitude,position);
            });
    };

    /** 位置情報の取得をやめる
    *
    *  callback  停止処理後に呼ばれる function を設定する
    *
    **/
    this.clearWatch = function(callback){
        navigator.geolocation.clearWatch( this.geoWatchID );
        this.geoWatchID = undefined;
        if(typeof callback != "undefined"){
            callback();
        }
    };

    /** 二点間の距離を調べる
    *
    *
    *  http://prog47.blogdns.org/blog/index.php?e=283
    *
    **/
    this.distance = function(position1,position2,decimal){
        var lat1 = position1.coords.latitude;
        var lng1= position1.coords.longitude;

        var lat2 = position2.coords.latitude;
        var lng2= position2.coords.longitude;

        // 引数　$decimal は小数点以下の桁数
        if( (Math.abs(lat1-lat2) < 0.00001) && (Math.abs(lng1-lng2) < 0.00001) ){
            distance = 0;
        }
        else{
            lat1 = lat1*Math.PI/180;
            lng1 = lng1*Math.PI/180;
            lat2 = lat2*Math.PI/180;
            lng2 = lng2*Math.PI/180;

            A = 6378140;
            B = 6356755;
            F = (A-B)/A;

            P1 = Math.atan((B/A)*Math.tan(lat1));
            P2 = Math.atan((B/A)*Math.tan(lat2));


            X = Math.acos( Math.sin(P1)*Math.sin(P2) + Math.cos(P1)*Math.cos(P2)*Math.cos(lng1-lng2) );
            L	= (F/8)*( (Math.sin(X)-X)*Math.pow((Math.sin(P1) + Math.sin(P2)),2)/Math.pow(Math.cos(X/2) ,2)
                    - (Math.sin(X)-X)*Math.pow(Math.sin(P1)-Math.sin(P2),2)/Math.pow(Math.sin(X),2) );

            distance = A*(X+L);
            decimal_no = Math.pow(10,decimal);
            distance = Math.round(decimal_no*distance/1000)/decimal_no;
        }

        //
        //format='%0.'+decimal+'f';
        //return sprintf(format,distance);
        //

        return distance;
    };

    /** 方向
    *
    *
    *
    **/
    this.dir = function(position1,position2){
        var lat1 = position1.coords.latitude;
        var lng1= position1.coords.longitude;

        var lat2 = position2.coords.latitude;
        var lng2= position2.coords.longitude;

        // 緯度経度$lat1,$lng1 の点を出発として、緯度経度$lat2,$lng2への方位
        // 北を０度で右回りの角度０～３６０度
        Y = Math.cos(lng2*Math.PI/180) * Math.sin(lat2*Math.PI/180 - lat1*Math.PI/180);
        X = Math.cos(lng1*Math.PI/180) * Math.sin(lng2*Math.PI/180) - Math.sin(lng1*Math.PI /180) * Math.cos(lng2*Math.PI/180) * Math.cos(lat2*Math.PI/180 - lat1*Math.PI/180);
        dirE0 = 180*Math.atan2(Y, X)/Math.PI;	// 東向きが０度の方向
        if(dirE0 < 0){
            dirE0 = dirE0+360;	//0～360 にする。
        }

        //(dirE0+90)÷360の余りを出力 北向きが０度の方向
        dirN0 = (dirE0+90) % 360;
        return dirN0;
    };

    this.init();
};