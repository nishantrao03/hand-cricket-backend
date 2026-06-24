// Import the NEW paginated tool
const fetchPaginatedMatchHistory = require("../tools/fetchPaginatedMatchHistory");

async function runPaginationTest() {
    console.log("=== Starting Pagination DB Test ===\n");

    // Replace this with a real user ID from your Neon database
    const testUserId = "evsth9VTpIPVfC86awHp1f2ddeh2"; 

    try {
        console.log(`[Step 1] Fetching the first 5 matches for user: ${testUserId}`);
        
        const firstBatch = await fetchPaginatedMatchHistory({
            userId: testUserId,
            limit: 5,
            sortOrder: "desc",
            cursor: null // No bookmark for the first request
        });

        console.log("\n--- First Batch Results ---");
        console.log(`Matches received: ${firstBatch.matches.length}`);
        
        if (firstBatch.matches.length > 0) {
            console.log(`First match ID: ${firstBatch.matches[0].id}`);
            console.log(`Last match ID: ${firstBatch.matches[firstBatch.matches.length - 1].id}`);
        }
        console.log(`Next Cursor generated: ${firstBatch.nextCursor}`);
        
        // If the database generated a bookmark, let's test the "Load More" functionality
        if (firstBatch.nextCursor) {
            console.log("\n[Step 2] Simulating 'Load More' click using the cursor...");
            
            const secondBatch = await fetchPaginatedMatchHistory({
                userId: testUserId,
                limit: 5,
                sortOrder: "desc",
                cursor: firstBatch.nextCursor // Pass the bookmark here!
            });

            console.log("\n--- Second Batch Results ---");
            console.log(`Matches received: ${secondBatch.matches.length}`);
            
            if (secondBatch.matches.length > 0) {
                console.log(`First match ID: ${secondBatch.matches[0].id}`);
            }
            console.log(`New Next Cursor generated: ${secondBatch.nextCursor}`);
        } else {
            console.log("\nNot enough matches in the database to test the next page.");
        }

    } catch (error) {
        console.error("Pagination test failed with error:", error);
    } finally {
        console.log("\n=== Test Complete ===");
        process.exit(0);
    }
}

// Execute the test
runPaginationTest();