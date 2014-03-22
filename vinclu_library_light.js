// forked from t_furu's "VincluLed ライブラリ" http://jsdo.it/t_furu/pSYz
var VincluLed = function( frequencyL , frequencyR ){

    //AudioContextを作成
    this.isOn = false;
    this.audio_context = null;
    this.audio_node = null;

    this.frequencyL = frequencyL;
    this.frequencyR = frequencyR;

    this.gain_node = null;
    this.isBlink = false;

    this.init = function(){
        this.audio_context = new webkitAudioContext();
	//44100 は変更しない事
        this.audio_context.samplingRate = 44100;
    };

    //再生する音のバッファーを作成する
    this.createAudioDataBuffer = function(context,frequencyL,frequencyR){
        var s = context.samplingRate * 2;
        var buffer = context.createBuffer(2, s, context.samplingRate);
        var audioDataL = buffer.getChannelData(0);
        var audioDataR = buffer.getChannelData(1);
        for(var i = 0; i < audioDataL.length; i++){
            var l = Math.sin(2 * Math.PI * frequencyL * i / context.samplingRate);
            var r = Math.sin(2 * Math.PI * frequencyR * i / context.samplingRate);
            audioDataL[i] = l;
            audioDataR[i] = r*-1;
        }
        return buffer;
    };

    //明るさ調整
    this.setBrightness = function(volume){
        if(this.gain_node == null){
            this.gain_node = this.audio_context.createGainNode();
            this.audio_node.connect(this.gain_node);
            this.gain_node.connect(this.audio_context.destination);
        }
        this.gain_node.gain.value = volume;
    }

    //LEDの電源をON
    this.on = function(){
        if(this.audio_node !== null){
            return;
        }
        console.log('on');
        this.isOn = true;


        //バッファーを設定
        this.audio_node = this.audio_context.createBufferSource();
        this.audio_node.buffer = this.createAudioDataBuffer(this.audio_context,this.frequencyL,this.frequencyR);
        this.audio_node.loop = true;
        this.audio_node.connect(this.audio_context.destination);

        this.audio_node.noteOn(0);
    };

    //LEDの電源をOFF
    this.off = function( ){
        if( this.isOn ){
            console.log('off');
            this.isOn = false;
            this.audio_node.noteOff(0);
            this.audio_node = null;
            this.gain_node = null;
        }
    };

    //ブリンクの実装
    this.blinkOn = function( interval ){
        if(this.isBlink == false){
            this.isBlink = true;
            //LED 点灯
            this.on();
            var v = 0,i= 0.1;
            var fnc = function(){
                v -= i;
                if(v <= -0.5) i = -0.1;
                else if(v >= 0.0) i = 0.1;
                //明るさ調整
                this.setBrightness(v);
            };
            this.blinkTimer = setInterval($.proxy(fnc,this),interval);
    	}
    }

    this.blinkOff = function(){
    	//LED 消灯
        this.isBlink = false;
        clearInterval(this.blinkTimer);
        this.off();
    }

    //初期化
    this.init();
};