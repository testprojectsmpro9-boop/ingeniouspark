---
name: gsap-react
description: Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount.
license: MIT
---

# GSAP with React

## When to Use This Skill

Apply when writing or reviewing GSAP code in React or Next.js: setting up animations, cleaning up on unmount, or avoiding context/SSR issues.

**Related skills:** For tweens use **gsap-core**; for timelines use **gsap-timeline**; for scroll use **gsap-scrolltrigger**; for Vue/Svelte use **gsap-frameworks**.

## Installation

```bash
npm install gsap @gsap/react
```

## Prefer useGSAP() Hook

```javascript
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP); // register once

const containerRef = useRef(null);

useGSAP(() => {
  gsap.to(".box", { x: 100 });
  gsap.from(".item", { opacity: 0, stagger: 0.1 });
}, { scope: containerRef });
```

- ✅ Pass **scope** so selectors are scoped to that root.
- ✅ Cleanup runs automatically on unmount.
- ✅ Use **contextSafe** from return value for callbacks.

## Dependencies and revertOnUpdate

```javascript
useGSAP(() => {
  // gsap code
}, {
  dependencies: [endX],
  scope: container,
  revertOnUpdate: true  // reverts and re-runs when deps change
});
```

## gsap.context() in useEffect (fallback)

```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

## contextSafe for Event Handlers

```javascript
useGSAP((context, contextSafe) => {
  // ✅ safe — created during execution
  gsap.to(goodRef.current, { x: 100 });

  // ✅ wrap event handlers in contextSafe
  const onClick = contextSafe(() => {
    gsap.to(goodRef.current, { rotation: 180 });
  });
  goodRef.current.addEventListener('click', onClick);

  return () => {
    goodRef.current.removeEventListener('click', onClick);
  };
}, { scope: container });
```

## SSR (Next.js)

- Keep all GSAP inside `useGSAP` or `useEffect` — client only.
- Do not call `gsap.*` or `ScrollTrigger.*` during server render.

## Best Practices

- ✅ Prefer `useGSAP()` over `useEffect()` for GSAP setup.
- ✅ Use refs for targets; pass **scope** to limit selectors.
- ✅ Run GSAP only on client (useGSAP or useEffect).

## Do Not

- ❌ Target by selector without scope — always pass scope.
- ❌ Skip cleanup — always revert context or kill tweens on unmount.
- ❌ Run GSAP or ScrollTrigger during SSR.
