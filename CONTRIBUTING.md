# Contributing to K2020 OHSE SaaS

Thank you for your interest in contributing to K2020 OHSE SaaS! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Respect others' time and effort
- Report harassment or violations

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/stanfliet/k2020-OHSE-SAAS.git
cd K2020-OHSE-SaaS
git remote add upstream https://github.com/stanfliet/k2020-OHSE-SAAS.git
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/add-xxx` - New feature
- `fix/issue-xxx` - Bug fix
- `docs/update-xxx` - Documentation
- `refactor/xxx` - Code refactoring
- `test/xxx` - Adding tests

### 3. Setup Development Environment
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Create .env file with your credentials
cp .env.example .env
# Fill in your Supabase and OpenAI keys
```

## Development Process

### Frontend Development

1. **Start development server**:
```bash
cd frontend
npm run dev
```

2. **Create components** in `src/components/`
3. **Create pages** in `src/pages/`
4. **Add styles** in `src/styles/`
5. **Use TypeScript** for type safety
6. **Follow React best practices**

### Backend Development

1. **Start backend server**:
```bash
cd backend
npm start
```

2. **Create endpoints** in `index.js`
3. **Add utilities** in `utils.ts`
4. **Use Express middleware** for validation
5. **Handle errors** properly
6. **Add logging** for debugging

### Database Changes

1. **Design schema** in `supabase/schema.sql`
2. **Test migrations** locally
3. **Document changes** in commit message
4. **Ensure RLS policies** are secure

## Coding Standards

### Frontend (TypeScript/React)

**File Structure**:
```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── lib/            # Utilities
├── styles/         # CSS files
└── types/          # TypeScript types
```

**Naming Conventions**:
- Components: PascalCase (e.g., `ProjectCard.tsx`)
- Functions: camelCase (e.g., `handleUpload()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- CSS classes: kebab-case (e.g., `.project-card`)

**Code Style**:
```typescript
// Good
const handleFileUpload = async (files: File[]): Promise<void> => {
  try {
    const result = await uploadFiles(files);
    setData(result);
  } catch (error) {
    showError("Upload failed");
  }
};

// Bad
const handleFileUpload = async (files) => {
  const result = await uploadFiles(files);
  setData(result);
};
```

### Backend (Node.js/Express)

**Endpoint Structure**:
```typescript
app.post('/api/endpoint', (req, res) => {
  try {
    // Validate input
    if (!req.body.data) {
      return res.status(400).json({ error: "Missing data" });
    }

    // Process request
    const result = processData(req.body.data);

    // Send response
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Error Handling**:
- Use try-catch blocks
- Return meaningful error messages
- Use appropriate HTTP status codes
- Log errors for debugging

### CSS Standards

**Organization**:
- Use flexbox for layouts
- Use CSS Grid for complex layouts
- Use custom properties for colors
- Mobile-first responsive design
- Use semantic class names

```css
.component-name {
  /* Layout */
  display: flex;
  gap: 1rem;
  
  /* Sizing */
  width: 100%;
  padding: 1rem;
  
  /* Colors */
  background: var(--color-background);
  color: var(--color-text);
  
  /* Effects */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build, dependencies

**Example**:
```
feat(documents): add PDF upload with AI analysis

- Implement file upload endpoint
- Add PDF text extraction
- Integrate GPT-4 analysis
- Add error handling

Closes #123
```

### Commit Best Practices
- One logical change per commit
- Write descriptive messages
- Reference issues when applicable
- Keep commits atomic and reversible

## Pull Request Process

### 1. Before Submitting PR

- [ ] Fork and create feature branch
- [ ] Make your changes
- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Run linting: `npm run lint`
- [ ] Test build: `npm run build`
- [ ] Commit with proper messages

### 2. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to test the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for clarity
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### 3. PR Review

- Address review comments promptly
- Push new commits to update PR
- Request re-review after changes
- Be open to feedback and suggestions

## Testing

### Frontend Tests

```bash
cd frontend
npm run test              # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend Tests

```bash
cd backend
npm test                  # Run tests
npm run test:watch       # Watch mode
```

### Manual Testing

1. **Frontend**:
   - Test in different browsers
   - Test responsive design
   - Check accessibility

2. **Backend**:
   - Test API endpoints with curl or Postman
   - Test with invalid input
   - Test error handling

## Documentation

### Code Comments

Write clear comments for complex logic:

```typescript
// Good
// Calculate weighted score based on risk severity and frequency
const weightedScore = severity * frequencyWeight + frequency * severityWeight;

// Avoid
// score calculation
const score = sev * freq_weight + freq * sev_weight;
```

### Function Documentation

Use JSDoc comments:

```typescript
/**
 * Analyzes uploaded documents using GPT-4
 * @param files - Array of File objects to analyze
 * @returns Promise<AnalysisResult>
 * @throws Error if analysis fails
 */
async function analyzeDocuments(files: File[]): Promise<AnalysisResult> {
  // implementation
}
```

### README Requirements

Update README when:
- Adding new features
- Changing API endpoints
- Adding environment variables
- Changing setup instructions

## Release Process

1. Update version in package.json
2. Create GitHub release with changelog
3. Tag commit with version number
4. Deploy to production

## Help & Questions

- **GitHub Discussions**: Ask questions
- **GitHub Issues**: Report bugs
- **Email**: support@k2020ohse.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to K2020 OHSE SaaS! 🙌**

Your contributions help make OHSE compliance easier for everyone.
