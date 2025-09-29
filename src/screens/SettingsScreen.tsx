import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { NavigationStackParamList } from '@/types';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import Button from '@/components/Button';

interface SettingsScreenProps {
  navigation: NavigationProp<NavigationStackParamList>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    autoAdvance: false,
    showHints: true,
    darkMode: true,
    notifications: true,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Progress has been reset.');
          },
        },
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert('Restore Purchases', 'Purchases restored successfully!');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'You can reach us at support@geoguesser.com or through our website.',
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    value: boolean,
    onToggle: () => void,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.darkGray, true: COLORS.primary }}
        thumbColor={value ? COLORS.accent : COLORS.lightGray}
      />
    </View>
  );

  const renderActionItem = (
    title: string,
    description: string,
    onPress: () => void,
    variant: 'primary' | 'outline' | 'accent' = 'outline',
  ) => (
    <View style={styles.actionItem}>
      <View style={styles.actionInfo}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Button
        title="Action"
        onPress={onPress}
        variant={variant}
        size="small"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="small"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          
          {renderSettingItem(
            'Sound Effects',
            'Play sound effects during gameplay',
            settings.soundEnabled,
            () => handleSettingChange('soundEnabled'),
          )}
          
          {renderSettingItem(
            'Vibration',
            'Haptic feedback for interactions',
            settings.vibrationEnabled,
            () => handleSettingChange('vibrationEnabled'),
          )}
          
          {renderSettingItem(
            'Auto Advance',
            'Automatically move to next country after correct guess',
            settings.autoAdvance,
            () => handleSettingChange('autoAdvance'),
          )}
          
          {renderSettingItem(
            'Show Hints',
            'Display helpful hints during gameplay',
            settings.showHints,
            () => handleSettingChange('showHints'),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {renderSettingItem(
            'Dark Mode',
            'Use dark theme throughout the app',
            settings.darkMode,
            () => handleSettingChange('darkMode'),
          )}
          
          {renderSettingItem(
            'Notifications',
            'Receive updates and reminders',
            settings.notifications,
            () => handleSettingChange('notifications'),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Data</Text>
          
          <View style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Reset Progress</Text>
              <Text style={styles.actionDescription}>
                Clear all achievements and statistics
              </Text>
            </View>
            <Button
              title="Reset"
              onPress={handleResetProgress}
              variant="outline"
              size="small"
            />
          </View>
          
          <View style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Restore Purchases</Text>
              <Text style={styles.actionDescription}>
                Restore previously purchased continents
              </Text>
            </View>
            <Button
              title="Restore"
              onPress={handleRestorePurchases}
              variant="primary"
              size="small"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.actionItem}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Contact Support</Text>
              <Text style={styles.actionDescription}>
                Get help or report an issue
              </Text>
            </View>
            <Button
              title="Contact"
              onPress={handleContactSupport}
              variant="accent"
              size="small"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutText}>GeoGuesser v1.0.0</Text>
            <Text style={styles.aboutText}>
              Test your geography knowledge with our interactive country guessing game.
            </Text>
            <Text style={styles.aboutText}>
              Created with ❤️ for geography enthusiasts worldwide.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 GeoGuesser. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.heading,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.xxl,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.title,
    fontFamily: FONTS.headlineBold,
    color: COLORS.white,
    marginBottom: SIZES.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  settingTitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  settingDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  actionInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  actionTitle: {
    fontSize: SIZES.subtitle,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  actionDescription: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
  },
  aboutInfo: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.lg,
  },
  aboutText: {
    fontSize: SIZES.body,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: SIZES.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.body,
    color: COLORS.lightGray,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SettingsScreen;
