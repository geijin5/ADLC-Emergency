# AWS RDS PostgreSQL Setup Guide

This guide explains how to configure the ADLC Emergency Services platform to connect to an Amazon RDS PostgreSQL database instance.

## Overview

Amazon RDS (Relational Database Service) provides managed PostgreSQL databases. This guide covers:
- Creating an RDS PostgreSQL instance
- Configuring security groups
- Connecting from your application
- Best practices for production

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured (optional, for management)
3. Application running in AWS (EC2, ECS, Lambda, etc.) or configured to access RDS

## Step 1: Create RDS PostgreSQL Instance

### Option A: Using AWS Console

1. **Navigate to RDS Console**
   - Go to AWS Console → RDS → Databases
   - Click "Create database"

2. **Choose Engine**
   - Select "PostgreSQL"
   - Choose version (recommended: 14.x or 15.x)

3. **Templates**
   - **Production**: For production workloads
   - **Dev/Test**: For development/testing
   - **Free tier**: For experimentation (limited availability)

4. **Settings**
   - **DB instance identifier**: `adlc-emergency-db` (or your preferred name)
   - **Master username**: `postgres` (or your preferred username)
   - **Master password**: Create a strong password (save this securely!)

5. **Instance Configuration**
   - Choose instance class based on your needs:
     - `db.t3.micro` (1 vCPU, 1 GB RAM) - Dev/Test
     - `db.t3.small` (2 vCPU, 2 GB RAM) - Small production
     - `db.t3.medium` (2 vCPU, 4 GB RAM) - Medium production
     - Larger instances for higher workloads

6. **Storage**
   - **Storage type**: General Purpose SSD (gp3) recommended
   - **Allocated storage**: Start with 20 GB (can increase later)
   - **Storage autoscaling**: Enable for production

7. **Connectivity**
   - **VPC**: Select your VPC (or default VPC)
   - **Subnet group**: Default or create custom
   - **Public access**: 
     - ✅ **Yes** - If connecting from outside AWS or development
     - ❌ **No** - Recommended for production (more secure)
   - **VPC security group**: Create new or use existing
   - **Availability Zone**: Default or specific zone

8. **Database Authentication**
   - Choose "Password authentication"

9. **Additional Configuration**
   - **Initial database name**: `adlc_emergency`
   - **DB parameter group**: Default (or create custom)
   - **Backup retention**: 7 days (recommended for production)
   - **Enable encryption**: ✅ Recommended for production

10. **Create Database**
    - Review settings
    - Click "Create database"
    - Wait 5-15 minutes for instance to be available

### Option B: Using AWS CLI

```bash
aws rds create-db-instance \
  --db-instance-identifier adlc-emergency-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.9 \
  --master-username postgres \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --db-name adlc_emergency \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --publicly-accessible \
  --storage-encrypted
```

## Step 2: Configure Security Groups

Security groups control network access to your RDS instance.

### For Public Access (Development)

1. **Find RDS Security Group**
   - Go to RDS → Databases → Your DB → Connectivity & Security
   - Note the Security Group ID (e.g., `sg-xxxxxxxxx`)

2. **Edit Inbound Rules**
   - Go to EC2 → Security Groups → Select your RDS security group
   - Add inbound rule:
     - **Type**: PostgreSQL
     - **Protocol**: TCP
     - **Port**: 5432
     - **Source**: 
       - Your IP address for development: `Your.IP.Address/32`
       - Or `0.0.0.0/0` for any IP (⚠️ **NOT recommended for production**)

### For Private Access (Production - Recommended)

1. **RDS Security Group**
   - Allow inbound PostgreSQL (port 5432)
   - **Source**: Your application's security group (e.g., `sg-yyyyyyyyy`)

2. **Application Security Group**
   - Allow outbound to RDS security group on port 5432

**Example:**
- RDS SG (`sg-xxxxx`): Inbound from `sg-yyyyy` on port 5432
- App SG (`sg-yyyyy`): Outbound to `sg-xxxxx` on port 5432

## Step 3: Get Connection Information

After your RDS instance is available:

1. **Endpoint**
   - Go to RDS → Databases → Your DB
   - Under "Connectivity & Security"
   - Note the **Endpoint** (e.g., `adlc-emergency-db.xxxxx.us-east-1.rds.amazonaws.com`)
   - Note the **Port** (default: 5432)

2. **Database Name**: `adlc_emergency` (or what you specified)

3. **Username**: The master username you set

4. **Password**: The master password you set

## Step 4: Update Application Configuration

### Update `backend/.env`

```env
# AWS RDS PostgreSQL Connection
DATABASE_URL=postgresql://postgres:YourSecurePassword@adlc-emergency-db.xxxxx.us-east-1.rds.amazonaws.com:5432/adlc_emergency

# Alternative format (individual components):
# DB_HOST=adlc-emergency-db.xxxxx.us-east-1.rds.amazonaws.com
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=YourSecurePassword
# DB_DATABASE=adlc_emergency
```

**Connection String Format:**
```
postgresql://[username]:[password]@[endpoint]:[port]/[database]
```

### Example with Environment Variables

```env
DB_HOST=adlc-emergency-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YourSecurePassword123!
DB_DATABASE=adlc_emergency

# Construct DATABASE_URL if not using direct connection string
# DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}
```

## Step 5: Update data-source.ts (if using individual variables)

If you prefer using individual environment variables instead of DATABASE_URL:

```typescript
export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT') || '5432'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});
```

## Step 6: Test Connection

### Option A: Using psql (if installed)

```bash
psql -h adlc-emergency-db.xxxxx.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d adlc_emergency \
     -p 5432
```

### Option B: From Application

```bash
cd backend
npm run start:dev
```

Check logs for successful database connection.

### Option C: Using AWS RDS Query Editor (Beta)

1. Go to RDS → Query Editor
2. Select your database
3. Connect and run test query: `SELECT version();`

## Step 7: Run Migrations

Once connected, run your database migrations:

```bash
cd backend
npm run migration:run
```

This will create all necessary tables based on your entities.

## Security Best Practices

### 1. **Use Secrets Manager (Recommended)**

Store database credentials in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name adlc-emergency-db-credentials \
  --secret-string '{"username":"postgres","password":"YourPassword"}'
```

Then use AWS SDK to retrieve in your application.

### 2. **Use Parameter Store (Alternative)**

```bash
aws ssm put-parameter \
  --name /adlc/database/password \
  --value "YourPassword" \
  --type SecureString
```

### 3. **Enable SSL/TLS**

Update your connection string to require SSL:

```env
DATABASE_URL=postgresql://postgres:password@endpoint:5432/adlc_emergency?sslmode=require
```

### 4. **Network Isolation**

- Use private subnets for production RDS
- Don't enable public access for production
- Use VPC peering or AWS PrivateLink for cross-account access

### 5. **Regular Backups**

- Enable automated backups (default: 7 days)
- Test restore procedures regularly
- Consider point-in-time recovery for critical data

### 6. **IAM Database Authentication (Optional)**

For additional security, enable IAM authentication:

1. Enable IAM authentication on RDS instance
2. Generate IAM auth token
3. Update connection string to use IAM token

## Connection Pooling (Production)

For production, consider using a connection pooler:

### AWS RDS Proxy (Recommended)

1. Create RDS Proxy in AWS Console
2. Attach to your RDS instance
3. Update DATABASE_URL to use proxy endpoint

### PgBouncer (Self-hosted)

Alternatively, use PgBouncer for connection pooling.

## Monitoring

### CloudWatch Metrics

Monitor key metrics:
- `CPUUtilization`
- `DatabaseConnections`
- `FreeStorageSpace`
- `ReadLatency` / `WriteLatency`

### Enable Performance Insights

1. Go to RDS → Your DB → Configuration
2. Enable Performance Insights
3. Review performance data in CloudWatch

## Cost Optimization

1. **Use Reserved Instances** for long-running production workloads
2. **Stop instances** during non-business hours for dev/test
3. **Right-size instances** based on actual usage
4. **Use Aurora** if you need serverless/scaling (separate setup)

## Troubleshooting

### Connection Timeout

- Check security group rules
- Verify VPC configuration
- Check if public access is enabled (if connecting from outside AWS)

### Authentication Failed

- Verify username/password
- Check IAM authentication settings
- Ensure credentials are correct in .env

### Database Not Found

- Verify database name exists
- Check initial database name setting
- Create database manually if needed:
  ```sql
  CREATE DATABASE adlc_emergency;
  ```

### SSL Connection Required

Add SSL mode to connection string:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

## Migration from Local Database

1. Export local database:
   ```bash
   pg_dump -U postgres adlc_emergency > backup.sql
   ```

2. Import to RDS:
   ```bash
   psql -h rds-endpoint -U postgres -d adlc_emergency < backup.sql
   ```

3. Update application configuration
4. Test thoroughly

## Next Steps

1. Set up automated backups
2. Configure monitoring alerts
3. Enable encryption at rest
4. Set up read replicas (if needed for scaling)
5. Document connection procedures for team


