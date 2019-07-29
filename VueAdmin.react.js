var React = require('react');

var Link = require('react-router').Link;

var PanelGroup = require('react-bootstrap').PanelGroup;
var Panel = require('react-bootstrap').Panel;
var Glyphicon = require('react-bootstrap').Glyphicon;

var BarreNavigation = require('./BarreNavigation.react');

var Settings = require('../utils/IceSettings');
var RoutingUtils = require('../utils/IceRoutingUtils');

var ModalViewDisplayer = require('./ModalViewDisplayer.react');
var DashBoardAffectations = require('./Affectations.react').DashBoardAffectations;
var DashBoardAffectationsTransverse = require('./Affectations.react').DashBoardAffectationsTransverse;
var TableEditeurs = require('./Membres.react').TableEditeurs;
var TableContributeurs = require('./Contrib.react').TableContributeurs;

var _ = require('underscore');

var VueAdmin = React.createClass({

  render: function() {
    var areaDim = Settings.AreaDim;
    return (
      <div>
        <BarreNavigation />
        <ModalViewDisplayer />
        {/*placeholder for NavBar */}
        <div style={{height:areaDim.navBarHeight}} />
        <div
          style={{overflowY:'auto', maxHeight:'calc( 100vh - '+(areaDim.navBarHeight+areaDim.statusBarHeight)+'px )', backgroundColor:"#f5f5f5"}}
        >
          <div style={{padding:15}} >

            <PanelGroup>
              <PanelGroup>
                <Panel
                  eventKey="oeuvres"
                  header={
                    <Link to={RoutingUtils.getRouteToOeuvresView()}><i style={{color: 'silver'}} className="fa fa-book"></i>{" Aller à l’écran d’édition de la bibliographie primaire"}</Link>
                  }
                />
              </PanelGroup>
              <Panel
                eventKey="etudes"
                header={
                  <Link to={RoutingUtils.getRouteToEtudesView()}><i style={{color: 'silver'}} className="fa fa-newspaper-o"></i>{" Aller à l’écran d’édition de la bibliographie secondaire"}</Link>
                }
              />
            </PanelGroup>
            {this.props.onlyBiblio
             ? null
             : [
              <PanelGroup accordion>
                <Panel header="Editeurs" eventKey="1">
                  <TableEditeurs />
                </Panel>
              </PanelGroup>,
							<PanelGroup accordion>
              	<Panel header="Contributeurs" eventKey="2">
                  <TableContributeurs />
                </Panel>
              </PanelGroup>,
              <PanelGroup defaultActiveKey="2" accordion>
                <Panel header="Récapitulatif affectations" eventKey="3">
                  <DashBoardAffectations />
                </Panel>
              </PanelGroup>,
              <PanelGroup accordion>
                <Panel header="Récapitulatif dossiers transversaux" eventKey="4">
                  <DashBoardAffectationsTransverse />
                </Panel>
              </PanelGroup>
              ]
            }
          </div>
      </div>
    </div>
    );
  },

});

var VueAdminBiblio = React.createClass({
  render: function() {
    return <VueAdmin onlyBiblio/>;
  },
});

module.exports = {
  VueAdmin: VueAdmin,
  VueAdminBiblio: VueAdminBiblio
};
