import React, { useEffect, useContext } from 'react';

import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import Home from "./Home"
import VotingRoom from "./VotingRoom"
import ExpandedModal from './ExpandedModal'
import SearchScreen from './SearchScreen'
import withToast from '../HOCs/WithToast'

import { GET_ME } from "../graphql/queries"
import { useApolloClient } from '@apollo/react-hooks'
import { User, Image } from "../types"
import { TILE_TYPES } from "../components/VotingRoom/MusicTile"

import SpotifyContext from "../spotify/spotifyContext"

export interface getMeResponseType {
  me: User
}

type RootStackParamList = {
  Home: undefined;
  VotingRoom: undefined;
  ExpandedModal: {
    roomId: string
    id: string
    primaryLabel: string
    secondaryLabel: string
    image: string
    href: string
    type: TILE_TYPES
    album: {
      images: Image
    }
  },
  SearchScreen: undefined
};

export type HomeRouteProps = RouteProp<RootStackParamList, 'Home'>;
export type VotingRoomRouteProps = RouteProp<RootStackParamList, 'VotingRoom'>;
export type ExpandedModalRouteProps = RouteProp<RootStackParamList, 'ExpandedModal'>;

const AppStack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator()
const VotingRoomStack = createStackNavigator()
const Tab = createBottomTabNavigator()

const forFade = ({ current, closing }: {current: any, closing: any}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});


const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
    <SearchStack.Screen name="ExpandedModal" component={ExpandedModal} />
  </SearchStack.Navigator>
)

const VotingRoomStackScreen = () => (
  <VotingRoomStack.Navigator screenOptions={{ headerShown: false }}>
    <VotingRoomStack.Screen name="VotingRoom" component={VotingRoom}/>
  </VotingRoomStack.Navigator>
)

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="VotingRoom" component={VotingRoomStackScreen} />
    <Tab.Screen name="SearchScreen" component={SearchStackScreen} />
  </Tab.Navigator>
)

const Screens = () => {
  const client = useApolloClient()
  const { token, withRenew } = useContext(SpotifyContext)
  
  const getMe = async () => {
    // call the result so future calls can get this from cache
    await client.query({
      query: GET_ME,
      variables: {
        accessToken: token
      },
      fetchPolicy: "network-only",
      errorPolicy: 'none'
    })
  }


  useEffect(() => {
    if (token) {
      withRenew(getMe)
    }
  }, [token])

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="VotingRoom" component={AppTabs} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default withToast(Screens)