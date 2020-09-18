import React, { Component } from 'react'
import Config from "./../config/app"

export default class NavBarDefault extends Component {
    constructor(props){
       super(props);
    } 
    render() {
    return (
        <nav className="navbar navbar-transparent navbar-absolute">
            <div className="container-fluid">
                <div className="navbar-minimize">
                </div>
                <div className="navbar-header" style={{ 'padding-top': '13px'}}>
                    <button type="button" className="navbar-toggle" data-toggle="collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <a className="navbar-brand" href="#"><h7>Dashboard</h7></a>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                        </li>
                        {this.props.userDropdown()}
                        <li className="separator hidden-lg hidden-md" />
                    </ul>
                    {this.props.search?<form className="navbar-form navbar-right" role="search" style={{ 'padding-top': '13px'}}>
                        <div className="form-group form-search is-empty">
                            <input type="text" onChange={this.props.onChange} className="search-query form-control" value={this.props.filter} placeholder="Search apps" />
                        <span className="material-input" />
                        </div>
                    </form>:<div></div>}
                    
                </div>
            </div>
        </nav>

        /*<nav className="navbar navCustom">
            <div className="container-fluid col-md-10 col-md-offset-1">
                <div className="col-md-3">
                    <div className="navbar-header navHeaderCustom">
                        <a className="navbar-brand" href="#">{this.props.title}</a>
                    </div>
                </div>
                <div className="col-md-6">
                    {this.props.search?<div id="custom-search-input">
                        <div className="input-group col-md-12">
                            <input type="text" onChange={this.props.onChange} className="search-query form-control searchInput" value={this.props.filter} placeholder="Search apps" />
                        </div>
                    </div>:<div></div>}
                </div>
                <div className="col-md-3">
                    <div className="collapse navbar-collapse" id="bs-slide-dropdown">
                        <ul className="nav navbar-nav navbar-right">
                            {this.props.userDropdown()}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>*/

    )
  }
}
