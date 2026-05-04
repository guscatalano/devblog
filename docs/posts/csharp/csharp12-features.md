---
title: "C# 12: New Features You'll Love"
date: 2026-05-03
category: csharp
tags: [csharp12, .net8, features]
description: "Deep dive into C# 12 language features"
---

# C# 12: New Features You'll Love

C# 12 brings some amazing new features that make coding more expressive and efficient.

## Collection Expressions

Collection expressions make it easier to work with collections:

```csharp
var numbers = [1, 2, 3, 4, 5];
var moreNumbers = [.. numbers, 6, 7, 8];
```

![Collection Expressions](../assets/images/csharp-collections.png)

## Default Lambdas

Default parameters for lambda expressions:

```csharp
Func<int, int> add = (x, y = 10) => x + y;
Console.WriteLine(add(5)); // Output: 15
```

## File-Local Types

Type visibility limited to the file:

```csharp
file class InternalHelper
{
    public static void HelperMethod() { }
}
```

## Conclusion

C# 12 continues to make the language more powerful and expressive. These features will help you write cleaner, more maintainable code.

---

**Next Steps**: Check out our [Tutorials](/posts/tutorials) section for more C# guides!
