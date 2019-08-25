export default {
  users: [
    {
      email: 'test@freesewing.org',
      username: 'test_user',
      handle: 'tuser',
      password: 'test',
      role: 'user',
      settings: {
        language: 'nl',
        units: 'imperial'
      },
      consent: {
        profile: true,
        model: true,
        openData: true
      },
      status: 'active'
    },
    {
      email: 'admin@freesewing.org',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      handle: 'admin',
      social: {
        github: 'freesewing-bot',
        twitter: 'freesewing_org',
        instagram: 'freesewing_org',
      },
      patron: 8,
      settings: {
        language: 'en',
        units: 'metric'
      },
      consent: {
        profile: true,
        model: true,
        openData: true
      },
      status: 'active'
    }
  ],
  models: [
    {
      handle: 'modela',
      picture: 'modela.svg',
      user: 'tuser',
      name: 'Example model - No breasts',
      breasts: false,
      units: 'metric',
      notes: 'This is an example model',
      measurements: {
        bicepsCircumference: 335,
        bustSpan: null,
        centerBackNeckToWaist: 520,
        chestCircumference: 1080,
        headCircumference: 590,
        highBust: null,
        highPointShoulderToBust: null,
        hipsCircumference: 990,
        hipsToUpperLeg: 220,
        inseam: 910,
        kneeCircumference: 420,
        naturalWaist: 925,
        naturalWaistToFloor: 1310,
        naturalWaistToHip: 145,
        naturalWaistToKnee: null,
        naturalWaistToSeat: 280,
        naturalWaistToUnderbust: null,
        neckCircumference: 420,
        seatCircumference: 1080,
        seatDepth: 200,
        shoulderSlope: 55,
        shoulderToElbow: 410,
        shoulderToShoulder: 465,
        shoulderToWrist: 680,
        underbust: null,
        upperLegCircumference: 630,
        wristCircumference: 190,
      }
    },
    {
      handle: 'modelb',
      picture: 'modelb.svg',
      user: 'tuser',
      name: 'Example model - With breasts',
      breasts: true,
      units: 'metric',
      notes: 'This is an example model',
      measurements: {
        bicepsCircumference: 270,
        bustSpan: 170,
        centerBackNeckToWaist: 390,
        chestCircumference: 920,
        headCircumference: null,
        highBust: 850,
        highPointShoulderToBust: 285,
        hipsCircumference: 880,
        hipsToUpperLeg: null,
        inseam: null,
        kneeCircumference: null,
        naturalWaist: 700,
        naturalWaistToFloor: 1060,
        naturalWaistToHip: 130,
        naturalWaistToKnee: null,
        naturalWaistToSeat: 230,
        naturalWaistToUnderbust: 80,
        neckCircumference: 360,
        seatCircumference: 950,
        seatDepth: null,
        shoulderSlope: 40,
        shoulderToElbow: 340,
        shoulderToShoulder: 420,
        shoulderToWrist: 580,
        underbust: 870,
        upperLegCircumference: null,
        wristCircumference: 170
      }
    },
  ],
  recipes: [
    {
      handle: "recip",
      name: "Example recipe",
      notes: "These are the recipe notes",
      recipe: {
        settings: {
          sa: 10,
          complete: true,
          paperless: false,
          units: "imperial",
          measurements: {
            bicepsCircumference: 335,
            centerBackNeckToWaist: 520,
            chestCircumference: 1080,
            naturalWaistToHip: 145,
            neckCircumference: 420,
            shoulderSlope:  55,
            shoulderToShoulder: 465,
            hipsCircumference: 990
          }
        },
        pattern: "aaron",
        model:"modela"
      },
      created: "2019-08-14T09:47:27.163Z",
      user: 'tuser'
    }
  ]
}
