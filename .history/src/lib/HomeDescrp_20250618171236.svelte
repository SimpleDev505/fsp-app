<script lang="ts">
  import Card from "./Card.svelte";
  import ContactUs from "./ContactUs.svelte";
  interface CardsArray {
    descp: string;
    icon?: string | null;
    icon_size?: number;
    picture?: string | null;
    pic_size?: number;
    hoverColor?: string;
    stars?: number;
  }
  const choose_array: CardsArray[] = [
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
  const review_array: CardsArray[] = [
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
      stars: 4,
    },
    {
      descp:
        "Loved the clean interface and the transparent pricing. No hidden charges — just great fares and great service! — Sneha D., Chennai",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/about/people_2.jpg",
      stars: 5,
    },
  ];
  const popular_destinations: CardsArray[] = [
    {
      descp: "Goa",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/goa.jpg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Jaipur",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/jaipur.jpg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Kerala",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/kerala.jpg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Agra",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/agra.jpg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Mumbai",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/mumbai.jpg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Dubai",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/dubai.jpg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Bangkok",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/bangkok.jpg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Maldives",
      hoverColor: "var(--grey-light)",
      picture: "src/assets/img/dest/maldives.jpg",
      stars: 5,
      pic_size: 128,
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
    <h4 style="font-size: var(--font-xg);color: var(--blue);">
      Popular Destinations
    </h4>
    <div class="home-des-choose-2">
      {#each popular_destinations as destination}
        <Card
          descp={destination.descp}
          hoverColor={destination.hoverColor}
          picture={destination.picture}
          pic_size={destination.pic_size}
          stars={destination.stars}
        ></Card>
      {/each}
    </div>
  </div>
  <ContactUs></ContactUs>
</div>

<style>
  .home-descrp {
    position: absolute;
    bottom: -1650px;
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
  .home-des-choose-2 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    width: 90vw;
    height: fit-content;
    row-gap: 15px;
  }
</style>
