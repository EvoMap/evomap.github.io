<script setup lang="ts">
/**
 * @packageDocumentation
 * Enhanced Mermaid diagram viewer with pan, zoom, and fullscreen support.
 *
 * @module docs-site/theme/Mermaid
 */
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from "vue";

const props = defineProps<{
  /** The mermaid diagram code to render */
  code: string;
}>();

// DOM refs
const containerRef = ref<HTMLDivElement>();
const viewportRef = ref<HTMLDivElement>();

// State
const svg = ref("");
const isFullscreen = ref(false);
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const lastTranslate = ref({ x: 0, y: 0 });

// Constants
const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.25;

/** Computed transform style for the SVG */
const transformStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: "center center",
  cursor: isDragging.value ? "grabbing" : "grab",
}));

/**
 * Renders the mermaid diagram from the provided code.
 */
async function renderDiagram(): Promise<void> {
  if (!props.code || typeof window === "undefined") return;

  const mermaid = (await import("mermaid")).default;

  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "inherit",
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      padding: 15,
    },
    themeVariables: {
      fontSize: "14px",
    },
  });

  try {
    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
    const { svg: renderedSvg } = await mermaid.render(id, props.code);

    // Fix SVG overflow issues by adjusting viewBox
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderedSvg, "image/svg+xml");
    const svgEl = doc.querySelector("svg");

    if (svgEl) {
      // Remove fixed height/width constraints
      svgEl.removeAttribute("height");
      svgEl.style.maxWidth = "100%";
      svgEl.style.height = "auto";
      svgEl.style.overflow = "visible";

      // Fix text alignment: force left-align for all text elements
      const foreignObjects = svgEl.querySelectorAll("foreignObject");
      foreignObjects.forEach((fo) => {
        const div = fo.querySelector("div");
        if (div) {
          div.style.textAlign = "left";
        }
      });

      // Also fix tspan and text elements
      const textElements = svgEl.querySelectorAll("text, tspan");
      textElements.forEach((el) => {
        el.setAttribute("text-anchor", "start");
      });

      // Fix node rect height: recalculate based on text content
      const nodeGroups = svgEl.querySelectorAll(".node");
      nodeGroups.forEach((node) => {
        const rect = node.querySelector("rect, polygon");
        const fo = node.querySelector("foreignObject");
        if (rect && fo) {
          const div = fo.querySelector("div");
          if (div) {
            // Get actual text height
            const textHeight = div.scrollHeight || div.offsetHeight || 0;
            if (textHeight > 0) {
              const padding = 20;
              const newHeight = textHeight + padding;
              const currentHeight = parseFloat(
                rect.getAttribute("height") || "0"
              );

              if (newHeight > currentHeight) {
                rect.setAttribute("height", String(newHeight));
                fo.setAttribute("height", String(newHeight));

                // Adjust y position to center
                const currentY = parseFloat(rect.getAttribute("y") || "0");
                const heightDiff = newHeight - currentHeight;
                rect.setAttribute("y", String(currentY - heightDiff / 2));
                fo.setAttribute("y", String(currentY - heightDiff / 2));
              }
            }
          }
        }
      });

      // Expand viewBox significantly to prevent clipping of multiline content
      const viewBox = svgEl.getAttribute("viewBox");
      if (viewBox) {
        const [x, y, w, h] = viewBox.split(" ").map(Number);
        // Add substantial padding to viewBox for multiline text overflow
        const padding = 50;
        svgEl.setAttribute(
          "viewBox",
          `${x - padding} ${y - padding} ${w + padding * 2} ${h + padding * 2}`
        );
      }

      svg.value = svgEl.outerHTML;
    } else {
      svg.value = renderedSvg;
    }

    // Fix dimensions after DOM update
    await nextTick();
    fixNodeDimensions();

    resetView();
  } catch (error) {
    console.error("Mermaid rendering error:", error);
    svg.value = `<pre class="mermaid-error">Error rendering diagram: ${
      error instanceof Error ? error.message : "Unknown error"
    }</pre>`;
  }
}

/** Zoom in by one step */
function zoomIn(): void {
  scale.value = Math.min(MAX_SCALE, scale.value + ZOOM_STEP);
}

/** Zoom out by one step */
function zoomOut(): void {
  scale.value = Math.max(MIN_SCALE, scale.value - ZOOM_STEP);
}

/** Reset view to initial state */
function resetView(): void {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
}

/** Toggle fullscreen mode */
function toggleFullscreen(): void {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    resetView();
  }
}

/** Close fullscreen if Escape key is pressed */
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape" && isFullscreen.value) {
    toggleFullscreen();
  }
}

/** Handle mouse wheel zoom */
function handleWheel(e: WheelEvent): void {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
  const newScale = Math.min(
    MAX_SCALE,
    Math.max(MIN_SCALE, scale.value + delta)
  );

  // Zoom towards mouse position
  if (viewportRef.value) {
    const rect = viewportRef.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const scaleDiff = newScale - scale.value;
    translateX.value -= (mouseX * scaleDiff) / scale.value;
    translateY.value -= (mouseY * scaleDiff) / scale.value;
  }

  scale.value = newScale;
}

/** Start dragging */
function handleMouseDown(e: MouseEvent): void {
  if (e.button !== 0) return; // Only left click
  isDragging.value = true;
  dragStart.value = { x: e.clientX, y: e.clientY };
  lastTranslate.value = { x: translateX.value, y: translateY.value };
}

/** Handle drag movement */
function handleMouseMove(e: MouseEvent): void {
  if (!isDragging.value) return;

  const dx = e.clientX - dragStart.value.x;
  const dy = e.clientY - dragStart.value.y;

  translateX.value = lastTranslate.value.x + dx;
  translateY.value = lastTranslate.value.y + dy;
}

/** End dragging */
function handleMouseUp(): void {
  isDragging.value = false;
}

/** Handle touch start for mobile */
function handleTouchStart(e: TouchEvent): void {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    isDragging.value = true;
    dragStart.value = { x: touch.clientX, y: touch.clientY };
    lastTranslate.value = { x: translateX.value, y: translateY.value };
  }
}

/** Handle touch move for mobile */
function handleTouchMove(e: TouchEvent): void {
  if (!isDragging.value || e.touches.length !== 1) return;
  e.preventDefault();

  const touch = e.touches[0];
  const dx = touch.clientX - dragStart.value.x;
  const dy = touch.clientY - dragStart.value.y;

  translateX.value = lastTranslate.value.x + dx;
  translateY.value = lastTranslate.value.y + dy;
}

/** Handle touch end for mobile */
function handleTouchEnd(): void {
  isDragging.value = false;
}

/**
 * Fix node dimensions after SVG is rendered to DOM.
 * Mermaid sometimes calculates wrong height for multiline text nodes.
 */
function fixNodeDimensions(): void {
  if (!containerRef.value) return;

  const svgEl = containerRef.value.querySelector("svg");
  if (!svgEl) return;

  // Fix each node's rect height based on actual text content
  const nodes = svgEl.querySelectorAll(".node");
  nodes.forEach((node) => {
    const rect = node.querySelector("rect");
    const fo = node.querySelector("foreignObject");

    if (rect && fo) {
      const div = fo.querySelector("div");
      if (div) {
        const textHeight = div.getBoundingClientRect().height;
        const currentHeight = parseFloat(rect.getAttribute("height") || "0");
        const padding = 16;
        const requiredHeight = textHeight + padding;

        if (requiredHeight > currentHeight) {
          const heightDiff = requiredHeight - currentHeight;
          const currentY = parseFloat(rect.getAttribute("y") || "0");
          const foY = parseFloat(fo.getAttribute("y") || "0");

          // Expand rect and foreignObject
          rect.setAttribute("height", String(requiredHeight));
          rect.setAttribute("y", String(currentY - heightDiff / 2));

          fo.setAttribute("height", String(requiredHeight));
          fo.setAttribute("y", String(foY - heightDiff / 2));
        }
      }
    }
  });

  // Recalculate viewBox after fixing dimensions
  const bbox = svgEl.getBBox();
  const padding = 30;
  svgEl.setAttribute(
    "viewBox",
    `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${
      bbox.height + padding * 2
    }`
  );
}

onMounted(() => {
  nextTick(renderDiagram);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("mousemove", handleMouseMove);
  document.body.style.overflow = "";
});

watch(
  () => props.code,
  () => {
    nextTick(renderDiagram);
  }
);
</script>

<template>
  <div
    ref="containerRef"
    class="mermaid-wrapper"
    :class="{ 'is-fullscreen': isFullscreen }"
  >
    <!-- Toolbar -->
    <div class="mermaid-toolbar">
      <button
        class="toolbar-btn"
        @click="zoomOut"
        title="Zoom Out (−)"
        :disabled="scale <= MIN_SCALE"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>

      <button
        class="toolbar-btn"
        @click="zoomIn"
        title="Zoom In (+)"
        :disabled="scale >= MAX_SCALE"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <div class="toolbar-separator" />

      <button class="toolbar-btn" @click="resetView" title="Reset View">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      <button
        class="toolbar-btn"
        @click="toggleFullscreen"
        :title="isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'"
      >
        <svg
          v-if="!isFullscreen"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
        <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
    </div>

    <!-- Viewport -->
    <div
      ref="viewportRef"
      class="mermaid-viewport"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="mermaid-content" :style="transformStyle" v-html="svg" />
    </div>

    <!-- Fullscreen hint -->
    <div v-if="isFullscreen" class="fullscreen-hint">
      Press <kbd>Esc</kbd> to exit • Scroll to zoom • Drag to pan
    </div>
  </div>
</template>

<style scoped>
.mermaid-wrapper {
  position: relative;
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.mermaid-wrapper.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  border-radius: 0;
  z-index: 9999;
  background: var(--vp-c-bg);
}

/* Toolbar */
.mermaid-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-border);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  margin: 0 8px;
  background: var(--vp-c-border);
}

.zoom-level {
  min-width: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

/* Viewport */
.mermaid-viewport {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  overflow: hidden;
  touch-action: none;
}

.is-fullscreen .mermaid-viewport {
  max-height: none;
  height: calc(100vh - 80px);
}

.mermaid-content {
  transition: transform 0.1s ease-out;
  user-select: none;
  overflow: visible;
}

.mermaid-content :deep(svg) {
  display: block;
  max-width: none;
  overflow: visible;
}

.mermaid-content :deep(svg *) {
  overflow: visible;
}

/* Force left-align text in mermaid nodes */
.mermaid-content :deep(.node foreignObject div),
.mermaid-content :deep(.nodeLabel),
.mermaid-content :deep(.label) {
  text-align: left !important;
}

.mermaid-content :deep(.node foreignObject) {
  overflow: visible !important;
}

/* Ensure node boxes have proper padding */
.mermaid-content :deep(.node rect),
.mermaid-content :deep(.node polygon) {
  overflow: visible;
}

.mermaid-content :deep(.mermaid-error) {
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  padding: 1rem;
  border-radius: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
}

/* Fullscreen hint */
.fullscreen-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  opacity: 0.8;
  pointer-events: none;
}

.fullscreen-hint kbd {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 2px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
}

/* Dark mode adjustments */
.dark .mermaid-wrapper {
  background: var(--vp-c-bg-soft);
}

.dark .mermaid-toolbar {
  background: var(--vp-c-bg-elv);
}
</style>
