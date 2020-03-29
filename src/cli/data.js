import { withBreasts, withoutBreasts } from '@freesewing/models';

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
        measurements: true,
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
        measurements: true,
        openData: true
      },
      status: 'active'
    }
  ],
  people: [
    {
      handle: 'persa',
      picture: 'persa.svg',
      user: 'tuser',
      name: 'Example person - No breasts',
      breasts: false,
      units: 'metric',
      notes: 'This is an example person',
      measurements: withoutBreasts.size42
    },
    {
      handle: 'persb',
      picture: 'persb.svg',
      user: 'tuser',
      name: 'Example person - With breasts',
      breasts: true,
      units: 'metric',
      notes: 'This is an example person',
      measurements: withBreasts.size36
    },
  ],
  patterns: [
    {
      handle: "recip",
      name: "Example pattern",
      notes: "These are the pattern notes",
      data: {
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
        design: "aaron",
      },
      created: "2019-08-14T09:47:27.163Z",
      user: 'tuser',
      person:"persa"
    }
  ]
}
