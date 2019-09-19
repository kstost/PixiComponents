//================
//================
//================
//================

(function () {
    var root = this;
    var PixiPolygon = function (options) {
        var pointer = this;
        for (var key in options) { pointer[key] = options[key]; }
        pointer.surface_color = pointer.surface_color ? pointer.surface_color : 0x00FF00;
        pointer.line_color = pointer.line_color ? pointer.line_color : 0xffd900;
        pointer.change = {};
        pointer.change.path = true;
        pointer.change.pivot = true;
        pointer.change.degree = true;
        pointer.change.surface_color = true;
        pointer.change.extracted_path = true;

        let graphics = new PIXI.Graphics();
        (pointer.stage || pointer.parent).addChild(graphics);
        pointer.node = graphics;

        // 초기화 draw
        pointer.setPivot(pointer.pivot_point, true);
        pointer.setRotation(pointer.degree, true);
        pointer.draw();

        pointer.vector = false;
        pointer.node.nodeID = $pxx.common.uniquue();
        pointer.node.getID = function () {
            return pointer.node.nodeID;
        };
        if (false) {
            // 시각화 테스트
            let mmd = ksttool.extract_XYX(pointer.path, pointer.pivot_point);
            testDot(mmd.min_x, mmd.min_y);
            let animation = function (delta_time) {
                pointer.setRotation(pointer.degree + 1);
            };
            PIXI.Ticker.shared.add(animation);
        }
    };
    PixiPolygon.prototype = {
        init: function () {
        },
        setPath: function (path, no_draw) {
            let pointer = this;
            let mark = false;
            if (path && pointer.path) {
                if (path.length === pointer.path.length) {
                    for (let i = 0, len = path.length; i < len; i++) {
                        if (!(path[i].x === pointer.path[i].x && path[i].y === pointer.path[i].y)) {
                            mark = true;
                        }
                    }
                } else {
                    mark = true;
                }
            }
            if (path && !pointer.path) {
                mark = true;
            }
            if (mark) {
                pointer.change.path = true;
            }
            pointer.path = path;
            pointer.path = pointer.path ? pointer.path : [];
            if (!no_draw) { pointer.draw(); }
        },
        setPivot: function (pivot, no_draw) {
            let pointer = this;
            let mark = false;
            if (pointer.pivot_point && pivot) {
                if (!(pointer.pivot_point.x === pivot.x && pointer.pivot_point.y === pivot.y)) {
                    mark = true;
                }
            }
            if (!pointer.pivot_point && pivot) {
                mark = true;
            }
            if (mark) {
                pointer.change.pivot = true;
            }
            pointer.pivot_point = pivot;
            pointer.pivot_point = pointer.pivot_point ? pointer.pivot_point : { x: 0.5, y: 0.5 };
            if (!no_draw) { pointer.draw(); }
        },
        setRotation: function (degree, no_draw) {
            let pointer = this;
            if (pointer.degree !== degree) {
                pointer.change.degree = true;
            }
            pointer.degree = degree;
            pointer.degree = pointer.degree ? pointer.degree : 0;
            if (!no_draw) { pointer.draw(); }
        },
        setColor: function (surface_color, no_draw) {
            let pointer = this;
            if (pointer.surface_color !== surface_color) {
                pointer.change.surface_color = true;
            }
            pointer.surface_color = surface_color;
            pointer.surface_color = pointer.surface_color ? pointer.surface_color : 0xffffff;
            if (!no_draw) { pointer.draw(); }
        },
        draw: function () {
            let pointer = this;
            pointer.redraw(pointer.path, pointer.surface_color, true);
        },
        redraw: function (path, surface_color, reposition) {
            let pointer = this;
            pointer.setPath(path, true);
            pointer.setColor(surface_color, true);

            if (pointer.change.pivot || pointer.change.path) {
                pointer.extracted_path = ksttool.extract_XYX(pointer.path, pointer.pivot_point);
                pointer.change.extracted_path = true;
            }
            //---
            if (pointer.change.degree || pointer.change.extracted_path) {
                pointer.nls = [];
                let pivot_point = { x: pointer.extracted_path.min_x, y: pointer.extracted_path.min_y };
                for (let i = 0, len = pointer.path.length; i < len; i++) {
                    let fee = ksttool.math.rotation_coordinate(pivot_point, pointer.path[i], pointer.degree);
                    fee.x -= pointer.extracted_path.min_x;
                    fee.y -= pointer.extracted_path.min_y;
                    pointer.nls[pointer.nls.length] = fee;
                }
            }
            if (pointer.change.surface_color || pointer.change.extracted_path || (pointer.change.degree || pointer.change.extracted_path) || reposition) {
                pointer.node.clear();
                pointer.node.beginFill(surface_color);
                pointer.node.lineStyle(0, pointer.line_color, 0);
                pointer.node.moveTo(pointer.nls[0].x, pointer.nls[0].y);
                for (let i = 1; i < pointer.nls.length; i++) {
                    pointer.node.lineTo(pointer.nls[i].x, pointer.nls[i].y);
                }
                if (reposition) {
                    pointer.node.position.set(pointer.extracted_path.min_x, pointer.extracted_path.min_y);
                }
                pointer.node.closePath();
                pointer.node.endFill();
            }
            pointer.change.path = false;
            pointer.change.pivot = false;
            pointer.change.degree = false;
            pointer.change.surface_color = false;
            pointer.change.extracted_path = false;
        },
        getWorldPathInPLPType: function () {
            let pointer = this;
            let rotation = (pointer.degree * (Math.PI * 2)) / 360;
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

 //================
 //================
 //================
 //================  