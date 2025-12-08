import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function reset() {
  try {
    console.log("🔄 Resetting database...");
    
    // Obtener todas las tablas
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    const tables = result.rows.map((row) => row.tablename);
    
    if (tables.length === 0) {
      console.log("✅ No tables to drop");
      return;
    }
    
    // Deshabilitar temporalmente las foreign keys
    await pool.query("SET session_replication_role = 'replica';");
    
    // Eliminar todas las tablas (incluyendo tablas de migraciones)
    for (const table of tables) {
      console.log(`  Dropping table: ${table}`);
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    }
    
    // Rehabilitar foreign keys
    await pool.query("SET session_replication_role = 'origin';");
    
    console.log("✅ Database reset complete!");
    console.log("💡 Run 'bun run db:push' or 'bun run db:migrate' to apply schema");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

reset();

