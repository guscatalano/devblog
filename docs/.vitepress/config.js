export default {
  title: 'Gus Catalano',
  description: 'Developer, creator, and tech enthusiast',
  base: '/devblog/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/' },
      { text: 'Categories', link: '/categories' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: 'Posts',
          items: [
            { text: 'Welcome', link: '/posts/welcome' }
          ]
        }
      ],
      '/posts/csharp/': [
        {
          text: 'C# / .NET Posts',
          items: [
            { text: 'C# 12 Features', link: '/posts/csharp/csharp12-features' }
          ]
        }
      ],
      '/posts/net/': [
        {
          text: '.NET Posts',
          items: [
            { text: '.NET 8 Performance', link: '/posts/net/net8-performance' }
          ]
        }
      ],
      '/posts/javascript/': [
        {
          text: 'JavaScript Posts',
          items: [
            { text: 'ES2024 Highlights', link: '/posts/javascript/es2024-highlights' }
          ]
        }
      ],
      '/posts/devops/': [
        {
          text: 'DevOps Posts',
          items: [
            { text: 'Azure DevOps Pipelines', link: '/posts/devops/azure-devops-pipelines' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/guscatalano' },
      { icon: 'twitter', link: 'https://twitter.com/guscatalano' }
    ],
    footer: {
      message: '© 2026 Gus Catalano',
      copyright: 'All rights reserved'
    }
  },
  darkMode: true,
  theme: {
    default: 'dark'
  }
}
