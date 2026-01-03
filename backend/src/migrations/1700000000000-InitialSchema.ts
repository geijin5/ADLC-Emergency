import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('admin', 'dispatch', 'emergency_services', 'search_rescue');
      CREATE TYPE "alert_category_enum" AS ENUM ('emergency_alert', 'road_closure', 'detour', 'parade_route', 'area_closure', 'search_rescue', 'advisory');
      CREATE TYPE "alert_priority_enum" AS ENUM ('low', 'medium', 'high', 'critical');
      CREATE TYPE "alert_target_enum" AS ENUM ('public', 'personnel', 'both');
      CREATE TYPE "acknowledgment_status_enum" AS ENUM ('received', 'responding', 'unavailable');
      CREATE TYPE "map_feature_type_enum" AS ENUM ('road_closure', 'detour', 'parade_route', 'area_closure', 'sar_operational_area');
      CREATE TYPE "map_feature_visibility_enum" AS ENUM ('public', 'personnel');
      CREATE TYPE "chat_channel_type_enum" AS ENUM ('direct', 'group', 'incident');
      CREATE TYPE "sar_operation_type_enum" AS ENUM ('mission', 'training');
      CREATE TYPE "sar_operation_status_enum" AS ENUM ('active', 'standby', 'cleared');
      CREATE TYPE "audit_action_enum" AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'publish', 'acknowledge');
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "phoneNumber" varchar,
        "role" user_role_enum NOT NULL DEFAULT 'emergency_services',
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLoginAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
      CREATE INDEX "IDX_users_email" ON "users" ("email");
    `);

    // Create alerts table
    await queryRunner.query(`
      CREATE TABLE "alerts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "message" text NOT NULL,
        "category" alert_category_enum NOT NULL,
        "priority" alert_priority_enum NOT NULL DEFAULT 'medium',
        "target" alert_target_enum NOT NULL DEFAULT 'public',
        "isActive" boolean NOT NULL DEFAULT true,
        "scheduledFor" timestamp,
        "expiresAt" timestamp,
        "isPublished" boolean NOT NULL DEFAULT false,
        "publishedAt" timestamp,
        "createdById" uuid NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_alerts_createdBy" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_alerts_isActive_target" ON "alerts" ("isActive", "target");
      CREATE INDEX "IDX_alerts_scheduledFor" ON "alerts" ("scheduledFor");
    `);

    // Create alert_acknowledgments table
    await queryRunner.query(`
      CREATE TABLE "alert_acknowledgments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "alertId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "status" acknowledgment_status_enum NOT NULL DEFAULT 'received',
        "acknowledgedAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_alert_acknowledgments_alert" FOREIGN KEY ("alertId") REFERENCES "alerts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_alert_acknowledgments_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_alert_acknowledgments_alert_user" UNIQUE ("alertId", "userId")
      );
      CREATE INDEX "IDX_alert_acknowledgments_alertId" ON "alert_acknowledgments" ("alertId");
    `);

    // Create map_features table
    await queryRunner.query(`
      CREATE TABLE "map_features" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "type" map_feature_type_enum NOT NULL,
        "visibility" map_feature_visibility_enum NOT NULL DEFAULT 'public',
        "geometry" jsonb NOT NULL,
        "description" text,
        "incidentId" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "startTime" timestamp,
        "endTime" timestamp,
        "createdById" uuid NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_map_features_createdBy" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_map_features_type_isActive" ON "map_features" ("type", "isActive");
      CREATE INDEX "IDX_map_features_visibility" ON "map_features" ("visibility");
    `);

    // Create chat_messages table
    await queryRunner.query(`
      CREATE TABLE "chat_messages" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "senderId" uuid NOT NULL,
        "channelType" chat_channel_type_enum NOT NULL DEFAULT 'direct',
        "channelId" varchar NOT NULL,
        "message" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "readAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_chat_messages_sender" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_chat_messages_channel" ON "chat_messages" ("channelType", "channelId");
      CREATE INDEX "IDX_chat_messages_createdAt" ON "chat_messages" ("createdAt");
    `);

    // Create sar_operations table
    await queryRunner.query(`
      CREATE TABLE "sar_operations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "type" sar_operation_type_enum NOT NULL DEFAULT 'mission',
        "status" sar_operation_status_enum NOT NULL DEFAULT 'active',
        "operationalPerimeter" jsonb,
        "isPublicVisible" boolean NOT NULL DEFAULT false,
        "publicDescription" text,
        "internalNotes" text,
        "createdById" uuid NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_sar_operations_createdBy" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_sar_operations_type_status" ON "sar_operations" ("type", "status");
      CREATE INDEX "IDX_sar_operations_isPublicVisible" ON "sar_operations" ("isPublicVisible");
    `);

    // Create sar_routes table
    await queryRunner.query(`
      CREATE TABLE "sar_routes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "operationId" uuid NOT NULL,
        "name" varchar NOT NULL,
        "geometry" jsonb NOT NULL,
        "description" text,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_sar_routes_operation" FOREIGN KEY ("operationId") REFERENCES "sar_operations"("id") ON DELETE CASCADE
      );
      CREATE INDEX "IDX_sar_routes_operationId" ON "sar_routes" ("operationId");
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "action" audit_action_enum NOT NULL,
        "entityType" varchar NOT NULL,
        "entityId" varchar NOT NULL,
        "changes" jsonb,
        "description" text,
        "ipAddress" varchar,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_audit_logs_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      );
      CREATE INDEX "IDX_audit_logs_userId" ON "audit_logs" ("userId");
      CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entityType", "entityId");
      CREATE INDEX "IDX_audit_logs_createdAt" ON "audit_logs" ("createdAt");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sar_routes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sar_operations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "map_features"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "alert_acknowledgments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "alerts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_action_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "sar_operation_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "sar_operation_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "chat_channel_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "map_feature_visibility_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "map_feature_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "acknowledgment_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "alert_target_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "alert_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "alert_category_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}

