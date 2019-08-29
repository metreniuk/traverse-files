const parser = require('@babel/parser');
const recursive = require('recursive-readdir');
const traverse = require('@babel/traverse').default;
const fs = require('fs-extra');

async function run() {
  const fileNames = await recursive('./package/src/components', [
    '*.scss',
    '*.html',
    '*.md',
    '*.spec.js',
    '*.stories.js',
    '*index.js',
  ]);

  const resolvedFiles = await Promise.all(
    fileNames.map(f => fs.readFile(f, 'utf-8'))
  );

  resolvedFiles.forEach((file, i) => {
    const ast = parser.parse(file, {
      sourceType: 'module',
      plugins: ['jsx', 'flow'],
    });

    traverse(ast, {
      JSXText(path) {
        const trimmed = path.node.value.trim();
        if (!trimmed) return;

        console.log(fileNames[i] + ' | ' + trimmed);
      },
    });
  });
}

run();

