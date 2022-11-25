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

import { SEND_TO_ERROR_OPTIONS } from 'components/WranglerGrid/TransformationComponents/SendToError/options';

describe('It should test option.ts file.', () => {
  it('should test SEND_TO_ERROR_OPTIONS[0].directive function when value is EMPTY.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[0].directive('send-to-error', 'body_1', false, '', 'EMPTY')
    ).toStrictEqual('send-to-error empty(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[1].directive function when value is TEXTEXACTLY.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[1].directive('send-to-error', 'body_1', false, '', 'TEXTEXACTLY')
    ).toStrictEqual('send-to-error body_1 == ""');

    expect(
      SEND_TO_ERROR_OPTIONS[1].directive('send-to-error', 'body_1', true, '', 'TEXTEXACTLY')
    ).toStrictEqual('send-to-error body_1 =~ "(?i)"');
  });

  it('should test SEND_TO_ERROR_OPTIONS[2].directive function when value is TEXTCONTAINS.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[2].directive('send-to-error', 'body_1', true, '', 'TEXTCONTAINS')
    ).toStrictEqual('send-to-error body_1 =~ "(?i).*.*"');

    expect(
      SEND_TO_ERROR_OPTIONS[2].directive('send-to-error', 'body_1', false, '', 'TEXTCONTAINS')
    ).toStrictEqual('send-to-error body_1 =~ ".*.*"');
  });

  it('should test SEND_TO_ERROR_OPTIONS[3].directive function when value is TEXTSTARTSWITH.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[3].directive('send-to-error', 'body_1', false, '', 'TEXTSTARTSWITH')
    ).toStrictEqual('send-to-error body_1 =^ ""');

    expect(
      SEND_TO_ERROR_OPTIONS[3].directive('send-to-error', 'body_1', true, '', 'TEXTSTARTSWITH')
    ).toStrictEqual('send-to-error body_1 =~ "(?i)^.*"');
  });

  it('should test SEND_TO_ERROR_OPTIONS[4].directive function when value is TEXTENDSWITH.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[4].directive('send-to-error', 'body_1', false, '', 'TEXTENDSWITH')
    ).toStrictEqual('send-to-error body_1 =$ ""');

    expect(
      SEND_TO_ERROR_OPTIONS[4].directive('send-to-error', 'body_1', true, '', 'TEXTENDSWITH')
    ).toStrictEqual('send-to-error body_1 =~ "(?i).*$"');
  });

  it('should test SEND_TO_ERROR_OPTIONS[5].directive function when value is TEXTENDSWITH.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[5].directive('send-to-error', 'body_1', false, '', 'TEXTREGEX')
    ).toStrictEqual('send-to-error body_1 =~ ""');
  });

  it('should test SEND_TO_ERROR_OPTIONS[6].directive function when value is ISNUMBER.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[6].directive('send-to-error', 'body_1', false, '', 'ISNUMBER')
    ).toStrictEqual('send-to-error dq:isNumber(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[7].directive function when value is ISNOTNUMBER.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[7].directive('send-to-error', 'body_1', false, '', 'ISNOTNUMBER')
    ).toStrictEqual('send-to-error !dq:isNumber(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[8].directive function when value is ISDOUBLE.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[8].directive('send-to-error', 'body_1', false, '', 'ISDOUBLE')
    ).toStrictEqual('send-to-error dq:isDouble(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[9].directive function when value is ISNOTDOUBLE.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[9].directive('send-to-error', 'body_1', false, '', 'ISNOTDOUBLE')
    ).toStrictEqual('send-to-error !dq:isDouble(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[10].directive function when value is ISINTEGER.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[10].directive('send-to-error', 'body_1', false, '', 'ISINTEGER')
    ).toStrictEqual('send-to-error dq:isInteger(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[11].directive function when value is ISNOTINTEGER.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[11].directive('send-to-error', 'body_1', false, '', 'ISNOTINTEGER')
    ).toStrictEqual('send-to-error !dq:isInteger(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[12].directive function when value is ISBOOLEAN.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[12].directive('send-to-error', 'body_1', false, '', 'ISBOOLEAN')
    ).toStrictEqual('send-to-error dq:isBoolean(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[13].directive function when value is ISNOTBOOLEAN.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[13].directive('send-to-error', 'body_1', false, '', 'ISNOTBOOLEAN')
    ).toStrictEqual('send-to-error !dq:isBoolean(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[14].directive function when value is ISDATE.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[14].directive('send-to-error', 'body_1', false, '', 'ISDATE')
    ).toStrictEqual('send-to-error dq:isDate(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[15].directive function when value is ISNOTDATE.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[15].directive('send-to-error', 'body_1', false, '', 'ISNOTDATE')
    ).toStrictEqual('send-to-error !dq:isDate(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[16].directive function when value is ISDATEFORMAT and ISNOTDATEFORMAT.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[16].directive('send-to-error', 'body_1', false, '', 'ISDATEFORMAT')
    ).toStrictEqual('send-to-error dq:isDate(body_1, "")');

    expect(
      SEND_TO_ERROR_OPTIONS[16].directive('send-to-error', 'body_1', false, '', 'ISNOTDATEFORMAT')
    ).toStrictEqual('send-to-error !dq:isDate(body_1, "")');
  });

  it('should test SEND_TO_ERROR_OPTIONS[17].directive function when value is ISNOTDATEFORMAT and ISDATEFORMAT.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[17].directive('send-to-error', 'body_1', false, '', 'ISNOTDATEFORMAT')
    ).toStrictEqual('send-to-error !dq:isDate(body_1, "")');

    expect(
      SEND_TO_ERROR_OPTIONS[17].directive('send-to-error', 'body_1', false, '', 'ISDATEFORMAT')
    ).toStrictEqual('send-to-error dq:isDate(body_1, "")');
  });

  it('should test SEND_TO_ERROR_OPTIONS[18].directive function when value is ISTIME.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[18].directive('send-to-error', 'body_1', false, '', 'ISTIME')
    ).toStrictEqual('send-to-error dq:isTime(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[19].directive function when value is ISNOTTIME.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[19].directive('send-to-error', 'body_1', false, '', 'ISNOTTIME')
    ).toStrictEqual('send-to-error !dq:isTime(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[20].directive function when value is ISIP.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[20].directive('send-to-error', 'body_1', false, '', 'ISIP')
    ).toStrictEqual('send-to-error dq:isIP(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[21].directive function when value is ISNOTIP.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[21].directive('send-to-error', 'body_1', false, '', 'ISNOTIP')
    ).toStrictEqual('send-to-error !dq:isIP(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[22].directive function when value is ISIPV4.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[22].directive('send-to-error', 'body_1', false, '', 'ISIPV4')
    ).toStrictEqual('send-to-error dq:isIPv4(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[23].directive function when value is ISNOTIPV4.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[23].directive('send-to-error', 'body_1', false, '', 'ISNOTIPV4')
    ).toStrictEqual('send-to-error !dq:isIPv4(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[24].directive function when value is ISIPV6.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[24].directive('send-to-error', 'body_1', false, '', 'ISIPV6')
    ).toStrictEqual('send-to-error dq:isIPv6(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[25].directive function when value is ISNOTIPV6.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[25].directive('send-to-error', 'body_1', false, '', 'ISNOTIPV6')
    ).toStrictEqual('send-to-error !dq:isIPv6(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[26].directive function when value is ISEMAIL.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[26].directive('send-to-error', 'body_1', false, '', 'ISEMAIL')
    ).toStrictEqual('send-to-error dq:isEmail(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[27].directive function when value is ISNOTEMAIL.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[27].directive('send-to-error', 'body_1', false, '', 'ISNOTEMAIL')
    ).toStrictEqual('send-to-error !dq:isEmail(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[28].directive function when value is ISURL.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[28].directive('send-to-error', 'body_1', false, '', 'ISURL')
    ).toStrictEqual('send-to-error dq:isUrl(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[29].directive function when value is ISNOTURL.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[29].directive('send-to-error', 'body_1', false, '', 'ISNOTURL')
    ).toStrictEqual('send-to-error !dq:isUrl(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[30].directive function when value is ISDOMAINNAME.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[30].directive('send-to-error', 'body_1', false, '', 'ISDOMAINNAME')
    ).toStrictEqual('send-to-error dq:isDomainName(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[31].directive function when value is ISNOTDOMAINNAME.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[31].directive('send-to-error', 'body_1', false, '', 'ISNOTDOMAINNAME')
    ).toStrictEqual('send-to-error !dq:isDomainName(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[32].directive function when value is ISDOMAINTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[32].directive('send-to-error', 'body_1', false, '', 'ISDOMAINTLD')
    ).toStrictEqual('send-to-error dq:isDomainTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[33].directive function when value is ISNOTDOMAINTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[33].directive('send-to-error', 'body_1', false, '', 'ISNOTDOMAINTLD')
    ).toStrictEqual('send-to-error !dq:isDomainTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[34].directive function when value is ISGENERICTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[34].directive('send-to-error', 'body_1', false, '', 'ISGENERICTLD')
    ).toStrictEqual('send-to-error dq:isGenericTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[35].directive function when value is ISNOTGENERICTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[35].directive('send-to-error', 'body_1', false, '', 'ISNOTGENERICTLD')
    ).toStrictEqual('send-to-error !dq:isGenericTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[36].directive function when value is ISCOUNTRYTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[36].directive('send-to-error', 'body_1', false, '', 'ISCOUNTRYTLD')
    ).toStrictEqual('send-to-error dq:isCountryTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[37].directive function when value is ISNOTCOUNTRYTLD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[37].directive('send-to-error', 'body_1', false, '', 'ISNOTCOUNTRYTLD')
    ).toStrictEqual('send-to-error !dq:isCountryTld(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[38].directive function when value is ISISBN.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[38].directive('send-to-error', 'body_1', false, '', 'ISISBN')
    ).toStrictEqual('send-to-error dq:isISBN(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[39].directive function when value is ISNOTISBN.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[39].directive('send-to-error', 'body_1', false, '', 'ISNOTISBN')
    ).toStrictEqual('send-to-error !dq:isISBN(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[40].directive function when value is ISISBN10.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[40].directive('send-to-error', 'body_1', false, '', 'ISISBN10')
    ).toStrictEqual('send-to-error dq:isISBN10(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[41].directive function when value is ISNOTISBN10.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[41].directive('send-to-error', 'body_1', false, '', 'ISNOTISBN10')
    ).toStrictEqual('send-to-error !dq:isISBN10(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[42].directive function when value is ISISBN13.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[42].directive('send-to-error', 'body_1', false, '', 'ISISBN13')
    ).toStrictEqual('send-to-error dq:isISBN13(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[43].directive function when value is ISNOTISBN13.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[43].directive('send-to-error', 'body_1', false, '', 'ISNOTISBN13')
    ).toStrictEqual('send-to-error !dq:isISBN13(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[44].directive function when value is ISCREDITCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[44].directive('send-to-error', 'body_1', false, '', 'ISCREDITCARD')
    ).toStrictEqual('send-to-error dq:isCreditCard(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[45].directive function when value is ISNOTCREDITCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[45].directive('send-to-error', 'body_1', false, '', 'ISNOTCREDITCARD')
    ).toStrictEqual('send-to-error !dq:isCreditCard(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[46].directive function when value is ISAMEXCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[46].directive('send-to-error', 'body_1', false, '', 'ISAMEXCARD')
    ).toStrictEqual('send-to-error dq:isAmex(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[47].directive function when value is ISNOTAMEXCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[47].directive('send-to-error', 'body_1', false, '', 'ISNOTAMEXCARD')
    ).toStrictEqual('send-to-error !dq:isAmex(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[48].directive function when value is ISVISACARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[48].directive('send-to-error', 'body_1', false, '', 'ISVISACARD')
    ).toStrictEqual('send-to-error dq:isVisa(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[49].directive function when value is ISNOTVISACARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[49].directive('send-to-error', 'body_1', false, '', 'ISNOTVISACARD')
    ).toStrictEqual('send-to-error !dq:isVisa(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[50].directive function when value is ISMASTERCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[50].directive('send-to-error', 'body_1', false, '', 'ISMASTERCARD')
    ).toStrictEqual('send-to-error dq:isMaster(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[51].directive function when value is ISNOTMASTERCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[51].directive('send-to-error', 'body_1', false, '', 'ISNOTMASTERCARD')
    ).toStrictEqual('send-to-error !dq:isMaster(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[52].directive function when value is ISDINERCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[52].directive('send-to-error', 'body_1', false, '', 'ISDINERCARD')
    ).toStrictEqual('send-to-error dq:isDiner(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[53].directive function when value is ISNOTDINERCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[53].directive('send-to-error', 'body_1', false, '', 'ISNOTDINERCARD')
    ).toStrictEqual('send-to-error !dq:isDiner(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[54].directive function when value is ISVPAYCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[54].directive('send-to-error', 'body_1', false, '', 'ISVPAYCARD')
    ).toStrictEqual('send-to-error dq:isVPay(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[55].directive function when value is ISNOTVPAYCARD.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[55].directive('send-to-error', 'body_1', false, '', 'ISNOTVPAYCARD')
    ).toStrictEqual('send-to-error !dq:isVPay(body_1)');
  });

  it('should test SEND_TO_ERROR_OPTIONS[46].directive function when value is CUSTOMCONDITION.', () => {
    expect(
      SEND_TO_ERROR_OPTIONS[56].directive(
        'send-to-error',
        'body_1',
        false,
        'uppercase',
        'CUSTOMCONDITION'
      )
    ).toStrictEqual('send-to-error uppercase');
  });
});
