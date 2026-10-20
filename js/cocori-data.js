/* Cocori, the chatbot. She answers from the lines below (and from the company boards in jobs-data.js).
   She is a simple helper, not an AI: she matches words in the question.

   greeting   the first thing she says
   chips      the suggested questions shown under the chat
   topics     quick search buttons: they list every project that mentions the word
   faq        one entry per topic: k = words to listen for (lowercase), a = her answer
   fallback   what she says when she has no answer
   Edit, add or remove entries freely. Keep answers to things you are happy to say publicly. */
window.COCORI = {
  name: 'Cocori',
  greeting: 'Hi, I’m Cocori! Ask me about Divya’s work, the tools she knows or how to reach her.',
  chips: ['Does Divya know POS systems?', 'What about ERP?', 'Which tools has she worked with?'],
  topics: ['Automation', 'Dashboards', 'Inventory', 'Forecasting', 'POS', 'ERP'],
  fallback: 'Hmm, I don’t have an answer for that one. Drop Divya a message in the bottle in the pond and she’ll write back.',
  faq: [
    { k: ['hi', 'hello', 'hey'], a: 'Hello! Ask me anything about Divya’s work.' },
    { k: ['who is', 'about divya', 'about her', 'tell me about', 'introduce', 'summary', 'overview'],
      a: 'Divya has 10+ years of experience managing supply chain end to end, and she’s on a mission to help small and medium businesses scale efficiently.' },
    { k: ['pos', 'point of sale', 'clover', 'toast', 'square', 'lightspeed'],
      a: 'Yes. She knows Clover, Toast, Square, Lightspeed and Shopify POS. At Suppli she added product descriptions into restaurants’ POS systems, and at Chocosol she is researching a replacement for Clover that covers inventory.' },
    { k: ['erp', 'enterprise resource', 'sage', 'vba'],
      a: 'At ALLMAX she designed and built a custom ERP in Excel VBA that connects to Sage through SQL data tables. It covers ordering, labels and shipping, a forecast report and custom reports for each department. She also implemented ERP at Future Foam.' },
    { k: ['mrp', 'katana', 'inventory'],
      a: 'She works with Katana MRP at Chocosol: inventory transfers into Katana through Zapier, plus an executive dashboard on top. At Suppli she built a custom inventory tool that led to 45% fewer stockouts.' },
    { k: ['tool', 'tools', 'tech', 'stack', 'software', 'skills', 'worked with', 'use'],
      a: 'Advanced Excel VBA, SQL, Google Suite and Apps Script, Zapier, Katana MRP, Shopify, Sage, QBO, HubSpot, Zoho Inventory, AWS and Redshift, and Looker Studio.' },
    { k: ['automat', 'workflow', 'api', 'zapier', 'script'],
      a: 'Automation is her thing: a forecast report that went from 3 days to 3 minutes, inventory workflows automated by 80% at Chocosol, and API workflows that cut 55% of ops hours at Suppli.' },
    { k: ['dashboard', 'kpi', 'report', 'looker', 'analytics'],
      a: 'She builds dashboards in Looker Studio and Excel: KPI and order dashboards at Suppli, an executive dashboard at Chocosol and custom reports for each department at ALLMAX.' },
    { k: ['where has', 'where did', 'work history', 'experience', 'companies', 'employer', 'career', 'worked'],
      a: 'ALLMAX Nutrition and Chocosol (process automation consultant), Suppli (first operations employee), Future Foam and Digital Room Inc. Open “My work” to see each one.' },
    { k: ['fun', 'prototype', 'hpsc', 'invoice', 'swish', 'game', 'side project'],
      a: 'For fun she built a QR bus voucher system for High Park Ski Club, a vendor invoice portal with an invoice reader, and a basketball game called Swish Signs. They are in the fun house.' },
    { k: ['contact', 'reach', 'email', 'hire', 'message', 'talk to', 'work together', 'available'],
      a: 'Send her a message in the bottle floating in the pond. She’ll write back.' },
    { k: ['where are', 'location', 'toronto', 'based', 'live'],
      a: 'Divya is based in Toronto.' },
    { k: ['resume', 'cv', 'curriculum'], a: 'You can open Divya\u2019s resume with the Resume button at the top right of the forest page.' },
    { k: ['thank', 'thanks'], a: 'Anytime!' }
  ]
};
