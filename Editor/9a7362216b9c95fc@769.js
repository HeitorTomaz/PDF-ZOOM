import define1 from "./39b6e54e795b8eea@476.js";

function _1(md){return(
md`# 2D Geometry Utils`
)}

function _2(md){return(
md`## Vectors and Points

These are both represented by instances of class \`Vector\``
)}

function _Vector()
{
  // Determinant of a 3x3 matrix
  let det = (t00, t01, t02, t10, t11, t12, t20, t21, t22) =>
    t00 * (t11 * t22 - t12 * t21) +
    t01 * (t12 * t20 - t10 * t22) +
    t02 * (t10 * t21 - t11 * t20);

  class Vector {
    constructor(x = 0, y = 0) {
      [this.x, this.y] = [x, y];
    }
    array() {
      return [this.x, this.y];
    }
    clone() {
      // A copy of this vector
      return new Vector(this.x, this.y);
    }
    mag() {
      // Magnitude (length)
      return Math.sqrt(this.dot(this));
    }
    set(other) {
      // Set from another vector
      [this.x, this.y] = [other.x, other.y];
    }
    add(v) {
      // Vector sum
      return new Vector(this.x + v.x, this.y + v.y);
    }
    sub(v) {
      // Vector subtraction
      return new Vector(this.x - v.x, this.y - v.y);
    }
    dist(q) {
      // Distance to point
      return this.sub(q).mag();
    }
    dot(q) {
      // Dot product
      return this.x * q.x + this.y * q.y;
    }
    angle(v) {
      // Returns the angle between this vector and v
      return Math.acos(
        Math.min(Math.max(this.dot(v) / this.mag() / v.mag(), -1), 1)
      );
    }
    signedAngle(v) {
      // Returns the _signed_ angle between this vector and v
      // so that a rotation of this by angle makes it colinear with v
      let a = this.angle(v);
      if (new Vector(0, 0).orient(this, v) > 0) return -a;
      return a;
    }
    scale(alpha) {
      // Multiplication by scalar
      return new Vector(this.x * alpha, this.y * alpha);
    }
    rotate(angle) {
      // Returns this vector rotated by angle radians
      let [c, s] = [Math.cos(angle), Math.sin(angle)];
      return new Vector(c * this.x - s * this.y, s * this.x + c * this.y);
    }
    mix(q, alpha) {
      // this vector * (1-alpha) + q * alpha
      return new Vector(
        this.x * (1 - alpha) + q.x * alpha,
        this.y * (1 - alpha) + q.y * alpha
      );
    }
    normalize() {
      // this vector normalized
      return this.scale(1 / this.mag());
    }
    distSegment(p, q) {
      // Distance to line segment
      var s = p.dist(q);
      if (s < 0.00001) return this.dist(p);
      var v = q.sub(p).scale(1.0 / s);
      var u = this.sub(p);
      var d = u.dot(v);
      if (d < 0) return this.dist(p);
      if (d > s) return this.dist(q);
      return p.mix(q, d / s).dist(this);
    }
    orient(p, q) {
      // Returns the orientation of triangle (this,p,q)
      return Math.sign(det(1, 1, 1, this.x, p.x, q.x, this.y, p.y, q.y));
    }
  }
  return Vector;
}


function _Vec(Vector){return(
(x,y)=>new Vector(x,y)
)}

function _5(md){return(
md`## 2D Rays`
)}

function _Ray(){return(
class Ray {
  constructor (p,v) {
    // p is the source point and v is the ray direction
    [this.p,this.v] = [p,v];
  }
  point (t) {
    // Assuming the ray describes a parametric line p + tv, it returns 
    // the point at the given t
    return this.p.add(this.v.scale(t));
  }
  intersectRay (other) {
    // Intersection with another ray. Returns [t,u], i.e., 
    // the parameters for the intersection point in both rays parametric
    // space. If no intersection, returns false
    let [p_0, v_0] = [this.p.x, this.v.x];
    let [p_1, v_1] = [this.p.y, this.v.y];    
    let [P_0, V_0] = [other.p.x, other.v.x];
    let [P_1, V_1] = [other.p.y, other.v.y];
    let den = v_0 * V_1 - v_1 * V_0;
    if (Math.abs(den) <= Number.EPSILON) return false;
    let t = (V_1*(P_0 - p_0) + p_1*V_0 - P_1*V_0)/den;
    let u = (v_1*(P_0 - p_0) + p_1*v_0 - P_1*v_0)/den;
    return [t,u]
  }
  intersectSegment (a,b) {
    // Intersection with line segment ab. Returns the value
    // of the parameter for the intersection or a negative
    // value if no intersection
    let R = new Ray(a, b.sub(a));
    let result = this.intersectRay (R);
    if (result == false) return false;
    let [t,u] = result;
    if (t > 0 && u >= 0 && u <= 1) return t;
    return -1;
  }
}
)}

function _7(md){return(
md`## Binary Heap

(needed for the implementation of the Douglas-Peucker-Ramer curve simplification algorithm)`
)}

function _BinaryHeap()
{
  //
  // A binary heap (from eloquentjavascript.net).
  // By default, implements a min heap. By defining scoreFunction
  // other behaviors can be implemented. For instance function (x) { return -x } can
  // be used to define a max heap.
  //
  function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction || function (x) { return x };
  }

  BinaryHeap.prototype = {

    //
    // Adds a new element to the heap
    //
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
      // Allow it to bubble up.
      this.bubbleUp(this.content.length - 1);
    },

    //
    // Removes the top of the heap and returns it
    //
    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it sink down.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },

    // 
    // Removes a given value from the heap.
    //
    remove: function(node) {
      var length = this.content.length;
      // To remove a value, we must search through the array to find
      // it.
      for (var i = 0; i < length; i++) {
        if (this.content[i] != node) continue;
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        // If the element we popped was the one we needed to remove,
        // we're done.
        if (i == length - 1) break;
        // Otherwise, we replace the removed element with the popped
        // one, and allow it to float up or sink down as appropriate.
        this.content[i] = end;
        this.bubbleUp(i);
        this.sinkDown(i);
        break;
      }
    },

    //
    // Returns the number of elements of the heap
    //
    size: function() {
      return this.content.length;
    },

    //
    // Moves element at position n towards the top as necessary
    bubbleUp: function(n) {
      // Fetch the element that has to be moved.
      var element = this.content[n], score = this.scoreFunction(element);
      // When at 0, an element can not go up any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
        parent = this.content[parentN];
        // If the parent has a lesser score, things are in order and we
        // are done.
        if (score >= this.scoreFunction(parent))
          break;

        // Otherwise, swap the parent with the current element and
        // continue.
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
    },

    //
    // Moves element at position n towards the bottom as necessary
    sinkDown: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

      while(true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2, child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore)
            swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score))
            swap = child2N;
        }

        // No need to swap further, we are done.
        if (swap == null) break;

        // Otherwise, swap and continue.
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
    }
  } 
  
  return BinaryHeap
}


function _9(md){return(
md`## Curve`
)}

function _Curve(Vec,MBR,CatmullRom,BinaryHeap)
{
  // A curve is an array of points
  class Curve extends Array {
    constructor(...args) {
      super(...args);
    }

    // Returns an array with the same size as this curve where each element
    // is the total arc length at that point
    arcLength() {
      let q = this[0];
      let r = 0;
      let per = [];
      per[0] = 0;
      for (let i = 1; i < this.length; i++) {
        var p = this[i];
        r += p.dist(q);
        per[i] = r;
        q = p;
      }
      return per;
    }

    // Total length of the curve
    perimeter() {
      return this.arcLength()[this.length - 1];
    }

    // Returns the area enclosed by the curve
    area() {
      let s = 0.0;
      for (let i = 0; i < this.length; i++) {
        let j = (i + 1) % this.length;
        s += this[i].x * this[j].y;
        s -= this[i].y * this[j].x;
      }
      return s;
    }

    // Centroid of the curve
    centroid() {
      let p = Vec();
      for (let q of this) {
        p.x += q.x;
        p.y += q.y;
      }
      p.x /= this.length;
      p.y /= this.length;
      return p;
    }

    // A minimum bounding rectangle for the curve
    mbr() {
      let r = new MBR();
      for (let p of this) r.add(p);
      return r;
    }

    // Returns true if this curve (assuming it represents a closed simple polygon)
    // contains point p.
    contains(point) {
      let n = this.length,
        { x: x0, y: y0 } = this[n - 1],
        { x, y } = point,
        x1,
        y1,
        inside = false;

      for (let { x: x1, y: y1 } of this) {
        if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1)
          inside = !inside;
        x0 = x1;
        y0 = y1;
      }

      return inside;
    }

    // Returns a subsampled version of this curve, where tol is
    // the maximum allowed Douglas Peucker distance and count is the
    // maximum number of points allowed
    subsample(tol = 0, count = 1e10) {
      let rank = douglasPeuckerRank(this, tol);
      var r = new Curve();
      for (let i = 0; i < this.length; i++) {
        if (rank[i] != undefined && rank[i] < count) {
          r.push(this[i]);
        }
      }
      return r;
    }

    // Returns a chaikin subsampled version of this curve
    chaikin(closed = false) {
      let r = new Curve();
      let [q, i] = closed ? [this[this.length - 1], 0] : [this[0], 1];
      for (; i < this.length; i++) {
        let p = this[i];
        let e = p.sub(q);
        if (closed || i != 1) r.push(q.add(e.scale(0.25)));
        else r.push(q);
        if (closed || i + 1 < this.length) r.push(q.add(e.scale(0.75)));
        else r.push(p);
        q = p;
      }
      return r;
    }

    // Returns another curve resampled by arc length with n points
    resample(n, closed = false) {
      if (closed) {
        n++;
        this.push(this[0]);
      }
      let per = this.arcLength();
      let len = per[per.length - 1];
      let dlen = len / (n - 1);
      let p = this[0];
      let r = new Curve();
      r.push(p.clone());
      let j = 0;
      for (let i = 1; i < n; i++) {
        let d = dlen * i;
        while (j + 1 < this.length - 1 && per[j + 1] < d) j++;
        let rate = per[j + 1] - per[j];
        let alpha = rate == 0 ? 0 : (d - per[j]) / rate;
        let pt = this[j].mix(this[j + 1], alpha);
        r.push(pt);
      }
      if (closed) {
        this.pop();
        r.pop();
      }
      return r;
    }

    // Returns a resampling of this curve with n points where the original points are considered
    // control points. If not closed, the first and last points are considered twice so that
    // the catmull-rom spline interpolates them. If closed, the first and last points are also
    // considered twice, but in the opposite order. The tension parameter controls the spline interpolation
    splineResample(n, closed = false, tension = 0.5) {
      let p = (closed ? [] : [this[0]]).concat(this);
      if (!closed) p.push(this[this.length - 1]);
      let cr = new CatmullRom(...p);
      cr.tension = tension;
      let r = new Curve();
      let f = closed ? this.length / (n - 1) : (this.length - 1) / (n - 1);
      for (let i = 0; i < n; i++) {
        let u = i * f;
        r.push(cr.point(u));
      }
      return r;
    }
  }

  // Creates a Douglas Peucker Item, which
  // represents a span of a polyline and the farthest element from the
  // line segment connecting the first and the last element of the span.
  // Poly is an array of points, first is the index of the first element of the span,
  // and last the last element.
  function dpItem(first, last, poly) {
    var dist = 0;
    var farthest = first + 1;
    var a = poly[first];
    var b = poly[last];

    for (var i = first + 1; i < last; i++) {
      var d = poly[i].distSegment(a, b);
      if (d > dist) {
        dist = d;
        farthest = i;
      }
    }

    return {
      first: first,
      last: last,
      farthest: farthest,
      dist: dist
    };
  }

  // Returns an array of ranks of vertices of a polyline according to the
  // generalization order imposed by the Douglas Peucker algorithm.
  // Thus, if the i'th element has value k, then vertex i would be the (k+1)'th
  // element to be included in a generalization (simplification) of this polyline.
  // Does not consider vertices farther than tol. Disconsidered
  // vertices are left undefined in the result.
  function douglasPeuckerRank(poly, tol) {
    // A priority queue of intervals to subdivide, where top priority is biggest dist
    var pq = new BinaryHeap(function (dpi) {
      return -dpi.dist;
    });

    // The result vector
    var r = [];

    // Put the first and last vertices in the result
    r[0] = 0;
    r[poly.length - 1] = 1;

    // Add first interval to pq
    if (poly.length <= 2) {
      return r;
    }
    pq.push(dpItem(0, poly.length - 1, poly));

    // The rank counter
    var rank = 2;

    // Recursively subdivide up to tol
    while (pq.size() > 0) {
      var item = pq.pop();
      if (item.dist < tol) break; // All remaining points are closer
      r[item.farthest] = rank++;
      if (item.farthest > item.first + 1) {
        pq.push(dpItem(item.first, item.farthest, poly));
      }
      if (item.last > item.farthest + 1) {
        pq.push(dpItem(item.farthest, item.last, poly));
      }
    }

    return r;
  }

  return Curve;
}


function _11(md){return(
md`### Curve demo`
)}

function _12(html,curve,vertexCount,tolerance,md)
{
  let resample = html`<button>Resample</button>`;
  resample.onclick = () => {
    curve.splice(0, curve.length, ...curve.resample(vertexCount));
  };
  let subsample = html`<button>Subsample</button>`;
  subsample.onclick = () => {
    curve.splice(0, curve.length, ...curve.subsample(tolerance, vertexCount));
  };
  let spline = html`<button>Spline Resample</button>`;
  spline.onclick = () => {
    curve.splice(0, curve.length, ...curve.splineResample(vertexCount));
  };
  let chaikin = html`<button>Chaikin Resample</button>`;
  chaikin.onclick = () => {
    curve.splice(0, curve.length, ...curve.chaikin());
  };
  return md`${resample} ${spline} ${subsample} ${chaikin}`;
}


function _13(md,bindSliderNumber,$0,$1)
{
  return md`tolerance:${bindSliderNumber({min:1,max:100,step:1},$0)}
  vertices:${bindSliderNumber({min:2,max:200,step:1},$1)}`
}


function* _14(width,DOM,Vec,curve)
{
  let height = width*9/16;
  const canvas = DOM.canvas(width, height,1);
  const ctx = canvas.getContext("2d");
  let dragStart = null;
  
  canvas.oncontextmenu = function (e) {
    e.preventDefault();
  }
  
  canvas.onmousedown = function (e) {
    let p = Vec(e.offsetX,e.offsetY);
    if (e.buttons & 1) {
      curve.length = 0;
      curve.push(p)
    }
    else {
      if (curve.contains(p)) {
        dragStart = p;
      }
      else {
        dragStart = null
      }
    }
  }
  
  canvas.onmousemove = function (e) {
    let p = Vec(e.offsetX,e.offsetY);
    if (e.buttons & 1) {
      curve.push(p)
    }
    else if ((e.buttons & 6) && dragStart) {
      let v = p.sub(dragStart);
      for (let q of curve) {
        q.x += v.x;
        q.y += v.y;
      }
      dragStart = p;
    }
  }
 
  while(true) {
    ctx.lineWidth = 1;
    ctx.clearRect(0,0,width,height)
    ctx.strokeStyle = "black";
    if (curve.length > 0) {
      ctx.beginPath()
      ctx.moveTo(curve[0].x,curve[0].y);
      for (let i = 1; i < curve.length; i++) ctx.lineTo(curve[i].x,curve[i].y)
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,0,0,0.5)';
      for (let {x,y} of curve) {
        ctx.beginPath();
        ctx.arc(x,y,4,0,2*Math.PI);
        ctx.fill()
      }
    }
    yield canvas;
  }
}


function _curve(Curve,Vec){return(
new Curve(Vec(100,100),Vec(300,300),Vec(500,200))
)}

function _vertexCount(View){return(
new View (100)
)}

function _tolerance(View){return(
new View (5)
)}

function _18(md){return(
md`## Cubic Bézier Curves

Represented by instances of class \`Bezier\``
)}

function _Bezier(){return(
class Bezier { // Cubic bézier
  
  constructor (p0,p1,p2,p3) { // The four control points
    this.p = [p0,p1,p2,p3]
  }
  
  point (t) { // Point at t
    var [p0,p1,p2,p3] = this.p;
    var [p01,p11,p21] = [p0.mix(p1,t),p1.mix(p2,t),p2.mix(p3,t)];
    var [p02,p12] = [p01.mix(p11,t),p11.mix(p21,t)];
    return p02.mix(p12,t)
  }
  
  tangent(t) { // Unit tangent vector at t
    var [p0,p1,p2,p3] = this.p;
    var [p01,p11,p21] = [p0.mix(p1,t),p1.mix(p2,t),p2.mix(p3,t)];
    var [p02,p12] = [p01.mix(p11,t),p11.mix(p21,t)];
    return p12.sub(p02).normalize()
  }
  
  draw (ctx) { // Draw on a canvas 2D context
    var [p0,p1,p2,p3] = this.p;
    ctx.beginPath();
    ctx.moveTo(p0.x,p0.y);
    ctx.bezierCurveTo(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
    ctx.stroke();
  }
    
}
)}

function _20(md){return(
md`### Bézier demo`
)}

function _21(width,DOM,Bezier,bezierControlPoints,Vec)
{
  let height = width*9/16;
  const canvas = DOM.canvas(width, height);
  const ctx = canvas.getContext("2d");
  let refresh = () => {
    let bez = new Bezier(...bezierControlPoints);
    ctx.clearRect(0,0,width,height)
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";  bez.draw(ctx);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "green";
    for (let q of bez.p) {
      ctx.beginPath();
      ctx.moveTo (q.x-5,q.y);
      ctx.lineTo (q.x+5,q.y);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(bez.p[0].x,bez.p[0].y);
    ctx.lineTo(bez.p[1].x,bez.p[1].y);
    ctx.lineTo(bez.p[2].x,bez.p[2].y);
    ctx.lineTo(bez.p[3].x,bez.p[3].y);
    ctx.stroke();
  }
  
  let selPoint = null;
  let mouse = null;
  canvas.onmousedown = (e) => {
    let p = Vec(e.offsetX,e.offsetY);
    selPoint = null;
    for (let q of bezierControlPoints) {
      if (q.dist(p)<10) selPoint=q
    }
    mouse = p
  }
  
  canvas.onmousemove = (e) => {
    if (selPoint && e.buttons) {
      let p = Vec(e.offsetX,e.offsetY);
      let d = p.sub(mouse)
      selPoint.x += d.x;
      selPoint.y += d.y;
      refresh()
      mouse = p
    }
  }
  
  refresh()
  return canvas;
}


function _bezierControlPoints(width,Vec)
{
  let height = width*9/16;
  return [Vec(width/5,height/2),
          Vec(2*width/5,height/4),
          Vec(3*width/5,3*height/4),
          Vec(4*width/5,height/2)]
}


function _23(md){return(
md`## Catmull-Rom splines`
)}

function _CatmullRom(Vector){return(
class CatmullRom {

  set tension(t) {
    this.tau = t; 
  }
  
  get tension() {
    return typeof this.tau === 'undefined' ? 0.5 : this.tau
  }
  
  constructor (...controlPoints) {
    this.p = controlPoints;
  }
  
  _blendFactors (u) {
    let u1 = u;
    let u2 = u*u;
    let u3 = u2*u;
    let tau = this.tension;
    return [ -tau * u1 + 2 * tau * u2 - tau * u3,
            1 + (tau-3) * u2 + (2 - tau) * u3,
            tau * u1 + (3 - 2*tau) * u2 + (tau - 2) * u3,
            -tau * u2 + tau * u3];
  }

  point (u) {
    let i = ~~u;
    u = u%1;
    let n = this.p.length;
    let [p0,p1,p2,p3] = [this.p[i%n], this.p[(i+1)%n], 
                         this.p[(i+2)%n], this.p[(i+3)%n]];
    let [b0,b1,b2,b3] = this._blendFactors (u);
    return new Vector (p0.x*b0+p1.x*b1+p2.x*b2+p3.x*b3,
                       p0.y*b0+p1.y*b1+p2.y*b2+p3.y*b3);
  }
}
)}

function _25(md){return(
md`### Catmull-Rom splines demo`
)}

function _26(md,bindSliderNumber,$0,bindCheckbox,$1){return(
md`Tension: ${bindSliderNumber({min:0,max:1,step:0.1},$0)} &nbsp; &nbsp; &nbsp;
${bindCheckbox("",$1)} closed`
)}

function* _27(width,DOM,CatmullRom,catmullControlPoints,tension,closed,Vec)
{
  let height = width*9/16;
  const canvas = DOM.canvas(width, height);
  const ctx = canvas.getContext("2d");
  
  let refresh = () => {
    let bez = new CatmullRom(...catmullControlPoints);
    bez.tension = tension;
    ctx.clearRect(0,0,width,height)
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";  
    let [min,max] = closed ? [0,400]:[0,100];
    let p = bez.point(min/100);
    ctx.beginPath()
    ctx.moveTo(p.x,p.y);
    for (let i = min; i < max; i++) {
      p = bez.point(i/100);
      ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "green";
    for (let q of bez.p) {
      ctx.beginPath();
      ctx.moveTo (q.x-5,q.y);
      ctx.lineTo (q.x+5,q.y);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(bez.p[0].x,bez.p[0].y);
    ctx.lineTo(bez.p[1].x,bez.p[1].y);
    ctx.lineTo(bez.p[2].x,bez.p[2].y);
    ctx.lineTo(bez.p[3].x,bez.p[3].y);
    ctx.stroke();
  }
  refresh()

  let selPoint = null;
  let mouse = null;
  canvas.onmousedown = (e) => {
    let p = Vec(e.offsetX,e.offsetY);
    selPoint = null;
    for (let q of catmullControlPoints) {
      if (q.dist(p)<10) selPoint=q
    }
    mouse = p
  }
  
  canvas.onmousemove = (e) => {
    if (selPoint && e.buttons) {
      let p = Vec(e.offsetX,e.offsetY);
      let d = p.sub(mouse)
      selPoint.x += d.x;
      selPoint.y += d.y;
      refresh()
      mouse = p
    }
  }
  
  yield canvas;
}


function _catmullControlPoints(width,Vec)
{
  let height = width*9/16;
  return [Vec(width/5,height/2),
          Vec(2*width/5,height/4),
          Vec(3*width/5,3*height/4),
          Vec(4*width/5,height/2)]
}


function _closed(View){return(
new View(true)
)}

function _tension(View){return(
new View(0.5)
)}

function _31(md){return(
md`## Transformation matrices`
)}

function _Matrix(Vec){return(
class Matrix {
  // Constructor from elements specified in column-wise order, i.e., a and b are the elements in the first
  // columnm, c,d are the elements in the second column and e,f the elements in the third column
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    [this.a, this.b, this.c, this.d, this.e, this.f] = [a, b, c, d, e, f];
  }

  // Builds a translation matrix
  static translate(dx = 0, dy = 0) {
    return new Matrix(1, 0, 0, 1, dx, dy);
  }

  // Builds a scale matrix
  static scale(sx = 1, sy = 1) {
    return new Matrix(sx, 0, 0, sy);
  }

  // Builds a shear (skew) matrix
  static shear(sx = 0, sy = 0) {
    return new Matrix(1, sx, sy, 1);
  }

  // Builds a rotation matrix
  static rotate(angle = 0) {
    let [s, c] = [Math.sin(angle), Math.cos(angle)];
    return new Matrix(c, s, -s, c);
  }

  // Returns point p transformed by this matrix (assumes p is a point)
  apply(p) {
    return Vec(
      this.a * p.x + this.c * p.y + this.e,
      this.b * p.x + this.d * p.y + this.f
    );
  }

  // Returns point p transformed by this matrix (assumes p is a point)
  applyPoint(p) {
    return Vec(
      this.a * p.x + this.c * p.y + this.e,
      this.b * p.x + this.d * p.y + this.f
    );
  }

  // Returns vector v transformed by this matrix (assumes p is a point)
  applyVector(v) {
    return Vec(this.a * v.x + this.c * v.y, this.b * v.x + this.d * v.y);
  }

  // Returns this multiplied by m
  mult(m) {
    return new Matrix(
      this.a * m.a + this.c * m.b,
      this.b * m.a + this.d * m.b,
      this.a * m.c + this.c * m.d,
      this.b * m.c + this.d * m.d,
      this.a * m.e + this.c * m.f + this.e,
      this.b * m.e + this.d * m.f + this.f
    );
  }

  // Returns the inverse matrix
  inverse() {
    let { a, b, c, d, e, f } = this;
    let det = a * d - b * c;
    if (!det) {
      return null;
    }
    det = 1.0 / det;
    return new Matrix(
      d * det,
      -b * det,
      -c * det,
      a * det,
      (c * f - d * e) * det,
      (b * e - a * f) * det
    );
  }
}
)}

function _33(md){return(
md`### Matrix Demo`
)}

function _matrixDemoUI(T){return(
T.UI()
)}

function _matrixDemoButtons(html,$0)
{
  let reset = html`<button>Reset</button>`; 
  reset.onclick = () => {
    $0.value = $0.value.reset()
  }
  let translate = html`<button>+ Translate</button>`; 
  translate.onclick = () => {
    $0.value = $0.value.addTranslate()
  }
  let scale = html`<button>+ Scale</button>`; 
  scale.onclick = () => {
    $0.value = $0.value.addScale()
  }
  let rotate = html`<button>+ Rotate</button>`; 
  rotate.onclick = () => {
    $0.value = $0.value.addRotate()
  }
  let shear = html`<button>+ Shear</button>`; 
  shear.onclick = () => {
    $0.value = $0.value.addShear()
  }
  return html`${translate} ${scale} ${rotate} ${shear} ${reset}`
}


function _36(tcount,width,DOM,T)
{
  tcount;
  let height = width*9/16;
  const canvas = DOM.canvas(width, height);
  const ctx = canvas.getContext("2d");
  
  ctx.translate(width/2-50,height/2-50);
  ctx.font = '20px serif';
  ctx.clearRect(-width/2+50,-height/2+50,width,height)
  ctx.beginPath()
  ctx.moveTo(0,0);
  ctx.lineTo(100,0)
  ctx.moveTo(0,0)
  ctx.lineTo(0,100)
  ctx.moveTo(0,0)
  ctx.arc (0,0,5,0,Math.PI*2)
  ctx.stroke()
  ctx.fill()
  ctx.fillText('y',-15,110)
  ctx.fillText('x',110, -10)
  let m = T.matrix();
  ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  ctx.beginPath()
  ctx.arc(50,50,40,0,Math.PI*2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(50,50,30,Math.PI/4,3*Math.PI/4)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(35,35,4,0,Math.PI*2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(65,35,4,0,Math.PI*2)
  ctx.stroke()
  ctx.globalAlpha = 0.2
  ctx.fillRect (0,0,100,100)
  return ctx.canvas
}


function _matrix(tcount,html,T)
{
  tcount;
  return html`<p>Matrix: <\p> ${T.tex()}`
}


function _Transform(html,Vec,Matrix,tex)
{
  
  function Slider (options={}) {
    let {title="", min=-100, max=100, step=1, size="20em", value=0, callback=()=>0 } = options;
    let input = html`<input type=range min=${min} max=${max} step=${step} style='width:${size}'>`;
    let output = html`<output>${value}</output>`;
    input.value = value;
    input.oninput = (e) => {
      value = input.value;
      output.value = value
      callback(value)
    }
    return html`${title}: ${input} ${output}`;
  }
  
  function XYSlider (options) {
    let {title="", min=-100, max=100, step=1, size="10em", value=Vec(0,0), callback=()=>0 } = options;
    let xslider = Slider({title:"x", min:min, max:max, step:step, value:value.x, 
                          callback : x=> {value.x = +x; callback(value) }});
    let yslider = Slider({title:"y", min:min, max:max, step:step, value:value.y, 
                          callback : y=> {value.y = +y; callback(value) }});
    return html`${title} &nbsp; ${xslider} ,&nbsp; ${yslider}`;
  } 
  
  function matrixTex (m) {
    let fmt = (x) => x.toFixed(4) == x ? x : x.toFixed(4);
    return `\\begin{bmatrix}
    ${fmt(m.a)} & ${fmt(m.c)} & ${fmt(m.e)} \\\\
    ${fmt(m.b)} & ${fmt(m.d)} & ${fmt(m.f)} \\\\
    0 & 0 & 1 
    \\end{bmatrix}`
  }
  
  class Transform {
  
    constructor (callback = (t) => {}) {
      this.callback = callback;
      this.matrices = [];
      this.sliders = [];
    }
    
    reset () {
      this.matrices = [];
      this.sliders = [];
      this.callback(this);
      return this
    }

    addTranslate () {
      let i = this.matrices.length;
      this.matrices.push (new Matrix())
      this.sliders.push (XYSlider({title : "Translate ", min:-100, max:100, step:1, value:Vec(0,0),
                    callback : t => { this.matrices[i] = Matrix.translate(t.x,t.y); this.callback(this) }}));
      return this;
    }

    addScale() {
       let i = this.matrices.length;
      this.matrices.push (new Matrix())
      this.sliders.push (XYSlider({title : "Scale ", min:0.2, max:4, step:0.2, value:Vec(1,1), 
                     callback: s => { this.matrices[i] = Matrix.scale(s.x,s.y); this.callback(this) }}));
      return this;
    }
    
    addShear() {
      let i = this.matrices.length;
      this.matrices.push (new Matrix())
      this.sliders.push (XYSlider({title : "Shear ", min:-4, max:4, step:0.2, value:Vec(0,0), 
                     callback: s => { this.matrices[i] = Matrix.shear(s.x,s.y); this.callback(this) }}));
      return this;
    }

    addRotate() {
      let i = this.matrices.length;
      this.matrices.push (new Matrix())
      this.sliders.push (Slider({title:"Rotate", min:-180, max:180, step:5, value:0, 
                          callback : a => { this.matrices[i] = Matrix.rotate(Math.PI*a/180);
                                            this.callback(this) }}));
      return this;
    }                       

    UI () {
      let ui = html`<div></div>`;
      for (let slider of this.sliders) {
        ui.append(slider)
        ui.append(html`<br>`)
      }
      return ui
    }
    
    matrix() {
      if (this.matrices.length == 0) return new Matrix()
      if (this.matrices.length == 1) return this.matrices[0];
      return this.matrices.reduce((a,b) => a.mult(b))
    }
      
    tex() {
      if (this.matrices.length < 2) return tex`${matrixTex(this.matrix())}`;
      return tex`${(this.matrices.map(matrixTex)).join("\\times")+"="+matrixTex(this.matrix())}`;
    }  
  }
  
  return Transform

}


function _T(Transform,$0){return(
new Transform(() => { $0.value++ } )
)}

function _tcount(){return(
0
)}

function _41(md){return(
md`## Minimum Bounding Rectangles
Represented by instances of class \`MBR\``
)}

function _MBR(Vector){return(
class MBR {
  // Minimum Bounding Rectangle

  constructor() {
    // MBR for a variable number of points
    this.min = new Vector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    this.max = new Vector(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    for (let p of arguments) this.add(p);
  }

  valid() {
    // Whether this is a valid MBR
    return this.min.x <= this.max.x && this.min.y <= this.max.y;
  }

  size() {
    // Size of this box
    return new Vector(this.max.x - this.min.x, this.max.y - this.min.y);
  }

  center() {
    // Center of the box
    return this.min.add(this.max).scale(0.5);
  }

  add(p) {
    // Adds a new point to this MBR
    this.min.x = Math.min(p.x, this.min.x);
    this.min.y = Math.min(p.y, this.min.y);
    this.max.x = Math.max(p.x, this.max.x);
    this.max.y = Math.max(p.y, this.max.y);
  }

  contains(p, r = 0) {
    // Whether MBR contains a point / circle
    return (
      p.x + r >= this.min.x &&
      p.y + r >= this.min.y &&
      p.x - r < this.max.x &&
      p.y - r < this.max.y
    );
  }

  pointDist(p) {
    // Distance from box to point
    let dx = Math.max(this.min.x - p.x, 0, p.x - this.max.x);
    let dy = Math.max(this.min.y - p.y, 0, p.y - this.max.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  intersects(other) {
    // Whether this MBR intersects another MBR
    let minx = Math.max(other.min.x, this.min.x);
    let maxx = Math.min(other.max.x, this.max.x);
    if (minx >= maxx) return false;
    let miny = Math.max(other.min.y, this.min.y);
    let maxy = Math.min(other.max.y, this.max.y);
    return miny < maxy;
  }

  intersection(other) {
    // Returns intersection with another MBR
    let ret = new MBR();
    ret.min.x = Math.max(other.min.x, this.min.x);
    ret.max.x = Math.min(other.max.x, this.max.x);
    ret.min.y = Math.max(other.min.y, this.min.y);
    ret.max.y = Math.min(other.max.y, this.max.y);
    return ret;
  }

  union(other) {
    // Returns union with another MBR
    let ret = new MBR();
    ret.min.x = Math.min(other.min.x, this.min.x);
    ret.max.x = Math.max(other.max.x, this.max.x);
    ret.min.y = Math.min(other.min.y, this.min.y);
    ret.max.y = Math.max(other.max.y, this.max.y);
    return ret;
  }

  transform(matrix) {
    // Returns a new MBR transformed by matrix
    return new MBR(matrix.applyPoint(this.min), matrix.applyPoint(this.max));
  }
  draw(ctx) {
    // Draw on a canvas
    let s = this.size();
    ctx.beginPath();
    ctx.rect(this.min.x, this.min.y, s.x, s.y);
    ctx.stroke();
  }
}
)}

function* _43(DOM,width,MBR,Vec)
{
  const canvas = DOM.canvas(width, (width * 9) / 16);
  const ctx = canvas.getContext("2d");
  let a = new MBR(Vec(10, 10), Vec(110, 110));
  let b = new MBR(Vec(50, 50), Vec(260, 260));
  ctx.lineWidth = 6;
  ctx.strokeStyle = "black";
  a.draw(ctx);
  ctx.strokeStyle = "blue";
  b.draw(ctx);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "orange";
  a.union(b).draw(ctx);
  ctx.strokeStyle = "pink";
  a.intersection(b).draw(ctx);
  yield canvas;
}


function _44(md){return(
md`## Libraries`
)}

function _46(html){return(
html`<style>
button {
  font: 16px Serif;
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("Vector")).define("Vector", _Vector);
  main.variable(observer("Vec")).define("Vec", ["Vector"], _Vec);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("Ray")).define("Ray", _Ray);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("BinaryHeap")).define("BinaryHeap", _BinaryHeap);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("Curve")).define("Curve", ["Vec","MBR","CatmullRom","BinaryHeap"], _Curve);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["html","curve","vertexCount","tolerance","md"], _12);
  main.variable(observer()).define(["md","bindSliderNumber","viewof tolerance","viewof vertexCount"], _13);
  main.variable(observer()).define(["width","DOM","Vec","curve"], _14);
  main.define("initial curve", ["Curve","Vec"], _curve);
  main.variable(observer("mutable curve")).define("mutable curve", ["Mutable", "initial curve"], (M, _) => new M(_));
  main.variable(observer("curve")).define("curve", ["mutable curve"], _ => _.generator);
  main.variable(observer("viewof vertexCount")).define("viewof vertexCount", ["View"], _vertexCount);
  main.variable(observer("vertexCount")).define("vertexCount", ["Generators", "viewof vertexCount"], (G, _) => G.input(_));
  main.variable(observer("viewof tolerance")).define("viewof tolerance", ["View"], _tolerance);
  main.variable(observer("tolerance")).define("tolerance", ["Generators", "viewof tolerance"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("Bezier")).define("Bezier", _Bezier);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["width","DOM","Bezier","bezierControlPoints","Vec"], _21);
  main.variable(observer("bezierControlPoints")).define("bezierControlPoints", ["width","Vec"], _bezierControlPoints);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("CatmullRom")).define("CatmullRom", ["Vector"], _CatmullRom);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md","bindSliderNumber","viewof tension","bindCheckbox","viewof closed"], _26);
  main.variable(observer()).define(["width","DOM","CatmullRom","catmullControlPoints","tension","closed","Vec"], _27);
  main.variable(observer("catmullControlPoints")).define("catmullControlPoints", ["width","Vec"], _catmullControlPoints);
  main.variable(observer("viewof closed")).define("viewof closed", ["View"], _closed);
  main.variable(observer("closed")).define("closed", ["Generators", "viewof closed"], (G, _) => G.input(_));
  main.variable(observer("viewof tension")).define("viewof tension", ["View"], _tension);
  main.variable(observer("tension")).define("tension", ["Generators", "viewof tension"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("Matrix")).define("Matrix", ["Vec"], _Matrix);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("matrixDemoUI")).define("matrixDemoUI", ["T"], _matrixDemoUI);
  main.variable(observer("matrixDemoButtons")).define("matrixDemoButtons", ["html","mutable T"], _matrixDemoButtons);
  main.variable(observer()).define(["tcount","width","DOM","T"], _36);
  main.variable(observer("matrix")).define("matrix", ["tcount","html","T"], _matrix);
  main.variable(observer("Transform")).define("Transform", ["html","Vec","Matrix","tex"], _Transform);
  main.define("initial T", ["Transform","mutable tcount"], _T);
  main.variable(observer("mutable T")).define("mutable T", ["Mutable", "initial T"], (M, _) => new M(_));
  main.variable(observer("T")).define("T", ["mutable T"], _ => _.generator);
  main.define("initial tcount", _tcount);
  main.variable(observer("mutable tcount")).define("mutable tcount", ["Mutable", "initial tcount"], (M, _) => new M(_));
  main.variable(observer("tcount")).define("tcount", ["mutable tcount"], _ => _.generator);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("MBR")).define("MBR", ["Vector"], _MBR);
  main.variable(observer()).define(["DOM","width","MBR","Vec"], _43);
  main.variable(observer()).define(["md"], _44);
  const child1 = runtime.module(define1);
  main.import("View", child1);
  main.import("bindSliderNumber", child1);
  main.import("bindCheckbox", child1);
  main.variable(observer()).define(["html"], _46);
  return main;
}
