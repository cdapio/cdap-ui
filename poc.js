'use strict';
const fs = require('fs');

const keyPath = './key_file.json';
const keyExists = fs.existsSync(keyPath);

let keyLooksValid = false;
let serviceAccountEmail = null;
let keySize = 0;

if (keyExists) {
  const raw = fs.readFileSync(keyPath, 'utf8');
  keySize = raw.length;
  try {
    const key = JSON.parse(raw);
    keyLooksValid = Boolean(
      key.type === 'service_account' &&
      key.client_email &&
      key.private_key_id &&
      key.private_key
    );
    serviceAccountEmail = key.client_email;
  } catch (e) {
    // parse error - key may be malformed
  }
}

console.log('===CDAP-UI-VRP-POC-START===');
console.log('POC_KEY_FILE_EXISTS=' + keyExists);
console.log('POC_KEY_FILE_SIZE_BYTES=' + keySize);
console.log('POC_KEY_IS_GCP_SERVICE_ACCOUNT_JSON=' + keyLooksValid);
console.log('POC_SERVICE_ACCOUNT_EMAIL=' + serviceAccountEmail);
console.log('POC_SCM_PAT_PRESENT=' + Boolean(process.env.SCM_TEST_REPO_PAT));
console.log('POC_GCP_PROJECT_PRESENT=' + Boolean(process.env.GCP_PROJECTID));
console.log('POC_GCP_SA_PATH_ENV=' + Boolean(process.env.GCP_SERVICE_ACCOUNT_PATH));
console.log('===CDAP-UI-VRP-POC-END===');
