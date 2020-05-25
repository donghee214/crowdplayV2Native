import React, { useEffect, useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./Home"

import { GET_ME } from "../graphql/queries"
import { useLazyQuery } from '@apollo/react-hooks'
import { useApolloClient } from '@apollo/react-hooks'
import { User } from "../types"

import SpotifyContext from "../spotify/spotifyContext"

export interface getMeResponseType {
  me: User
}


const Stack = createStackNavigator();

export default () => {
  const { withRenew } = useContext(SpotifyContext)
  

  const getMe = async () => {
    const client = useApolloClient()
    const { token } = useContext(SpotifyContext)
    const data = await client.query({
      query: GET_ME,
      variables: {
        accessToken: token
      },
      fetchPolicy: "network-only",
      errorPolicy: 'none'
    })
  }

  useEffect(() => {
    withRenew(getMe)
  }, [])

  return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
  );
};