
function GetCharacterID() {
  return axios({
    method: 'get',
    url: 'https://esi.tech.ccp.is/verify/?token='+token
  })
  .then( (response) => {
    characterID = response.data['CharacterID'];
  })
  .catch( (error) => {
    chrome.storage.local.remove('radarToken');
  })
}

function FindCharacter() {
  axios({
    method: 'get',
    url: 'https://esi.tech.ccp.is/latest/characters/'+characterID+'/location/?token='+token
  })
  .then( (response) => {
    if (characterLocation == response.data['solar_system_id']) {throw 'no update';}
    characterLocation = response.data['solar_system_id'];
    return axios({
      method: 'get',
      url: 'https://esi.tech.ccp.is/latest/universe/systems/'+response.data['solar_system_id']+'/'
    })
  })
  .then( (response) => {
    systemName = response.data['name'].replace(/ /gi, '_');
    return axios({
      method: 'get',
      url: 'https://esi.tech.ccp.is/latest/universe/constellations/'+response.data['constellation_id']+'/'
    })
  })
  .then( (response) => {
    return axios({
      method: 'get',
      url: 'https://esi.tech.ccp.is/latest/universe/regions/'+response.data['region_id']+'/'
    })
  })
  .then( (response) => {
    var region = response.data['name'].replace(/ /gi, '_');
    console.log('New Character location: '+region+' '+systemName);
    if (location.href.split('#')[0] != 'http://evemaps.dotlan.net/map/'+region+'/'+systemName) {
      window.location.href = 'http://evemaps.dotlan.net/map/'+region+'/'+systemName
    }
  })
  .catch( error => console.log(error) )
}

var ESI_response_type="response_type=token"
var ESI_redirect_uri="redirect_uri=http%3A%2F%2Fevemaps.dotlan.net%2F"
var ESI_client_id="client_id=14827206dd0e4c5d8060d35ef63b9eec"
var ESI_scope="scope=esi-location.read_location.v1%20esi-ui.write_waypoint.v1"
var ESI_query_string="?"+ESI_response_type+"&"+ESI_redirect_uri+"&"+ESI_client_id+"&"+ESI_scope
var ESI_login_url="https://login.eveonline.com/oauth/authorize"

var topbar = new Vue({
  render (createElement) {
    return createElement('div', [
      'some shit about your character ',
      createElement('a', {
        attrs: {
          href: ESI_login_url+ESI_query_string
        }
      }, 'sign on')
    ])
  }
}).$mount();

document.body.appendChild(topbar.$el);

var token = null;
var systemName = null;
var characterLocation = null;
var characterID = null;

chrome.storage.local.get('radarToken', (items) => {
  token = (typeof items['radarToken'] == 'undefined') ? null : items['radarToken'];
  console.log('have token: '+token);
  if(token != null) {
    GetCharacterID().then( () => {
      console.log(characterID)
      setInterval(FindCharacter, 1000);
    })
  }
});

var url = location.href;
console.log('url: '+url);

if(token == null || true) {
  if(url.indexOf('access_token') > -1) {
    var result = url.split('#')[1].split('&');
    token = result[0].split('=')[1];
    token_type = result[1].split('=')[1];
    expires = result[2].split('=')[1];
    chrome.storage.local.set({radarToken: token});
    console.log('token saved.')
  }
}