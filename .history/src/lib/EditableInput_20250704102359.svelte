<script lang="ts">
    import { onMount } from 'svelte';
  import { overlayEditResult } from './Store/profile';
  
    export let title: string;
    export let propertyName: string;
    export let initialValue: string;
  
    export let okLabel: string = 'OK';
    export let cancelLabel: string = 'Cancel';
  
    export let onConfirm: () => void;
    export let onCancel?: () => void;
  
    let showDialog = false;
    let inputValue = '';
  
    onMount(() => {
      inputValue = initialValue;
    });
  
    function openDialog() {
      inputValue = initialValue;
      overlayEditResult.set(null); 
      showDialog = true;
    }
  
    function confirm() {
      const result = { property: propertyName, value: inputValue };
      overlayEditResult.set(result);        
      onConfirm();                          
      showDialog = false;
    }
  
    function cancel() {
      showDialog = false;
      if (onCancel) onCancel();
    }
</script>

<!-- Input Preview Trigger -->
<div class="field">
  <label>{propertyName}</label>
  <input type="text" readonly value={initialValue} on:click={openDialog} />
</div>

<!-- Dialog Overlay -->
{#if showDialog}
  <div class="overlay">
    <div class="dialog">
      <h3>{title}</h3>

      <div class="field">
        <label>Current</label>
        <input type="text" readonly value={initialValue} />
      </div>

      <div class="field">
        <label>New</label>
        <input bind:value={inputValue} />
      </div>

      <div class="actions">
        <button on:click={cancel}>{cancelLabel}</button>
        <button on:click={confirm}>{okLabel}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 999;
  }
  .dialog {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  button {
    padding: 0.4rem 0.8rem;
    cursor: pointer;
  }
</style>
