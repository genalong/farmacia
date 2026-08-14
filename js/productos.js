let productos = [];

// ==========================================
// CONTENEDOR
// ==========================================

const contenedor = document.querySelector("#productos");

// ==========================================
// CARGAR PRODUCTOS DESDE EL BACKEND
// ==========================================

async function cargarProductos() {
  try {
const respuesta = await fetch(
  "https://farmacia-x6zk.onrender.com/api/productos"
);
    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    productos = await respuesta.json();

    // Por ahora agregamos las imágenes
    // desde el frontend
    productos[0].imagen = "img/paracetamol.png";
    productos[1].imagen = "img/ibuprofeno.png";
    productos[2].imagen = "img/shampoo.png";
    productos[3].imagen = "img/cremahidratante.png";

    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(lista) {
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <p class="sin-resultados">
        No encontramos productos.
      </p>
    `;

    return;
  }

  lista.forEach((producto) => {
    const tarjeta = document.createElement("article");

    tarjeta.classList.add("producto-card");

    tarjeta.innerHTML = `

      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
      >

      <div class="producto-info">

        <span class="producto-categoria">
          ${producto.categoria}
        </span>

        <h2>
          ${producto.nombre}
        </h2>

        <p class="producto-precio">
          $ ${producto.precio}
        </p>

        <p class="producto-stock">
          Stock disponible: ${producto.stock}
        </p>

        <button onclick="agregarAlCarrito(${producto.id})">
          Agregar al carrito
        </button>

      </div>

    `;

    contenedor.appendChild(tarjeta);
  });
}

// ==========================================
// BUSCADOR Y FILTRO
// ==========================================

const buscador = document.querySelector("#buscador");

const filtroCategoria = document.querySelector("#filtroCategoria");

function filtrarProductos() {
  const texto = buscador.value.toLowerCase().trim();

  const categoria = filtroCategoria.value;

  const productosFiltrados = productos.filter((producto) => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto);

    const coincideCategoria =
      categoria === "todos" || producto.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });

  mostrarProductos(productosFiltrados);
}

buscador.addEventListener("input", filtrarProductos);

filtroCategoria.addEventListener("change", filtrarProductos);

// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function agregarAlCarrito(id) {
  const producto = productos.find((producto) => producto.id === id);

  if (!producto) {
    return;
  }

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productoExistente = carrito.find(
    (productoCarrito) => productoCarrito.id === id,
  );

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({
      ...producto,

      cantidad: 1,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  alert(`${producto.nombre} fue agregado al carrito`);
}

// ==========================================
// INICIAR
// ==========================================

cargarProductos();
