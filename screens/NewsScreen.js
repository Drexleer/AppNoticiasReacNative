import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    axios
      .get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=2b72ab5b7cc740eba17e6bb519fdd8ab&page=${page}`
      )
      .then((response) => {
        setNews((prevNews) => [...prevNews, ...response.data.articles]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  };

  const handleOpenUrl = (url) => {
    Linking.openURL(url);
  };

  const handleEndReached = () => {
    setPage((prevPage) => prevPage + 1);
    fetchNews();
  };

  return (
    <View>
      <FlatList
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={{ uri: item.urlToImage }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.publishedAt}>{item.publishedAt}</Text>
            <Button
              title="Ver Detalles"
              onPress={() => handleOpenUrl(item.url)}
            />
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />
      {loading && <Text>Cargando...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 10,
  },
  publishedAt: {
    color: '#888',
  },
});

export default NewsScreen;
