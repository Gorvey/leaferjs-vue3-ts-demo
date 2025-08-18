(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-51d1a3c3"], {
    "5eda": function(e, t, a) {},
    "95cd": function(e, t, a) {
        e.exports = a.p + "static/img/loader.54103db1.gif"
    },
    "96d0": function(e, t, a) {
        "use strict";
        a.r(t);
        var i = function() {
            var e = this
              , t = e.$createElement
              , a = e._self._c || t;
            return a("div", {
                staticStyle: {
                    width: "100%",
                    height: "840px"
                }
            }, [e._m(0), a("div", {
                staticClass: "LabelImage"
            }, [e._m(1), a("div", {
                staticClass: "canvasMain"
            }, [a("div", {
                staticClass: "toolFeatures"
            }, [a("div", {
                attrs: {
                    id: "tools"
                }
            }, [a("div", {
                staticClass: "toolSet toolDrag",
                attrs: {
                    title: "图片拖拽"
                }
            }), a("div", {
                staticClass: "toolSet toolRect focus",
                attrs: {
                    title: "矩形工具"
                }
            }), a("div", {
                staticClass: "toolSet prePage",
                attrs: {
                    title: "上一页"
                },
                on: {
                    click: function(t) {
                        return e.navigate(0)
                    }
                }
            }), a("div", {
                staticClass: "toolSet nextPage",
                attrs: {
                    title: "下一页"
                },
                on: {
                    click: function(t) {
                        return e.navigate(1)
                    }
                }
            }), a("div", {
                staticClass: "box"
            }, [a("label", {
                staticClass: "sidebar-title"
            }, [e._v(e._s(this.pageNumber))])])])]), e._m(2), a("div", {
                staticClass: "commentResult",
                class: e.sidebar.opened ? "commentResult" : "commentResult_sidebarOpen"
            }, [a("el-table", {
                directives: [{
                    name: "loading",
                    rawName: "v-loading",
                    value: e.loading,
                    expression: "loading"
                }],
                attrs: {
                    data: e.markList,
                    "row-class-name": e.tableRowClassName,
                    border: "",
                    height: "650",
                    "highlight-current-row": ""
                },
                on: {
                    "cell-mouse-enter": e.hoverRow,
                    "cell-mouse-leave": e.leaveRow
                }
            }, [a("el-table-column", {
                attrs: {
                    label: "题号",
                    align: "center",
                    sortable: "",
                    width: "75",
                    prop: "questionID"
                }
            }), a("el-table-column", {
                attrs: {
                    label: "子题号",
                    align: "center",
                    width: "80",
                    prop: "childQuestionID"
                }
            }), a("el-table-column", {
                attrs: {
                    label: "ID",
                    align: "center",
                    width: "120",
                    prop: "yqId"
                }
            }), a("el-table-column", {
                attrs: {
                    label: "点读码",
                    align: "center",
                    width: "100",
                    prop: "mId"
                }
            }), a("el-table-column", {
                attrs: {
                    label: "时间",
                    align: "center",
                    sortable: "",
                    prop: "createTime"
                },
                scopedSlots: e._u([{
                    key: "default",
                    fn: function(t) {
                        return [a("span", [e._v(e._s(e.parseTime(t.row.createTime)))])]
                    }
                }])
            }), a("el-table-column", {
                attrs: {
                    label: "操作",
                    align: "center",
                    width: "100",
                    "class-name": "small-padding fixed-width"
                },
                scopedSlots: e._u([{
                    key: "default",
                    fn: function(t) {
                        return [a("el-button", {
                            attrs: {
                                size: "mini",
                                type: "text",
                                icon: "el-icon-edit"
                            },
                            on: {
                                click: function(a) {
                                    return e.handleUpdate(t.row)
                                }
                            }
                        }, [e._v("修改 ")]), a("el-button", {
                            attrs: {
                                size: "mini",
                                type: "text",
                                icon: "el-icon-delete"
                            },
                            on: {
                                click: function(a) {
                                    return e.handleDelete(t.row, t.$index)
                                }
                            }
                        }, [e._v("删除 ")])]
                    }
                }])
            })], 1)], 1)]), a("div", {
                staticClass: "mask_box",
                attrs: {
                    hidden: ""
                }
            }), e._m(3)]), a("el-dialog", {
                directives: [{
                    name: "drag",
                    rawName: "v-drag"
                }],
                attrs: {
                    title: e.title,
                    visible: e.open,
                    center: "",
                    width: "700px",
                    "close-on-click-modal": !1,
                    "append-to-body": "",
                    "show-close": !1
                },
                on: {
                    "update:visible": function(t) {
                        e.open = t
                    }
                }
            }, [a("el-form", {
                ref: "form",
                attrs: {
                    model: e.form,
                    rules: e.rules,
                    "label-width": "150px"
                }
            }, [a("el-row", [a("el-col", {
                attrs: {
                    span: 24
                }
            }, [a("el-form-item", {
                attrs: {
                    label: "标引方式:",
                    prop: "markType"
                }
            }, [[a("el-radio-group", {
                on: {
                    change: e.changeMarkType
                },
                model: {
                    value: e.form.markType,
                    callback: function(t) {
                        e.$set(e.form, "markType", t)
                    },
                    expression: "form.markType"
                }
            }, [a("el-radio", {
                attrs: {
                    label: 1
                }
            }, [e._v("题目标引")]), a("el-radio", {
                attrs: {
                    label: 2
                }
            }, [e._v("点读标引")])], 1)]], 2)], 1)], 1), a("el-row", [a("el-col", {
                attrs: {
                    span: 12
                }
            }, [2 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "标引框宽(mm):",
                    prop: "markWidth"
                }
            }, [a("el-input", {
                attrs: {
                    readonly: "true",
                    maxlength: "10"
                },
                model: {
                    value: e.form.markWidth,
                    callback: function(t) {
                        e.$set(e.form, "markWidth", t)
                    },
                    expression: "form.markWidth"
                }
            })], 1) : e._e()], 1), a("el-col", {
                attrs: {
                    span: 12
                }
            }, [2 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "标引框高(mm):",
                    prop: "markHeight"
                }
            }, [a("el-input", {
                attrs: {
                    readonly: "true",
                    maxlength: "20"
                },
                model: {
                    value: e.form.markHeight,
                    callback: function(t) {
                        e.$set(e.form, "markHeight", t)
                    },
                    expression: "form.markHeight"
                }
            })], 1) : e._e()], 1)], 1), a("el-row", [a("el-col", {
                attrs: {
                    span: 12
                }
            }, [1 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "题号:",
                    prop: "questionID"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: "请输入数字",
                    maxlength: "10"
                },
                model: {
                    value: e.form.questionID,
                    callback: function(t) {
                        e.$set(e.form, "questionID", t)
                    },
                    expression: "form.questionID"
                }
            })], 1) : e._e()], 1), a("el-col", {
                attrs: {
                    span: 12
                }
            }, [1 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "子题号:",
                    prop: "childQuestionID"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: "请输入子题号",
                    maxlength: "20"
                },
                model: {
                    value: e.form.childQuestionID,
                    callback: function(t) {
                        e.$set(e.form, "childQuestionID", t)
                    },
                    expression: "form.childQuestionID"
                }
            })], 1) : e._e()], 1)], 1), a("el-row", [a("el-col", {
                attrs: {
                    span: 12
                }
            }, [1 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "初始页码:",
                    prop: "originalPageNumber"
                }
            }, [a("el-input", {
                attrs: {
                    disabled: "",
                    placeholder: "请输入初始页码",
                    maxlength: "10"
                },
                model: {
                    value: e.form.originalPageNumber,
                    callback: function(t) {
                        e.$set(e.form, "originalPageNumber", t)
                    },
                    expression: "form.originalPageNumber"
                }
            })], 1) : e._e()], 1), a("el-col", {
                attrs: {
                    span: 12
                }
            }, [1 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "最新页码:",
                    prop: "newPageNumber"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: "请输入最新页码",
                    maxlength: "10"
                },
                model: {
                    value: e.form.newPageNumber,
                    callback: function(t) {
                        e.$set(e.form, "newPageNumber", t)
                    },
                    expression: "form.newPageNumber"
                }
            })], 1) : e._e()], 1)], 1), a("el-row", [a("el-col", {
                attrs: {
                    span: 12
                }
            }, [1 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "题目ID:",
                    prop: "yqId"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: "请输入题目ID",
                    maxlength: "100"
                },
                model: {
                    value: e.form.yqId,
                    callback: function(t) {
                        e.$set(e.form, "yqId", t)
                    },
                    expression: "form.yqId"
                }
            })], 1) : e._e()], 1), a("el-col", {
                attrs: {
                    span: 12
                }
            }, [2 === e.form.markType ? a("el-form-item", {
                attrs: {
                    label: "点读码ID:",
                    prop: "mId"
                }
            }, [a("el-input", {
                attrs: {
                    placeholder: "如不需要点读码请留空",
                    maxlength: "11"
                },
                model: {
                    value: e.form.mId,
                    callback: function(t) {
                        e.$set(e.form, "mId", t)
                    },
                    expression: "form.mId"
                }
            })], 1) : e._e()], 1)], 1)], 1), a("div", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [a("el-button", {
                directives: [{
                    name: "preventReClick",
                    rawName: "v-preventReClick"
                }],
                attrs: {
                    type: "primary"
                },
                on: {
                    click: e.submitForm
                }
            }, [e._v("确 定")]), a("el-button", {
                on: {
                    click: e.cancel
                }
            }, [e._v("取 消")])], 1)], 1)], 1)
        }
          , o = [function() {
            var e = this
              , t = e.$createElement
              , i = e._self._c || t;
            return i("div", {
                attrs: {
                    id: "preloader"
                }
            }, [i("div", {
                staticClass: "loader",
                attrs: {
                    hidden: ""
                }
            }, [i("img", {
                attrs: {
                    src: a("95cd"),
                    alt: ""
                }
            })])])
        }
        , function() {
            var e = this
              , t = e.$createElement
              , a = e._self._c || t;
            return a("div", {
                staticClass: "toolHead",
                staticStyle: {
                    display: "none"
                }
            }, [a("div", {
                staticClass: "toolMuster"
            }, [a("div", {
                staticClass: "logoGroup"
            }, [a("div", {
                staticClass: "logo"
            }), a("div", {
                staticClass: "logoTitle"
            }, [e._v("图片标引")])])])])
        }
        , function() {
            var e = this
              , t = e.$createElement
              , a = e._self._c || t;
            return a("div", {
                staticClass: "canvasContent"
            }, [a("canvas", {
                attrs: {
                    id: "canvas"
                }
            }), a("div", {
                staticClass: "scaleBox"
            }, [a("div", {
                staticClass: "scaleCanvas"
            }), a("div", {
                staticClass: "scalePanel"
            })])])
        }
        , function() {
            var e = this
              , t = e.$createElement
              , a = e._self._c || t;
            return a("div", {
                staticClass: "loading_box",
                attrs: {
                    hidden: "",
                    id: "loading"
                }
            }, [a("div", {
                staticClass: "loaderSpinner"
            }, [a("span", {
                staticClass: "icon-spinner"
            })]), a("b", {
                staticClass: "closes"
            })])
        }
        ]
          , n = (a("4160"),
        a("c975"),
        a("13d5"),
        a("fb6a"),
        a("ace4"),
        a("a9e3"),
        a("d3b7"),
        a("5cc6"),
        a("9a8c"),
        a("a975"),
        a("735e"),
        a("c1ac"),
        a("d139"),
        a("3a7b"),
        a("d5d6"),
        a("82f8"),
        a("e91f"),
        a("60bd"),
        a("5f96"),
        a("3280"),
        a("3fcc"),
        a("ca91"),
        a("25a1"),
        a("cd26"),
        a("3c5d"),
        a("2954"),
        a("649e"),
        a("219c"),
        a("170b"),
        a("b39a"),
        a("72f7"),
        a("159b"),
        a("5530"))
          , s = (a("d81d"),
        a("a434"),
        a("d4ec"))
          , r = a("bee2")
          , c = a("ade3")
          , l = function() {
            function e(t) {
                var a = this;
                Object(s["a"])(this, e),
                Object(c["a"])(this, "Initial", (function() {
                    var t = a.Nodes;
                    t.scaleRect = document.createElement("div"),
                    t.scaleRect.className = "scaleWindow",
                    Object.assign(t.scaleRect.style, {
                        position: "absolute",
                        border: "1px solid red",
                        boxSizing: "border-box"
                    }),
                    t.scaleCanvas.appendChild(t.scaleRect),
                    t.canvas.addEventListener("mousedown", a.CanvasMouseDown),
                    t.canvas.addEventListener("mousewheel", a.MouseWheel),
                    t.canvas.addEventListener("DOMMouseScroll", a.MouseWheel),
                    t.canvas.addEventListener("contextmenu", e.NoRightMenu.bind(a)),
                    t.scaleCanvas.addEventListener("click", a.ScaleCanvasClick),
                    t.canvas.addEventListener("mousemove", a.CanvasMouseMove)
                }
                )),
                Object(c["a"])(this, "SetImage", (function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                      , i = a.Nodes;
                    i.image = new Image,
                    i.image.crossOrigin = "anonymous",
                    i.image.src = e;
                    var o = a;
                    i.image.addEventListener("load", (function() {
                        o.openBox("#loading", !1),
                        o.iWidth = i.image.width,
                        o.iHeight = i.image.height;
                        var e = i.scaleCanvas.querySelectorAll("canvas")
                          , a = document.querySelector(".bodyCanvas");
                        e.length > 0 && i.scaleCanvas.removeChild(e[0]),
                        a && document.body.removeChild(a),
                        o.Arrays.imageAnnotateShower.splice(0, o.Arrays.imageAnnotateShower.length),
                        o.Arrays.imageAnnotateMemory.splice(0, o.Arrays.imageAnnotateMemory.length);
                        var n = document.createElement("canvas");
                        i.sCtx = n.getContext("2d"),
                        n.style.display = "block",
                        o.sWidth = parseInt(i.scaleCanvas.getBoundingClientRect().width),
                        o.sHeight = parseInt(o.sWidth * o.iHeight / o.iWidth),
                        n.width = o.sWidth,
                        n.height = o.sHeight,
                        i.bCanvas = document.createElement("canvas"),
                        i.bCanvas.width = o.iWidth,
                        i.bCanvas.height = o.iHeight,
                        i.bCanvas.style.display = "none", 
                        i.bCanvas.className = "bodyCanvas",
                        i.bCtx = i.bCanvas.getContext("2d"),
                        i.bCtx.drawImage(i.image, 0, 0, o.iWidth, o.iHeight),
                        i.bCtx.translate(.5, .5),
                        document.body.appendChild(i.bCanvas),
                        o.scale = 1,
                        (o.iWidth > o.cWidth || o.iHeight > o.cHeight) && (o.scale = o.iWidth - o.cWidth > o.iHeight - o.cHeight ? o.cWidth / o.iWidth : o.cHeight / o.iHeight);
                        var s = (o.cWidth - o.iWidth * o.scale) / 2
                          , r = (o.cHeight - o.iHeight * o.scale) / 2;
                        o.SetXY(s, r),
                        o.historyIndex = 0,
                        t && o.updateImageRect(t)
                    }
                    ))
                }
                )),
                Object(c["a"])(this, "SetFeatures", (function(e, t) {
                    if ("crossOn" === e || "labelOn" === e)
                        a.Features[e] = t;
                    else
                        for (var i in a.Features)
                            "crossOn" !== i && "labelOn" !== i && (a.Features[i] = !1);
                    a.Features[e] = t,
                    a.Arrays.resultIndex = 0,
                    a.DrawSavedAnnotateInfoToShow(a.Arrays.resultIndex)
                }
                )),
                Object(c["a"])(this, "UpdateCanvas", (function() {
                    var e = a.Nodes;
                    e.ctx.clearRect(0, 0, a.cWidth, a.cHeight),
                    e.sCtx.clearRect(0, 0, a.sWidth, a.sWidth * a.iHeight / a.iHeight),
                    e.ctx.drawImage(e.bCanvas, -a.x / a.scale, -a.y / a.scale, a.cWidth / a.scale, a.cHeight / a.scale, 0, 0, a.cWidth, a.cHeight),
                    e.sCtx.drawImage(e.bCanvas, 0, 0, a.iWidth, a.iHeight, 0, 0, a.sWidth, a.sHeight);
                    var t = a.sWidth * a.cWidth / a.iWidth / a.scale
                      , i = t * a.cHeight / a.cWidth
                      , o = -a.x * a.sWidth / (a.iWidth * a.scale)
                      , n = -a.y * a.sWidth / (a.iWidth * a.scale);
                    t + o >= a.sWidth ? (t = a.sWidth - o,
                    o = a.sWidth - t,
                    t >= a.sWidth && (t = a.sWidth,
                    o = 0)) : o <= 0 && (t += o,
                    o = 0),
                    i + n >= a.sHeight ? (i = a.sHeight - n,
                    n = a.sHeight - i,
                    i >= a.sHeight && (i = a.sHeight,
                    n = 0)) : n <= 0 && (i += n,
                    n = 0),
                    e.scaleRect.style.left = o + "px",
                    e.scaleRect.style.top = n + "px",
                    t !== Number(e.scaleRect.style.width) && (e.scaleRect.style.width = t + "px",
                    e.scaleRect.style.height = i + "px")
                }
                )),
                Object(c["a"])(this, "MouseMoveCrossHair", (function() {
                    var e = a.Nodes;
                    e.ctx.setLineDash([6, 3]),
                    e.ctx.lineWidth = 1,
                    e.ctx.strokeStyle = "#333",
                    e.ctx.beginPath(),
                    e.ctx.moveTo(0, a.mouseY),
                    e.ctx.lineTo(a.cWidth, a.mouseY),
                    e.ctx.stroke(),
                    e.ctx.moveTo(a.mouseX, 0),
                    e.ctx.lineTo(a.mouseX, a.cHeight),
                    e.ctx.stroke(),
                    e.ctx.closePath()
                }
                )),
                Object(c["a"])(this, "MouseMoveCrossHairLocation", (function() {
                    a.Features.crossOn && (a.DrawSavedAnnotateInfoToShow(),
                    a.MouseMoveCrossHair())
                }
                )),
                Object(c["a"])(this, "CanvasMouseMove", (function(e) {
                    var t = a.Nodes
                      , i = a.Arrays;
                    if (a.GetMouseInCanvasLocation(e),
                    0 !== i.resultIndex && i.imageAnnotateShower.length) {
                        var o = i.imageAnnotateShower[0].content;
                        if (o.length > 0)
                            for (var n = 0; n < o.length; n++) {
                                var s = Math.sqrt(Math.pow(o[n].x - a.mouseX, 2) + Math.pow(o[n].y - a.mouseY, 2));
                                if (s <= a.radius)
                                    return void (t.canvas.style.cursor = "grabbing");
                                t.canvas.style.cursor = "crosshair"
                            }
                    }
                }
                )),
                Object(c["a"])(this, "CanvasMouseDown", (function(e) {
                    var t = a.Nodes
                      , i = a.Arrays;
                    if (a.GetMouseInCanvasLocation(e),
                    0 === e.button) {
                        if (a.isDrogCircle = !1,
                        0 !== i.resultIndex && i.imageAnnotateShower.length) {
                            var o = i.imageAnnotateShower[0].content;
                            if (o.length > 0)
                                for (var n = 0; n < o.length; n++) {
                                    var s = Math.sqrt(Math.pow(o[n].x - a.mouseX, 2) + Math.pow(o[n].y - a.mouseY, 2));
                                    if (s <= a.radius)
                                        return a.isDrogCircle = !0,
                                        a.snapCircleIndex = n,
                                        void ("rect" === i.imageAnnotateShower[0].contentType && (a.Nodes.canvas.addEventListener("mousemove", a.DragRectCircleRepaintRect),
                                        a.Nodes.canvas.addEventListener("mouseup", a.RemoveDragRectCircle)));
                                    a.isDrogCircle = !1
                                }
                        }
                        if (!a.isDrogCircle)
                            if (a.Features.dragOn) {
                                var r = a.CalculateChange(e, t.canvas);
                                a.prevX = r.x,
                                a.prevY = r.y,
                                t.canvas.addEventListener("mousemove", a.ImageDrag),
                                t.canvas.addEventListener("mouseup", a.RemoveImageDrag)
                            } else
                                a.Features.rectOn && 0 === a.Arrays.resultIndex && (t.ctx.lineWidth = 1,
                                t.ctx.strokeStyle = "#ff0000",
                                a.rectX = a.mouseX,
                                a.rectY = a.mouseY,
                                a.Nodes.canvas.addEventListener("mousemove", a.MouseMoveDrawRect),
                                a.Nodes.canvas.addEventListener("mouseup", a.MouseUpRemoveDrawRect))
                    } else if (2 === e.button) {
                        var c = a.CalculateChange(e, t.canvas);
                        a.prevX = c.x,
                        a.prevY = c.y,
                        t.canvas.addEventListener("mousemove", a.ImageDrag),
                        t.canvas.addEventListener("mouseup", a.RemoveImageDrag)
                    }
                }
                )),
                Object(c["a"])(this, "CalcRectMask", (function(e) {
                    if (e.length >= 2) {
                        var t = e[0].x
                          , i = e[0].x
                          , o = e[0].y
                          , n = e[0].y;
                        e.forEach((function(e) {
                            t = t < e.x ? t : e.x,
                            i = i > e.x ? i : e.x,
                            o = o < e.y ? o : e.y,
                            n = n > e.y ? n : e.y
                        }
                        )),
                        a.Arrays.imageAnnotateShower[a.Arrays.resultIndex - 1].rectMask = {
                            xMin: t,
                            yMin: o,
                            width: i - t,
                            height: n - o
                        };
                        var s = (i - t) / 2 + t
                          , r = (n - o) / 2 + o;
                        a.Arrays.imageAnnotateShower[a.Arrays.resultIndex - 1].labelLocation.x = s,
                        a.Arrays.imageAnnotateShower[a.Arrays.resultIndex - 1].labelLocation.y = r
                    }
                }
                )),
                Object(c["a"])(this, "DrawRect", (function(e, t, a, i, o) {
                    e.strokeStyle = "#ff0000",
                    e.strokeRect(t, a, i, o)
                }
                )),
                Object(c["a"])(this, "DrawSavedAnnotateInfoToShow", (function(e) {
                    var t = a.Arrays
                      , i = a.Nodes;
                    i.ctx.clearRect(0, 0, a.cWidth, a.cHeight),
                    i.ctx.drawImage(i.bCanvas, -a.x / a.scale, -a.y / a.scale, a.cWidth / a.scale, a.cHeight / a.scale, 0, 0, a.cWidth, a.cHeight),
                    i.ctx.setLineDash([0, 0]),
                    t.imageAnnotateShower.forEach((function(t, o) {
                        "rect" === t.contentType && a.DrawRect(i.ctx, t.rectMask.xMin, t.rectMask.yMin, t.rectMask.width, t.rectMask.height),
                        e && e - 1 === o && (i.ctx.beginPath(),
                        i.ctx.lineWidth = 1,
                        i.ctx.strokeStyle = "#00ff00",
                        i.ctx.fillStyle = "rgba(102, 255, 0, 0.3)",
                        i.ctx.strokeRect(t.rectMask.xMin, t.rectMask.yMin, t.rectMask.width, t.rectMask.height),
                        i.ctx.fillRect(t.rectMask.xMin, t.rectMask.yMin, t.rectMask.width, t.rectMask.height),
                        i.ctx.closePath())
                    }
                    ))
                }
                )),
                Object(c["a"])(this, "DrawSavedAnnotateInfoToMemory", (function(e) {
                    var t = a.Arrays
                      , i = a.Nodes;
                    i.bCtx.clearRect(0, 0, a.iWidth, a.iHeight),
                    i.bCtx.drawImage(i.image, 0, 0, a.iWidth, a.iHeight),
                    e && t.imageAnnotateMemory.forEach((function(e, t) {
                        "rect" === e.contentType && a.DrawRect(i.bCtx, e.rectMask.xMin, e.rectMask.yMin, e.rectMask.width, e.rectMask.height)
                    }
                    )),
                    a.UpdateCanvas(),
                    !e && a.DrawSavedAnnotateInfoToShow()
                }
                )),
                Object(c["a"])(this, "ImageDrag", (function(e) {
                    var t = a.Nodes
                      , i = a.CalculateChange(e, t.canvas)
                      , o = i.x - a.prevX
                      , n = i.y - a.prevY;
                    a.SetXY(a.x + o, a.y + n),
                    a.prevX = i.x,
                    a.prevY = i.y,
                    a.drawFlag && (a.DrawSavedAnnotateInfoToMemory(!0),
                    a.drawFlag = !1)
                }
                )),
                Object(c["a"])(this, "RemoveImageDrag", (function() {
                    a.ReplaceAnnotateShow(),
                    a.DrawSavedAnnotateInfoToMemory(!1),
                    a.drawFlag = !0,
                    a.Nodes.canvas.removeEventListener("mousemove", a.ImageDrag),
                    a.Nodes.canvas.removeEventListener("mouseup", a.RemoveImageDrag)
                }
                )),
                Object(c["a"])(this, "MouseMoveDrawRect", (function(e) {
                    a.GetMouseInCanvasLocation(e),
                    a.DrawSavedAnnotateInfoToShow(),
                    a.Nodes.ctx.strokeStyle = "#ff0000",
                    a.Nodes.ctx.strokeRect(a.rectX, a.rectY, a.mouseX - a.rectX, a.mouseY - a.rectY)
                }
                )),
                Object(c["a"])(this, "MouseUpRemoveDrawRect", (function() {
                    (a.mouseX - a.rectX >= 10 || a.rectX - a.mouseX >= 10) && (a.CreateNewResultList(a.mouseX, a.mouseY, "rect"),
                    a.DrawSavedAnnotateInfoToShow(),
                    a.ReplaceAnnotateMemory()),
                    a.Nodes.canvas.removeEventListener("mousemove", a.MouseMoveDrawRect),
                    a.Nodes.canvas.removeEventListener("mouseup", a.MouseUpRemoveDrawRect)
                }
                )),
                Object(c["a"])(this, "DragRectCircleChangeLocation", (function(e, t) {
                    switch (t) {
                    case 0:
                        e[1].y = a.mouseY,
                        e[3].x = a.mouseX;
                        break;
                    case 1:
                        e[0].y = a.mouseY,
                        e[2].x = a.mouseX;
                        break;
                    case 2:
                        e[1].x = a.mouseX,
                        e[3].y = a.mouseY;
                        break;
                    case 3:
                        e[0].x = a.mouseX,
                        e[2].y = a.mouseY;
                        break;
                    default:
                        break
                    }
                }
                )),
                Object(c["a"])(this, "DragRectCircleRepaintRect", (function(e) {
                    a.GetMouseInCanvasLocation(e);
                    var t = a.Arrays.imageAnnotateShower[a.Arrays.resultIndex - 1].content;
                    a.Nodes.ctx.fillStyle = "rgba(" + a.Arrays.imageAnnotateShower[a.Arrays.resultIndex - 1].labels.labelColorRGB + "," + a.opacity + ")",
                    t[a.snapCircleIndex].x = a.mouseX,
                    t[a.snapCircleIndex].y = a.mouseY,
                    a.DragRectCircleChangeLocation(t, a.snapCircleIndex),
                    a.CalcRectMask(t),
                    a.DrawSavedAnnotateInfoToShow()
                }
                )),
                Object(c["a"])(this, "RemoveDragRectCircle", (function() {
                    a.ReplaceAnnotateMemory(),
                    a.DrawSavedAnnotateInfoToMemory(!1),
                    a.drawFlag = !0,
                    a.Nodes.canvas.removeEventListener("mousemove", a.DragRectCircleRepaintRect),
                    a.Nodes.canvas.removeEventListener("mouseup", a.RemoveDragRectCircle)
                }
                )),
                Object(c["a"])(this, "DeleteLabel", (function(e) {
                    a.ReplaceAnnotateMemory(),
                    a.Arrays.imageAnnotateShower.splice(e, 1),
                    a.Arrays.resultIndex = 0,
                    a.DrawSavedAnnotateInfoToShow(),
                    a.ReplaceAnnotateMemory()
                }
                )),
                Object(c["a"])(this, "CreateNewResultList", (function(e, t, i) {
                    a.Nodes;
                    if ("rect" === i) {
                        var o = {
                            xMin: a.rectX,
                            yMin: a.rectY,
                            width: a.mouseX - a.rectX,
                            height: a.mouseY - a.rectY
                        };
                        a.Arrays.imageAnnotateShower.push({
                            content: [{
                                x: a.rectX,
                                y: a.rectY
                            }, {
                                x: a.mouseX,
                                y: a.rectY
                            }, {
                                x: a.mouseX,
                                y: a.mouseY
                            }, {
                                x: a.rectX,
                                y: a.mouseY
                            }],
                            labels: {
                                labelName: "未命名",
                                labelColor: "red",
                                labelColorRGB: "255,0,0"
                            },
                            labelLocation: a.ComputerLabelLocation(o),
                            rectMask: o,
                            contentType: i
                        }),
                        a.ReplaceAnnotateMemory()
                    }
                }
                )),
                Object(c["a"])(this, "ScaleCanvasClick", (function(e) {
                    var t = a.CalculateChange(e, a.Nodes.scaleCanvas)
                      , i = a.cWidth / 2 - a.iWidth * a.scale * t.x / a.sWidth
                      , o = a.cHeight / 2 - a.iWidth * a.scale * t.x / a.sWidth * t.y / t.x;
                    a.SetXY(i, o),
                    a.ReplaceAnnotateShow()
                }
                )),
                Object(c["a"])(this, "MouseWheel", (function(e) {
                    var t = e.wheelDelta || e.detail
                      , i = a.scale * (1 + (t > 0 ? a.scaleStep : -a.scaleStep));
                    if (i = i < a.minScale ? a.minScale : i,
                    i = i > a.maxScale ? a.maxScale : i,
                    i !== a.scale) {
                        var o = a.CalculateChange(e, a.Nodes.canvas)
                          , n = (a.x - o.x) * i / a.scale + o.x
                          , s = (a.y - o.y) * i / a.scale + o.y;
                        a.scale = i,
                        a.SetXY(n, s)
                    }
                    clearTimeout(a.mousewheelTimer),
                    a.mousewheelTimer = setTimeout((function() {
                        a.IsMouseWheelEnd()
                    }
                    ), 500),
                    a.drawFlag && (a.DrawSavedAnnotateInfoToMemory(!0),
                    a.drawFlag = !1)
                }
                )),
                Object(c["a"])(this, "IsMouseWheelEnd", (function() {
                    a.ReplaceAnnotateShow(),
                    a.DrawSavedAnnotateInfoToMemory(!1),
                    a.drawFlag = !0
                }
                )),
                Object(c["a"])(this, "SetXY", (function(e, t) {
                    e < a.appearSize - a.iWidth * a.scale ? a.x = a.appearSize - a.iWidth * a.scale : e > a.cWidth - a.appearSize ? a.x = a.cWidth - a.appearSize : a.x = e,
                    t < a.appearSize - a.iHeight * a.scale ? a.y = a.appearSize - a.iHeight * a.scale : t > a.cHeight - a.appearSize ? a.y = a.cHeight - a.appearSize : a.y = t,
                    a.UpdateCanvas()
                }
                )),
                Object(c["a"])(this, "YPointReplace", (function(e) {
                    return e < a.y ? e = a.y : e > a.iHeight * a.scale + a.y && (e = a.iHeight * a.scale + a.y),
                    e
                }
                )),
                Object(c["a"])(this, "XPointReplace", (function(e) {
                    return e < a.x ? e = a.x : e > a.iWidth * a.scale + a.x && (e = a.iWidth * a.scale + a.x),
                    e
                }
                )),
                Object(c["a"])(this, "GetMouseInCanvasLocation", (function(e) {
                    a.mouseX = a.XPointReplace(e.layerX || e.offsetX),
                    a.mouseY = a.YPointReplace(e.layerY || e.offsetY)
                }
                )),
                Object(c["a"])(this, "GetMouseInImageLocation", (function(e) {
                    var t = a.CalculateChange(e, a.Nodes.canvas);
                    a.ix = Math.floor((t.x - a.x) / a.scale),
                    a.ix < 0 ? a.ix = 0 : a.ix > a.iWidth && (a.ix = a.iWidth),
                    a.iy = Math.floor((t.y - a.y) / a.scale),
                    a.iy < 0 ? a.iy = 0 : a.iy > a.iHeight && (a.iy = a.iHeight)
                }
                )),
                Object(c["a"])(this, "CalculateChange", (function(e, t, a) {
                    !a && e.preventDefault();
                    var i = t.clientWidth
                      , o = t.clientHeight
                      , n = "number" === typeof e.pageX ? e.pageX : e.touches[0].pageX
                      , s = "number" === typeof e.pageY ? e.pageY : e.touches[0].pageY
                      , r = n - (t.getBoundingClientRect().left + window.pageXOffset)
                      , c = s - (t.getBoundingClientRect().top + window.pageYOffset);
                    return r < 0 ? r = 0 : r > i && (r = i),
                    c < 0 ? c = 0 : c > o && (c = o),
                    {
                        x: r,
                        y: c
                    }
                }
                )),
                Object(c["a"])(this, "ComputerLabelLocation", (function(e) {
                    var t = e.width / 2 + e.xMin
                      , a = e.height / 2 + e.yMin;
                    return {
                        x: t,
                        y: a
                    }
                }
                )),
                Object(c["a"])(this, "ReplaceAnnotateMemory", (function() {
                    a.Arrays.imageAnnotateMemory.splice(0, a.Arrays.imageAnnotateMemory.length),
                    a.Arrays.imageAnnotateShower.map((function(e) {
                        var t = [];
                        e.content.forEach((function(e) {
                            t.push({
                                x: (e.x - a.x) / a.scale,
                                y: (e.y - a.y) / a.scale
                            })
                        }
                        ));
                        var i = {
                            xMin: (e.rectMask.xMin - a.x) / a.scale,
                            yMin: (e.rectMask.yMin - a.y) / a.scale,
                            width: e.rectMask.width / a.scale,
                            height: e.rectMask.height / a.scale
                        };
                        a.Arrays.imageAnnotateMemory.push({
                            content: t,
                            rectMask: i,
                            labels: e.labels,
                            labelLocation: a.ComputerLabelLocation(i),
                            contentType: e.contentType
                        })
                    }
                    ))
                }
                )),
                Object(c["a"])(this, "ReplaceAnnotateShow", (function() {
                    a.Arrays.imageAnnotateShower.splice(0, a.Arrays.imageAnnotateShower.length),
                    a.Arrays.imageAnnotateMemory.map((function(e, t) {
                        var i = [];
                        e.content.forEach((function(e) {
                            i.push({
                                x: e.x * a.scale + a.x,
                                y: e.y * a.scale + a.y
                            })
                        }
                        ));
                        var o = {
                            xMin: e.rectMask.xMin * a.scale + a.x,
                            yMin: e.rectMask.yMin * a.scale + a.y,
                            width: e.rectMask.width * a.scale,
                            height: e.rectMask.height * a.scale
                        };
                        a.Arrays.imageAnnotateShower.push({
                            content: i,
                            rectMask: o,
                            labels: e.labels,
                            labelLocation: a.ComputerLabelLocation(o),
                            contentType: e.contentType
                        })
                    }
                    ))
                }
                )),
                this.colorPicker = null,
                this.cWidth = t.canvas.clientWidth,
                this.cHeight = t.canvas.clientHeight,
                this.sWidth = 0,
                this.sHeight = 0,
                this.iWidth = 0,
                this.iHeight = 0,
                this.appearSize = 180,
                this.scaleStep = .02,
                this.minScale = .2,
                this.maxScale = 8,
                this.x = 0,
                this.y = 0,
                this.mouseX = 0,
                this.mouseY = 0,
                this.prevX = 0,
                this.prevY = 0,
                this.scale = 0,
                this.ix = 0,
                this.iy = 0,
                this.rectX = 0,
                this.rectY = 0,
                this.radius = 4,
                this.lineWidth = 1,
                this.opacity = .45,
                this.timer = null,
                this.isModify = !1,
                this.isFullScreen = !1,
                this.isDrogCircle = !1,
                this.snapCircleIndex = 0,
                this.drawFlag = !0,
                this.mousewheelTimer = null,
                this.historyIndex = 0,
                this.Arrays = {
                    imageAnnotateShower: [],
                    imageAnnotateMemory: [],
                    resultIndex: 0
                },
                this.Nodes = {
                    image: null,
                    canvas: t.canvas,
                    scaleCanvas: t.scaleCanvas,
                    scalePanel: t.scalePanel,
                    ctx: t.canvas.getContext("2d"),
                    sCtx: null,
                    scaleRect: null,
                    bCanvas: null,
                    bCtx: null,
                    canvasMain: t.canvasMain,
                    crossLine: t.crossLine,
                    screenShot: t.screenShot,
                    screenFull: t.screenFull,
                    colorHex: t.colorHex
                },
                this.Features = {
                    dragOn: !1,
                    rectOn: !0,
                    polygonOn: !1,
                    tagsOn: !1,
                    crossOn: !1,
                    labelOn: !0
                },
                this.Initial()
            }
            return Object(r["a"])(e, [{
                key: "openBox",
                value: function(e, t) {
                    var a = document.querySelector(e)
                      , i = document.querySelector(".mask_box");
                    t ? (i.style.display = "block",
                    a.style.display = "block") : (i.style.display = "none",
                    a.style.display = "none")
                }
            }, {
                key: "updateImageRect",
                value: function(e) {
                    this.Arrays.imageAnnotateMemory = e,
                    this.ReplaceAnnotateShow(),
                    this.Arrays.resultIndex = 0,
                    this.DrawSavedAnnotateInfoToShow(),
                    this.ReplaceAnnotateMemory()
                }
            }], [{
                key: "NoRightMenu",
                value: function(e) {
                    e.preventDefault()
                }
            }]),
            e
        }()
          , m = a("2f62")
          , d = a("abef")
          , h = {
            name: "BookPng",
            components: {},
            computed: Object(n["a"])({}, Object(m["b"])(["sidebar", "avatar", "device"])),
            data: function() {
                return {
                    open: !1,
                    visible: !1,
                    loading: !1,
                    title: "题目标引",
                    pageNumber: void 0,
                    targetPageNumber: void 0,
                    identifier: void 0,
                    imgId: void 0,
                    frombook: void 0,
                    pageId: void 0,
                    questionID: void 0,
                    markWidth: void 0,
                    markHeight: void 0,
                    mId: void 0,
                    markList: [],
                    imgBase64: null,
                    rectData: [],
                    form: {
                        id: ""
                    },
                    defaultProps: {
                        children: "children",
                        label: "label"
                    },
                    queryParams: {
                        pid: void 0
                    },
                    rules: {
                        questionID: [{
                            required: !0,
                            message: "题号不能为空",
                            trigger: "blur"
                        }, {
                            pattern: /^(0|\+?[1-9][0-9]*)$/,
                            message: "请输入非负整数",
                            trigger: "change"
                        }],
                        mId: [{
                            required: !1,
                            message: "",
                            trigger: "blur"
                        }, {
                            pattern: /^(0|\+?[1-9][0-9]*)$/,
                            message: "请输入非负整数",
                            trigger: "change"
                        }]
                    },
                    annotate: void 0,
                    preloader: void 0
                }
            },
            mounted: function() {
                var e = this
                  , t = window.innerWidth
                  , a = window.innerHeight;
                this.preloader = document.getElementById("preloader");
                var i = document.querySelector(".loader");
                this.preloader.style.width = t + "px",
                this.preloader.style.height = a + "px",
                i.style.display = "block";
                var o = document.querySelector(".canvasMain")
                  , n = document.getElementById("canvas");
                n.width = n.clientWidth,
                n.height = n.clientHeight,
                n.style.background = "#8c919c",
                this.annotate = new l({
                    canvas: n,
                    scaleCanvas: document.querySelector(".scaleCanvas"),
                    scalePanel: document.querySelector(".scalePanel"),
                    annotateState: document.querySelector(".annotateState"),
                    canvasMain: o,
                    crossLine: document.querySelector(".crossLine"),
                    labelShower: document.querySelector(".labelShower"),
                    screenShot: document.querySelector(".screenShot"),
                    screenFull: document.querySelector(".screenFull"),
                    colorHex: document.querySelector("#colorHex")
                }),
                "" === this.imgId && 0 === this.frombook ? Object(d["f"])(this.imgId, this.pageNumber, this.identifier).then((function(t) {
                    200 == t.code ? (e.imgId = t.row.id,
                    e.getList(),
                    e.initImage()) : e.msgSuccess("标引页面不存在")
                }
                )) : 1 === this.frombook && "" === this.imgId ? (Object(d["d"])(this.pageId, this.identifier).then((function(t) {
                    200 == t.code ? (e.pageNumber = t.row.pageNumber,
                    e.imgId = t.row.id,
                    e.getList(),
                    e.initImage(),
                    console.log("----getFirstPageInfo---imgId:" + e.imgId)) : e.msgSuccess("标引页面不存在")
                }
                )),
                this.frombook = 0) : "" != this.imgId && (console.log("this.imgId is " + this.imgId),
                this.getList(),
                this.initImage()),
                console.log("-----------this.imgId is " + this.imgId);
                var s = this
                  , r = document.getElementById("tools");
                r.addEventListener("click", (function(e) {
                    for (var t = 0; t < r.children.length; t++)
                        r.children[t].classList.remove("focus");
                    switch (e.target.classList.add("focus"),
                    !0) {
                    case e.target.className.indexOf("toolDrag") > -1:
                        s.annotate.SetFeatures("dragOn", !0);
                        break;
                    case e.target.className.indexOf("toolRect") > -1:
                        s.annotate.SetFeatures("rectOn", !0);
                        break;
                    default:
                        break
                    }
                }
                )),
                this.annotate.Nodes.canvas.addEventListener("mouseup", (function() {
                    setTimeout((function() {
                        var e = s.rectData.length
                          , t = s.annotate.Arrays.imageAnnotateMemory.length;
                        e < t && s.handleAdd()
                    }
                    ), 500)
                }
                )),
                this.preloader.style.display = "none"
            },
            created: function() {
                this.pageNumber = this.$route.query.pageNumber,
                this.identifier = this.$route.query.identifier,
                this.imgId = this.$route.query.imgId,
                this.targetPageNumber = this.$route.targetPageNumber,
                this.frombook = this.$route.query.frombook,
                this.pageId = this.$route.query.pageId
            },
            methods: {
                navigate: function(e) {
                    var t = this;
                    console.log("navigate"),
                    this.imgId = "";
                    var a = parseInt(this.pageNumber) + 1;
                    0 === e && (a = parseInt(this.pageNumber) - 1),
                    "" === this.imgId && Object(d["f"])(this.imgId, a, this.identifier).then((function(e) {
                        200 == e.code && (t.imgId = e.row.id,
                        console.log("getOnePageInfoById--imgId：" + t.imgId),
                        "" !== t.imgId && (console.log("getList"),
                        t.getList(),
                        t.initImage(),
                        t.pageNumber = a))
                    }
                    ))
                },
                selectImage: function() {
                    var e = this;
                    console.log("selectImage--imgId：" + this.imgId),
                    this.annotate.openBox("#loading", !0);
                    var t = this.imgId;
                    "" != t && Object(d["c"])(t).then((function(t) {
                        var a = btoa(new Uint8Array(t).reduce((function(e, t) {
                            return e + String.fromCharCode(t)
                        }
                        ), ""));
                        e.imgBase64 = "data:image/png;base64," + a,
                        e.annotate.SetImage(e.imgBase64, e.rectData.slice(0, e.rectData.length))
                    }
                    ))
                },
                initImage: function() {
                    var e = this;
                    setTimeout((function() {
                        e.selectImage()
                    }
                    ), 100)
                },
                tableRowClassName: function(e) {
                    e.row;
                    var t = e.rowIndex;
                    return t % 2 === 0 ? "success-row" : ""
                },
                hoverRow: function(e) {
                    this.annotate.DrawSavedAnnotateInfoToShow(e.index)
                },
                leaveRow: function() {
                    this.annotate.DrawSavedAnnotateInfoToShow()
                },
                getList: function(e) {
                    var t = this;
                    this.loading = !0,
                    this.queryParams.pid = this.imgId,
                    console.log("getList--imgId：" + this.imgId),
                    Object(d["e"])(this.queryParams).then((function(a) {
                        t.markList = a.rows,
                        t.total = a.total,
                        t.loading = !1,
                        a.rows && a.rows.length ? (a.rows.forEach((function(e, t) {
                            e.index = t + 1
                        }
                        )),
                        t.rectData = t.handleRectPos(a.rows),
                        e && t.annotate.updateImageRect(t.rectData.slice(0, t.rectData.length))) : (t.rectData = [],
                        e && t.annotate.updateImageRect([]))
                    }
                    ))
                },
                changeMarkType: function(e) {
                    this.form.markType = 1 === e ? 1 : 2
                },
                handleRectPos: function(e) {
                    var t = [];
                    return e.forEach((function(e) {
                        var a = e.top
                          , i = e.bottom
                          , o = []
                          , n = {
                            xMin: a.x,
                            yMin: a.y,
                            width: i.x - a.x,
                            height: i.y - a.y
                        };
                        o.push({
                            x: a.x,
                            y: a.y
                        }),
                        o.push({
                            x: i.x,
                            y: a.y
                        }),
                        o.push({
                            x: i.x,
                            y: i.y
                        }),
                        o.push({
                            x: a.x,
                            y: i.y
                        });
                        var s = {
                            content: o,
                            rectMask: n,
                            contentType: "rect"
                        };
                        t.push(s)
                    }
                    )),
                    t
                },
                handleAdd: function() {
                    this.reset(),
                    this.open = !0,
                    this.form.questionID = 0,
                    this.form.originalPageNumber = this.pageNumber,
                    this.form.newPageNumber = this.pageNumber,
                    this.form.pid = this.imgId;
                    var e = this.annotate.Arrays.imageAnnotateMemory.length
                      , t = this.annotate.Arrays.imageAnnotateMemory[e - 1];
                    this.form.markWidth = 25.4 * Math.abs(t.content[0].x - t.content[2].x) / 300,
                    this.form.markHeight = 25.4 * Math.abs(t.content[0].y - t.content[2].y) / 300,
                    this.title = "添加标引"
                },
                handleEdit: function(e) {
                    console.log("handleEdit"),
                    this.reset(),
                    this.open = !0,
                    this.form.originalPageNumber = this.pageNumber,
                    this.form.newPageNumber = this.pageNumber,
                    this.form.pid = this.imgId,
                    this.form.id = e.id,
                    this.form.questionID = e.questionID,
                    this.form.childQuestionID = e.childQuestionID,
                    this.form.newPageNumber = e.pageNumber,
                    this.form.yqId = e.yqId,
                    this.form.mId = 0 === e.isMId ? void 0 : e.mId,
                    this.title = "修改标引"
                },
                cancel: function() {
                    this.open = !1,
                    this.clearCache()
                },
                closeDialog: function() {
                    this.clearCache()
                },
                clearCache: function() {
                    this.reset();
                    var e = this.annotate.Arrays.imageAnnotateMemory.length;
                    e === this.rectData.length + 1 && this.annotate.DeleteLabel(e - 1)
                },
                reset: function() {
                    this.form = {
                        id: "",
                        pid: void 0,
                        yqId: void 0,
                        mId: void 0,
                        markType: 1,
                        questionID: this.questionID,
                        childQuestionID: void 0,
                        newPageNumber: void 0,
                        originalPageNumber: void 0,
                        markWidth: void 0,
                        markHeight: void 0,
                        top: {
                            x: 0,
                            y: 0
                        },
                        bottom: {
                            x: 0,
                            y: 0
                        }
                    },
                    this.resetForm("form")
                },
                submitForm: function() {
                    var e = this;
                    if ("" === this.form.id)
                        this.$refs["form"].validate((function(t) {
                            if (t) {
                                var a = e.annotate.Arrays.imageAnnotateMemory.length;
                                if (a) {
                                    var i = e.annotate.Arrays.imageAnnotateMemory[a - 1];
                                    if (e.form.top.x = i.content[0].x,
                                    e.form.top.y = i.content[0].y,
                                    e.form.bottom.x = i.content[2].x,
                                    e.form.bottom.y = i.content[2].y,
                                    e.form.questionID = Number(e.form.questionID),
                                    void 0 != e.form.mId && (25.4 * Math.abs(e.form.top.x - e.form.bottom.x) / 300 > 35 || 25.4 * Math.abs(e.form.top.y - e.form.bottom.y) / 300 > 35))
                                        return void e.msgError("点读ID标引矩形框长宽都必须小于35毫米,添加标引失败");
                                    e.form.originalPageNumber = Number(e.form.originalPageNumber),
                                    e.form.newPageNumber = Number(e.form.newPageNumber),
                                    Object(d["g"])(e.form).then((function(t) {
                                        if (200 === t.code) {
                                            e.msgSuccess("添加成功"),
                                            e.open = !1,
                                            e.pageNumber = e.form.newPageNumber;
                                            var a = Number(e.form.questionID);
                                            e.questionID = a,
                                            e.form.questionID = a,
                                            e.getList(!0)
                                        }
                                    }
                                    ))
                                }
                            }
                        }
                        ));
                    else if ("" != this.form.id) {
                        if (this.form.originalPageNumber = Number(this.form.originalPageNumber),
                        this.form.newPageNumber = Number(this.form.newPageNumber),
                        this.form.questionID = Number(this.form.questionID),
                        void 0 != this.form.mId && (25.4 * Math.abs(this.form.top.x - this.form.bottom.x) / 300 > 35 || 25.4 * Math.abs(this.form.top.y - this.form.bottom.y) / 300 > 35))
                            return void this.msgError("点读ID标引矩形框长宽都必须小于35毫米,修改标引失败");
                        Object(d["i"])(this.form).then((function(t) {
                            200 === t.code && (e.msgSuccess("修改成功"),
                            e.open = !1,
                            e.pageNumber = e.form.newPageNumber,
                            e.questionID = Number(e.form.questionID),
                            e.getList(!0))
                        }
                        ))
                    }
                },
                handleDelete: function(e, t) {
                    var a = this;
                    this.$confirm("确认要删除第" + e.questionID + "题的标引吗?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then((function() {
                        return Object(d["b"])(e.id)
                    }
                    )).then((function() {
                        a.msgSuccess("删除成功"),
                        a.getList(!0)
                    }
                    )).catch((function() {
                        a.msgSuccess("已取消")
                    }
                    ))
                },
                handleUpdate: function(e) {
                    console.log("handleUpdate"),
                    this.reset(),
                    this.open = !0,
                    this.form.originalPageNumber = this.pageNumber,
                    this.form.newPageNumber = this.pageNumber,
                    this.form.pid = this.imgId,
                    this.form.id = e.id,
                    this.form.questionID = e.questionID,
                    this.form.childQuestionID = e.childQuestionID,
                    this.form.newPageNumber = e.pageNumber,
                    this.form.yqId = e.yqId,
                    this.form.mId = 0 === e.isMId ? void 0 : e.mId,
                    this.form.markWidth = 25.4 * Math.abs(e.top.x - e.bottom.x) / 300,
                    this.form.markHeight = 25.4 * Math.abs(e.top.y - e.bottom.y) / 300,
                    this.title = "修改标引"
                }
            }
        }
          , u = h
          , g = (a("d960"),
        a("2877"))
          , f = Object(g["a"])(u, i, o, !1, null, "68e3a47a", null);
        t["default"] = f.exports
    },
    abef: function(e, t, a) {
        "use strict";
        a.d(t, "h", (function() {
            return o
        }
        )),
        a.d(t, "c", (function() {
            return n
        }
        )),
        a.d(t, "f", (function() {
            return s
        }
        )),
        a.d(t, "d", (function() {
            return r
        }
        )),
        a.d(t, "a", (function() {
            return c
        }
        )),
        a.d(t, "e", (function() {
            return l
        }
        )),
        a.d(t, "g", (function() {
            return m
        }
        )),
        a.d(t, "i", (function() {
            return d
        }
        )),
        a.d(t, "b", (function() {
            return h
        }
        ));
        var i = a("b775");
        function o(e) {
            return Object(i["a"])({
                url: "/v1/mark/mkplist",
                method: "get",
                params: e
            })
        }
        function n(e) {
            return Object(i["a"])({
                url: "/v1/mark/singlepage",
                method: "get",
                params: {
                    imageId: e
                },
                responseType: "arraybuffer"
            })
        }
        function s(e, t, a) {
            return Object(i["a"])({
                url: "/v1/mark/singlepageinfo",
                method: "get",
                params: {
                    imageId: e,
                    pageNumber: t,
                    identifier: a
                }
            })
        }
        function r(e, t) {
            return Object(i["a"])({
                url: "/v1/mark/firstsinglepageinfo",
                method: "get",
                params: {
                    pageId: e,
                    identifier: t
                }
            })
        }
        function c(e) {
            return Object(i["a"])({
                url: "/v1/mark/mkpdelete",
                method: "delete",
                data: {
                    id: e
                }
            })
        }
        function l(e) {
            return Object(i["a"])({
                url: "/v1/mark/marklistbypid",
                method: "get",
                params: e
            })
        }
        function m(e) {
            return Object(i["a"])({
                url: "/v1/mark/markinsert",
                method: "post",
                data: e
            })
        }
        function d(e) {
            return Object(i["a"])({
                url: "/v1/mark/markupdate",
                method: "post",
                data: e
            })
        }
        function h(e) {
            return Object(i["a"])({
                url: "/v1/mark/markdelete",
                method: "delete",
                data: {
                    id: e
                }
            })
        }
    },
    d960: function(e, t, a) {
        "use strict";
        var i = a("5eda")
          , o = a.n(i);
        o.a
    }
}]);
