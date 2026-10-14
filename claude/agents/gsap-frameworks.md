---
name: gsap-frameworks
description: Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelte, onMounted, onMount, onDestroy. For React use gsap-react.
license: MIT
---

# GSAP with Vue, Svelte, and Other Frameworks

## When to Use This Skill

Apply when writing GSAP code in Vue (or Nuxt), Svelte (or SvelteKit), or other component frameworks. For **React** specifically, use **gsap-react**.

## Principles (All Frameworks)

- **Create** tweens and ScrollTriggers **after** the DOM is available (onMounted, onMount).
- **Kill or revert** in the **unmount** cleanup.
- **Scope selectors** to the component root.

## Vue 3 (Composition API)

```javascript
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";

export default {
  setup() {
    const container = ref(null);
    let ctx;

    onMounted(() => {
      if (!container.value) return;
      ctx = gsap.context(() => {
        gsap.to(".box", { x: 100, duration: 0.6 });
        gsap.from(".item", { autoAlpha: 0, y: 20, stagger: 0.1 });
      }, container.value);  // scope to component root
    });

    onUnmounted(() => {
      ctx?.revert();
    });

    return { container };
  }
};
```

## Vue 3 (script setup)

```javascript
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";

const container = ref(null);
let ctx;

onMounted(() => {
  if (!container.value) return;
  ctx = gsap.context(() => {
    gsap.to(".box", { x: 100 });
  }, container.value);
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <div ref="container"><div class="box">Box</div></div>
</template>
```

## Svelte

```javascript
<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let container;

  onMount(() => {
    if (!container) return;
    const ctx = gsap.context(() => {
      gsap.to(".box", { x: 100 });
    }, container);
    return () => ctx.revert();  // cleanup on destroy
  });
</script>

<div bind:this={container}>
  <div class="box">Box</div>
</div>
```

## Scoping Selectors

```javascript
// ✅ scope = component root, selectors limited to subtree
gsap.context(() => { gsap.to(".box", ...) }, containerRef)

// ❌ no scope — can match elements across the page
gsap.to(".box", ...)
```

## ScrollTrigger Cleanup

Create ScrollTriggers inside the same `gsap.context()` — they're included in `ctx.revert()`. Call `ScrollTrigger.refresh()` after layout changes (nextTick in Vue, tick in Svelte).

## Lifecycle Summary

| Lifecycle | Action |
|-----------|--------|
| **Mounted** | Create tweens/ScrollTriggers inside `gsap.context(scope)` |
| **Unmount/Destroy** | Call `ctx.revert()` |

## Do Not

- ❌ Create tweens before component is mounted.
- ❌ Use selectors without scope (pass container to gsap.context).
- ❌ Skip cleanup — always call `ctx.revert()` on unmount.
- ❌ Register plugins inside a component body (register once at app level).
