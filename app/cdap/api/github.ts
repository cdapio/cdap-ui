import DataSourceConfigurer from 'services/datasource/DataSourceConfigurer';
import { apiCreator } from 'services/resource-helper';
const dataSrc = DataSourceConfigurer.getInstance();

const githubRepoPath = '/repos/github/:repo';
const githubConnectionPath = '/repos/github/:repo/testconnection';

// The assumption is UI will get all its connection types from a single plugin.

export const GithubApi = {
  fetchGithubCredentials: apiCreator(dataSrc, 'GET', 'REQUEST', githubRepoPath),
  updateGithubCredentials: apiCreator(dataSrc, 'PUT', 'REQUEST', githubRepoPath),
  deleteGithubCredentials: apiCreator(dataSrc, 'DELETE', 'REQUEST', githubRepoPath),
  viewSavedGithubCredentials: apiCreator(dataSrc, 'GET', 'REQUEST', '/repos/githt'),
  testGithubConnection: apiCreator(dataSrc, 'POST', 'REQUEST', githubConnectionPath),
  checkoutPipeline: apiCreator(dataSrc, 'POST', 'REQUEST', '/repos/github/:repo/checkout'),
  checkInPipeline: apiCreator(dataSrc, 'POST', 'REQUEST', '/repos/github/:repot/checkin'),
};
