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
  normal: 0,
  pullDownToRelease: 1,
  pullDownReleased: 2,
  notDisplay: 3
};
var footerStatuses = {
  normal: 0,
  pullUpToRelease: 1,
  pullUpReleased: 2,
  noMore: 3,
  notDisplay: 4
};

var Header = React.createClass ({
  render() {
    if (this.props.status == headerStatuses.notDisplay) return null;
    const Component = this.props.component || React.createClass ({
        render() {
          return <Text style={styles.header}>{text}</Text>
        }
      });
    if (!this.props.component) {
      var text;
      switch (this.props.status) {
        case headerStatuses.normal:
          text = 'Pull down to refresh';
          break;
        case headerStatuses.pullDownToRelease:
          text = 'Release to refresh';
          break;
        case headerStatuses.pullDownReleased:
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
    if (this.props.offset == undefined || this.props.status == footerStatuses.notDisplay) return null;
    const Component = this.props.component || React.createClass ({
        render() {
          return <Text style={styles.footer}>{text}</Text>
        }
      });
    if (!this.props.component) {
      var text;
      switch (this.props.status) {
        case footerStatuses.normal:
          text = 'Pull up to load';
          break;
        case footerStatuses.pullUpToRelease:
          text = 'Release to load';
          break;
        case footerStatuses.pullUpReleased:
          text = 'Loading';
          break;
        case footerStatuses.noMore:
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
      headerStatus: this.props.enableRefresh ? headerStatuses.pullDownReleased : headerStatuses.notDisplay,
      footerStatus: this.props.enableLoadMore ? footerStatuses.normal : headerStatuses.notDisplay
    };
  },
  initData(data) {
    this.data = data;
    this.setState ({
      dataSource: this.state.dataSource.cloneWithRows (this.data)
    });
    if (this.props.enableRefresh) {
      this.setState ({
        headerStatus: headerStatuses.normal
      });
      this.refs.list.getScrollResponder ().scrollTo (0 - this.props.contentInset.top);
    }
    if (this.props.enableLoadMore) {
      var me = this;
      me.setTimeout (function () {
        me.setState ({
          footerStatus: footerStatuses.normal
        });
      }, 250);
    }
  },
  componentDidMount() {
    this.props.initData (this.initData);
  },
  componentDidUpdate() {
    if (this.props.enableLoadMore) {
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
        contentOffset={{y: -this.props.headerHeight - this.props.contentInset.top}}
        style={[this.props.style]}
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
      if (headerStatus == headerStatuses.pullDownToRelease) {
        this.refs.list.getScrollResponder ().scrollTo (-me.props.headerHeight - me.props.contentInset.top);
        this.setState ({headerStatus: headerStatuses.pullDownReleased, footerStatus: footerStatuses.notDisplay});
        this.props.onRefresh (me.initData);
      }
    }
    if (this.props.enableLoadMore) {
      var footerStatus = this.state.footerStatus;
      if (footerStatus == footerStatuses.pullUpToRelease) {
        var pullUpReleaseScrollTo = this.state.pullUpReleaseScrollTo;
        this.refs.list.getScrollResponder ().scrollTo (pullUpReleaseScrollTo);
        setTimeout (function () {
          me.setState ({footerStatus: footerStatuses.pullUpReleased});
        });

        this.props.onLoadMore (function (data) {
          me.refs.list.getScrollResponder ().scrollTo (pullUpReleaseScrollTo - me.props.footerHeight);
          if (!data || data.length == 0) {
            return me.setState ({footerStatus: footerStatuses.noMore});
          }
          me.data = me.data.concat (data);
          me.setTimeout (function () {
            me.setState ({
              footerStatus: footerStatuses.normal,
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
    if (headerStatus == headerStatuses.pullDownReleased || footerStatus == footerStatuses.pullUpReleased) return;
    var y = nativeEvent.contentInset.top + nativeEvent.contentOffset.y;
    if (this.props.enableRefresh) {
      var pullDownRelease = -this.props.headerHeight - this.props.headerReleaseDistance;
      if (y <= pullDownRelease && headerStatus == headerStatuses.normal) {
        this.setState ({headerStatus: headerStatuses.pullDownToRelease});
      } else if (y > pullDownRelease && headerStatus == headerStatuses.pullDownToRelease) {
        this.setState ({headerStatus: headerStatuses.normal});
      } else if (y > -this.props.headerHeight && headerStatus == headerStatuses.pullDownReleased) {
        this.setState ({headerStatus: headerStatuses.normal});
      }
    }

    if (this.props.enableLoadMore) {
      if (footerStatus == footerStatuses.noMore) return;
      var footerOffset = this.state.footerOffset;
      if (footerOffset != 'undefined') {
        var pullUpRelease = this.props.footerHeight + this.props.footerReleaseDistance;
        y = y + nativeEvent.layoutMeasurement.height - nativeEvent.contentSize.height - this.state.footerOffset;
        if (y >= pullUpRelease && footerStatus == footerStatuses.normal) {
          this.setState ({footerStatus: footerStatuses.pullUpToRelease});
          this.setState ({pullUpReleaseScrollTo: nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height + this.state.footerOffset + this.props.footerHeight});
        } else if (y < this.props.footerHeight && footerStatus == footerStatuses.pullUpToRelease) {
          this.setState ({footerStatus: footerStatuses.normal});
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