---
name: gsap-timeline
description: Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animation order.
license: MIT
---

# GSAP Timeline

## When to Use This Skill

Apply when building multi-step animations, coordinating several tweens in sequence or parallel, or when the user asks about timelines, sequencing, or keyframe-style animation in GSAP.

**Related skills:** For single tweens and eases use **gsap-core**; for scroll-driven timelines use **gsap-scrolltrigger**; for React use **gsap-react**.

## Creating a Timeline

```javascript
const tl = gsap.timeline();
tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { y: 50, duration: 0.5 })
  .to(".c", { opacity: 0, duration: 0.3 });
```

## Position Parameter (3rd arg)

- **Absolute**: `1` — start at 1 second.
- **Relative**: `"+=0.5"` — 0.5s after end; `"-=0.2"` — 0.2s before end.
- **Label**: `"labelName"` or `"labelName+=0.3"`.
- **Placement**: `"<"` — same start as previous; `"<0.2"` — 0.2s after previous start.

```javascript
tl.to(".a", { x: 100 }, 0);        // at 0
tl.to(".b", { y: 50 }, "+=0.5");   // 0.5s after last end
tl.to(".c", { opacity: 0 }, "<");  // same start as previous
tl.to(".d", { scale: 2 }, "<0.2"); // 0.2s after previous start
```

## Timeline Defaults

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }); // both inherit defaults
```

## Timeline Options

- **paused: true** — create paused; call `.play()` to start.
- **repeat**, **yoyo** — apply to whole timeline.
- **onComplete**, **onStart**, **onUpdate** — callbacks.
- **defaults** — vars merged into every child tween.

## Labels

```javascript
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.addLabel("outro", "+=0.5");
tl.play("outro");
tl.tweenFromTo("intro", "outro");
```

## Nesting Timelines

```javascript
const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
master.to(".c", { opacity: 0 }, "+=0.2");
```

## Controlling Playback

```javascript
tl.play(); tl.pause(); tl.reverse(); tl.restart();
tl.time(2); tl.progress(0.5); tl.kill();
```

## Best Practices

- ✅ Prefer timelines for sequencing over chained `delay`.
- ✅ Use position parameter for readable placement.
- ✅ Add labels with `addLabel()` for maintainable sequencing.
- ✅ Pass defaults into constructor so child tweens inherit.
- ✅ Put ScrollTrigger on the timeline, not on child tweens.

## Do Not

- ❌ Chain animations with `delay` when a timeline can sequence them.
- ❌ Put `duration` on the timeline constructor (it's determined by children).
- ❌ Nest animations that contain a ScrollTrigger inside a timeline.
