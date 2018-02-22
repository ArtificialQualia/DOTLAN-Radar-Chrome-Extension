var ESI_response_type="response_type=code"
var ESI_redirect_uri="redirect_uri=http%3A%2F%2Fevemaps.dotlan.net%2F%23"
var ESI_client_id="client_id=14827206dd0e4c5d8060d35ef63b9eec"
var ESI_scope="scope=esi-location.read_location.v1%20esi-ui.write_waypoint.v1"
var ESI_query_string="?"+ESI_response_type+"&"+ESI_redirect_uri+"&"+ESI_client_id+"&"+ESI_scope
var ESI_login_url="https://login.eveonline.com/oauth/authorize"

var reactiveData = {
    topbarContainerAnimation: 'slideIn 1s ease-out 0.5s 1 forwards',
    radarIconURL: 'x',
    characterPortrait: '',
    characterName: 'No character logged in',
    characterLocation: '',
    charLocationDisplay: 'none',
    notifierDisplay: 'none',
    notifierData: '',
    signInText: 'Sign in',
    signInLink: ESI_login_url+ESI_query_string
}

var vm = new Vue({
  data: reactiveData,
  render (createElement) {
    return createElement('div', {
      attrs: { 
        id: 'radarTopbarContainer' 
      },
      style: {
        animation: reactiveData.topbarContainerAnimation
      }
    }, [
      createElement('div', {
        attrs: {
          id: 'radarTopbar'
        }
      }, [
        createElement('table', {
          attrs: {
            id: 'radarTable'
          }
        }, [
          createElement('tr', [
            createElement('td', {
              attrs: {
                id: 'radarColumnLeft'
              }
            }, [
              createElement('img', {
                attrs: {
                  src: chrome.runtime.getURL('images/icon16.png'),
                  id: 'radarIcon'
                }
              }),
              createElement('img', {
                attrs: {
                  src: reactiveData.characterPortrait,
                  id: 'characterPortrait',
                  width: '16px',
                  height: '16px'
                }
              }),
              createElement('span', ' '+reactiveData.characterName+' '),
            ]),
            createElement('td', {
              attrs: {
                id: 'radarColumnCenter'
              }
            }, [
              createElement('span', {
                attrs: {
                  id: 'radarNotifier'
                },
                style: {
                  display: reactiveData.notifierDisplay
                }
              }, ' '+reactiveData.notifierData+' '),
            ]),
            createElement('td', {
              attrs: {
                id: 'radarColumnRight'
              }
            }, [
              createElement('span', {
                attrs: {
                  id: 'radarCharLocation'
                },
                style: {
                  display: reactiveData.charLocationDisplay
                }
              }, ' Current Location: '+reactiveData.characterLocation+' | '),
              createElement('a', {
                attrs: {
                  href: reactiveData.signInLink,
                  id: 'radarSignIn'
                }
              }, reactiveData.signInText)
            ])
          ])
        ])
      ])
    ])
  }
}).$mount();

document.body.appendChild(vm.$el);
