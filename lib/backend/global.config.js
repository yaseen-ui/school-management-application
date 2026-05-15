const resolveWithExt = (alias) => {
  const paths = [".js", ".mjs", ".ts", "/index.js"].map(
    (ext) => `${alias}${ext}`
  );
  return paths.find((p) => fs.existsSync(path.resolve(p))) || alias;
};

global.alias = resolveWithExt; // Now use `alias('@src/myFile')`
