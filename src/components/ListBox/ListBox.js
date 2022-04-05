import React from "react"
import ListItem from "@material-ui/core/ListItem"
import Divider from "@material-ui/core/Divider"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import ListItemText from "@material-ui/core/ListItemText"
import { Draggable } from "react-beautiful-dnd"

const ListBox = ({ tweet, index }) => {
  return (
    <Draggable draggableId={tweet.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={tweet.user && tweet.user.biggerProfileImageURL} />
            </ListItemAvatar>
            <ListItemText primary={tweet.user && tweet.user.name} secondary={tweet.text} />
          </ListItem>
          <Divider />
        </div>
      )}
    </Draggable>
  )
}

export default ListBox
