import { call, put, select } from "redux-saga/effects"
import fetchJsonp from "fetch-jsonp"
var twit = require('twit');
var config = require('../config/config.js');
var Twitter = new twit({
  consumer_key:         'VLtsFit1rZnw89sbVTIX4wnOq',
  consumer_secret:      'mydfjNo7NIcmXTREM7TqxBLLLTpG0l2O6ibhTlRgU1tGbEuALp',
  access_token:         '1298009989538168832-geKY0hiYDHbNcnCHQWpeh2eiLTBZdp',
  access_token_secret:  'X9SXbIbypXREGB8sztoxnDrEtWAvjP4UYyHuHANQ2jKwr',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

export const FETCH_TWEETS = "FETCH_TWEETS"
export const FETCH_SUCCESS = "FETCH_SUCCESS"
export const FETCH_ERROR = "FETCH_ERROR"
export const CHANGE_QUERY = "CHANGE_QUERY"
export const ARRANGE_TWEETS = "ARRANGE_TWEETS"
export const MOVE_TO_SAVE = "MOVE_TO_SAVE"

const CALLBACK = true
const COUNT = 10

export const fetchTweets = () => ({
  type: FETCH_TWEETS,
})

export const arrangeTweets = columns => ({
  type: ARRANGE_TWEETS,
  columns,
})

export const changeQuery = text => ({
  type: CHANGE_QUERY,
  text,
})

export const moveToSave = (start, finish) => ({
  type: MOVE_TO_SAVE,
  start,
  finish,
})

//Make api call with fetchJsonp for CORS
const api = url =>
  fetchJsonp(url, { jsonpCallbackFunction: "custom_callback" }).then(response => response.json())

export function* fetchTweetRequest() {
  //Fetch current query entered by the user from state
  let query = yield select(state => state.tweets.query)

  // Instruction says these are optional, however in the mock there is no UI for it, so I assumed
  // that its optional for the developer, it can be setup top of this file with CONST
  const urlCallback = CALLBACK ? "&callback=custom_callback" : ""
  const urlCount = COUNT ? `&count=${COUNT}` : ""

  try {
    // const response = 
    // yield call(
    //   api,
    //   `https://tweetsaver.herokuapp.com/?q=${query}${urlCallback}${urlCount}`,
    // )

    // Add specialkey listener
  // initComponent: function() {
  //   this.callParent();
  //   this.on('specialkey', this.checkEnterKey, this);
  // },

  // // Handle enter key presses, execute the search if the field has a value
  // checkEnterKey: function(field, e) {
  //   var value = this.getValue();
  //   if (e.getKey() === e.ENTER && !Ext.isEmpty(value)) {
  //       var tweet_store = Ext.getStore("tweetStore");
  //       tweet_store.getProxy().setUrl('http://tweetsaver.herokuapp.com/?q='+value+'&count=20');    
  //       tweet_store.load();
  //   }
  // }

    var params = {
      q: query ,
      count: urlCount,
  }

    const response = Twitter.get('search/tweets', params, function(err, data, response) {
        console.log(err)
        console.log(data)
        console.log(response)
      });

    //turn array into object for future drag and drop use
    let responseObject = Object.assign({}, response.tweets)

    //make unique keys for localStorage/app re-load
    let result = makeUniqueKeys(responseObject)

    //fetch the first column to put the all the tweets's id in
    let tweetsColumn = yield select(state => state.tweets.columns["tweetsColumn"])

    //add the ids of tweets to a column for reference for the drag and drop
    yield call(addIdToColumns, result, tweetsColumn)

    yield put({ type: FETCH_SUCCESS, result: result })
  } catch (e) {
    yield put({ type: FETCH_ERROR, error: e })
  }
}

const addIdToColumns = (response, column) => {
  //order matters, so why need to key track of the order for all the tweets in a column
  column.tweetsIds = Object.keys(response)
}

const makeUniqueKeys = response => {
  let obj = {}

  for (let o in response) {
    obj[response[o].id] = response[o]
  }
  return obj
}
