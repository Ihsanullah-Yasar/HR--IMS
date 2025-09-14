# Leave Types Management System

## Overview

The Leave Types Management System provides a comprehensive solution for managing different types of leave in an HR management system. This feature allows administrators to create, manage, and configure various leave types with multilingual support, color coding, and flexible settings.

## Features

### Backend Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Multilingual Support**: Names in English and Arabic
- **Flexible Configuration**:
  - Days per year allocation
  - Paid/Unpaid leave types
  - Active/Inactive status
  - Color coding for visual identification
- **Audit Trail**: Track who created, updated, or deleted leave types
- **Soft Deletes**: Preserve data integrity with soft deletion
- **API Endpoints**: RESTful API with proper validation and error handling
- **Database Relationships**: Proper foreign key relationships with Leave model

### Frontend Features

- **Modern UI**: Clean, responsive interface using shadcn/ui components
- **Data Table**: Advanced table with sorting, filtering, and pagination
- **Form Validation**: Client-side validation using Zod schemas
- **Color Picker**: Visual color selection with preview
- **Multilingual Forms**: Support for English and Arabic names
- **Real-time Updates**: Optimistic updates with React Query
- **Error Handling**: Comprehensive error handling and user feedback

## Database Schema

### Leave Types Table

```sql
CREATE TABLE leave_types (
    id BIGINT PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    name JSONB NOT NULL, -- {en: string, ar?: string}
    description TEXT,
    days_per_year INTEGER NOT NULL,
    is_paid BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7), -- Hex color code
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id),
    deleted_by BIGINT REFERENCES users(id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Leave Types

- `GET /api/leave-types` - List all leave types with filtering and pagination
- `POST /api/leave-types` - Create a new leave type
- `GET /api/leave-types/{id}` - Get a specific leave type
- `PUT /api/leave-types/{id}` - Update a leave type
- `DELETE /api/leave-types/{id}` - Delete a leave type
- `GET /api/leave-types/create/form-data` - Get form data for creation
- `GET /api/leave-types/{id}/form-data` - Get form data for editing

## Usage Examples

### Creating a Leave Type

```typescript
const leaveTypeData = {
  code: "ANNUAL",
  name: {
    en: "Annual Leave",
    ar: "إجازة سنوية",
  },
  description: "Annual vacation leave for employees",
  days_per_year: 21,
  is_paid: true,
  is_active: true,
  color: "#3B82F6",
};

await createLeaveType(leaveTypeData);
```

### Filtering Leave Types

```typescript
// Filter by paid status
const paidLeaveTypes = await getLeaveTypes("filter[is_paid]=true");

// Filter by active status
const activeLeaveTypes = await getLeaveTypes("filter[is_active]=true");

// Search by name
const searchResults = await getLeaveTypes("filter[name]=annual");
```

## User Workflow

### For Administrators

1. **Access Leave Types**: Navigate to Dashboard → Leave Types
2. **View All Types**: See all leave types in a sortable, filterable table
3. **Create New Type**: Click "Add Leave Type" button
4. **Configure Settings**: Set code, names, days, payment status, and color
5. **Edit Existing**: Click edit button on any leave type
6. **Manage Status**: Toggle active/inactive status as needed
7. **Delete Types**: Remove unused leave types (soft delete)

### For HR Staff

1. **Reference Types**: Use leave types when processing leave requests
2. **Check Availability**: Verify active leave types for employees
3. **Track Usage**: Monitor leave type usage through the system

## Best Practices

### Leave Type Configuration

- Use clear, descriptive codes (e.g., "ANNUAL", "SICK", "MATERNITY")
- Set appropriate days per year based on company policy
- Use consistent color coding for visual identification
- Provide descriptions for clarity
- Keep inactive types for historical data

### Data Management

- Regularly review and update leave types
- Archive old leave types instead of deleting
- Maintain consistent naming conventions
- Document any policy changes

## Technical Implementation

### Backend Architecture

- **Model**: `LeaveType` with proper relationships and casts
- **Controller**: `LeaveTypeController` with full CRUD operations
- **Requests**: Validation classes for create and update operations
- **Resource**: API resource for consistent response formatting
- **Migration**: Database schema with proper indexes and constraints

### Frontend Architecture

- **Types**: TypeScript interfaces for type safety
- **Actions**: API service functions with error handling
- **Components**: Reusable UI components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query for server state

## Security Considerations

- Input validation on both client and server
- Authorization checks for all operations
- Audit logging for sensitive operations
- Soft deletes to prevent data loss
- Proper error handling without exposing sensitive information

## Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching with React Query
- Optimistic updates for better UX
- Lazy loading of form data

## Future Enhancements

- Bulk operations for leave types
- Leave type templates
- Integration with calendar systems
- Advanced reporting and analytics
- Mobile-responsive improvements
- Real-time notifications
