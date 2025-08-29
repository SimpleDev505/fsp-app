<script lang="ts">
  export let label: string;
  export let checked = false;
  export let onToggle: (val: boolean) => void = () => {};

  const isChecked = signal(checked);

  function toggle() {
    isChecked.set(!isChecked());
    onToggle(isChecked());
  }
</script>

<label class="switch-wrapper">
  <input type="checkbox" checked={isChecked()} on:change={toggle} />
  <span class="slider"></span>
  <span class="label-text">{label}</span>
</label>

<style>
  .switch-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  input[type="checkbox"] {
    display: none;
  }

  .slider {
    position: relative;
    width: 40px;
    height: 20px;
    background-color: #ccc;
    border-radius: 20px;
    transition: background-color 0.2s;
  }

  .slider::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 2px;
    left: 2px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  input[type="checkbox"]:checked + .slider {
    background-color: #04b0d3;
  }

  input[type="checkbox"]:checked + .slider::after {
    transform: translateX(20px);
  }

  .label-text {
    font-size: 0.9rem;
  }
</style>
