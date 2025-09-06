# Examples

## Complete Project Creation

### 1. E-commerce Platform
```bash
npx ngen
```
**Input:**
- Product idea: "A marketplace for handmade crafts with seller profiles and payment processing"
- Stack preference: "Node.js, React, Stripe"

**Generated Plan:**
- **Phase 1 (Discovery)**: User research, competitor analysis, technical requirements
- **Phase 2 (MVP)**: Basic product listing, user registration, simple checkout
- **Phase 3 (Core)**: Seller profiles, payment integration, order management
- **Phase 4 (Advanced)**: Reviews, search, recommendations
- **Phase 5 (Launch)**: Performance optimization, security audit, deployment

**Result:** 
- GitHub repo with 28 issues created
- NextJS project scaffolded
- CI/CD pipeline configured

### 2. SaaS Analytics Tool
```bash
node orchestrator.js "Real-time dashboard with user analytics"
```

**Generated Files:**
```
src/
├── components/
│   ├── Dashboard.js
│   ├── AnalyticsChart.js
│   └── UserMetrics.js
├── services/
│   ├── analyticsService.js
│   └── websocketService.js
└── tests/
    ├── dashboard.test.js
    └── analytics.test.js
```

**AI Review Output:**
```markdown
## Code Review Checklist
✓ Components properly structured
✓ WebSocket connection handling
⚠ Missing error boundaries for chart components
⚠ No loading states for async data
✓ Test coverage > 80%

## Suggested Fixes
- Add React Error Boundary around chart components
- Implement skeleton loading for dashboard metrics
- Add WebSocket reconnection logic
```

## Individual Agent Usage

### Planning Agent
```javascript
import { generateProductPlan, breakdownFeature } from './lib/agents/plannerAgent.js';

// Generate full project plan
const plan = await generateProductPlan(
  "A social media scheduler for small businesses",
  "React, Node.js, MongoDB"
);

console.log(plan.stack); // "React, Node.js, Express, MongoDB, Redis"
console.log(plan.phases.length); // 5 phases
console.log(plan.phases[0].tickets.length); // 6 tickets

// Break down specific feature
const tickets = await breakdownFeature("User authentication with OAuth");
/*
[
  {
    title: "Set up OAuth provider configuration",
    desc: "Configure Google, Facebook, GitHub OAuth apps",
    acceptance_criteria: ["OAuth apps created", "Credentials stored securely"],
    estimated_hours: 2,
    type: "task"
  },
  {
    title: "Implement OAuth login flow",
    desc: "Create login endpoints and callback handling",
    acceptance_criteria: ["Login redirects work", "User data extracted"],
    estimated_hours: 6,
    type: "feature"
  }
]
*/
```

### Architecture Agent
```javascript
import { generateArchitecture } from './lib/agents/architectAgent.js';

const arch = await generateArchitecture("File upload with virus scanning");

console.log(arch.file_structure);
/*
[
  "src/controllers/uploadController.js",
  "src/services/virusScanService.js", 
  "src/middleware/fileValidation.js",
  "src/utils/fileProcessor.js",
  "tests/upload.test.js"
]
*/

console.log(arch.system_diagram);
/*
graph TD;
    A[Client] --> B[Upload Endpoint];
    B --> C{File Validation};
    C --> D[Virus Scanner];
    D --> E[File Storage];
    E --> F[Database Record];
*/
```

### Test-Driven Development Flow
```javascript
import { writeFailingTest } from './lib/agents/testerAgent.js';
import { implementCode } from './lib/agents/coderAgent.js';
import { reviewCodeAndTests } from './lib/agents/reviewerAgent.js';

// 1. Generate failing test
const test = await writeFailingTest("Password strength validator");
console.log(test.filename); // "tests/passwordValidator.test.js"

// 2. Implement code to pass test
const impl = await implementCode(test.code);
console.log(impl.filename); // "src/passwordValidator.js"

// 3. Review implementation
const review = await reviewCodeAndTests(impl.code, test.code);
console.log(review.checklist);
/*
[
  "✓ Handles all password requirements",
  "✓ Returns appropriate error messages", 
  "⚠ Missing regex validation for special characters",
  "✓ Good test coverage for edge cases"
]
*/
```

## Template Customization

### Adding New Template
```bash
mkdir cli/templates/python-django
cd cli/templates/python-django
```

**Create template structure:**
```
python-django/
├── manage.py
├── requirements.txt
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   └── __init__.py
├── tests/
│   └── test_example.py
└── .github-ci.yml
```

**requirements.txt:**
```
Django==4.2.0
djangorestframework==3.14.0
pytest-django==4.5.2
black==23.3.0
```

### Modifying Existing Template
```javascript
// In cli/bootstrap.js, templates are copied from cli/templates/
// Customize any template by editing files in cli/templates/{template-name}/

// Example: Add TypeScript to NextJS template
// Edit cli/templates/nextjs/package.json:
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0", 
    "react-dom": "18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Integration Examples

### GitHub Actions Integration
The generated `.github/workflows/ci.yml` includes:
```yaml
name: AI-Generated CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run lint
  
  ai-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - name: AI Code Review
        run: |
          node -e "
          import('./lib/reviewerAgent.js').then(async ({reviewCodeAndTests}) => {
            // Review PR changes and post comment
          })"
```

### Deployment Integration
```javascript
// Add to orchestrator.js for auto-deployment
async function deployFeature(branchName) {
  // Run tests
  const testsPassed = runTests();
  if (!testsPassed) throw new Error('Tests failed');
  
  // Deploy to staging
  execSync('npm run deploy:staging');
  
  // Run integration tests
  const integrationPassed = runIntegrationTests();
  if (!integrationPassed) throw new Error('Integration tests failed');
  
  // Deploy to production
  execSync('npm run deploy:production');
  
  console.log('✓ Feature deployed successfully');
}
```