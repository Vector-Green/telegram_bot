import type { Knex } from 'knex';
import path from 'path';

declare const BUNDLE_NODE_MODULES: boolean | string;

class WebpackMigrationSource {
  private migrationContext;

  constructor(migrationContext: __WebpackModuleApi.RequireContext) {
    this.migrationContext = migrationContext;
  }

  getMigrations() {
    return Promise.resolve(this.migrationContext.keys().sort());
  }

  getMigrationName(migration: string) {
    return path.parse(migration).base;
  }

  getMigration(migration: string) {
    return this.migrationContext(migration);
  }
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: '../dev.sqlite3',
    },
    migrations: {
      tableName: 'migrations',
      directory: './migrations',
      extension: 'mjs',
      loadExtensions: ['.mjs'],
    },
    seeds: {
      directory: './seeds',
      extension: 'mjs',
      loadExtensions: ['.mjs'],
    },
  },

  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: '../prod.sqlite',
    },
    pool: {
      min: 2,
      max: 10,
    },

    migrations:
      /**
       * Determines if running under knexCli or Webpack.
       * If Webpack, bundles migrations
       * otherwise, uses normal runtime require.
       * Preprocessed by terser.
       */
      typeof BUNDLE_NODE_MODULES === 'boolean' && BUNDLE_NODE_MODULES === true
        ? {
            migrationSource: new WebpackMigrationSource(
              require.context('./migrations', false, /^\.\/.*\.mjs$/),
            ),
          }
        : {
            tableName: 'migrations',
            directory: './migrations',
            extension: 'mjs',
            loadExtensions: ['.mjs'],
          },
  },
};
export default config;
