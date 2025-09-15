# Currency Management System

## Overview

The Currency Management System provides a comprehensive solution for managing currencies in an HR management system. This feature allows administrators to create, manage, and configure different currencies with multilingual support, decimal precision settings, and status management for a seamless financial experience.

## Features

### Backend Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Multilingual Support**: Support for English and Arabic currency names
- **Currency Code Validation**: Strict 3-letter uppercase currency code validation
- **Decimal Precision**: Configurable decimal places (0-4) for different currencies
- **Status Management**: Active/Inactive status for currency availability
- **Audit Trail**: Track who created, updated, or deleted currencies
- **Soft Deletes**: Preserve data integrity with soft deletion
- **API Endpoints**: RESTful API with proper validation and error handling
- **Database Relationships**: Proper foreign key relationships with User model

### Frontend Features

- **Modern UI**: Clean, responsive interface using shadcn/ui components
- **Data Table**: Advanced table with sorting, filtering, and pagination
- **Form Validation**: Client-side validation using Zod schemas
- **Real-time Updates**: Optimistic updates with React Query
- **Status Management**: Visual status indicators and quick action buttons
- **Multilingual Forms**: Support for English and Arabic currency names
- **Error Handling**: Comprehensive error handling and user feedback
- **Currency Code Auto-formatting**: Automatic uppercase conversion for currency codes

## Database Schema

### Currencies Table

```sql
CREATE TABLE currencies (
    id BIGINT PRIMARY KEY,
    code CHAR(3) UNIQUE NOT NULL,
    name JSONB NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    decimal_places INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    deleted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## API Endpoints

### Currencies

- `GET /api/currencies` - List all currencies with filtering and pagination
- `POST /api/currencies` - Create a new currency
- `GET /api/currencies/{id}` - Get a specific currency
- `PUT /api/currencies/{id}` - Update a currency
- `DELETE /api/currencies/{id}` - Delete a currency
- `GET /api/currencies/create/form-data` - Get form data for creation
- `GET /api/currencies/{id}/form-data` - Get form data for editing

## Usage Examples

### Creating a Currency

```typescript
const currencyData = {
  code: "USD",
  name: {
    en: "US Dollar",
    ar: "الدولار الأمريكي",
  },
  symbol: "$",
  decimal_places: 2,
  is_active: true,
};

await createCurrency(currencyData);
```

### Filtering Currencies

```typescript
// Filter by status
const activeCurrencies = await getCurrencies("filter[is_active]=true");

// Filter by code
const usdCurrency = await getCurrencies("filter[code]=USD");

// Filter by name
const dollarCurrencies = await getCurrencies("filter[name.en]=Dollar");
```

## User Workflow

### For Administrators

1. **View Currencies**: Navigate to Dashboard → Currencies to see all currencies
2. **Add Currency**: Click "Add Currency" to create a new currency
3. **Configure Details**: Enter currency code, names, symbol, and decimal places
4. **Set Status**: Choose whether the currency is active or inactive
5. **Edit Currency**: Modify existing currency details as needed
6. **Manage Status**: Toggle currency availability for different use cases

### For System Integration

1. **Currency Selection**: Use active currencies in financial transactions
2. **Decimal Handling**: Apply correct decimal places for calculations
3. **Display Formatting**: Use currency symbols and names for user display
4. **Multilingual Support**: Show appropriate language based on user preference

## Best Practices

### Currency Management

- Use standard ISO 4217 currency codes when possible
- Set appropriate decimal places for each currency (e.g., JPY = 0, USD = 2)
- Provide both English and Arabic names for better localization
- Keep currency symbols concise and recognizable
- Regularly review and update inactive currencies

### Data Management

- Maintain consistent currency codes across the system
- Use soft deletes to preserve historical data
- Document any currency policy changes
- Monitor currency usage patterns
- Keep audit trails for compliance

## Technical Implementation

### Backend Architecture

- **Model**: `Currency` with proper relationships and casts
- **Controller**: `CurrencyController` with full CRUD operations
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
- Currency code format validation (3 uppercase letters)

## Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching with React Query
- Optimistic updates for better UX
- Lazy loading of form data

## Currency Code Standards

The system follows ISO 4217 standards for currency codes:

- **USD**: US Dollar
- **EUR**: Euro
- **GBP**: British Pound
- **JPY**: Japanese Yen
- **SAR**: Saudi Riyal
- **AED**: UAE Dirham
- **KWD**: Kuwaiti Dinar
- **QAR**: Qatari Riyal

## Future Enhancements

- Exchange rate management
- Currency conversion functionality
- Historical currency data
- Bulk currency operations
- Advanced reporting and analytics
- Mobile-responsive improvements
- Real-time currency updates
- Integration with financial APIs
- Currency symbol font support
- Multi-currency transaction support
