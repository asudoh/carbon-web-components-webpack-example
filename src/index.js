import { html, render } from 'lit-html';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-menu-button.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-logo.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/top-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/top-nav-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/top-nav-menu.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/top-nav-menu-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-overlay.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-global-bar.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-profile.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-profile-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-search-container.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer-logo.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer-nav-group.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer-nav-item.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/legal-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/legal-nav-item.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/legal-nav-cookie-preferences-placeholder.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/locale-button.js';
import LocaleAPI from '@carbon/ibmdotcom-services/lib/services/Locale/Locale.js';
import TranslateAPI from '@carbon/ibmdotcom-services/lib/services/Translation/Translation.js';
import './index.scss';

const code = 'en';
const region = 'US';

window.digitalData = {
  page: {
    pageInfo: {
      language: `${code}-${region}`,
      ibm: {
        siteID: 'IBMTESTWWW',
      },
    },
    isDataLayerReady: true,
  },
};

(async () => {
  const [langDisplay, translation] = await Promise.all([
    LocaleAPI.getLangDisplay({
      cc: region.toLowerCase(),
      lc: code.toLowerCase(),
    }),
    TranslateAPI.getTranslation({
      cc: region.toLowerCase(),
      lc: code.toLowerCase(),
    }),
  ]);

  const { mastheadNav, profileMenu, footerMenu, footerThin } = translation;
  const navLinks = mastheadNav.links.map(link => ({
    ...link,
    menuItems: !link.menuSections ? undefined : link.menuSections.reduce((acc, { menuItems }) => acc.concat(menuItems), [])
  }));

  const mastheadTemplateResult = html`
    <dds-masthead-menu-button></dds-masthead-menu-button>
    <dds-masthead-logo></dds-masthead-logo>
    <dds-top-nav menu-bar-label="IBM [Platform]">
      ${navLinks.map(({ title, url, menuItems }) => !menuItems ? html`
        <dds-top-nav-item href="${url}" title="${title}"></dds-top-nav-item>
      ` : html`
        <dds-top-nav-menu menu-label="${title}" trigger-content="${title}">
          ${menuItems.map(({ title: menuItemTitle, url: menuItemUrl }) => html`
            <dds-top-nav-menu-item href="${menuItemUrl}" title="${menuItemTitle}"></dds-top-nav-menu-item>
          `)}
        </dds-top-nav-menu>
      `)}
    </dds-top-nav>
    <dds-masthead-search-container></dds-masthead-search-container>
    <dds-masthead-global-bar>
      <dds-masthead-profile authenticated>
        ${profileMenu.signedin.map(({ title, href }) => html`
          <dds-masthead-profile-item href="${href}">${title}</dds-masthead-profile-item>
        `)}
      </dds-masthead-profile>
    </dds-masthead-global-bar>
    <dds-left-nav-overlay></dds-left-nav-overlay>
    <dds-left-nav menu-bar-label="IBM [Platform]">
      ${navLinks.map(({ title, url, menuItems }) => !menuItems ? html`
        <dds-left-nav-item href="${url}">${title}</dds-left-nav-item>
      ` : html`
        <dds-left-nav-menu title="${title}">
          ${menuItems.map(({ title: menuItemTitle, url: menuItemUrl }) => html`
            <dds-left-nav-menu-item href="${menuItemUrl}">${title}</dds-left-nav-menu-item>
          `)}
        </dds-left-nav-menu>
      `)}
    </dds-left-nav>
  `;

  const footerTemplateResult = html`
    <dds-footer-logo slot="brand"></dds-footer-logo>
    <dds-footer-nav>
      ${footerMenu.map(({ title, links }) => html`
        <dds-footer-nav-group title-text="${title}">
          ${links.map(({ title, url }) => html`
            <dds-footer-nav-item href="${url}">${title}</dds-footer-nav-item>
          `)}
        </dds-footer-nav-group>
      `)}
    </dds-footer-nav>
    <dds-locale-button slot="locale-button">${langDisplay}</dds-locale-button>
    <dds-legal-nav slot="legal-nav">
      ${footerThin.map(({ title, url }) => html`
        <dds-legal-nav-item href="${url}">${title}</dds-legal-nav-item>
      `)}
      <dds-legal-nav-cookie-preferences-placeholder></dds-legal-nav-cookie-preferences-placeholder>
    </dds-legal-nav>
  `;

  render(mastheadTemplateResult, document.querySelector('dds-masthead'));
  render(footerTemplateResult, document.querySelector('dds-footer'));
})();
