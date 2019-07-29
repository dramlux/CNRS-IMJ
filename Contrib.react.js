
var React = require('react');
var ReactDOM = require('react-dom');

var Link = require('react-router').Link;

var $ = require('jquery');
var _ = require('underscore');

var Glyphicon = require('react-bootstrap').Glyphicon;
var Table = require('react-bootstrap').Table;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var InputGroup = require('react-bootstrap').InputGroup;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;

var RoutingUtils= require('../utils/IceRoutingUtils');
var AssignmentStore = require('../stores/AssignmentStore');
var AssignmentActionCreators = require('../actions/AssignmentActionCreators');
var EntreeExLabel = require('./Labels.react').EntreeExLabel;

var ContributeursMenu = require('./Contrib.react').ContributeursMenu;

var LabelRoleNom = React.createClass({
  render: function () {
    var role = this.props.role==='review' ? 'relecteur' : 'contributeur';
    return (
      <span>
        <Glyphicon style={{color: '#96d5eb'}} glyph="user"/>
        <span style={{fontSize: 16}}>{" " + this.props.username}</span>
        <span >{", vous êtes "}</span>
        <i>{role}</i>
      </span>
    );
  },
});


var TableContributeurs = React.createClass({

  MandatoryItemNames : ['nomcomplet', 'nomusage', 'datenaissance', 'lieunaissance', 'datedeces', 'lieudeces', 'sourceetatcivil'],
  ItemNames : ['contribid', 'nomcomplet', 'nomusage', 'datenaissance', 'lieunaissance', 'datedeces', 'lieudeces', 'sourceetatcivil', 'responsableid'],
  itemValidity: {},

  getInitialState: function () {
    this.evalIndividualValids({});
    return {
      contributeurs : AssignmentStore.getEditorList(),
      editable : false
    };
  },

  render: function () {
    var warnOrange = <Glyphicon style={{color:'orange'}} glyph="exclamation-sign"/>;
    var warnRed = <Glyphicon style={{color:'red'}} glyph="warning-sign"/>;

    var selected = this.state.selected

    var contributorById = AssignmentStore.getContributorsMapById();

    var responsableName;
    if (selected && selected.responsableid) {
      var respInfo = contributorById[selected.responsableid];
      responsableName = <span>{respInfo.prenom + ' ' + respInfo.nom }</span>;
    } else {
      responsableName = this.state.editable ? <i style={{color:'grey'}}>choisir</i> : '';
    }
    var responsableComp =
      <div
        style={{display:'inline-block', verticalAlign: 'middle', minWidth:'20vw', maxWidth:'20vw', backgroundColor:'#f5f5f5', padding: 4, border: 'solid 1px silver', borderRadius: 4, minHeight:34}}
        >
        {responsableName}
      </div>
      ;
    if (this.state.editable) {
      responsableComp =
        <OverlayTrigger
          ref="responsableOverlayTrigger"
          rootClose
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="Contributeursmenu" style={{ minWidth:'20vw', maxWidth:'20vw' }}>
              <ContributeursMenu onSelected={this.handleManagerSelect}/>
            </Popover>
          }>
          {responsableComp}
        </OverlayTrigger>
    }


    return (
      <div>
        <Form
          ref="formContrib"
          inline>
          {this.state.editable
            ? null
            : <Glyphicon
                style={{color:'green'}}
                glyph="plus-sign"
                title="Ajouter un contributeur"
                onClick={this.handleAddContributeur}
              />
          }
          {' '}
          <FormGroup
            controlId="formInlineId">
            <FormControl
              type="text"
              placeholder="contribid"
              disabled={true}
              value={selected ? selected.contribid : null}
            />
          </FormGroup>
          {' '}
          {/*nomcomplet */}
          <FormGroup
            controlId="formInlineNomcomplet"
            validationState={this.itemValidity.nomcomplet ? "success" : "error"}
            >
            <FormControl
              type="text"
              placeholder="nomcomplet"
              disabled={!this.state.editable}
              value={selected ? selected.nomcomplet : null}
              onChange={this.onValueChanged.bind(this, 'nomcomplet')}
            />
          </FormGroup>
           {/*nomusage */}
          {' '}
          <FormGroup
            controlId="formInlineNomusage"
            validationState={this.itemValidity.nomusage ? "success" : "error"}
            >
            <FormControl
              type="text"
              placeholder="nomusage"
              disabled={!this.state.editable}
              value={selected ? selected.nomusage : null}
              onChange={this.onValueChanged.bind(this, 'nomusage')}
            />
          </FormGroup>
          {/*datenaissance */}
          {' '}
          <FormGroup
            controlId="formInlineDate"
            validationState={this.itemValidity.datenaissance ? "success" : "error"}
            >
            <FormControl
              type="date"
              placeholder="datenaissance"
              disabled={!this.state.editable}
              value={selected ? selected.datenaissance : null}
              onChange={this.onValueChanged.bind(this, 'datenaissance')}
            />
          </FormGroup>
          {/*lieunaissance */}
          {' '}
          <FormGroup
            controlId="formInlineLieunaissance"
            validationState={this.itemValidity.fonctions ? "success" : "warning"}
            >
            <FormControl
              type="text"
              placeholder="Lieunaissance"
              disabled={!this.state.editable}
              value={selected ? selected.lieunaissance : null}
              onChange={this.onValueChanged.bind(this, 'lieunaissance')}
            />
          </FormGroup>
          {/*datedeces */}
          {' '}
          <FormGroup
            controlId="formInlineDate"
            validationState={this.itemValidity.datedeces ? "success" : "warning"}
            >
            <FormControl
              type="date"
              placeholder="Datedeces"
              disabled={!this.state.editable}
              value={selected ? selected.datedeces : null}
              onChange={this.onValueChanged.bind(this, 'datedeces')}
            />
          </FormGroup>
          {/*lieudeces */}
          {' '}
          <FormGroup
            controlId="formInlineLieudeces"
            validationState={this.itemValidity.lieudeces ? "success" : "warning"}
            >
            <FormControl
              type="text"
              placeholder="lieudeces"
              disabled={!this.state.editable}
              value={selected ? selected.lieudeces : null}
              onChange={this.onValueChanged.bind(this, 'lieudeces')}
            />
          </FormGroup>
          {/*sourceetatcivil*/}
          {' '}
          <FormGroup
            controlId="formInlineSourceetatcivil"
            validationState={this.itemValidity.sourceetatcivil ? "success" : "warning"}
            >
            <FormControl
              type="text"
              placeholder="Sourceetatcivil"
              disabled={!this.state.editable}
              value={selected ? selected.sourceetatcivil : null}
              onChange={this.onValueChanged.bind(this, 'sourceetatcivil')}
            />
          </FormGroup>

          {' '}
          {this.state.editable
            ? <Button
                onClick={this.saveChanges}
                disabled={!this.state.globalValid}
                bsStyle="primary"
                >Sauver</Button>
            : null
          }
          {' '}
          {this.state.editable
            ? <Button onClick={this.cancelChanges}>Annuler</Button>
            : null
          }
        </Form>
        <br />

        <Table striped bordered condensed hover>
          <colgroup>
            <col style={{width:'11%'}} />
            <col style={{width:'13%'}} />
            <col style={{width:'9%'}} />
            <col style={{width:'13%'}} />
            <col style={{width:'9%'}} />
            <col style={{width:'13%'}} />
            <col style={{width:'13%'}} />
            <col style={{width:'13%'}} />
          </colgroup>

          <thead>
            <tr>
              <td>contrib</td>
              <td>nomcomplet</td>
              <td>nomusage</td>
              <td>datenaissance</td>
              <td>lieunaissance</td>
              <td>datedeces</td>
              <td>lieudeces</td>
              <td>sourceetatcivil</td>
            </tr>
          </thead>
          <tbody>
            {this.state.contributeurs.map(
              function(contrib, index) {
                var responsableName;
                if (contrib.responsableid) {
                  var respInfo = contributorById[contrib.responsableid];
                  responsableName = respInfo.nomusage + ' ' + respInfo.complet;
                }

                return (
                  <tr key={index} onClick={this.handleClickContrib}>
                    <td>
                      {this.state.editable
                        ? null
                        : <Glyphicon
                            style={{color:'darkgrey'}}
                            glyph="pencil"
                            onClick={this.handleChangeContrib}
                          />
                      }
                      {' '}
                      {contrib.contribid}</td>
                    <td>{contrib.nomcomplet ? contrib.nomcomplet : warnRed}</td>
                    <td>{contrib.nomusage ? contrib.nomusage : warnRed}</td>
                    <td>{contrib.datenaissance ? contrib.datenaissance : warnRed}</td>
                    <td>{contrib.lieunaissance ? contrib.lieunaissance : warnOrange}</td>
                    <td>{contrib.datedeces ? contrib.datedeces : warnRed}</td>
                    <td>{contrib.lieudeces ? contrib.lieudeces : warnOrange}</td>
                    <td>{contrib.sourceetatcivil ? contrib.sourceetatcivil : warnOrange}</td>
                    <td>{responsableName}</td>
                    
                  </tr>
                );
              }, this)
            }
          </tbody>
        </Table>
      </div>
    );
  },

  handleManagerSelect: function(contribinfo) {
    this.refs.responsableOverlayTrigger.hide();
    this.itemValidity.responsableid = contribinfo!=null;
    this.setState({selected: _.extend({}, this.state.selected, {responsableid: contribinfo.contribid} ), globalValid: this.evalGlobalValid()});
  },

  onValueChanged: function(itemName, event) {
    var newValue = {};
    newValue[itemName] = event.target.value;
    this.itemValidity[itemName] = event.target.value.trim().length>0;
    this.setState({selected: _.extend({}, this.state.selected, newValue ), globalValid: this.evalGlobalValid()});
  },

  saveChanges : function() {
    var contribInfo = JSON.stringify(this.state.selected);
    var contribid = this.state.selected.contribid;
    if (contribid) {
      AssignmentActionCreators.updateContributor(contribid, contribInfo);
    } else {
      AssignmentActionCreators.add(contribInfo);
    }
    this.setState({editable:false, selected: null});
  },
  cancelChanges : function() {
    this.setState({editable:false, selected: null});
  },

  evalGlobalValid: function() {
    return _.reduce(this.MandatoryItemNames, function(acc, itemName){ return acc && (this.itemValidity[itemName]===true); }.bind(this), true);
  },

  evalIndividualValids: function(selected) {
    _.each(this.ItemNames, function(itemName) {
      this.itemValidity[itemName]= selected && selected[itemName] && selected[itemName].trim().length>0;
    }, this);
  },

  handleAddContrib : function() {
    var selected = {contribid:'',nomcomplet:'',nomusage:'',datenaissance:'',lieunaissance:'',datedeces:'',lieudeces:'',sourceetatcivil:''};
    this.evalIndividualValids(selected);
    this.setState({editable:true, selected: selected, globalValid: this.evalGlobalValid()});
  },

  handleChangeContrib : function() {
    if (!this.state.editable) {
      ReactDOM.findDOMNode(this.refs.formContrib).scrollIntoView();
      this.setState({editable:true});
    }
  },

  handleClickContrib: function(event) {
    if (!this.state.editable) {
      var index = event.currentTarget.rowIndex;
      if (index) {
        var selected = this.state.contributeurs[index-1];
        this.evalIndividualValids(selected);
        this.setState({selected: selected, globalValid: this.evalGlobalValid()})
      }
    }
  },

  componentDidMount: function() {
    AssignmentStore.addContributorListChangeListener(this._onContributorListChange);
  },


  componentWillUnmount: function() {
    AssignmentStore.removeAllAssignmentChangeListener(this._onContributorListChange);

  },

  _onContributorListChange: function(contributeurs) {
    this.setState({contributeurs: contributeurs});
  },
});


var FilteredContribTable= React.createClass({
  getInitialState: function () {
    return _.extend({},
      this.getContributorsListFromStore()
    );
  },

  render: function () {
    return (
      <table style={{width: "100%"}} className="ice_texteedition ice_tabContrib">
        <tbody>
        {this.state.filtercontributors.map( function(contributorInfo) {
          return (
              <tr
                key={contribInfo.contribid}
                onClick={this.handleClickContrib}
                data-contribid={contributorInfo.contribid}
                >
                <td>{contributorInfo.nomcomplet}</td>
                <td>{contributorInfo.nomusage}</td>
              </tr>
        );
        }, this)}
      </tbody>
      </table>
    );
  },

  applyContribFilter: function(filter) {
    //might be executed after unmounting because of debouncing
    if (!this.filteringCanceled) {
      var filtered;
      if (filter) {
        var lcfilter = filter.toLowerCase();
        filtered = _.filter(this.state.sourcecontributors,
          function(contributorInfo) {
            return (contributorInfo.nomcomplet.toLowerCase().indexOf(lcfilter) > -1)
                  || (contributorInfo.nomusage.toLowerCase().indexOf(lcfilter) > -1)
                  || (contributorInfo.contribid.toLowerCase().indexOf(lcfilter) > -1);
          });
      } else {
        filtered = this.state.sourcecontributors;
      }
      this.setState({filteredcontributors:filtered});
    }
  },

  handleClickContrib: function(event) {
    if (this.props.onSelected) {
      var index = event.currentTarget.rowIndex;
      var contribinfo = this.state.filteredcontributors[index];
      this.props.onSelected(contribinfo);
    }
  },

  componentDidMount: function() {
    AssignmentStore.addContributorListChangeListener(this._onContributorListChange);
    this.filteringCanceled =false;
    this.debouncedContribFilter = _.debounce(this.applyContribFilter, 350);
    this.applyContribFilter(this.props.filter);
  },

  componentWillReceiveProps: function(newProps) {
    this.debouncedContribFilter(newProps.filter);
  },

  componentWillUnmount: function() {
    this.filteringCanceled=true;
    AssignmentStore.removeContributorListChangeListener(this._onContributorListChange);
  },

  _onContributorListChange: function(contributeur) {
    this.setState(this.getContributorsListFromStore());
    this.applyContribFilter(this.props.filter);
  },

  getContributorsListFromStore : function() {
    var contributeurs = AssignmentStore.getEditorList();
    var sorted = _.sortBy(_.values(contributeurs), "nomusage");
    return {sourcecontributors:sorted, filteredcontributors:sorted};
  }

});

var ContributeursMenu = React.createClass({
  getInitialState: function () {
    return {filter:''};
  },

  render: function () {
    return (
      <div>
        <InputGroup
          style={{width:'100%'}}
          >
          <FormControl
            type="text"
            ref='queryInput'
            placeholder='filtre contributeurs'
            onChange={this.applyContribFilter}
          />
        </InputGroup>

        <div style={{height: "auto", maxHeight: "260px", overflowX: "hidden", overflowY: "auto"}}>
          <FilteredContribTable filter={this.state.filter} onSelected={this.onContribSelected}/>
        </div>
      </div>
    );
  },

  applyContribFilter: function(event) {
    var filter = event.target.value.trim();
    this.setState({filter:filter});
  },

  onContribSelected: function(contribid) {
    if (this.props.onSelected) {
      this.props.onSelected(contribid);
    }
  },

  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.queryInput).focus();
  },

  componentDidUpdate : function() {
    ReactDOM.findDOMNode(this.refs.queryInput).focus();
  },

});


module.exports = {
  LabelRoleNom: LabelRoleNom,
  TableContributeurs: TableContributeurs,
  ContributeursMenu: ContributeursMenu,
};
