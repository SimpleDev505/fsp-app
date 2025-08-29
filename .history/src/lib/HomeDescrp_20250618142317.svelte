<script lang="ts">
  import Card from "./Card.svelte";
  interface CardsArray {
    descp: string;
    icon?: string | null;
    icon_size?: number;
    picture?: string | null;
    hoverColor?: string;
    stars?: number;
  }
  let choose_array: CardsArray[] = [
    {
      descp:
        "We compare prices across airlines and offer the most competitive rates no hidden fees.",
      hoverColor: "var(--grey-light)",
      icon: "paid",
      icon_size: 35,
    },
    {
      descp:
        "Get help anytime via chat, email, or phone—because travel plans can change anytime.",
      hoverColor: "var(--grey-light)",
      icon: "support_agent",
      icon_size: 35,
    },
    {
      descp:
        "Your transactions are protected with end-to-end encryption and trusted payment partners.",
      hoverColor: "var(--grey-light)",
      icon: "currency_exchange",
      icon_size: 30,
    },
  ];
</script>

<div class="home-descrp">
  <div class="home-des-choose">
    <h4 style="font-size: var(--font-lg);;color: var(--blue);">
      Why Choose Us?
    </h4>
    <div class="home-des-choose-1">
      {#each choose_array as choose_item}
        <Card
          descp={choose_item.descp}
          hoverColor={choose_item.hoverColor}
          icon={choose_item.icon}
          icon_size={choose_item.icon_size}
        ></Card>
      {/each}
    </div>
  </div>
</div>

<style>
  .home-descrp {
    position: absolute;
    bottom: -350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
    grid-column: 1;
    grid-row: 3;
  }
  .home-des-choose {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 15px;
    user-select: none;
  }
  .home-des-choose-1 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    column-gap: 15px;
  }
</style>
