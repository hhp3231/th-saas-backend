
# TH SaaS Backend (Login + Clima)

Backend mínimo, profesional y gratuito para una plataforma de Talento Humano:
- Node.js + Express
- PostgreSQL (Railway) + Sequelize (SSL)
- Autenticación con JWT
- Contraseñas cifradas con bcrypt
- Multiempresa por `empresa_id`

## 🚀 Despliegue rápido (100% online)

1. **Crear repo en GitHub** → nombre sugerido: `th-saas-backend`.
2. Abrir el editor web de GitHub (presiona `.`) o usa **Add files → Upload files**.
3. Sube el contenido de esta carpeta.
4. En **Railway**:
   - Crea un proyecto.
   - **New → Deploy from GitHub Repo** → selecciona tu repo.
   - **New → Database → PostgreSQL**.
   - Copia la **Postgres Connection URL** (DB → Connect).
5. En el servicio `th-saas-backend` de Railway → **Variables**:
   - `DATABASE_URL` = *la URL copiada de Postgres*.
   - `JWT_SECRET` = una clave fuerte (ej. `Cafam-TH-2026_$Strong!`).
   - (Opcional) `PORT` = `3000`.
6. Railway hará **Redeploy** automático.
7. Abre la URL del servicio (ej. `https://TU_APP.up.railway.app`) y verifica que `/` responde:
   `Servidor RRHH online ✅`.

## 🧪 Pruebas (sin instalar nada)
Usa **Hoppscotch**: https://hoppscotch.io

### Precarga de usuarios (seed)
POST `https://TU_APP.up.railway.app/api/auth/seed`
Body (JSON):
```
[
  { "empresa_id": 1, "nombre": "Ana Perez", "email": "ana@empresa.com", "cedula": "10203040", "rol": "empleado" },
  { "empresa_id": 1, "nombre": "Juan Lopez", "email": "juan@empresa.com", "cedula": "29384756", "rol": "analista" }
]
```

### Login
POST `https://TU_APP.up.railway.app/api/auth/login`
Body (JSON):
```
{ "email": "ana@empresa.com", "password": "10203040", "empresa_id": 1 }
```
Obtendrás `token` (JWT), `rol`, `empresa_id`.

## 🔒 Seguridad
- Contraseña inicial = cédula → **siempre cifrada** (bcrypt).
- Recomendado: forzar **cambio de contraseña** en primer login (próxima iteración).
- Conexión a DB con **SSL** (`rejectUnauthorized: false` para evitar problemas de certificado gestionado).
- Claves (`DATABASE_URL`, `JWT_SECRET`) solo en **Variables de Railway**.

## 📂 Estructura
```
src/
  config/db.js
  models/User.js
  routes/auth.routes.js
app.js
package.json
README.md
```

## 📈 Próximo módulo: Clima organizacional
- Tablas: `empresas`, `dimensiones`, `factores`, `preguntas`, `respuestas`, `umbrales`.
- Cálculo de promedios y semáforos por empresa.
- Dashboard en Vercel (React + Chart.js).
