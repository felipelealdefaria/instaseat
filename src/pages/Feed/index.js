import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import LazyImage from '../../components/LazyImage'
import { Post, Header, Avatar, Description, Name, Loading } from './styles';

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (total && pageNumber > total) return;

    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
    );
  
    const data = await response.json();
    const totalItems = response.headers.get('X-Total_Count'); // Informação que vem no header da requisiçāo

    setTotal(Math.floor(totalItems / 5)); // Arredondar o valor p/ cima
    setFeed(shouldRefresh ? data : [...feed, ...data]); // Incrementar o data junto ao feed já existente, ao invés de substituí-lo
    setPage(pageNumber + 1);
    setLoading(false);
  }
  
  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing (true);

    await loadPage(1, true);
    
    setRefreshing (false);
  }

  // function handleViewableChanged() {

  // }

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        onEndReached={ () => loadPage() }
        onEndReachedThreshold={0.1} // Quando o scroll estiver em 10% do final da lista sera executado onEndReached
        onRefresh={refreshList}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }} // So vai carregar a imagem quando pelo menos 10% da imagem aparecer em tela
        ListFooterComponent={loading && <Loading />}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{ item.author.name }</Name>
            </Header>

            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={ item.aspectRatio }
              smallSource={{ uri: item.small }}
              source={{ uri: item.image }}
            />

            <Description>
              <Name>{ item.author.name }</Name> { item.description }
            </Description>
          </Post>
        )}
      />
    </View>
  );
}

export default Feed;
