(function () {
   var root = this;
   var PixiLine = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      if (!pointer.vector) {
         pointer.vector = {
            first: { x: 0, y: 0 },
            second: { x: 0, y: 0 },
         };
      }
      pointer.setPadding(pointer.padding === undefined ? 1 : pointer.padding, true);
      pointer.setColor(pointer.color === undefined ? 0xffffff : pointer.color, true);
      pointer.line = new PixiPolygon({ path: [{ x: 0, y: 0 }], parent: pointer.stage, surface_color: pointer.color });
      pointer.redraw();
      // --
      if (false) {
         for (let i = 0, len = line_square.length; i < len; i++) {
            testDot(line_square[i].x, line_square[i].y);
         }
         testDot(start.x, start.y, 0xFFFFFF);
         testDot(end.x, end.y, 0xFFFFFF);
      }
      // --
   };
   PixiLine.prototype = {
      cutting_calculator: function (sl, pl) {
         let tr = this.trim;
         let list_neev = [];
         let vect = pl.getVector();
         let lnn = [];
         for (let i = 0, len = sl.length; i < len; i++) {
            let samg = sl[i];
            let lnn_ = samg.getWorldPathInPLPType();
            for (let i2 = 0, len2 = lnn_.length; i2 < len2; i2++) {
               let pp = lnn_[i2];
               if (tr) {
                  if (!(tr.first.x === pp.first.x && tr.first.y === pp.first.y && tr.second.x === pp.second.x && tr.second.y === pp.second.y)) {
                     lnn[lnn.length] = pp;
                  }
               } else {
                  lnn[lnn.length] = pp;
               }
            }
         }
         for (let i = 0, len = lnn.length; i < len; i++) {
            let intersect = ksttool.check_intersection_line_line(lnn[i], vect, true);
            if (intersect) {
               list_neev[list_neev.length] = {
                  body: lnn[i],
                  coordinate: intersect
               }
            }
         }
         let list_need = ksttool.math.sort_list_by_distance(list_neev, vect.first);
         let pol = (pl.getLineShape());
         if (list_need.length > 0) {
            let grp = PixiLine.getGRP(pol, list_need[0].body);
            if (grp) {
               let points = [];
               for (let i = 0, len = grp.length; i < len; i++) {
                  let read = ksttool.extract_XYX(grp[i], { x: 0.5, y: 0.5 });
                  points[points.length] = {
                     coordinate: { x: read.min_x, y: read.min_y },
                     body: grp[i]
                  };
               }
               let list_need2 = ksttool.math.sort_list_by_distance(points, vect.first);
               let split_shape = list_need2[0].body;
               return {
                  ss: split_shape,
                  inl: list_need[0].body,
                  coordinate: list_need[0].coordinate,
               };
            } else {
               console.log('no..');
            }
         }
      },
      vector_length: function () {
         let pointer = this;
         return ksttool.math.get_distance_between_two_point(pointer.vector.first, pointer.vector.second);
      },
      cutting: function (sl) {
         // let samg = sl[0];
         let pointer = this;
         let split_shape = pointer.cutting_calculator(sl, pointer);
         if (split_shape && split_shape.ss) {
            let incidenceAngle = ksttool.math.get_angle_in_radian_between_two_points(pointer.vector.first, pointer.vector.second);
            let surfaceAngle = ksttool.math.get_angle_in_radian_between_two_points(split_shape.inl.second, split_shape.inl.first);
            //----
            // 반사각 계산
            let full_circle = Math.PI * 2;
            let mid_result = surfaceAngle * 2 - incidenceAngle;
            let refangl = mid_result >= full_circle ? mid_result - full_circle : mid_result < 0 ? mid_result + full_circle : mid_result;
            //----
            let splited_len = pointer.vector_length() - ksttool.math.get_distance_between_two_point(pointer.vector.first, split_shape.coordinate);
            let endf = ksttool.math.get_coordinate_distance_away_from_center_with_radian(splited_len, split_shape.coordinate, refangl);
            // pointer.line.redraw(split_shape.ss, pointer.color, true);
            pointer.physically_draw(split_shape.ss, pointer.color);
            return {
               surface_vector: split_shape.inl,
               reflect_vector: {
                  first: split_shape.coordinate,
                  second: endf,
               },
            };
         }
      },
      getVector: function () {
         return this.vector;
      },
      setFirst: function (first, nodraw) {
         this.vector.first = first;
         if (!nodraw) { this.redraw(); }
      },
      setSecond: function (second, nodraw) {
         this.vector.second = second;
         if (!nodraw) { this.redraw(); }
      },
      setPadding: function (padding, nodraw) {
         this.padding = padding;
         if (!nodraw) { this.redraw(); }
      },
      setColor: function (color, nodraw) {
         this.color = color;
         if (!nodraw) { this.redraw(); }
      },
      getLineShape: function () {
         let pointer = this;
         return pointer.lineShape;
      },
      physically_draw: function (path, color) {
         let pointer = this;
         if (pointer.line) {
            if (pointer.trim) {
               let points = [];
               let grp = PixiLine.getGRP(path, pointer.trim);
               if (grp) {
                  for (let i = 0, len = grp.length; i < len; i++) {
                     let read = ksttool.extract_XYX(grp[i], { x: 0.5, y: 0.5 });
                     points[points.length] = {
                        coordinate: { x: read.min_x, y: read.min_y },
                        body: grp[i]
                     };
                  }
               }
               if (points.length) {
                  let list_need2 = ksttool.math.sort_list_by_distance(points, pointer.vector.second);
                  path = list_need2[0].body;
               }
            }
            pointer.line.redraw(path, color, true);
         }
      },
      redraw: function () {
         let pointer = this;
         if (pointer.line) {
            let padding = pointer.padding;
            let start = pointer.vector.first;
            let end = pointer.vector.second;
            let radi = Math.atan2(start.y - end.y, start.x - end.x);
            let line_square = [];
            let vdgh = ksttool.math.get_coordinate_distance_away_from_center_with_radian(padding, end, radi);
            let dist = (padding * 2) + ksttool.math.get_distance_between_two_point(start, end);
            line_square[line_square.length] = ksttool.math.get_coordinate_distance_away_from_center_with_radian(padding, vdgh, radi + (Math.PI / 2));
            line_square[line_square.length] = ksttool.math.get_coordinate_distance_away_from_center_with_radian(padding, vdgh, radi - (Math.PI / 2));
            line_square[line_square.length] = ksttool.math.get_coordinate_distance_away_from_center_with_radian(dist, line_square[line_square.length - 1], radi - Math.PI);
            line_square[line_square.length] = ksttool.math.get_coordinate_distance_away_from_center_with_radian(dist, line_square[line_square.length - 3], radi - Math.PI);
            pointer.lineShape = line_square;
            pointer.physically_draw(line_square, pointer.color);
            // pointer.line.redraw(line_square, pointer.color, true);
         }
      },
      remove: function () {
         if (false) {
            this.line.node.parent.removeChild(this.line.node);
         }
         this.line.node.alpha = 0;
         PixiLine.objectPool[PixiLine.objectPool.length] = this;
      }
   };
   PixiLine.objectPool = [];
   PixiLine.getGRP = function (path, trim) {
      let grp = ksttool.divide_polygon(path, [trim.first, trim.second]);
      if (!grp) {
         let afeae = ksttool.reset_length_of_vector_from_mid(100000, trim);
         grp = ksttool.divide_polygon(path, [afeae.first, afeae.second]);
      }
      return grp;
   };
   PixiLine.getSleepingInstance = (function () {
      let picked = this.objectPool.length ? this.objectPool.splice(0, 1)[0] : null;
      if (picked) {
         picked.line.node.alpha = 1;
      }
      return picked;
   }).bind(PixiLine);
   root.PixiLine = PixiLine;
}).call(this);

