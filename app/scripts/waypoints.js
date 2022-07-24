/*
 * Uses ESI to add a new waypoint to EVE client, then changes URL to include the waypoint
 */
function addWaypoint(location, asDestination) {
  axios({
    method: 'post',
    url: 'https://esi.evetech.net/latest/universe/ids/?language=en',
    data: '["' + location + '"]'
  },
  )
  .then( (response) => {
    return axios({
      method: 'post',
      url: 'https://esi.evetech.net/latest/ui/autopilot/waypoint/?language=en&add_to_beginning=false&clear_other_waypoints='+asDestination+'&destination_id='+response.data['systems'][0]['id']+'&token='+token
    })
  })
  .then( () => {
    if (radarTrackingEnabled){
      var waypointString = '';
      if (asDestination) {
        waypointString = ':'+location.replace(/ /gi, '_');
      }
      else {
        if (window.location.pathname.split('#')[0].indexOf(':') != -1) {
          waypointString = window.location.pathname.split('#')[0].substr(window.location.pathname.split('#')[0].indexOf(':'));
        }
        waypointString += ':'+location.replace(/ /gi, '_');
      }
      if (systemName == waypointString.split(':')[1]) {
        if (waypointString.substr(1).indexOf(':') == -1) {
          waypointString = '';
        }
        else {
          waypointString = waypointString.substr(waypointString.substr(1).indexOf(':') + 1);
        }
      }
      var hash = window.location.hash;
      window.location.assign('http://evemaps.dotlan.net/map/'+region+'/'+systemName+waypointString+'?tracking'+hash);
    }
  })
  .catch( (error) => {
    console.log(error);
  })
}

/*
 * Removes waypoint from DOTLAN map, note that there is no way at this time to remove it from EVE client
 */
function removeWaypoint(location) {
  var waypointString = '';
  var waypointArray = window.location.pathname.split(':');
  var i = 1;
  for (; i < waypointArray.length; i++) {
    if (location != waypointArray[i]) {
      waypointString += ':'+waypointArray[i];
    }
  }
  var hash = window.location.hash;
  window.location.assign('http://evemaps.dotlan.net/map/'+region+'/'+systemName+waypointString+'?tracking'+hash);
}

/*
 * This adds the menu option to DOTLAN's rightclick menu
 * We don't use Vue here becuase there isn't really any benefit and would just make it messier as we don't have reactive data
 */
function addRadarMenuOptions(menu) {
  var clickRedirectArray = document.getElementById('dot-contextmenu5').childNodes[0].childNodes[0].getAttribute('href').split('/');
  var clickLocation = clickRedirectArray[clickRedirectArray.length - 1];
  axios({
    method: 'get',
    url: 'https://esi.evetech.net/latest/universe/systems/'+clickLocation+'/?language=en'
  }) 
  .then( (response) => {
    clickLocation = response.data['name'];
    
    var waypointArray = window.location.pathname.split(':');
    var i = 1;
    for (; i < waypointArray.length; i++) {
      if (waypointArray[i] == clickLocation) {
        var menuRemoveLine = document.createElement('div');
        menuRemoveLine.setAttribute('class', 'sep');
        menuRemoveLine.innerHTML = '&nbsp;';
        var menuRemoveSeperator = document.createElement('li');
        menuRemoveSeperator.setAttribute('class', 'ui-menu-item');
        menuRemoveSeperator.appendChild(menuRemoveLine);
        
        var menuItemRemoveText = document.createTextNode('Remove waypoint from DOTLAN');
        var menuItemRemoveLink = document.createElement('a');
        var menuItemRemove = document.createElement('li');
        menuItemRemoveLink.setAttribute('class', 'dot-menuicon ui-corner-all');
        menuItemRemoveLink.setAttribute('href', 'javascript:;');
        menuItemRemoveLink.onmouseover = () => {menuItemRemoveLink.setAttribute('class', 'dot-menuicon ui-corner-all ui-state-hover')};
        menuItemRemoveLink.onmouseout = () => {menuItemRemoveLink.setAttribute('class', 'dot-menuicon ui-corner-all')};
        const removeOnClick = () => removeWaypoint(clickLocation);
        menuItemRemoveLink.onclick = removeOnClick;
        menuItemRemoveLink.appendChild(menuItemRemoveText);
        menuItemRemove.setAttribute('class', 'ui-menu-item');
        menuItemRemove.setAttribute('role', 'menuitem');
        menuItemRemove.appendChild(menuItemRemoveLink);
        
        menu.insertBefore(menuRemoveSeperator, menu.childNodes[0]);
        menu.insertBefore(menuItemRemove, menu.childNodes[0]);
      }
    }
    
    clickLocation = clickLocation.replace(/_/gi, ' ');
    
    var menuLine = document.createElement('div');
    menuLine.setAttribute('class', 'sep');
    menuLine.innerHTML = '&nbsp;';
    var menuSeperator = document.createElement('li');
    menuSeperator.setAttribute('class', 'ui-menu-item');
    menuSeperator.appendChild(menuLine);
    
    var menuItemWaypointIcon = document.createElement('span');
    menuItemWaypointIcon.setAttribute('class', 'icon icon_arrow_right');
    var menuItemWaypointText = document.createTextNode('Add Waypoint');
    var menuItemWaypointLink = document.createElement('a');
    var menuItemWaypoint = document.createElement('li');
    menuItemWaypointLink.setAttribute('class', 'dot-menuicon ui-corner-all');
    menuItemWaypointLink.setAttribute('href', 'javascript:;');
    menuItemWaypointLink.onmouseover = () => {menuItemWaypointLink.setAttribute('class', 'dot-menuicon ui-corner-all ui-state-hover')};
    menuItemWaypointLink.onmouseout = () => {menuItemWaypointLink.setAttribute('class', 'dot-menuicon ui-corner-all')};
    const waypointOnClick = () => addWaypoint(clickLocation, false);
    menuItemWaypointLink.onclick = waypointOnClick;
    menuItemWaypointLink.appendChild(menuItemWaypointIcon);
    menuItemWaypointLink.appendChild(menuItemWaypointText);
    menuItemWaypoint.setAttribute('class', 'ui-menu-item');
    menuItemWaypoint.setAttribute('role', 'menuitem');
    menuItemWaypoint.appendChild(menuItemWaypointLink);
    
    var menuItemDestinationtIcon = document.createElement('span');
    menuItemDestinationtIcon.setAttribute('class', 'icon icon_arrow_right');
    var menuItemDestinationText = document.createTextNode('Set Destination');
    var menuItemDestinationLink = document.createElement('a');
    var menuItemDestination = document.createElement('li');
    menuItemDestinationLink.setAttribute('class', 'dot-menuicon ui-corner-all');
    menuItemDestinationLink.setAttribute('href', 'javascript:;');
    menuItemDestinationLink.onmouseover = () => {menuItemDestinationLink.setAttribute('class', 'dot-menuicon ui-corner-all ui-state-hover')};
    menuItemDestinationLink.onmouseout = () => {menuItemDestinationLink.setAttribute('class', 'dot-menuicon ui-corner-all')};
    const destinationOnClick = () => addWaypoint(clickLocation, true);
    menuItemDestinationLink.onclick = destinationOnClick;
    menuItemDestinationLink.appendChild(menuItemDestinationtIcon);
    menuItemDestinationLink.appendChild(menuItemDestinationText);
    menuItemDestination.setAttribute('class', 'ui-menu-item');
    menuItemDestination.setAttribute('role', 'menuitem');
    menuItemDestination.appendChild(menuItemDestinationLink);
    
    menu.insertBefore(menuSeperator, menu.childNodes[0]);
    menu.insertBefore(menuItemWaypoint, menu.childNodes[0]);
    menu.insertBefore(menuItemDestination, menu.childNodes[0]);
  })
}

/*
 * This function gets called on every DOM update
 * We use it to add the menu options when needed
 */
function handleMutation(records) {
  if (refreshToken == null){
    return;
  }
  for (record in records) {
    if (typeof records[record].addedNodes[0] != 'undefined' &&
        records[record].addedNodes[0].id == 'dot-contextmenu'){
      addRadarMenuOptions(records[record].addedNodes[0]);
    }
  }
}

new MutationObserver(handleMutation).observe(document.documentElement, {childList: true, attributes: true, subtree: true});