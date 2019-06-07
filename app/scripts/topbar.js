// values that are sent with the request to the CCP login server
var ESI_response_type="response_type=code"
var ESI_redirect_uri="redirect_uri=http%3A%2F%2Fevemaps.dotlan.net%2F%23"
var ESI_client_id="client_id=14827206dd0e4c5d8060d35ef63b9eec"
var ESI_scope="scope=esi-location.read_location.v1%20esi-ui.write_waypoint.v1"
var ESI_query_string="?"+ESI_response_type+"&"+ESI_redirect_uri+"&"+ESI_client_id+"&"+ESI_scope
var ESI_login_url="https://login.eveonline.com/oauth/authorize"

// Vue data that, when modified, re-renders the content
var reactiveData = {
    topbarContainerAnimation: 'slideIn 1s ease-out 0.5s 1 forwards',
    topbarContainerAnimationModifier: 'slideIn 1s ease-out 0.5s 1 forwards',
    radarIconURL: 'x',
    characterPortrait: '',
    characterName: 'No character logged in',
    characterLocation: '',
    charLocationDisplay: 'none',
    notifierDisplay: 'none',
    notifierData: '',
    signInText: 'Sign in',
    signInLink: ESI_login_url+ESI_query_string,
    signInOnClick: '',
    trackingTriggerText: 'Stop Tracking',
    trackingTriggerFunction: ''
}

var backgroundColor = 'background: #D5DF3D';
var linkDark = '';

var styles = document.querySelector('head').querySelectorAll('link');
for (i in styles) {
  if (styles[i].href && (styles[i].href.includes('dark.css') || styles[i].href.includes('igb.css'))) {
    backgroundColor = 'background: #333';
    linkDark = 'Dark';
  }
}

/*
 * These are all the HTML elements of the top bar.
 * 
 * Sadly, since we are using content scripts in the extension, we can't use templates
 * We are forced to use render functions
 * 
 * Some styles that need to be reactive are set here, the rest are in topbar.css
 */
var vm = new Vue({
  data: reactiveData,
  render (createElement) {
    return createElement('div', {
      attrs: { 
        id: 'radarTopbarContainer' 
      },
      style: {
        animation: reactiveData.topbarContainerAnimation
      },
      on: {
        mouseover: () => {reactiveData.topbarContainerAnimation = 'none';},
        mouseout: () => {reactiveData.topbarContainerAnimation = reactiveData.topbarContainerAnimationModifier;}
      }
    }, [
      createElement('div', {
        attrs: {
          id: 'radarTopbar',
          style: backgroundColor
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
              createElement('span', ' '+reactiveData.characterName),
            ]),
            createElement('td', {
              attrs: {
                id: 'radarColumnCenter'
              },
              style: {
                display: reactiveData.notifierDisplay
              }
            }, [
              createElement('span', {
                attrs: {
                  id: 'radarNotifier'
                }
              }, ' '+reactiveData.notifierData+' '),
              createElement('a', {
                attrs: {
                  id: 'radarTrackingButton'+linkDark,
                  href: 'javascript:;'
                },
                on: {
                  click: reactiveData.trackingTriggerFunction
                }
              }, reactiveData.trackingTriggerText)
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
                  id: 'radarSignIn'+linkDark,
                  href: reactiveData.signInLink
                },
                on: {
                  click: reactiveData.signInOnClick
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
