// Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. NAVBAR (Control de visibilidad y estilo al hacer scroll) ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Estilo activo (fondo, blur y padding)
        if (scrollTop > 50) {
            navbar.classList.add('navbar-active');
        } else {
            navbar.classList.remove('navbar-active');
        }

        // Mostrar/Ocultar según la dirección del scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Si bajamos y pasamos los 100px, ocultamos
            navbar.classList.add('navbar-hidden');
        } else {
            // Si subimos, mostramos
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });

    // --- 2. SMOOTH SCROLL (Navegación suave) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. SCROLL REVEAL (Efecto de aparición) ---
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .contact-card').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. LIGHTBOX / MODAL DE IMÁGENES ---
    
    const modal = document.getElementById("lightboxModal");
    const modalImg = document.getElementById("imgAmpliada");
    const closeBtn = document.querySelector(".close-modal");

    // Seleccionar todas las imágenes de la galería
    const images = document.querySelectorAll(".gallery-item");

    // Loop para añadir el evento click a cada imagen
    images.forEach(image => {
        image.addEventListener("click", () => {
            modal.style.display = "flex"; // Usamos flex para centrar
            modalImg.src = image.src; // Copiamos la fuente de la imagen clickeada
            document.body.style.overflow = "hidden"; // Desactivamos el scroll de la web
        });
    });

    // Función para cerrar el modal
    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Reactivamos el scroll
    };

    // Cerrar al clickear la X
    closeBtn.addEventListener("click", closeModal);

    // Cerrar al clickear en cualquier parte del fondo negro
    modal.addEventListener("click", (e) => {
        if (e.target !== modalImg) { // Si NO clickeamos la imagen ampliada
            closeModal();
        }
    });

    // Cerrar presionado la tecla 'Esc'
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });

});