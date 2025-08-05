export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Target browsers for better compatibility
      overrideBrowserslist: [
        'Chrome >= 60',
        'Firefox >= 60',
        'Safari >= 12',
        'Edge >= 79',
        'iOS >= 12',
        'Android >= 7'
      ],
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
  },
}
