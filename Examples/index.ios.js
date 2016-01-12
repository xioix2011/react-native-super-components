/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require ('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  Text
  } = React;

// Pages
var CustomPullListView = require ('./pages/CustomPullListView');
var Cells = require('./pages/Cells');

// list
var PullListView = require ('./components/PullListView');
var Cell = require ('./components/Cell');

var HomeList = React.createClass ({
  initData(done) {
    done ([{
      title: 'CustomPullListView',
      component: CustomPullListView
    }, {
      title: 'Cells',
      component: Cells
    }]);
  },
  renderRow(data) {
    return (
      <Cell type={Cell.cellTypes.WITH_ACCESSORY} touchable={true} onPress={() => this.props.navigator.push(data)}>
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

var Navigation = React.createClass ({
  render () {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          component : HomeList,
          title: "Home"
        }}
      />
    )
  }
});

AppRegistry.registerComponent ('Examples', () => Navigation);
