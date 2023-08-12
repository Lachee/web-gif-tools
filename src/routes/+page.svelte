<script lang="ts">
  import { FileDropzone, toastStore } from "@skeletonlabs/skeleton";
  import { frames, extractFrames, type Frame } from "$lib/gif";
  import Timeline from "$lib/components/Timeline.svelte";
  import Preview from "$lib/components/Preview.svelte";

  const frameLimit = 200;

  let files: FileList;
  let processing: boolean = false;

  async function onChangeHandler(e: Event): Promise<void> {
    console.log("files", files);
    processing = true;
    try {
      const f = await extractFrames(files[0]);
      if (f.length > frameLimit) {
        toastStore.trigger({
          message: `Content is too big! It exceeds ${frameLimit} frames`,
        });
      } else {
        frames.set(f);
      }
    } finally {
      processing = false;
    }
  }
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">GIF Editor</h1>
  <FileDropzone name="files" bind:files on:change={onChangeHandler}
    >Upload</FileDropzone
  >

  {#if processing}
    <section class="card w-full">
      <div class="p-4 space-y-4">
        <div class="placeholder" />
        <div class="grid grid-cols-3 gap-8">
          <div class="placeholder" />
          <div class="placeholder" />
          <div class="placeholder" />
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div class="placeholder" />
          <div class="placeholder" />
          <div class="placeholder" />
          <div class="placeholder" />
        </div>
      </div>
    </section>
  {:else if files != null && files.length > 0}
    <Preview source={files[0]} />
    <Timeline />
  {/if}
</div>
