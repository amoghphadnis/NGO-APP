import { parseDecimalInput, sanitizeDecimalInput } from '@/utils/decimalInput';
import React, { useState } from 'react';
import VPInputField from './VPInputField';

type VPInputFieldProps = React.ComponentProps<typeof VPInputField>;

interface DecimalInputFieldProps extends Omit<VPInputFieldProps, 'value' | 'onChangeText' | 'keyboardType'> {
  /** Numeric form value. Display text is kept raw so intermediate input like "85." isn't swallowed. */
  value?: number | null;
  onChangeValue: (value: number | undefined) => void;
}

/**
 * Numeric input that supports decimals. Wraps VPInputField with a raw-text
 * buffer and the decimal-pad keyboard (numeric keypad has no '.' on Android).
 */
export default function DecimalInputField({ value, onChangeValue, ...rest }: DecimalInputFieldProps) {
  const [text, setText] = useState(value != null ? String(value) : '');

  return (
    <VPInputField
      {...rest}
      value={text}
      keyboardType="decimal-pad"
      onChangeText={(t) => {
        const clean = sanitizeDecimalInput(t);
        setText(clean);
        onChangeValue(parseDecimalInput(clean));
      }}
    />
  );
}
