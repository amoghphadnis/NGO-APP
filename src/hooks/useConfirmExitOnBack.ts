import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

/**
 * Intercepts the Android hardware back button on a form screen and
 * asks for confirmation before discarding entered data.
 *
 * @param enabled  Whether the guard is active (e.g. only while the
 *                 form has unsaved input, or always on entry screens).
 * @param onExit   Called when the user confirms discard — defaults to
 *                 letting the back press through.
 */
export function useConfirmExitOnBack(onExit?: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onBackPress = () => {
      Alert.alert(
        'Discard changes?',
        'Going back will lose the details you have entered in this form.',
        [
          { text: 'Keep Editing', style: 'cancel', onPress: () => {} },
          { text: 'Discard', style: 'destructive', onPress: () => onExit?.() },
        ]
      );
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [enabled, onExit]);
}
