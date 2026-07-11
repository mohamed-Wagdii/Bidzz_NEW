export function buildAuctionDocument(auction, product, seller) {
  return `
Auction Information:
Title: ${product?.name || "Unknown Product"}
Description: ${product?.description || "No description available"}
Seller: ${seller?.fullName || "Unknown Seller"}
Starting Price: $${auction.startingPrice} USD
Status: ${auction.status}
Start Time: ${new Date(auction.startTime).toLocaleString()}
End Time: ${new Date(auction.endTime).toLocaleString()}
Number of Participants: ${auction.participants?.length || 0}
`.trim();
}
