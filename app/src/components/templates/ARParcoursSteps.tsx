import React, { useState } from 'react';

import { View, ViewProps } from 'react-native';
import ARParcourInitialStep from '../organisms/ARParcourCreationSteps/ARParcourInitialStep';
import ARParcourRecordingStep from '../organisms/ARParcourCreationSteps/ARParcourRecordingStep';
import { Position } from 'geojson';
import ARParcourNameStep from '../organisms/ARParcourCreationSteps/ARParcourNameStep';

type ARParcoursStepsProps = {
  onStarted: () => void;
  onUpdate: (points: Position[]) => void;
  onSave: (
    name: string,
    elapsedTime: number,
    totalDistance: number,
    averageSpeed: number,
  ) => void;
} & ViewProps;

enum Steps {
  INITIAL,
  RECORDING,
  TITLE,
}

export default ({
  onStarted,
  onUpdate,
  onSave,
  ...props
}: ARParcoursStepsProps) => {
  const [step, setStep] = useState<Steps>(Steps.INITIAL);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState<number>(0);

  const onParcourCreationStarted = () => {
    setStep(Steps.RECORDING);
    onStarted();
  };

  const onParcourRecordingEnded = (eT: number, tD: number, aS: number) => {
    setElapsedTime(eT);
    setTotalDistance(tD);
    setAverageSpeed(aS);
    setStep(Steps.TITLE);
  };

  const onParcourValidated = (name: string) => {
    setStep(Steps.INITIAL);
    onSave(name, elapsedTime, totalDistance, averageSpeed);
  };

  return (
    <View {...props}>
      {step === Steps.INITIAL && (
        <ARParcourInitialStep onStart={onParcourCreationStarted} />
      )}
      {step === Steps.RECORDING && (
        <ARParcourRecordingStep
          onPointsUpdate={onUpdate}
          onEnded={onParcourRecordingEnded}
        />
      )}
      {step === Steps.TITLE && (
        <ARParcourNameStep onValidate={onParcourValidated} />
      )}
    </View>
  );
};
