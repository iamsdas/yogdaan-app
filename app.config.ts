import {
  AndroidManifest,
  ConfigPlugin,
  withAndroidManifest,
} from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import xml2js from 'xml2js';

const queriesXml = `
<queries>
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="wc"/>
  </intent>
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="https"/>
  </intent>
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="wss"/>
  </intent>
</queries>`;

type KeyValuePair = {
  $: {
    [key: string]: string | undefined;
  };
};

type Intent = {
  action?: KeyValuePair[];
  data?: KeyValuePair[];
};

type Queries = {
  intent?: Intent[];
};

type ParseResult = {
  queries: Queries;
};

type AndroidManifestWithQuery = AndroidManifest & {
  manifest: {
    $: {
      ['queries']?: any;
    };
  };
};

/**
 * Does not currently work as expected, need to run `expo prebuild`
 * to configure plugins, but this breaks the `Expo Go` app functionality
 *
 * @param androidManifest A AndroidManifest file that has been updated
 *                        to accept queries as a parameter
 * @returns an updated AndroidManifest file
 *
 * @see https://chafikgharbi.com/expo-android-manifest/
 * @see https://docs.expo.dev/workflow/customizing/
 * @see https://docs.expo.dev/workflow/configuration/
 * @see https://docs.expo.dev/guides/config-plugins/#modifying-the-androidmanifestxml
 */
const addQueryToManifest = (androidManifest: AndroidManifestWithQuery) => {
  const { manifest } = androidManifest;
  let packageQuery: Queries;

  xml2js.parseString(queriesXml, (err, result: ParseResult) => {
    packageQuery = result.queries;

    if (!Array.isArray(manifest.$['queries'])) {
      manifest.$['queries'] = [];
    }

    manifest.$['queries'].push(packageQuery);
  });

  return androidManifest;
};

const withPackageVisibility: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    config.modResults = addQueryToManifest(config.modResults);
    return config;
  });
};

const config: ExpoConfig = {
  name: 'yogdaan',
  slug: 'yogdaan',
  version: '1.0.0',
  orientation: 'portrait',
  jsEngine: 'hermes',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'yogdaan',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
};

export default withPackageVisibility(config);
