import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";  // <<--- IMPORTANTE

export default function RegisterLogin() {
  const [isRegister, setIsRegister] = useState(false);

  // Estados de LOGIN
  const [loginUsuario, setLoginUsuario] = useState("");
  const [loginContrasena, setLoginContrasena] = useState("");

  // Estados de REGISTRO
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validaciones
  const validarRegistro = () => {
    const newErrors = {};
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (nombreCompleto.trim().length < 3)
      newErrors.nombreCompleto = "El nombre debe tener al menos 3 caracteres.";
    if (!regex.test(email))
      newErrors.email = "Correo inválido.";
    if (usuario.length < 4 || usuario.length > 20)
      newErrors.usuario = "El usuario debe tener entre 4 y 20 caracteres.";
    if (password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Limpiar formularios
  const limpiarFormularios = () => {
    setLoginUsuario("");
    setLoginContrasena("");
    setNombreCompleto("");
    setEmail("");
    setUsuario("");
    setPassword("");
    setErrors({});
  };

  // Registro con apiFetch
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validarRegistro()) return;

    const datos = {
      nombreCompleto,
      email,
      nombreDeUsuario: usuario,
      contrasena: password,
      idRol: 2,
    };

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(datos),
      });

      showToast("✅ Usuario registrado. Revisá tu email para activar la cuenta");
      setIsRegister(false);

    } catch (err) {
      console.error(err);
      showToast("❌ " + err.message, "error");
    }
  };

  // Login con apiFetch vía AuthContext
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginUsuario || !loginContrasena) {
      showToast("❌ Ingresa usuario y contraseña", "error");
      return;
    }

    try {
    const logueado = await login({
      nombreDeUsuario: loginUsuario,
      contrasena: loginContrasena,
    });

    if (logueado) {
      showToast("✅ Login correcto");
    } else {
      showToast("❌ Cuenta no verificada o credenciales incorrectas", "error");
    }
    } catch (err) {
    console.error("Error en login:", err);
    showToast("❌ " + err.message, "error");
  }
  };

  return (
    <div className="all-register">
      <div className={`container ${isRegister ? "right-panel-active" : ""}`} id="container">
        
        {/* --- Registro --- */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Registrarse</h1>
            <input type="text" placeholder="Nombre completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
            {errors.nombreCompleto && <small className="error-text">{errors.nombreCompleto}</small>}

            <input type="email" placeholder="ejemplo@ropo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <small className="error-text">{errors.email}</small>}

            <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            {errors.usuario && <small className="error-text">{errors.usuario}</small>}

            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <small className="error-text">{errors.password}</small>}

            <button type="submit" className="btn-login">Registrarse</button>
          </form>
        </div>

        {/* --- Login --- */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Iniciar Sesión</h1>
            <input type="text" placeholder="Usuario" value={loginUsuario} onChange={(e) => setLoginUsuario(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={loginContrasena} onChange={(e) => setLoginContrasena(e.target.value)} />
            <button type="submit" className="btn-login">Iniciar Sesión</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>¿Ya tienes cuenta?</h1>
              <p>Inicia sesión</p>
              <button className="ghost" onClick={() => { limpiarFormularios(); setIsRegister(false); }}>Iniciar Sesión</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>¡Hola!</h1>
              <p>Ingresa tus datos para registrarte</p>
              <button className="ghost" onClick={() => { limpiarFormularios(); setIsRegister(true); }}>Registrarse</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
