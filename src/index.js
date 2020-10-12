import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-container.js';
import '@carbon/ibmdotcom-web-components/es/components/footer/footer-container.js';
import './index.scss';

window.digitalData = {
  page: {
    pageInfo: {
      language: 'en-US',
      ibm: {
        siteID: 'IBMTESTWWW',
      },
    },
    isDataLayerReady: true,
  },
};

document.addEventListener('click', event => {
  if (event.target.matches('dds-locale-button')) {
    document.querySelector('dds-locale-modal').open = true;
  }
});
