(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

    /**
    *  browserify modules dependencies
    **/
    var EventEmitter = require('../utils/event'),
        extend       = require('../utils/extend'),
        Kiwapp       = window.Kiwapp;

    /**
     * Wrapper for Kiwapp native API calls
     */
    var launch = function launch(name,data) {
        Kiwapp.driver().trigger('callApp', {
            call: name,
            data: data
        });
    };

    /**
     * KWPlayer allows you to run some media on Android or iOS device. It calls native controls and player for these OS.
     * @param {Object} o Configuration for a new native player [origin_x,origin_y,width,height]
     */
    function KWPlayer(o) {
        EventEmitter.call(this);
        this.version = require('./version');
        eventsListening(this);
        
        launch('player_video_init', extend({}, {
            origin_x : '',
            origin_y : '',
            width    : window.innerWidth,
            height   : window.innerHeight
        },o));
    }

    /**
     * EventEmitter interface
     */
    KWPlayer.prototype = Object.create(EventEmitter.prototype);

    /**
     * Play the media
     *  - event  KWPlayer:play
     * @param  {String} videoPath path to the file
     * @param  {Integer} start    Start time [optionnal]
     * @param  {Integer} n         How many times do we play this media ? [optionnal]
     * @return {KWPlayer}
     */
    KWPlayer.prototype.play = function(videoPath, start, n) {
        Kiwapp.log('[JS@KWPlayer] Play a video : ' + videoPath);
        launch('video_play', {
            file_path  : videoPath,
            time_start : start || 0,
            nb_to_play : n || 1,
        });
        this.trigger('KWPlayer:play',{});
        return this;
    };

    /**
     * Pause the media
     *  - event  KWPlayer:pause
     * @return {KWPlayer}
     */
    KWPlayer.prototype.pause = function() {
        Kiwapp.log('[JS@KWPlayer] Pause the current video');
        launch('video_pause');
        this.trigger('KWPlayer:pause',{});
        return this;
    };

    /**
     * Resume the media
     *  - event  KWPlayer:resume
     * @return {KWPlayer}
     */
    KWPlayer.prototype.resume = function() {
        Kiwapp.log('[JS@KWPlayer] Resume the current video');
        launch('video_resume');
        this.trigger('KWPlayer:resume',{});
        return this;
    };

    /**
     * Stop the media
     *  - event  KWPlayer:stop
     * @return {KWPlayer}
     */
    KWPlayer.prototype.stop = function() {
        Kiwapp.log('[JS@KWPlayer] Stop the current video');
        launch('video_stop');
        this.trigger('KWPlayer:stop',{});
        return this;
    };

    /**
     * Modify the sound for the current player
     * Set a value between 0 - 100. Default is 50
     * @param  {Integer} value sound level
     * @return {KWPlayer}
     */
    KWPlayer.prototype.sound = function(value) {
        Kiwapp.log('[JS@KWPlayer] Update the sound to ' + value/100);
        launch('set_volume',{value : value/100});
        return this;
    };

    /**
     * [Private] Active events listening for KWPlayer instance
     * @param  {KWPlayer} self Instance listening events
     * @return {undefined}   Return undefined
     */
    function eventsListening(self){
        Kiwapp.driver().on('videoDidFinish', function(path){
            Kiwapp.log('[JS@KWLinea] Video '+path+' is finished.');
            self.trigger('KWPlayer:finish', path);
        });
    }

    /**
     * add KWPlayer to window
     * @type {KWPlayer}
     */
    window.KWPlayer = KWPlayer;
    module.exports = KWPlayer;
})();

},{"../utils/event":3,"../utils/extend":4,"./version":2}],2:[function(require,module,exports){
module.exports = '1.1.3';

},{}],3:[function(require,module,exports){
'use strict';
(function(){
    function EventEmitter(){
        this.events = {};
    }

    EventEmitter.prototype.on = function(eventName, callback, instance) {

        if(!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({callback : callback, instance : instance});
    };

    EventEmitter.prototype.trigger = function(events) {

        var args = Array.prototype.slice.call(arguments);
        args.shift();

        if(!Array.isArray(events)) {
            events = [events];
        }

        for(var i = 0; i < events.length; i++) {

            var eventName = events[i],
                splitName = eventName.split('*');

            if(splitName.length <= 1){
                if(!this.events[eventName]) {
                    continue;
                }

                for(var o = 0; o < this.events[eventName].length; o++) {
                    this.events[eventName][o].callback.apply(this.events[eventName][o].instance , args);
                }

            } else{
                for(var x in this.events) {

                    if(x.indexOf(splitName[1]) > -1) {
                        eventName = x;

                        for(var u = 0; u < this.events[eventName].length; u++) {
                            this.events[eventName][u].callback.apply(this.events[eventName][u].instance, args);
                        }
                    }
                }
            }
        }
    };

    module.exports = EventEmitter;
})();
},{}],4:[function(require,module,exports){
'use strict';
(function(){
    /**
     * A method which imitate jQuery extend method
     * @return {object} The concat final object
     */
    module.exports = function extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };
})();
},{}]},{},[1]);