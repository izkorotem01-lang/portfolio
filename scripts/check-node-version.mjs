const MIN_20 = [20, 19, 1];
const MIN_22 = [22, 12, 0];

const parse = (version) =>
  version.replace(/^v/, "").split(".").map((part) => Number(part));

const compare = (a, b) => {
  for (let i = 0; i < 3; i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const isSupported = (version) => {
  const parts = parse(version);
  const major = parts[0];

  if (major === 20) return compare(parts, MIN_20) >= 0;
  if (major === 21) return true;
  if (major === 22) return compare(parts, MIN_22) >= 0;
  return major > 22;
};

const current = process.version;

if (!isSupported(current)) {
  console.error(
    `\nNode ${current} is not supported. Sanity requires Node >=20.19.1 <22 or >=22.12.\n` +
      `This project uses Node 22.16.0 (see .nvmrc).\n\n` +
      `Fix once:\n` +
      `  fnm install 22.16.0 && fnm default 22.16.0\n` +
      `  — or —\n` +
      `  nvm install 22.16.0 && nvm use 22.16.0\n`
  );
  process.exit(1);
}
