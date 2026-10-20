/* The companies on the job board.

   One entry per company. The order here is the order of the arrows on the signpost
   (top to bottom). Anything left empty shows "Coming soon" on the wooden boards.

   slug          lowercase, no spaces; used in the page address (#jobs/allmax)
   name          shown on the arrow and on the banner
   industry      the sector, one short line, shown under the name
   about         a brief description of the company, shown in the banner
   link          optional { url, label } shown under the description in the banner
   role          your role: one sentence, or a list of sentences
   managed       people managed (a number or text like '20+'); leave null to hide the badge
   tools         tools you used, e.g. ["Excel VBA", "SQL"]
   achievements  the highlights, one item per line
   photos        optional pictures under the highlights: { src, alt, caption }
                 (leave src '' until the image is in assets/jobs/screens/)
   projects      one line each; click to drop down the write-up. Leave [] to hide the board.
                 { name, status (optional chip, e.g. 'In progress'),
                   explainer (optional one-line intro),
                   video (optional YouTube link; shown as a button, no preview),
                   sections: [ { label: 'Challenge', text: 'one paragraph, or a list of lines' } ],
                   screenshots: [ { src, alt } ] (optional) }
   Every project uses the same four sections: My role, Challenge, Solution, Result.
*/
window.JOBS = [

  /* ---------------------------------------------------------------- ALLMAX */
  {
    slug: 'allmax',
    name: 'ALLMAX',
    industry: 'CPG · Nutrition',
    about: 'ALLMAX Nutrition produces high-grade nutritional formulas: protein powders, creatine and vitamins.',
    link: null,
    role: 'Process automation consultant.',
    managed: null,
    tools: ['Advanced Excel VBA', 'SQL data tables', 'Sage', 'Claude AI'],
    achievements: [
      'Turned a 3-day manual forecast report into a 1-click process that runs in 3 minutes, by automating data integration across Sage SQL servers with advanced VBA in Excel.',
      'Enabled clear tracking of orders across every stage, giving leadership real-time progress visibility and cross-departmental accountability.'
    ],
    photos: [],
    projects: [
      {
        name: '📈 Forecast report',
        video: '',
        sections: [
          { label: 'My role', text: 'Built the automated forecast report for the procurement team.' },
          { label: 'Challenge', text: 'The report took 3 days of manual work, pulling data separately from multiple sources and plugging it in for 200+ SKUs.' },
          { label: 'Solution', text: 'Automated the data integration across the Sage SQL servers with VBA. It shows 18-month sales, average sales and stock months of supply (MOS) for 200+ SKUs, so procurement can source ingredients and place orders.' },
          { label: 'Result', text: '3 days became a 1-click run that takes 3 minutes.' }
        ]
      },
      {
        name: '📦 Order prediction',
        video: '',
        sections: [
          { label: 'My role', text: 'Built a tool that works out how much quantity to order, based on demand and sales history.' },
          { label: 'Challenge', text: 'To find what to order for SKUs under 10 months of supply, users flipped through a 60+ page report by hand.' },
          { label: 'Solution', text: 'Custom code pulls data from the Sage server. The tool calculates the order quantity for each SKU from its average monthly sales (last 3 months) and remaining supply, and deducts stock that will expire within a year.' },
          { label: 'Result', text: 'A week of manual calculations across a 60+ page report became a 1-click run that takes under a minute.' }
        ]
      },
      {
        name: '🔗 ERP: ordering, labels and shipping',
        video: '',
        explainer: 'One connected layer over the whole order journey. Each department keeps its own simple workbook (PO tracking, labels, logistics) and they hand work to each other.',
        sections: [
          { label: 'My role', text: 'Built an ERP layer connecting all the departments in operations.' },
          { label: 'Challenge', text: 'Orders take anywhere from 3 months to 2 years to fulfil, and their progress often got lost between the product, labels and logistics departments.' },
          { label: 'Solution', text: [
            'Three interconnected workbooks built with custom VBA, reading live from Sage.',
            'Automated handoffs: a label order marked Ready for Pickup creates the shipment in Logistics, and its status flows back.',
            'Status switches and alerts for quantity changes, holds, cancellations and reworks.',
            'Live Sage stock checks, with emails sent to the team automatically.'
          ] },
          { label: 'Result', text: 'Order progress is easy to see, so people no longer spend time hunting for where an order is. The multi-step handoffs are automated, and each department went from 10+ sheets to 2 at most.' }
        ]
      },
      {
        name: '📋 Custom reports for each department',
        video: '',
        sections: [
          { label: 'My role', text: 'Built the reports that each department puts together weekly or monthly.' },
          { label: 'Challenge', text: 'These reports took half a day to produce, because the systems are decentralized and users usually pull data for 100+ SKUs.' },
          { label: 'Solution', text: 'Custom automated reports pulling live data such as low stock and open POs.' },
          { label: 'Result', text: 'Half a day became under 2 minutes.' }
        ]
      }
    ]
  },

  /* -------------------------------------------------------------- Chocosol */
  {
    slug: 'chocosol',
    name: 'Chocosol',
    industry: 'CPG · Food & Chocolate',
    about: 'ChocoSol Traders is a Toronto-based artisanal bean-to-bar dark chocolate social enterprise and learning centre. Dare I say, it’s the best chocolate I have ever tasted!',
    link: { url: 'https://chocosoltraders.com/pages/ourstory', label: 'Read their story' },
    role: 'Process automation consultant.',
    managed: null,
    tools: ['Google Suite', 'Advanced Apps Script', 'Katana MRP', 'Shopify', 'Clover POS', 'Sparklayer', 'QBO', 'Zapier'],
    achievements: [
      'Automated 80% of inventory workflows, significantly reducing manual errors and giving easy visibility into demand and stock levels.',
      'Built real-time dashboards to track COGS, inventory performance and financial metrics, to evaluate ROI and guide operational decisions.'
    ],
    photos: [],
    projects: [
      {
        name: '🚀 Systems and workflows to scale 10x',
        status: 'In progress',
        video: '',
        sections: [
          { label: 'My role', text: 'Making sure the systems stay in sync and the processes are streamlined.' },
          { label: 'Challenge', text: 'Scaling to 10x current production with systems that don’t talk to each other.' },
          { label: 'Solution', text: 'Connecting the systems through custom APIs, starting with the wholesale department.' },
          { label: 'Result', text: 'In progress.' }
        ]
      },
      {
        name: '🔄 Inventory transfers: Katana + Shopify',
        video: '',
        sections: [
          { label: 'My role', text: 'Designed and built the workflow.' },
          { label: 'Challenge', text: 'The MRP subscription only allows two users. Every internal transfer across retail, wholesale and events had to go through one employee. That became a bottleneck and inventory numbers kept being off.' },
          { label: 'Solution', text: 'A custom Apps Script form hosted on the web, so any department can enter transfers. Each entry becomes a sales order in Katana MRP through the Zapier integration.' },
          { label: 'Result', text: 'The bottleneck is gone: data goes straight into Katana live without relying on one person, and inventory levels are accurate.' }
        ]
      },
      {
        name: '🧾 POS system update',
        status: 'In pipeline',
        video: '',
        sections: [
          { label: 'My role', text: 'Researching and moving to a new POS system to replace Clover.' },
          { label: 'Challenge', text: 'Clover doesn’t cover inventory, so overall inventory accuracy suffers.' },
          { label: 'Solution', text: 'Moving from Clover to a new POS (to be decided) that includes the inventory side.' },
          { label: 'Result', text: 'In the pipeline.' }
        ]
      },
      {
        name: '📊 KPI executive dashboard',
        video: '',
        sections: [
          { label: 'My role', text: 'Built a KPI dashboard that executive leadership can easily use to see orders, dollar value and other metrics.' },
          { label: 'Challenge', text: 'Sales data lived in separate places: Katana, Clover and internal spreadsheets. Clover’s sales breakdown is by category, not product, so extra calculations were needed.' },
          { label: 'Solution', text: 'An executive dashboard in Looker Studio connecting wholesale and online sales from Katana, retail sales from Clover and farmers market sales.' },
          { label: 'Result', text: 'COGS and revenue for the current and past years are laid out side by side, so leadership can compare and make decisions easily.' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------- Suppli */
  {
    slug: 'suppli',
    name: 'Suppli',
    industry: 'Circular supply chain · Tech',
    about: 'Suppli is a circular supply chain and technology platform based in Toronto that replaces single-use food packaging with a reusable container program.',
    link: null,
    role: [
      'First operations employee: scaled with the founders to 100+ restaurants and 50+ drop-off bins in 2+ years.',
      'Managed 3+ dishwashers, 3+ drivers, a 3rd-party warehouse and several driving platforms, and was the main contact for 100+ restaurant owners and staff on inventory.'
    ],
    managed: null,
    tools: ['HubSpot', 'Google Suite', 'Zoho Inventory', 'AWS', 'Redshift', 'Looker Studio', 'UberEats backend', 'Ritual', 'Clover', 'Toast', 'Square', 'Lightspeed', 'Shopify POS'],
    achievements: [
      'Scaled the reuse program to 100+ restaurants, 20+ corporate clients and 70+ return locations across multiple 3PL partners.',
      'Led analytics and KPI dashboards → 25% client growth.',
      'Built a custom inventory tool → 45% fewer stockouts.',
      'Automated workflows via API integration → 55% fewer ops hours.',
      'Built a catering order prediction model → 95% demand accuracy.',
      'Added product descriptions into restaurants’ POS systems.'
    ],
    photos: [],
    projects: [
      {
        name: 'Inventory Prediction Tool 📦',
        video: '',
        sections: [
          { label: 'My role', text: 'Built an order prediction tool to optimize container delivery for corporate catering clients.' },
          { label: 'Challenge', text: 'The catering partner didn’t send accurate daily order volumes, and restaurants were stuck with excess containers taking up storage.' },
          { label: 'Solution', text: 'A Google Sheets + Looker Studio tool that analyzed order trends and suggested exactly how many containers to ship each day.' },
          { label: 'Result', text: '95% demand accuracy, hours saved on guessing shipment quantities, and no more wasted storage space in restaurants.' }
        ]
      },
      {
        name: 'KPI Dashboard: Orders 📊',
        video: '',
        sections: [
          { label: 'My role', text: 'Designed a user-friendly dashboard to make sales and ops data accessible without SQL.' },
          { label: 'Challenge', text: 'Order data from several sales channels sat in AWS Redshift and only a few people could use it. Sales needed it to track restaurant growth and ops needed it to forecast, but neither knew SQL.' },
          { label: 'Solution', text: 'Worked with the tech team to connect Redshift to Looker Studio, then designed a clean dashboard of key metrics like order volume trends.' },
          { label: 'Result', text: 'Faster order fulfillment, fewer bottlenecks, hours saved on manual data pulls and clearer visuals for sales decisions.' }
        ]
      },
      {
        name: 'Lost Order Analytical Dashboard 📉',
        video: '',
        sections: [
          { label: 'My role', text: 'Built a dashboard to analyze container return behavior and reduce the loss rate.' },
          { label: 'Challenge', text: 'As orders grew, many first-time orders never came back as returns, and the return rate wasn’t being tracked.' },
          { label: 'Solution', text: 'Tracked the lost-to-return ratio, found the key drop-off points and shared them with sales. Updated UberEats descriptions to educate new customers and added “Return Me” stickers on containers.' },
          { label: 'Result', text: 'Container loss rate fell 32% from April to May 2024 and kept trending down, with better visibility for data-informed decisions.' }
        ]
      },
      {
        name: 'Client Order Analysis Dashboard 📈',
        video: '',
        sections: [
          { label: 'My role', text: 'Designed a dashboard for sales and onboarding to track restaurant rotation, client impact and ordering trends.' },
          { label: 'Challenge', text: 'There was no easy way to see client order patterns, restaurant rotation or sustainability impact.' },
          { label: 'Solution', text: 'Tracked order volume over time and client behavior, monitored how often each restaurant was scheduled per client to keep rotation fair, and added period-over-period comparison.' },
          { label: 'Result', text: 'Sales onboarded better-fitting restaurants, onboarding reported monthly plastic-waste impact to clients, and clients felt more engaged.' }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------- Future Foam */
  {
    slug: 'future-foam',
    name: 'Future Foam',
    industry: 'Manufacturing · Foam & Bedding',
    about: 'Future Foam is a polyurethane carpet pad and mattress foam manufacturer, supplying brands like Casper, Home Depot, Ashley Furniture, Tuft & Needle and many more.',
    link: null,
    role: [
      'Process Engineer, filling in wherever the plant needed it.',
      'Interim transportation manager during COVID.',
      'Managed 20+ people: floor workers, a production manager, a lead and a supervisor.'
    ],
    managed: '20+',
    tools: ['5S', 'Lean Six Sigma', 'OEE', 'Power BI', 'Microsoft Suite', 'ERP', 'Real-time freight tools'],
    achievements: [
      'Reduced material costs by 20% through supplier negotiations.',
      'Managed 20+ production staff and optimized schedules to maximize workforce efficiency and reduce excess labor costs.',
      'Became interim transportation manager during COVID.',
      'Oversaw daily production schedules and procurement to meet a 3-month demand forecast.',
      'Part of the safety team, and won a safety tag line competition whose line was placed across all company sites.'
    ],
    photos: [
      { src: '', alt: 'The winning safety tag line displayed at a Future Foam site', caption: 'My winning safety tag line, placed across all company sites' }
    ],
    projects: [
      {
        name: '🚚 Transportation optimization → $120K saved a year',
        video: '',
        sections: [
          { label: 'My role', text: 'Analyzed sales data, shipping routes and costs, and built a plan to ship trucks as full loads.' },
          { label: 'Challenge', text: 'Some customers’ order frequency and location kept us from filling trucks to capacity, but we were still charged for a full truckload.' },
          { label: 'Solution', text: 'Analyzed these clients’ order frequency and worked with sales to get them to order in the same week as big clients in nearby cities, offering a discount where needed. All of them came on board, some with a discount and some without.' },
          { label: 'Result', text: '$120K saved in logistics cost each year.' }
        ]
      },
      {
        name: '🖥️ ERP implementation + training',
        video: '',
        sections: [
          { label: 'My role', text: 'Subject Matter Expert (SME) who helped build the ERP and trained users in all departments.' },
          { label: 'Challenge', text: 'A new production UI had to fit operational needs and be adopted by users.' },
          { label: 'Solution', text: 'Led the implementation and training, and was SME throughout development, communicating user needs and nuances to the developers and the product manager.' },
          { label: 'Result', text: 'Improved adoption and data accuracy.' }
        ]
      },
      {
        name: '🔧 Reduced maintenance downtime',
        video: '',
        sections: [
          { label: 'My role', text: 'Ran an OEE study on the lamination machine to reduce bottlenecks.' },
          { label: 'Challenge', text: 'The lamination machine had become a bottleneck, with several breakdowns. The data was hard to narrow down because control panel readings lumped the time of multiple steps together.' },
          { label: 'Solution', text: [
            'Ran the OEE study and recorded every downtime and its cause.',
            'Worked with controls engineering to set up sensors that time each process step.',
            'Added the findings to a preventive maintenance checklist.'
          ] },
          { label: 'Result', text: 'Over 3 months: 16% less downtime, 28% higher yield and 47% higher efficiency.' }
        ]
      }
    ]
  },

  /* --------------------------------------------------------------- Digital Room */
  {
    slug: 'dri',
    name: 'DRI',
    industry: 'Printing',
    about: 'Digital Room Inc. is a printing company producing for Vistaprint, Costco and more.',
    link: null,
    role: 'Quality Control & Lean Six Sigma Specialist.',
    managed: null,
    tools: ['Microsoft Suite', 'Lean Six Sigma'],
    achievements: [
      'Collaborated with the pre-press, IT and QC departments to build tolerance margins for cutting into print jobs such as folders and envelopes. About 30% fewer reprints.',
      'Examined daily data to find the root causes of delayed shipments and ran PDCA cycles to streamline production.'
    ],
    photos: [],
    projects: []
  }
];
