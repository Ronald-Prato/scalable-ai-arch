/* eslint-disable @typescript-eslint/no-require-imports */
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const { sql } = require("./db");

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Check if a column exists in a table
 * @param {string} tableName - The name of the table
 * @param {string} columnName - The name of the column
 * @returns {Promise<boolean>} Whether the column exists
 */
async function checkColumnExists(tableName, columnName) {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND column_name = ${columnName.toLowerCase()}
      ) as exists
    `;
    return result[0]?.exists || false;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists:`, error);
    return false;
  }
}

/**
 * Generate a summary using OpenAI and update the database record
 * @param {string} text - The text to summarize
 * @param {string} summaryId - The ID of the summary record to update
 * @returns {Promise<Object>} Updated summary record
 */
async function generateSummary(text, summaryId) {
  try {
    if (!text || !summaryId) {
      throw new Error("Text and summaryId are required");
    }

    // First, update the status to PENDING (using the correct enum value)
    await sql`
      UPDATE "Summary"
      SET status = 'PENDING'
      WHERE id = ${summaryId}
    `;

    // Create the prompt for OpenAI
    const promptTranca = `
      Necesito que hagas un resumen de la siguiente entrada:
      ${text}

      Sigue la siguiente estructura:
      Resumen:
      [resumen]

      Puntos clave:
      [puntos clave]

      Formato html, usa negritas, cursivas, listas, etc para que el resumen sea más legible. (nada de colores)
      estiliza el texto con inner css para que los título (resumen y puntos clave) sean más visibles.
    `;

    // Call OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en hacer resúmenes detallados pero cortos.",
        },
        { role: "user", content: promptTranca },
      ],
      model: "gpt-3.5-turbo",
    });

    // Get the response from OpenAI
    const aiResponse = chatCompletion.choices[0].message.content;

    // Update the summary in the database (using the correct table name and enum value)
    const [updatedSummary] = await sql`
      UPDATE "Summary"
      SET 
        summary = ${aiResponse},
        status = 'GENERATED'
        ${sql`${
          // Check if generatedAt column exists before trying to update it
          (await checkColumnExists("Summary", "generatedAt"))
            ? sql`, generatedAt = NOW()`
            : sql``
        }`}
      WHERE id = ${summaryId}
      RETURNING *
    `;

    console.log(`Summary generated and updated for ID: ${summaryId}`);
    return updatedSummary;
  } catch (error) {
    console.error("Error generating summary:", error);

    // Update the status to ERROR (using the correct table name and enum value)
    try {
      await sql`
        UPDATE "Summary"
        SET status = 'ERROR'
        WHERE id = ${summaryId}
      `;
    } catch (dbError) {
      console.error("Error updating summary status:", dbError);
    }

    throw error;
  }
}

module.exports = {
  generateSummary,
};
