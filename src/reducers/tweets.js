import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  CHANGE_QUERY,
  ARRANGE_TWEETS,
  MOVE_TO_SAVE,
} from "../actions/tweets"

const initialState = {
  tweets: {},
  error: null,
  query: null,
  columns: {
    tweetsColumn: {
      id: "tweetsColumn",
      title: "To do",
      tweetsIds: [],
    },
    saveColumn: {
      id: "saveColumn",
      title: "To do",
      tweetsIds: [],
    },
  },

  columnsArray: ["tweetsColumn", "saveColumn"],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, tweets: { ...state.tweets, ...action.result } }
    case FETCH_ERROR:
      return { ...state, error: action.error }
    case CHANGE_QUERY:
      return { ...state, query: action.text }
    case ARRANGE_TWEETS:
      return {
        ...state,
        columns: {
          ...state.columns,
          [action.columns.id]: action.columns,
        },
      }
    case MOVE_TO_SAVE:
      return {
        ...state,
        columns: {
          ...state.columns,
          [action.start.id]: action.start,
          [action.finish.id]: action.finish,
        },
      }
    default:
      return state
  }
}

export default reducer
