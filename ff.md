1. Core Functional Scope
Do you want all features currently discussed (dashboard, contacts, deals & pipeline, accounts, reports, user authentication/roles, AI add-ons)? yes
What other entities or modules must be present (e.g., notes/activities, support tickets)? no need.
Will the CRM support both individual contacts and organizations/accounts (i.e., B2B and B2C)? only B2B
2. User Roles and Permissions
What user roles will exist (admin, sales, support, manager, etc.)? admin, sales and support.
What precise permissions should each have (CRUD over contacts, deals, reporting, configuration, user management, AI add-ons)? admin - CRUD, sale- CRU, support - CRU
Any restrictions or special logic (e.g., cannot view others’ deals/contacts, approval workflows)? no
3. Authentication and Authorization
What authentication methods will be used (email-password, OAuth/SSO, 2FA)? email-password.
How is session management handled (JWT, cookies, refresh tokens—note you have refresh token model)? jwt
Any password/security policies (strength, expiration, reset flow, etc.)? refresh-token 
4. Data Model & Relationships
List required fields for each main entity (Contacts, Deals, Accounts, Users, Notes, Activities).
-- Users and Authentication
users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Organizations/Companies
organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Contacts
contacts (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    assigned_to INTEGER REFERENCES users(id)
);

-- Contact Personas (AI-generated)
contact_personas (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    communication_preferences TEXT,
    pain_points TEXT,
    personality_summary TEXT,
    sales_approach_tips TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Deals
deals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    contact_id INTEGER REFERENCES contacts(id),
    owner_id INTEGER REFERENCES users(id),
    value DECIMAL(15,2),
    expected_close_date DATE,
    stage VARCHAR(50) NOT NULL,
    probability INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Deal Stages
deal_stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    order_index INTEGER NOT NULL,
    probability INTEGER
);

-- Deal Coach AI Recommendations
deal_coach_recommendations (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id),
    recommendation TEXT NOT NULL,
    rationale TEXT,
    priority INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    implemented BOOLEAN DEFAULT FALSE
);

-- Activities
activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- call, email, meeting, note
    subject VARCHAR(255),
    description TEXT,
    related_to_type VARCHAR(50), -- deal, contact, organization
    related_to_id INTEGER,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    status VARCHAR(50)
);

-- Objections and Responses
objections (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id),
    contact_id INTEGER REFERENCES contacts(id),
    objection_text TEXT NOT NULL,
    ai_response TEXT,
    was_used BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Win-Loss Analysis
win_loss_analysis (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id),
    outcome VARCHAR(50) NOT NULL, -- won, lost
    contributing_factors TEXT,
    ai_summary TEXT,
    improvement_suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES users(id),
    related_to_type VARCHAR(50), -- deal, contact, organization
    related_to_id INTEGER,
    due_date TIMESTAMP,
    status VARCHAR(50),
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

5. AI Add-ons
(Very important, as these require clarity for integration and data flows)

Should the AI be called via RESTful APIs with backend orchestration, or should the client call an LLM provider directly? via RESTful APIs from backend
What LLM service/provider do you wish to use (OpenAI, Azure, local inference, etc.)? OpenAI
What is the input/output format for each AI-powered feature (Deal Coach, Persona Builder, Objection Handler, Win-Loss Explainer)? 

Deal coach input: name, value, expected_close_date, stage, probability, activities 
Deal coach output : recommendation, rationale, priority.
persona builder input: all past activities with that contact
persona builder output: communication_preferences, pain_points, sales_approach_tips
objection handler input: objection_text 
objection handler output: text


If the agent is to implement prompt templates for these, should they be configurable? yes
Should logs/outputs from AI modules be stored in the database? If so, how and where? no


6. Frontend: Pages/Routes & UI/UX
Can you list all major frontend routes/pages with a brief description (Dashboard, Contacts, Deals, etc.)?

/dashboard
/contacts
/deals
/reports

Will you provide any mockups, or should the agent generate from your description and atomic component library (shadcn, tailwind, etc.)? should use shadcn

Any specific layout or responsive design requirements? responsive not required 
Any accessibility requirements? no 
Should the CRM be ready for i18n (internationalization/multilanguage support)? no
7. State Management
Any specific state slices or data flows Redux should manage? 

Redux should manage auth, contacts, deals, tasks, companies, reports, aiSuggestions, and ui, with data flows handled via createAsyncThunk and selectors for derived state.

Will you need persistent state (e.g., via Redux-Persist)? no
How will API errors, loading states, and authentication be handled in Redux?
Each slice handles loading and error states in extraReducers, while authentication uses auth slice with isAuthenticated, token storage, and Axios interceptors for token refresh.

8. Notifications/Real-time
Do you want any notifications (in-app toast, email alerts, sms), and for what events? no need
Is real-time update requirement present (e.g., socket.io for deal updates), or is polling/refreshing enough? not need
9. Integrations
Which external services (email, calendar, marketing, etc.) should the MVP integrate with, and at what depth (send email, log emails, calendar sync, etc.)? no need
For AI, should usage be limited/configurable per role? no 
Should integration tokens/credentials be managed via UI/admin panel? no
10. Reporting & Analytics
List the key reports and analytics you expect in MVP (pipeline summary, win/loss, activity per user, custom reports, etc.).
Should users be able to export reports (CSV, PDF, etc.)? only simple pdf
11. Customization & Extensibility
Should admin users be able to add custom fields to contacts, deals, etc.? no
Custom pipelines/stages per user or per org? no
12. Testing & Quality
What test coverage do you expect (unit, integration, e2e)? unit and integration
Should the agent scaffold tests? (Jest, Cypress, etc.) yes
13. Deployment & Environment
Any special requirements for containerization (Docker), CI/CD, or hosting? no need
Should environment variables be strictly separated for dev/prod? yes
14. Seeding & Demo Data
Should agent provide demo/seed data scripts for development and review? yes
15. Documentation & API
Should agent auto-generate API documentation (Swagger/OpenAPI)? YES
What user/developer docs should be prioritized? readme files 
16. Data Privacy & Compliance
Do you need any features like data anonymization, GDPR consent, activity/audit logs? no
Data retention/deletion policies? no
17. Error Handling & Observability
Should the backend be instrumented for logging and error reporting (Winston, Sentry, etc.)? yes