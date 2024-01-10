function getFileType (file) {
  return '';
}

function isJs(file) {
  return ['js', 'jsx'].includes(file.extension);
}

function isTs(file) {
  return ['ts', 'tsx'].includes(file.extension);
}


module.exports = {
  getFileType,
  isJs,
  isTs,
};
