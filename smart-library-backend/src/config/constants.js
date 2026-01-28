// Hardcoded book repository as per requirements
exports.PREDEFINED_BOOKS = [
  { id: "B001", title: "The Great Gatsby", author: "F. Scott Fitzgerald", pricePerDay: 2, groupPricePerDay: 1.5 },
  { id: "B002", title: "To Kill a Mockingbird", author: "Harper Lee", pricePerDay: 3, groupPricePerDay: 2 },
  { id: "B003", title: "1984", author: "George Orwell", pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { id: "B004", title: "Pride and Prejudice", author: "Jane Austen", pricePerDay: 2, groupPricePerDay: 1.5 },
  { id: "B005", title: "The Catcher in the Rye", author: "J.D. Salinger", pricePerDay: 3, groupPricePerDay: 2.2 },
  { id: "B006", title: "Lord of the Flies", author: "William Golding", pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { id: "B007", title: "The Hobbit", author: "J.R.R. Tolkien", pricePerDay: 3.5, groupPricePerDay: 2.5 },
  { id: "B008", title: "Fahrenheit 451", author: "Ray Bradbury", pricePerDay: 2, groupPricePerDay: 1.5 },
  { id: "B009", title: "Moby Dick", author: "Herman Melville", pricePerDay: 4, groupPricePerDay: 3 },
  { id: "B010", title: "War and Peace", author: "Leo Tolstoy", pricePerDay: 5, groupPricePerDay: 3.5 },
  { id: "B011", title: "The Odyssey", author: "Homer", pricePerDay: 3, groupPricePerDay: 2 },
  { id: "B012", title: "Ulysses", author: "James Joyce", pricePerDay: 4.5, groupPricePerDay: 3.2 },
  { id: "B013", title: "The Divine Comedy", author: "Dante Alighieri", pricePerDay: 3.5, groupPricePerDay: 2.5 },
  { id: "B014", title: "Madame Bovary", author: "Gustave Flaubert", pricePerDay: 3, groupPricePerDay: 2 },
  { id: "B015", title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", pricePerDay: 4, groupPricePerDay: 3 },
  { id: "B016", title: "Don Quixote", author: "Miguel de Cervantes", pricePerDay: 3.5, groupPricePerDay: 2.5 },
  { id: "B017", title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", pricePerDay: 3, groupPricePerDay: 2.2 },
  { id: "B018", title: "The Iliad", author: "Homer", pricePerDay: 3, groupPricePerDay: 2 },
  { id: "B019", title: "Lolita", author: "Vladimir Nabokov", pricePerDay: 2.5, groupPricePerDay: 1.8 },
  { id: "B020", title: "Catch-22", author: "Joseph Heller", pricePerDay: 2, groupPricePerDay: 1.5 }
];

exports.BORROW_LIMITS = {
  MAX_DAYS: 14,
  OVERDUE_FEE_PER_DAY: 1,
  MAX_BOOKS_PER_USER: 1
};