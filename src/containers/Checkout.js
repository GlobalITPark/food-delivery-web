import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from '../config/database';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            firstName: '',
            lastName: '',
            address: '',
            country: '',
            state: '',
            zip: '',
            total: 0,
            subtotal: 0,
            tax: 0,
        };
        this.checkout = this.checkout.bind(this);
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeLastName = this.handleChangeLastName.bind(this);
    }

    componentDidMount(){
        this.authListener();
    }

    authListener(){
        const _this=this;
        const setUser=(user)=>{
        this.setState({user:user})
        }

        //Now do the listner
        firebase.app.auth().onAuthStateChanged(function(user) {
            if (user) {
            setUser(user);
            // User is signed in.
            console.log("User has Logged  in Master");
            console.log(user);
            
            } else {
            // No user is signed in.
            console.log("User has logged out Master");
            }
        });   
    }

    handleChangeFirstName(event){
        this.setState({ firstName: event.target.value }); 
    }

    handleChangeLastName(event){
        this.setState({ lastName: event.target.value }); 
    }

    
    componentWillMount() {
        this.state.subtotal = this.props.cartItems.reduce((a, c) => a + c.price * c.count, 0);
        this.state.total = this.state.subtotal + this.state.tax;
    }

    checkout(event) {
        console.log( this.props.cartItems);
        console.log("users mail "+this.state.user.email);
        var _this =this;

        const orderRef = firebase.app.firestore().collection('orders').doc();
        orderRef.set({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address:this.state.address,
            items:this.props.cartItems,
            total: this.state.total,
            userID: this.state.user.uid,
        }).then(function(){
            const ref = firebase.app.firestore().collection("orders");
            ref.get()
            .then(snapshot=>{
            if(snapshot.empty){
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                console.log(doc);
                console.log(doc.data());
            });
            })
        }).catch(function(error){
            console.log(error.message);
        })
        event.preventDefault();
    }

    render() {
        const { cartItems } = this.props;
        return (
        <div className="row wrap-cart">
            <div className="col-md-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation order" onSubmit={this.checkout}>
                <div className="row"  style={{marginBottom: '20px'}}>
                    <div className="col-md-6">
                        <label>First name</label>
                        <input type="text" className="form-control" id="firstName" onChange={this.handleChangeFirstName} value={this.state.firstName} required/>
                        {/* <input type="text" className="form-control" id="firstName" placeholder="" value="ddd" required/> */}
                    </div>
                    <div className="col-md-6">
                        <label>Last name</label>
                        <input type="text" className="form-control" id="lastName" onChange={this.handleChangeLastName} value={this.state.lastName} required/>
                    </div>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label>Email <span className="text-muted">(Optional)</span></label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" value={this.state.address}/>
                </div>

                <div  style={{marginBottom: '20px'}}>
                    <label>Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" required/>
                </div>

                <div  style={{marginBottom: '20px'}}>
                    <label>Address 2 <span className="text-muted">(Optional)</span></label>
                    <input type="text" className="form-control" id="address2" placeholder="Apartment or suite"/>
                </div>

                <div className="row"  style={{marginBottom: '30px'}}>
                    <div className="col-md-5 mb-3">
                        <label>Country</label>
                        <select className="form-control" id="country" required>
                        <option value="">Choose...</option>
                        <option>Japan</option>
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label>State</label>
                        <select className="form-control" id="state" required>
                        <option value="">Choose...</option>
                        <option>Tokyo</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label>Zip</label>
                        <input type="text" className="form-control" id="zip" placeholder="" required/>
                    
                    </div>
                </div>
                <button className="btn btn-block continue" type="submit">Continue to checkout</button>
            </form>
            </div>
            <div className="col-md-4 order-md-2 mb-4">
                <h4 className="mb-3" style={{display: 'flex','justify-content': 'space-between'}}>
                    <span className="text-muted">Your cart</span>
                    <span className="text-muted">{ this.props.cartItems.length }</span>
                </h4>
                <ul className="list-group mb-3">
                    {cartItems.map((item) => (
                        <li className="list-group-item" key={item.key}>
                            <div>
                                <p>{item.title}</p>
                                <small className="text-muted">{item.description}</small>
                            </div>
                            <span className="text-muted">¥{item.price * item.count}</span>
                        </li>
                    ))}
                    <li className="list-group-item d-flex justify-content-between">
                        <span>Total (JPY)</span>
                        <strong>¥{ this.state.total }</strong>
                    </li>
                </ul>
            </div>
        </div>
        );
    } 
}

export default connect(
    (state) => ({
      cartItems: state.cart.cartItems,
    }),
    {}
)(Checkout);