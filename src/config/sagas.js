import { takeLatest, all } from "redux-saga/effects"
import { FETCH_TWEETS, fetchTweetRequest } from "../actions/tweets"

function* rootSaga() {
  yield all([yield takeLatest(FETCH_TWEETS, fetchTweetRequest)])
}

export default rootSaga
