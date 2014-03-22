// forked from kakeru8's "2014-03-22 1st" http://jsdo.it/kakeru8/rVnM
$(function(){
    // http://express.heartrails.com/api.html
    var prefecture = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
    for(var i in prefecture) {
        $('#prefecture').append($('<option>')
                        .html(prefecture[i])
                        .val(i));
        if (i == 12) {
            $('#prefecture option').attr("selected", true);
        }
    }

    // 観光名所の緯度／経度
    $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?callback=?',
              {
                  address: '東京タワー',
                  sensor: 'false'
              },
              function(data) {
                  console.log(data);
              }
    );


});

