import { supabase } from './supabaseClient.js';

(function () {
  'use strict';

  const loginView = document.getElementById('loginView');
  const signupView = document.getElementById('signupView');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  const accountInput = document.getElementById('account');
  const passwordInput = document.getElementById('password');

  const signupAccountInput = document.getElementById('signupAccount');
  const signupPasswordInput = document.getElementById('signupPassword');

  const loginErrorEl = document.getElementById('loginError');
  const signupErrorEl = document.getElementById('signupError');

  function show(view) {
    if (!loginView || !signupView) return;

    if (view === 'login') {
      signupView.style.display = 'none';
      loginView.style.display = 'flex';
    } else {
      loginView.style.display = 'none';
      signupView.style.display = 'flex';
    }
  }

  function setError(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.style.display = msg ? 'block' : 'none';
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(loginErrorEl, '');

    const email = (accountInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!email || !password) {
      setError(loginErrorEl, 'Please enter account and password.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // When the user doesn't exist, Supabase generally returns an “invalid login credentials” style message.
      const msg = (error.message || '').toLowerCase();
      const likelyNoAccount =
        msg.includes('invalid') ||
        msg.includes('credentials') ||
        msg.includes('user') ||
        msg.includes('not found');

      if (likelyNoAccount && signupView) {
        if (signupAccountInput) signupAccountInput.value = email;
        setError(signupErrorEl, 'No guild account found. Create one to enter.');
        show('signup');
        return;
      }

      setError(loginErrorEl, error.message || 'Login failed.');
      return;
    }

    // Logged in successfully.
    setError(loginErrorEl, 'Entered the guild hall.');
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError(signupErrorEl, '');

    const email = (signupAccountInput?.value || '').trim();
    const password = signupPasswordInput?.value || '';

    if (!email || !password) {
      setError(signupErrorEl, 'Please enter account and password.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(signupErrorEl, error.message || 'Signup failed.');
      return;
    }

    // If email confirmation is enabled, user may need to confirm.
    setError(loginErrorEl, 'Account created. Check your email to confirm, then log in.');
    show('login');
  }

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  document.addEventListener('click', (ev) => {
    const t = ev.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.matches('[data-action="go-signup"]')) {
      ev.preventDefault();
      if (signupAccountInput && accountInput) signupAccountInput.value = (accountInput.value || '').trim();
      setError(signupErrorEl, '');
      show('signup');
    }

    if (t.matches('[data-action="go-login"]')) {
      ev.preventDefault();
      setError(loginErrorEl, '');
      show('login');
    }
  });
})();

