/**
 * Created by misery on 16/1/11.
 */

'use strict';

var React = require ('react-native');

var { StyleSheet, View, Text, TouchableHighlight } = React;

var cellTypes = {
  BASIC: 0,
  WITH_INDENT: 1,
  WITH_ACCESSORY: 2
};

var cellAccessory = {
  DISCLOSURE_INDICATOR: 0,
  DETAIL: 1,
  DETAIL_DISCLOSURE: 2,
  CHECK: 3
};

var CellBasic = React.createClass ({
  getDefaultProps() {
    return {
      touchable: false,
      underlayColor: '#d9d9d9'
    };
  },
  render() {
    var cellStyle = [cellStyles.cell, cellStyles.cellWithBorder, this.props.style];
    return this.props.touchable ? (
      <TouchableHighlight {...this.props} style={cellStyle}>{this.props.children}</TouchableHighlight>) : (
      <View {...this.props} style={cellStyle}>{this.props.children}</View>);
  }
});

var CellWithIndent = React.createClass ({
  render() {
    var {style, containerStyle, ...otherProps} = this.props;
    var contentStyle = [cellStyles.cellWithIndent, cellStyles.cellWithBorder, style];
    var cellStyle = [cellStyles.cellNoBorder, containerStyle];
    return (
      <CellBasic
        {...otherProps}
        style={cellStyle}>
        <View style={contentStyle}>{this.props.children}</View>
      </CellBasic>
    );
  }
});

var CellWithAccessory = React.createClass ({
  getDefaultProps() {
    return {
      accessory: cellAccessory.DISCLOSURE_INDICATOR
    };
  },
  render() {
    var {accessory, children, ...otherProps} = this.props;
    var accessoryComponent = this.renderAccessory (accessory);
    return (
      <CellWithIndent {...otherProps} style={cellStyles.cellWithAccessory}>
        <View style={{flex: 1}}>{children}</View>
        {accessoryComponent}
      </CellWithIndent>
    );
  },
  renderAccessory(accessory) {
    switch (accessory) {
      case cellAccessory.DISCLOSURE_INDICATOR:
        return <View style={accessoryStyles.disclosureIndicator}/>;
    }
  }
});

module.exports = React.createClass ({
  render() {
    switch (this.props.type) {
      case cellTypes.WITH_INDENT:
        return <CellWithIndent {...this.props} />;
      case cellTypes.WITH_ACCESSORY:
        return <CellWithAccessory {...this.props} />;
      case cellTypes.BASIC:
      default:
        return <CellBasic {...this.props} />;
    }
  }
});

var cellStyles = StyleSheet.create ({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cellWithIndent: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 15,
    paddingVertical: 10
  },
  cellWithBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#C8C7CC',
    borderStyle: 'solid'
  },
  cellNoBorder: {
    borderBottomWidth: 0
  },
  cellWithAccessory: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

var accessoryStyles = StyleSheet.create ({
  disclosureIndicator: {
    width: 9,
    height: 9,
    marginLeft: 7,
    marginRight: 2,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#c7c7cc',
    transform: [{
      rotate: '45deg'
    }],
    position: 'relative',
    flex: 0
  }
});

module.exports.cellTypes = cellTypes;
module.exports.cellAccesory = cellAccessory;