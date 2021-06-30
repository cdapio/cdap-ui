import { constructUrl } from 'server/url-helper';
import { getCDAPConfig } from 'server/cdap-config';
import { getGETRequestOptions, requestPromiseWrapper } from 'gql/resolvers-common';
import { orderBy } from 'natural-orderby';
import { ApolloError } from 'apollo-server';

let cdapConfig;
getCDAPConfig().then(function (value) {
  cdapConfig = value;
});

export async function versionResolver(_parent, args, context) {
  const namespace = args.namespace;
  const options = getGETRequestOptions();

  let path = `/v3/version`;

  options.url = constructUrl(cdapConfig, path);
  context.namespace = namespace;

  const errorModifiersFn = (error, statusCode) => {
    return new ApolloError(error, statusCode, { errorOrigin: 'version' });
  };

  const { version } = await requestPromiseWrapper(options, context, null, errorModifiersFn);
  console.log('VERSION RESULT:', JSON.stringify(version, null, 2));
  return version;
}
