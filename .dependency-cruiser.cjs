/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      path: "node_modules",
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg",
      ],
    },
    includeOnly: "^src",
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "./tsconfig.json",
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
        theme: {
          graph: { rankdir: "LR" },
          modules: [
            {
              criteria: { source: "\\.(js|ts|jsx|tsx)$" },
              attributes: { shape: "box" },
            },
          ],
          dependencies: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { color: "red", fontcolor: "red" },
            },
          ],
        },
      },
    },
  },
};
