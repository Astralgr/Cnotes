  // ── Config ────────────────────────────────────────────────────────────────
  const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SrhHpK06TvHy2wn8J1AdR6flKL7M3roxYZr8qqHRB6hNN7ebgvWN9ui9qgvo2Fx6eJBNQrXH1mmfKWGUeTF3mNP00hlEYzPqa'; // Replace with your key
  const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
 const API_BASE = 'https://web-production-fcbb6.up.railway.app';


  // ── Billing toggle state ──────────────────────────────────────────────────
  let currentBilling = 'monthly'; // 'monthly' or 'annual'

  // ── Grab the billing toggle (Monthly/Annual switch in the plan modal) ─────
  // Find the toggle element — update selector to match your actual element
  const billingToggle = document.querySelector('input[type="checkbox"]');
  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      currentBilling = e.target.checked ? 'annual' : 'monthly';
      updatePriceDisplay();
    });
  }

  // ── Update displayed prices when billing period changes ───────────────────
  function updatePriceDisplay() {
    const prices = {
      starter:   { monthly: '$9/mo',  annual: '$7/mo' },
      pro:       { monthly: '$19/mo', annual: '$15/mo' },
      unlimited: { monthly: '$29/mo', annual: '$23/mo' },
    };
    // Update price text in the modal if needed
    // Adjust selectors to match your actual DOM elements
  }

  // ── Handle Upgrade button clicks ──────────────────────────────────────────
  async function handleUpgrade(plan) {
    // Get current user info — adjust based on how your app stores auth state
    const userEmail = getCurrentUserEmail(); // implement based on your auth
    const userId    = getCurrentUserId();    // implement based on your auth

    if (!userEmail || !userId) {
      // User not signed in — trigger your existing sign in modal
      document.querySelector('[data-action="signin"]')?.click();
      return;
    }

    try {
      const response = await fetch('https://web-production-fcbb6.up.railway.app/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing: currentBilling,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Checkout error:', data.error);
        alert('Something went wrong. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please check your connection.');
    }
  }

  // ── Handle Manage Subscription (for existing subscribers) ─────────────────
  async function handleManageSubscription() {
    const stripeCustomerId = getCurrentUserStripeId(); // from your database/auth state

    try {
      const response = await fetch(`${API_BASE}/create-portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeCustomerId }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Portal error:', err);
    }
  }

  // ── Attach click handlers to your Upgrade buttons ─────────────────────────
  // These selectors are based on the plan modal structure visible in your HTML.
  // Find the three Upgrade buttons and attach handlers:
  document.addEventListener('DOMContentLoaded', () => {

    // Find all upgrade buttons in the plan modal
    const upgradeButtons = document.querySelectorAll('.plan-upgrade-btn');
    // If the above selector doesn't work, try: document.querySelectorAll('button')
    // and filter by text content, e.g.:
    const allButtons = Array.from(document.querySelectorAll('button'));
    const starterBtn   = allButtons.find(b => b.textContent.trim() === 'Upgrade' && b.closest('.plan-starter'));
    const proBtn       = allButtons.find(b => b.textContent.trim() === 'Upgrade' && b.closest('.plan-pro'));
    const unlimitedBtn = allButtons.find(b => b.textContent.trim() === 'Upgrade' && b.closest('.plan-unlimited'));

    if (starterBtn)   starterBtn.addEventListener('click',   () => handleUpgrade('starter'));
    if (proBtn)       proBtn.addEventListener('click',       () => handleUpgrade('pro'));
    if (unlimitedBtn) unlimitedBtn.addEventListener('click', () => handleUpgrade('unlimited'));
  });

  // ── Placeholder auth helpers — replace with your actual auth logic ─────────
  function getCurrentUserEmail() {
    // Replace with your actual implementation, e.g.:
    // return firebase.auth().currentUser?.email;
    // return supabase.auth.getUser()?.email;
    return localStorage.getItem('userEmail') || null;
  }

  function getCurrentUserId() {
    return localStorage.getItem('userId') || null;
  }

  function getCurrentUserStripeId() {
    return localStorage.getItem('stripeCustomerId') || null;
  }

  // ── Handle post-payment redirect ──────────────────────────────────────────
  if (window.location.pathname === '/success') {
    const params  = new URLSearchParams(window.location.search);
    const session = params.get('session_id');
    if (session) {
      console.log('Payment successful, session:', session);
      // TODO: Update your UI to reflect the new plan
      // e.g. refresh user data from your backend, update customer slots shown
    }
  }