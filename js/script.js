/* =========================================================
   Farmacia Cormar — Juan Lacaze
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  inyectarEstilosJS();
  activarScrollSuave();
  activarScrollSpy();
  activarSombraHeader();
  mostrarEstadoAbierto();
  activarAnimacionAlEntrar();
});

/* ---------------------------------------------------------
    Estilos que necesitan las funciones de este archivo.
   Se inyectan por JS para no tener que tocar style.css.
   --------------------------------------------------------- */
function inyectarEstilosJS() {
  const estilos = `
    nav a.activo {
      color: var(--verde);
    }
    nav a.activo::after {
      width: 100%;
    }
    header.con-sombra {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    }
    .estado-badge {
      display: inline-block;
      font-family: var(--sans);
      font-size: 0.85rem;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 22px;
    }
    .estado-badge.abierto {
      background-color: rgba(74, 124, 89, 0.15);
      color: var(--verde);
    }
    .estado-badge.cerrado {
      background-color: rgba(201, 138, 44, 0.15);
      color: var(--ambar);
    }
    .estado-badge .punto {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
    .estado-badge.abierto .punto {
      background-color: var(--verde-suave);
    }
    .estado-badge.cerrado .punto {
      background-color: var(--ambar);
    }
    .revelar {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .revelar.visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .revelar {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;
  const hoja = document.createElement("style");
  hoja.textContent = estilos;
  document.head.appendChild(hoja);
}

/* ---------------------------------------------------------
    Scroll suave con offset para el header sticky
   --------------------------------------------------------- */
function activarScrollSuave() {
  const header = document.querySelector("header");
  const enlaces = document.querySelectorAll('nav a[href^="#"]');

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destino = document.querySelector(enlace.getAttribute("href"));
      if (!destino) return;

      evento.preventDefault();
      const alturaHeader = header ? header.offsetHeight : 0;
      const posicion =
        destino.getBoundingClientRect().top +
        window.scrollY -
        alturaHeader -
        12;

      window.scrollTo({ top: posicion, behavior: "smooth" });
    });
  });
}

/* ---------------------------------------------------------
   Scrollspy: marca el link activo según la sección visible
   --------------------------------------------------------- */
function activarScrollSpy() {
  const secciones = document.querySelectorAll("section[id]");
  const enlaces = document.querySelectorAll('nav a[href^="#"]');
  if (!secciones.length || !enlaces.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute("id");
          enlaces.forEach((enlace) => {
            enlace.classList.toggle(
              "activo",
              enlace.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

/* ---------------------------------------------------------
    Sombra en el header al hacer scroll
   --------------------------------------------------------- */
function activarSombraHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const actualizar = () => {
    header.classList.toggle("con-sombra", window.scrollY > 10);
  };

  actualizar();
  window.addEventListener("scroll", actualizar, { passive: true });
}

/* ---------------------------------------------------------
    Badge "Abierto ahora" / "Cerrado" según horario real
   Editá el objeto HORARIOS si cambian los horarios del local.
   --------------------------------------------------------- */
const HORARIOS = {
  // 0 = domingo, 1 = lunes, ... 6 = sábado
  1: { abre: "08:00", cierra: "20:00" },
  2: { abre: "08:00", cierra: "20:00" },
  3: { abre: "08:00", cierra: "20:00" },
  4: { abre: "08:00", cierra: "20:00" },
  5: { abre: "08:00", cierra: "20:00" },
  6: { abre: "08:00", cierra: "20:00" },
  // domingo (0) no está listado: se muestra "Cerrado — consultar disponibilidad"
};

function mostrarEstadoAbierto() {
  const seccionHorarios = document.querySelector("#horarios h2");
  if (!seccionHorarios) return;

  const ahora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Montevideo" }),
  );
  const dia = ahora.getDay();
  const horarioHoy = HORARIOS[dia];

  let abierto = false;
  if (horarioHoy) {
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const [hApre, mApre] = horarioHoy.abre.split(":").map(Number);
    const [hCierra, mCierra] = horarioHoy.cierra.split(":").map(Number);
    const minutosApre = hApre * 60 + mApre;
    const minutosCierra = hCierra * 60 + mCierra;
    abierto = minutosAhora >= minutosApre && minutosAhora < minutosCierra;
  }

  const badge = document.createElement("p");
  badge.className = `estado-badge ${abierto ? "abierto" : "cerrado"}`;
  badge.innerHTML = `<span class="punto"></span>${
    abierto
      ? "Abierto ahora"
      : dia === 0
        ? "Cerrado hoy — consultar disponibilidad"
        : "Cerrado ahora"
  }`;

  seccionHorarios.insertAdjacentElement("afterend", badge);
}

/* ---------------------------------------------------------
    Animación de aparición al hacer scroll (fade-in + subida)
   --------------------------------------------------------- */
function activarAnimacionAlEntrar() {
  const elementos = document.querySelectorAll(
    "#servicios article, #horarios, #ubicacion, #contacto",
  );
  if (!elementos.length) return;

  elementos.forEach((el) => el.classList.add("revelar"));

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((el) => observador.observe(el));
}
