/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const PREFIX = `features.WranglerNewUI.GridPage.transformationUI.hash.options.label`;
import T from 'i18n-react';

export const HASH_ALGORITHM_OPTIONS = [
  {
    value: 'BLAKE2B-160',
    label: T.translate(`${PREFIX}.blake2b160`).toString(),
  },
  {
    value: 'BLAKE2B-256',
    label: T.translate(`${PREFIX}.blake2b256`).toString(),
  },
  {
    value: 'BLAKE2B-384',
    label: T.translate(`${PREFIX}.blake2b384`).toString(),
  },
  {
    value: 'BLAKE2B-512',
    label: T.translate(`${PREFIX}.blake2b512`).toString(),
  },
  {
    value: 'GOST3411',
    label: T.translate(`${PREFIX}.gost3411`).toString(),
  },
  {
    value: 'GOST3411-2012-256',
    label: T.translate(`${PREFIX}.gost34112012256`).toString(),
  },
  {
    value: 'GOST3411-2012-512',
    label: T.translate(`${PREFIX}.gost34112012512`).toString(),
  },
  {
    value: 'KECCAK-224',
    label: T.translate(`${PREFIX}.keccak224`).toString(),
  },
  {
    value: 'KECCAK-256',
    label: T.translate(`${PREFIX}.keccak256`).toString(),
  },
  {
    value: 'KECCAK-288',
    label: T.translate(`${PREFIX}.keccak288`).toString(),
  },
  {
    value: 'KECCAK-384',
    label: T.translate(`${PREFIX}.keccak384`).toString(),
  },
  {
    value: 'KECCAK-512',
    label: T.translate(`${PREFIX}.keccak512`).toString(),
  },
  {
    value: 'MD2',
    label: T.translate(`${PREFIX}.md2`).toString(),
  },
  {
    value: 'MD4',
    label: T.translate(`${PREFIX}.md4`).toString(),
  },
  {
    value: 'MD5',
    label: T.translate(`${PREFIX}.md5`).toString(),
  },
  {
    value: 'RIPEMD128',
    label: T.translate(`${PREFIX}.ripemd`).toString(),
  },
  {
    value: 'RIPEMD160',
    label: T.translate(`${PREFIX}.ripemd160`).toString(),
  },
  {
    value: 'RIPEMD256',
    label: T.translate(`${PREFIX}.ripemd256`).toString(),
  },
  {
    value: 'RIPEMD320',
    label: T.translate(`${PREFIX}.ripemd320`).toString(),
  },
  {
    value: 'SHA',
    label: T.translate(`${PREFIX}.sha`).toString(),
  },
  {
    value: 'SHA-1',
    label: T.translate(`${PREFIX}.sha1`).toString(),
  },
  {
    value: 'SHA-224',
    label: T.translate(`${PREFIX}.sha224`).toString(),
  },
  {
    value: 'SHA-256',
    label: T.translate(`${PREFIX}.sha256`).toString(),
  },
  {
    value: 'SHA-384',
    label: T.translate(`${PREFIX}.sha384`).toString(),
  },
  {
    value: 'SHA-512',
    label: T.translate(`${PREFIX}.sha512`).toString(),
  },
  {
    value: 'SHA-512/224',
    label: T.translate(`${PREFIX}.sha512/224`).toString(),
  },
  {
    value: 'SHA-512/256',
    label: T.translate(`${PREFIX}.sha512/256`).toString(),
  },
  {
    value: 'SHA3-224',
    label: T.translate(`${PREFIX}.sha3224`).toString(),
  },
  {
    value: 'SHA3-256',
    label: T.translate(`${PREFIX}.sha3256`).toString(),
  },
  {
    value: 'SHA3-384',
    label: T.translate(`${PREFIX}.sha3384`).toString(),
  },
  {
    value: 'SHA3-512',
    label: T.translate(`${PREFIX}.sha3512`).toString(),
  },
  {
    value: 'Skein-1024-1024',
    label: T.translate(`${PREFIX}.skein10241024`).toString(),
  },
  {
    value: 'Skein-1024-384',
    label: T.translate(`${PREFIX}.skein1024384`).toString(),
  },
  {
    value: 'Skein-1024-512',
    label: T.translate(`${PREFIX}.skein1024512`).toString(),
  },
  {
    value: 'Skein-256-128',
    label: T.translate(`${PREFIX}.skein256128`).toString(),
  },
  {
    value: 'Skein-256-160',
    label: T.translate(`${PREFIX}.skein256160`).toString(),
  },
  {
    value: 'Skein-256-224',
    label: T.translate(`${PREFIX}.skein256224`).toString(),
  },
  {
    value: 'Skein-256-256',
    label: T.translate(`${PREFIX}.skein256256`).toString(),
  },
  {
    value: 'Skein-512-128',
    label: T.translate(`${PREFIX}.skein512128`).toString(),
  },
  {
    value: 'Skein-512-160',
    label: T.translate(`${PREFIX}.skein512160`).toString(),
  },
  {
    value: 'Skein-512-224',
    label: T.translate(`${PREFIX}.skein512224`).toString(),
  },
  {
    value: 'Skein-512-256',
    label: T.translate(`${PREFIX}.skein512256`).toString(),
  },
  {
    value: 'Skein-512-384',
    label: T.translate(`${PREFIX}.skein512384`).toString(),
  },
  {
    value: 'Skein-512-512',
    label: T.translate(`${PREFIX}.skein512512`).toString(),
  },
  {
    value: 'SM3',
    label: T.translate(`${PREFIX}.sm3`).toString(),
  },
  {
    value: 'Tiger',
    label: T.translate(`${PREFIX}.tiger`).toString(),
  },
  {
    value: 'WHIRLPOOL',
    label: T.translate(`${PREFIX}.whirlpool`).toString(),
  },
];
