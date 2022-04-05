import React from "react"
import TextField from "@material-ui/core/TextField"

import styles from "./styles"

const inputBox = ({ variant, label, onChange }) => (
  <TextField style={styles.field} variant={variant} label={label} onChange={onChange} />
)

export default inputBox
