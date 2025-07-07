/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      comment:
        "This is an orphan module - it's likely not used (anymore?). Either use it or " +
        "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
        "add an exception for it in your dependency-cruiser configuration. By default " +
        "this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration " +
        "files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$',
          '[.]d[.]ts$',
          '(^|/)tsconfig[.]json$',
          '(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$'
        ]
      },
      to: {},
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment:
        "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
        "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
        "available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
        "in your package.json.",
      from: {},
      to: {
        dependencyTypes: [
          'npm-no-pkg',
          'npm-unknown'
        ]
      }
    },
    {
      name: 'not-to-unresolvable',
      comment:
        "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
        'module: add it to your package.json. In all other cases you likely already know what to do.',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true
      }
    },
    {
      name: 'no-duplicate-dep-types',
      comment:
        "Likely this module depends on an external ('npm') package that occurs more than once " +
        "in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
        "maintenance problems later on.",
      severity: 'warn',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"]
      }
    },
    {
      name: 'not-to-spec',
      comment:
        'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +
        "If there's something in a spec that's of use to other modules, it doesn't have that single " +
        'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',
      severity: 'error',
      from: {},
      to: {
        path: '[.](?:spec|int-spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      }
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        "This module depends on an npm package from the 'devDependencies' section of your " +
        'package.json. It looks like something that ships to production, though. To prevent problems ' +
        "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
        'section of your package.json. If this module is development only - add it to the ' +
        'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',
      from: {
        path: '^(apps)',
        pathNot: [
          '[.](?:spec|int-spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
          '(^|/)test/.*'
        ]
      },
      to: {
        dependencyTypes: [
          'npm-dev',
        ],
        dependencyTypesNot: [
          'type-only'
        ],
        pathNot: [
          'node_modules/@types/'
        ]
      }
    },
    {
      name: "only-modules-folder-imports",
      comment: "modules.module.ts can only import actual folders from src/modules/",
      severity: "error",
      from: {
        path: ".*/src/modules/modules\\.module\\.ts$"
      },
      to: {
        pathNot: [
          ".*/src/modules/[^/]+/[^/]*\\.module\\.ts$",
          "node_modules"
        ]
      }
    },
    {
      name: "no-direct-repository-access",
      comment: "This module should not access the repository directly. Use the repository interface.",
      severity: "error",
      from: {
        path: ".*/src/modules/[^/]+/.*\\.service\\.ts$",
      },
      to: {
        path: ".*/repository/.*\\.ts$",
        pathNot: ".*\\.interface\\.ts$"
      }
    },
  ],
  allowed: [],
  required: [],
  options: {
    doNotFollow: {
      path: ['node_modules']
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["main", "types", "typings"],
    },
    skipAnalysisNotInRules: true,
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern: '^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
      "text": {
        "highlightFocused": true
      },
    }
  }
};
