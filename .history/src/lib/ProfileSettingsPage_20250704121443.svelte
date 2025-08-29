<script>
  import EditableInputSwitch from "./EditableInputSwitch.svelte";
  import { LoginData } from "./Store/login";

  let login_detail = $derived(get(LoginData))
</script>

<div class="psettings-cnt">
  <h4 style="font-size: 18px; color: var(--grey-dark);">General Settings</h4>
  {#if $LoginData && $LoginData.}
    <EditableInputSwitch
      label="Enable Notifications"
      propertyName="notifications"
      initialValue={true}
    ></EditableInputSwitch>
    <EditableInputSwitch
      label="Price Drop Alerts"
      propertyName="notifications"
      initialValue={true}
    ></EditableInputSwitch>
    <EditableInputSwitch
      label="Newsletter Subscriptions"
      propertyName="notifications"
      initialValue={true}
    ></EditableInputSwitch>
    <EditableInputSwitch
      label="Promotional Offers"
      propertyName="notifications"
      initialValue={true}
    ></EditableInputSwitch>
  {/if}
</div>

<style>
  .psettings-cnt {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 3em;
  }
</style>
