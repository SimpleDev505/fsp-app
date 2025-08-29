<script lang="ts">
  import { writable } from "svelte/store";
  import type { EditResult } from "./Store/profile";

  interface OverlayEditorProps {
    title: string;
    propertyName: string;
    initialValue: string;
    okLabel?: string;
    cancelLabel?: string;
    onConfirm?: (result: EditResult) => void;
    onCancel?: () => void;
  }

  let {
    title,
    propertyName,
    initialValue,
    okLabel = "OK",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
  }: OverlayEditorProps = $props();

  export const overlayEditResult = writable<EditResult | null>(null);

  let isModalOpen = $state(false);
  let editableValue = $state("");
  let inputElement: HTMLInputElement | null = $state(null);

  function openModal() {
    editableValue = initialValue;
    isModalOpen = true;

    setTimeout(() => {
      inputElement?.focus();
      inputElement?.select();
    }, 0);
  }

  function closeModal() {
    isModalOpen = false;
    editableValue = "";
  }

  function handleConfirm() {
    const result: EditResult = {
      property: propertyName,
      value: editableValue,
    };

    overlayEditResult.set(result);

    onConfirm?.(result);

    closeModal();
  }

  function handleCancel() {
    onCancel?.();
    closeModal();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleConfirm();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }
</script>

<div class="overlay-editor">
  <label class="overlay-editor__label" for={propertyName}>
    {title}
  </label>
  <input
    id={propertyName}
    class="overlay-editor__input"
    type="text"
    value={initialValue}
    readonly
    onclick={openModal}
    onkeydown={(e) => e.key === "Enter" && openModal()}
    tabindex="0"
  />
</div>

{#if isModalOpen}
  <div
    class="overlay-editor__modal-backdrop"
    onclick={handleOverlayClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="overlay-editor__modal">
      <div class="overlay-editor__modal-header">
        <h3 id="modal-title" class="overlay-editor__modal-title">
          Edit {title}
        </h3>
      </div>

      <div class="overlay-editor__modal-body">
        <div class="overlay-editor__field-group">
          <label class="overlay-editor__modal-label"> Current Value: </label>
          <input
            class="overlay-editor__modal-input overlay-editor__modal-input--readonly"
            type="text"
            value={initialValue}
            readonly
          />
        </div>

        <div class="overlay-editor__field-group">
          <label class="overlay-editor__modal-label" for="modal-edit-input">
            New Value:
          </label>
          <input
            id="modal-edit-input"
            class="overlay-editor__modal-input"
            type="text"
            bind:value={editableValue}
            bind:this={inputElement}
            onkeydown={handleKeydown}
          />
        </div>
      </div>

      <div class="overlay-editor__modal-footer">
        <button
          class="overlay-editor__button overlay-editor__button--cancel"
          onclick={handleCancel}
        >
          {cancelLabel}
        </button>
        <button
          class="overlay-editor__button overlay-editor__button--confirm"
          onclick={handleConfirm}
        >
          {okLabel}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .overlay-editor__label {
    font-weight: 500;
    color: var(--grey-dark);
    font-size: 0.875rem;
  }

  .overlay-editor__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background-color: #f9fafb;
    cursor: pointer;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .overlay-editor__input:hover {
    border-color: #9ca3af;
  }

  .overlay-editor__input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .overlay-editor__modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .overlay-editor__modal {
    background: white;
    border-radius: 0.5rem;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .overlay-editor__modal-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .overlay-editor__modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .overlay-editor__modal-body {
    padding: 1.5rem;
  }

  .overlay-editor__field-group {
    margin-bottom: 1.5rem;
  }

  .overlay-editor__field-group:last-child {
    margin-bottom: 0;
  }

  .overlay-editor__modal-label {
    display: block;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .overlay-editor__modal-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .overlay-editor__modal-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .overlay-editor__modal-input--readonly {
    background-color: #f9fafb;
    color: #6b7280;
  }

  .overlay-editor__modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .overlay-editor__button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .overlay-editor__button--cancel {
    background-color: #f9fafb;
    color: #374151;
    border-color: #d1d5db;
  }

  .overlay-editor__button--cancel:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  .overlay-editor__button--confirm {
    background-color: #3b82f6;
    color: white;
  }

  .overlay-editor__button--confirm:hover {
    background-color: #2563eb;
  }

  .overlay-editor__button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .overlay-editor__label {
      color: var(--grey-dark);
      font-size: 14px;
    }

    .overlay-editor__input:disabled {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }

    .overlay-editor__input:hover {
      border-color: #6b7280;
    }

    .overlay-editor__modal {
      background-color: #1f2937;
    }

    .overlay-editor__modal-header {
      border-bottom-color: #374151;
    }

    .overlay-editor__modal-title {
      color: #f9fafb;
    }

    .overlay-editor__modal-label {
      color: #d1d5db;
    }

    .overlay-editor__modal-input {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }

    .overlay-editor__modal-input--readonly {
      background-color: #4b5563;
      color: #9ca3af;
    }

    .overlay-editor__modal-footer {
      border-top-color: #374151;
    }

    .overlay-editor__button--cancel {
      background-color: #4b5563;
      color: #d1d5db;
      border-color: #6b7280;
    }

    .overlay-editor__button--cancel:hover {
      background-color: #6b7280;
      border-color: #9ca3af;
    }
  }
</style>
