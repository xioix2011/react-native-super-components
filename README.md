超级棒的组件库

# PullListView

### Usage

``` javascript
var React = require('react-native');
var {AppRegistry} = React;
var {PullListView} = require('react-native-super-components');

var Example = React.createClass({
  render() {
    return <PullListView />
  }
});
  
AppRegistry.registerComponent('Example', () => Example);
```

**set dev to `false` to turn performance optimizations on and get best experience

### Run Examples

``` bash
$ cd Examples && npm install
```

### Props

| Prop                  | Default | Type        | Description                         | 描述       | 
| --------------------- | ------- | ----------- | ----------------------------------- | -------- | 
| headerHeigh           | 50      | `number`    | The height of header area.          | 头部刷新区域高度 | 
| footerHeight          | 50      | `number`    | The height of footer area.          | 底部加载区域高度 | 
| headerReleaseDistance | 20      | `number`    | Where trigger header release state. | 头部释放距离   | 
| footerReleaseDistance | 20      | `number`    | Where trigger footer release state. | 底部释放距离   | 
| headerComponent       |         | `component` | The custom component of header.     | 头部组件定制   | 
| footerComponent       |         | `component` | The custom component of footer.     | 底部组件定制   | 

### Handlers

| Handler    | Params                          | Description                              | 描述   | 
| ---------- | ------------------------------- | ---------------------------------------- | ---- | 
| onRefresh  | `done`  Callback when refreshed | The handler when header release event triggered. | 刷新处理 | 
| onLoadMore | `done`  Callback when loaded    | The handler when footer release event triggered. | 加载处理 | 

### Renders

| Render    | Params                             | Description                         | 描述      | 
| --------- | ---------------------------------- | ----------------------------------- | ------- | 
| initData  | `done`  Callback when data fetched | Initialize data of list             | 初始化列表数据 | 
| renderRow |                                    | Same as original ListView renderRow | 行渲染     | 

### Exports

| Export         | Type        | Path                       | Description                        | 描述     | 
| -------------- | ----------- | -------------------------- | ---------------------------------- | ------ | 
| PullListView   | `component` | .                          | The main component of PullListView |        | 
| headerStatuses | `object`    | PullListView.headerStatues | The statues enums of header        | 头部状态枚举 | 
| footerStatuses | `object`    | PullListView.footerStatus  | The statues enums of footer        | 底部状态枚举 | 

