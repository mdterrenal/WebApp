// Note that we import these values where needed as "web_app_config"
module.exports = {
  WE_VOTE_URL_PROTOCOL: "http://",  // "http://" for local dev or "https://" for live server
  WE_VOTE_HOSTNAME: "WeVote.US",  // This should be without "http...". This is "WeVote.US" on live server.

  WE_VOTE_SERVER_ROOT_URL: "https://api.wevoteusa.org/",
  WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
  WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",

  DEBUG_MODE: false,

  // Use 1 or 0 as opposed to true or false
  test: {
    use_test_election: 0,
  },

  location: {
    text_for_map_search: "",
  },

  FACEBOOK_APP_ID: "1097389196952441",

  STRIPE_API_KEY: "pk_test_bWuWGC3jrMIFH3wvRvHR6Z5H",

  IS_CORDOVA: false,
};
