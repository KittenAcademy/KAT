Authorize the app onto discord with:
[this link](https://discordapp.com/oauth2/authorize?client_id=222853207687299073&scope=bot&permissions=0x00032814)
Prep for AWS `rm *.zip || zip archive.zip * -0 -u -r -xnode_modules*`
Files are pulled from [drive](https://drive.google.com/drive/folders/0BwoBPbVKwbI9TUdFSG0yRjh5UTQ) and uploaded to [S3](http://console.aws.amazon.com/s3/buckets/kittenacademy): 
make sure you have a `src/privatesettings.ts` or that you store settings in your local environment

Watch the API limits https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=beaming-team-148423&duration=PT1H

Gif DB is here https://cloud.mongodb.com/v2/5f9455b95280e127aa2af9f9#metrics/replicaSet/5f94566c24f7423763f465f8/explorer/kat/gifs/find
Gif are stored here https://s3.console.aws.amazon.com/s3/buckets/kittenacademy/?region=us-west-2&tab=overview	
