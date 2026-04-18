// Constants
const FAQ_SELECTOR = '.faq-item';
const FAQ_OPEN_CLASS = 'is-open';

// FAQ accordion
(function initFaq() {
    const faqItems = document.querySelectorAll(FAQ_SELECTOR);

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains(FAQ_OPEN_CLASS);

            // Close all open items first
            faqItems.forEach(other => {
                const otherAnswer = other.querySelector('.faq-answer');
                const otherQuestion = other.querySelector('.faq-question');

                other.classList.remove(FAQ_OPEN_CLASS);
                if (otherAnswer) otherAnswer.classList.remove(FAQ_OPEN_CLASS);
                if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add(FAQ_OPEN_CLASS);
                answer.classList.add(FAQ_OPEN_CLASS);
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
})();

// Scroll animations for sitter page cards
(function initSitterAnimations() {
    const animatedElements = document.querySelectorAll(
        '.perk-card, .sitter-step-card, .sitter-review-card, .requirements-card'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
})();