/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require ('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  NavigatorIOS
  } = React;

var PullListView = require ('./components/PullListView');

var appleNewsKey = 'dabbdcdba2e477a3c5537675e8107fe6';

var appleNewsUrl = 'http://apis.baidu.com/songshuxiansheng/news/news';

var Examples = React.createClass ({
  renderRow(news) {
    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={news.image_url?{uri : news.image_url}:''} style={styles.newsPic}>
            <View style={styles.titleContainer}>
              <Text style={styles.newsTitle}>
                {news.title}
              </Text>
            </View>
          </Image>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.newsDesc}>
            {news.abstract || news.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  fetchData(done) {
    fetch (appleNewsUrl, {headers: {apikey: appleNewsKey}}).then ((response) => response.json ()).then ((responseData)=> {
      done (responseData.retData);
    }).done ();
  },
  initData(done) {
    this.fetchData (done);
  },
  handleRefresh(done) {
    this.fetchData (done);
  },
  handleLoadMore(done) {
    this.fetchData (done);
  },
  render() {
    return (
      <PullListView
        initData={this.initData}
        onRefresh={this.handleRefresh}
        onLoadMore={this.handleLoadMore}
        renderRow={this.renderRow}
        contentInset={{top: 64}}
        enableLoadMore={false}
      />
    );
  }
});

var Navigation = React.createClass ({
    render: function () {
      return (
        <NavigatorIOS
          style={{flex: 1}}
          initialRoute={{
          component : Examples,
          title: "Home"
        }}
        />
      )
    }
  }
);

var styles = StyleSheet.create ({
  list: {
    flex: 1
  },
  container: {
    overflow: 'hidden'
  },
  imageContainer: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#888888'
  },

  newsPic: {
    backgroundColor: '#eee',
    height: 200,
    marginTop: 0
  },

  titleContainer: {
    backgroundColor: '#000000AA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  newsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 30,
    paddingVertical: 5,
    paddingBottom: 10,
    paddingTop: 5
  },

  newsDesc: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 10
  }
});

AppRegistry.registerComponent ('Examples', () => Navigation);
