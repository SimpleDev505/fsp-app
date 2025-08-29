<script>
  import { get } from "svelte/store";
  import EditableInputSwitch from "./EditableInputSwitch.svelte";
  import { LoginData } from "./Store/login";
  import { Announcements, fetchLatestAnnouncements } from "./Store/announce";
  import { LoadingType } from "./Store/dash";

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
  <div class="psettings-2">
    <h4
      style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
    padding: 10px; color: white; border-radius: 3px;
    font-size: var(--font-sm);"
    >
      Your Announcements
      <button
        class="refresh-btn"
        disabled={$LoadingType === "ANN"}
        onclick={() => fetchLatestAnnouncements()}
        ><span class="material-symbols-outlined"> autorenew </span></button
      >
    </h4>
    <div class="announcements-scroll">
      {#each $Announcements as ann}
        <div class="announcement announcement-{ann.type}">
          <strong>{ann.message_author}</strong>
          {ann.message}
        </div>{/each}
    </div>
  </div>
</div>

<style>
  .announcements-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0 1em;
    height: 20em;
    scrollbar-width: thin;
    scrollbar-color: var(--blue-dark) transparent;
    position: relative;
    padding-bottom: 100px;
  }
  .announcement {
    background: #fff;
    border-left: 5px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    outline: 3px solid var(--grey-light);
    transition: 0.2s ease-in-out;
    cursor: pointer;
  }
  .announcement:hover {
    scale: 0.95 1;
  }

  .announcement-WARNING {
    border-color: var(--yellow);
  }
  .announcement-WARNING:hover {
    outline: 3px solid var(--yellow);
  }
  .announcement-IMPORTANT {
    border-color: var(--red);
  }
  .announcement-IMPORTANT:hover {
    outline: 3px solid var(--red);
  }

  .announcement-INFO {
    border-color: var(--blue);
  }
  .announcement-INFO:hover {
    outline: 3px solid var(--blue);
  }
  .psettings-cnt {
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 3em;
    column-gap: 50px;
  }
  .psettings-1 {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: fit-content;
  }
</style>
