# Despliegue en GitHub Pages

El proyecto está preparado para desplegarse en **GitHub Pages** con GitHub Actions. Solo tienes que seguir estos pasos.

---

## Qué está ya configurado en el repo

- **`vite.config.ts`** — `base: '/p2p-calculator/'` para que la app cargue bien en `https://usuario.github.io/p2p-calculator/`.
- **`.github/workflows/deploy-gh-pages.yml`** — En cada push a `main` o `master` se ejecuta `npm install`, `npm run build` y se despliega la carpeta `dist` a GitHub Pages.

---

## Pasos que debes hacer tú

### 1. Crear el repositorio en GitHub

- Ve a [github.com/new](https://github.com/new).
- **Repository name:** `p2p-calculator` (o el que prefieras; si cambias el nombre, actualiza `base` en `vite.config.ts` con ese nombre).
- Elige **Public**.
- No marques "Add a README" (ya tienes uno en el proyecto).
- Clic en **Create repository**.

### 2. Conectar tu proyecto local y subir el código

En la terminal, desde la carpeta del proyecto:

```bash
# Si aún no tienes git inicializado
git init

# Añadir el remoto (sustituye TU_USUARIO por tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/p2p-calculator.git

# Asegurarte de estar en la rama main (o master)
git branch -M main

# Añadir todo, commit y push
git add .
git commit -m "Initial commit: P2P Trading Calculator"
git push -u origin main
```

Si ya tenías `origin` configurado, solo haz `git push -u origin main` (o `master`, según tu rama).

### 3. Activar GitHub Pages en el repositorio

- En GitHub, abre tu repo **p2p-calculator**.
- Ve a **Settings** → **Pages** (menú izquierdo).
- En **Build and deployment**:
  - **Source:** elige **GitHub Actions** (no "Deploy from a branch").
- No hace falta guardar nada más; el workflow se dispara con el primer push.

### 4. Esperar al despliegue

- Ve a la pestaña **Actions** del repo. Verás el workflow "Deploy to GitHub Pages".
- Cuando termine en verde, el sitio estará disponible en:
  - **https://TU_USUARIO.github.io/p2p-calculator/**  
  (sustituye `TU_USUARIO` por tu usuario de GitHub).

### 5. (Opcional) Añadir la URL en el README

En el README principal puedes poner al inicio algo como:

```markdown
**Demo:** https://TU_USUARIO.github.io/p2p-calculator/
```

---

## Si el nombre del repo es distinto

Si creaste el repo con otro nombre (por ejemplo `mi-calculadora-p2p`):

1. En **vite.config.ts** cambia `base` a `'/mi-calculadora-p2p/'`.
2. La URL del sitio será: `https://TU_USUARIO.github.io/mi-calculadora-p2p/`.

---

## Buenas prácticas del workflow (revisión)

El workflow sigue las recomendaciones de GitHub para Pages con Actions:

| Práctica | Implementación |
|----------|----------------|
| **Permisos mínimos** | `contents: read`, `pages: write`, `id-token: write` solo lo necesario para Pages. |
| **Concurrencia** | `concurrency: group: pages, cancel-in-progress: true` para evitar despliegues simultáneos. |
| **Build y deploy separados** | Job `build` genera el artefacto; job `deploy` solo despliega (con `needs: build`). |
| **Entorno** | `environment: github-pages` y `url` desde `steps.deployment.outputs.page_url`. |
| **Verificación del build** | Step que comprueba que exista `dist/index.html` antes de subir el artefacto. |
| **Base en Vite** | `base: '/p2p-calculator/'` en `vite.config.ts` para que rutas y assets funcionen en el subpath. |

**Opcional (cuando tengas `package-lock.json` en el repo):** en el workflow puedes cambiar a `npm ci` y añadir en setup-node `cache: 'npm'` para instalaciones reproducibles y más rápidas.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Crear repo en GitHub (nombre: `p2p-calculator`). |
| 2 | `git remote add origin ...` y `git push -u origin main`. |
| 3 | Settings → Pages → Source: **GitHub Actions**. |
| 4 | Ir a Actions y esperar a que el workflow termine. |
| 5 | Abrir **https://TU_USUARIO.github.io/p2p-calculator/**. |
