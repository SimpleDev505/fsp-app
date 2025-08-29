<script lang="ts">
  let {
    descp = "None",
    icon = null,
    icon_size = 0,
    picture = null,
    hoverColor = "#f0f0f0",
    stars = 0,
  }: {
    descp: string;
    icon?: string | null;
    icon_size?: number;
    picture?: string | null;
    hoverColor?: string;
    stars?: number;
  } = $props();

  const maxStars = 5;
</script>

<div class="card" style="--hover-color: {hoverColor}">
  <div class="card-header">
    {#if icon}
      <div class="icon">
        <span
          style="font-size: {icon_size}px;"
          class="material-symbols-outlined"
        >
          {icon}
        </span>
      </div>
    {:else if picture}
      <img class="picture" src={picture} alt="Cardimage" />
    {/if}
  </div>

  <div class="card-body">
    <div class="description">{descp}</div>

    {#if stars > 0}
      <div class="stars">
        {#each Array(maxStars) as _, i}
          <span class={i < stars ? "filled" : ""}>★</span>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .card {
    width: 240px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    transition: background-color 0.2s ease-in-out;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    cursor: default;
    user-select: none;
  }

  .card:hover {
    background-color: var(--hover-color);
  }

  .card-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
  }

  .icon {
    font-size: 32px;
  }

  .picture {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  .card-body {
    text-align: center;
    width: 100%;
    position: relative;
  }

  .description {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .stars {
    position: absolute;
    right: 8px;
    bottom: 4px;
    font-size: 14px;
    color: #ccc;
  }

  .stars .filled {
    color: #f4b400;
    font-weight: bolder;
  }
</style>
