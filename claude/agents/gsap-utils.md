---
name: gsap-utils
description: Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamping, mapping ranges, randomizing, snapping, or helper utilities in GSAP.
license: MIT
---

# gsap.utils

## When to Use This Skill

Apply when writing code that uses gsap.utils for math, value mapping, randomization, or collection handling in animations.

No registration needed. All on `gsap.utils.*`.

**Omitting the value returns a reusable function** (except `random()` — pass `true` as last arg).

## Clamping and Ranges

### clamp(min, max, value?)

```javascript
gsap.utils.clamp(0, 100, 150); // 100
let clampFn = gsap.utils.clamp(0, 100);
clampFn(150); // 100
```

### mapRange(inMin, inMax, outMin, outMax, value?)

```javascript
gsap.utils.mapRange(0, 1, 0, 360, 0.5); // 180 (progress to degrees)
let mapFn = gsap.utils.mapRange(0, 100, 0, 500);
mapFn(50); // 250
```

### normalize(min, max, value?)

```javascript
gsap.utils.normalize(0, 100, 50); // 0.5
```

### interpolate(start, end, progress?)

```javascript
gsap.utils.interpolate(0, 100, 0.5);          // 50
gsap.utils.interpolate("#ff0000", "#0000ff", 0.5); // mid color
let lerp = gsap.utils.interpolate(0, 100);
lerp(0.5); // 50
```

## Random and Snap

### random(min, max[, snap, returnFunction]) / random(array[, returnFunction])

```javascript
gsap.utils.random(-100, 100);       // immediate value
gsap.utils.random(0, 500, 5);       // snapped to nearest 5
let fn = gsap.utils.random(-200, 500, 10, true); // reusable function
fn(); // new random value each call

// In tween vars (string form):
gsap.to(".box", { x: "random(-100, 100, 5)", duration: 1 });
gsap.to(".item", { backgroundColor: "random([red, blue, green])" });
```

### snap(snapTo, value?)

```javascript
gsap.utils.snap(10, 23);            // 20
gsap.utils.snap([0, 100, 200], 150); // 100
let snapFn = gsap.utils.snap(10);
snapFn(23); // 20
```

### shuffle(array)

```javascript
gsap.utils.shuffle([1, 2, 3, 4]); // e.g. [3, 1, 4, 2]
```

### distribute(config)

Returns a function for spreading values across targets by position/grid:

```javascript
gsap.to(".class", {
  scale: gsap.utils.distribute({
    base: 0.5,
    amount: 2.5,
    from: "center",
    ease: "power1.inOut"
  })
});
```

Config: `base`, `amount` (total), `each` (per target), `from` ("start"/"center"/"edges"/"random"/index/ratios), `grid` ([rows,cols] or "auto"), `axis` ("x"/"y"), `ease`.

## Units and Parsing

```javascript
gsap.utils.getUnit("100px");     // "px"
gsap.utils.unitize(100, "px");   // "100px"
gsap.utils.splitColor("red");    // [255, 0, 0]
gsap.utils.splitColor("#6fb936", true); // [hue, sat, light] (HSL)
```

## Arrays and Collections

### selector(scope)

```javascript
const q = gsap.utils.selector(containerRef);
gsap.to(q(".box"), { x: 100 });
```

### toArray(value, scope?)

```javascript
gsap.utils.toArray(".item");           // array of elements
gsap.utils.toArray(".item", container); // scoped
```

### pipe(...functions)

```javascript
const fn = gsap.utils.pipe(
  (v) => gsap.utils.normalize(0, 100, v),
  (v) => gsap.utils.snap(0.1, v)
);
fn(50); // normalized then snapped
```

### wrap(min, max, value?) / wrapYoyo(min, max, value?)

```javascript
gsap.utils.wrap(0, 360, 370);    // 10 (cyclic)
gsap.utils.wrapYoyo(0, 100, 150); // 50 (bounces)
```

## Best Practices

- ✅ Omit value arg to get reusable function for scroll handlers / callbacks.
- ✅ Use `selector(scope)` in components so selectors are scoped to container.
- ✅ Use `snap` for grid-aligned values; `toArray` when a real array is needed.
