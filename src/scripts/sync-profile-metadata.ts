import "reflect-metadata";
import { DbConnections } from "../core/DB/postgresdb";
import { ProfileMetadataSyncService } from "../core/services/profileMetadataSync.service";

async function main(): Promise<void> {
  await DbConnections.AppDbConnection.initialize();
  const syncService = new ProfileMetadataSyncService();
  const result = await syncService.syncObjectAndTabCatalogFromSchema();
  console.log("Profile metadata sync result:");
  console.log(JSON.stringify(result, null, 2));
  await DbConnections.AppDbConnection.close();
}

main()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Profile metadata sync failed:", error);
    try {
      await DbConnections.AppDbConnection.close();
    } catch (_err) {
      // ignore close errors
    }
    process.exit(1);
  });
