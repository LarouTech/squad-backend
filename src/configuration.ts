/* eslint-disable prettier/prettier */
export default () => ({
    auth: {
        config: 'e4npmn9hkc.execute-api.us-east-1.amazonaws.com/dev/auth',
        poolName: 'Slango-user-pool',
        appClientId: '7ct383g33th1b4el7cah4v2ugd',
        region: 'us-east-1'
    },
    nhl: {
        statsApi: 'https://statsapi.web.nhl.com/api/v1',
        imagesApi: 'https://cms.nhl.bamgrid.com/images',
        logosApi: 'https://records.nhl.com/site/api/franchise?include=teams.logos',
        logoApiV2: 'https://records.nhl.com/site/api/franchise',
        currentSeason: '20202021'
    }
});