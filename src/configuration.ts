/* eslint-disable prettier/prettier */
export default () => ({
    auth: {
        config: 'nxcke48aca.execute-api.us-east-1.amazonaws.com/dev/auth',
        poolName: 'FanSquad-user-pool',
        appClientId: '62m05f4rtadu53rtn7l604mavp',
        region: 'us-east-1'
    },
    nhl: {
        statsApi: 'https://statsapi.web.nhl.com/api/v1',
        imagesApi: 'https://cms.nhl.bamgrid.com/images',
        logosApi: 'https://records.nhl.com/site/api/franchise?include=teams.logos',
        logoApiV2: 'https://records.nhl.com/site/api/franchise',
        currentSeason: '20202021'
    },
    s3Bucket: {
        profilePictureBucketArn: 'arn:aws:s3:::fansquad-picture-bucket',
        profilePictureBucketName: 'fansquad-picture-bucket'
    },
    amazonSes: {
        sender: 'yanicklarouche@hotmail.com'
    }
});