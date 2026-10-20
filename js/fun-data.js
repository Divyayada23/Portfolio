/* bulb positions on the 640x360 art grid: [x, y, radius, "r,g,b"] */
window.FUN_BULBS = [[323.5, 5.0, 4.2, "152,228,79"], [451.0, 8.0, 4.0, "95,205,228"], [139.0, 9.0, 4.0, "251,242,54"], [268.0, 13.0, 4.0, "217,87,99"], [153.0, 19.0, 4.0, "90,111,224"], [334.0, 19.0, 4.0, "94,204,227"], [442.0, 19.0, 4.0, "250,241,54"], [171.0, 27.0, 4.0, "153,229,80"], [251.0, 27.0, 4.0, "99,155,255"], [189.0, 32.0, 4.0, "217,87,99"], [427.0, 32.0, 4.0, "217,87,99"], [352.0, 35.0, 4.0, "217,87,99"], [209.0, 36.0, 4.0, "249,241,53"], [230.0, 36.0, 4.0, "153,229,80"], [412.0, 37.0, 4.0, "95,205,228"], [374.0, 39.0, 4.0, "251,242,54"], [392.0, 40.0, 4.0, "152,228,79"], [545.0, 83.0, 4.0, "255,115,62"], [535.5, 89.0, 4.2, "255,37,193"], [46.0, 93.0, 4.0, "255,115,62"], [522.0, 98.0, 4.0, "79,182,255"], [509.5, 104.0, 4.2, "112,251,82"], [52.0, 106.0, 4.0, "37,254,71"], [494.0, 111.0, 4.0, "80,98,255"], [446.0, 116.0, 4.0, "78,95,255"], [457.5, 116.5, 4.5, "243,251,57"], [469.0, 116.0, 4.0, "255,116,62"], [60.0, 117.0, 4.0, "80,97,255"], [67.0, 126.0, 4.0, "254,37,194"], [76.0, 135.5, 4.2, "74,182,255"], [86.0, 143.5, 4.2, "237,254,38"], [95.0, 148.5, 4.2, "255,102,58"], [105.0, 153.5, 4.2, "69,253,75"], [156.0, 156.0, 4.0, "255,108,60"], [119.0, 160.0, 4.0, "255,37,194"], [134.5, 164.0, 4.2, "79,97,255"], [146.0, 164.0, 4.0, "236,252,44"]];


/* Fun projects & prototypes (the board in the night-party scene).
   Same format as the company projects in js/jobs-data.js:
     name, status (chip), tools (chips), sections [{label, text}], video (YouTube link),
     screenshots [{src, alt}].
   game: 'swish' adds a Play button that opens the game page (#fun/swish). */
window.FUN_PROJECTS = [
  {
    name: '\uD83D\uDE8C HPSC Bus Voucher',
    tools: ['Google Apps Script', 'GitHub Pages', 'QR codes'],
    video: '',
    sections: [
      { label: 'Problem', text: 'Bus vouchers were printed and mailed to every member, which is tedious. One of the High Park Ski Club directors wanted to change the system.' },
      { label: 'Solution', text: [
        'Vouchers are emailed to members as QR codes, and members show them to the bus captain.',
        'The captain scans the code on a simple web page that shows the member\u2019s name and email for double-checking.',
        'Each scan stamps the used date in the backend. Scanning again says \u201Calready scanned\u201D, so there are no duplicates.'
      ] }
    ]
  },
  {
    name: '\uD83E\uDDFE Vendor Invoice Portal + Reader',
    tools: ['Google Apps Script', 'Google Sheets & Drive', 'Gemini API'],
    video: '',
    sections: [
      { label: 'Problem', text: 'Vendors delivered invoices with the order as a packing slip. Getting them to accounting was slow and delayed the month-end close.' },
      { label: 'Solution', text: [
        'A portal where vendors upload their own invoices.',
        'Files save automatically into a folder for each vendor, and a new vendor gets a new folder.',
        'Google Gemini reads each invoice and pulls out the invoice date, invoice number, net total and tax amount for the accounting team.',
        'An email goes to the right department with an easy Approve or Reject.'
      ] }
    ]
  },
  {
    /* No card: clicking this ball opens the game page directly. */
    name: '\uD83C\uDFC0 Swish Signs',
    note: 'Made as a daily affirmation for myself',
    tools: ['HTML canvas', 'JavaScript'],
    video: '',
    game: 'swish',
    direct: true
  }
];

/* Labels only (no balls): pos = [x, y] of the centre of each label on the 1920 x 1080 stage, in the order of FUN_PROJECTS. */
window.FUN_BALL = {"pos": [[720, 400], [960, 580], [1010, 400]]};
