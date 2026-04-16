# IndieBackseat Backend Szolgáltatás (BookInk API)

Ez a dokumentáció az **IndieBackseat** platform szerveroldali (Backend) architektúrájának és API szolgáltatásainak teljes körű technikai leírását tartalmazza. Az API biztosítja a kliens alkalmazások adatigényeinek kiszolgálását, a hitelesítést, valamint a Steam alapú integrációs feladatokat.

---

## 1. Architektúra és Technológiai Stack

A szolgáltatás többrétegű, moduláris mikro-architektúrára épül, biztosítva az üzleti logika szétválasztását és a hosszú távú skálázhatóságot.

- **Központi Keretrendszer**: [NestJS](https://nestjs.com/) v11 (Node.js TypeScript alapokon)
- **Adatbázis Kezelő (ORM)**: [Prisma](https://www.prisma.io/) v6
- **Hitelesítési protokollok**: Passport.js, JWT (JSON Web Token), Express-Session
- **Külső API Integrációk**: Steam Web API (OIDC alapon a `passport-steam` csomaggal)
- **Fájlrendszer (Storage)**: Multer middleware közvetlen lemezes tároláshoz
- **API Dokumentáció**: Integrált OpenAPI 3.0 (Swagger) modul
- **Formátum / Validáció**: `class-validator` és `class-transformer` globális pipe-ok

---

## 2. Rendszerkövetelmények és Üzembe Helyezés

### 2.1. Függőségek telepítése
A Node.js környezet megléte kötelező. Javasolt verzió: Node.js 18.x LTS vagy újabb.

```bash
cd indiebackseat_backend
npm install
```

### 2.2. Környezeti Változók Konfigurációja
Az alkalmazás biztonsági házirendje megköveteli a `.env` fájl meglétét a gyökérkönyvtárban. Használja az alábbi konfigurációs mintát:

```env
# Adatbázis kapcsolat (MySQL/PostgreSQL specifikus URL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Hitelesítési (Auth) Kulcsok
JWT_SECRET="biztonsagos_jwt_titkositasi_kulcs_generate_uuid"
SESSION_SECRET="biztonsagos_session_titkositasi_kulcs"

# Külső Szolgáltatások (Integrációk)
STEAM_API_KEY="egyedi_steam_api_kulcs_a_steamworks_portalrol"
AI_API_KEY="egyedi_gemini_api_kulcs_a_google_ai_studiobol"

# Hálózati Beállítások
PORT=3000
```
*(A `.env` fájl szigorúan fel van véve a `.gitignore` listára, így elkerülhető a kulcsok publikus szivárgása. Éles környezetben Használjon Docker Secrets vagy Vault szolgáltatásokat.)*

### 2.3. Adatbázis Modell Kialakítása és Szinkronizáció
Az adatbázis sémát a `prisma/schema.prisma` fájl definiálja. Rendszer telepítésekor futtassa az alábbit:

```bash
npx prisma db push
```

**Adatfeltöltés (Seeding)**
A rendszerspecifikus alap adatok (példa projektek, kategóriák, fiókok) beillesztéséhez inicializálja a seedert:

```bash
npx prisma db seed
```
> **Alapértelmezett, seed által létrehozott fiókok:**
> - Rendszergazda (Admin): Username: `admin`, Password: `admin`
> - Minta Fejlesztő (Dev): Username: `developer`, Password: `developer` és Username: `mate` Password: `mate`

### 2.4. A Szolgáltatás Futtatása
A fejlesztői mód (automatikus kódfordítással, HMR és TypeScript ellenőrzéssel):

```bash
npm run start:dev
```
A szoftver a `http://localhost:3000` címen lesz elérhető.

---

## 3. Rendszer Működése és Adatstruktúra

### 3.1. Fő Modulok Szeparációja
- `src/auth/` : Tartalmazza a JWT stratégia és a Guard-ok implementációját. Felel a `/api/auth/register` és `/login`, valamint a Steam kapcsolatok kialakításáért (`/api/auth/steam`).
- `src/games/` : Játékok kikeresése, lapozása, és a külső megjelenítéshez szükséges adatok generálása.
- `src/ratings/` : Matematikai aggregációk kezelése a felhasználói értékelések (1-5 skála) feldolgozására. Megakadályozza a jogosulatlan dupla pontozást.
- `src/comments/` : Interaktív beszélgető szálak. Ide kapcsolódóan van implementálva a "Comment Vote" (Upvote/Downvote) rendszer.
- `src/devlogs/` : Fejlesztői útinaplók publikálására szolgáló modul. Képfeltöltést (Multer), százalékos `progress` követést és jogosultságkezelést foglal magába.

### 3.2. Adatbázis Kapcsolatok (Prisma)
- **User**: Központi entitás. Rendelkezik egy szerepkör (`role`) flaggel (USER, DEVELOPER, ADMIN).
- **Game**: Tárolja a globális adatbázist. Relációban áll a `Rating` és `Comment` táblákkal.
- **DevProject**: Kizárólag a DEVELOPER userek által birtokolt projektek gyűjteménye. Rendelkezik One-to-Many (`DevLogEntry`) és Many-to-Many (Wishlist / Favorites) kapcsolatokkal.

---

## 4. API Dokumentáció és Integráció

A rendszer integrált **Swagger (OpenAPI 3.0)** modullal bír. Amint a kliens szerver felállt, vizuálisan tesztelhető az összes végpont (End-Point) a struktúra megértése céljából:

- Keresd fel: **[http://localhost:3000/api](http://localhost:3000/api)**

### Biztonság és Interceptorok
Minden API mutációs végpont (`POST`, `PUT`, `DELETE` és szenzitív `GET` adatok) szigorított. Hívásuk a HTTP `Authorization` fejlécbe ágyazott `Bearer Token`-t követel meg. A NestJS globális validációs szűrői (Pipes) DTO (Data Transfer Object) validálás révén azonnal kizárják a hiányzó paramétereket (`400 Bad Request`).

---

## 5. Tesztelés beállítása

Az automatizált egység- és integrációs tesztekhez a `Jest` keretrendszer van definiálva az alábbi scriptekkel:

```bash
# Egységtesztek futtatása a szolgáltatások validálására
npm run test

# End-to-End tesztek folyamata (vezérlő layer tesztelés)
npm run test:e2e
```

## 6. Telepítés Produckciós Környezetre (Deployment)

Az optimalizált élesítés menete a következőképpen néz ki (PM2, Docker, vagy PaaS felhőszolgáltatás esetén):

```bash
npm run build
npm run start:prod
```
Ezután az elkészült `dist/` mappa tartalma biztonságosan hosztolható. Ne feledkezzen meg az éles `.env` fájl biztosításáról az adott szerveren. Média feltöltéseket dedikált S3 Storage-ra vagy persistens `/public/uploads` könyvtárba érdemes irányítani Docker volumennel.
