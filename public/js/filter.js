document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".filter"); // Get all filter buttons

    filters.forEach(filter => {
        filter.addEventListener("click", async () => {
            let category = filter.dataset.category?.trim(); // Get category name safely
            console.log("Selected Category:", category); // Debugging

            if (!category) {
                console.error("No category found for:", filter);
                return;
            }

            try {
                let response = await fetch(`/listings/filter?category=${encodeURIComponent(category)}`);
                let data = await response.json();

                console.log("Filtered Listings:", data); // Debugging
                updateListings(data); // Ensure function is defined
            } catch (error) {
                console.error("Error fetching filtered listings:", error);
            }
        });
    });

    // ✅ ✅ ✅  Yeh function yahi add karo ✅ ✅ ✅
    function updateListings(listings) {
        let listingsContainer = document.getElementById("listings-container");
        listingsContainer.innerHTML = ""; // Purane listings hatao

        if (listings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings found.</p>";
            return;
        }

        listings.forEach(listing => {
            let listingDiv = document.createElement("div");
            listingDiv.classList.add("listing");
            listingDiv.innerHTML = `
                <a href="/listings/${listing._id}" class="listing-link">
                    <div class="card col listing-card" style="width: 20rem">
                        <img src="${listing.image.url}" class="card-img-top" alt="Listing_image" style="height: 20rem">
                        <div class="card-body">
                            <p class="card-text">
                                <b>${listing.title}</b><br>
                                ₹ ${listing.price.toLocaleString("en-IN")} /Night
                                <i class="tax-info"> &nbsp; &nbsp; +18% GST</i>
                            </p>
                        </div>
                    </div>
                </a>
            `;
            listingsContainer.appendChild(listingDiv);
        });
    }
});
