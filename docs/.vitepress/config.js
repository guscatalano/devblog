export default {
  title: 'Gus Catalano',
  description: 'Developer, creator, and tech enthusiast',
  base: '/',
  appearance: 'force-dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts/level1-kvm-control' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: 'Posts',
          items: [
            { text: 'Controlling a Level1Techs KVM From Anywhere on My LAN', link: '/posts/level1-kvm-control' },
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
