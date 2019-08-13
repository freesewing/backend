export default {
  users: [
    {
      email: 'test@freesewing.org',
      username: 'test_user',
      password: 'test',
      role: 'user',
      settings: {
        language: 'nl',
        units: 'imperial'
      },
      status: 'active'
    },
    {
      email: 'admin@freesewing.org',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      patron: 8,
      settings: {
        language: 'en',
        units: 'metric'
      },
      status: 'active'
    }
  ]
}
