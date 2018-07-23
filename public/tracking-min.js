/**
 * tracking - A modern approach for Computer Vision on the web.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.1.3
 * @link http://trackingjs.com
 * @license BSD
 */
!function (t, r) {
    t.tracking = t.tracking || {}, tracking.inherits = function (t, r) {
        function n() {
        }

        n.prototype = r.prototype, t.superClass_ = r.prototype, t.prototype = new n, t.prototype.constructor = t, t.base = function (t, n) {
            var e = Array.prototype.slice.call(arguments, 2);
            return r.prototype[n].apply(t, e)
        }
    }, tracking.initUserMedia_ = function (r, n) {
        const fullHdConstraints = {
            video: {width: {exact: 1920}, height: {exact: 1080}}
        };
        //t.navigator.mediaDevices.getUserMedia({video: !0, audio: !(!n || !n.audio)}).then(function (t) {
        t.navigator.mediaDevices.getUserMedia(fullHdConstraints).then(function (t) {
            r.srcObject = t
        })["catch"](function (t) {
            throw Error("Cannot capture user camera.")
        })
    }, tracking.isNode = function (t) {
        return t.nodeType || this.isWindow(t)
    }, tracking.isWindow = function (t) {
        return !!(t && t.alert && t.document)
    }, tracking.one = function (t, r) {
        return this.isNode(t) ? t : (r || document).querySelector(t)
    }, tracking.track = function (t, r, n) {
        if (t = tracking.one(t), !t) throw new Error("Element not found, try a different element or selector.");
        if (!r) throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");
        switch (t.nodeName.toLowerCase()) {
            case"canvas":
                return this.trackCanvas_(t, r, n);
            case"img":
                return this.trackImg_(t, r, n);
            case"video":
                return n && n.camera && this.initUserMedia_(t, n), this.trackVideo_(t, r, n);
            default:
                throw new Error("Element not supported, try in a canvas, img, or video.")
        }
    }, tracking.trackCanvas_ = function (t, r) {
        var n = this, e = new tracking.TrackerTask(r);
        return e.on("run", function () {
            n.trackCanvasInternal_(t, r)
        }), e.run()
    }, tracking.trackCanvasInternal_ = function (t, r) {
        var n = t.width, e = t.height, a = t.getContext("2d"), i = a.getImageData(0, 0, n, e);
        r.track(i.data, n, e)
    }, tracking.trackImg_ = function (t, r) {
        var n = t.width, e = t.height, a = document.createElement("canvas");
        a.width = n, a.height = e;
        var i = new tracking.TrackerTask(r);
        return i.on("run", function () {
            tracking.Canvas.loadImage(a, t.src, 0, 0, n, e, function () {
                tracking.trackCanvasInternal_(a, r)
            })
        }), i.run()
    }, tracking.trackVideo_ = function (r, n) {
        var e, a, i = document.createElement("canvas"), o = i.getContext("2d"), c = function () {
            e = r.offsetWidth, a = r.offsetHeight, i.width = e, i.height = a
        };
        c(), r.addEventListener("resize", c);
        var s, g = function () {
            s = t.requestAnimationFrame(function () {
                if (r.readyState === r.HAVE_ENOUGH_DATA) {
                    try {
                        o.drawImage(r, 0, 0, e, a)
                    } catch (t) {
                    }
                    tracking.trackCanvasInternal_(i, n)
                }
                g()
            })
        }, h = new tracking.TrackerTask(n);
        return h.on("stop", function () {
            t.cancelAnimationFrame(s)
        }), h.on("run", function () {
            g()
        }), h.run()
    }, t.URL || (t.URL = t.URL || t.webkitURL || t.msURL || t.oURL), navigator.getUserMedia || (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}(window), function () {
    tracking.EventEmitter = function () {
    }, tracking.EventEmitter.prototype.events_ = null, tracking.EventEmitter.prototype.addListener = function (t, r) {
        if ("function" != typeof r) throw new TypeError("Listener must be a function");
        return this.events_ || (this.events_ = {}), this.emit("newListener", t, r), this.events_[t] || (this.events_[t] = []), this.events_[t].push(r), this
    }, tracking.EventEmitter.prototype.listeners = function (t) {
        return this.events_ && this.events_[t]
    }, tracking.EventEmitter.prototype.emit = function (t) {
        var r = this.listeners(t);
        if (r) {
            for (var n = Array.prototype.slice.call(arguments, 1), e = 0; e < r.length; e++) r[e] && r[e].apply(this, n);
            return !0
        }
        return !1
    }, tracking.EventEmitter.prototype.on = tracking.EventEmitter.prototype.addListener, tracking.EventEmitter.prototype.once = function (t, r) {
        var n = this;
        n.on(t, function e() {
            n.removeListener(t, e), r.apply(this, arguments)
        })
    }, tracking.EventEmitter.prototype.removeAllListeners = function (t) {
        return this.events_ ? (t ? delete this.events_[t] : delete this.events_, this) : this
    }, tracking.EventEmitter.prototype.removeListener = function (t, r) {
        if ("function" != typeof r) throw new TypeError("Listener must be a function");
        if (!this.events_) return this;
        var n = this.listeners(t);
        if (Array.isArray(n)) {
            var e = n.indexOf(r);
            if (e < 0) return this;
            n.splice(e, 1)
        }
        return this
    }, tracking.EventEmitter.prototype.setMaxListeners = function () {
        throw new Error("Not implemented")
    }
}(), function () {
    tracking.Canvas = {}, tracking.Canvas.loadImage = function (t, r, n, e, a, i, o) {
        var c = this, s = new window.Image;
        s.crossOrigin = "*", s.onload = function () {
            var r = t.getContext("2d");
            t.width = a, t.height = i, r.drawImage(s, n, e, a, i), o && o.call(c), s = null
        }, s.src = r
    }
}(), function () {
    tracking.DisjointSet = function (t) {
        if (void 0 === t) throw new Error("DisjointSet length not specified.");
        this.length = t, this.parent = new Uint32Array(t);
        for (var r = 0; r < t; r++) this.parent[r] = r
    }, tracking.DisjointSet.prototype.length = null, tracking.DisjointSet.prototype.parent = null, tracking.DisjointSet.prototype.find = function (t) {
        return this.parent[t] === t ? t : this.parent[t] = this.find(this.parent[t])
    }, tracking.DisjointSet.prototype.union = function (t, r) {
        var n = this.find(t), e = this.find(r);
        this.parent[n] = e
    }
}(), function () {
    tracking.Image = {}, tracking.Image.blur = function (t, r, n, e) {
        if (e = Math.abs(e), e <= 1) throw new Error("Diameter should be greater than 1.");
        for (var a = e / 2, i = Math.ceil(e) + (1 - Math.ceil(e) % 2), o = new Float32Array(i), c = (a + .5) / 3, s = c * c, g = 1 / Math.sqrt(2 * Math.PI * s), h = -1 / (2 * c * c), k = 0, f = Math.floor(i / 2), u = 0; u < i; u++) {
            var l = u - f, m = g * Math.exp(l * l * h);
            o[u] = m, k += m
        }
        for (var d = 0; d < o.length; d++) o[d] /= k;
        return this.separableConvolve(t, r, n, o, o, !1)
    }, tracking.Image.computeIntegralImage = function (t, r, n, e, a, i, o) {
        if (arguments.length < 4) throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");
        var c;
        o && (c = tracking.Image.sobel(t, r, n));
        for (var s = 0; s < n; s++) for (var g = 0; g < r; g++) {
            var h = s * r * 4 + 4 * g, k = ~~(.299 * t[h] + .587 * t[h + 1] + .114 * t[h + 2]);
            if (e && this.computePixelValueSAT_(e, r, s, g, k), a && this.computePixelValueSAT_(a, r, s, g, k * k), i) {
                var f = h - 4 * r, u = ~~(.299 * t[f] + .587 * t[f + 1] + .114 * t[f + 2]);
                this.computePixelValueRSAT_(i, r, s, g, k, u || 0)
            }
            o && this.computePixelValueSAT_(o, r, s, g, c[h])
        }
    }, tracking.Image.computePixelValueRSAT_ = function (t, r, n, e, a, i) {
        var o = n * r + e;
        t[o] = (t[o - r - 1] || 0) + (t[o - r + 1] || 0) - (t[o - r - r] || 0) + a + i
    }, tracking.Image.computePixelValueSAT_ = function (t, r, n, e, a) {
        var i = n * r + e;
        t[i] = (t[i - r] || 0) + (t[i - 1] || 0) + a - (t[i - r - 1] || 0)
    }, tracking.Image.grayscale = function (t, r, n, e) {
        for (var a = new Uint8ClampedArray(e ? t.length : t.length >> 2), i = 0, o = 0, c = 0; c < n; c++) for (var s = 0; s < r; s++) {
            var g = .299 * t[o] + .587 * t[o + 1] + .114 * t[o + 2];
            a[i++] = g, e && (a[i++] = g, a[i++] = g, a[i++] = t[o + 3]), o += 4
        }
        return a
    }, tracking.Image.horizontalConvolve = function (t, r, n, e, a) {
        for (var i = e.length, o = Math.floor(i / 2), c = new Float32Array(r * n * 4), s = a ? 1 : 0, g = 0; g < n; g++) for (var h = 0; h < r; h++) {
            for (var k = g, f = h, u = 4 * (g * r + h), l = 0, m = 0, d = 0, v = 0, p = 0; p < i; p++) {
                var y = k, w = Math.min(r - 1, Math.max(0, f + p - o)), T = 4 * (y * r + w), x = e[p];
                l += t[T] * x, m += t[T + 1] * x, d += t[T + 2] * x, v += t[T + 3] * x
            }
            c[u] = l, c[u + 1] = m, c[u + 2] = d, c[u + 3] = v + s * (255 - v)
        }
        return c
    }, tracking.Image.verticalConvolve = function (t, r, n, e, a) {
        for (var i = e.length, o = Math.floor(i / 2), c = new Float32Array(r * n * 4), s = a ? 1 : 0, g = 0; g < n; g++) for (var h = 0; h < r; h++) {
            for (var k = g, f = h, u = 4 * (g * r + h), l = 0, m = 0, d = 0, v = 0, p = 0; p < i; p++) {
                var y = Math.min(n - 1, Math.max(0, k + p - o)), w = f, T = 4 * (y * r + w), x = e[p];
                l += t[T] * x, m += t[T + 1] * x, d += t[T + 2] * x, v += t[T + 3] * x
            }
            c[u] = l, c[u + 1] = m, c[u + 2] = d, c[u + 3] = v + s * (255 - v)
        }
        return c
    }, tracking.Image.separableConvolve = function (t, r, n, e, a, i) {
        var o = this.verticalConvolve(t, r, n, a, i);
        return this.horizontalConvolve(o, r, n, e, i)
    }, tracking.Image.sobel = function (t, r, n) {
        t = this.grayscale(t, r, n, !0);
        for (var e = new Float32Array(r * n * 4), a = new Float32Array([-1, 0, 1]), i = new Float32Array([1, 2, 1]), o = this.separableConvolve(t, r, n, a, i), c = this.separableConvolve(t, r, n, i, a), s = 0; s < e.length; s += 4) {
            var g = o[s], h = c[s], k = Math.sqrt(h * h + g * g);
            e[s] = k, e[s + 1] = k, e[s + 2] = k, e[s + 3] = 255
        }
        return e
    }, tracking.Image.equalizeHist = function (t, r, n) {
        for (var e = new Uint8ClampedArray(t.length), a = new Array(256), i = 0; i < 256; i++) a[i] = 0;
        for (var i = 0; i < t.length; i++) e[i] = t[i], a[t[i]]++;
        for (var o = a[0], i = 0; i < 256; i++) a[i] += o, o = a[i];
        for (var c = 255 / t.length, i = 0; i < t.length; i++) e[i] = a[t[i]] * c + .5 | 0;
        return e
    }
}(), function () {
    tracking.ViolaJones = {}, tracking.ViolaJones.REGIONS_OVERLAP = .5, tracking.ViolaJones.classifiers = {}, tracking.ViolaJones.detect = function (t, r, n, e, a, i, o, c) {
        var s, g = 0, h = [], k = new Int32Array(r * n), f = new Int32Array(r * n), u = new Int32Array(r * n);
        o > 0 && (s = new Int32Array(r * n)), tracking.Image.computeIntegralImage(t, r, n, k, f, u, s);
        for (var l = c[0], m = c[1], d = e * a, v = d * l | 0, p = d * m | 0; v < r && p < n;) {
            for (var y = d * i + .5 | 0, w = 0; w < n - p; w += y) for (var T = 0; T < r - v; T += y) o > 0 && this.isTriviallyExcluded(o, s, w, T, r, v, p) || this.evalStages_(c, k, f, u, w, T, r, v, p, d) && (h[g++] = {
                width: v,
                height: p,
                x: T,
                y: w
            });
            d *= a, v = d * l | 0, p = d * m | 0
        }
        return this.mergeRectangles_(h)
    }, tracking.ViolaJones.isTriviallyExcluded = function (t, r, n, e, a, i, o) {
        var c = n * a + e, s = c + i, g = c + o * a, h = g + i, k = (r[c] - r[s] - r[g] + r[h]) / (i * o * 255);
        return k < t
    }, tracking.ViolaJones.evalStages_ = function (t, r, n, e, a, i, o, c, s, g) {
        var h = 1 / (c * s), k = a * o + i, f = k + c, u = k + s * o, l = u + c, m = (r[k] - r[f] - r[u] + r[l]) * h,
            d = (n[k] - n[f] - n[u] + n[l]) * h - m * m, v = 1;
        d > 0 && (v = Math.sqrt(d));
        for (var p = t.length, y = 2; y < p;) {
            for (var w = 0, T = t[y++], x = t[y++]; x--;) {
                for (var M = 0, _ = t[y++], C = t[y++], E = 0; E < C; E++) {
                    var F, B, L, S, A = i + t[y++] * g + .5 | 0, I = a + t[y++] * g + .5 | 0, R = t[y++] * g + .5 | 0,
                        b = t[y++] * g + .5 | 0, D = t[y++];
                    _ ? (F = A - b + R + (I + R + b - 1) * o, B = A + (I - 1) * o, L = A - b + (I + b - 1) * o, S = A + R + (I + R - 1) * o, M += (e[F] + e[B] - e[L] - e[S]) * D) : (F = I * o + A, B = F + R, L = F + b * o, S = L + R, M += (r[F] - r[B] - r[L] + r[S]) * D)
                }
                var O = t[y++], N = t[y++], j = t[y++];
                w += M * h < O * v ? N : j
            }
            if (w < T) return !1
        }
        return !0
    }, tracking.ViolaJones.mergeRectangles_ = function (t) {
        for (var r = new tracking.DisjointSet(t.length), n = 0; n < t.length; n++) for (var e = t[n], a = 0; a < t.length; a++) {
            var i = t[a];
            if (tracking.Math.intersectRect(e.x, e.y, e.x + e.width, e.y + e.height, i.x, i.y, i.x + i.width, i.y + i.height)) {
                var o = Math.max(e.x, i.x), c = Math.max(e.y, i.y), s = Math.min(e.x + e.width, i.x + i.width),
                    g = Math.min(e.y + e.height, i.y + i.height), h = (o - s) * (c - g), k = e.width * e.height,
                    f = i.width * i.height;
                h / (k * (k / f)) >= this.REGIONS_OVERLAP && h / (f * (k / f)) >= this.REGIONS_OVERLAP && r.union(n, a)
            }
        }
        for (var u = {}, l = 0; l < r.length; l++) {
            var m = r.find(l);
            u[m] ? (u[m].total++, u[m].width += t[l].width, u[m].height += t[l].height, u[m].x += t[l].x, u[m].y += t[l].y) : u[m] = {
                total: 1,
                width: t[l].width,
                height: t[l].height,
                x: t[l].x,
                y: t[l].y
            }
        }
        var d = [];
        return Object.keys(u).forEach(function (t) {
            var r = u[t];
            d.push({
                total: r.total,
                width: r.width / r.total + .5 | 0,
                height: r.height / r.total + .5 | 0,
                x: r.x / r.total + .5 | 0,
                y: r.y / r.total + .5 | 0
            })
        }), d
    }
}(), function () {
    tracking.Brief = {}, tracking.Brief.N = 512, tracking.Brief.randomImageOffsets_ = {}, tracking.Brief.randomWindowOffsets_ = null, tracking.Brief.getDescriptors = function (t, r, n) {
        for (var e = new Int32Array((n.length >> 1) * (this.N >> 5)), a = 0, i = this.getRandomOffsets_(r), o = 0, c = 0; c < n.length; c += 2) for (var s = r * n[c + 1] + n[c], g = 0, h = 0, k = this.N; h < k; h++) t[i[g++] + s] < t[i[g++] + s] && (a |= 1 << (31 & h)), h + 1 & 31 || (e[o++] = a, a = 0);
        return e
    }, tracking.Brief.match = function (t, r, n, e) {
        for (var a = t.length >> 1, i = n.length >> 1, o = new Array(a), c = 0; c < a; c++) {
            for (var s = 1 / 0, g = 0, h = 0; h < i; h++) {
                for (var k = 0, f = 0, u = this.N >> 5; f < u; f++) k += tracking.Math.hammingWeight(r[c * u + f] ^ e[h * u + f]);
                k < s && (s = k, g = h)
            }
            o[c] = {
                index1: c,
                index2: g,
                keypoint1: [t[2 * c], t[2 * c + 1]],
                keypoint2: [n[2 * g], n[2 * g + 1]],
                confidence: 1 - s / this.N
            }
        }
        return o
    }, tracking.Brief.reciprocalMatch = function (t, r, n, e) {
        var a = [];
        if (0 === t.length || 0 === n.length) return a;
        for (var i = tracking.Brief.match(t, r, n, e), o = tracking.Brief.match(n, e, t, r), c = 0; c < i.length; c++) o[i[c].index2].index2 === c && a.push(i[c]);
        return a
    }, tracking.Brief.getRandomOffsets_ = function (t) {
        if (!this.randomWindowOffsets_) {
            for (var r = 0, n = new Int32Array(4 * this.N), e = 0; e < this.N; e++) n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16));
            this.randomWindowOffsets_ = n
        }
        if (!this.randomImageOffsets_[t]) {
            for (var a = 0, i = new Int32Array(2 * this.N), o = 0; o < this.N; o++) i[a++] = this.randomWindowOffsets_[4 * o] * t + this.randomWindowOffsets_[4 * o + 1], i[a++] = this.randomWindowOffsets_[4 * o + 2] * t + this.randomWindowOffsets_[4 * o + 3];
            this.randomImageOffsets_[t] = i
        }
        return this.randomImageOffsets_[t]
    }
}(), function () {
    tracking.Fast = {}, tracking.Fast.THRESHOLD = 40, tracking.Fast.circles_ = {}, tracking.Fast.findCorners = function (t, r, n, e) {
        var a = this.getCircleOffsets_(r), i = new Int32Array(16), o = [];
        void 0 === e && (e = this.THRESHOLD);
        for (var c = 3; c < n - 3; c++) for (var s = 3; s < r - 3; s++) {
            for (var g = c * r + s, h = t[g], k = 0; k < 16; k++) i[k] = t[g + a[k]];
            this.isCorner(h, i, e) && (o.push(s, c), s += 3)
        }
        return o
    }, tracking.Fast.isBrighter = function (t, r, n) {
        return t - r > n
    }, tracking.Fast.isCorner = function (t, r, n) {
        if (this.isTriviallyExcluded(r, t, n)) return !1;
        for (var e = 0; e < 16; e++) {
            for (var a = !0, i = !0, o = 0; o < 9; o++) {
                var c = r[e + o & 15];
                if (!this.isBrighter(t, c, n) && (i = !1, a === !1)) break;
                if (!this.isDarker(t, c, n) && (a = !1, i === !1)) break
            }
            if (i || a) return !0
        }
        return !1
    }, tracking.Fast.isDarker = function (t, r, n) {
        return r - t > n
    }, tracking.Fast.isTriviallyExcluded = function (t, r, n) {
        var e = 0, a = t[8], i = t[12], o = t[4], c = t[0];
        return this.isBrighter(c, r, n) && e++, this.isBrighter(o, r, n) && e++, this.isBrighter(a, r, n) && e++, this.isBrighter(i, r, n) && e++, e < 3 && (e = 0, this.isDarker(c, r, n) && e++, this.isDarker(o, r, n) && e++, this.isDarker(a, r, n) && e++, this.isDarker(i, r, n) && e++, e < 3)
    }, tracking.Fast.getCircleOffsets_ = function (t) {
        if (this.circles_[t]) return this.circles_[t];
        var r = new Int32Array(16);
        return r[0] = -t - t - t, r[1] = r[0] + 1, r[2] = r[1] + t + 1, r[3] = r[2] + t + 1, r[4] = r[3] + t, r[5] = r[4] + t, r[6] = r[5] + t - 1, r[7] = r[6] + t - 1, r[8] = r[7] - 1, r[9] = r[8] - 1, r[10] = r[9] - t - 1, r[11] = r[10] - t - 1, r[12] = r[11] - t, r[13] = r[12] - t, r[14] = r[13] - t + 1, r[15] = r[14] - t + 1, this.circles_[t] = r, r
    }
}(), function () {
    tracking.Math = {}, tracking.Math.distance = function (t, r, n, e) {
        var a = n - t, i = e - r;
        return Math.sqrt(a * a + i * i)
    }, tracking.Math.hammingWeight = function (t) {
        return t -= t >> 1 & 1431655765, t = (858993459 & t) + (t >> 2 & 858993459), 16843009 * (t + (t >> 4) & 252645135) >> 24
    }, tracking.Math.uniformRandom = function (t, r) {
        return t + Math.random() * (r - t)
    }, tracking.Math.intersectRect = function (t, r, n, e, a, i, o, c) {
        return !(a > n || o < t || i > e || c < r)
    }
}(), function () {
    tracking.Matrix = {}, tracking.Matrix.forEach = function (t, r, n, e, a) {
        a = a || 1;
        for (var i = 0; i < n; i += a) for (var o = 0; o < r; o += a) {
            var c = i * r * 4 + 4 * o;
            e.call(this, t[c], t[c + 1], t[c + 2], t[c + 3], c, i, o)
        }
    }, tracking.Matrix.sub = function (t, r) {
        for (var n = tracking.Matrix.clone(t), e = 0; e < n.length; e++) for (var a = 0; a < n[e].length; a++) n[e][a] -= r[e][a];
        return n
    }, tracking.Matrix.add = function (t, r) {
        for (var n = tracking.Matrix.clone(t), e = 0; e < n.length; e++) for (var a = 0; a < n[e].length; a++) n[e][a] += r[e][a];
        return n
    }, tracking.Matrix.clone = function (t, r, n) {
        r = r || t[0].length, n = n || t.length;
        for (var e = new Array(n), a = n; a--;) {
            e[a] = new Array(r);
            for (var i = r; i--;) e[a][i] = t[a][i]
        }
        return e
    }, tracking.Matrix.mulScalar = function (t, r) {
        for (var n = tracking.Matrix.clone(r), e = 0; e < r.length; e++) for (var a = 0; a < r[e].length; a++) n[e][a] *= t;
        return n
    }, tracking.Matrix.transpose = function (t) {
        for (var r = new Array(t[0].length), n = 0; n < t[0].length; n++) {
            r[n] = new Array(t.length);
            for (var e = 0; e < t.length; e++) r[n][e] = t[e][n]
        }
        return r
    }, tracking.Matrix.mul = function (t, r) {
        for (var n = new Array(t.length), e = 0; e < t.length; e++) {
            n[e] = new Array(r[0].length);
            for (var a = 0; a < r[0].length; a++) {
                n[e][a] = 0;
                for (var i = 0; i < t[0].length; i++) n[e][a] += t[e][i] * r[i][a]
            }
        }
        return n
    }, tracking.Matrix.norm = function (t) {
        for (var r = 0, n = 0; n < t.length; n++) for (var e = 0; e < t[n].length; e++) r += t[n][e] * t[n][e];
        return Math.sqrt(r)
    }, tracking.Matrix.calcCovarMatrix = function (t) {
        for (var r = new Array(t.length), n = 0; n < t.length; n++) {
            r[n] = [0];
            for (var e = 0; e < t[n].length; e++) r[n][0] += t[n][e] / t[n].length
        }
        for (var a = tracking.Matrix.clone(r), n = 0; n < a.length; n++) for (var e = 0; e < t[0].length - 1; e++) a[n].push(a[n][0]);
        var i = tracking.Matrix.sub(t, a), o = tracking.Matrix.transpose(i), c = tracking.Matrix.mul(o, i);
        return [c, r]
    }
}(), function () {
    tracking.EPnP = {}, tracking.EPnP.solve = function (t, r, n) {
    }
}(), function () {
    tracking.Tracker = function () {
        tracking.Tracker.base(this, "constructor")
    }, tracking.inherits(tracking.Tracker, tracking.EventEmitter), tracking.Tracker.prototype.track = function () {
    }
}(), function () {
    tracking.TrackerTask = function (t) {
        if (tracking.TrackerTask.base(this, "constructor"), !t) throw new Error("Tracker instance not specified.");
        this.setTracker(t)
    }, tracking.inherits(tracking.TrackerTask, tracking.EventEmitter), tracking.TrackerTask.prototype.tracker_ = null, tracking.TrackerTask.prototype.running_ = !1, tracking.TrackerTask.prototype.getTracker = function () {
        return this.tracker_
    }, tracking.TrackerTask.prototype.inRunning = function () {
        return this.running_
    }, tracking.TrackerTask.prototype.setRunning = function (t) {
        this.running_ = t
    }, tracking.TrackerTask.prototype.setTracker = function (t) {
        this.tracker_ = t
    }, tracking.TrackerTask.prototype.run = function () {
        var t = this;
        if (!this.inRunning()) return this.setRunning(!0), this.reemitTrackEvent_ = function (r) {
            t.emit("track", r)
        }, this.tracker_.on("track", this.reemitTrackEvent_), this.emit("run"), this
    }, tracking.TrackerTask.prototype.stop = function () {
        if (this.inRunning()) return this.setRunning(!1), this.emit("stop"), this.tracker_.removeListener("track", this.reemitTrackEvent_), this
    }
}(), function () {
    tracking.ColorTracker = function (t) {
        tracking.ColorTracker.base(this, "constructor"), "string" == typeof t && (t = [t]), t && (t.forEach(function (t) {
            if (!tracking.ColorTracker.getColor(t)) throw new Error('Color not valid, try `new tracking.ColorTracker("magenta")`.')
        }), this.setColors(t))
    }, tracking.inherits(tracking.ColorTracker, tracking.Tracker), tracking.ColorTracker.knownColors_ = {}, tracking.ColorTracker.neighbours_ = {}, tracking.ColorTracker.registerColor = function (t, r) {
        tracking.ColorTracker.knownColors_[t] = r
    }, tracking.ColorTracker.getColor = function (t) {
        return tracking.ColorTracker.knownColors_[t]
    }, tracking.ColorTracker.prototype.colors = ["magenta"], tracking.ColorTracker.prototype.minDimension = 20, tracking.ColorTracker.prototype.maxDimension = 1 / 0, tracking.ColorTracker.prototype.minGroupSize = 10, tracking.ColorTracker.prototype.calculateDimensions_ = function (t, r) {
        for (var n = -1, e = -1, a = 1 / 0, i = 1 / 0, o = 0; o < r; o += 2) {
            var c = t[o], s = t[o + 1];
            c < a && (a = c), c > n && (n = c), s < i && (i = s), s > e && (e = s)
        }
        return {width: n - a, height: e - i, x: a, y: i}
    }, tracking.ColorTracker.prototype.getColors = function () {
        return this.colors
    }, tracking.ColorTracker.prototype.getMinDimension = function () {
        return this.minDimension
    }, tracking.ColorTracker.prototype.getMaxDimension = function () {
        return this.maxDimension
    }, tracking.ColorTracker.prototype.getMinGroupSize = function () {
        return this.minGroupSize
    }, tracking.ColorTracker.prototype.getNeighboursForWidth_ = function (t) {
        if (tracking.ColorTracker.neighbours_[t]) return tracking.ColorTracker.neighbours_[t];
        var r = new Int32Array(8);
        return r[0] = 4 * -t, r[1] = 4 * -t + 4, r[2] = 4, r[3] = 4 * t + 4, r[4] = 4 * t, r[5] = 4 * t - 4, r[6] = -4, r[7] = 4 * -t - 4, tracking.ColorTracker.neighbours_[t] = r, r
    }, tracking.ColorTracker.prototype.mergeRectangles_ = function (t) {
        for (var r, n = [], e = this.getMinDimension(), a = this.getMaxDimension(), i = 0; i < t.length; i++) {
            var o = t[i];
            r = !0;
            for (var c = i + 1; c < t.length; c++) {
                var s = t[c];
                if (tracking.Math.intersectRect(o.x, o.y, o.x + o.width, o.y + o.height, s.x, s.y, s.x + s.width, s.y + s.height)) {
                    r = !1;
                    var g = Math.min(o.x, s.x), h = Math.min(o.y, s.y), k = Math.max(o.x + o.width, s.x + s.width),
                        f = Math.max(o.y + o.height, s.y + s.height);
                    s.height = f - h, s.width = k - g, s.x = g, s.y = h;
                    break
                }
            }
            r && o.width >= e && o.height >= e && o.width <= a && o.height <= a && n.push(o)
        }
        return n
    }, tracking.ColorTracker.prototype.setColors = function (t) {
        this.colors = t
    }, tracking.ColorTracker.prototype.setMinDimension = function (t) {
        this.minDimension = t
    }, tracking.ColorTracker.prototype.setMaxDimension = function (t) {
        this.maxDimension = t
    }, tracking.ColorTracker.prototype.setMinGroupSize = function (t) {
        this.minGroupSize = t
    }, tracking.ColorTracker.prototype.track = function (t, r, n) {
        var e = this, a = this.getColors();
        if (!a) throw new Error('Colors not specified, try `new tracking.ColorTracker("magenta")`.');
        var i = [];
        a.forEach(function (a) {
            i = i.concat(e.trackColor_(t, r, n, a))
        }), this.emit("track", {data: i})
    }, tracking.ColorTracker.prototype.trackColor_ = function (n, e, a, i) {
        var o, c, s, g, h, k = tracking.ColorTracker.knownColors_[i], f = new Int32Array(n.length >> 2),
            u = new Int8Array(n.length), l = this.getMinGroupSize(), m = this.getNeighboursForWidth_(e),
            d = new Int32Array(n.length), v = [], p = -4;
        if (!k) return v;
        for (var y = 0; y < a; y++) for (var w = 0; w < e; w++) if (p += 4, !u[p]) {
            for (o = 0, h = -1, d[++h] = p, d[++h] = y, d[++h] = w, u[p] = 1; h >= 0;) if (s = d[h--], c = d[h--], g = d[h--], k(n[g], n[g + 1], n[g + 2], n[g + 3], g, c, s)) {
                f[o++] = s, f[o++] = c;
                for (var T = 0; T < m.length; T++) {
                    var x = g + m[T], M = c + t[T], _ = s + r[T];
                    !u[x] && M >= 0 && M < a && _ >= 0 && _ < e && (d[++h] = x, d[++h] = M, d[++h] = _, u[x] = 1)
                }
            }
            if (o >= l) {
                var C = this.calculateDimensions_(f, o);
                C && (C.color = i, v.push(C))
            }
        }
        return this.mergeRectangles_(v)
    }, tracking.ColorTracker.registerColor("cyan", function (t, r, n) {
        var e = 50, a = 70, i = t - 0, o = r - 255, c = n - 255;
        return r - t >= e && n - t >= a || i * i + o * o + c * c < 6400
    }), tracking.ColorTracker.registerColor("magenta", function (t, r, n) {
        var e = 50, a = t - 255, i = r - 0, o = n - 255;
        return t - r >= e && n - r >= e || a * a + i * i + o * o < 19600
    }), tracking.ColorTracker.registerColor("yellow", function (t, r, n) {
        var e = 50, a = t - 255, i = r - 255, o = n - 0;
        return t - n >= e && r - n >= e || a * a + i * i + o * o < 1e4
    });
    var t = new Int32Array([-1, -1, 0, 1, 1, 1, 0, -1]), r = new Int32Array([0, 1, 1, 1, 0, -1, -1, -1])
}(), function () {
    tracking.ObjectTracker = function (t) {
        tracking.ObjectTracker.base(this, "constructor"), t && (Array.isArray(t) || (t = [t]), Array.isArray(t) && t.forEach(function (r, n) {
            if ("string" == typeof r && (t[n] = tracking.ViolaJones.classifiers[r]), !t[n]) throw new Error('Object classifier not valid, try `new tracking.ObjectTracker("face")`.')
        })), this.setClassifiers(t)
    }, tracking.inherits(tracking.ObjectTracker, tracking.Tracker), tracking.ObjectTracker.prototype.edgesDensity = .2, tracking.ObjectTracker.prototype.initialScale = 1, tracking.ObjectTracker.prototype.scaleFactor = 1.25, tracking.ObjectTracker.prototype.stepSize = 1.5, tracking.ObjectTracker.prototype.getClassifiers = function () {
        return this.classifiers
    }, tracking.ObjectTracker.prototype.getEdgesDensity = function () {
        return this.edgesDensity
    }, tracking.ObjectTracker.prototype.getInitialScale = function () {
        return this.initialScale
    }, tracking.ObjectTracker.prototype.getScaleFactor = function () {
        return this.scaleFactor
    }, tracking.ObjectTracker.prototype.getStepSize = function () {
        return this.stepSize
    }, tracking.ObjectTracker.prototype.track = function (t, r, n) {
        var e = this, a = this.getClassifiers();
        if (!a) throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');
        var i = [];
        a.forEach(function (a) {
            i = i.concat(tracking.ViolaJones.detect(t, r, n, e.getInitialScale(), e.getScaleFactor(), e.getStepSize(), e.getEdgesDensity(), a))
        }), this.emit("track", {data: i})
    }, tracking.ObjectTracker.prototype.setClassifiers = function (t) {
        this.classifiers = t
    }, tracking.ObjectTracker.prototype.setEdgesDensity = function (t) {
        this.edgesDensity = t
    }, tracking.ObjectTracker.prototype.setInitialScale = function (t) {
        this.initialScale = t
    }, tracking.ObjectTracker.prototype.setScaleFactor = function (t) {
        this.scaleFactor = t
    }, tracking.ObjectTracker.prototype.setStepSize = function (t) {
        this.stepSize = t
    }
}(), function () {
    tracking.LandmarksTracker = function () {
        tracking.LandmarksTracker.base(this, "constructor")
    }, tracking.inherits(tracking.LandmarksTracker, tracking.ObjectTracker), tracking.LandmarksTracker.prototype.track = function (t, r, n) {
        var e = tracking.ViolaJones.classifiers.face,
            a = tracking.ViolaJones.detect(t, r, n, this.getInitialScale(), this.getScaleFactor(), this.getStepSize(), this.getEdgesDensity(), e),
            i = tracking.LBF.align(t, r, n, a);
        this.emit("track", {data: {faces: a, landmarks: i}})
    }
}(), function () {
    tracking.LBF = {}, tracking.LBF.Regressor = function (t) {
        this.maxNumStages = t, this.rfs = new Array(t), this.models = new Array(t);
        for (var r = 0; r < t; r++) this.rfs[r] = new tracking.LBF.RandomForest(r), this.models[r] = tracking.LBF.RegressorData[r].models;
        this.meanShape = tracking.LBF.LandmarksData
    }, tracking.LBF.Regressor.prototype.predict = function (t, r, n, e) {
        var a = [], i = [], o = [], c = tracking.Matrix.clone(this.meanShape);
        a.push({data: t, width: r, height: n}), o.push(e), i.push(tracking.LBF.projectShapeToBoundingBox_(c, e));
        for (var s = 0; s < this.maxNumStages; s++) {
            var g = tracking.LBF.Regressor.deriveBinaryFeat(this.rfs[s], a, i, o, c);
            this.applyGlobalPrediction(g, this.models[s], i, o)
        }
        return i[0]
    }, tracking.LBF.Regressor.prototype.applyGlobalPrediction = function (t, r, n, e) {
        for (var a = 2 * n[0].length, i = new Array(a / 2), o = 0; o < a / 2; o++) i[o] = [0, 0];
        for (var o = 0; o < n.length; o++) {
            for (var c = 0; c < a; c++) {
                for (var s = 0, g = 0, h = 0; (h = t[o][g].index) != -1; g++) h <= r[c].nr_feature && (s += r[c].data[h - 1] * t[o][g].value);
                c < a / 2 ? i[c][0] = s : i[c - a / 2][1] = s
            }
            var k = tracking.LBF.similarityTransform_(tracking.LBF.unprojectShapeToBoundingBox_(n[o], e[o]), this.meanShape),
                f = (tracking.Matrix.transpose(k[0]), tracking.LBF.unprojectShapeToBoundingBox_(n[o], e[o]));
            f = tracking.Matrix.add(f, i), n[o] = tracking.LBF.projectShapeToBoundingBox_(f, e[o])
        }
    }, tracking.LBF.Regressor.deriveBinaryFeat = function (t, r, n, e, a) {
        for (var i = new Array(r.length), o = 0; o < r.length; o++) {
            var c = t.maxNumTrees * t.landmarkNum + 1;
            i[o] = new Array(c);
            for (var s = 0; s < c; s++) i[o][s] = {}
        }
        for (var g = 1 << t.maxDepth - 1, o = 0; o < r.length; o++) {
            for (var h = tracking.LBF.unprojectShapeToBoundingBox_(n[o], e[o]), k = tracking.LBF.similarityTransform_(h, a), s = 0; s < t.landmarkNum; s++) for (var f = 0; f < t.maxNumTrees; f++) {
                var u = tracking.LBF.Regressor.getCodeFromTree(t.rfs[s][f], r[o], n[o], e[o], k[0], k[1]),
                    l = s * t.maxNumTrees + f;
                i[o][l].index = g * l + u, i[o][l].value = 1
            }
            i[o][t.landmarkNum * t.maxNumTrees].index = -1, i[o][t.landmarkNum * t.maxNumTrees].value = -1
        }
        return i
    }, tracking.LBF.Regressor.getCodeFromTree = function (t, r, n, e, a, i) {
        for (var o = 0, c = 0; ;) {
            var s = Math.cos(t.nodes[o].feats[0]) * t.nodes[o].feats[2] * t.maxRadioRadius * e.width,
                g = Math.sin(t.nodes[o].feats[0]) * t.nodes[o].feats[2] * t.maxRadioRadius * e.height,
                h = Math.cos(t.nodes[o].feats[1]) * t.nodes[o].feats[3] * t.maxRadioRadius * e.width,
                k = Math.sin(t.nodes[o].feats[1]) * t.nodes[o].feats[3] * t.maxRadioRadius * e.height,
                f = a[0][0] * s + a[0][1] * g, u = a[1][0] * s + a[1][1] * g, l = Math.floor(f + n[t.landmarkID][0]),
                m = Math.floor(u + n[t.landmarkID][1]);
            l = Math.max(0, Math.min(l, r.height - 1)), m = Math.max(0, Math.min(m, r.width - 1));
            var d = a[0][0] * h + a[0][1] * k, v = a[1][0] * h + a[1][1] * k, p = Math.floor(d + n[t.landmarkID][0]),
                y = Math.floor(v + n[t.landmarkID][1]);
            p = Math.max(0, Math.min(p, r.height - 1)), y = Math.max(0, Math.min(y, r.width - 1));
            var w = Math.floor(r.data[m * r.width + l]) - Math.floor(r.data[y * r.width + p]);
            if (o = w < t.nodes[o].thresh ? t.nodes[o].cnodes[0] : t.nodes[o].cnodes[1], 1 == t.nodes[o].is_leafnode) {
                c = 1;
                for (var T = 0; T < t.leafnodes.length; T++) {
                    if (t.leafnodes[T] == o) return c;
                    c++
                }
                return c
            }
        }
        return c
    }
}(), function () {
    tracking.LBF.maxNumStages = 4, tracking.LBF.regressor_ = null, tracking.LBF.align = function (t, r, n, e) {
        null == tracking.LBF.regressor_ && (tracking.LBF.regressor_ = new tracking.LBF.Regressor(tracking.LBF.maxNumStages)), t = tracking.Image.grayscale(t, r, n, !1), t = tracking.Image.equalizeHist(t, r, n);
        var a = new Array(e.length);
        for (var i in e) {
            e[i].height = e[i].width;
            var o = {};
            o.startX = e[i].x, o.startY = e[i].y, o.width = e[i].width, o.height = e[i].height, a[i] = tracking.LBF.regressor_.predict(t, r, n, o)
        }
        return a
    }, tracking.LBF.unprojectShapeToBoundingBox_ = function (t, r) {
        for (var n = new Array(t.length), e = 0; e < t.length; e++) n[e] = [(t[e][0] - r.startX) / r.width, (t[e][1] - r.startY) / r.height];
        return n
    }, tracking.LBF.projectShapeToBoundingBox_ = function (t, r) {
        for (var n = new Array(t.length), e = 0; e < t.length; e++) n[e] = [t[e][0] * r.width + r.startX, t[e][1] * r.height + r.startY];
        return n
    }, tracking.LBF.similarityTransform_ = function (t, r) {
        for (var n = [0, 0], e = [0, 0], a = 0; a < t.length; a++) n[0] += t[a][0], n[1] += t[a][1], e[0] += r[a][0], e[1] += r[a][1];
        n[0] /= t.length, n[1] /= t.length, e[0] /= r.length, e[1] /= r.length;
        for (var i = tracking.Matrix.clone(t), o = tracking.Matrix.clone(r), a = 0; a < t.length; a++) i[a][0] -= n[0], i[a][1] -= n[1], o[a][0] -= e[0], o[a][1] -= e[1];
        var c, s, g, h, k = tracking.Matrix.calcCovarMatrix(i);
        c = k[0], g = k[1], k = tracking.Matrix.calcCovarMatrix(o), s = k[0], h = k[1];
        var f = Math.sqrt(tracking.Matrix.norm(c)), u = Math.sqrt(tracking.Matrix.norm(s)), l = f / u;
        i = tracking.Matrix.mulScalar(1 / f, i), o = tracking.Matrix.mulScalar(1 / u, o);
        for (var m = 0, d = 0, a = 0; a < t.length; a++) m = m + i[a][1] * o[a][0] - i[a][0] * o[a][1], d = d + i[a][0] * o[a][0] + i[a][1] * o[a][1];
        var v = Math.sqrt(m * m + d * d), p = m / v, y = d / v, w = [[y, -p], [p, y]];
        return [w, l]
    }, tracking.LBF.RandomForest = function (t) {
        this.maxNumTrees = tracking.LBF.RegressorData[t].max_numtrees, this.landmarkNum = tracking.LBF.RegressorData[t].num_landmark, this.maxDepth = tracking.LBF.RegressorData[t].max_depth, this.stages = tracking.LBF.RegressorData[t].stages, this.rfs = new Array(this.landmarkNum);
        for (var r = 0; r < this.landmarkNum; r++) {
            this.rfs[r] = new Array(this.maxNumTrees);
            for (var n = 0; n < this.maxNumTrees; n++) this.rfs[r][n] = new tracking.LBF.Tree(t, r, n)
        }
    }, tracking.LBF.Tree = function (t, r, n) {
        var e = tracking.LBF.RegressorData[t].landmarks[r][n];
        this.maxDepth = e.max_depth, this.maxNumNodes = e.max_numnodes, this.nodes = e.nodes, this.landmarkID = e.landmark_id, this.numLeafnodes = e.num_leafnodes, this.numNodes = e.num_nodes, this.maxNumFeats = e.max_numfeats, this.maxRadioRadius = e.max_radio_radius, this.leafnodes = e.id_leafnodes
    }
}();