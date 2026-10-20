/* Small bits of text for the forest page. Leave a field empty to show "coming soon".

   contact.email        your email address, shown as a link under the form
   contact.linkedin     full LinkedIn address
   contact.youtube      full YouTube channel address
   contact.googleForm   use a Google Form instead (see README: "Contact form with Google Forms")
   contact.endpoint     where the message form sends to (see README: "Contact form")
   contact.accessKey    your Web3Forms access key (only for Web3Forms)
   credit               the artwork credit, one line per item
   creditLink           optional link shown after the credit
*/
window.SITE = {
  contact: { email: '', linkedin: '', youtube: '',
    googleForm: {
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSdrDsLuWXsFi7TKcaqk1fWJY9Tj7rYnurD08esfRKgZLFeP2Q/formResponse',
      contactField: 'entry.1073667587',
      messageField: 'entry.751101258'
    },
    endpoint: 'https://api.web3forms.com/submit', accessKey: '' },
  credit: [
    'The homepage background, the fun mushroom background and the assets (mushroom houses, rose plant and Cocori) were brought to life from my vision by the talented Julia, connected via itch.io and Fiverr.',
    'The job route and work experience scenes are sourced from itch.io artist DoubleFree.'
  ],
  creditLink: ''
};
