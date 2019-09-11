(function () {
   var root = this;
   var PixiCircle = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      pointer.color = !pointer.color ? 0xFFFFFF : pointer.color;
      let graphics = new PIXI.Graphics()
      pointer.stage.addChild(graphics);
      graphics.beginFill(pointer.color);
      graphics.lineStyle(0, 0xffd900, 0);
      graphics.drawCircle(0, 0, pointer.radius);
      graphics.endFill();
      graphics.position.x = pointer.x;
      graphics.position.y = pointer.y;
      pointer.vector = false;
      pointer.node = graphics;
      pointer.node.nodeID = $pxx.common.uniquue();
      pointer.node.getID = function () {
         return pointer.node.nodeID;
      };
      if (options.bump_event) {
         options.bump_event = options.bump_event.bind(pointer);
      }
      let move = function (dt) {
         let current_circle_info = pointer.getCircleInfo();
         let picked = ksttool.calculate_coordinate(current_circle_info, current_circle_info.angle, current_circle_info.speed * dt, pixiKst.g_section, pixiKst.adv_dicts.moving_things, !true, { r: GAME_HEIGHT, v: RENDERER.height });
         if (pointer.getAngle() !== picked.next_angle_info) {
            pointer.setAngle(picked.next_angle_info);
            if (options.bump_event) {
               options.bump_event(picked);
            }
         }
         pointer.setPosition(picked.coordinate);
      };
      PIXI.Ticker.shared.add(move);
   };
   PixiCircle.prototype = {
      getNode: function () {
         return this.node;
      },
      getAngle: function () {
         return this.angle;
      },
      setPosition: function (pos) {
         this.getNode().x = pos.x;
         this.getNode().y = pos.y;
      },
      setAngle: function (angle) {
         this.angle = angle;
      },
      getCircleInfo: function () {
         let pointer = this;
         return {
            x: pointer.getNode().position.x,
            y: pointer.getNode().position.y,
            r: pointer.radius,
            r2: pointer.radius * 2,
            angle: pointer.angle,
            speed: pointer.speed,
         };
      }
   };
   root.PixiCircle = PixiCircle;
}).call(this);