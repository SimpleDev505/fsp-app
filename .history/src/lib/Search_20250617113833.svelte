<script lang="ts">
  import type { MenuItem } from "./Store/store";

  let triptype_menu: MenuItem = [
    {
      label: "One Way",
      action: () => {
        console.log(this.label);
      },
    },
  ];
</script>
