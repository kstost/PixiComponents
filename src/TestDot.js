(function () {
   var root = this;
   var TestDot = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      pointer.color = !pointer.color ? 0xFFFFFF : pointer.color;
      let graphics = new PIXI.Graphics(); // http://jsfiddle.net/cE7F8/1/
      pointer.parent.addChild(graphics);
      graphics.beginFill(pointer.color);
      graphics.drawCircle(0, 0, pointer.radius);
      graphics.endFill();
      graphics.position.x = pointer.x;
      graphics.position.y = pointer.y;
      $pxx.common.make_blink(graphics, 10);
   };
   TestDot.prototype = {
   };
   root.TestDot = TestDot;
}).call(this);