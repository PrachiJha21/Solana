import { storage } from "./storage";

export async function seedDatabase() {
  const suggestions = await storage.getSuggestions();
  if (suggestions.length === 0) {
    // Manually inserting with pubkey since we use the storage methods which usually generate it,
    // but here we might want to be explicit or just let the storage handle it.
    // Actually, storage.createSuggestion now handles pubkey generation, so we can just call it.
    
    await storage.createSuggestion({
      author: "MockWalletAddress1",
      title: "Extend Library Hours",
      description: "We need the library to be open until midnight during exam week.",
      category: "academics",
    });
    await storage.createSuggestion({
      author: "MockWalletAddress2",
      title: "Fix Gym Equipment",
      description: "The treadmill in the campus gym has been broken for weeks.",
      category: "infrastructure",
    });
  }

  const notes = await storage.getNotes();
  if (notes.length === 0) {
    await storage.createNote({
      author: "MockWalletAddress1",
      subject: "CS101",
      title: "Introduction to Algorithms",
      ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    });
    await storage.createNote({
      author: "MockWalletAddress3",
      subject: "MATH202",
      title: "Calculus II Midterm Review",
      ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    });
  }

  const requests = await storage.getRequests();
  if (requests.length === 0) {
    await storage.createRequest({
      author: "MockWalletAddress2",
      subject: "PHYS101",
      description: "Looking for notes on Quantum Mechanics basics.",
    });
  }
}
