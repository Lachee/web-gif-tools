<script lang="ts">
  export let source: File;
  let dataUrl: string;

  $: dataUrl = URL.createObjectURL(source);
</script>

<div>
  <img src={dataUrl} alt="frame" />
</div>
