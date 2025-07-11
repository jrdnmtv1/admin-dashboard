"use client";

import TablaProductos from "./components/TablaProductos";
import FormularioProductos from "./components/FormularioProductos";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BuscadorProductos from "./components/BuscadorProductos";
import BotonAgregarProducto from "./components/BotonAgregarProducto";
import PaginacionProductos from "./components/PaginacionProductos";
import { z } from "zod";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://usuario-api-w7k4.onrender.com/api/productos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar producto: ", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!open) {
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setCategoria("");
      setStock("");
      setImagen("");
      setEditingProduct(null);
      setErrores({});
    }
  }, [open]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const productosFiltrados = products.filter((product) =>
    product.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const esquemaProducto = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    precio: z
      .number({ invalid_type_error: "El precio debe ser un número" })
      .min(0.01, "El precio debe ser mayor a 0"),
    descripcion: z.string().optional(),
    categoria: z.string().optional(),
    stock: z
      .number({ invalid_type_error: "El stock debe ser un número" })
      .min(0, "El stock no puede ser negativo")
      .optional(),
    imagen: z.string().url("Debe ser una URL válida").optional(),
  });

  const handleGuardar = async () => {
    try {
      // Validar con zod
      esquemaProducto.parse({
        nombre,
        precio: Number(precio),
        descripcion,
        categoria,
        stock: stock === "" ? undefined : Number(stock),
        imagen,
      });
      setErrores({}); // limpiar errores anteriores

      if (editingProduct) {
        const res = await fetch(
          `https://usuario-api-w7k4.onrender.com/api/productos/${editingProduct._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              precio,
              descripcion,
              categoria,
              stock,
              imagen,
            }),
          }
        );

        const actualizado = await res.json();
        setProducts(
          products.map((u) => (u._id === actualizado._id ? actualizado : u))
        );
      } else {
        const res = await fetch(`https://usuario-api-w7k4.onrender.com/api/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            precio,
            descripcion,
            categoria,
            stock,
            imagen,
          }),
        });

        const creado = await res.json();
        setProducts([creado, ...products]);
      }

      // Limpiar formulario
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setCategoria("");
      setStock("");
      setImagen("");
      setEditingProduct(null);
      setOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // ⚠️ Obtener errores por campo
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrores(fieldErrors);
      } else {
        console.error("Error al guardar producto: ", err);
        setErrores({ general: "No se pudo guardar el producto." });
      }
    }
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`https://usuario-api-w7k4.onrender.com/api/productos/${id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((u) => u._id !== id));
      setProductoAEliminar(null);
    } catch (err) {
      console.log("Error al eliminar producto:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <BuscadorProductos busqueda={busqueda} setBusqueda={setBusqueda} />
        <Dialog open={open} onOpenChange={setOpen}>
          <BotonAgregarProducto />
          <DialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
            <FormularioProductos
              nombre={nombre}
              setNombre={setNombre}
              precio={precio}
              setPrecio={setPrecio}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              categoria={categoria}
              setCategoria={setCategoria}
              stock={stock}
              setStock={setStock}
              imagen={imagen}
              setImagen={setImagen}
              onGuardar={handleGuardar}
              errores={errores}
              editingProduct={editingProduct}
            />
          </DialogContent>
        </Dialog>
      </div>
      <TablaProductos
        productos={productosPaginados}
        loading={loading}
        onEditar={(product) => {
          setEditingProduct(product);
          setNombre(product.nombre);
          setPrecio(String(product.precio));
          setDescripcion(product.descripcion);
          setCategoria(product.categoria);
          setStock(String(product.stock));
          setImagen(product.imagen);
          setOpen(true);
        }}
        onEliminar={handleEliminar}
        productoAEliminar={productoAEliminar}
        setProductoAEliminar={setProductoAEliminar}
      />
      <PaginacionProductos
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        setPaginaActual={setPaginaActual}
      />
    </div>
  );
}
