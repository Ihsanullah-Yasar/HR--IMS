# Leave Management System

## Overview

The Leave Management System provides a comprehensive solution for managing employee leave requests in an HR management system. This feature allows employees to request leave, managers to approve/reject requests, and administrators to track and manage all leave-related activities with a user-friendly workflow.

## Features

### Backend Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Leave Request Workflow**: Status management (pending, approved, rejected, cancelled)
- **Automatic Calculations**: Automatic calculation of total days based on start and end dates
- **Approval System**: Track who approved/rejected requests and when
- **Audit Trail**: Track who created, updated, or deleted leave requests
- **Soft Deletes**: Preserve data integrity with soft deletion
- **API Endpoints**: RESTful API with proper validation and error handling
- **Database Relationships**: Proper foreign key relationships with Employee and LeaveType models

### Frontend Features

- **Modern UI**: Clean, responsive interface using shadcn/ui components
- **Data Table**: Advanced table with sorting, filtering, and pagination
- **Form Validation**: Client-side validation using Zod schemas
- **Date Pickers**: Intuitive calendar components for date selection
- **Real-time Updates**: Optimistic updates with React Query
- **Status Management**: Visual status indicators and quick action buttons
- **Employee Selection**: Dropdown selection for employees and leave types
- **Error Handling**: Comprehensive error handling and user feedback

## Database Schema

### Leaves Table

```sql
CREATE TABLE leaves (
    id BIGINT PRIMARY KEY,
    employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,1),
    reason TEXT NOT NULL,
    status VARCHAR(255) DEFAULT 'pending',
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    deleted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Leave Requests

- `GET /api/leaves` - List all leave requests with filtering and pagination
- `POST /api/leaves` - Create a new leave request
- `GET /api/leaves/{id}` - Get a specific leave request
- `PUT /api/leaves/{id}` - Update a leave request
- `DELETE /api/leaves/{id}` - Delete a leave request
- `GET /api/leaves/create/form-data` - Get form data for creation
- `GET /api/leaves/{id}/form-data` - Get form data for editing

## Usage Examples

### Creating a Leave Request

```typescript
const leaveData = {
  employee_id: 1,
  leave_type_id: 2,
  start_date: "2024-01-15",
  end_date: "2024-01-17",
  reason: "Family vacation",
  status: "pending",
};

await createLeave(leaveData);
```

### Approving a Leave Request

```typescript
await approveLeave(leaveId, currentUserId);
```

### Filtering Leave Requests

```typescript
// Filter by status
const pendingLeaves = await getLeaves("filter[status]=pending");

// Filter by employee
const employeeLeaves = await getLeaves("filter[employee_id]=1");

// Filter by leave type
const sickLeaves = await getLeaves("filter[leave_type_id]=2");
```

## User Workflow

### For Employees

1. **Request Leave**: Navigate to Dashboard → Leave Requests → Request Leave
2. **Select Details**: Choose employee, leave type, dates, and provide reason
3. **Submit Request**: Submit the request for manager approval
4. **Track Status**: Monitor the status of submitted requests
5. **View History**: Access past leave requests and their status

### For Managers/HR Staff

1. **Review Requests**: View all pending leave requests
2. **Approve/Reject**: Use quick action buttons to approve or reject requests
3. **Edit Requests**: Modify leave request details if needed
4. **Track Approvals**: See who approved/rejected requests and when
5. **Monitor Usage**: Track leave usage across the organization

### For Administrators

1. **Manage All Requests**: View, edit, and delete any leave request
2. **Status Management**: Change request statuses as needed
3. **Audit Trail**: Track all changes and approvals
4. **Reporting**: Generate reports on leave usage and patterns

## Best Practices

### Leave Request Management

- Set clear policies for different leave types
- Implement approval workflows based on leave duration
- Use consistent date formats and validation
- Provide clear reason requirements
- Track approval timelines

### Data Management

- Regularly review and update leave policies
- Maintain accurate employee and leave type data
- Archive old requests instead of deleting
- Document any policy changes
- Monitor leave patterns for policy adjustments

## Technical Implementation

### Backend Architecture

- **Model**: `Leave` with proper relationships and casts
- **Controller**: `LeaveController` with full CRUD operations
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

- Email notifications for status changes
- Calendar integration
- Bulk operations for leave requests
- Advanced reporting and analytics
- Mobile-responsive improvements
- Real-time notifications
- Leave balance tracking
- Integration with payroll systems
