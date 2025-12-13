import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { fontFamily } from './index';

interface TextProps extends RNTextProps {
  weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
}

export const Text = ({ style, weight = 'regular', ...props }: TextProps) => {
  const fontStyle = {
    fontFamily: fontFamily[weight],
  };

  return <RNText style={[fontStyle, style]} {...props} />;
};