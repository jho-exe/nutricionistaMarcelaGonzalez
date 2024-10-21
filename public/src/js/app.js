// Animación de fade-in al hacer scroll
const faders = document.querySelectorAll('.fade-in');

// Opciones para el Intersection Observer
const appearOptions = {
  threshold: 0.1, // Aumentamos el umbral para que comience antes la animación
  rootMargin: "0px 0px -100px 0px" // Ajuste fino para empezar a animar antes de que la sección sea completamente visible
};

// Intersection Observer optimizado
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      entry.target.style.willChange = 'opacity, transform'; // Indicamos al navegador qué va a cambiar
      observer.unobserve(entry.target); // Dejar de observar el elemento una vez que aparece
      // Eliminar 'willChange' después de que termine la animación para evitar sobrecargar el renderizado
      setTimeout(() => {
        entry.target.style.willChange = '';
      }, 500); // Ajusta el tiempo según la duración de tu animación
    }
  });
}, appearOptions);

// Observamos cada uno de los elementos que necesitan animación
faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Funcionalidad de acordeón para la sección de Preguntas Frecuentes (FAQ)
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
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
  if (window.scrollY > 200) { // Mostrar el botón después de 200px de scroll
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

// Función para cambiar el estilo de la barra de navegación en el scroll
function handleNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return; // Evitar errores si no se encuentra el elemento

  if (window.scrollY > 50) {
    if (navbar.style.backgroundColor !== "rgba(255, 255, 255, 1)") {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 1)"; // Fondo completamente blanco
      navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"; // Sombra más intensa
    }
  } else {
    if (navbar.style.backgroundColor !== "rgba(255, 255, 255, 0.9)") {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Fondo semitransparente
      navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Sombra más suave
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('consejos-slider');
  let scrollAmount = 0;
  const scrollStep = 2; // Ajusta la velocidad del desplazamiento
  const delay = 40; // Tiempo entre cada paso del desplazamiento en milisegundos

  function autoScroll() {
    scrollAmount += scrollStep;

    // Si llegamos al final del carrusel, reiniciamos el scroll
    if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
      scrollAmount = 0;
    }

    slider.scrollTo({
      left: scrollAmount,
      behavior: 'smooth' // Desplazamiento suave
    });

    // Repetir el scroll automáticamente después del tiempo especificado
    setTimeout(autoScroll, delay);
  }

  // Iniciar el desplazamiento automático
  autoScroll();
});


// Aplicar debounce al evento de scroll para la barra de navegación
window.addEventListener('scroll', debounce(handleNavbarScroll));
