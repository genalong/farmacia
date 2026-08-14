// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const carritoProductos = document.querySelector("#carritoProductos");

const carritoResumen = document.querySelector("#carritoResumen");

// ==========================================
// CARGAR CARRITO DESDE LOCAL STORAGE
// ==========================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {
  carritoProductos.innerHTML = "";

  carritoResumen.innerHTML = "";

  // Si está vacío

  if (carrito.length === 0) {
    carritoProductos.innerHTML = `

      <div class="carrito-vacio">

        <h2>
          Tu carrito está vacío
        </h2>

        <p>
          Todavía no agregaste ningún producto.
        </p>

        <a
          href="productos.html"
          class="boton"
        >
          Ver productos
        </a>

      </div>

    `;

    return;
  }

  // Mostrar productos

  carrito.forEach((producto) => {
    const item = document.createElement("article");

    item.classList.add("carrito-item");

    item.innerHTML = `

      <div class="carrito-item-info">

        <h2>
          ${producto.nombre}
        </h2>

        <p>
          Precio unitario:
          $ ${producto.precio}
        </p>

      </div>


      <div class="carrito-cantidad">

        <button
          onclick="cambiarCantidad(
            ${producto.id},
            -1
          )"
        >
          -
        </button>


        <span>
          ${producto.cantidad}
        </span>


        <button
          onclick="cambiarCantidad(
            ${producto.id},
            1
          )"
        >
          +
        </button>

      </div>


      <div class="carrito-subtotal">

        <strong>
          $ ${producto.precio * producto.cantidad}
        </strong>


        <button
          class="eliminar"
          onclick="eliminarProducto(
            ${producto.id}
          )"
        >
          Eliminar
        </button>

      </div>

    `;

    carritoProductos.appendChild(item);
  });

  mostrarResumen();
}

// ==========================================
// MOSTRAR RESUMEN
// ==========================================

function mostrarResumen() {
  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.precio * producto.cantidad;
  }, 0);

  const cantidadProductos = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.cantidad;
  }, 0);

  carritoResumen.innerHTML = `

    <h2>
      Resumen del pedido
    </h2>

    <p>
      Productos:
      ${cantidadProductos}
    </p>

    <p class="total">
      Total:
      $ ${total}
    </p>

  `;
}

// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function cambiarCantidad(id, cambio) {
  const producto = carrito.find((producto) => producto.id === id);

  if (!producto) {
    return;
  }

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    eliminarProducto(id);

    return;
  }

  guardarCarrito();

  mostrarCarrito();
}

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarProducto(id) {
  carrito = carrito.filter((producto) => producto.id !== id);

  guardarCarrito();

  mostrarCarrito();
}

// ==========================================
// FORMULARIO DEL PEDIDO
// ==========================================

const formularioPedido = document.querySelector("#pedidoForm");

if (formularioPedido) {
  formularioPedido.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    if (carrito.length === 0) {
      alert("No podés realizar un pedido con el carrito vacío.");

      return;
    }

    const datosFormulario = new FormData(formularioPedido);

    const pedido = {
      cliente: {
        nombre: datosFormulario.get("nombre"),

        telefono: datosFormulario.get("telefono"),

        direccion: datosFormulario.get("direccion"),
      },

      entrega: datosFormulario.get("entrega"),

      observaciones: datosFormulario.get("observaciones"),

      productos: carrito,

      fecha: new Date().toISOString(),
    };

    try {
      const respuesta = await fetch("/api/pedidos", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(pedido),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo enviar el pedido");
      }

      const resultado = await respuesta.json();

      console.log("Respuesta del servidor:", resultado);

      alert(`Pedido recibido, ${pedido.cliente.nombre}.`);

      // Vaciar carrito

      carrito = [];

      guardarCarrito();

      mostrarCarrito();

      formularioPedido.reset();
    } catch (error) {
      console.error("Error al enviar pedido:", error);

      alert("Hubo un problema al enviar el pedido.");
    }
  });
}

// ==========================================
// INICIAR
// ==========================================

mostrarCarrito();
