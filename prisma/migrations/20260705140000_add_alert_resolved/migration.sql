-- Adds a treatment-status workflow to alerts, distinct from `sent`
-- (which only tracks whether the notification email went out).
ALTER TABLE "alerts" ADD COLUMN "resolved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "alerts" ADD COLUMN "resolvedAt" TIMESTAMP(3);

CREATE INDEX "alerts_warehouseId_resolved_idx" ON "alerts"("warehouseId", "resolved");
