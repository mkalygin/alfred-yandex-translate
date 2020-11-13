const fs = require('fs');
const axios = require('axios');

const IAM_CACHE_PATH = '.iam';
const IAM_CACHE_EXPIRE = 6 * 60 * 60 * 1000; // 6 hours in ms
const IAM_API_BASE_URL = 'https://iam.api.cloud.yandex.net/iam/v1';
const API_BASE_URL = 'https://translate.api.cloud.yandex.net/translate/v2';

// Documentation:
// https://cloud.yandex.ru/docs/translate/quickstart
//
// To get IAM-token we need to do once in 12h the following API request:
// curl -d "{\"yandexPassportOauthToken\":\"<OAuth-token>\"}" "https://iam.api.cloud.yandex.net/iam/v1/tokens"
//
// To do a translation request:
// curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer IAM_TOKEN" -d "{\"folder_id\":\"FOLDER_ID\",\"texts\":[\"hello world\"],\"targetLanguageCode\":\"ru\"}" "https://translate.api.cloud.yandex.net/translate/v2/translate"
class YandexTranslate {
  constructor({ oauthToken, folderId }) {
    this.iamApi = axios.create({
      baseURL: IAM_API_BASE_URL,
      params: {
        yandexPassportOauthToken: oauthToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.api = axios.create({
      baseURL: API_BASE_URL,
      params: {
        folder_id: folderId,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async translate(params) {
    return this.post('translate', params);
  }

  // Return a cache value from a file if a token is fresh.
  // Otherwise do an API request and cache it in a file.
  async iamToken() {
    const isCached = fs.existsSync(IAM_CACHE_PATH);
    const lastModified = isCached ? fs.statSync(IAM_CACHE_PATH).mtime : null;
    const isFresh = lastModified && (new Date() - lastModified < IAM_CACHE_EXPIRE);

    if (isFresh) return fs.readFileSync(IAM_CACHE_PATH, 'utf8');

    const { data } = await this.iamApi.post('tokens');
    const { iamToken } = data || {};

    fs.writeFileSync(IAM_CACHE_PATH, iamToken);

    return iamToken;
  }

  async post(endpoint, params) {
    const iamToken = await this.iamToken();
    const options = { headers: { Authorization: `Bearer ${iamToken}` } };

    return this.api.post(endpoint, params, options);
  }
}

module.exports = YandexTranslate;
