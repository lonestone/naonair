import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native';

export interface HeaderProps {
  onChange: (value: boolean) => void;
  value: boolean;
  loading: boolean;
}

const ARSwitch = ({ onChange, value, loading }: HeaderProps) => {
  const [isEnabled, setIsEnabled] = useState(value);

  useEffect(() => {
    setIsEnabled(value);
  }, [value]);

  const handleSwitchChange = (newValue: boolean) => {
    if (!loading) {
      setIsEnabled(newValue);
      onChange(newValue);
    }
  };

  return (
    <Switch
      trackColor={{ false: '#B2B2C1', true: '#4863F1' }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#B2B2C1"
      onValueChange={handleSwitchChange}
      value={isEnabled}
    />
  );
};

export default ARSwitch;
