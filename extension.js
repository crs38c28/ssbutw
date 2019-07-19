// import * as express from 'express'; // eslint-disable-line import/no-extraneous-dependencies

const axios = require('axios');

// const app = express();

module.exports = function api(nodecg) {
  nodecg.listenFor('challonge_api', (methods, ack) => {
    const setting = nodecg.readReplicant('setting', 'ssbutw');
    const apikey = setting.chkey;
    if (!apikey) {
      ack(null, {});
    }
    axios.get(`https://api.challonge.com/v1/${methods}.json?api_key=${apikey}`)
      .then((response) => {
        // handle success
        ack(null, response.data);
      })
      .catch((error) => {
        // handle error
        ack(null, {});
        console.log(error);
      });
  });

  const smashggAPI = 'https://api.smash.gg/gql/alpha';
  nodecg.listenFor('smashgg_phase', (eventSlug, ack) => {
    const setting = nodecg.readReplicant('setting', 'ssbutw');
    const apikey = setting.sggkey;
    axios.post(smashggAPI, {
      query: `
      query BracketsQuery($slug: String!) {
        event(slug: $slug) {
          id
          name
          phases {
            id
            name
            groupCount
            phaseGroups {
              nodes{
                id
                phaseId
                displayIdentifier
              }
            }
          }
        }
      }
      `,
      variables: {
        slug: eventSlug,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
    }).then((response) => {
      ack(null, response.data);
    }).catch((error) => {
      // handle error
      console.log(error);
    });
  });

  nodecg.listenFor('smashgg_players', (phaseGroupId, ack) => {
    const setting = nodecg.readReplicant('setting', 'ssbutw');
    const apikey = setting.sggkey;
    axios.post(smashggAPI, {
      query: `
      query phaseGroupsQuery($id: ID!) {
        phaseGroup(id: $id) {
          seeds(query:{
            perPage: 1000
          }) {
            nodes{
              players{
                prefix
                gamerTag
                twitterHandle
                country
              } 
            }
          }
        }
      }
      `,
      variables: {
        id: phaseGroupId,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
    }).then((response) => {
      ack(null, response.data);
    }).catch((error) => {
      // handle error
      console.log(error);
    });
  });
/**
  app.get(`/${nodecg.bundleName}/damage`, (req, res) => {
    const damageArr = nodecg.readReplicant('damage', 'ssbutw');
    damageArr.push({
      p1: req.query.p1 || 0,
      p2: req.query.p2 || 0,
    });
    res.sendStatus(200);
  });

  nodecg.mount(app); */
};
