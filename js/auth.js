(function (initAuth) {
  'use strict';

  // Email validation regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ── Tab switching ──────────────────────────────────────────
  const tabSignin  = document.getElementById('tab-signin');
  const tabSignup  = document.getElementById('tab-signup');
  const panelSignin = document.getElementById('panel-signin');
  const panelSignup = document.getElementById('panel-signup');

  function switchTab(target) {
    const isSignin = target === 'signin';

    tabSignin.classList.toggle('is-active', isSignin);
    tabSignup.classList.toggle('is-active', !isSignin);


    tabSignin.setAttribute('aria-selected', String(isSignin));
    tabSignup.setAttribute('aria-selected', String(!isSignin))

    panelSignin.classList.toggle('is-active', isSignin);
    panelSignup.classList.toggle('is-active', !isSignin);

    panelSignin.hidden = !isSignin;
    panelSignup.hidden = isSignin;
  }

  if (tabSignin) {
    tabSignin.addEventListener('click', function () { switchTab('signin'); });
  }

  if (tabSignup) {
    tabSignup.addEventListener('click', function () { switchTab('signup'); });
  }

  // Inline switch links inside panels
  document.querySelectorAll('.auth-switch-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchTab(this.dataset.target);
    });
  });

  // Open correct tab if redirected with ?tab=signup
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'signup') {
    switchTab('signup');
  }

  // ── Password visibility toggle ─────────────────────────────

  document.querySelectorAll('.auth-toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = this.parentElement.querySelector('.auth-input');
      if (!input) return;
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      var icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
      }
    });
  });

  // ── Validation helpers ─────────────────────────────────────

  function showError(inputEl, errorEl, message) {
    if (!inputEl || !errorEl) return;
    inputEl.classList.add('is-error');
    errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    if (!inputEl || !errorEl) return;
    inputEl.classList.remove('is-error');
    errorEl.textContent = '';
  }

  function validateEmail(value) {
    if (!value) return 'Email is required.';
    if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address.';
    return '';
  }

  function validatePassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  function validateName(value, label) {
    if (!value.trim()) return (label || 'This field') + ' is required.';
    return '';
  }

  // ── Sign In form ───────────────────────────────────────────

  var signinForm = document.getElementById('signinForm');

  if (signinForm) {
    var signinEmail = document.getElementById('signin-email');
    var signinEmailErr = document.getElementById('signin-email-error');
    var signinPassword = document.getElementById('signin-password');
    var signinPasswordErr = document.getElementById('signin-password-error');

    if (signinEmail) {
      signinEmail.addEventListener('blur', function () {
        var err = validateEmail(this.value);
        err ? showError(signinEmail, signinEmailErr, err) : clearError(signinEmail, signinEmailErr);
      });
    }

    if (signinPassword) {
      signinPassword.addEventListener('blur', function () {
        var err = validatePassword(this.value);
        err ? showError(signinPassword, signinPasswordErr, err) : clearError(signinPassword, signinPasswordErr);
      });
    }

    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailErr = validateEmail(signinEmail ? signinEmail.value : '');
      var passwordErr = validatePassword(signinPassword ? signinPassword.value : '');
      emailErr ? showError(signinEmail, signinEmailErr, emailErr) : clearError(signinEmail, signinEmailErr);
      passwordErr ? showError(signinPassword, signinPasswordErr, passwordErr) : clearError(signinPassword, signinPasswordErr);
      if (emailErr || passwordErr) return;
      // Firebase Auth sign in goes here
      console.log('Sign in submitted — Firebase Auth not yet wired.');
    });
  }

  // ── Sign Up form ───────────────────────────────────────────

  var signupForm = document.getElementById('signupForm');

  if (signupForm) {
    var signupFirstname = document.getElementById('signup-firstname');
    var signupFirstnameErr = document.getElementById('signup-firstname-error');
    var signupLastname = document.getElementById('signup-lastname');
    var signupLastnameErr = document.getElementById('signup-lastname-error');
    var signupEmail = document.getElementById('signup-email');
    var signupEmailErr = document.getElementById('signup-email-error');
    var signupPassword = document.getElementById('signup-password');
    var signupPasswordErr = document.getElementById('signup-password-error');

    if (signupFirstname) {
      signupFirstname.addEventListener('blur', function () {
        var err = validateName(this.value, 'First name');
        err ? showError(signupFirstname, signupFirstnameErr, err) : clearError(signupFirstname, signupFirstnameErr);
      });
    }

    if (signupLastname) {
      signupLastname.addEventListener('blur', function () {
        var err = validateName(this.value, 'Last name');
        err ? showError(signupLastname, signupLastnameErr, err) : clearError(signupLastname, signupLastnameErr);
      });
    }

    if (signupEmail) {
      signupEmail.addEventListener('blur', function () {
        var err = validateEmail(this.value);
        err ? showError(signupEmail, signupEmailErr, err) : clearError(signupEmail, signupEmailErr);
      });
    }

    if (signupPassword) {
      signupPassword.addEventListener('blur', function () {
        var err = validatePassword(this.value);
        err ? showError(signupPassword, signupPasswordErr, err) : clearError(signupPassword, signupPasswordErr);
      });
    }

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstnameErr = validateName(signupFirstname ? signupFirstname.value : '', 'First name');
      var lastnameErr = validateName(signupLastname ? signupLastname.value : '', 'Last name');
      var emailErr = validateEmail(signupEmail ? signupEmail.value : '');
      var passwordErr = validatePassword(signupPassword ? signupPassword.value : '');

      firstnameErr ? showError(signupFirstname, signupFirstnameErr, firstnameErr) : clearError(signupFirstname, signupFirstnameErr);
      lastnameErr ? showError(signupLastname, signupLastnameErr, lastnameErr) : clearError(signupLastname, signupLastnameErr);
      emailErr ? showError(signupEmail, signupEmailErr, emailErr) : clearError(signupEmail, signupEmailErr);
      passwordErr ? showError(signupPassword, signupPasswordErr, passwordErr) : clearError(signupPassword, signupPasswordErr);

      if (firstnameErr || lastnameErr || emailErr || passwordErr) return;

      // Firebase Auth create user goes here
      // After success → onboarding.html
      console.log('Sign up submitted — Firebase Auth not yet wired.');
      window.location.href = 'onboarding.html';
    });
  }

})();