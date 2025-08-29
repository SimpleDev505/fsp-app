<script lang="ts">
  export let message_author: string;
  export let message: string;
  export let type: string;
  export let timestamp: string;
</script>

<div class="announcement-card {type.toLowerCase()}">
  <div class="meta">
    <strong>{message_author}</strong>
    <span>{new Date(timestamp).toLocaleString()}</span>
  </div>
  <div class="content">{message}</div>
</div>

<style>
  .announcement-card {
    padding: 1rem;
    border-radius: 8px;
    margin: 0.5rem 0;
    background-color: var(--grey-light);
    border-left: 5px solid var(--blue);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .announcement-card.warning {
    border-left-color: var(--yellow);
  }

  .announcement-card.alert {
    border-left-color: var(--red);
  }

  .announcement-card.info {
    border-left-color: var(--blue-dark);
  }

  .meta {
    font-size: var(--font-s);
    color: var(--grey-dark);
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }

  .content {
    font-size: var(--font-sm);
    color: #000;
  }
</style>
