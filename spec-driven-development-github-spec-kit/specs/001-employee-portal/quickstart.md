# Quickstart Guide: Employee Portal

**Date**: January 22, 2026  
**Target Audience**: Developers  
**Status**: Complete

## Prerequisites

### System Requirements
- Windows 11 with WSL 2 enabled
- Ubuntu 24.04 LTS in WSL 2
- Docker Engine 25.x+ (running in WSL 2)
- Docker Compose v2.29+
- Git 2.40+
- Java 25 JDK
- Node.js 22.x LTS
- Maven 3.9+

### Development Environment Setup

1. **Install WSL 2 and Ubuntu**
   ```powershell
   wsl --install -d Ubuntu-24.04
   ```

2. **Install Docker in WSL 2**
   ```bash
   # In Ubuntu terminal
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Java 25 and Maven**
   ```bash
   # Add SDKMAN
   curl -s "https://get.sdkman.io" | bash
   source "$HOME/.sdkman/bin/sdkman-init.sh"

   # Install Java 25 and Maven
   sdk install java 25.0.0-open
   sdk install maven 3.9.6
   ```

4. **Install Node.js**
   ```bash
   # Install Node Version Manager
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   nvm install 22
   nvm use 22
   ```

## Project Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd spec-driven-development-github-spec-kit
```

### 2. Environment Configuration

Create environment files:

**backend/.env**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/employee_portal
MONGODB_DATABASE=employee_portal

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=employee-portal
KEYCLOAK_CLIENT_ID=employee-portal-backend
KEYCLOAK_CLIENT_SECRET=your-client-secret

# Application
SERVER_PORT=8081
LOG_LEVEL=INFO

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret
```

**frontend/.env**
```env
# API
API_BASE_URL=http://localhost:8081/api

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=employee-portal
KEYCLOAK_CLIENT_ID=employee-portal-frontend

# Application
PORT=4200
```

### 3. Start Infrastructure Services

```bash
# From project root
docker compose up -d mongodb keycloak
```

Wait for services to be healthy:
```bash
docker compose ps
```

### 4. Initialize Keycloak

```bash
# Run Keycloak setup script
./scripts/setup-keycloak.sh
```

This script will:
- Create the employee-portal realm
- Configure clients for backend and frontend
- Set up roles (USER, ADMIN, MANAGER)
- Create test users

### 5. Initialize Database

```bash
# Run database initialization
./scripts/init-database.sh
```

This creates:
- Required collections with indexes
- System configuration documents
- GridFS buckets

## Development Workflow

### Backend Development

1. **Start the backend service**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Run tests**
   ```bash
   mvn test                    # Unit tests
   mvn integration-test        # Integration tests with Testcontainers
   mvn verify                  # Full test suite
   ```

3. **Code quality checks**
   ```bash
   mvn spotless:check          # Code formatting
   mvn checkstyle:check        # Style guidelines
   mvn sonar:sonar             # Static analysis
   ```

### Frontend Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   # Opens http://localhost:4200
   ```

3. **Run tests**
   ```bash
   npm test                    # Unit tests
   npm run test:e2e           # End-to-end tests
   npm run lint               # Code quality
   ```

### Full Stack Development

1. **Start all services**
   ```bash
   # Terminal 1: Infrastructure
   docker compose up -d

   # Terminal 2: Backend
   cd backend && mvn spring-boot:run

   # Terminal 3: Frontend
   cd frontend && npm start
   ```

2. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8081/api
   - Keycloak Admin: http://localhost:8080 (admin/admin)
   - API Documentation: http://localhost:8081/api-docs

## Testing Strategy

### Unit Testing
```bash
# Backend
mvn test -Dtest=UserServiceTest

# Frontend
npm test -- --testNamePattern="UserService"
```

### Integration Testing
```bash
# With Testcontainers
mvn verify -Dspring.profiles.active=test

# API tests
npm run test:api
```

### End-to-End Testing
```bash
# Full user journey
npm run test:e2e -- --spec="cypress/integration/document-upload.spec.ts"
```

### Performance Testing
```bash
# Load testing
./scripts/load-test.sh

# Memory profiling
java -jar backend/target/app.jar --spring.profiles.active=performance
```

## Debugging

### Backend Debugging
```bash
# Run with debug enabled
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=*:5005"

# Attach debugger in IDE (port 5005)
```

### Frontend Debugging
```bash
# Chrome DevTools
npm start
# Open http://localhost:4200 and press F12

# Debug tests
npm test -- --testNamePattern="DocumentUpload" --verbose
```

### Database Debugging
```bash
# Connect to MongoDB
docker exec -it employee-portal-mongodb mongosh

# Query documents
use employee_portal
db.documents.find().limit(5)

# Check GridFS
db.fs.files.find()
```

### Keycloak Debugging
```bash
# View logs
docker logs employee-portal-keycloak

# Access admin console
open http://localhost:8080
# Login: admin/admin
```

## Common Issues

### Service Won't Start
```bash
# Check service health
docker compose ps

# View logs
docker compose logs [service-name]

# Restart service
docker compose restart [service-name]
```

### Database Connection Issues
```bash
# Test connection
docker exec employee-portal-mongodb mongosh --eval "db.runCommand({ping: 1})"

# Reset database
docker compose down -v
docker compose up -d mongodb
./scripts/init-database.sh
```

### Authentication Problems
```bash
# Check Keycloak status
curl http://localhost:8080/realms/employee-portal

# Reset Keycloak configuration
./scripts/setup-keycloak.sh --reset
```

### File Upload Issues
```bash
# Check file permissions
ls -la uploads/

# Verify GridFS configuration
docker exec employee-portal-mongodb mongosh --eval "db.fs.files.countDocuments()"
```

## Development Scripts

### Available Scripts
```bash
# Full environment setup
./scripts/setup-dev-environment.sh

# Run all tests
./scripts/run-tests.sh

# Generate API documentation
./scripts/generate-api-docs.sh

# Performance testing
./scripts/load-test.sh

# Security scanning
./scripts/security-scan.sh

# Code quality checks
./scripts/code-quality.sh
```

### Custom Scripts
Create scripts in `/scripts` directory following the naming convention:
- `setup-*.sh` - Environment setup
- `test-*.sh` - Testing utilities
- `deploy-*.sh` - Deployment scripts
- `maintenance-*.sh` - Maintenance tasks

## Contributing

### Code Standards
- Follow Java coding conventions
- Use Angular style guide
- Maintain 80% test coverage
- All commits must pass CI checks

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite
4. Create pull request with description
5. Code review and approval
6. Merge to `main`

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Troubleshooting

### Performance Issues
- Check memory usage: `docker stats`
- Profile application: `java -jar app.jar --profile`
- Database slow queries: Enable MongoDB profiler

### Network Issues
- Check port conflicts: `netstat -tulpn`
- Verify Docker networks: `docker network ls`
- Test connectivity: `telnet localhost 8080`

### Build Issues
- Clear Maven cache: `mvn clean`
- Clear npm cache: `npm cache clean --force`
- Rebuild containers: `docker compose build --no-cache`

## Next Steps

After setup completion:
1. Review the [API contracts](./contracts/)
2. Read the [implementation plan](./plan.md)
3. Start with [user authentication](../specs/001-employee-portal/tasks.md)
4. Follow the development tasks in order

## Support

- **Documentation**: See `/docs` directory
- **Issues**: Create GitHub issues with `bug` or `help` labels
- **Discussions**: Use GitHub Discussions for questions
- **Architecture**: Review [constitution](../../.specify/memory/constitution.md)</content>
<parameter name="filePath">c:\Users\jomichel\git\AI-Driven-Software-Development\spec-driven-development-github-spec-kit\specs\001-employee-portal\quickstart.md