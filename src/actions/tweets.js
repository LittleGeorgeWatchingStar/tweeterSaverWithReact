import { call, put, select } from "redux-saga/effects"
import fetchJsonp from "fetch-jsonp"

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
    const response = yield call(
      api,
      `https://tweetsaver.herokuapp.com/?q=${query}${urlCallback}${urlCount}`,
    )

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
