<script lang="ts">
  import type { Frame } from "$lib/gif";
  import { selection, toggle as toggleSelection } from "$lib/selection";
  import { onDestroy } from "svelte";

  export let frame: Frame;
  let selected: boolean = false;
  let altMode: boolean = false;

  onDestroy(
    selection.subscribe((s) => {
      selected = s.findIndex((f) => f.index == frame.index) >= 0;
    })
  );

  function onSkipChanged(evt: Event) {
    const currentSelection = $selection;
    frame.skip = !frame.skip;
    console.log("update", currentSelection, evt);
    for (const f of currentSelection) {
      f.skip = frame.skip;
    }
  }

  function onContainerClick(evt: Event) {
    if (!altMode) return;
    toggleSelection(frame);
    evt.preventDefault();
  }
</script>

<svelte:window
  on:keydown={(evt) => {
    if (evt.shiftKey) altMode = true;
  }}
  on:keyup={() => (altMode = false)}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="frame"
  class:skipped={frame.skip}
  class:alt={altMode}
  on:click={onContainerClick}
>
  <div class="toolbar">
    <button
      class="chip"
      class:variant-outline={!selected}
      class:variant-filled={selected}
      on:click={() => toggleSelection(frame)}
    >
      {frame.index}
    </button>
    <div>
      <input
        class="checkbox"
        type="checkbox"
        checked={frame.skip}
        on:change={onSkipChanged}
      />
      Skip Frame
    </div>
  </div>
  <img src={frame.objectUrl} alt="frame" />
</div>

<style>
  .frame {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .frame.alt {
    cursor: pointer;
  }

  .frame .toolbar {
    display: flex;
    padding: 5px;
    gap: 5px;
  }

  .frame > span {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: 20pt;
  }

  .frame.skipped img {
    filter: saturate(0);
  }
</style>
