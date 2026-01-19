# SOOD v2 Project Documentation

## Project Structure

- `client/`: Frontend (React + Vite + TypeScript + Tailwind CSS)
- `server/`: Backend (Node.js + Express + TypeScript + Prisma)

## Local Development

### Prerequisites
- Node.js 18+
- MySQL Database

### 1. Backend Setup

```bash
cd server
cp .env.example .env # (Create .env if not exists and configure DB)
npm install
npx prisma generate
npm run dev
```

**Environment Variables (.env)**
```
DATABASE_URL="mysql://user:pass@localhost:3306/db_name"
JWT_SECRET="secret"
PORT=3000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deployment to cPanel

### 1. Setup Node.js App in cPanel
- Application root: `sood-v2/server`
- Version: Node.js 18+
- Startup file: `dist/index.js` (Note: Build process handles this)

### 2. Configure GitHub Actions
- Go to repository **Settings > Secrets and variables > Actions**
- Add repository secrets:
  - `HOST`: Your cPanel domain or IP
  - `USERNAME`: cPanel username
  - `SSH_KEY`: Private SSH Key (authorized in cPanel)

### 3. Deploy
Push to `main` branch to trigger deployment.

## Key Features Implemented

1. **Subject Categories**: Manage categories (Wajib, Pilihan, etc.)
2. **Subjects**: Manage subjects with category relation.
3. **Students**: Manage students with **NIK (16 digit)** validation.
