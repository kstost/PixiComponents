(function () {
   var root = this;
   var BendableLine = function (options) {
      var pointer = this;
      for (var key in options) { pointer[key] = options[key]; }
      let colliders = pointer.colliders;
      let mod_first = pointer.vector.first;
      let mod_second = pointer.vector.second;
      let line_color = pointer.color;
      let list = BendableLine.gen_bendable_line(null, mod_first, mod_second, line_color, pointer.parent, colliders, pointer.padding);
      pointer.list = list;
   };
   BendableLine.prototype = {
      setFirst: function (point) {
         let pointer = this;
         if (!(pointer.vector.first.x == point.x && pointer.vector.first.y == point.y)) {
            pointer.vector.first.x = point.x;
            pointer.vector.first.y = point.y;
            pointer.updateRedraw();
         }
      },
      setSecond: function (point) {
         let pointer = this;
         if (!(pointer.vector.second.x == point.x && pointer.vector.second.y == point.y)) {
            pointer.vector.second.x = point.x;
            pointer.vector.second.y = point.y;
            pointer.updateRedraw();
         }
      },
      updateRedraw: function (vector) {
         let pointer = this;
         if (vector) {
            pointer.vector = vector;
         }
         let colliders = pointer.colliders;
         let mod_first2 = pointer.vector.first;
         let mod_second2 = pointer.vector.second;
         let line_color2 = pointer.color;
         BendableLine.gen_bendable_line(pointer.list, mod_first2, mod_second2, line_color2, pointer.parent, colliders, pointer.padding);
      }
   };
   BendableLine.gen_bendable_line = function (list, mod_first, mod_second, line_color, parent, colliders, padding) {
      let rf = null;
      let cnt = 0;
      if (!list) {
         list = [];
      }
      while (true) {
         if (!list[cnt]) {
            let line_info = {
               stage: parent,
               padding: padding ? padding : 1,
            };
            list[cnt] = PixiLine.getSleepingInstance() || new PixiLine(line_info);
         }
         list[cnt].setColor(line_color, true);
         list[cnt].setPadding(padding, true);
         list[cnt].trim = rf ? rf.surface_vector : null;
         if (cnt === 0) {
            list[cnt].setFirst(mod_first, true);
            list[cnt].setSecond(mod_second);
         } else {
            list[cnt].setFirst(rf.reflect_vector.first, true);
            list[cnt].setSecond(rf.reflect_vector.second);
         }
         rf = list[cnt].cutting(colliders);
         cnt++;
         if (!rf) {
            break;
         }
      }
      while (true) {
         let fe = list.splice(cnt, 1)[0];
         if (fe) {
            fe.remove();
         } else {
            break;
         }
      }
      return list;
   };
   root.BendableLine = BendableLine;
}).call(this);
