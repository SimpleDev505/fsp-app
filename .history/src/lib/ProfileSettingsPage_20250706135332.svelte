<script>
  import { get } from "svelte/store";
  import EditableInputSwitch from "./EditableInputSwitch.svelte";
  import { LoginData } from "./Store/login";

  let login_detail = $derived(get(LoginData));
</script>

<div class="psettings-cnt">
  <div class="psettings-1">
    <h4 style="font-size: 18px; color: var(--grey-dark);">General Settings</h4>
    {#if (login_detail && login_detail.user_type === "STAFF") || login_detail?.user_type === "ADMIN"}
      <EditableInputSwitch
        label="Enable SMS Notifications"
        propertyName="notifications"
        initialValue={true}
      ></EditableInputSwitch>
      <EditableInputSwitch
        label="Enable System Maintenance Mode"
        propertyName="notifications"
        initialValue={false}
      ></EditableInputSwitch>
      <EditableInputSwitch
        label="Enable Test/Sandbox Mode"
        propertyName="notifications"
        initialValue={false}
      ></EditableInputSwitch>
      <EditableInputSwitch
        label="Display Debug Information"
        propertyName="notifications"
        initialValue={false}
      ></EditableInputSwitch>
    {:else}
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
</div>

<style>
  .psettings-cnt {
    padding: 3em;
  }
  .psettings-1 {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>
