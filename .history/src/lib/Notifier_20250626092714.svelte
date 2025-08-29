<script lang="ts">
  let {
    P_error,
    Type = "SUCCESS",
  }: { P_error: string; Type?: "WARN" | "ERROR" | "SUCCESS" } = $props();
</script>

<p
  id="perror"
  style="font-size: var(--font-s); color: var(--red); width: 100%; height: fit-content; padding: 5px; background-color: rgba(255, 0, 0, 0.1);
            border-radius: 3px; white-space: nowrap;
            border-left: 3px solid var(--red);"
>
  {P_error}
</p>

<style>
  /* payemnts */
  .payment-container {
    display: flex;
    gap: 1rem;
    background: #e9f4fc;
    padding: 1rem;
    border-radius: 10px;
    position: relative;
    font-family: sans-serif;
  }

  .payment-container .methods {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .payment-container .methods button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    font-weight: 500;
    transition: 0.3s ease;
  }

  .payment-container .methods button.selected {
    background: var(--blue);
    color: white;
  }

  .payment-container .methods .material-symbols-outlined {
    font-size: 18px;
  }

  .payment-container .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .payment-container .input {
    padding: 0.6rem;
    font-size: var(--font-sm);
    border-radius: 6px;
    border: 1px solid var(--grey-light);
    width: 100%;
  }

  .payment-container .total {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .payment-container .total .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .payment-container .old {
    color: var(--red);
    font-weight: bold;
  }

  .payment-container .new {
    color: var(--green);
    font-size: 1.4rem;
    font-weight: bold;
  }

  .payment-container .discount {
    color: var(--yellow);
    font-weight: bold;
  }

  .payment-container .coupons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .payment-container .apply {
    background: var(--blue);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    font-weight: bold;
    border-radius: 6px;
    align-self: flex-start;
    cursor: pointer;
  }
  .payment-container .apply:hover {
    background-color: var(--blue-dark);
  }
  /* Baggage */
  .baggage-grid {
    position: relative !important;
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1rem !important;
    background: var(--grey-light) !important;
    padding: 1rem !important;
    border-radius: 10px !important;
  }

  .baggage-item {
    position: relative !important;
    display: flex !important;
    justify-content: center !important;
    column-gap: 14px;
    align-items: center !important;
    background: white !important;
    border-radius: 8px !important;
    padding: 0.5rem 1rem !important;
    box-shadow: 0 0 0 1px #ddd !important;
    width: 10em !important;
  }

  .label {
    position: relative !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    color: var(--grey-dark) !important;
    width: fit-content !important;
  }

  .counter {
    position: relative !important;
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
    column-gap: 15px !important;
    gap: 0.4rem !important;
    width: 4em !important;
  }

  .counter button {
    position: relative !important;
    font-size: 1rem !important;
    font-weight: bold !important;
    background: #f6faff !important;
    color: var(--blue) !important;
    border: 1px solid var(--grey-light) !important;
    border-radius: 6px !important;
    cursor: pointer !important;
  }

  .counter span {
    position: relative !important;
    min-width: fit-content !important;
    text-align: center !important;
    font-weight: bold !important;
    font-size: 1rem !important;
  }

  /* ----------- */
  .traveller-apply-btn {
    background-color: var(--blue);
  }
  .traveller-apply-btn:hover {
    background-color: var(--blue-dark);
  }
  .traveller-detail-cnt {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 25em;
    padding-left: 10px;
    padding-right: 10px;
  }
  .traveller-detail-cnt button {
    border: none;
    background-color: white;
    font-weight: bold;
    border-radius: 4px;
    padding: 8px;
    color: var(--blue);
    position: absolute;
    outline: 2px solid var(--grey-light);
  }
  .traveller-detail-cnt button:hover {
    outline: 2px solid var(--blue-dark);
    cursor: pointer;
  }
  .traveller-counter {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    height: fit-content;
    padding: 10px;
    outline: 2px solid var(--grey-light);
    border-radius: 8px;
    column-gap: 10px;
  }
  .counter-btns {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    column-gap: 10px;
  }
  .counter-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 4em;
    color: var(--grey-dark);
    border-radius: 8px;
    user-select: none;
    background-color: var(--grey-light);
    overflow: hidden;
  }
  .counter-btn:hover {
    outline: 2px solid var(--blue-dark);
    cursor: pointer;
  }
  .counter-btn button {
    text-align: center;
    vertical-align: middle;
    height: fit-content;
    width: 100%;
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: var(--grey-light);
    color: var(--grey-dark);
    font-size: 20px;
    padding: 0;
    font-weight: bold;
    white-space: nowrap;
  }
  .traveller-counter .counter-btn button:hover {
    background-color: var(--grey-dark);
    color: var(--grey-light);
    cursor: pointer;
  }
  /* Travellers */
  .traveller-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 8px;
    margin-top: 10px;
    outline: 2px solid var(--grey-light);
    padding: 1em;
    border-radius: 10px;
    margin-left: 5px;
    width: 100%;
    height: fit-content;
  }
  .traveller-detail input {
    border: 1px solid var(--grey-light);
    padding: 0.5em;
    border-radius: 4px;
    width: 100%;
  }
  .traveller-detail label {
    font-size: var(--font-s);
    color: var(--grey-dark);
    width: 100%;
    text-align: start;
  }
  /* Booking */

  .flight-time {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .summary-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--grey-light);
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
    margin: 1rem 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    margin: 0;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }
  .summary-card {
    border: 1px solid var(--grey-light);
    border-radius: 12px;
    padding: 1rem;
    width: fit-content;
    font-family: "Segoe UI", sans-serif;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .flight-details {
    flex: 1;
  }

  .flight-details strong {
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .sub-info {
    font-size: 0.85rem;
    color: var(--grey-dark);
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .price-section {
    text-align: right;
    font-size: 0.9rem;
  }

  .price {
    color: var(--green);
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .base-price {
    color: var(--grey-dark);
    font-size: 0.85rem;
  }

  .summary-bottom {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    text-align: center;
    gap: 2rem;
    width: 100%;
  }

  .time-block {
    font-size: 0.9rem;
  }

  .time {
    font-weight: bold;
    font-size: 1.1rem;
    display: block;
  }

  .middle-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    font-size: 0.9rem;
    color: #333;
  }

  .icon {
    font-size: 1rem;
    vertical-align: middle;
  }
  .book-flight {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100vh;
    z-index: 1001;
    overflow: hidden;
  }
  .book-flight-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }
  .book-flight-summary {
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    justify-content: flex-start;
    align-items: center;
    width: 40em;
    height: 100%;
    background-color: white;
    row-gap: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
