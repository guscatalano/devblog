export default {
  title: 'Gus Catalano',
  description: 'Developer, creator, and tech enthusiast',
  base: '/devblog/',
  appearance: 'force-dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/welcome' },
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
  }
}
