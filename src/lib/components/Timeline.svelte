<script lang="ts">
  import { frames, type Frame } from "$lib/gif";
  import FrameBox from "./FrameBox.svelte";
</script>

<div
  class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
>
  {#each $frames as frame}
    <div
      class="snap-start shrink-0 card w-40 md:w-80 text-center overflow-hidden"
    >
      <FrameBox bind:frame />
    </div>
  {/each}
</div>
