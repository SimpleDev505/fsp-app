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
  let review_array: CardsArray[] = [
    {
      descp:
        "Booking my flight was so simple and fast! Got the best deal to Delhi, and the confirmation came instantly. Highly recommended!  — Ananya R., Pune",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/about/people_1.jpg",
      stars: 4,
    },
    {
      descp:
        "I had to reschedule last minute, and their support team was super helpful. Everything was smooth and stress-free. — Rahul M., Bangalore",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/about/people_3.jpg",
    },
    {
      descp:
        "Loved the clean interface and the transparent pricing. No hidden charges — just great fares and great service! — Sneha D., Chennai",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/about/people_2.jpg",
    },
  ];
</script>

<div class="home-descrp">
  <div class="home-des-choose">
    <h4 style="font-size: var(--font-xg);color: var(--blue);">
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
    <h4 style="font-size: var(--font-xg);color: var(--blue);">
      What People Say
    </h4>
    <div class="home-des-choose-1">
      {#each review_array as review_item}
        <Card
          descp={review_item.descp}
          hoverColor={review_item.hoverColor}
          picture={review_item.picture}
          stars={review_item.stars}
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
