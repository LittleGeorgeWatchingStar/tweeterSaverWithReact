import React from "react"
import Paper from "@material-ui/core/Paper"
import { Droppable } from "react-beautiful-dnd"
import { ListBox } from "../ListBox"

import styles from "./styles"

const Column = ({ column, tweets }) => (
  <Paper style={styles.paper}>
    {
      <Droppable droppableId={column.id}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={styles.droppableHeight}>
            {tweets.map((tweet, index) => (
              <ListBox key={tweet.id} tweet={tweet} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    }
  </Paper>
)

export default Column
