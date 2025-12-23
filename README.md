# Job Application Management System

A full-stack web application for recruiters to manage job candidates and track their application status through the hiring process.

## Features

### Core Features
- ✅ User authentication with token-based auth
- ✅ Complete CRUD operations for candidates
- ✅ Pagination for large datasets
- ✅ Real-time search by name/email
- ✅ Filter candidates by status
- ✅ Quick status updates
- ✅ Form validation (frontend + backend)
- ✅ Loading indicators
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Responsive design

### Bonus Features Implemented
- ✅ Advanced filtering and search
- ✅ Email uniqueness validation
- ✅ Proper HTTP status codes
- ✅ Clean code architecture
- ✅ Professional UI/UX

##  Tech Stack

### Backend
- **Framework**: Django 4.2+
- **API**: Django REST Framework
- **Authentication**: Token Authentication
- **Database**: SQLite (default) / PostgreSQL
- **Additional**: django-cors-headers, django-filter

### Frontend
- **Framework**: Angular 18+
- **UI Library**: Angular Material
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## 🔧 Installation & Setup

### Backend Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd job_application_system

# 2. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create test data (user + sample candidates)
python manage.py create_test_data

# 6. Run development server
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd job-application-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Frontend will run on: `http://localhost:4200`

##  Test Credentials

```
Username: recruiter
Password: password123
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login/` | User login |
| POST | `/api/logout/` | User logout |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates/` | List all candidates (paginated) |
| POST | `/api/candidates/` | Create new candidate |
| GET | `/api/candidates/{id}/` | Get single candidate |
| PUT | `/api/candidates/{id}/` | Update candidate (full) |
| PATCH | `/api/candidates/{id}/` | Update candidate (partial) |
| DELETE | `/api/candidates/{id}/` | Delete candidate |
| PATCH | `/api/candidates/{id}/status/` | Update status only |

### Query Parameters

#### GET `/api/candidates/`
- `page`: Page number (default: 1)
- `search`: Search by name or email
- `status`: Filter by status (Applied, Interview, Selected, Rejected)

**Example:**
```
GET /api/candidates/?page=1&search=john&status=Interview
```

## 📊 API Request/Response Examples

### Login
**Request:**
```json
POST /api/login/
{
  "username": "recruiter",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "recruiter",
    "email": "recruiter@example.com",
    "first_name": "John",
    "last_name": "Recruiter"
  }
}
```

### Create Candidate
**Request:**
```json
POST /api/candidates/
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b

{
  "name": "Jane Doe",
  "email": "jane.doe@email.com",
  "phone": "9876543210",
  "position_applied": "Frontend Developer",
  "status": "Applied"
}
```

**Response:**
```json
{
  "message": "Candidate created successfully",
  "data": {
    "id": 6,
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "9876543210",
    "position_applied": "Frontend Developer",
    "status": "Applied",
    "created_at": "2024-12-22T10:30:00Z",
    "updated_at": "2024-12-22T10:30:00Z"
  }
}
```

### Update Status
**Request:**
```json
PATCH /api/candidates/6/status/
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b

{
  "status": "Interview"
}
```

**Response:**
```json
{
  "message": "Status updated to Interview",
  "data": {
    "id": 6,
    "status": "Interview"
  }
}
```

### List Candidates (Paginated)
**Response:**
```json
{
  "count": 50,
  "next": "http://127.0.0.1:8000/api/candidates/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice.johnson@email.com",
      "phone": "9876543210",
      "position_applied": "Frontend Developer",
      "status": "Applied"
    },
    // ... 9 more candidates
  ]
}
```

## 🏗️ Project Structure

### Backend
```
job_application_system/
├── job_management/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py
├── candidates/
│   ├── models.py            # Candidate model
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # App URLs
│   ├── admin.py             # Admin configuration
│   └── management/
│       └── commands/
│           └── create_test_data.py
├── db.sqlite3
├── manage.py
└── requirements.txt
```

### Frontend
```
job-application-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── models/
│   │   │   │   └── candidate.model.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── candidate.service.ts
│   │   │       ├── loader.service.ts
│   │   │       └── toast.service.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   └── candidates/
│   │   │       ├── candidate-list/
│   │   │       ├── candidate-form/
│   │   │       └── confirm-dialog/
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── loader/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   └── environment.ts
│   └── styles.scss
└── package.json
```

##  Key Angular Concepts Used

1. **Standalone Components** - Modern Angular architecture
2. **Reactive Forms** - Form validation and handling
3. **HTTP Interceptors** - Token injection and error handling
4. **Route Guards** - Authentication protection
5. **RxJS Observables** - Async data handling
6. **Angular Material** - UI components
7. **Services** - Business logic separation
8. **Lazy Loading** - Performance optimization

##  Security Features
- Token-based authentication
- Auth guard on protected routes
- HTTP interceptor for automatic token injection
- Email uniqueness validation
- CORS configuration
- Input validation (frontend + backend)
- SQL injection prevention (Django ORM)

##  Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Performance Optimizations

- Pagination for large datasets
- Debounced search (500ms)
- Lazy loading of routes
- Efficient query indexing
- Optimized Material components

## 🧪Testing

### Backend
```bash
python manage.py test
```

### Frontend
```bash
npm test
```

##  Common Issues & Solutions

### Issue 1: CORS Error
**Solution:** Ensure backend CORS settings include frontend URL:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```

### Issue 2: Token Not Being Sent
**Solution:** Check auth interceptor is properly configured in `app.config.ts`

### Issue 3: Database Migrations
**Solution:**
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

## 📈 Future Enhancements

- [ ] Role-based access control (Admin/Recruiter)
- [ ] Email notifications
- [ ] Resume upload functionality
- [ ] Interview scheduling
- [ ] Analytics dashboard
- [ ] Export to CSV/PDF
- [ ] Advanced reporting
- [ ] Unit tests
- [ ] E2E tests


##  Acknowledgments

- Django REST Framework documentation
- Angular Material documentation
- Stack Overflow community

