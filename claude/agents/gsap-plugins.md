---
name: gsap-plugins
description: Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, GSDevTools. Use when the user asks about a GSAP plugin, scroll-to, flip animations, draggable, SVG drawing, or plugin registration.
license: MIT
---

# GSAP Plugins

## Registering Plugins

```javascript
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollToPlugin, Flip, Draggable);
```

Register before using. In React, register at top level — not inside a component that re-renders.

## Scroll

### ScrollToPlugin

```javascript
gsap.registerPlugin(ScrollToPlugin);
gsap.to(window, { duration: 1, scrollTo: { y: 500 } });
gsap.to(window, { duration: 1, scrollTo: { y: "#section", offsetY: 50 } });
```

### ScrollSmoother

Smooth scroll wrapper. Requires ScrollTrigger and specific DOM:
```html
<div id="smooth-wrapper"><div id="smooth-content"><!-- content --></div></div>
```

## DOM / UI

### Flip

```javascript
gsap.registerPlugin(Flip);
const state = Flip.getState(".item");
// change DOM
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```

### Draggable

```javascript
gsap.registerPlugin(Draggable, InertiaPlugin);
Draggable.create(".box", { type: "x,y", bounds: "#container", inertia: true });
Draggable.create(".knob", { type: "rotation" });
```

### Observer

```javascript
gsap.registerPlugin(Observer);
Observer.create({
  target: "#area",
  onUp: () => {},
  onDown: () => {},
  tolerance: 10
});
```

## Text

### SplitText

```javascript
gsap.registerPlugin(SplitText);
const split = SplitText.create(".heading", { type: "words, chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4 });
// later: split.revert()
```

With autoSplit (re-splits on font load/width change):
```javascript
SplitText.create(".split", {
  type: "lines",
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, { y: 100, opacity: 0, stagger: 0.05 });
  }
});
```

Key options: `type` (chars/words/lines), `mask` (lines/words/chars for reveal), `aria` ("auto"/"hidden"/"none"), `autoSplit`.

### ScrambleText

```javascript
gsap.registerPlugin(ScrambleTextPlugin);
gsap.to(".text", {
  duration: 1,
  scrambleText: { text: "New message", chars: "01", revealDelay: 0.5 }
});
```

## SVG

### DrawSVG

Reveals stroke by animating stroke-dashoffset. Element must have visible stroke.

```javascript
gsap.registerPlugin(DrawSVGPlugin);
gsap.from("#path", { duration: 1, drawSVG: 0 });
gsap.fromTo("#path", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1 });
```

### MorphSVG

```javascript
gsap.registerPlugin(MorphSVGPlugin);
MorphSVGPlugin.convertToPath("circle, rect, ellipse");
gsap.to("#diamond", { duration: 1, morphSVG: "#lightning", ease: "power2.inOut" });
```

### MotionPath

```javascript
gsap.registerPlugin(MotionPathPlugin);
gsap.to(".dot", {
  duration: 2,
  motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5], autoRotate: true }
});
```

## Easing Plugins

### CustomEase

```javascript
gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("name", ".17,.67,.83,.67");
gsap.to(".el", { x: 100, ease, duration: 1 });
```

Also: **EasePack** (SlowMo, RoughEase), **CustomWiggle**, **CustomBounce**.

## Physics

```javascript
gsap.registerPlugin(Physics2DPlugin);
gsap.to(".ball", {
  duration: 2,
  physics2D: { velocity: 250, angle: 80, gravity: 500 }
});
```

## Development Only

```javascript
gsap.registerPlugin(GSDevTools);
GSDevTools.create({ animation: tl });
// Remove in production
```

## Best Practices

- ✅ Register every plugin with `gsap.registerPlugin()` before first use.
- ✅ Revert plugin instances (e.g. `splitInstance.revert()`) on unmount.

## Do Not

- ❌ Use a plugin without registering it first.
- ❌ Ship GSDevTools to production.
