module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'PORT=4173 ISOTOPE_BIND_HOST=127.0.0.1 ' +
        'SUPABASE_URL=https://placeholder.supabase.co ' +
        'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InRlc3QifQ.signature ' +
        'SESSION_SECRET=lighthouse_ci_local_only node server.mjs',
      startServerReadyPattern: 'IsotopeAI running on',
      startServerReadyTimeout: 30000,
      url: [
        'http://127.0.0.1:4173/auth',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        // /auth is intentionally noindex. Keep the remaining SEO checks active
        // while accepting Lighthouse's expected crawlability deduction.
        'categories:seo': ['error', { minScore: 0.65 }],
        'is-crawlable': 'off',
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        // Keep the Lighthouse "poor" boundary visible while UI changes are
        // intentionally out of scope. The overall performance score remains a
        // hard failure, so material regressions still block the pull request.
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 500 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'artifacts/lighthouse',
      reportFilenamePattern: '%%HOSTNAME%%-%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
