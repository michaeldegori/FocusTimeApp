import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

import { colors } from '../../utils/colors';
import { fontSizes, spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

const DEFAULT_TIME = 0.1
export const Timer = ({ focusSubject, onTimerEnd, onCancel }) => {
  useKeepAwake();

  const interval = React.useRef(null);
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(10000)
    }
  } 

  const onEnd = () => {
    vibrate();
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd();
  };

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.newFocusWrapper}>
        <Text style={styles.newFocus} onPress={onCancel}>Cancel</Text>
      </View>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focussing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View style={{ paddingTop: spacing.md }}>
        <ProgressBar
          progress={progress}
          color="#5E84E2"
          style={{ height: 10 }}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={styles.buttonWrapper}>
        {isStarted ? (
          <RoundedButton title="Pause" onPress={() => setIsStarted(false)} />
        ) : (
          <RoundedButton title="Start" onPress={() => setIsStarted(true)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.xl,
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    fontSize: fontSizes.xl,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newFocus: {
    fontSize: fontSizes.lg,
    // fontWeight: 'bold',
    color: colors.yellow
  },
  newFocusWrapper: {
    flex: 0.1,
    justifyContent: 'center',
    paddingLeft: spacing.md
  }
});
