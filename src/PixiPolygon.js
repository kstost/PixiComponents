(function () {
   var root = this;
   var PixiPolygon = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      pointer.extracted_path = ksttool.extract_XYX(pointer.path, { x: 0.5, y: 0.5 });
      pointer.surface_color = pointer.surface_color ? pointer.surface_color : 0x00FF00;
      let graphics = new PIXI.Graphics();
      (pointer.stage || pointer.parent).addChild(graphics);
      graphics.beginFill(pointer.surface_color);
      graphics.lineStyle(0, 0xffd900, 0);
      graphics.moveTo(pointer.extracted_path.path[0].x, pointer.extracted_path.path[0].y);
      for (let i = 1; i < pointer.extracted_path.path.length; i++) {
         graphics.lineTo(pointer.extracted_path.path[i].x, pointer.extracted_path.path[i].y);
      }
      graphics.closePath();
      graphics.endFill();
      graphics.position.set(pointer.extracted_path.min_x, pointer.extracted_path.min_y);
      pointer.vector = false;
      pointer.node = graphics;
      pointer.node.nodeID = $pxx.common.uniquue();
      pointer.node.getID = function () {
         return pointer.node.nodeID;
      };
   };
   PixiPolygon.prototype = {
      init: function () {
      },
      getWorldPathInPLPType: function () {
         let pointer = this;
         let rotation = pointer.getNode().rotation;
         if (pointer.pathCache !== undefined && pointer.pathCache.rotation === rotation) {
            return pointer.pathCache.path;
         }
         let rst = null;
         let pivot_point = { x: pointer.extracted_path.min_x, y: pointer.extracted_path.min_y };
         let rt = [];
         pointer.path.forEach(pin => {
            let cc = ksttool.math.rotation_coordinate(pivot_point, {
               x: pin.x,
               y: pin.y
            }, ksttool.math.convert_radian_to_degrees(rotation), !true);
            rt[rt.length] = cc;
         });
         rst = ksttool.convert_XYX_to_PLP(rt);
         pointer.pathCache = {
            rotation: rotation,
            path: rst
         };
         return rst;
      },
      is_vector: function () {
         return this.vector;
      },
      getNode: function () {
         return this.node;
      },
   };
   root.PixiPolygon = PixiPolygon;
}).call(this);


