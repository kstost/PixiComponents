/*
-------------------------------------------------------
ksttool 에 대한 의존이 있음
*/
(function () {
   var root = this;
   var PixiPolygon = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      pointer.surface_color = pointer.surface_color ? pointer.surface_color : 0x00FF00;
      pointer.line_color = pointer.line_color ? pointer.line_color : 0xffd900;
      let graphics = new PIXI.Graphics();
      (pointer.stage || pointer.parent).addChild(graphics);
      pointer.node = graphics;
      pointer.redraw(pointer.path, pointer.surface_color, true);
      pointer.vector = false;
      pointer.node.nodeID = $pxx.common.uniquue();
      pointer.node.getID = function () {
         return pointer.node.nodeID;
      };
   };
   PixiPolygon.prototype = {
      init: function () {
      },
      redraw: function (path, surface_color, reposition) {
         let pointer = this;
         pointer.path = path;
         pointer.surface_color = surface_color;
         pointer.extracted_path = ksttool.extract_XYX(path, { x: 0.5, y: 0.5 });
         pointer.node.clear();
         pointer.node.beginFill(surface_color);
         pointer.node.lineStyle(0, pointer.line_color, 0);
         pointer.node.moveTo(pointer.extracted_path.path[0].x, pointer.extracted_path.path[0].y);
         for (let i = 1; i < pointer.extracted_path.path.length; i++) {
            pointer.node.lineTo(pointer.extracted_path.path[i].x, pointer.extracted_path.path[i].y);
         }
         if (reposition) {
            pointer.node.position.set(pointer.extracted_path.min_x, pointer.extracted_path.min_y);
         }
         pointer.node.closePath();
         pointer.node.endFill();
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

/*
-------------------------------------------------------
*/