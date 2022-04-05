import React from "react"
import Button from "@material-ui/core/Button"
import SearchIcon from "@material-ui/icons/Search"

import styles from "./styles"

const SearchButton = ({ onClick, variant, color }) => (
  <Button style={styles.buttonStyle} variant={variant} color={color} onClick={onClick}>
    <SearchIcon />
  </Button>
)

export default SearchButton
