
/**
 * RuMin Consultants - Shared Components
 * Loads the navbar and eligibility modal across the website.
 */

document.addEventListener('DOMContentLoaded', async function () {

    async function loadComponent(containerId, filePath) {
        const container = document.getElementById(containerId);

        if (!container) return;

        try {
            const response = await fetch(filePath);

            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }

            container.innerHTML = await response.text();

        } catch (error) {
            console.error('Component loading error:', error);
        }
    }

    // Load both shared components
    await Promise.all([
        loadComponent('shared-navbar', 'components/navbar.html'),
        loadComponent(
            'shared-eligibility-modal',
            'components/eligibility-modal.html'
        )
    ]);

    // Automatically highlight the active navbar link
    const navbarContainer = document.getElementById('shared-navbar');

    if (navbarContainer) {
        const currentPage =
            window.location.pathname.split('/').pop() || 'index.html';

        const navLinks = navbarContainer.querySelectorAll(
            '.navbar-nav a[href]'
        );

        navLinks.forEach(function (link) {
            const linkPage = link.getAttribute('href');

            if (linkPage === currentPage) {
                link.classList.add('active');

                const dropdown = link.closest('.dropdown');

                if (dropdown) {
                    const dropdownToggle =
                        dropdown.querySelector('.dropdown-toggle');

                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        });
    }

    // Handle the shared eligibility form
    const eligibilityForm = document.getElementById('eligibilityForm');

    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!eligibilityForm.reportValidity()) return;

            const country =
                document.getElementById('eligibilityCountry').value;

            const qualification =
                document.getElementById('eligibilityQualification').value;

            const budget =
                document.getElementById('eligibilityBudget').value;

            const message = [
                'Hello RuMin Consultants!',
                '',
                'I would like a free study abroad eligibility check.',
                '',
                'Preferred Country: ' + country,
                'Last Qualification: ' + qualification,
                'Estimated Budget: ' + budget,
                '',
                'Please guide me about my study abroad options.'
            ].join('\n');

            const whatsappNumber = '923139365284';

            const whatsappURL =
                'https://wa.me/' + whatsappNumber +
                '?text=' + encodeURIComponent(message);

            window.open(
                whatsappURL,
                '_blank',
                'noopener,noreferrer'
            );
        });
    }

});
