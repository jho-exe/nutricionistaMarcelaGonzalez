document.addEventListener('DOMContentLoaded', function() {
  // Obtener todos los enlaces que apuntan a secciones, no solo los del navbar
  const links = document.querySelectorAll('a[href^="#"]');
  const navbarHeight = document.getElementById('navbar').offsetHeight; // Altura del navbar

  // Asignar comportamiento de desplazamiento suave a todos los enlaces
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Desplazamiento manual ajustado según la altura del navbar
        const offsetTop = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animación de fade-in al hacer scroll
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1, 
    rootMargin: "0px 0px -100px 0px" 
  };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.style.willChange = 'opacity, transform';
        observer.unobserve(entry.target);
        setTimeout(() => {
          entry.target.style.willChange = ''; 
        }, 500);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Funcionalidad de acordeón para la sección de Preguntas Frecuentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function(event) {
      event.preventDefault(); // Evitar cualquier comportamiento por defecto

      const isOpen = answer.classList.contains('show');

      // Cerrar solo las respuestas que están abiertas
      if (!isOpen) {
        document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
          openAnswer.style.maxHeight = null;
          openAnswer.classList.remove('show');
        });
      }

      // Alternar la visibilidad de la respuesta actual
      answer.classList.toggle('show');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  // Mostrar el botón de scroll cuando el usuario se desplaza hacia abajo
  const scrollTopButton = document.getElementById("scrollTopButton");

  window.addEventListener("scroll", debounce(() => {
    if (window.scrollY > 200) {
      scrollTopButton.classList.add("show");
    } else {
      scrollTopButton.classList.remove("show");
    }
  }, 10));

  // Desplazamiento suave cuando se hace clic en el botón
  scrollTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Función para cambiar el estilo de la barra de navegación en el scroll
  window.addEventListener('scroll', debounce(handleNavbarScroll));

  function handleNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return; // Evitar errores si no se encuentra el elemento

    if (window.scrollY > 50) {
      if (navbar.style.backgroundColor !== "rgba(255, 255, 255, 1)") {
        navbar.style.backgroundColor = "rgba(255, 255, 255, 1)";
        navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }
    } else {
      if (navbar.style.backgroundColor !== "rgba(255, 255, 255, 0.9)") {
        navbar.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }
    }
  }

  // Función para desplazar automáticamente el slider de consejos
  const slider = document.getElementById('consejos-slider');
  if (slider) {
    let scrollAmount = 0;
    const scrollStep = 2;
    const delay = 40;
    let autoScrollInterval;

    function autoScroll() {
      scrollAmount += scrollStep;

      if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        scrollAmount = 0;
      }

      slider.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }

    // Iniciar el desplazamiento automático
    function startAutoScroll() {
      autoScrollInterval = setInterval(autoScroll, delay);
    }

    // Detener el desplazamiento automático
    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    // Comienza el auto-scroll cuando carga la página
    startAutoScroll();

    // Detener el scroll cuando el mouse esté sobre el slider
    slider.addEventListener('mouseenter', stopAutoScroll);

    // Reanudar el scroll cuando el mouse salga del slider
    slider.addEventListener('mouseleave', startAutoScroll);
  }

  // Asegurarse de que el DOM está completamente cargado para manejar el menú móvil
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navbar = document.getElementById('navbar');

  // Alternar la visibilidad del menú móvil cuando se hace clic en el botón de hamburguesa
  navToggle.addEventListener('click', function (e) {
    e.stopPropagation(); // Evitar que el clic en el botón cierre el menú inmediatamente
    navMobile.classList.toggle('hidden');  // Alterna la clase 'hidden'
  });

  // Cerrar el menú si se hace clic fuera de él o del botón hamburguesa
  document.addEventListener('click', function (e) {
    const clickedOutside = !navbar.contains(e.target); // Verifica si el clic ocurrió fuera del navbar
    const menuVisible = !navMobile.classList.contains('hidden'); // Verifica si el menú está visible

    if (clickedOutside && menuVisible) {
      navMobile.classList.add('hidden');  // Oculta el menú
    }
  });

});

// Debounce para limitar la frecuencia del evento de scroll
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
