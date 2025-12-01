import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, API_URL } from "../services/api";
import "../assets/css/UserMenu.css";

export default function UserMenu({ open, setOpen }) {
  const ref = useRef(null);
  const {  usuario, logout, token } = useAuth();
  const [fotoPerfil, setFotoPerfil] = useState(null);

   useEffect(() => {
  if (!usuario?.idUsuario) {
    setFotoPerfil("/imagenes/icono-user.png"); // Si no está logueado
    return;
  }

  const fetchImagen = async () => {
    try {
      const dataUsuario = await apiFetch(`/usuario/${usuario.idUsuario}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const imgs = dataUsuario.imagenes || [];
      if (imgs.length > 0) {
        setFotoPerfil(`${API_URL}${imgs[0]}`);
      } else {
        setFotoPerfil("/imagenes/icono-user.png"); // Si no hay imagen
      }
    } catch (err) {
      console.error("Error cargando imagen de perfil:", err);
      setFotoPerfil("/imagenes/icono-user.png"); // Si falla fetch
    }
  };

  fetchImagen();
}, [usuario]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

 
  return (
    <div className="um-container" ref={ref}>
      {fotoPerfil && (
        <img
          src={fotoPerfil}
          alt="usuario"
          className="um-icon"
          onClick={() => setOpen(!open)}
        />
      )}
      {open && (
        <ul className="um-menu">
          <li>
            <a href="/usuario">Perfil</a>
          </li>
          <li>
            <a href="/mensajes">Mensajes</a>
          </li>
          <li>
            <a href="/favoritos">Favoritos</a>
          </li>
          <li>
            <a href="/configuracion-de-usuario">Configuración</a>
          </li>

          {/*CERRAR SESIÓN*/}
          <li onClick={logout} style={{ cursor: "pointer" }}>
            Salir
          </li>
        </ul>
      )}
    </div>
  );
}
