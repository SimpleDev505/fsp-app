<script lang="ts">
  import Card from "./Card.svelte";
</script>

<div class="home-descrp">
  <Card
    descp="We compare prices across airlines and offer the most competitive rates no hidden fees."
    hoverColor="var(--grey-light)"
    icon="paid"
    icon_size={35}
  ></Card>
  <Card
    descp="Get help anytime via chat, email, or phone—because travel plans can change anytime."
    hoverColor="var(--grey-light)"
    icon="support_agent"
    icon_size={35}
  ></Card>
  <Card
    descp="Your transactions are protected with end-to-end encryption and trusted payment partners."
    hoverColor="var(--grey-light)"
    icon="currency_exchange"
    icon_size={35}
  ></Card>
</div>

<style>
  .home-descrp {
    position: absolute;
    bottom: -200px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: fit-content;
    grid-column: 1;
    grid-row: 3;
  }
</style>
