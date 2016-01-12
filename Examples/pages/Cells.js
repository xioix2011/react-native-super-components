/**
 * Created by misery on 16/1/12.
 */

'use strict';

var React = require ('react-native');
var {
  StyleSheet,
  View,
  Text
  } = React;

var PullListView = require('../components/PullListView');
var Cell = require('../components/Cell');

module.exports = React.createClass({
  initData(done) {
    done ([{
      title: 'Basic',
      type: Cell.cellTypes.BASIC
    }, {
      title: 'With indent',
      type: Cell.cellTypes.WITH_INDENT
    }, {
      title: 'With accessory',
      type: Cell.cellTypes.WITH_ACCESSORY
    }, {
      title: 'Touchable',
      type: Cell.cellTypes.WITH_ACCESSORY,
      touchable: true
    }]);
  },
  renderRow(data) {
    return (
      <Cell type={data.type} touchable={data.touchable} /*onPress={() => console.log('touched!')}*/>
        <Text>{data.title}</Text>
      </Cell>
    );
  },
  render() {
    return (
      <PullListView
        initData={this.initData}
        enableRefresh={false}
        enableLoadMore={false}
        renderRow={this.renderRow}
        bounces={false}
        contentInset={{top: 64}}
      />
    );
  }
});