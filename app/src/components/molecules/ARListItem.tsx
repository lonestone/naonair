import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({});

interface ARListItemProps {
  categorie: string;
  nom: string;
  adresse: string;
}

const ARListItem = ({categorie, nom, adresse}: ARListItemProps) => {
  return (
    <View>
      <Text>{categorie}</Text>
      <Text>{nom}</Text>
      <Text>{adresse}</Text>
    </View>
  );
};

export default ARListItem;
