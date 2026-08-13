(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    //Crousel
    document.addEventListener('DOMContentLoaded', function() {
        const detailsBtn = document.getElementById('detailsBtn');
        const moreContent = document.getElementById('moreContent');
        
        if (detailsBtn && moreContent) {
            detailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (moreContent.classList.contains('d-none')) {
                    moreContent.classList.remove('d-none');
                    detailsBtn.textContent = 'Less Details';
                } else {
                    moreContent.classList.add('d-none');
                    detailsBtn.textContent = 'More Details';
                }
            });
        }
    });
    // Carousel Section Toggle
document.addEventListener('DOMContentLoaded', function() {
    const carouselDetailsBtn = document.getElementById('detailsBtnCarousel');
    const carouselMoreContent = document.getElementById('moreContentCarousel');
    
    if (carouselDetailsBtn && carouselMoreContent) {
        carouselDetailsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (carouselMoreContent.style.display === 'none' || carouselMoreContent.style.display === '') {
                carouselMoreContent.style.display = 'inline';
                carouselDetailsBtn.textContent = 'Less Details';
            } else {
                carouselMoreContent.style.display = 'none';
                carouselDetailsBtn.textContent = 'More Details';
            }
        });
    }
});
// Services Section Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all service items as collapsed
    document.querySelectorAll('.service-item').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.explore-btn');
        if (btn) btn.textContent = 'Explore More';
    });

    // Handle Explore More button clicks
    document.querySelectorAll('.explore-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceItem = this.closest('.service-item');
            
            // Close all other items first
            document.querySelectorAll('.service-item').forEach(item => {
                if (item !== serviceItem) {
                    item.classList.remove('active');
                    const otherBtn = item.querySelector('.explore-btn');
                    if (otherBtn) otherBtn.textContent = 'Explore More';
                }
            });
            
            // Toggle current item
            if (serviceItem) {
                serviceItem.classList.toggle('active');
                this.textContent = serviceItem.classList.contains('active') 
                    ? 'Show Less' 
                    : 'Explore More';
            }
        });
    });
});

//  Features read more button
document.addEventListener('DOMContentLoaded', function() {
    // More Features Button
    const moreFeaturesBtn = document.getElementById('moreFeaturesBtn');
    const additionalFeatures = document.querySelectorAll('.additional-feature');
    let featuresShown = false;

    if (moreFeaturesBtn) {
        moreFeaturesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!featuresShown) {
                // Show additional features
                additionalFeatures.forEach(feature => {
                    feature.style.display = 'block';
                    // Trigger animation
                    const wowElement = feature.querySelector('.wow');
                    if (wowElement) {
                        wowElement.classList.add('animated');
                    }
                });
                moreFeaturesBtn.textContent = 'Fewer Features';
                featuresShown = true;
            } else {
                // Hide additional features
                additionalFeatures.forEach(feature => {
                    feature.style.display = 'none';
                });
                moreFeaturesBtn.textContent = 'More Features';
                featuresShown = false;
            }
        });
    }

    // Read More functionality
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.getAttribute('data-content');
            const title = this.closest('.feature-content').querySelector('h5').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'feature-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>${title}</h5>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${content}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            const closeModal = () => {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            };
            
            const handleEscape = (e) => {
                if (e.key === 'Escape') closeModal();
            };
            
            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
            document.addEventListener('keydown', handleEscape);
        });
    });
});
//More countries button
document.addEventListener('DOMContentLoaded', function() {
    const moreCountriesButtons = document.querySelectorAll('.btn.btn-primary.border-secondary.rounded-pill.py-3.px-5.wow.fadeInUp');

    moreCountriesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const nextRow = this.closest('.row').nextElementSibling;
            if (nextRow) {
                nextRow.style.display = 'flex';
            }
        });
    });
});

    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top shadow-sm');
        } else {
            $('.nav-bar').removeClass('sticky-top shadow-sm');
        }
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonial-carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });

    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


   

})(jQuery);

