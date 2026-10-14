---
name: gsap-scrolltrigger
description: Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, scroll animations, or pinning.
license: MIT
---

# GSAP ScrollTrigger

## When to Use This Skill

Apply when implementing scroll-driven animations: triggering tweens/timelines on scroll, pinning elements, scrubbing animation to scroll position.

**Related skills:** For tweens and timelines use **gsap-core** and **gsap-timeline**; for React cleanup use **gsap-react**; for ScrollSmoother use **gsap-plugins**.

## Register Plugin

```javascript
gsap.registerPlugin(ScrollTrigger);
```

## Basic Trigger

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    toggleActions: "play reverse play reverse"
  }
});
```

## Key Config Options

| Property | Description |
|----------|-------------|
| **trigger** | Element whose position defines where trigger starts |
| **start** | When trigger becomes active. Format: `"triggerPos viewportPos"`. Default `"top bottom"` |
| **end** | When trigger ends. Default `"bottom top"`. Use `"max"` for max scroll |
| **scrub** | Link progress to scroll. `true` = direct; number = smoothing delay |
| **toggleActions** | Four actions: onEnter, onLeave, onEnterBack, onLeaveBack. Each: `play/pause/resume/reset/restart/complete/reverse/none` |
| **pin** | Pin element while active. `true` = pin the trigger |
| **pinSpacing** | Default `true`; adds spacer. `false` removes it |
| **markers** | `true` for dev markers. Remove in production |
| **snap** | Snap to increments or specific values |
| **containerAnimation** | For fake horizontal scroll |
| **once** | Kill after end reached once |
| **refreshPriority** | Lower = refreshed first |

## Scrub

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    scrub: 1  // smoothing delay in seconds
  }
});
```

## Pinning

```javascript
scrollTrigger: {
  trigger: ".section",
  start: "top top",
  end: "+=1000",
  pin: true,
  scrub: 1
}
```

## Timeline + ScrollTrigger

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true
  }
});
tl.to(".a", { x: 100 }).to(".b", { y: 50 });
```

## Horizontal Scroll (containerAnimation)

```javascript
// CRITICAL: use ease: "none" on horizontal tween
const scrollTween = gsap.to(".horizontal-el", {
  xPercent: -300,
  ease: "none",  // REQUIRED
  scrollTrigger: {
    trigger: ".horizontal-el",
    pin: true,
    start: "top top",
    end: "+=3000",
    scrub: 1
  }
});

// Other triggers based on horizontal movement:
gsap.to(".card", {
  y: 100,
  scrollTrigger: {
    containerAnimation: scrollTween,
    trigger: ".card",
    start: "left center"
  }
});
```

## ScrollTrigger.batch()

```javascript
ScrollTrigger.batch(".box", {
  onEnter: (elements) => {
    gsap.to(elements, { opacity: 1, y: 0, stagger: 0.15 });
  },
  start: "top 80%"
});
```

## Standalone ScrollTrigger

```javascript
ScrollTrigger.create({
  trigger: "#id",
  start: "top top",
  onUpdate: (self) => console.log(self.progress)
});
```

## Refresh and Cleanup

```javascript
ScrollTrigger.refresh();            // after DOM/layout changes
ScrollTrigger.getAll().forEach(t => t.kill());
ScrollTrigger.getById("my-id")?.kill();
```

## Best Practices

- ✅ `gsap.registerPlugin(ScrollTrigger)` once before any usage.
- ✅ Call `ScrollTrigger.refresh()` after DOM/layout changes.
- ✅ Use scrub OR toggleActions — not both on same trigger.
- ✅ Use `ease: "none"` on horizontal tween with containerAnimation.
- ✅ Create ScrollTriggers top-to-bottom or set `refreshPriority`.

## Do Not

- ❌ Put ScrollTrigger on child tweens in a timeline — put it on the timeline.
- ❌ Forget `ScrollTrigger.refresh()` after dynamic content.
- ❌ Use scrub and toggleActions together.
- ❌ Use ease other than `"none"` on containerAnimation horizontal tween.
- ❌ Leave `markers: true` in production.
