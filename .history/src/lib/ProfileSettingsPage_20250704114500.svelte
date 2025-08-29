<script>
  import EditableInputSwitch from "./EditableInputSwitch.svelte";
</script>

<div class="psettings-cnt">
  <EditableInputSwitch
    label="Enable Notifications"
    propertyName="notifications"
    initialValue={true}
  ></EditableInputSwitch>
</div>

<style>
  .psettings-cnt {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1em;
  }
</style>
