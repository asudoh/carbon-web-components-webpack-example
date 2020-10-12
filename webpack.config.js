'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const acceptLanguageParser = require('accept-language-parser');
const autoprefixer = require('autoprefixer');
const Handlebars = require('handlebars');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { default: LocaleAPI } = require('@carbon/ibmdotcom-services/lib/services/Locale/Locale');
const { default: TranslateAPI } = require('@carbon/ibmdotcom-services/lib/services/Translation/Translation');

const readFile = promisify(fs.readFile);

const templateCache = {};

global.sessionStorage = {
  getItem() {
    return '""';
  },
  setItem() {},
};

const devServer = {
  contentBase: path.resolve(__dirname, 'src'),
  setup(app, server) {
    app.get('/', (req, res) => {
      const { fileSystem, waitUntilValid } = server.middleware;
      waitUntilValid(async () => {
        const filename = path.resolve(__dirname, 'dist/index.hbs');
        if (!templateCache[filename]) {
          templateCache[filename] = Handlebars.compile(fileSystem.readFileSync(filename).toString());
        }
        const { code, region } = acceptLanguageParser.parse(req.headers['accept-language'])[0];
        const [langDisplay, localeList, translation] = await Promise.all([
          LocaleAPI.getLangDisplay({
            cc: region,
            lc: code,
          }),
          LocaleAPI.getList({
            cc: region,
            lc: code,
          }),
          TranslateAPI.getTranslation({
            cc: region,
            lc: code,
          }),
        ]);
        const { localeModal, regionList } = localeList;
        const collator = new Intl.Collator(`${code}-${region}`);
        const sortCountries = countries => countries.sort((lhs, rhs) => collator.compare(lhs.name, rhs.name));
        const locales = new Map();
        regionList.forEach(({ countryList, name: regionItem }) => {
          sortCountries(countryList).forEach(({ name: countryItem, locale: localeItems }) => {
            localeItems.forEach(([localeItem, languageItem]) => {
              const localeTokens = /^(\w+)-(\w+)$/.exec(localeItem) || [];
              locales.set(
                localeItem,
                {
                  locale: localeItem,
                  region: regionItem,
                  country: countryItem,
                  href: `https://www.ibm.com/${localeTokens[2]}-${localeTokens[1]}`,
                  language: languageItem,
                }
              );
            });
          });
        });
        const { mastheadNav, profileMenu, footerMenu, footerThin } = translation;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=0');
        res.send(templateCache[filename](
          {
            allCountryList: Array.from(locales.values()),
            langDisplay,
            navLinks: mastheadNav.links.map(link => ({
              ...link,
              menuItems: !link.menuSections ? undefined : link.menuSections.reduce((acc, { menuItems }) => acc.concat(menuItems), [])
            })),
            profileItems: profileMenu.signedin,
            footerLinks: footerMenu,
            legalLinks: footerThin,
            regionList,
            localeModal,
          }
        ));
        res.end();
      });
    });
  },
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules'],
                data: `
                  $feature-flags: (
                    enable-css-custom-properties: true,
                  );
                `,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.hbs',
      filename: 'index.hbs',
    }),
  ],
  devServer,
};
