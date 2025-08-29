<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  gsap.registerPlugin(ScrollTrigger);
  let animatedElementRef: HTMLElement | null = null;
  onMount(() => {});
  if (animatedElementRef) {
    ScrollTrigger.create({
      trigger: animatedElementRef,
      start: "top center",

      toggleActions: "play none none none",

      animation: gsap.from(animatedElementRef, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
      }),
    });
  } else {
    animatedElementRef = document.getElementsByTagName("body")[0];
  }

  onDestroy(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  });
</script>

<div class="home-cnt">
  <Nav></Nav>

  <div class="home-header">
    <div class="home-img-cnt">
      <div class="home-img-filter"></div>
      <img class="home-img" src="src/assets/img/home.png" alt="" />
    </div>
  </div>
  <div class="home-title">
    <span class="home-title-1">Your Journey Begins Here</span>
  </div>
  <div class="about-wrapper">
    <section class="about-section">
      <h2>About Us</h2>
      <div class="about-features">
        <div class="feature-box">
          <span>Smart Price Guarantee</span>
        </div>
        <div class="feature-box">
          <span>24/7 Customer Support</span>
        </div>
        <div class="feature-box">
          <span>Seamless Payments</span>
        </div>
      </div>
      <p>
        Airline Company is a proud initiative of our Group and is redefining the
        travel experience with reliable operations, exceptional services, and
        customer-focused innovations. Based on the fastest-growing airline
        service in the region, we emphasize affordable travel choices,
        professional air travel services, and a seamless flying experience that
        connects people through the heart of aviation.
      </p>
      <p>
        With a massive fleet of over 400 aircraft across thousands of daily
        flights, serviced by over 120 destination touchpoints, leading the
        innovation edge. Since our launch, we have won over 100+ customer
        performance recognitions in the last five years. Recognized for our
        leading edge in customer performance and employee excellence across 15+
        countries, we strive to deliver travel that ensures trust and a reliable
        future. Our vision is to lead with empathy, elevate the travel
        experience, and inspire the new standard across aviation.
      </p>
    </section>

    <section class="about-section">
      <h2>Generating Opportunities</h2>
      <p>
        From our earliest days, our mission has been to unlock global
        efficiencies—empowering local access by promoting accessibility, and
        letting passengers go places. Our streamlined structure and scalable
        operations enable businesses across continents, allowing diverse
        regional economic growth and broader opportunities worldwide. Whether
        major metropolitan hubs or underserved regions, our commitment is
        performance backed. Bringing the world closer—starting with you.
      </p>
    </section>

    <section class="about-section">
      <h2>Our People, Our Spirit</h2>
      <p>
        We believe that our people are the heartbeat of our airline. Every day,
        our dedicated team of over 30,000 aviation professionals working from
        more than 20,000 locations in terminals, offices, and skies, form a
        platform to support exceptional travel experiences. With global
        teamwork, respect, and dedication as the wings to everything we do, our
        future depends on the passion and excellence we continually strive to
        grow. We power the world's leading airline with pride—and build new
        standards to serve the Airline Company legacy forward.
      </p>
    </section>

    <section class="about-section">
      <h2>Financial performance Q3 FY 2025</h2>
      <div class="financial-summary">
        <div class="finance-box">Revenue ₹22.1B</div>
        <div class="finance-box">EBITDA ₹10.8B</div>
        <div class="finance-box">Net Profit ₹2.7B</div>
      </div>
      <h3>ESG Highlights</h3>
      <table class="esg-table">
        <thead>
          <tr>
            <th>Environment</th>
            <th>Social</th>
            <th>Governance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fuel efficiency improved by 18%</td>
            <td>32,000+ global employees</td>
            <td>Transparent reporting practices</td>
          </tr>
          <tr>
            <td>40% carbon reduction goal by 2030</td>
            <td>Health & safety programs expanded</td>
            <td>Independent board oversight</td>
          </tr>
          <tr>
            <td>Investing in sustainable aviation fuel</td>
            <td>20+ community uplift initiatives</td>
            <td>Annual ethics audit conducted</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
  <div style="grid-column: 1; grid-row: 4;">
    <Footer></Footer>
  </div>
</div>

<style>
  .esg-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #ddd;
  }

  .esg-table thead th {
    background-color: var(--blue);
    color: white;
    padding: 12px;
  }

  .esg-table tbody td {
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
  .home-title {
    grid-column: 1;
    grid-row: 2;
    z-index: 2;
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    position: static;
    margin-top: 500px;
    left: 0;
    pointer-events: none;
  }
  .home-title-1 {
    font-size: 60px;
    margin-bottom: 150px;
    color: white;
    font-weight: bolder;
    -webkit-text-stroke: 5px rgba(255, 255, 255, 0.8);
    letter-spacing: 2px;
  }
  .home-cnt {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    width: 100%;
    height: 100%;
  }
  .home-header {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .home-img-cnt {
    width: 100%;
    height: 745px;
    position: relative;
    overflow-y: hidden;
    filter: grayscale(25%);
    filter: saturate(0%);
  }
  .home-img-filter {
    background: var(--blue);
    filter: opacity(13%);
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .home-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .about-wrapper {
    grid-column: 1;
    grid-row: 3;
    padding: 40px 20px;
    max-width: 960px;
    margin: auto;
    font-family: sans-serif;
    opacity: 0;
  }

  .about-section {
    margin-bottom: 40px;
  }

  .about-section h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--blue);
    text-align: center;
  }

  .about-section p {
    line-height: 1.7;
    color: var(--grey-dark);
    font-size: 15px;
    margin: 12px 0;
    text-align: justify;
  }

  .about-features {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    gap: 10px;
    flex-wrap: wrap;
  }

  .feature-box {
    flex: 1 1 30%;
    background: #f5f8fa;
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    font-weight: 600;
  }

  .financial-summary {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
    flex-wrap: wrap;
    gap: 10px;
  }

  .finance-box {
    background-color: var(--blue);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: bold;
  }

  .esg-boxes {
    display: flex;
    justify-content: space-around;
    gap: 10px;
    margin-top: 10px;
  }

  .esg-category {
    background: #e6f4f1;
    padding: 12px 16px;
    border-radius: 6px;
    font-weight: bold;
    color: var(--blue);
    flex: 1 1 30%;
    text-align: center;
  }
</style>
