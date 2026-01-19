# FDJ Code Test Submission Docs
Firstly, I just want to thank you for the opportunity to work on this take home, I enjoyed it very much and had a blast researching the different bits and pieces. Although the submission is complete, I would have liked to spend more time on it fleshing things out but unfortunately do not have much more time I can allocate (more on that later).

## Assumptions made
* Tests are specifications and as such, modification or addition of new tests was kept to a minimum to ensure the core application behaves as expected.
* Stick to the instructions and structure as closely as possible e.g. if validation of requests is mentioned in the controller, implement validation within the controller not as a new separate middleware.

## API documentation
I integrated swagger for API documentation, when running the application there is a new console log with a link to follow (http://localhost:3000/api-docs)

## Libraries used
#### swagger-ui & swagger-jsdoc
Used both to document the API. Potentially overkill but having swagger also means that frontend users or anyone touching this app can see the existing endpoints and schemas, and  test them easily.

#### Express-rate-limit
Used this library to implement a rudimentary global rate limiter for all routes of the application. I was unsure if the intent behind this requirement was to build one out from scratch. I did some research and found this to be the most widely used express rate limiter and due to time constraints, proceeded down this route.

I decided on a fairly basic 15 minute window with 100 requests to keep it simple. I explored adding rate limiting on a per endpoint basis rather than globally. I think this could work if we have very efficient reads so the limit is more relaxed on reads but stricter on writes. That said, I kept it global for the sake of this take home test.

To test rate limiter, can reduce max to 10 and see the unit tests fail due to 429 errors.

## Notes
### Generic 
* Created a `constants` directory for reused constants such as `TITLE_MAX` and `DESCRIPTION_MAX`
* Created an `errors` directory for custom error classes
* Although comments exist in the codebase where critical or explanation is required, the code should be self documenting.

### Controller
Although instructions mentioned to implement validation within the try/catch block, I opted to implement this outside. This is because I thought having the try/catch handle business layer errors and logic made sense, whilst validation and validation errors should be handled before the service is even called.

### Service
Title duplication: Opted to use a set for unique titles to keep data duplication to a minimum. Although I could simply filter the tasks array for the request title each time, this is more expensive and unnecessary. I also explored using a map, replacing the existing array and having map.keys function as the duplicate titles check and map.values act as the tasks array. I decided against this because it changes the core data structure used and would require restructuring the tests.

### Error handling
I decided to approach error handling by defining explicit error types for each known and expected HTTP error the application will be throwing. This meant migrating the AppError from interface to a class and creating child classes. I did it this way because it meant we could throw or return defined errors with status codes preset (reducing the chance of mistyping the status code or other user errors). Because of this, the error handling middleware remained barebones and simple. 

An alternative could be to leave the structure as it was initially but then handle different status codes within the handler. I opted for my approach because the new error types indicate behaviour to other developers when looking at the code e.g. validation error, conflict error etc. 

### Validation
* All data validation logic was added as part of the schema where it made sense. For example, dueDate being in the future was added in the Joi schema because it's a simple future date check. If the requirement was different and said “1 day in the future” or anything more custom, this would either be moved to the business layer or additional business layer logic would be added.

* The task.ts file was modified slightly to include consts of both the status and priority enum. This was to avoid duplication of defining the same enum in the Joi schema and instead let us check validity directly with `.valid(...TASK_PRIORITIES)`

### Unit test modifications
After implementing the “Validate that due dates are in the future”, one of the unit tests began to fail because it was using `new Date()`. This is likely due to some delay. This test title “should pass validation for valid task data” says it should contain valid creation data so I just simply made the date 1 day in the future. This keeps the test intent the same whilst also ensuring tiny timing mismatches don’t conflict.

## What I would do if I had more Time
1. I explored the different ways to implement Joi validation. One approach I would like to explore was to implement it as middleware rather than at the controller level. I believe this is more standard practice and is similar to what is done in nextjs but I wanted to stick as close to the spec as possible for this code test.
2. Set Authentication up. Tasks may or may not be publicly facing in future iterations, as such, authentication could be an interesting component to include. That being said, this would be more suited to an app that has an sqlite DB at the very least.
3. Setup sqlite database and replace the Tasks array for a more completed application.
4. In production environments, it could be beneficial to cache compiled Joi schemas for better performance. This would ensure schemas are only created once, rather than upon each request. I also thought it would be a good idea to keep it simple and easier to read in this take home test.
5. I did not complete the “comprehensive error logging” requirement due to both time restrictions and the mention that there should be no console errors in the submission (added a single one for unexpected errors in the error handler). I will say that in a production setting I would add error logs to non critical failure paths. Paths that do not cause a total failure of the method or endpoint but are still critical. E.g. failing to cache a record or read from the cache.
6. Use AI to create more comprehensive unit tests to increase code coverage.
7. Add additional unit tests for rate limiting and error handling (checking error types).
8. Spend more time looking through the TS docs to ensure all coding style follows best practice.
9. Flesh out the `Task` type and add more fields that might be useful such as `createdBy`.
10. Although unnecessary for the current implementation, could have looked to strictly type caught errors as `unknown` for safety. The existing error handler can handle this but I opted against this because all failure paths have been defined and handled. This would be good for when we hit an external API, have additional business layer logic that can error or we integrate with something like openAPI that has its own set of errors.

**End of Submission Documentation**

# Task Manager API - TypeScript Interview Challenge

## Outline
- [📋 Important](#important)
- [📋 Project Overview](#introduction)
- [🚀 Quick Start Guide](#quickstart)
- [🛠️ Implementation Requirements](#requirements)
- [🧪 Testing Guide](#testing)
- [💡 Tips for Success](#tips)
- [🧠 AI Use](#ai)

<div id="overview"></a>
  
## 📋 IMPORTANT 
**After you complete your work, please publish it to your own git repository and share the link with the talent team. **


## 📋 Project Overview

Welcome to the TypeScript/NodeJS interview challenge! This is a **90-minute coding exercise** where you'll implement a Task Management API with CRUD operations, validation, error handling, and testing.

### What We're Looking For
- **Following Instructions**: Complete the requirements as specified
- **Clean Code**: Write readable, maintainable TypeScript code  
- **Testing**: All provided tests must pass after implementation
- **NodeJS Skills**: Demonstrate solid understanding of NodeJS/Express concepts

### ⚠️ IMPORTANT: Tests Must Pass
This project includes **comprehensive unit and integration tests** that MUST pass when you complete your implementation. The tests serve as both validation and specification for expected behavior.

If you have questions about requirements during the interview, ask your interviewer for clarification.

**Good luck! 🚀**

---------------------------------------------------

<div id="quickstart"></div>

## 🚀 Quick Start Guide 

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Your Setup
```bash
# Run the server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"..."}
```

### 3. Run Tests (Critical!)
```bash
# Run all tests (most will fail initially - that's expected!)
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch
```

### 4. Your First Steps
1. **Complete the Task interface** in `src/types/task.ts`
2. **Implement one endpoint** - Start with POST /api/tasks
3. **Run tests frequently** - They guide your implementation
4. **Build incrementally** - Make tests pass one by one

### 5. Publish Your Work
After you complete your work, please publish it to a public git repository and share the link with us.

---------------------------------------------------

<div id="requirements"></div>

## 🛠️ Implementation Requirements 

### Project Structure Quick Reference
```
src/
├── types/task.ts          # Complete the Task interface here
├── controllers/           # Implement your API endpoints
├── services/              # Business logic goes here
├── validation/            # Joi validation schemas
├── routes/                # Route definitions (mostly done)
├── middleware/            # Error handling
├── utils/                 # Helper functions
└── __tests__/             # Test files (MUST PASS!)
```

### Core Requirements (60 minutes)

#### 1. Task Model
Complete the `Task` interface in `src/types/task.ts`:
```typescript
interface Task {
  id: string;              // UUID
  title: string;           // Required, max 100 chars
  description?: string;    // Optional, max 500 chars
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;         // Optional
}
```

#### 2. API Endpoints
Implement these endpoints in `src/controllers/taskController.ts`:

- **`GET /api/tasks`** - Get all tasks
  - Support query parameters: `status`, `priority`
  - Return tasks sorted by priority (high → medium → low) then by createdAt

- **`POST /api/tasks`** - Create new task
  - Validate input using Joi
  - Auto-generate ID and timestamps
  - Default status should be 'pending'

#### 3. Validation
Implement input validation in `src/validation/taskValidation.ts`:
- Use Joi for schema validation
- Proper error messages for validation failures

#### 4. Error Handling
Implement proper error handling:
- 400 for validation errors
- 404 for not found  
- 500 for server errors
- Use the error middleware in `src/middleware/errorHandler.ts`

### Bonus Requirements (30 minutes)
If you finish early, you can:

#### 5. Enhanced Validation
Add more sophisticated validation rules:
- Prevent duplicate task titles
- Validate that due dates are in the future
- Add custom error messages for different validation failures

#### 6. Code Quality Improvements
- Add comprehensive error logging
- Implement request rate limiting
- Add API documentation comments
- Improve the error handler with more specific error types

---------------------------------------------------

<div id="testing"></div>

## 🧪 Testing Guide 

### Comprehensive Test Suite
The project includes four test files that **must all pass**:

1. **`src/__tests__/validation.test.ts`** - Joi validation schema tests
2. **`src/__tests__/taskService.test.ts`** - Business logic unit tests
3. **`src/__tests__/task.test.ts`** - API endpoint integration tests  
4. **`src/__tests__/utils.test.ts`** - Utility function tests

### Running Tests
```bash
# Run all tests (must pass!)
npm test

# Watch mode for development (recommended)
npm run test:watch

# Run specific test file
npm test -- validation.test.ts

# Run with coverage
npm test -- --coverage
```

### Test-Driven Development Approach
1. **Start by running tests** - see what's failing
2. **Read test names and expectations** - they tell you exactly what to implement
3. **Implement one feature at a time** - watch tests turn from red to green
4. **Use tests as your specification** - if a test expects specific behavior, implement that exactly

### What the Tests Expect

#### Required Service Methods (`src/services/taskService.ts`)
```typescript
// Core operations
static async createTask(data: CreateTaskRequest): Promise<Task>
static async getAllTasks(query?: TaskQueryParams): Promise<Task[]>
```

#### Required Controller Functions (`src/controllers/taskController.ts`)
```typescript
// All should be async and use (req: Request, res: Response, next: NextFunction)
export const getAllTasks = async (req, res, next) => { ... }
export const createTask = async (req, res, next) => { ... }
```

#### Required Utility Functions (`src/utils/helpers.ts`)
```typescript
export const isValidUUID = (uuid: string): boolean => { ... }
export const formatDate = (date: Date): string => { ... }
export const calculateDaysDifference = (date1: Date, date2: Date): number => { ... }
export const isDateWithin24Hours = (date: Date): boolean => { ... }
```

### Key Behaviors Expected

#### Task Creation
- Generate UUID for new tasks
- Set default status to `'pending'`
- Set `createdAt` and `updatedAt` to current timestamp
- Validate all input data

#### Task Retrieval  
- Filter by `status` and `priority` query parameters
- Sort by priority (high → medium → low) then by `createdAt`
- Return empty array if no tasks match filters

#### HTTP Status Codes
- `200` - Successful GET
- `201` - Successful POST (creation)
- `400` - Validation errors
- `500` - Server errors

### Common Test Failures and Solutions

#### "Cannot find module" errors
- Make sure you've run `npm install`
- Check that your import/export statements match expected interfaces

#### "Property does not exist" errors  
- Complete the interface definitions in `src/types/task.ts`
- Make sure all required properties are included

#### "Function not implemented" errors
- Replace `throw new Error('Not implemented')` with actual implementation
- Make sure function signatures match exactly

#### HTTP status code failures
- Check you're returning correct status codes (200, 201, 204, 400, 404)
- Make sure error responses include proper error objects

### Test Data Cleanup
The integration tests assume you implement a way to clear test data between tests:
1. Add a test-only endpoint like `DELETE /api/tasks/test-clear-all`
2. Or modify your service to have a `clearAllTasks()` method for testing
3. Or reset your in-memory storage between tests

### Success Criteria
✅ **All tests pass** - This is the minimum requirement  
✅ **Clean test output** - No skipped tests, no console errors
✅ **Fast execution** - Tests should run quickly (under 10 seconds total)

---------------------------------------------------

<div id="tips"></div>

## 💡 Tips for Success 

### Time Management Suggestions
- **0-15 min**: Read requirements, understand structure, plan approach
- **15-45 min**: Core operations implementation (GET and POST endpoints)
- **45-75 min**: Validation, error handling, make tests pass
- **75-90 min**: Polish code and bonus features

### Plan of Attack Suggestions
1. **Run tests first** - See what needs to be implemented
2. **Read test names carefully** - They describe exactly what should happen  
3. **Start with the Task interface** - Many tests depend on this
4. **Implement validation early** - Validation tests are often easiest to fix
5. **Use TypeScript effectively** - Leverage type safety and interfaces
6. **Keep it simple** - Focus on making tests pass with clean code
7. **Test frequently** - Use `npm run test:watch` for immediate feedback

---------------------------------------------------

<div id="ai"></div>

## 🧠 AI Use

We are aware of what AI solutions look like, please don't submit an AI generated solution.
