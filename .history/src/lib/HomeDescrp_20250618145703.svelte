<script lang="ts">
  import Card from "./Card.svelte";
  interface CardsArray {
    descp: string;
    icon?: string | null;
    icon_size?: number;
    picture?: string | null;
    pic_size?: number;
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
  let popular_destinations: CardsArray[] = [
    {
      descp: "Goa",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/4428274/pexels-photo-4428274.jpeg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Jaipur",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/784879/pexels-photo-784879.jpeg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Kerala",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/2780309/pexels-photo-2780309.jpeg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Agra",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Mumbai",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/24532219/pexels-photo-24532219.jpeg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Dubai", // International destination
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg",
      stars: 4,
      pic_size: 128,
    },
    {
      descp: "Bangkok",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/1374377/pexels-photo-1374377.jpeg",
      stars: 5,
      pic_size: 128,
    },
    {
      descp: "Maldives",
      hoverColor: "var(--grey-light)",
      picture:
        "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg",
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

  <div class="contact-us">
    <div class="rectangle-31"></div>
    <div class="component-6">
      <div class="rectangle-10"></div>
      <div data-svg-wrapper class="elmap-marker">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 0C14.5908 0 6.15234 8.43838 6.15234 18.8477C6.15234 22.3288 6.83372 25.9242 8.78905 28.5156L25 50L41.2109 28.5156C42.987 26.1619 43.8476 22.0008 43.8476 18.8477C43.8477 8.43838 35.4093 0 25 0ZM25 10.9161C29.3798 10.9161 32.9315 14.4678 32.9315 18.8476C32.9315 23.2275 29.3798 26.7792 25 26.7792C20.6202 26.7792 17.0685 23.2275 17.0685 18.8477C17.0685 14.4678 20.6202 10.9161 25 10.9161Z" fill="#DD5471"/>
        </svg>
      </div>
    </div>
    <div class="frame-3851">
      <div class="frame-3851_01">
        <div class="frame-3851_02">
          <div><span class="contactus_01_span">Contact Us</span></div>
        </div>
        <div class="frame-830">
          <div class="text-field">
            <div><span class="name_span_01">Name </span><span class="name_span_02">*</span></div>
          </div>
          <div class="text-field_01">
            <div><span class="email_span">Email</span></div>
          </div>
          <div class="text-field_02">
            <div><span class="phonenumber_span_01">Phone number </span><span class="phonenumber_span_02">*</span></div>
          </div>
        </div>
</div>

<style>
  .home-descrp {
    position: absolute;
    bottom: -1250px;
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
    width: 90vw;
    height: fit-content;
    row-gap: 15px;
  }
</style>
