# HR–IMS: Human Resource Information Management System

A modern, full-stack HR management platform built with Laravel 12 (API) and Next.js 15 (frontend). Provides comprehensive employee lifecycle management including data management, organizational structure, attendance tracking, leave management, salary administration, and document storage with enterprise-grade security and audit capabilities.

## 🏗️ Architecture Overview

### Tech Stack

**Backend (API)**

- **Framework**: Laravel 12 with PHP 8.2+
- **Database**: SQLite (default), supports MySQL/PostgreSQL
- **ORM**: Eloquent with advanced querying via Spatie Query Builder
- **Testing**: PHPUnit, Laravel Pint (code style)
- **Development**: Laravel Sail (Docker), Pail (log monitoring)

**Frontend (Web Application)**

- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components, Radix UI primitives
- **State Management**: TanStack Query for server state, React Hook Form for forms
- **Validation**: Zod schema validation
- **Icons**: Lucide React, Tabler Icons

**Development Tools**

- **Package Managers**: Composer (PHP), npm/pnpm (Node.js)
- **Build Tools**: Vite (Laravel assets), Next.js built-in bundler
- **Code Quality**: ESLint, Prettier, PHP CS Fixer

## 📁 Project Structure

```
HR--IMS/
├── backend-laravel/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # REST API Controllers
│   │   │   ├── Requests/            # Form Request Validation
│   │   │   └── Resources/           # API Response Transformers
│   │   ├── Models/                  # Eloquent Models
│   │   ├── Policies/                # Authorization Policies
│   │   └── Traits/                  # Shared Traits
│   ├── database/
│   │   ├── migrations/              # Database Schema
│   │   ├── factories/               # Model Factories
│   │   └── seeders/                 # Database Seeders
│   ├── routes/
│   │   └── api.php                  # API Route Definitions
│   └── storage/                     # File Storage
├── frontend-nextjs/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router Pages
│   │   ├── components/              # Reusable Components
│   │   ├── hooks/                   # Custom React Hooks
│   │   └── lib/                     # Utility Libraries
│   └── public/                      # Static Assets
└── README.md                        # This File
```

## 🗄️ Domain Entities

### Core Business Objects

| Entity                | Description                         | Key Relationships                 |
| --------------------- | ----------------------------------- | --------------------------------- |
| **User**              | Authentication and base user data   | Department, Audit trail           |
| **Department**        | Organizational units with hierarchy | Parent/Child departments, Manager |
| **Designation**       | Job titles and roles                | Department                        |
| **Employee**          | Personnel records                   | User, Department, Designation     |
| **EmployeeDocument**  | File attachments with metadata      | Employee                          |
| **AttendanceRecord**  | Time tracking and attendance        | Employee                          |
| **Leave**             | Time-off requests                   | Employee, LeaveType               |
| **LeaveType**         | Categories of leave                 | -                                 |
| **Salary**            | Compensation data                   | Employee, Currency                |
| **Currency**          | Monetary units                      | -                                 |
| **AuditLog**          | System activity tracking            | User, Various entities            |
| **DepartmentManager** | Management assignments              | Department, Employee              |

### Database Schema Highlights

- **Soft Deletes**: Implemented on User, Employee, Department models
- **JSON Fields**: Metadata storage in EmployeeDocument, Salary components
- **Foreign Keys**: Proper constraints with cascade delete where appropriate
- **Timestamps**: Created/updated tracking across all entities
- **Audit Trail**: Comprehensive logging of system changes

## 🚀 Quick Start

### Prerequisites

- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or 20.x
- **Database**: SQLite (included) or MySQL/PostgreSQL
- **Git**: For version control

### Backend Setup

```bash
# Navigate to backend directory
cd backend-laravel

# Install PHP dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup (SQLite)
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --graceful

# Create storage symlink for file uploads
php artisan storage:link

# Start development server
php artisan serve
# Or use the comprehensive dev script
composer run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend-nextjs

# Install Node dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

### Environment Configuration

**Backend (.env)**

```env
APP_NAME="HR-IMS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

FILESYSTEM_DISK=public
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## 🔌 API Documentation

### Authentication & Security

Currently, the API operates without authentication for development. For production:

1. Implement Laravel Sanctum or Passport
2. Add middleware to routes
3. Configure CORS policies
4. Implement rate limiting

### Response Format

All API responses follow a consistent JSON structure:

**Success Response**

```json
{
  "status": "success",
  "message": "Resource created successfully",
  "data": { ... }
}
```

**Error Response**

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": { ... }
}
```

### Query Parameters

The API supports advanced querying via Spatie Query Builder:

- **Filtering**: `?filter[field]=value`
- **Sorting**: `?sort=field,-field2`
- **Pagination**: `?per_page=15&page=1`

### Available Endpoints

#### Users Management

```http
GET    /api/users                    # List users with filtering
POST   /api/users                    # Create new user
GET    /api/users/{id}               # Get specific user
PUT    /api/users/{id}               # Update user
DELETE /api/users/{id}               # Delete user
```

#### Departments Management

```http
GET    /api/departments              # List departments
POST   /api/departments              # Create department
GET    /api/departments/{id}         # Get department
PUT    /api/departments/{id}         # Update department
DELETE /api/departments/{id}         # Delete department
GET    /api/departments/{id}/form-data  # Get form data for editing
```

#### Employees Management

```http
GET    /api/employees                # List employees
POST   /api/employees                # Create employee
GET    /api/employees/{id}           # Get employee
PUT    /api/employees/{id}           # Update employee
DELETE /api/employees/{id}           # Delete employee
GET    /api/employees/{id}/form-data # Get form data for editing
```

#### Employee Documents

```http
GET    /api/employee-documents       # List documents
POST   /api/employee-documents       # Upload document (multipart)
GET    /api/employee-documents/{id}  # Get document
PUT    /api/employee-documents/{id}  # Update document
DELETE /api/employee-documents/{id}  # Delete document
```

#### Designations

```http
GET    /api/designations             # List designations
POST   /api/designations             # Create designation
GET    /api/designations/{id}        # Get designation
PUT    /api/designations/{id}        # Update designation
DELETE /api/designations/{id}        # Delete designation
GET    /api/designations/{id}/form-data  # Get form data
```

#### Attendance Records

```http
GET    /api/attendance-records       # List attendance
POST   /api/attendance-records       # Create attendance record
GET    /api/attendance-records/{id}  # Get attendance record
PUT    /api/attendance-records/{id}  # Update attendance record
DELETE /api/attendance-records/{id}  # Delete attendance record
```

#### Leave Management

```http
GET    /api/leaves                   # List leave requests
POST   /api/leaves                   # Create leave request
GET    /api/leaves/{id}              # Get leave request
PUT    /api/leaves/{id}              # Update leave request
DELETE /api/leaves/{id}              # Delete leave request

GET    /api/leave-types              # List leave types
POST   /api/leave-types              # Create leave type
GET    /api/leave-types/{id}         # Get leave type
PUT    /api/leave-types/{id}         # Update leave type
DELETE /api/leave-types/{id}         # Delete leave type
```

#### Salary Management

```http
GET    /api/salaries                 # List salaries
POST   /api/salaries                 # Create salary record
GET    /api/salaries/{id}            # Get salary record
PUT    /api/salaries/{id}            # Update salary record
DELETE /api/salaries/{id}            # Delete salary record
```

#### Currency Management

```http
GET    /api/currencies               # List currencies
POST   /api/currencies               # Create currency
GET    /api/currencies/{id}          # Get currency
PUT    /api/currencies/{id}          # Update currency
DELETE /api/currencies/{id}          # Delete currency
```

#### Audit Logs

```http
GET    /api/audit-logs               # List audit logs
GET    /api/audit-logs/{id}          # Get audit log
```

### Request Examples

#### Create Employee Document

```bash
curl -X POST http://127.0.0.1:8000/api/employee-documents \
  -F "employee_id=1" \
  -F "type=contract" \
  -F "document=@/path/to/file.pdf" \
  -F "expiry_date=2025-12-31" \
  -F "metadata[description]=Employment contract"
```

#### Filter Employees by Department

```bash
curl "http://127.0.0.1:8000/api/employees?filter[department_id]=1&sort=-date_of_joining&per_page=10"
```

## 🎨 Frontend Architecture

### Page Structure

- **Dashboard**: Main application interface
- **Admin**: Administrative functions
- **Users**: User management interface
- **Departments**: Organizational structure management
- **Employees**: Personnel management
- **Documents**: File management interface

### Component Library

- **shadcn/ui**: Pre-built, accessible components
- **Radix UI**: Headless component primitives
- **Custom Components**: Domain-specific UI elements

### State Management

- **TanStack Query**: Server state management
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation and type safety

## 🧪 Testing

### Backend Testing

```bash
cd backend-laravel
php artisan test
```

### Frontend Testing

```bash
cd frontend-nextjs
npm run lint
npm run build
```

### Code Quality

```bash
# Backend
cd backend-laravel
./vendor/bin/pint

# Frontend
cd frontend-nextjs
npm run lint
```

## 🚀 Deployment

### Backend Deployment

1. Set up PHP 8.2+ environment
2. Configure web server (Apache/Nginx)
3. Set up persistent storage for uploads
4. Run migrations: `php artisan migrate --force`
5. Optimize: `php artisan config:cache && php artisan route:cache`

### Frontend Deployment

1. Build application: `npm run build`
2. Deploy to platform (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up API base URL

### Production Checklist

- [ ] Enable authentication
- [ ] Configure HTTPS
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🔧 Development Guidelines

### Code Standards

- **PHP**: PSR-12 coding standards
- **JavaScript/TypeScript**: ESLint + Prettier
- **Git**: Conventional commits
- **Documentation**: Inline comments for complex logic

### Best Practices

- Use Form Requests for validation
- Implement Resource transformers for API responses
- Keep controllers thin, move business logic to services
- Write tests for critical functionality
- Use database transactions for data integrity

### Database Conventions

- Use migrations for schema changes
- Implement soft deletes where appropriate
- Add proper indexes for performance
- Use foreign key constraints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure code quality standards
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review API documentation above

## 🔮 Roadmap

### Phase 1: Core Features ✅

- [x] User management
- [x] Department structure
- [x] Employee records
- [x] Document management
- [x] Basic API structure

### Phase 2: Advanced Features 🚧

- [ ] Authentication & authorization
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Advanced search and filtering

### Phase 3: Enterprise Features 📋

- [ ] Multi-tenancy
- [ ] Advanced audit logging
- [ ] API rate limiting
- [ ] Performance optimization
- [ ] Advanced analytics

---

**Built with ❤️ using Laravel and Next.js**
