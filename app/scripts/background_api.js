
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery == "postAuthCode"){
      fetch('https://login.eveonline.com/v2/oauth/token', {
        method: 'post',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ=="),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'grant_type=authorization_code&code='+request.code
      })
      .then( (r) => r.json() )
      .then( (response) => {
        sendResponse(response);
      })
      .catch( (error) => {
        console.log(error);
      })
      return true;
    }
    else if (request.contentScriptQuery == "refreshToken"){
      fetch('https://login.eveonline.com/v2/oauth/token', {
        method: 'post',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ=="),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'grant_type=refresh_token&refresh_token='+request.tokenArg
      })
      .then( (r) => r.json() )
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
      fetch('https://login.eveonline.com/v2/oauth/revoke', {
        method: 'post',
        headers: {
          Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ=="),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'token_type_hint=access_token&token='+request.token
      })
      .catch( (error) => {
        console.log(error);
      })
      .then( (response) => {
        fetch('https://login.eveonline.com/v2/oauth/revoke', {
          method: 'post',
          headers: {
            Authorization: atob("QmFzaWMgTVRRNE1qY3lNRFprWkRCbE5HTTFaRGd3TmpCa016Vmxaall6WWpsbFpXTTZhekU0YmtKNU5uVmhhMHB5UjB0dlIxaENVRkoxY2paak4yNUlUMUp4TkdFelpVNTRZalZ0T0E9PQ=="),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: 'token_type_hint=refresh_token&token=='+request.refreshToken
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
