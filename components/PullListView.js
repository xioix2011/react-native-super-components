/**
 * Created by misery on 16/1/7.
 */

'use strict';

var React = require ('react-native');
var timerMixin = require ('react-timer-mixin');

var now = new Date ();
var REQUEST_URL = 'http://api.juheapi.com/japi/toh?key=2817c984cd4ae64134def75e1c26b7fe&v=1.0&month=' + (now.getMonth () + 1) + '&day=' + now.getDate ();

var {ListView, View, Text, StyleSheet, UIManager, Image} = React;

var headerStatuses = {
  NORMAL: 0,
  PULL_DOWN_TO_RELEASE: 1,
  PULL_DOWN_RELEASED: 2,
  NOT_DISPLAY: 3
};
var footerStatuses = {
  NORMAL: 0,
  PULL_UP_TO_RELEASE: 1,
  PULL_UP_RELEASED: 2,
  NO_MORE: 3,
  NOT_DISPLAY: 4
};

var Header = React.createClass ({
  render() {
    if (this.props.status == headerStatuses.NOT_DISPLAY) return null;
    const Component = this.props.component || React.createClass ({
        render() {
          return <Text style={styles.header}>{text}</Text>
        }
      });
    if (!this.props.component) {
      var text;
      switch (this.props.status) {
        case headerStatuses.NORMAL:
          text = 'Pull down to refresh';
          break;
        case headerStatuses.PULL_DOWN_TO_RELEASE:
          text = 'Release to refresh';
          break;
        case headerStatuses.PULL_DOWN_RELEASED:
          text = 'Refreshing';
          break;
      }
    }
    return (
      <View style={styles.headerContainer}>
        <View style={{height: this.props.height, top: -this.props.height}}>
          <Component {...this.props} />
        </View>
      </View>
    );
  }
});

var Footer = React.createClass ({
  render() {
    if (this.props.offset == undefined || this.props.status == footerStatuses.NOT_DISPLAY) return null;
    const Component = this.props.component || React.createClass ({
        render() {
          return <Text style={styles.footer}>{text}</Text>
        }
      });
    if (!this.props.component) {
      var text;
      switch (this.props.status) {
        case footerStatuses.NORMAL:
          text = 'Pull up to load';
          break;
        case footerStatuses.PULL_UP_TO_RELEASE:
          text = 'Release to load';
          break;
        case footerStatuses.PULL_UP_RELEASED:
          text = 'Loading';
          break;
        case footerStatuses.NO_MORE:
          text = 'No more';
          break;
      }
    }
    return (
      <View style={[styles.footerContainer, {top: this.props.offset}]}>
        <View style={{height: this.props.height}}>
          <Component {...this.props} />
        </View>
      </View>
    );
  }
});

module.exports = React.createClass ({
  mixins: [timerMixin],
  data: [],
  getDefaultProps() {
    return {
      enableRefresh: true,
      enableLoadMore: true,
      headerHeight: 50,
      footerHeight: 50,
      headerReleaseDistance: 20,
      footerReleaseDistance: 20,
      contentInset: {top: 0},
      onRefresh(done) {
        //setTimeout (function () {
        //do many things.
        fetch (REQUEST_URL).then ((response) => response.json ()).then ((res) => {
          done (res.result);
        }).done ();
        //}, 1000);
      },
      onLoadMore(done) {
        //setTimeout (function () {
        // do many things.
        fetch (REQUEST_URL).then ((response) => response.json ()).then ((res) => {
          done (res.result);
        }).done ();
        //}, 1000);
      },
      initData(done) {
        fetch (REQUEST_URL).then ((response) => response.json ()).then ((res) => {
          done (res.result);
        }).done ();
      },
      renderRow(data) {
        return (
          <View style={styles.row}>
            <Image style={styles.thumbnail} source={data.pic?{uri: data.pic}:''}/>
            <View style={styles.content}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.date}>{data.year + '年' + data.month + '月' + data.day + '日'}</Text>
            </View>
          </View>
        );
      }
    };
  },
  getInitialState() {
    return {
      dataSource: new ListView.DataSource ({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      headerStatus: this.props.enableRefresh ? headerStatuses.PULL_DOWN_RELEASED : headerStatuses.NOT_DISPLAY,
      footerStatus: this.props.enableLoadMore ? footerStatuses.NORMAL : headerStatuses.NOT_DISPLAY
    };
  },
  initData(data) {
    this.data = data;
    this.setState ({
      dataSource: this.state.dataSource.cloneWithRows (this.data)
    });
    if (this.props.enableRefresh) {
      this.setState ({
        headerStatus: headerStatuses.NORMAL
      });
      this.refs.list && this.refs.list.getScrollResponder ().scrollTo (0 - this.props.contentInset.top);
    }
    if (this.props.enableLoadMore) {
      var me = this;
      me.setTimeout (function () {
        me.setState ({
          footerStatus: footerStatuses.NORMAL
        });
      }, 250);
    }
  },
  componentDidMount() {
    this.props.initData (this.initData);
  },
  componentDidUpdate() {
    if (this.props.enableLoadMore && this.refs.list) {
      var me = this;
      setTimeout (function () {
        UIManager.measure (React.findNodeHandle (me.refs.list), (x, y, w, h, offsetX, offsetY) => {
          if (h != 0) {
            var containerHeight = h;
            UIManager.measure (me.refs.list.getInnerViewNode (), (x, y, w, h, offsetX, offsetY) => {
              var offset = Math.max (0, containerHeight - h);
              if (offset != me.state.footerOffset) {
                me.setState ({footerOffset: offset});
              }
            });
          }
        });
      });
    }
  },
  renderRow(data, sectionID, rowID, highlightRow) {
    return this.props.renderRow (data, sectionID, rowID, highlightRow);
  },
  renderHeader() {
    return <Header component={this.props.headerComponent} height={this.props.headerHeight}
      status={this.state.headerStatus}/>;
  },
  renderFooter() {
    return <Footer component={this.props.footerComponent} height={this.props.footerHeight}
      offset={this.state.footerOffset} status={this.state.footerStatus}/>;
  },
  render() {
    return (
      <ListView
        {...this.props}
        ref='list'
        initialListSize={10}
        pageSize={10}
        scrollRenderAheadDistance={200}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        onResponderGrant={this.handleResponderGrant}
        onResponderRelease={this.handleResponderRelease}
        onScroll={this.handleScroll}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        contentOffset={{y: this.props.enableRefresh?(-this.props.headerHeight - this.props.contentInset.top):(-this.props.contentInset.top)}}
        style={[{backgroundColor: '#EFEFF4'}, this.props.style]}
        automaticallyAdjustContentInsets={false}
      />
    );
  },
  handleResponderGrant(event) {
    //console.log(this.state.headerStatus);
  },
  handleResponderRelease(event) {
    var me = this;
    if (this.props.enableRefresh) {
      var headerStatus = this.state.headerStatus;
      if (headerStatus == headerStatuses.PULL_DOWN_TO_RELEASE) {
        this.refs.list.getScrollResponder ().scrollTo (-me.props.headerHeight - me.props.contentInset.top);
        this.setState ({headerStatus: headerStatuses.PULL_DOWN_RELEASED, footerStatus: footerStatuses.NOT_DISPLAY});
        this.props.onRefresh (me.initData);
      }
    }
    if (this.props.enableLoadMore) {
      var footerStatus = this.state.footerStatus;
      if (footerStatus == footerStatuses.PULL_UP_TO_RELEASE) {
        var pullUpReleaseScrollTo = this.state.pullUpReleaseScrollTo;
        this.refs.list.getScrollResponder ().scrollTo (pullUpReleaseScrollTo);
        setTimeout (function () {
          me.setState ({footerStatus: footerStatuses.PULL_UP_RELEASED});
        });

        this.props.onLoadMore (function (data) {
          me.refs.list.getScrollResponder ().scrollTo (pullUpReleaseScrollTo - me.props.footerHeight);
          if (!data || data.length == 0) {
            return me.setState ({footerStatus: footerStatuses.NO_MORE});
          }
          me.data = me.data.concat (data);
          me.setTimeout (function () {
            me.setState ({
              footerStatus: footerStatuses.NORMAL,
              dataSource: me.state.dataSource.cloneWithRows (me.data)
            });
          }, 250);
        });
      }
    }
  },
  handleScroll(event) {
    var nativeEvent = event.nativeEvent;
    var headerStatus = this.state.headerStatus;
    var footerStatus = this.state.footerStatus;
    if (headerStatus == headerStatuses.PULL_DOWN_RELEASED || footerStatus == footerStatuses.PULL_UP_RELEASED) return;
    if (this.props.enableRefresh) {
      var y = nativeEvent.contentInset.top + nativeEvent.contentOffset.y;
      var pullDownRelease = -this.props.headerHeight - this.props.headerReleaseDistance;
      if (y <= pullDownRelease && headerStatus == headerStatuses.NORMAL) {
        this.setState ({headerStatus: headerStatuses.PULL_DOWN_TO_RELEASE});
      } else if (y > pullDownRelease && headerStatus == headerStatuses.PULL_DOWN_TO_RELEASE) {
        this.setState ({headerStatus: headerStatuses.NORMAL});
      } else if (y > -this.props.headerHeight && headerStatus == headerStatuses.PULL_DOWN_RELEASED) {
        this.setState ({headerStatus: headerStatuses.NORMAL});
      }
    }

    if (this.props.enableLoadMore) {
      if (footerStatus == footerStatuses.NO_MORE) return;
      var footerOffset = this.state.footerOffset;
      if (footerOffset != 'undefined') {
        var y = nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height - nativeEvent.contentSize.height - this.state.footerOffset;
        var pullUpRelease = this.props.footerHeight + this.props.footerReleaseDistance;
        if (y >= pullUpRelease && footerStatus == footerStatuses.NORMAL) {
          this.setState ({footerStatus: footerStatuses.PULL_UP_TO_RELEASE});
          this.setState ({pullUpReleaseScrollTo: nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height + this.state.footerOffset + this.props.footerHeight});
        } else if (y < this.props.footerHeight && footerStatus == footerStatuses.PULL_UP_TO_RELEASE) {
          this.setState ({footerStatus: footerStatuses.NORMAL});
        }
      }
    }

  }
});

var styles = StyleSheet.create ({
  headerContainer: {
    height: 0
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 40
  },
  footerContainer: {
    height: 0
  },
  footer: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 40
  },
  row: {
    borderBottomWidth: 1 / 2,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  thumbnail: {
    width: 50,
    height: 50,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  content: {
    flex: 1,
    marginLeft: 10
  },
  date: {}
});

module.exports.headerStatuses = headerStatuses;
module.exports.footerStatuses = footerStatuses;