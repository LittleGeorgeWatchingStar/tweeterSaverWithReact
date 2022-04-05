import React from "react"
import { connect } from "react-redux"
import Divider from "@material-ui/core/Divider"
import { DragDropContext } from "react-beautiful-dnd"

import { fetchTweets, arrangeTweets, moveToSave } from "./actions/tweets"
import { changeQuery } from "./actions/tweets"
import { Column } from "./components/Column"
import { InputBox } from "./components/InputBox"
import { SearchButton } from "./components/Buttons"

const App = ({ columns, columnsArray, tweets, dispatch }) => {
  const handleChange = event => {
    dispatch(changeQuery(event.target.value))
  }

  const handleSearchButtonClick = () => {
    dispatch(fetchTweets())
  }

  const onDragEnd = result => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const start = columns[source.droppableId]
    const finish = columns[destination.droppableId]

    //check if the tweet is moving within a column or to another column
    if (start === finish) {
      const newTweetsIds = Array.from(start.tweetsIds)
      newTweetsIds.splice(source.index, 1)
      newTweetsIds.splice(destination.index, 0, draggableId)
      const newColumn = {
        ...start,
        tweetsIds: newTweetsIds,
      }

      dispatch(arrangeTweets(newColumn))
    } else {
      // Moving to save list
      const startTweetsIds = Array.from(start.tweetsIds)
      startTweetsIds.splice(source.index, 1)
      const finishTweetsIds = Array.from(finish.tweetsIds)
      finishTweetsIds.splice(destination.index, 0, draggableId)

      const newStart = {
        ...start,
        tweetsIds: startTweetsIds,
      }

      const newFinish = {
        ...finish,
        tweetsIds: finishTweetsIds,
      }
      dispatch(moveToSave(newStart, newFinish))
    }
  }

  const styles = {
    topContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      height: 105,
    },
    searchContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: "50px",
      width: "45%",
    },
    saveContainer: {
      marginLeft: "10%",
      marginTop: "50px",
      width: "45%",
    },
    tweetContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
  }

  return (
    <div>
      <h1>Tweeter Saver</h1>
      <Divider />

      <div style={styles.topContainer}>
        <div style={styles.searchContainer}>
          <InputBox variant="outlined" label="Search Tweets e.g. Canada" onChange={handleChange} />
          <SearchButton onClick={handleSearchButtonClick} variant="contained" color="#1DA1F2" />
        </div>

        <div style={styles.saveContainer}>
          <h2>Saved Tweets</h2>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.tweetContainer}>
          {tweets &&
            columnsArray.map(columnId => {
              const currentColumn = columns[columnId]
              const tweetsArray = currentColumn.tweetsIds.map(id => {
                return tweets[id]
              })
              return <Column key={currentColumn.id} column={currentColumn} tweets={tweetsArray} />
            })}
        </div>
      </DragDropContext>
    </div>
  )
}

const mapToProps = state => {
  return {
    tweets: state.tweets.tweets,
    columnsArray: state.tweets.columnsArray,
    columns: state.tweets.columns,
  }
}
export default connect(mapToProps)(App)
