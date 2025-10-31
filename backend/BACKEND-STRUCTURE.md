# Backend Structure - Clinic Management Dashboard

## 📁 Complete Project Structure

```
backend/
│
├── prisma/
│   └── schema.prisma              # Prisma database schema with all models
│
├── src/
│   ├── app.ts                     # Main Express application entry point
│   ├── supabase.ts                # ⚠️ Supabase client (should move to config/)
│   │
│   ├── config/
│   │   ├── env.ts                 # Environment variables configuration
│   │   └── supabase.ts            # 🎯 RECOMMENDED: Move supabase here
│   │
│   ├── db/
│   │   └── client.ts              # Database client (Prisma/Supabase)
│   │
│   ├── modules/                   # 🆕 Feature-based modular architecture
│   │   ├── auth/
│   │   │   ├── auth.controller.ts # Authentication controller
│   │   │   ├── auth.routes.ts     # Authentication routes
│   │   │   ├── auth.schema.ts     # Zod validation schemas for auth
│   │   │   └── auth.service.ts    # Authentication business logic
│   │   │
│   │   └── patients/
│   │       ├── patient.controller.ts # Patient controller
│   │       ├── patient.routes.ts     # Patient routes
│   │       ├── patient.schema.ts     # Zod validation schemas for patients
│   │       └── patient.service.ts    # Patient business logic
│   │
│   ├── routes/                    # Legacy routes (migrating to modules/)
│   │   ├── auth.routes.ts         # Authentication routes
│   │   ├── patient.routes.ts      # Patient CRUD routes
│   │   ├── doctor.routes.ts       # Doctor CRUD routes
│   │   └── appointment.routes.ts  # Appointment CRUD routes
│   │
│   ├── controllers/               # Legacy controllers (migrating to modules/)
│   │   ├── auth.controller.ts     # Auth logic
│   │   ├── patient.controller.ts  # Patient CRUD logic
│   │   ├── doctor.controller.ts   # Doctor CRUD logic
│   │   └── appointment.controller.ts # Appointment CRUD logic
│   │
│   ├── middlewares/
│   │   ├── auth.ts                # Authentication middleware
│   │   ├── authMiddleware.ts      # JWT verification middleware
│   │   ├── errorHandler.ts        # Error handling middleware
│   │   └── validate.ts            # Request validation middleware (Zod)
│   │
│   ├── types/
│   │   └── global.d.ts            # Global TypeScript type definitions
│   │
│   └── utils/
│       └── errorHandler.ts        # Global error handler utilities
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Example environment variables template
├── .gitignore                     # Git ignore configuration
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # NPM lock file
├── tsconfig.json                  # TypeScript configuration
├── BACKEND-STRUCTURE.md           # This documentation file
└── README.md                      # Project overview and setup guide

```

## 🎯 Supabase File Location - Best Practice

### Current Location
- ⚠️ `src/supabase.ts` (root of src/)

### Recommended Location
- ✅ `src/config/supabase.ts`

### Why Move to `config/`?

1. **Better Organization**: Configuration files belong together
2. **Consistency**: `env.ts` is already in `config/`, Supabase config should be too
3. **Clear Separation**: Distinguishes configuration from business logic
4. **Standard Practice**: Most Node.js projects follow this pattern

### Migration Steps

```bash
# Move the file
mv src/supabase.ts src/config/supabase.ts

# Update all imports from:
# import { supabaseClient } from './supabase'
# to:
# import { supabaseClient } from './config/supabase'
```

## 🗄️ Database Schema (Prisma)

### Models Overview

#### **User** 👤
- **Purpose**: Core authentication and user management
- **Fields**: email, password, firstName, lastName, role, phone, isActive
- **Roles**: `ADMIN`, `DOCTOR`, `RECEPTIONIST`
- **Relations**: 
  - One-to-one with `Doctor`
  - One-to-many with `Appointment`

#### **Doctor** 👨‍⚕️
- **Purpose**: Doctor-specific profile information
- **Fields**: specialization, licenseNumber, yearsOfExp, bio
- **Relations**: 
  - Belongs to `User`
  - Has many `Appointment` and `Schedule`

#### **Patient** 🏥
- **Purpose**: Patient demographic and medical information
- **Fields**: firstName, lastName, email, phone, dateOfBirth, gender, address, bloodType, allergies, emergencyContact
- **Relations**: 
  - Has many `Appointment` and `MedicalRecord`

#### **Appointment** 📅
- **Purpose**: Scheduling and tracking patient visits
- **Fields**: dateTime, duration, status, reason, notes
- **Status**: `SCHEDULED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- **Relations**: 
  - Belongs to `Patient`, `Doctor`, and `User`
  - Has one `MedicalRecord`

#### **Schedule** 🕐
- **Purpose**: Doctor availability management
- **Fields**: dayOfWeek (0-6), startTime (HH:mm), endTime (HH:mm), isActive
- **Relations**: 
  - Belongs to `Doctor`

#### **MedicalRecord** 📋
- **Purpose**: Medical documentation from appointments
- **Fields**: diagnosis, prescription, tests, notes
- **Relations**: 
  - Belongs to `Appointment` and `Patient`

### Enums
```prisma
enum UserRole {
  ADMIN
  DOCTOR
  RECEPTIONIST
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum Gender {
  MALE
  FEMALE
  OTHER
}
```

## 📦 Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.45.0 | Supabase SDK for database and auth |
| `cors` | ^2.8.5 | Enable CORS for API |
| `dotenv` | ^16.4.5 | Environment variables management |
| `express` | ^4.19.2 | Web framework |
| `express-async-errors` | ^3.1.1 | Async error handling middleware |
| `zod` | latest | Runtime schema validation |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/cors` | ^2.8.17 | TypeScript types for CORS |
| `@types/express` | ^4.17.21 | TypeScript types for Express |
| `@types/node` | ^20.14.10 | TypeScript types for Node.js |
| `tsx` | ^4.16.2 | TypeScript execution for development |
| `typescript` | ^5.5.3 | TypeScript compiler |

## 🏗️ Architecture Pattern

### Modular Architecture (Current Best Practice)
The project uses a **feature-based modular architecture** in `src/modules/`:

```
modules/{feature}/
  ├── {feature}.controller.ts  # Handle HTTP requests/responses
  ├── {feature}.routes.ts      # Define API endpoints
  ├── {feature}.schema.ts      # Zod validation schemas
  └── {feature}.service.ts     # Business logic & database operations
```

**Flow**: `Route → Middleware → Controller → Service → Database`

**Example - Patient Creation Flow**:
1. `POST /api/patients` → `patient.routes.ts`
2. Validation → `validate(patientSchema)` middleware
3. Controller → `patient.controller.ts` → `createPatient()`
4. Service → `patient.service.ts` → Business logic + DB call
5. Response → JSON to client

**Benefits**:
- ✅ Related code stays together
- ✅ Easy to find and modify features
- ✅ Better scalability
- ✅ Clear separation of concerns
- ✅ Easier testing

### Legacy Structure (Being Phased Out)
The older layer-based structure (`routes/`, `controllers/`) is being migrated to the modular approach.

## 🔐 Middleware Stack

### Request Flow
```
Request → CORS → Body Parser → Routes → Middleware Chain → Controller → Response
```

### Available Middleware

1. **Authentication** (`auth.ts`, `authMiddleware.ts`)
   - Validates JWT tokens
   - Attaches user to request object
   - Protects private routes

2. **Validation** (`validate.ts`)
   - Uses Zod schemas
   - Validates request body, params, query
   - Returns structured error messages

3. **Error Handler** (`errorHandler.ts`)
   - Catches all errors
   - Formats error responses
   - Logs errors (production mode)

4. **CORS** (Express middleware)
   - Configured via `CORS_ORIGIN` env variable
   - Allows frontend to communicate with API

## 🚀 Available Scripts

```bash
# Development
npm run dev      # Start dev server with hot reload (tsx watch)

# Production
npm run build    # Compile TypeScript → JavaScript
npm start        # Run compiled production server

# Testing (not yet implemented)
npm test         # Run test suite
```

## 🔑 Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Prisma)
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT (if using custom JWT instead of Supabase Auth)
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
```

### Where to Find Supabase Keys
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy `URL`, `anon/public key`, and `service_role key`

## 🎯 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/logout` | User logout | ✅ |
| GET | `/me` | Get current user | ✅ |

### Patients (`/api/patients`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all patients | ✅ |
| GET | `/:id` | Get patient by ID | ✅ |
| POST | `/` | Create new patient | ✅ |
| PUT | `/:id` | Update patient | ✅ |
| DELETE | `/:id` | Delete patient | ✅ |

### Doctors (`/api/doctors`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all doctors | ✅ |
| GET | `/:id` | Get doctor by ID | ✅ |
| POST | `/` | Create new doctor | ✅ (Admin) |
| PUT | `/:id` | Update doctor | ✅ (Admin) |
| DELETE | `/:id` | Delete doctor | ✅ (Admin) |

### Appointments (`/api/appointments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all appointments | ✅ |
| GET | `/:id` | Get appointment by ID | ✅ |
| POST | `/` | Create new appointment | ✅ |
| PUT | `/:id` | Update appointment | ✅ |
| DELETE | `/:id` | Delete appointment | ✅ |

## 🛠️ Development Guidelines

### Adding a New Feature Module

1. **Create Module Directory**
   ```bash
   mkdir -p src/modules/{feature}
   ```

2. **Create Required Files**
   ```bash
   touch src/modules/{feature}/{feature}.controller.ts
   touch src/modules/{feature}/{feature}.routes.ts
   touch src/modules/{feature}/{feature}.schema.ts
   touch src/modules/{feature}/{feature}.service.ts
   ```

3. **Implement Files**
   - **Schema**: Define Zod validation schemas
   - **Service**: Implement business logic and database operations
   - **Controller**: Handle HTTP request/response
   - **Routes**: Define endpoints and apply middleware

4. **Register Routes in `app.ts`**
   ```typescript
   import { router as featureRouter } from './modules/feature/feature.routes';
   app.use('/api/feature', featureRouter);
   ```

### Code Organization Best Practices

#### Controllers
- Keep thin - delegate to services
- Handle HTTP concerns only (req, res)
- Return appropriate status codes
- Don't include business logic

#### Services
- Contain all business logic
- Interact with database
- Return data or throw errors
- No HTTP concerns (no req/res)

#### Schemas (Zod)
- Define input validation
- Export TypeScript types
- Reuse common schemas

#### Routes
- Define endpoints
- Apply middleware (auth, validation)
- Connect to controllers

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## ✅ Current Status

### Completed ✅
- [x] Project structure established
- [x] Database schema defined (Prisma)
- [x] Modular architecture for `auth` and `patients`
- [x] Legacy routes and controllers in place
- [x] Middleware setup (auth, validation, errors)
- [x] TypeScript configuration
- [x] Development environment ready
- [x] Dependencies installed (`dotenv`, `zod`)

### In Progress 🔄
- [ ] Migration to modular architecture (50% complete)
- [ ] API implementation (ongoing)
- [ ] Move `supabase.ts` to `config/` folder

### Pending ⏳
- [ ] Complete all module migrations
- [ ] Unit and integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Logging system (Winston/Pino)
- [ ] Database migrations setup
- [ ] CI/CD pipeline
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Security headers (Helmet.js)

## 📝 Recommended Next Steps

### Immediate Actions (High Priority)
1. ✅ **Move Supabase config**: `mv src/supabase.ts src/config/supabase.ts`
2. 🔧 **Update imports**: Change all `import { supabaseClient } from '../supabase'` references
3. 📝 **Complete patient module**: Finish implementing patient service logic
4. 🏗️ **Create doctor module**: Mirror the patient modular structure
5. 🏗️ **Create appointment module**: Implement full appointment workflow

### Short Term (This Week)
- Set up proper error handling in services
- Add request logging middleware
- Create `.env.example` with all required variables
- Write basic integration tests

### Medium Term (This Month)
- Complete all module migrations
- Add Swagger/OpenAPI documentation
- Implement role-based access control (RBAC)
- Add database migrations
- Set up CI/CD pipeline

---

**Last Updated:** October 31, 2025  
**Version:** 2.0  
**Maintainer:** Development Team
