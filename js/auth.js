 // ===== TAB SWITCHER =====
        function switchTab(tab) {
            const slider = document.getElementById('tabSlider');
            const signinTab = document.getElementById('signinTab');
            const signupTab = document.getElementById('signupTab');
            const signinPanel = document.getElementById('signinPanel');
            const signupPanel = document.getElementById('signupPanel');

            if (tab === 'signin') {
                slider.classList.remove('signup');
                signinTab.classList.add('active');
                signupTab.classList.remove('active');
                signinPanel.classList.add('active');
                signupPanel.classList.remove('active');
            } else {
                slider.classList.add('signup');
                signupTab.classList.add('active');
                signinTab.classList.remove('active');
                signupPanel.classList.add('active');
                signinPanel.classList.remove('active');
            }
        }

        // ===== PASSWORD TOGGLE =====
        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            icon.className = isHidden
                ? 'fa-regular fa-eye-slash toggle-password'
                : 'fa-regular fa-eye toggle-password';
        }

        // ===== VALIDATION HELPERS =====
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function setError(fieldId, hasError) {
            const field = document.getElementById(fieldId);
            if (hasError) {
                field.classList.add('has-error');
            } else {
                field.classList.remove('has-error');
            }
            return hasError;
        }


        // ===== AUTO TAB FROM URL =====
        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') === 'signup') {
                switchTab('signup');
            }
        });

        // ===== SIGN IN FORM =====
        document.getElementById('signinForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value;

            let hasErrors = false;
            if (setError('signinEmailField', !EMAIL_REGEX.test(email))) hasErrors = true;
            if (setError('signinPasswordField', !password)) hasErrors = true;

            if (!hasErrors) {
                // TODO: Wire to backend / Firebase Auth
                alert(`Welcome back! Signing in as ${email}`);
            }
        });

        // ===== SIGN UP FORM =====
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;

            let hasErrors = false;
            if (setError('signupEmailField', !EMAIL_REGEX.test(email))) hasErrors = true;
            if (setError('signupPasswordField', password.length < 8)) hasErrors = true;
            if (setError('signupConfirmField', password !== confirm)) hasErrors = true;

            if (!hasErrors) {
                // TODO: Wire to backend / Firebase Auth
                alert(`Account created! Welcome to FurCare, ${email}`);
            }
        });

        // ===== CLEAR ERRORS ON INPUT =====
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const field = input.closest('.field-group');
                if (field) field.classList.remove('has-error');
            });
        });