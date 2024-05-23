import React, { useState } from 'react';

import { View, ViewProps } from 'react-native';
import ARParcourInitialStep from '../organisms/ARParcourCreationSteps/ARParcourInitialStep';

type ARParcoursStepsProps = {
  onStarted: () => void;
  onStopped: () => void;
} & ViewProps;

enum Steps {
  INITIAL,
  RECORDING,
  TITLE,
}

export default ({ onStarted, onStopped, ...props }: ARParcoursStepsProps) => {
  const [step, setStep] = useState<Steps>(Steps.INITIAL);
  void onStopped; // TODO: implement

  const onParcourCreationStarted = () => {
    setStep(Steps.RECORDING);
    onStarted();
  };

  return (
    <View {...props}>
      {step === Steps.INITIAL && (
        <ARParcourInitialStep onStart={onParcourCreationStarted} />
      )}
    </View>
  );
};
