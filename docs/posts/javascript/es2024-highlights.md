---
title: "Modern JavaScript: ES2024 Highlights"
date: 2026-05-03
category: javascript
tags: [javascript, es2024, features]
description: "New features in the latest JavaScript specification"
---

# Modern JavaScript: ES2024 Highlights

JavaScript continues to evolve with powerful new features.

## Array.toSorted()

Non-mutating sort method:

```javascript
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.toSorted((a, b) => a - b);
console.log(sorted); // [1, 1, 3, 4, 5]
console.log(numbers); // [3, 1, 4, 1, 5] (unchanged)
```

![JavaScript Logo](../assets/images/js-logo.png)

## Object.groupBy()

Group array items by a property:

```javascript
const people = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 }
];

const grouped = Object.groupBy(people, person => person.age);
console.log(grouped);
// { 30: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], 25: [{ name: 'Bob', ... }] }
```

## Promise.withResolvers()

Create promises with external resolve/reject:

```javascript
const { promise, resolve, reject } = Promise.withResolvers();

fetch('/api/data')
  .then(response => resolve(response))
  .catch(error => reject(error));

// Later in your code
const result = await promise;
```

## Conclusion

JavaScript keeps getting better with each specification update. These features make code more readable and maintainable.

---

**Need help?** See our [Tutorials](/posts/tutorials) for JavaScript guides!
