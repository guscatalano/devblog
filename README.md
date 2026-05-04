# Gus Catalano's Blog

A modern, technical blog powered by VitePress with support for categories, code snippets, and images.

[View the Blog](https://guscatalano.github.io/devblog/)

## Features

- **Category-based organization** - Posts organized by C#, .NET, JavaScript, DevOps
- **Syntax highlighting** - Beautiful code display with line numbers
- **Image support** - Easy image embedding from `docs/assets/images/`
- **Frontmatter metadata** - Tags, categories, and descriptions for each post

## Quick Start

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Structure

```
blog/
├── docs/
│   ├── posts/              # Blog posts
│   │   ├── csharp/         # C# posts
│   │   ├── net/            # .NET posts
│   │   ├── javascript/     # JavaScript posts
│   │   ├── devops/         # DevOps posts
│   │   └── tutorials.md    # Tutorial index
│   ├── assets/
│   │   └── images/         # Images for posts
│   ├── categories.md       # Category listing
│   ├── index.md            # Homepage
│   └── about.md            # About page
├── .vitepress/             # VitePress config
├── package.json
└── README.md
```

## Adding a New Post

1. Create a new `.md` file in the appropriate category folder
2. Add frontmatter with title, date, category, and tags
3. Write your content with Markdown and code blocks
4. Reference images from `docs/assets/images/`

## License

MIT
