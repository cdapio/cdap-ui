function camelCaseToHyphenated(s) {
  let out = '';
  for (const ch of s) {
    if (/^[A-Z]$/.test(ch)) {
      out = out + '-' + ch.toLowerCase();
    } else {
      out = out + ch;
    }
  }

  return out;
}

function getCodeFragment(file, node) {
  return file.content.slice(node.start, node.end);
}

module.exports = {
  camelCaseToHyphenated,
  getCodeFragment,
};
