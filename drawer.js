/*!
 * jquery-drawer v3.2.2
 * Flexible drawer menu using jQuery, iScroll and CSS.
 * http://git.blivesta.com/drawer
 * License : MIT
 * Author : blivesta <design@blivesta.com> (http://blivesta.com/)
 */

;(function umd(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function Drawer($) {
  'use strict';
  var namespace = 'drawer';
  var touches = typeof document.ontouchstart != 'undefined';
  var __ = {
    init: function init(options) {
      options = $.extend({
        iscroll: {
          mouseWheel: true,
          preventDefault: false
        },
        showOverlay: true
      }, options);

      __.settings = {
        state: false,
        events: {
          opened: 'drawer.opened',
          closed: 'drawer.closed'
        },
        dropdownEvents: {
          opened: 'shown.bs.dropdown',
          closed: 'hidden.bs.dropdown'
        }
      };

      __.settings.class = $.extend({
        nav: 'drawer-nav',
        toggle: 'drawer-toggle',
        overlay: 'drawer-overlay',
        open: 'drawer-open',
        close: 'drawer-close',
        dropdown: 'drawer-dropdown'
      }, options.class);

      return this.each(function instantiateDrawer() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);

        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, { options: options });

          __.refresh.call(_this);

          if (options.showOverlay) {
            __.addOverlay.call(_this);
          }

          $('.' + __.settings.class.toggle).on('click.' + namespace, function toggle() {
            __.toggle.call(_this);
            return _this.iScroll.refresh();
          });

          $(window).on('resize.' + namespace, function close() {
            __.close.call(_this);
            return _this.iScroll.refresh();
          });

          $('.' + __.settings.class.dropdown)
            .on(__.settings.dropdownEvents.opened + ' ' + __.settings.dropdownEvents.closed, function onOpenedOrClosed() {
              return _this.iScroll.refresh();
            });
        }

      }); // end each
    },

    refresh: function refresh() {
      this.iScroll = new IScroll(
        '.' + __.settings.class.nav,
        $(this).data(namespace).options.iscroll
      );
    },

    addOverlay: function addOverlay() {
      var $this = $(this);
      var $overlay = $('<div>').addClass(__.settings.class.overlay + ' ' + __.settings.class.toggle);

      return $this.append($overlay);
    },

    toggle: function toggle() {
      var _this = this;

      if (__.settings.state) {
        return __.close.call(_this);
      } else {
        return __.open.call(_this);
      }
    },

    open: function open() {
      var $this = $(this);

      if (touches) {
        $this.on('touchmove.' + namespace, function disableTouch(event) {
          event.preventDefault();
        });
      }

      return $this
        .removeClass(__.settings.class.close)
        .addClass(__.settings.class.open)
        .drawerCallback(function triggerOpenedListeners() {
          __.settings.state = true;
          $this.trigger(__.settings.events.opened);
        });
    },

    close: function close() {
      var $this = $(this);

      if (touches) $this.off('touchmove.' + namespace);

      return $this
        .removeClass(__.settings.class.open)
        .addClass(__.settings.class.close)
        .drawerCallback(function triggerClosedListeners() {
          __.settings.state = false;
          $this.trigger(__.settings.events.closed);
        });
    },

    destroy: function destroy() {
      return this.each(function destroyEach() {
        var _this = this;
        var $this = $(this);
        $('.' + __.settings.class.toggle).off('click.' + namespace);
        $(window).off('resize.' + namespace);
        $('.' + __.settings.class.dropdown).off(__.settings.dropdownEvents.opened + ' ' + __.settings.dropdownEvents.closed);
        _this.iScroll.destroy();
        $this
          .removeData(namespace)
          .find('.' + __.settings.class.overlay)
          .remove();
      });
    }

  };

  $.fn.drawerCallback = function drawerCallback(callback) {
    var end = 'transitionend webkitTransitionEnd';
    return this.each(function setAnimationEndHandler() {
      var $this = $(this);
      $this.on(end, function invokeCallbackOnAnimationEnd() {
        $this.off(end);
        return callback.call(this);
      });
    });
  };

  $.fn.drawer = function drawer(method) {
    if (__[method]) {
      return __[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return __.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

}));

$(function(){
    $(window).scroll(function (){
        $('.fadein').each(function(){
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight + 200){
                $(this).addClass('scrollin');
            }
        });
    });
});

$(function(){
    $(window).load(function(){
        var setElm = $('.viewer'),
        setMaxWidth = 1100,
        setMinWidth = 320,
        fadeSpeed = 3000,
		switchDelay = 2000,
		sideNavi = 'off', // 'on' or 'off'
        sideHide = 'hide', // 'hide' or 'show'
        naviOpc = 0.5;
 
			setElm.each(function(){
            var targetObj = $(this),
            findUl = targetObj.find('ul'),
            findLi = targetObj.find('li'),
            findLiFirst = targetObj.find('li:first');
 
            findLi.css({display:'block',opacity:'0',zIndex:'99'});
            findLiFirst.css({zIndex:'100'}).stop().animate({opacity:'100'},fadeSpeed);
 
            function timer(){
                setTimer = setInterval(function(){
                    slideNext();
                },switchDelay);
            }
            timer();
 
            function slideNext(){
                findUl.find('li:first-child').not(':animated').animate({opacity:'0'},fadeSpeed).next('li').css({zIndex:'100'}).animate({opacity:'1'},fadeSpeed).end().appendTo(findUl).css({zIndex:'99'});
            }
            function slidePrev(){
                findUl.find('li:first-child').not(':animated').css({zIndex:'99'}).animate({opacity:'0'},fadeSpeed).siblings('li:last-child').css({zIndex:'100'}).animate({opacity:'1'},fadeSpeed).prependTo(findUl);
            }
            targetObj.css({width:setMaxWidth,display:'block'});
 
            // メイン画像をベースにエリアの幅と高さを設定
            var setLiImg = findLi.find('img'),
            baseWidth = setLiImg.width(),
            baseHeight = setLiImg.height();
 
            // レスポンシブ動作メイン
            function imgSize(){
                var windowWidth = parseInt($(window).width());
                if(windowWidth >= setMaxWidth) {
                    targetObj.css({width:setMaxWidth,height:baseHeight});
                    findUl.css({width:baseWidth,height:baseHeight});
                    findLi.css({width:baseWidth,height:baseHeight});
                } else if(windowWidth < setMaxWidth) {
                    if(windowWidth >= setMinWidth) {
                        targetObj.css({width:'100%'});
                        findUl.css({width:'100%'});
                        findLi.css({width:'100%'});
                    } else if(windowWidth < setMinWidth) {
                        targetObj.css({width:setMinWidth});
                        findUl.css({width:setMinWidth});
                        findLi.css({width:setMinWidth});
                    }
                    var reHeight = setLiImg.height();
                    targetObj.css({height:reHeight});
                    findUl.css({height:reHeight});
                    findLi.css({height:reHeight});
                }
            }
            $(window).resize(function(){imgSize();}).resize();
 
        });
    });
});
