<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { frames as frameStore, type Frame } from "$lib/gif";

  export let source: File;
  let canvasElm: HTMLCanvasElement;
  let imgElm: HTMLImageElement;

  let frames: Frame[] = [];
  let frameSources: HTMLImageElement[] = [];

  let dataUrl: string;
  $: dataUrl = URL.createObjectURL(source);

  let currentFrame = 0;

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

  function onPreviewLoad() {
    canvasElm.width = imgElm.clientWidth;
    canvasElm.height = imgElm.clientHeight;
    requestAnimationFrame(render);
  }

  function render(time: DOMHighResTimeStamp) {
    requestAnimationFrame(render);
    if (canvasElm == null) return;

    const ctx = canvasElm.getContext("2d");
    if (ctx == null) return;

    currentFrame = (currentFrame + 1) % frames.length;
    ctx.drawImage(frameSources[currentFrame], 0, 0);
  }
</script>

<div class="flex gap-5">
  <img bind:this={imgElm} src={dataUrl} alt="frame" on:load={onPreviewLoad} />
  <canvas bind:this={canvasElm} />
</div>

<style>
  canvas {
  }
</style>
