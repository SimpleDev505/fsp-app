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
