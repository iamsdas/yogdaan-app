import {
  AndroidManifest,
  ConfigPlugin,
  withAndroidManifest,
} from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import xml2js from 'xml2js';
import 'dotenv/config';

const RPC_URL = process.env.RPC_URL ?? 'https://rpc-mumbai.matic.today';

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
  extra: {
    RPC_URL,
  },
};

export default withPackageVisibility(config);
