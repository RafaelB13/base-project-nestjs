# Docker Development Environment

This project includes a complete development environment using Docker with hot reload.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NestJS App    │    │   PostgreSQL    │    │     Redis       │
│   (Port 3000)   │◄──►│   (Port 5432)   │    │   (Port 6379)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────��────┐
                    │    PgAdmin      │
                    │   (Port 8080)   │
                    └─────────────────┘
```

## Included Services

### 🚀 NestJS Application
- **Container**: `upload-s3-dev`
- **Port**: 3000
- **Debug Port**: 9229
- **Hot Reload**: ✅ Enabled
- **Volume**: Source code mapped for development

### 🗄️ PostgreSQL Database
- **Container**: `upload-s3-postgres`
- **Port**: 5432
- **User**: devuser
- **Password**: devpass
- **Database**: upload_s3_dev
- **Volume**: Persistent data

### 📊 PgAdmin (DB Administration)
- **Container**: `upload-s3-pgadmin`
- **Port**: 8080
- **URL**: http://localhost:8080
- **Email**: admin@example.com
- **Password**: admin123

### 🔄 Redis
- **Container**: `upload-s3-redis`
- **Port**: 6379
- **Persistence**: ✅ Enabled
- **Volume**: Persistent data

## Available Commands

### Development
```bash
# Start the complete environment
npm run docker:dev

# Stop the environment
npm run docker:stop

# View real-time logs
npm run docker:logs

# Rebuild containers
npm run docker:build

# Clean everything (containers + volumes)
npm run docker:clean
```

### Direct Docker Commands
```bash
# Start only specific services
docker-compose up postgres redis -d

# Execute commands inside the container
docker-compose exec app npm run test

# Access the container's shell
docker-compose exec app sh

# View logs for a specific service
docker-compose logs -f postgres

# Reset the database
docker-compose restart postgres
```

## Hot Reload

Hot reload is configured and working:

1. **Volume Mapping**: The local `./` directory is mapped to `/app` in the container.
2. **Node Modules**: An anonymous volume protects `node_modules` from conflicts.
3. **Watch Mode**: NestJS runs in `--watch` mode.
4. **TypeScript**: Automatic compilation when files are saved.

### Testing Hot Reload

1. Start the environment: `npm run docker:dev`
2. Edit any `.ts` file in `src/`.
3. View the logs: `npm run docker:logs`
4. The application will be recompiled automatically.

## Debugging

### VS Code Debug Configuration

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

### Debugging Steps

1. Start the environment: `npm run docker:dev`
2. Port 9229 is exposed for debugging.
3. Use VS Code to attach to the process.
4. Set breakpoints and debug as usual.

## Connecting to the Database

### Via Application
```typescript
// The variables are already configured in docker-compose.yml
DATABASE_URL=postgresql://devuser:devpass@postgres:5432/upload_s3_dev
```

### Via PgAdmin
1. Access: http://localhost:8080
2. Email: admin@example.com
3. Password: admin123
4. Add a new server:
   - Host: postgres
   - Port: 5432
   - Database: upload_s3_dev
   - Username: devuser
   - Password: devpass

### Via External Client
```bash
# psql
psql -h localhost -p 5432 -U devuser -d upload_s3_dev

# Connection string
postgresql://devuser:devpass@localhost:5432/upload_s3_dev
```

## Persistent Volumes

Data is preserved across restarts:

- **postgres_data**: PostgreSQL data
- **redis_data**: Redis data
- **pgadmin_data**: PgAdmin settings

### Cleaning Data
```bash
# Remove only containers
docker-compose down

# Remove containers + volumes (CAUTION: this deletes data!)
docker-compose down -v
```

## Performance

### Recommendations for macOS
- Use Docker Desktop 4.0+
- Enable "Use the new Virtualization Framework"
- Consider using named volumes for better performance

### Monitoring
```bash
# View resource usage
docker stats

# View disk space usage
docker system df

# Clean up the cache
docker system prune -f
```

## Troubleshooting

### Container Fails to Start
```bash
# View detailed logs
docker-compose logs app

# Check if ports are in use
lsof -i :3000
```

### Hot Reload Not Working
```bash
# Check volumes
docker-compose exec app ls -la /app

# Rebuild the container without cache
docker-compose build --no-cache app
```

### Permission Issues
```bash
# Check the container user
docker-compose exec app whoami

# Fix permissions if necessary
sudo chown -R $USER:$USER .
```

### Database Connection Issues
```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready

# Reset the database
docker-compose restart postgres
```