import { Image, StyleSheet, View } from 'react-native';

interface BrandLogoProps {
  /** Width/height of the logo itself. Default 40. */
  size?: number;
  /**
   * Renders the logo inside a white rounded container — use on
   * colored headers/top bars so the logo stays readable.
   */
  onPrimary?: boolean;
  /**
   * 'watermark' renders the logo at 5% opacity as a purely decorative
   * layer. The parent screen owns positioning and stacking; the image
   * never intercepts touches.
   */
  variant?: 'default' | 'watermark';
}

export default function BrandLogo({ size = 40, onPrimary = false, variant = 'default' }: BrandLogoProps) {
  if (variant === 'watermark') {
    return (
      <Image
        source={require('@/assets/Logo.png')}
        style={{ width: size, height: size, opacity: 0.05 }}
        resizeMode="contain"
      />
    );
  }

  const image = (
    <Image
      source={require('@/assets/Logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );

  if (!onPrimary) return image;

  return (
    <View
      style={[
        styles.badge,
        {
          width: size + 12,
          height: size + 12,
          borderRadius: (size + 12) / 2,
        },
      ]}
    >
      {image}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
