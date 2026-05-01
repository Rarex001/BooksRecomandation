// recommender.js — your bigram logic ported to JavaScript

function recommend(lastBook, alreadyRead = [], temperature = 2.0) {
    let candidates = BIGRAMS[lastBook];

    // Book not in model — pick random start
    if (!candidates) {
        console.log(`'${lastBook}' not in model — picking random`);
        lastBook   = ALL_BOOKS[Math.floor(Math.random() * ALL_BOOKS.length)];
        candidates = BIGRAMS[lastBook];
    }

    // Filter out already read books
    const alreadyReadSet = new Set(alreadyRead);
    const filtered = Object.fromEntries(
        Object.entries(candidates).filter(([book]) => !alreadyReadSet.has(book))
    );

    // If nothing left, pick fully random
    const remaining = Object.keys(filtered);
    if (remaining.length === 0) {
        const allUnread = ALL_BOOKS.filter(b => !alreadyReadSet.has(b));
        return allUnread[Math.floor(Math.random() * allUnread.length)];
    }

    // Apply temperature to weights
    const books   = Object.keys(filtered);
    const weights = Object.values(filtered).map(w => Math.pow(w, 1.0 / temperature));
    const total   = weights.reduce((a, b) => a + b, 0);

    // Weighted random pick
    let rand = Math.random() * total;
    for (let i = 0; i < books.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return books[i];
    }
    return books[books.length - 1];
}
