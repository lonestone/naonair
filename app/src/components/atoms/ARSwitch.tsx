import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native';

export interface HeaderProps {
  onChange: (value: boolean) => void;
  value: boolean;
  loading: boolean;
  disabled: boolean;
}

const ARSwitch = ({ onChange, value, loading, disabled }: HeaderProps) => {
  const [isEnabled, setIsEnabled] = useState(value);

  useEffect(() => {
    setIsEnabled(value);
  }, [value]);

  const handleSwitchChange = (newValue: boolean) => {
    if (!loading && !disabled) {
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
      disabled={disabled}
    />
  );
};

export default ARSwitch;
