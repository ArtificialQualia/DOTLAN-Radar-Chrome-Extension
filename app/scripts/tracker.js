
function GetCharacterID() {
  return axios({
    method: 'get',
    url: 'https://esi.tech.ccp.is/verify/?token='+token
  })
  .then( (response) => {
    characterID = response.data['CharacterID'];
    reactiveData.characterName = response.data['CharacterName'];
    reactiveData.charLocationDisplay = '';
    reactiveData.notifierDisplay = '';
    reactiveData.topbarContainerAnimation = 'none';
    reactiveData.notifierData = 'Tracking...';
    reactiveData.characterPortrait = 'https://image.eveonline.com/Character/'+characterID+'_32.jpg';
  })
  .catch( (error) => {
    console.log(error);
    //chrome.storage.local.remove('radarToken');
    //token = null;
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
    reactiveData.characterLocation = systemName+', '+region;
    if (location.href.split('#')[0] != 'http://evemaps.dotlan.net/map/'+region+'/'+systemName) {
      window.location.href = 'http://evemaps.dotlan.net/map/'+region+'/'+systemName
    }
  })
  .catch( error => {
    if (error == 'no update'){
      throw 'no update';
    }
    console.log(error);
    return localGet_Promise('radarToken')
    .then( (items) => {
      if (token != items['radarToken']) {
        token = (typeof items['radarToken'] == 'undefined') ? null : items['radarToken'];
        chrome.storage.local.get('radarRefreshToken', (items) => {refreshToken = items['radarRefreshToken'];});
        throw 'new token found';
      }
      localGet_Promise('radarRefreshToken')
      .then( (items) => {
        refreshToken = (typeof items['radarRefreshToken'] == 'undefined') ? null : items['radarRefreshToken'];
        return AttemptRefreshToken(refreshToken);
      })
    })
  })
  .catch( error => {
    if (error == 'no update' || error == 'new token found'){
      return Promise.resolve();
    }
    console.log(error);
    clearInterval(characterHeartbeat);
  });
}

function ExtractAuthCode(url) {
  if(url.indexOf('#?code=') > -1) {
    var code = url.split('#?code=')[1];
    return axios({
      method: 'post',
      url: 'https://login.eveonline.com/oauth/token',
      headers: {
        Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
      },
      data: 'grant_type=authorization_code&code='+code
    })
    .then( (response) => {
      token = response.data['access_token'];
      refreshToken = response.data['refresh_token'];
      chrome.storage.local.set({radarToken: token});
      chrome.storage.local.set({radarRefreshToken: refreshToken});
    })
    .catch( (error) => {
      console.log(error);
    })
  }
  else {
    return Promise.resolve();
  }
}

function AttemptRefreshToken(tokenArg) {
  return axios({
    method: 'post',
    url: 'https://login.eveonline.com/oauth/token',
    headers: {
      Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
    },
    data: 'grant_type=refresh_token&refresh_token='+tokenArg
  })
  .then( (response) => {
    token = response.data['access_token'];
    refreshToken = response.data['refresh_token'];
    chrome.storage.local.set({radarToken: token});
    chrome.storage.local.set({radarRefreshToken: refreshToken});
  })
  .catch( (error) => {
    console.log(error);
  })
}

function RevokeToken() {
  reactiveData.signInText = 'Sign in';
  reactiveData.signInLink = ESI_login_url+ESI_query_string;
}

var token = null;
var refreshToken = null;
var systemName = null;
var characterLocation = null;
var characterID = null;
var characterHeartbeat = null;

const localGet_Promise = key => new Promise(resolve => chrome.storage.local.get(key, resolve)); 

ExtractAuthCode(location.href)
.then( () => {
  return localGet_Promise('radarRefreshToken');
})
.then( (items) => {
  refreshToken = (typeof items['radarRefreshToken'] == 'undefined') ? null : items['radarRefreshToken'];
  if (refreshToken != null) {
    reactiveData.signInText = 'Sign Out';
    reactiveData.signInLink = 'RevokeToken();';
  }
  return localGet_Promise('radarToken');
})
.then( (items) => {
  token = (typeof items['radarToken'] == 'undefined') ? null : items['radarToken'];
  console.log('have token: '+token);
  if (token == null && refreshToken != null) {
    return AttemptRefreshToken(refreshToken);
  }
})
.then( () => {
  console.log('have token: '+token);
  if(token != null) {
    GetCharacterID().then( () => {
      console.log(characterID);
      characterHeartbeat = setInterval(FindCharacter, 1000);
    })
  }
});

