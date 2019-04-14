
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery == "postAuthCode"){
      axios({
        method: 'post',
        url: 'https://login.eveonline.com/oauth/token',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
        },
        data: 'grant_type=authorization_code&code='+request.code
      })
      .then( (response) => {
        sendResponse(response);
      })
      .catch( (error) => {
        console.log(error);
      })
      return true;
    }
    else if (request.contentScriptQuery == "refreshToken"){
      axios({
        method: 'post',
        url: 'https://login.eveonline.com/oauth/token',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
        },
        data: 'grant_type=refresh_token&refresh_token='+request.tokenArg
      })
      .then( (response) => {
        sendResponse(response);
      })
      .catch( (error) => {
        console.log(error);
        sendResponse(false);
      })
      return true;
    }
    else if (request.contentScriptQuery == "revokeToken") {
      axios({
        method: 'post',
        url: 'https://login.eveonline.com/oauth/revoke',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
        },
        data: 'token_type_hint=access_token&token='+request.token
      })
      .catch( (error) => {
        console.log(error);
      })
      .then( (response) => {
        axios({
          method: 'post',
          url: 'https://login.eveonline.com/oauth/revoke',
          headers: {
            Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ==")
          },
          data: 'token_type_hint=refresh_token&token=='+request.refreshToken
        })
        .catch( (error) => {
          console.log(error);
        })
        .then( (response) => {
          sendResponse(true);
        });
      });
      return true;
    }
  });
