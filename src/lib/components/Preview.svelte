<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { frames as frameStore, type Frame } from "$lib/gif";

  export let source: File;
  let canvasElm: HTMLCanvasElement;
  let imgElm: HTMLImageElement;
  let vidElm: HTMLVideoElement;

  let frames: Frame[] = [];
  let frameSources: HTMLImageElement[] = [];

  let dataUrl: string;
  let isVideo: boolean;

  $: {
    dataUrl = URL.createObjectURL(source);
    isVideo = source.type.startsWith("video");
  }

  let frameIndex = 0;

  onDestroy(
    frameStore.subscribe((f) => {
      frames = f;
      frameSources.forEach((fs) => fs.remove());
      frameSources = frames.map((frame) => {
        const img = new Image();
        img.src = frame.objectUrl;
        return img;
      });
    })
  );

  function updateCanvasSize() {
    if (isVideo) {
      canvasElm.width = vidElm.videoWidth;
      canvasElm.height = vidElm.videoHeight;
    } else {
      canvasElm.width = imgElm.width;
      canvasElm.height = imgElm.height;
    }
    requestAnimationFrame(render);
  }

  function render(time: DOMHighResTimeStamp) {
    requestAnimationFrame(render);
    if (canvasElm == null) return;

    const ctx = canvasElm.getContext("2d");
    if (ctx == null) return;

    nextFrame();

    const frame = frames[frameIndex];
    if (frame == null) return;
    if (!frame.skip) {
      const source = frameSources[frameIndex];
      ctx.drawImage(source, 0, 0);
    }
  }

  function nextFrame() {
    const prevLocation = frameIndex;
    do {
      frameIndex = (frameIndex + 1) % frames.length;
    } while (
      frames[frameIndex] != null &&
      frames[frameIndex].skip &&
      frameIndex != prevLocation
    );
  }
</script>

<div class="flex gap-5">
  {#if !isVideo}
    <img
      bind:this={imgElm}
      src={dataUrl}
      alt="frame"
      on:load={updateCanvasSize}
    />
  {:else}
    <video
      bind:this={vidElm}
      src={dataUrl}
      on:canplay={updateCanvasSize}
      autoplay
      muted
      loop
    />
  {/if}
  <canvas bind:this={canvasElm} />
</div>

<style>
  canvas {
  }
</style>
