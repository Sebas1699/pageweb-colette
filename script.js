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

    // --- 5. LÓGICA DEL CARRITO DE COMPRAS ---
    let cart = [];
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const cartFooter = document.getElementById('cartFooter');

    // Abrir/Cerrar Carrito
    document.getElementById('cartTrigger').addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Selección de Talla
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.parentElement;
            parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    // Agregar al Carrito
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const selectedSize = card.querySelector('.size-btn.selected');
            
            if (!selectedSize) {
                alert("Por favor selecciona una talla antes de agregar ✨");
                return;
            }

            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                size: selectedSize.dataset.size,
                img: card.querySelector('img').src,
                quantity: 1
            };

            // Evitar duplicados del mismo ID y Talla
            const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }

            updateCartUI();
            // Feedback visual
            btn.innerText = "¡Agregado!";
            setTimeout(() => btn.innerText = "Agregar al carrito", 1000);
        });
    });

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío 💤</p>';
            cartFooter.style.display = 'none';
        } else {
            cartFooter.style.display = 'block';
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;
                
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Talla: ${item.size} | $${item.price.toLocaleString()}</p>
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                            </div>
                        </div>
                        <i class="fas fa-trash remove-item" onclick="removeItem(${index})"></i>
                    </div>
                `;
            });
        }

        cartTotal.innerText = `$${total.toLocaleString()}`;
        cartCount.innerText = count;
    }

    window.changeQty = (index, delta) => {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        updateCartUI();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    // Acción de Compra - WhatsApp
    document.getElementById('btnCheckout').addEventListener('click', () => {
        let orderDetails = "";
        cart.forEach(item => {
            orderDetails += "- Pijama: " + item.name + "\n- Talla: " + item.size + "\n- Cantidad: " + item.quantity + "\n\n";
        });

        const mensaje = "Hola, Ana.\n\n" +
            "Espero que te encuentres muy bien.\n\n" +
            "Me gustaría realizar una compra con COLLETTE SLEEPWEAR.\n\n" +
            "Detalles del pedido:\n" +
            orderDetails +
            "Quedo atento a tu confirmacion y a las indicaciones para continuar con el proceso de pago.\n\n" +
            "Muchas gracias.\n" +
            "Sera un gusto adquirir una de sus hermosas prendas.";

        const encodedMessage = encodeURIComponent(mensaje);
        window.open(`https://wa.me/573227375001?text=${encodedMessage}`, '_blank');
    });

});