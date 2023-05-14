/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from '../Utils/Text';
import LinearGradient from 'react-native-linear-gradient';
import IconButton from '../Components/IconButton.component';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {likeMovie} from '../Store/userSlice';
import {poster_path, bg_path} from '../Utils/Constants';
import Loading from '../Components/Loading.component';

const {width: PAGE_WIDTH} = Dimensions.get('window');

const MovieScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const {movie, movieId} = route.params;
  const dispatch = useDispatch();

  const [movieDetails, setMovie] = useState(movie ? movie : null);
  const [streaming, setStreaming] = useState(null);
  const [fetchingMovie, setFetching] = useState(movieId ? true : false);

  const {favorite, watchlist} = useSelector(state => state.user);

  const [isLiked, setIsLiked] = useState(
    favorite.some(fav => fav._id.includes(movieDetails?._id)) ?? false,
  );
  const [isInList, setIsList] = useState(
    watchlist.some(item => item._id.includes(movieDetails?._id)) ?? false,
  );

  const getMovie = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=b36be16db427f6f84a8c93802b633757&language=en-US`,
    )
      .then(data => data.json())
      .catch(e => {
        console.log('ERROR MOVEI', e);
      });
    const {
      id: tmdbId,
      backdrop_path: bg,
      poster_path: img,
      overview: overview,
      genres: genres,
      runtime: runtime,
      title: title,
    } = res;
    let movieParams = {
      bg: bg_path + bg,
      img: poster_path + img,
      overview,
      genres,
      runtime,
      title,
      tmdbId,
    };

    if (res.belongs_to_collection) {
      const {id, name} = res.belongs_to_collection;
      movieParams.series = {id, name};
    }
    console.log('PARAMS', res);
    console.log('LALALALA', res.spoken_languages);
    movieParams.language =
      res.spoken_languages.length !== 0
        ? res.spoken_languages[0].english_name
        : null;

    setMovie(movieParams);
    setFetching(false);
  };

  useEffect(() => {
    if (movieId) {
      console.log('USE EFFECT MOVIEID', movieId);
      setFetching(true);
      getMovie().then(() => {
        setFetching(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  useEffect(() => {
    const getStream = async () => {
      const stream = await fetch(
        `https://api.themoviedb.org/3/movie/${movieDetails.tmdbId}/watch/providers?api_key=b36be16db427f6f84a8c93802b633757`,
      ).then(data => data.json());
      if (stream.results?.IN?.flatrate) {
        setStreaming({
          stream: stream.results.IN.flatrate[0],
          link: stream.results.IN.link,
        });
      } else if (stream.results?.IN?.rent) {
        const rents = stream.results.IN.rent.map(item => {
          return item.provider_name;
        });
        setStreaming({rent: rents, link: stream.results.IN.link});
      }
    };
    getStream();
  }, [movieDetails]);

  const handlePress = async url => {
    await Linking.openURL(url);
  };

  const onLikePress = () => {
    dispatch(
      likeMovie({
        type: 'favorite',
        like: isLiked ? 'delete' : 'add',
        movie: movieDetails,
      }),
    );
    setIsLiked(!isLiked);
  };

  const onListPress = () => {
    dispatch(
      likeMovie({
        type: 'watchlist',
        like: isInList ? 'delete' : 'add',
        movie: movieDetails,
      }),
    );
    setIsList(!isInList);
  };

  if (fetchingMovie) {
    return <Loading loading={fetchingMovie} />;
  } else {
    return (
      <>
        <View style={styles.iconContainer}>
          <IconButton
            onPress={() => navigation.goBack()}
            icon="chevron-left"
            size={30}
            // color="rgba(255, 255, 255, 0.7)"
          />
          <IconButton
            icon={isLiked ? 'favorite' : 'favorite-outline'}
            size={30}
            onPress={onLikePress}
          />
        </View>
        <ScrollView
          style={[styles.container, {backgroundColor: colors.background}]}>
          <View>
            <ImageBackground
              source={{
                uri: movieDetails.img,
              }}
              style={{width: PAGE_WIDTH, height: undefined, aspectRatio: 2 / 3}}
            />
            <LinearGradient
              style={styles.gradient}
              colors={['transparent', colors.background]}
              locations={[0.3, 0.95]}
            />
          </View>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{paddingHorizontal: 16}}>
            <View style={styles.heading}>
              <Text variant="headlineMedium">{movieDetails.title}</Text>
              <IconButton
                icon={isInList ? 'playlist-add-check' : 'playlist-add'}
                size={30}
                onPress={onListPress}
              />
            </View>
            <View style={styles.genreContainer}>
              {movieDetails.genres?.map(item => {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.genreItem,
                      {backgroundColor: colors.backdrop},
                    ]}>
                    <Text>{item.name}</Text>
                  </View>
                );
              })}
              <View style={styles.languageContainer}>
                {movieDetails.language && (
                  <Text style={styles.language}> {movieDetails.language}</Text>
                )}
                {movieDetails.runtime ? (
                  <Text style={styles.language}>
                    |{'   '}
                    {movieDetails.runtime} minutes
                  </Text>
                ) : (
                  <Text />
                )}
              </View>
            </View>
            <Text color="under" style={styles.detail}>
              {movieDetails.overview}
            </Text>
            {movieDetails.series && (
              <Text variant="bodyMedium" style={styles.detail}>
                This movie is a part of {movieDetails.series.name}.
              </Text>
            )}
            {streaming?.stream && (
              <TouchableOpacity
                onPress={() => handlePress(streaming.link)}
                style={[styles.streaming, {backgroundColor: colors.primary}]}>
                <Text
                  color="background"
                  variant="labelLarge"
                  style={styles.streamingText}>
                  Watch Now with {streaming.stream.provider_name}
                </Text>
                <FastImage
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/original' +
                      streaming.stream.logo_path,
                  }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {streaming?.rent && (
              <TouchableOpacity
                onPress={() => handlePress(streaming.link)}
                style={[styles.streaming, {backgroundColor: colors.primary}]}>
                <Text
                  color="background"
                  variant="labelLarge"
                  style={styles.streamingText}>
                  Rent on {streaming.rent.join(', ')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.footer} />
        </ScrollView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 30,
    height: 42,
    width: '100%',
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    width: PAGE_WIDTH,
    flexWrap: 'wrap',
  },
  genreItem: {
    marginRight: 12,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageContainer: {
    paddingVertical: 4,
    marginTop: 8,
    flexDirection: 'row',
  },
  language: {marginRight: 12},
  detail: {marginVertical: 8},
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  streaming: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginVertical: 24,
  },
  streamingText: {marginHorizontal: 8},
  footer: {paddingVertical: 8},
});

export default MovieScreen;
