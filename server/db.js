/* eslint-disable @typescript-eslint/no-require-imports */
// Import PostgreSQL client
const postgres = require("postgres");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize PostgreSQL client
const connectionString = process.env.DATABASE_URL;

// Validate environment variables
if (!connectionString) {
  console.error("Missing DATABASE_URL in environment variables");
  process.exit(1);
}

const sql = postgres(connectionString);

/**
 * Get all summary records
 * @returns {Promise<Array>} Array of summary records
 */
async function getAllSummaries() {
  try {
    const summaries = await sql`
      SELECT * FROM "Summary"
      ORDER BY "createdAt" DESC
    `;
    return summaries;
  } catch (error) {
    console.error("Error fetching summaries:", error);
    throw error;
  }
}

/**
 * Get a summary by ID
 * @param {string} id - The summary ID
 * @returns {Promise<Object>} Summary record
 */
async function getSummaryById(id) {
  try {
    const [summary] = await sql`
      SELECT * FROM "Summary"
      WHERE id = ${id}
    `;
    return summary;
  } catch (error) {
    console.error(`Error fetching summary with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new summary
 * @param {Object} summaryData - The summary data to insert
 * @returns {Promise<Object>} Created summary record
 */
async function createSummary(summaryData) {
  try {
    // Create dynamic SQL query
    const [newSummary] = await sql`
      INSERT INTO "Summary" ${sql(summaryData)}
      RETURNING *
    `;

    return newSummary;
  } catch (error) {
    console.error("Error creating summary:", error);
    throw error;
  }
}

module.exports = {
  sql,
  getAllSummaries,
  getSummaryById,
  createSummary,
};
