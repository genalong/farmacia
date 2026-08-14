const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

// Permitir conexiones desde Netlify
app.use(cors());

// Permitir recibir datos en formato JSON
app.use(express.json());

// Permitir archivos estáticos
app.use(express.static("."));


// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

  res.send(
    "Backend de Farmacia Cormar funcionando 🚀"
  );

});


// ==========================================
// PRODUCTOS
// ==========================================

app.get("/api/productos", (req, res) => {

  const productos = [

    {
      id: 1,
      nombre: "Paracetamol 500 mg",
      precio: 150,
      categoria: "medicamentos",
      stock: 12
    },

    {
      id: 2,
      nombre: "Ibuprofeno 400 mg",
      precio: 180,
      categoria: "medicamentos",
      stock: 8
    },

    {
      id: 3,
      nombre: "Shampoo",
      precio: 320,
      categoria: "perfumeria",
      stock: 15
    },

    {
      id: 4,
      nombre: "Crema hidratante",
      precio: 290,
      categoria: "cuidado",
      stock: 6
    }

  ];

  res.json(productos);

});


// ==========================================
// RECIBIR PEDIDOS
// ==========================================

app.post("/api/pedidos", (req, res) => {

  console.log("");
  console.log("================================");
  console.log("📦 NUEVO PEDIDO");
  console.log("================================");

  console.log(req.body);

  console.log("================================");
  console.log("");

  res.status(201).json({

    ok: true,

    mensaje: "Pedido recibido correctamente",

    pedido: req.body

  });

});


// ==========================================
// SERVIDOR
// ==========================================

app.listen(PORT, () => {

  console.log("");
  console.log(
    `Servidor funcionando en http://localhost:${PORT}`
  );
  console.log("");

});