import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const headerStyle = {
  background: "linear-gradient(to right, #59c173, #a17fe0, #5d26c1",
  color: "white"
};

class HeaderBar extends Component {
  render() {
    const { title } = this.props;
    return (
      <div className="header">
        <AppBar position="static" color="default" style={headerStyle}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              {title.pageTitle}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default HeaderBar;
