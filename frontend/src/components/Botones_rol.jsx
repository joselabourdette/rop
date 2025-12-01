import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api"; 
import "../assets/css/botones-rol.css";

export default function BotonesRol() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const handleRolSeleccionado = async (idRol) => {
    try {
      const idUsuario = localStorage.getItem("userId");
      if (!idUsuario) {
        alert("No se encontró el ID del usuario.");
        return;
      }

      const data = await apiFetch("/auth/asignar-rol", {
        method: "POST",
        body: JSON.stringify({ idUsuario: Number(idUsuario), idRol }),
      });


      if (!data || !data.user) {
        alert(data.message || "Error al asignar el rol");
        return;
      }

      // ✅ Guardamos el usuario actualizado
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.removeItem("userId");
      setUsuario(data.user);
      setToken(data.token);
      // Redirigir al Login
      showToast("Rol asignado correctamente. Vuelva a iniciar sesión.");
      navigate("/login");

    } catch (error) {
      console.error("Error al asignar el rol:", error);
      alert(error.message || "Ocurrió un error al asignar el rol");
    }
  };

  return (
    <div className="contenedor">
      <div className="cuadro-blanco">
        <h4>Elige tu rol</h4>
        <div className="botones">
          <button className="btn comun" onClick={() => handleRolSeleccionado(2)}>
            Cliente
          </button>
          <button className="btn profesional" onClick={() => handleRolSeleccionado(3)}>
            Profesional
          </button>
        </div>
      </div>
    </div>
  );
}
