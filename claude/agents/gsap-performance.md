---
name: gsap-performance
description: Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smooth 60fps.
license: MIT
---

# GSAP Performance

## When to Use This Skill

Apply when optimizing GSAP animations for smooth 60fps, reducing layout/paint cost, or when the user asks about performance, jank, or best practices.

## Prefer Transform and Opacity

- ✅ Prefer: **x**, **y**, **scale**, **rotation**, **opacity** — GPU-accelerated.
- ❌ Avoid: **width**, **height**, **top**, **left**, **margin**, **padding** — trigger layout.

GSAP's `x`/`y` use transforms by default.

## will-change

```css
will-change: transform;
```

Only on elements that actually animate — not everything.

## quickTo (Mouse Followers)

```javascript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" }),
    yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });

document.querySelector("#container").addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

Reuses single tween instead of creating new tweens on each update.

## Stagger over Many Tweens

Use `stagger` instead of many separate tweens with manual delays — more efficient.

## Lists and Virtualization

For long lists, animate only visible items. Avoid creating hundreds of simultaneous tweens.

## ScrollTrigger Performance

- `pin: true` promotes the layer; pin only what's needed.
- `scrub` with small value (e.g. `scrub: 1`) reduces work during scroll.
- Call `ScrollTrigger.refresh()` only when layout actually changes (debounce if possible).

## Batch DOM Reads/Writes

GSAP batches updates internally. Avoid interleaving direct DOM reads and writes that cause layout thrashing.

## Best Practices

- ✅ Animate transform and opacity; use `will-change` only on animating elements.
- ✅ Use stagger instead of many separate tweens with delays.
- ✅ Use `gsap.quickTo()` for frequently updated properties.
- ✅ Kill off-screen animations; call `ScrollTrigger.refresh()` when layout changes.

## Do Not

- ❌ Animate width/height/top/left for movement when x/y/scale can do it.
- ❌ Set `will-change` on every element "just in case."
- ❌ Create hundreds of overlapping tweens without testing on low-end devices.
- ❌ Ignore cleanup — stray tweens and ScrollTriggers keep running.
